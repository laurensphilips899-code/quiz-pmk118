-- ============================================================
-- SKEMA DATABASE — QUIZ PMK 118/2024 LAWRANCE @PWK
-- ============================================================
-- Cara pakai: buka Supabase Dashboard -> SQL Editor -> New Query
-- Copy seluruh isi file ini -> paste -> klik Run
-- ============================================================

-- Tabel peserta + skor mereka
create table if not exists public.participants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  score integer not null default 0,
  correct_count integer not null default 0,
  total_time_ms bigint not null default 0,
  finished boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index untuk leaderboard cepat (urut skor desc, lalu waktu tercepat)
create index if not exists participants_leaderboard_idx
  on public.participants (score desc, total_time_ms asc);

-- Aktifkan Row Level Security
alter table public.participants enable row level security;

-- Izinkan siapa saja membaca leaderboard (publik, sesuai kebutuhan kuis)
create policy "Public read access"
  on public.participants for select
  using (true);

-- Izinkan siapa saja membuat entri peserta baru (join kuis)
create policy "Public insert access"
  on public.participants for insert
  with check (true);

-- Izinkan siapa saja update skor (submit jawaban) -- dibatasi di sisi app by id
create policy "Public update access"
  on public.participants for update
  using (true);

-- Trigger untuk auto-update kolom updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_participants_updated_at on public.participants;
create trigger set_participants_updated_at
  before update on public.participants
  for each row execute function public.set_updated_at();

-- Aktifkan Realtime untuk tabel ini (supaya leaderboard live)
alter publication supabase_realtime add table public.participants;
