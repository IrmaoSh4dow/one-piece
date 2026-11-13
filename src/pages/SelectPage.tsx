import { Anchor, ChevronLeft, Compass, Gem, ScrollText } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../components/Button.tsx'
import { Motif } from '../components/Motif.tsx'
import { categories, difficulties } from '../data/meta.ts'
import { riddlesFor } from '../data/catalog.ts'
import type { Category, Difficulty } from '../types.ts'
import { readRecords, recordKey } from '../utils/storage.ts'

interface SelectPageProps {
  initialCategory: Category | null
  onBack: () => void
  onStart: (category: Category, difficulty: Difficulty) => void
}

export function SelectPage({ initialCategory, onBack, onStart }: SelectPageProps) {
  const [category, setCategory] = useState<Category | null>(initialCategory)
  const records = readRecords()

  return (
    <section className="screen select-screen">
      <header className="page-head">
        <button type="button" className="text-link" onClick={onBack}>
          <ChevronLeft size={18} aria-hidden="true" />
          Portada
        </button>
        <p className="eyebrow">
          <Compass size={16} aria-hidden="true" />
          Elige el rumbo
        </p>
        <h1>Dos mares, cuatro vientos.</h1>
        <p className="deck">
          No hace falta recorrerlos en orden. Elige una categoría y, después, la dificultad que te apetezca.
        </p>
      </header>

      <div className="category-grid">
        {categories.map((item) => {
          const active = category === item.id
          const Icon = item.id === 'characters' ? Anchor : Gem
          return (
            <button
              key={item.id}
              type="button"
              className={`choice-card ${active ? 'is-active' : ''}`}
              onClick={() => setCategory(item.id)}
              aria-pressed={active}
            >
              <Motif
                category={item.id}
                seed={item.id}
                variant={item.id === 'characters' ? 0 : 2}
              />
              <div>
                <p className="card-kicker">
                  <Icon size={15} aria-hidden="true" />
                  {item.id === 'characters' ? 'Tripulación y rivales' : 'Reliquias del mar'}
                </p>
                <h2>{item.title}</h2>
                <p>{item.summary}</p>
              </div>
            </button>
          )
        })}
      </div>

      {category && (
        <div className="difficulty-block">
          <div className="block-title">
            <ScrollText size={18} aria-hidden="true" />
            <h2>Dificultad</h2>
          </div>
          <div className="difficulty-grid">
            {difficulties.map((level) => {
              const count = riddlesFor(category, level.id).length
              const saved = records[recordKey(category, level.id)]
              return (
                <article key={level.id} className={`difficulty tone-${level.id}`}>
                  <p className="epithet">{level.epithet}</p>
                  <h3>{level.label}</h3>
                  <p>{level.summary}</p>
                  {level.caution && <p className="caution">{level.caution}</p>}
                  <p className="meta-line">
                    {count} acertijos
                    {saved ? ` · mejor marca ${saved.score}` : ''}
                  </p>
                  <Button type="button" onClick={() => onStart(category, level.id)}>
                    Zarpar
                  </Button>
                </article>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}
