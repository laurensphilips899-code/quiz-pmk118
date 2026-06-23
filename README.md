# QUIZ PMK 118/2024 - LAWRANCE @PWK

Website kuis interaktif dengan leaderboard real-time untuk materi presentasi
PMK Nomor 118 Tahun 2024 (Pratama Wahana Konsultan).

## Fitur

- Join kuis cukup dengan mengisi nama, tanpa perlu akun/login
- 5 soal pilihan ganda dengan timer 30 detik per soal
- Skor dihitung berdasarkan kecepatan + ketepatan jawaban
- Leaderboard real-time -- peringkat update otomatis tanpa refresh
- Bisa diakses lewat link publik oleh siapa saja

## Menjalankan secara lokal

```bash
npm install
cp .env.example .env   # lalu isi dengan kredensial Supabase kamu
npm run dev
```

## Deploy ke production

Lihat **[SETUP.md](./SETUP.md)** untuk panduan lengkap langkah demi langkah
membuat akun Supabase, GitHub, dan Netlify sampai website online dengan link
publik.

## Mengubah soal

Edit `src/data/questions.js`.

## Struktur project

```
src/
  data/questions.js       <- soal kuis, edit di sini
  lib/supabase.js         <- koneksi ke database
  pages/
    JoinPage.jsx           <- halaman isi nama
    QuizPage.jsx           <- halaman soal + timer
    ResultsPage.jsx         <- halaman skor pribadi
    LeaderboardPage.jsx    <- peringkat real-time
supabase_schema.sql        <- skema database, jalankan di Supabase SQL Editor
netlify.toml               <- konfigurasi deploy Netlify
```
