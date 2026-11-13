import type { ScoreRecord } from '../types.ts'

export interface SavedScore {
  improved: boolean
  saved: boolean
}

export function recordKey(category: string, difficulty: string): string {
  return `${category}:${difficulty}`
}

interface ScoreFile {
  records: Record<string, ScoreRecord>
  sessions: unknown[]
}

export async function readRecords(): Promise<Record<string, ScoreRecord>> {
  try {
    const response = await fetch('/api/scores')
    if (!response.ok) return {}
    const data = (await response.json()) as ScoreFile
    return data.records ?? {}
  } catch {
    return {}
  }
}

export async function rememberRecord(
  category: string,
  difficulty: string,
  entry: ScoreRecord,
): Promise<SavedScore> {
  try {
    const response = await fetch('/api/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, difficulty, ...entry }),
    })
    if (!response.ok) return { improved: false, saved: false }
    const data = (await response.json()) as { improved?: boolean }
    return { improved: Boolean(data.improved), saved: true }
  } catch {
    return { improved: false, saved: false }
  }
}
