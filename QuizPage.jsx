import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { questions, SECONDS_PER_QUESTION } from '../data/questions'
import styles from './QuizPage.module.css'

const OPTION_LETTERS = ['A', 'B', 'C', 'D']
const MAX_POINTS_PER_QUESTION = 1000
const MIN_POINTS_PER_QUESTION = 200

function readParticipant() {
  try {
    const stored = sessionStorage.getItem('quiz_participant')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export default function QuizPage() {
  const navigate = useNavigate()
  // Lazy init: dibaca sekali saat mount, bukan di dalam efek.
  const [participant] = useState(readParticipant)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_QUESTION)
  const [score, setScore] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [totalTimeMs, setTotalTimeMs] = useState(0)

  const questionStartRef = useRef(null)
  const advanceTimeoutRef = useRef(null)

  // Redirect kalau belum join -- efek ini hanya melakukan navigasi (sinkronisasi
  // dengan router), tidak men-set state lokal komponen ini.
  useEffect(() => {
    if (!participant) {
      navigate('/')
    }
  }, [participant, navigate])

  // Set waktu mulai soal pertama begitu komponen siap (mengganti Date.now() di render).
  useEffect(() => {
    if (questionStartRef.current === null) {
      questionStartRef.current = Date.now()
    }
  }, [])

  const currentQuestion = questions[currentIndex]

  // Refs selalu menyimpan nilai state terbaru, supaya finishQuiz (dipanggil dari
  // dalam goToNext yang di-memo) tidak pernah membaca closure lama.
  const scoreRef = useRef(0)
  const correctCountRef = useRef(0)
  const totalTimeMsRef = useRef(0)

  useEffect(() => {
    scoreRef.current = score
  }, [score])
  useEffect(() => {
    correctCountRef.current = correctCount
  }, [correctCount])
  useEffect(() => {
    totalTimeMsRef.current = totalTimeMs
  }, [totalTimeMs])

  const finishQuiz = useCallback(async () => {
    const finalScore = scoreRef.current
    const finalCorrect = correctCountRef.current
    const finalTime = totalTimeMsRef.current

    sessionStorage.setItem(
      'quiz_result',
      JSON.stringify({ score: finalScore, correctCount: finalCorrect, total: questions.length })
    )

    if (isSupabaseConfigured && participant?.id && participant.id !== 'demo') {
      try {
        await supabase
          .from('participants')
          .update({
            score: finalScore,
            correct_count: finalCorrect,
            total_time_ms: finalTime,
            finished: true,
          })
          .eq('id', participant.id)
      } catch (err) {
        console.error('Gagal menyimpan skor:', err)
      }
    }

    navigate('/results')
  }, [participant, navigate])

  const goToNext = useCallback(() => {
    clearTimeout(advanceTimeoutRef.current)
    setCurrentIndex((i) => {
      if (i + 1 >= questions.length) {
        finishQuiz()
        return i
      }
      setSelected(null)
      setRevealed(false)
      setTimeLeft(SECONDS_PER_QUESTION)
      questionStartRef.current = Date.now()
      return i + 1
    })
  }, [finishQuiz])

  const handleAnswer = useCallback(
    (optionIndex) => {
      if (revealed) return
      const elapsedMs = Date.now() - (questionStartRef.current ?? Date.now())
      const isCorrect = optionIndex === currentQuestion.correctIndex

      setSelected(optionIndex)
      setRevealed(true)
      setTotalTimeMs((t) => t + elapsedMs)

      if (isCorrect) {
        const timeRatio = Math.max(0, 1 - elapsedMs / (SECONDS_PER_QUESTION * 1000))
        const points = Math.round(
          MIN_POINTS_PER_QUESTION + (MAX_POINTS_PER_QUESTION - MIN_POINTS_PER_QUESTION) * timeRatio
        )
        setScore((s) => s + points)
        setCorrectCount((c) => c + 1)
      }

      advanceTimeoutRef.current = setTimeout(goToNext, 1800)
    },
    [revealed, currentQuestion, goToNext]
  )

  // Timer per soal -- efek ini mensinkronkan dengan jam dinding eksternal (setTimeout),
  // pola yang dianjurkan untuk countdown.
  useEffect(() => {
    if (revealed) return
    if (timeLeft <= 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- transisi reveal dipicu oleh habisnya waktu eksternal, bukan derived state
      setRevealed(true)
      setTotalTimeMs((t) => t + SECONDS_PER_QUESTION * 1000)
      advanceTimeoutRef.current = setTimeout(goToNext, 1800)
      return
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearTimeout(id)
  }, [timeLeft, revealed, goToNext])

  useEffect(() => {
    return () => clearTimeout(advanceTimeoutRef.current)
  }, [])

  if (!participant || !currentQuestion) return null

  const progressPct = (timeLeft / SECONDS_PER_QUESTION) * 100

  return (
    <div className={styles.page}>
      <div className={styles.scoreFloat}>{score} pts</div>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.progressRow}>
            <span className={styles.progressText}>
              SOAL {currentIndex + 1} / {questions.length}
            </span>
            <span className={`${styles.timer} ${timeLeft <= 10 ? styles.timerWarn : ''}`}>
              {timeLeft}s
            </span>
          </div>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.questionCard}>
          <p className={styles.qNumber}>Pertanyaan {currentIndex + 1}</p>
          <h2 className={styles.qText}>{currentQuestion.question}</h2>

          <div className={styles.options}>
            {currentQuestion.options.map((option, idx) => {
              let optionClass = styles.option
              if (revealed) {
                if (idx === currentQuestion.correctIndex) {
                  optionClass += ` ${styles.optionCorrect}`
                } else if (idx === selected) {
                  optionClass += ` ${styles.optionWrong}`
                }
              } else if (idx === selected) {
                optionClass += ` ${styles.optionSelected}`
              }

              return (
                <button
                  key={idx}
                  className={optionClass}
                  onClick={() => handleAnswer(idx)}
                  disabled={revealed}
                >
                  <span className={styles.optionLetter}>{OPTION_LETTERS[idx]}</span>
                  <span>{option}</span>
                </button>
              )
            })}
          </div>

          {revealed && (
            <>
              <div
                className={`${styles.feedbackBanner} ${
                  selected === null
                    ? styles.feedbackTimeout
                    : selected === currentQuestion.correctIndex
                    ? styles.feedbackCorrect
                    : styles.feedbackWrong
                }`}
              >
                {selected === null
                  ? '⏱ Waktu habis!'
                  : selected === currentQuestion.correctIndex
                  ? '✓ Benar!'
                  : '✗ Kurang tepat'}
              </div>
              <p className={styles.nextHint}>Lanjut otomatis...</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
