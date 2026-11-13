import { Compass } from 'lucide-react'
import { Button } from '../components/Button.tsx'
import { categoryById, closingNote, difficultyById } from '../data/meta.ts'
import type { Session } from '../types.ts'
import { percentOf } from '../utils/session.ts'

interface ResultPageProps {
  session: Session
  isNewRecord: boolean
  onReplay: () => void
  onMenu: () => void
  onCover: () => void
}

export function ResultPage({ session, isNewRecord, onReplay, onMenu, onCover }: ResultPageProps) {
  const total = session.queue.length
  const percent = percentOf(session.correctCount, total)
  const level = difficultyById(session.difficulty)
  const group = categoryById(session.category)

  return (
    <section className="screen result-screen">
      <article className="parchment result-card">
        <p className="eyebrow">
          <Compass size={16} aria-hidden="true" />
          Fin de la travesía
        </p>
        <div className="celebration" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
          <i />
        </div>
        <h1>Bitácora cerrada</h1>
        <p className="deck">
          {group.title} · {level.label} · {level.epithet}
        </p>
        <div className="result-stats">
          <div>
            <span>Puntuación</span>
            <strong>{session.score}</strong>
          </div>
          <div>
            <span>Aciertos</span>
            <strong>
              {session.correctCount}/{total}
            </strong>
          </div>
          <div>
            <span>Porcentaje</span>
            <strong>{percent}%</strong>
          </div>
        </div>
        {isNewRecord && <p className="record">Nueva mejor marca de este rumbo.</p>}
        <p className="closing-note">{closingNote(percent)}</p>
        <blockquote>
          No importa cuántos misterios del Grand Line descubras, mi aventura favorita siempre será la que vivo contigo. ❤️
        </blockquote>
        <ol className="log">
          {session.log.map((round, roundIndex) => (
            <li key={round.id}>
              <span>
                {roundIndex + 1}. {round.answer}
              </span>
              <em>{round.outcome === 'correct' ? `${round.points} pts` : 'Rendición'}</em>
            </li>
          ))}
        </ol>
        <div className="result-actions">
          <Button type="button" onClick={onReplay}>
            Volver a jugar
          </Button>
          <Button type="button" variant="ghost" onClick={onMenu}>
            Elegir otro rumbo
          </Button>
          <button type="button" className="text-link center-link" onClick={onCover}>
            Volver a la portada
          </button>
        </div>
      </article>
    </section>
  )
}
