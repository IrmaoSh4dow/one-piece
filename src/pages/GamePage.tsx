import { Eye, Flag, RotateCcw, ChevronLeft } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '../components/Button.tsx'
import { Motif } from '../components/Motif.tsx'
import { categoryById, difficultyById, praiseFor } from '../data/meta.ts'
import type { Category, Difficulty, Outcome, Riddle } from '../types.ts'
import { isCorrect, pointsForRevealedClues } from '../utils/answer.ts'

interface GamePageProps {
  riddle: Riddle
  index: number
  total: number
  score: number
  correctCount: number
  category: Category
  difficulty: Difficulty
  onSolved: (result: { points: number; clues: number; outcome: Outcome }) => void
  onContinue: () => void
  onMenu: () => void
  onRestart: () => void
}

type Phase = 'play' | 'wrong' | 'correct' | 'surrender'
type Dialog = 'menu' | 'restart' | null

export function GamePage({
  riddle,
  index,
  total,
  score,
  correctCount,
  category,
  difficulty,
  onSolved,
  onContinue,
  onMenu,
  onRestart,
}: GamePageProps) {
  const [revealed, setRevealed] = useState(1)
  const [draft, setDraft] = useState('')
  const [phase, setPhase] = useState<Phase>('play')
  const [notice, setNotice] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [earned, setEarned] = useState(0)
  const [dialog, setDialog] = useState<Dialog>(null)
  const locked = useRef(false)
  const continueRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const cardRef = useRef<HTMLElement>(null)
  const level = difficultyById(difficulty)
  const group = categoryById(category)
  const cluesLeft = riddle.clues.length - revealed

  useEffect(() => {
    if (phase === 'correct' || phase === 'surrender') {
      continueRef.current?.focus()
    }
  }, [phase])

  function hasProgress(): boolean {
    return revealed > 1 || draft.trim().length > 0 || phase !== 'play'
  }

  function requestLeave(next: Dialog) {
    if (!hasProgress()) {
      if (next === 'menu') onMenu()
      if (next === 'restart') onRestart()
      return
    }
    setDialog(next)
  }

  function confirmDialog() {
    if (dialog === 'menu') onMenu()
    if (dialog === 'restart') onRestart()
  }

  function revealClue() {
    if (phase === 'correct' || phase === 'surrender') return
    setRevealed((current) => Math.min(riddle.clues.length, current + 1))
    setPhase('play')
    setNotice('')
  }

  function submit() {
    if (phase === 'correct' || phase === 'surrender' || locked.current) return
    if (!draft.trim()) {
      setNotice('Escribe una respuesta antes de comprobarla.')
      inputRef.current?.focus()
      return
    }
    if (isCorrect(draft, riddle)) {
      const points = pointsForRevealedClues(revealed)
      locked.current = true
      setEarned(points)
      setPhase('correct')
      setNotice('')
      onSolved({ points, clues: revealed, outcome: 'correct' })
      return
    }
    setAttempts((current) => current + 1)
    setPhase('wrong')
    const card = cardRef.current
    if (card) {
      card.classList.remove('is-shaking')
      void card.offsetWidth
      card.classList.add('is-shaking')
    }
    setNotice(
      attempts % 2 === 0
        ? 'Casi. El mar no castiga un intento: prueba otra vez.'
        : 'Esa no es la isla. Puedes seguir buscando.',
    )
  }

  function surrender() {
    if (locked.current) return
    locked.current = true
    setEarned(0)
    setPhase('surrender')
    setNotice('')
    onSolved({ points: 0, clues: revealed, outcome: 'surrender' })
  }

  const visibleClues = riddle.clues.slice(0, revealed)

  return (
    <section className="screen game-screen">
      <div className="status-bar">
        <div>
          <span className="status-label">Puntos</span>
          <strong>{score}</strong>
        </div>
        <div>
          <span className="status-label">Aciertos</span>
          <strong>
            {correctCount}/{total}
          </strong>
        </div>
        <div className="status-progress">
          <span className="status-label">Progreso</span>
          <strong>
            {index + 1}/{total}
          </strong>
          <span
            className="progress-track"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={total}
            aria-valuenow={index + 1}
          >
            <span style={{ width: `${((index + (phase === 'correct' || phase === 'surrender' ? 1 : 0)) / total) * 100}%` }} />
          </span>
        </div>
        <div>
          <span className="status-label">Dificultad</span>
          <strong>{level.label}</strong>
        </div>
      </div>

      <div className="game-actions">
        <button type="button" className="text-link" onClick={() => requestLeave('menu')}>
          <ChevronLeft size={18} aria-hidden="true" />
          Volver al menú
        </button>
        <button type="button" className="text-link" onClick={() => requestLeave('restart')}>
          <RotateCcw size={16} aria-hidden="true" />
          Reiniciar partida
        </button>
      </div>

      <article ref={cardRef} className="parchment game-card">
        <div className={`game-art tone-${difficulty}`}>
          <Motif category={category} seed={riddle.id} />
          <p className="epithet">{level.epithet}</p>
        </div>
        <div className="game-body">
          <div className="chips">
            <span>Acertijo {index + 1}</span>
            <span>{group.title}</span>
            <span>{level.label}</span>
            <span>
              Pistas {revealed}/{riddle.clues.length}
            </span>
          </div>
          <ol className="clues">
            {visibleClues.map((clue, clueIndex) => (
              <li key={clue} className={clueIndex === revealed - 1 ? 'is-new' : ''}>
                <span>{clueIndex + 1}</span>
                <p>{clue}</p>
              </li>
            ))}
          </ol>

          {phase === 'play' || phase === 'wrong' ? (
            <form
              className="answer-form"
              onSubmit={(event) => {
                event.preventDefault()
                submit()
              }}
            >
              <label htmlFor="answer">Tu respuesta</label>
              <input
                id="answer"
                ref={inputRef}
                value={draft}
                placeholder="Escribe tu respuesta..."
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                onChange={(event) => {
                  setDraft(event.target.value)
                  if (phase === 'wrong') setPhase('play')
                }}
              />
              <div className="form-row">
                <Button type="button" variant="ghost" onClick={revealClue} disabled={cluesLeft <= 0}>
                  <Eye size={16} aria-hidden="true" />
                  {cluesLeft > 0 ? 'Descubrir otra pista' : 'No quedan pistas'}
                </Button>
                <Button type="submit">Comprobar respuesta</Button>
              </div>
              <button type="button" className="surrender" onClick={surrender}>
                <Flag size={15} aria-hidden="true" />
                Me rindo
              </button>
            </form>
          ) : (
            <div className={`resolution ${phase}`} aria-live="polite">
              {phase === 'correct' ? (
                <>
                  <p className="seal">Acertaste</p>
                  <h2>{riddle.answer}</h2>
                  <p className="praise">{praiseFor(riddle.id)}</p>
                  <p>{riddle.description}</p>
                  <p className="why">{riddle.why}</p>
                  <p className="tally">
                    {revealed === 1 ? 'Con la primera pista' : `Con ${revealed} pistas`} · {earned} puntos
                  </p>
                </>
              ) : (
                <>
                  <p className="seal quiet">Respuesta</p>
                  <h2>{riddle.answer}</h2>
                  <p>Está bien rendirse. Este mar sigue aquí mañana.</p>
                  <p>{riddle.description}</p>
                  <p className="why">{riddle.why}</p>
                  <p className="tally">0 puntos</p>
                </>
              )}
              <Button type="button" onClick={onContinue} ref={continueRef}>
                {index + 1 === total ? 'Ver el final' : 'Siguiente acertijo'}
              </Button>
            </div>
          )}
          <p className="notice" aria-live="polite">
            {notice}
          </p>
        </div>
      </article>

      {dialog && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
          <div className="modal-card">
            <h2 id="dialog-title">
              {dialog === 'menu' ? '¿Vuelves al menú?' : '¿Reinicias la partida?'}
            </h2>
            <p>
              {dialog === 'menu'
                ? 'Se perderá el progreso de esta sesión. Las mejores marcas guardadas siguen en este navegador.'
                : 'Los acertijos de este rumbo volverán a barajarse y la puntuación de ahora quedará en cero.'}
            </p>
            <div className="form-row">
              <Button type="button" variant="ghost" onClick={() => setDialog(null)}>
                Seguir jugando
              </Button>
              <Button type="button" onClick={confirmDialog}>
                {dialog === 'menu' ? 'Volver al menú' : 'Reiniciar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
