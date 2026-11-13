import type { Category } from '../types.ts'

interface MotifProps {
  category: Category
  seed: string
  variant?: number
}

function hashOf(seed: string): number {
  let hash = 0
  for (const char of seed) hash += char.charCodeAt(0)
  return hash
}

export function motifFor(category: Category, seed: string): number {
  const hash = hashOf(seed)
  if (category === 'characters') return hash % 2 === 0 ? 0 : 1
  return 2 + (hash % 2)
}

export function Motif({ category, seed, variant }: MotifProps) {
  const chosen = variant ?? motifFor(category, seed)
  return (
    <div className={`medallion tone-${category}`} aria-hidden="true">
      <svg viewBox="0 0 160 160">
        <circle cx="80" cy="80" r="70" className="medallion-ring" />
        <circle cx="80" cy="80" r="56" className="medallion-inner" />
        {chosen === 0 && <CrestMark />}
        {chosen === 1 && <BladeMark />}
        {chosen === 2 && <FruitMark />}
        {chosen === 3 && <ShipMark />}
      </svg>
    </div>
  )
}

function CrestMark() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <circle cx="80" cy="62" r="14" />
      <path d="M52 112 C56 90, 66 82, 80 82 C94 82, 104 90, 108 112" />
    </g>
  )
}

function BladeMark() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M96 42 L116 62" />
      <path d="M48 118 L102 56" />
      <path d="M42 112 L58 128" />
      <path d="M56 98 L70 112" />
    </g>
  )
}

function FruitMark() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M80 52 C58 52, 46 74, 50 96 C54 116, 106 116, 110 96 C114 74, 102 52, 80 52 Z" />
      <path d="M80 52 C84 40, 98 36, 108 44" />
      <path d="M86 48 C96 40, 108 46, 104 58" />
      <path d="M70 78 C80 86, 92 86, 100 76" />
    </g>
  )
}

function ShipMark() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M36 108 H124" />
      <path d="M48 108 C56 92, 104 92, 112 108" />
      <path d="M80 104 V48" />
      <path d="M80 52 L114 82 H80" />
      <path d="M80 66 L50 90 H80" />
    </g>
  )
}
