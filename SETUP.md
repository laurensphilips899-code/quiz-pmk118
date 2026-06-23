# Panduan Setup — QUIZ PMK 118/2024 LAWRANCE @PWK

Panduan ini akan memandu kamu membuat akun Supabase (database real-time gratis)
dan Netlify (hosting gratis), lalu deploy website kuis ini sampai punya link
publik yang bisa dibagikan ke semua peserta.

Estimasi waktu: 15-20 menit. Tidak perlu kartu kredit.

---

## Bagian 1 — Setup Supabase (database + leaderboard real-time)

### 1.1 Buat akun & project

1. Buka [https://supabase.com](https://supabase.com) → klik **Start your project**
2. Daftar dengan GitHub atau email
3. Klik **New project**
4. Isi:
   - **Name**: `quiz-pmk118` (atau nama apa saja)
   - **Database Password**: buat password kuat, **simpan di tempat aman**
   - **Region**: pilih `Southeast Asia (Singapore)` agar paling cepat dari Indonesia
5. Klik **Create new project** → tunggu 1-2 menit sampai project siap

### 1.2 Buat tabel database

1. Di sidebar kiri, klik **SQL Editor**
2. Klik **New query**
3. Buka file `supabase_schema.sql` yang ada di folder project ini, **copy semua isinya**
4. Paste ke SQL Editor di Supabase
5. Klik **Run** (atau tekan Ctrl/Cmd + Enter)
6. Pastikan muncul "Success. No rows returned" — artinya tabel berhasil dibuat

### 1.3 Ambil kredensial API

1. Di sidebar kiri, klik ikon **Settings** (gear) → **API**
2. Catat dua nilai ini:
   - **Project URL** → contoh: `https://abcdefgh.supabase.co`
   - **anon public** key (di bagian "Project API keys") → string panjang dimulai dengan `eyJ...`

Kamu akan butuh kedua nilai ini di Bagian 3.

---

## Bagian 2 — Push code ke GitHub

Netlify deploy paling mudah lewat GitHub. Kalau kamu belum punya repo:

1. Buka [https://github.com/new](https://github.com/new)
2. Beri nama repo, misalnya `quiz-pmk118`
3. Set ke **Public** atau **Private** (keduanya bisa untuk Netlify gratis)
4. Klik **Create repository**
5. Di komputer kamu, dari folder project ini, jalankan:

```bash
git init
git add .
git commit -m "Initial commit - Quiz PMK 118/2024"
git branch -M main
git remote add origin https://github.com/USERNAME/quiz-pmk118.git
git push -u origin main
```

(Ganti `USERNAME` dengan username GitHub kamu)

---

## Bagian 3 — Deploy ke Netlify

1. Buka [https://netlify.com](https://netlify.com) → **Sign up** (bisa pakai akun GitHub)
2. Di dashboard, klik **Add new site** → **Import an existing project**
3. Pilih **GitHub**, izinkan akses, lalu pilih repo `quiz-pmk118` yang baru kamu push
4. Netlify akan otomatis mendeteksi setting build (karena ada `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `dist`
5. **Sebelum klik Deploy**, klik **Add environment variables** dan tambahkan dua variabel ini:

   | Key | Value |
   |---|---|
   | `VITE_SUPABASE_URL` | (Project URL dari Supabase, Bagian 1.3) |
   | `VITE_SUPABASE_ANON_KEY` | (anon public key dari Supabase, Bagian 1.3) |

6. Klik **Deploy site**
7. Tunggu 1-2 menit sampai status berubah jadi **Published**

### 3.1 Ubah nama domain agar sesuai

Secara default, Netlify memberi domain acak seperti `random-name-123.netlify.app`.
Untuk membuat link mengandung "QUIZ PMK 118/2024 LAWRANCE @PWK", kamu bisa
mengganti nama subdomain (karakter spasi dan simbol akan otomatis diubah jadi
tanda hubung oleh sistem domain):

1. Di dashboard site Netlify, klik **Site configuration** → **Change site name**
2. Isi misalnya: `quiz-pmk-118-2024-lawrance-pwk`
3. Klik **Save**

Link final kamu akan jadi:
**`https://quiz-pmk-118-2024-lawrance-pwk.netlify.app`**

Link inilah yang kamu bagikan ke semua peserta/pendengar presentasi. Karena
ini link publik, siapa saja yang membukanya bisa langsung ikut kuis tanpa
perlu install apa pun.

---

## Bagian 4 — Tampilkan leaderboard saat presentasi

Untuk presenter (kamu), buka di layar/projector:

```
https://quiz-pmk-118-2024-lawrance-pwk.netlify.app/#/leaderboard
```

Halaman ini update otomatis secara real-time setiap kali ada peserta yang
join atau menjawab — tidak perlu refresh manual.

Untuk peserta, cukup share link utama:

```
https://quiz-pmk-118-2024-lawrance-pwk.netlify.app
```

---

## Mengubah soal kuis

Soal ada di file `src/data/questions.js`. Edit teks pertanyaan, pilihan jawaban,
atau `correctIndex` (0 = pilihan A, 1 = pilihan B, dst), lalu:

```bash
git add .
git commit -m "Update soal kuis"
git push
```

Netlify otomatis re-deploy setiap kali ada push baru ke GitHub.

---

## Reset leaderboard antar sesi

Kalau mau jalankan kuis lagi dari nol (misalnya beda kelas/sesi), kosongkan
tabel di Supabase:

1. Buka Supabase → **SQL Editor** → New query
2. Jalankan: `truncate table public.participants;`
3. Klik **Run**

---

## Troubleshooting

**"Leaderboard butuh koneksi Supabase"** — environment variables belum
terpasang di Netlify, atau salah ketik. Cek Site configuration → Environment
variables, pastikan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` benar,
lalu **trigger deploy ulang** (Deploys → Trigger deploy → Clear cache and
deploy site).

**Peserta tidak muncul di leaderboard** — pastikan langkah 1.2 (SQL schema)
sudah dijalankan, terutama baris `alter publication supabase_realtime add
table public.participants;` di paling akhir.

**Nama domain custom (bukan .netlify.app)** — bisa dibeli domain sendiri lalu
dihubungkan lewat Site configuration → Domain management, tapi ini opsional
dan berbayar (di luar scope gratis).
