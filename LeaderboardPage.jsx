import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { QUIZ_TITLE } from '../data/questions'
import styles from './LeaderboardPage.module.css'

const MEDALS = ['🥇', '🥈', '🥉']

export default function LeaderboardPage() {
  const navigate = useNavigate()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchLeaderboard = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }
    const { data, error } = await supabase
      .from('participants')
      .select('id, name, score, correct_count, total_time_ms, finished')
      .order('score', { ascending: false })
      .order('total_time_ms', { ascending: true })
      .limit(50)

    if (!error && data) {
      setRows(data)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sinkronisasi awal dengan data server, plus subscription realtime di bawah
    fetchLeaderboard()

    if (!isSupabaseConfigured) return

    // Subscribe ke perubahan realtime di tabel participants
    const channel = supabase
      .channel('leaderboard-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'participants' }, () => {
        fetchLeaderboard()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchLeaderboard])

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <span className={styles.headerEyebrow}>LIVE LEADERBOARD</span>
          <h1 className={styles.headerTitle}>{QUIZ_TITLE}</h1>
          <p className={styles.headerSub}>Peringkat memperbarui otomatis secara real-time</p>
        </div>
      </div>

      <div className={styles.content}>
        {!isSupabaseConfigured ? (
          <div className={styles.empty}>
            Leaderboard butuh koneksi Supabase. Lihat SETUP.md untuk konfigurasi.
          </div>
        ) : loading ? (
          <div className={styles.empty}>Memuat peringkat...</div>
        ) : rows.length === 0 ? (
          <div className={styles.empty}>
            Belum ada peserta. Jadilah yang pertama bergabung!
          </div>
        ) : (
          <>
            <div className={styles.liveTag}>
              <span className={styles.liveDot} />
              {rows.length} peserta bergabung
            </div>
            <div className={styles.list}>
              {rows.map((row, idx) => (
                <div
                  key={row.id}
                  className={`${styles.row} ${idx < 3 ? styles.rowTop3 : ''}`}
                >
                  <span className={`${styles.rank} ${idx < 3 ? styles.rankTop3 : ''}`}>
                    {idx < 3 ? <span className={styles.medal}>{MEDALS[idx]}</span> : idx + 1}
                  </span>
                  <div className={styles.nameBlock}>
                    <p className={styles.name}>{row.name}</p>
                    <p className={styles.meta}>
                      {row.finished
                        ? `${row.correct_count} jawaban benar`
                        : 'Sedang mengerjakan...'}
                    </p>
                  </div>
                  <div className={styles.points}>
                    {row.score}
                    <span className={styles.pointsLabel}>poin</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className={styles.footerActions}>
          <button onClick={() => navigate('/')}>Kembali ke halaman join</button>
        </div>
      </div>
    </div>
  )
}
