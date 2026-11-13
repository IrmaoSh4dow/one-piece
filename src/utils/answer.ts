import type { Riddle } from '../types.ts'

const POINTS_BY_CLUE = [0, 100, 80, 60, 40, 20]

export function normalizeAnswer(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[‘’'`´]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^(el|la|los|las|the|un|una)\s+/, '')
}

export function isCorrect(
  input: string,
  riddle: Pick<Riddle, 'answer' | 'aliases'>,
): boolean {
  const guess = normalizeAnswer(input)
  if (!guess) return false
  const accepted = new Set(
    [riddle.answer, ...riddle.aliases].map((entry) => normalizeAnswer(entry)),
  )
  return accepted.has(guess)
}

export function pointsForRevealedClues(revealed: number): number {
  if (revealed <= 1) return 100
  if (revealed === 2) return 80
  if (revealed === 3) return 60
  if (revealed === 4) return 40
  return POINTS_BY_CLUE[5] ?? 20
}
