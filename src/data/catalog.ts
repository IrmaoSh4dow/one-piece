import type { Category, Difficulty, Riddle } from '../types.ts'
import { characters } from './characters.ts'
import { objects } from './objects.ts'

export const allRiddles: Riddle[] = [...characters, ...objects]

function assertCatalog(riddles: Riddle[]): void {
  const ids = new Set<string>()
  const buckets = new Map<string, number>()

  for (const riddle of riddles) {
    if (ids.has(riddle.id)) {
      throw new Error(`Acertijo repetido: ${riddle.id}`)
    }
    ids.add(riddle.id)
    if (riddle.clues.length < 3 || riddle.clues.length > 5) {
      throw new Error(`Pistas fuera de rango: ${riddle.id}`)
    }
    if (!riddle.answer.trim() || !riddle.description.trim() || !riddle.why.trim()) {
      throw new Error(`Texto incompleto: ${riddle.id}`)
    }
    const key = `${riddle.category}:${riddle.difficulty}`
    buckets.set(key, (buckets.get(key) ?? 0) + 1)
  }

  const categories: Category[] = ['characters', 'objects']
  const levels: Difficulty[] = ['easy', 'medium', 'hard', 'expert']
  for (const category of categories) {
    for (const level of levels) {
      const count = buckets.get(`${category}:${level}`) ?? 0
      if (count < 4) {
        throw new Error(`Faltan acertijos en ${category}/${level}`)
      }
    }
  }
}

assertCatalog(allRiddles)

export function riddlesFor(category: Category, difficulty: Difficulty): Riddle[] {
  return allRiddles.filter(
    (riddle) => riddle.category === category && riddle.difficulty === difficulty,
  )
}
