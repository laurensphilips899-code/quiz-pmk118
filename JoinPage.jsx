import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { questions, QUIZ_TITLE, QUIZ_SUBTITLE, SECONDS_PER_QUESTION } from '../data/questions'
import styles from './JoinPage.module.css'

export default function JoinPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleJoin(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (trimmed.length < 2) {
      setError('Nama minimal 2 karakter ya.')
      return
    }
    if (trimmed.length > 40) {
      setError('Nama maksimal 40 karakter.')
      return
    }

    setError('')
    setLoading(true)

    if (!isSupabaseConfigured) {
      // Mode demo tanpa database -- tetap bisa dicoba secara lokal
      sessionStorage.setItem('quiz_participant', JSON.stringify({ id: 'demo', name: trimmed }))
      navigate('/quiz')
      return
    }

    try {
      const { data, error: insertError } = await supabase
        .from('participants')
        .insert({ name: trimmed })
        .select()
        .single()

      if (insertError) throw insertError

      sessionStorage.setItem('quiz_participant', JSON.stringify({ id: data.id, name: data.name }))
      navigate('/quiz')
    } catch (err) {
      console.error(err)
      setError('Gagal bergabung. Cek koneksi internet kamu dan coba lagi.')
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <div className={styles.topbarInner}>
          <div className={styles.badge}>PMK</div>
          <div>
            <p className={styles.topbarTitle}>{QUIZ_TITLE}</p>
            <p className={styles.topbarSub}>{QUIZ_SUBTITLE}</p>
          </div>
          <span className={styles.livePill}>
            <span className={styles.liveDot} />LIVE
          </span>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.hero}>
          <div className={styles.heroOrb} />
          <span className={styles.heroEyebrow}>QUIZ INTERAKTIF · LIVE RANKING</span>
          <h1 className={styles.heroTitle}>
            PMK <span className={styles.heroAccent}>118/2024</span><br />
            Tahun 2024
          </h1>
          <p className={styles.heroDesc}>
            Uji pemahaman materi presentasi Lawrance @PWK. Masukkan nama dan
            bersaing di leaderboard!
          </p>
          <div className={styles.heroStats}>
            <div>
              <p className={styles.statNum}>{questions.length}</p>
              <p className={styles.statLabel}>SOAL</p>
            </div>
            <div>
              <p className={styles.statNum}>{SECONDS_PER_QUESTION}s</p>
              <p className={styles.statLabel}>PER SOAL</p>
            </div>
            <div>
              <p className={styles.statNum}>Live</p>
              <p className={styles.statLabel}>RANKING</p>
            </div>
          </div>
        </div>

        <form className={styles.formCard} onSubmit={handleJoin}>
          <p className={styles.formLabel}>Siapa nama kamu?</p>
          <p className={styles.formHint}>Nama akan muncul di papan peringkat semua peserta</p>
          <input
            className={styles.nameInput}
            type="text"
            placeholder="Masukkan nama kamu..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={40}
            autoFocus
          />
          {error && <p className={styles.errorText}>{error}</p>}
          <button className={styles.joinButton} type="submit" disabled={loading}>
            {loading ? 'Memproses...' : 'Bergabung ke Quiz →'}
          </button>
          <div className={styles.linkRow}>
            <span>Mau lihat peringkat dulu?</span>
            <button type="button" onClick={() => navigate('/leaderboard')}>
              Lihat leaderboard
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
