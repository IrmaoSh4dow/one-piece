import type { Category, Difficulty } from '../types.ts'

export interface CategoryInfo {
  id: Category
  title: string
  summary: string
}

export interface DifficultyInfo {
  id: Difficulty
  label: string
  epithet: string
  summary: string
  caution?: string
}

export const categories: CategoryInfo[] = [
  {
    id: 'characters',
    title: 'Personajes',
    summary:
      'Capitanes, marines, emperadores y nombres que el mundo intentó olvidar. Cada pista acerca un rostro.',
  },
  {
    id: 'objects',
    title: 'Objetos',
    summary:
      'Frutas, espadas, barcos, piedras y reliquias. El Grand Line también se cuenta con lo que se empuña.',
  },
]

export const difficulties: DifficultyInfo[] = [
  {
    id: 'easy',
    label: 'Fácil',
    epithet: 'Brisa costera',
    summary:
      'Personajes y objetos reconocibles. Las pistas orientan con calma, sin exigir un archivo mental.',
  },
  {
    id: 'medium',
    label: 'Intermedio',
    epithet: 'Corriente del Grand Line',
    summary:
      'Aliados, rivales y elementos que movieron la historia. Conviene haber mirado con atención.',
  },
  {
    id: 'hard',
    label: 'Difícil',
    epithet: 'Tormenta del Nuevo Mundo',
    summary:
      'Habilidades concretas, acontecimientos y lazos que no caben en un resumen.',
    caution: 'Puede contener revelaciones importantes.',
  },
  {
    id: 'expert',
    label: 'Experto',
    epithet: 'Abismo de Laugh Tale',
    summary:
      'Lore fino: el siglo vacío, armas ancestrales, misterios y detalles que solo un fan experimentado sostiene.',
    caution: 'Contiene spoilers graves de la historia.',
  },
]

export const praiseLines = [
  '¡Lo sabía! Mi chica conoce muy bien el Grand Line. ❤️',
  'Has dado en el blanco. Me encanta verte tan segura en este mar. ❤️',
  'Esa respuesta merece un brindis en cubierta. ❤️',
  'Si este mundo tuviera un faro, se parecería a cómo lo recuerdas. ❤️',
]

export function praiseFor(id: string): string {
  let hash = 0
  for (const char of id) hash += char.charCodeAt(0)
  return praiseLines[hash % praiseLines.length] ?? praiseLines[0]
}

export function closingNote(percent: number): string {
  if (percent >= 100) {
    return 'Has cruzado este rumbo sin perder una isla. Estoy orgulloso de ti.'
  }
  if (percent >= 80) {
    return 'Casi puedo oír la risa de Roger desde aquí. Qué bien conoces este mundo.'
  }
  if (percent >= 50) {
    return 'Buen rumbo. Algunas islas se resistieron, y aun así no soltaste el timón.'
  }
  return 'El Grand Line no se entrega a la primera. Me gusta verte intentarlo con esa calma.'
}

export function difficultyById(id: Difficulty): DifficultyInfo {
  const found = difficulties.find((item) => item.id === id)
  if (!found) throw new Error(`Dificultad desconocida: ${id}`)
  return found
}

export function categoryById(id: Category): CategoryInfo {
  const found = categories.find((item) => item.id === id)
  if (!found) throw new Error(`Categoría desconocida: ${id}`)
  return found
}
