import { useState } from 'react'
import { MapScene } from './components/MapScene.tsx'
import { CoverPage } from './pages/CoverPage.tsx'
import { GamePage } from './pages/GamePage.tsx'
import { ResultPage } from './pages/ResultPage.tsx'
import { SelectPage } from './pages/SelectPage.tsx'
import type { Category, Difficulty, Outcome, Screen, Session } from './types.ts'
import { applyResult, createSession, percentOf } from './utils/session.ts'
import { rememberRecord } from './utils/storage.ts'

export default function App() {
  const [screen, setScreen] = useState<Screen>('cover')
  const [session, setSession] = useState<Session | null>(null)
  const [newRecord, setNewRecord] = useState(false)
  const [playId, setPlayId] = useState(0)

  function start(category: Category, difficulty: Difficulty) {
    setPlayId((value) => value + 1)
    setSession(createSession(category, difficulty))
    setNewRecord(false)
    setScreen('game')
  }

  function handleSolved(result: { points: number; clues: number; outcome: Outcome }) {
    setSession((current) => {
      if (!current) return current
      const riddle = current.queue[current.index]
      if (!riddle) return current
      if (current.log.some((round) => round.id === riddle.id)) return current
      return applyResult(current, {
        id: riddle.id,
        answer: riddle.answer,
        points: result.points,
        clues: result.clues,
        outcome: result.outcome,
      })
    })
  }

  function handleContinue() {
    if (!session) return
    const isLast = session.index >= session.queue.length - 1
    if (isLast) {
      const total = session.queue.length
      const improved = rememberRecord(session.category, session.difficulty, {
        score: session.score,
        percent: percentOf(session.correctCount, total),
        correct: session.correctCount,
        total,
      })
      setNewRecord(improved)
      setScreen('result')
      return
    }
    setSession({ ...session, index: session.index + 1 })
  }

  const riddle = session?.queue[session.index]

  return (
    <MapScene>
      {screen === 'cover' && <CoverPage onStart={() => setScreen('select')} />}
      {screen === 'select' && (
        <SelectPage
          initialCategory={session?.category ?? null}
          onBack={() => setScreen('cover')}
          onStart={start}
        />
      )}
      {screen === 'game' && session && riddle && (
        <GamePage
          key={`${playId}-${riddle.id}`}
          riddle={riddle}
          index={session.index}
          total={session.queue.length}
          score={session.score}
          correctCount={session.correctCount}
          category={session.category}
          difficulty={session.difficulty}
          onSolved={handleSolved}
          onContinue={handleContinue}
          onMenu={() => setScreen('select')}
          onRestart={() => start(session.category, session.difficulty)}
        />
      )}
      {screen === 'result' && session && (
        <ResultPage
          session={session}
          isNewRecord={newRecord}
          onReplay={() => start(session.category, session.difficulty)}
          onMenu={() => setScreen('select')}
          onCover={() => {
            setSession(null)
            setScreen('cover')
          }}
        />
      )}
    </MapScene>
  )
}
