import { Compass } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '../components/Button.tsx'

const openingLines = [
  'Antes de empezar, quería que leyeras esto.',
  'No hay tesoro que me guste más que la cara que pones cuando algo te hace feliz.',
  'Así que te traje un mar entero, solo para ver esa cara otra vez.',
]

interface CoverPageProps {
  onStart: () => void
}

export function CoverPage({ onStart }: CoverPageProps) {
  const [step, setStep] = useState(0)
  const ready = step >= openingLines.length

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setStep(openingLines.length)
      return
    }
    if (ready) return
    const timer = window.setTimeout(() => setStep((current) => current + 1), 2800)
    return () => window.clearTimeout(timer)
  }, [ready, step])

  if (!ready) {
    const line = openingLines[step] ?? openingLines[0]
    return (
      <section className="screen cover-screen prelude" aria-live="polite">
        <p className="prelude-kicker">Para ti</p>
        <p key={step} className="prelude-line">
          {line}
        </p>
        <button type="button" className="text-link prelude-skip" onClick={() => setStep(openingLines.length)}>
          Seguir
        </button>
      </section>
    )
  }

  return (
    <section className="screen cover-screen">
      <article className="parchment cover-card">
        <p className="eyebrow">
          <Compass size={16} aria-hidden="true" />
          Grand Line
        </p>
        <div className="ornament" aria-hidden="true">
          <span />
          <i />
          <span />
        </div>
        <h1>Sé que te gusta One Piece y que te hace feliz, y a mí me hace feliz verte feliz.</h1>
        <p className="lede">
          Así que preparé una pequeña aventura para ti. ¿Te atreves a descubrir cuánto sabes?
        </p>
        <Button type="button" onClick={onStart}>
          Comenzar aventura
        </Button>
        <p className="signoff">Un mapa preparado con calma, para ti.</p>
      </article>
    </section>
  )
}
