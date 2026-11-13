import type { ScoreRecord } from '../types.ts'

const STORAGE_KEY = 'nuestra-aventura-records'

function emptyRecords(): Record<string, ScoreRecord> {
  return {}
}

export function recordKey(category: string, difficulty: string): string {
  return `${category}:${difficulty}`
}

export function readRecords(): Record<string, ScoreRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyRecords()
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return emptyRecords()
    return parsed as Record<string, ScoreRecord>
  } catch {
    return emptyRecords()
  }
}

export function rememberRecord(
  category: string,
  difficulty: string,
  entry: ScoreRecord,
): boolean {
  const all = readRecords()
  const key = recordKey(category, difficulty)
  const previous = all[key]
  const improved = previous ? entry.score > previous.score : entry.score > 0
  if (!previous || entry.score > previous.score) {
    all[key] = entry
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
    } catch {
      return false
    }
  }
  return improved
}
