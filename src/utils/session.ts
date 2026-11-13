import type { Category, Difficulty, RoundLog, Session } from '../types.ts'
import { riddlesFor } from '../data/catalog.ts'

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1))
    const current = copy[index]
    copy[index] = copy[swap] as T
    copy[swap] = current as T
  }
  return copy
}

export function createSession(category: Category, difficulty: Difficulty): Session {
  return {
    category,
    difficulty,
    queue: shuffle(riddlesFor(category, difficulty)),
    index: 0,
    score: 0,
    correctCount: 0,
    log: [],
  }
}

export function applyResult(session: Session, round: RoundLog): Session {
  return {
    ...session,
    score: session.score + round.points,
    correctCount: session.correctCount + (round.outcome === 'correct' ? 1 : 0),
    log: [...session.log, round],
  }
}

export function percentOf(correct: number, total: number): number {
  if (total <= 0) return 0
  return Math.round((correct / total) * 100)
}
