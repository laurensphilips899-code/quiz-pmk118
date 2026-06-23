// Soal kuis PMK Nomor 118 Tahun 2024
// Sumber: Presentasi Lawrance Philipus - Pratama Wahana Konsultan
// Edit array ini untuk mengubah soal, pilihan, atau jawaban benar.
// correctIndex: index 0-3 yang menunjuk ke options mana yang benar.

export const QUIZ_TITLE = 'QUIZ PMK 118/2024 - LAWRANCE @PWK'
export const QUIZ_SUBTITLE = 'Pratama Wahana Konsultan · Quiz Interaktif'
export const SECONDS_PER_QUESTION = 30

export const questions = [
  {
    id: 1,
    question: 'PMK Nomor 118 Tahun 2024 resmi berlaku efektif mulai tanggal berapa?',
    options: [
      '23 Desember 2024',
      '1 Januari 2025',
      '1 Januari 2024',
      '27 Desember 2024',
    ],
    correctIndex: 1,
  },
  {
    id: 2,
    question: 'Berapa jumlah PMK lama yang dicabut dan digantikan oleh PMK 118/2024?',
    options: ['3 PMK', '4 PMK', '5 PMK', '6 PMK'],
    correctIndex: 2,
  },
  {
    id: 3,
    question: 'Pembetulan atas surat ketetapan pajak dapat diajukan karena tiga alasan utama. Manakah yang BUKAN termasuk alasan tersebut?',
    options: [
      'Kesalahan tulis',
      'Kesalahan hitung',
      'Kekeliruan penerapan peraturan perpajakan',
      'Perubahan kebijakan tarif pajak terbaru',
    ],
    correctIndex: 3,
  },
  {
    id: 4,
    question: 'Berapa batas waktu maksimal bagi Wajib Pajak untuk mengajukan keberatan sejak ketetapan pajak diterima?',
    options: ['1 bulan', '3 bulan', '6 bulan', '12 bulan'],
    correctIndex: 1,
  },
  {
    id: 5,
    question: 'Jika DJP tidak menerbitkan keputusan keberatan dalam jangka waktu 12 bulan, apa konsekuensinya?',
    options: [
      'Keberatan otomatis ditolak',
      'Wajib Pajak harus mengajukan ulang',
      'Keberatan dianggap dikabulkan seluruhnya',
      'Kasus dilimpahkan ke Pengadilan Pajak',
    ],
    correctIndex: 2,
  },
]
