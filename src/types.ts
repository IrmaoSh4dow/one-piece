export type Category = 'characters' | 'objects'

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert'

export type Screen = 'cover' | 'select' | 'game' | 'result'

export type Outcome = 'correct' | 'surrender'

export interface Riddle {
  id: string
  answer: string
  aliases: string[]
  category: Category
  difficulty: Difficulty
  clues: string[]
  description: string
  why: string
}

export interface RoundLog {
  id: string
  answer: string
  points: number
  clues: number
  outcome: Outcome
}

export interface Session {
  category: Category
  difficulty: Difficulty
  queue: Riddle[]
  index: number
  score: number
  correctCount: number
  log: RoundLog[]
}

export interface ScoreRecord {
  score: number
  percent: number
  correct: number
  total: number
}
