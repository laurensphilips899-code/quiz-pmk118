import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ResultsPage.module.css'

function readResult() {
  try {
    const stored = sessionStorage.getItem('quiz_result')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export default function ResultsPage() {
  const navigate = useNavigate()
  const [result] = useState(readResult)

  useEffect(() => {
    if (!result) {
      navigate('/')
    }
  }, [result, navigate])

  if (!result) return null

  const accuracy = Math.round((result.correctCount / result.total) * 100)

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <p className={styles.eyebrow}>QUIZ SELESAI</p>
        <p className={styles.scoreNum}>{result.score}</p>
        <p className={styles.scoreLabel}>TOTAL POIN</p>

        <div className={styles.statsRow}>
          <div className={styles.statBlock}>
            <p>{result.correctCount}/{result.total}</p>
            <p>BENAR</p>
          </div>
          <div className={styles.statBlock}>
            <p>{accuracy}%</p>
            <p>AKURASI</p>
          </div>
        </div>

        <button className={styles.primaryButton} onClick={() => navigate('/leaderboard')}>
          Lihat leaderboard →
        </button>
        <button className={styles.secondaryButton} onClick={() => navigate('/')}>
          Kembali ke awal
        </button>
      </div>
    </div>
  )
}
