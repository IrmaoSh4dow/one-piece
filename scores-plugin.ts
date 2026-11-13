import fs from 'node:fs'
import path from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Connect, Plugin } from 'vite'

const scoresPath = path.resolve('data/scores.json')

interface ScoreRecord {
  score: number
  percent: number
  correct: number
  total: number
}

interface SavedSession extends ScoreRecord {
  category: string
  difficulty: string
  at: string
}

interface ScoreFile {
  records: Record<string, ScoreRecord>
  sessions: SavedSession[]
}

function emptyFile(): ScoreFile {
  return { records: {}, sessions: [] }
}

function readFile(): ScoreFile {
  try {
    const raw = fs.readFileSync(scoresPath, 'utf8')
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return emptyFile()
    const record = parsed as Partial<ScoreFile>
    return {
      records: record.records && typeof record.records === 'object' ? record.records : {},
      sessions: Array.isArray(record.sessions) ? record.sessions : [],
    }
  } catch {
    return emptyFile()
  }
}

function writeFile(data: ScoreFile): void {
  fs.mkdirSync(path.dirname(scoresPath), { recursive: true })
  fs.writeFileSync(scoresPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}

function readBody(request: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    request.on('data', (chunk: Buffer) => chunks.push(chunk))
    request.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    request.on('error', reject)
  })
}

function isSession(value: unknown): value is Omit<SavedSession, 'at'> {
  if (!value || typeof value !== 'object') return false
  const entry = value as Partial<SavedSession>
  return (
    typeof entry.category === 'string' &&
    typeof entry.difficulty === 'string' &&
    typeof entry.score === 'number' &&
    typeof entry.percent === 'number' &&
    typeof entry.correct === 'number' &&
    typeof entry.total === 'number'
  )
}

async function handle(request: IncomingMessage, response: ServerResponse): Promise<void> {
  if (request.method === 'GET') {
    response.setHeader('Content-Type', 'application/json')
    response.end(JSON.stringify(readFile()))
    return
  }

  if (request.method === 'POST') {
    const payload: unknown = JSON.parse(await readBody(request))
    if (!isSession(payload)) {
      response.statusCode = 400
      response.end('Puntuación inválida')
      return
    }
    const data = readFile()
    const saved: SavedSession = { ...payload, at: new Date().toISOString() }
    data.sessions.push(saved)
    const key = `${saved.category}:${saved.difficulty}`
    const previous = data.records[key]
    const improved = previous ? saved.score > previous.score : saved.score > 0
    if (!previous || saved.score > previous.score) {
      data.records[key] = {
        score: saved.score,
        percent: saved.percent,
        correct: saved.correct,
        total: saved.total,
      }
    }
    writeFile(data)
    response.setHeader('Content-Type', 'application/json')
    response.end(JSON.stringify({ improved }))
    return
  }

  response.statusCode = 405
  response.end()
}

function attach(middlewares: Connect.Server): void {
  middlewares.use('/api/scores', (request, response) => {
    void handle(request as IncomingMessage, response as ServerResponse).catch(() => {
      response.statusCode = 500
      response.end()
    })
  })
}

export function scoresFilePlugin(): Plugin {
  return {
    name: 'scores-file',
    configureServer(server) {
      attach(server.middlewares)
    },
    configurePreviewServer(server) {
      attach(server.middlewares)
    },
  }
}
