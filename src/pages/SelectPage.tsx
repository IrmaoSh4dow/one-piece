import { Anchor, ChevronLeft, Compass, Gem, ScrollText } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '../components/Button.tsx'
import { Motif } from '../components/Motif.tsx'
import { categories, categoryById, difficulties } from '../data/meta.ts'
import { riddlesFor } from '../data/catalog.ts'
import type { Category, Difficulty, ScoreRecord } from '../types.ts'
import { readRecords, recordKey } from '../utils/storage.ts'

interface SelectPageProps {
  initialCategory: Category | null
  onBack: () => void
  onStart: (category: Category, difficulty: Difficulty) => void
}

export function SelectPage({ initialCategory, onBack, onStart }: SelectPageProps) {
  const [category, setCategory] = useState<Category | null>(initialCategory)
  const [records, setRecords] = useState<Record<string, ScoreRecord>>({})

  useEffect(() => {
    let active = true
    void readRecords().then((next) => {
      if (active) setRecords(next)
    })
    return () => {
      active = false
    }
  }, [])

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
              className={`choice-card route-${item.id} ${active ? 'is-active' : ''} ${category && !active ? 'is-idle' : ''}`}
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
                  {active && <span className="choice-badge">Elegido</span>}
                </p>
                <h2>{item.title}</h2>
                <p>{item.summary}</p>
              </div>
            </button>
          )
        })}
      </div>

      {category && (
        <div key={category} className={`difficulty-block route-${category}`}>
          <div className="block-title">
            <ScrollText size={18} aria-hidden="true" />
            <div>
              <p className="route-kicker">Rumbo elegido</p>
              <h2>{categoryById(category).title}</h2>
            </div>
          </div>
          <p className="route-note">Elige la dificultad de {categoryById(category).title.toLowerCase()}.</p>
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
