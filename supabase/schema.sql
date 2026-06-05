-- Supabase schema for Gereja AMIN Jemaat Tangerang Raya
-- Copy this file into Supabase SQL Editor and run it once.
-- Phase 1 keeps frontend dummy auth intact; real role enforcement should be tightened
-- when Supabase Auth is fully adopted.

create extension if not exists pgcrypto;

create table if not exists public.roles (
  id text primary key,
  label text not null,
  description text,
  created_at timestamptz not null default now()
);

insert into public.roles (id, label, description)
values
  ('super_admin', 'Super Admin', 'Akses penuh ke semua modul.'),
  ('bendahara', 'Bendahara', 'Mengelola kas masuk, kas keluar, dan laporan keuangan.'),
  ('sekretaris', 'Sekretaris', 'Mengelola data jemaat dan laporan KKJ.')
on conflict (id) do update
set label = excluded.label,
    description = excluded.description;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role_id text not null references public.roles(id) default 'sekretaris',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sectors (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.sectors (name, sort_order)
values
  ('Eben-Haezer', 1),
  ('Anugerah', 2),
  ('Betlehem', 3),
  ('Nazaret', 4)
on conflict (name) do update
set sort_order = excluded.sort_order,
    is_active = true;

create table if not exists public.families (
  id uuid primary key default gen_random_uuid(),
  no_kk text not null unique,
  nama_kepala_keluarga text not null,
  pasangan text,
  marriage_date date,
  address text,
  sector_id uuid references public.sectors(id) on delete set null,
  status text not null default 'Aktif',
  notes text,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint families_status_check check (status in ('Aktif', 'Perlu Verifikasi', 'Nonaktif'))
);

create index if not exists families_sector_id_idx on public.families(sector_id);
create index if not exists families_status_idx on public.families(status);

create table if not exists public.individuals (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references public.families(id) on delete set null,
  no_induk text not null unique,
  full_name text not null,
  nick_name text,
  gender text not null default 'Laki-laki',
  birth_place text,
  birth_date date,
  blood_type text,
  occupation text,
  family_relationship text not null default 'Individu Mandiri',
  phone text,
  marital_status text not null default 'Belum',
  baptism_status text not null default 'Belum',
  sidi_status text not null default 'Belum',
  member_status text not null default 'Aktif',
  notes text,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint individuals_gender_check check (gender in ('Laki-laki', 'Perempuan')),
  constraint individuals_marital_status_check check (marital_status in ('Belum', 'Menikah', 'Duda', 'Janda')),
  constraint individuals_baptism_status_check check (baptism_status in ('Sudah', 'Belum')),
  constraint individuals_sidi_status_check check (sidi_status in ('Sudah', 'Belum')),
  constraint individuals_member_status_check check (member_status in ('Aktif', 'Meninggal', 'Nonaktif'))
);

create index if not exists individuals_family_id_idx on public.individuals(family_id);
create index if not exists individuals_member_status_idx on public.individuals(member_status);
create index if not exists individuals_full_name_idx on public.individuals using gin (to_tsvector('simple', full_name));

create table if not exists public.cash_accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.cash_accounts (name, sort_order)
values
  ('Kas Umum', 1),
  ('Kas Pembangunan', 2),
  ('Kas Diakonia', 3),
  ('Kas Pemuda', 4)
on conflict (name) do update
set sort_order = excluded.sort_order,
    is_active = true;

create table if not exists public.income_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.expense_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.income_categories (name, sort_order)
values
  ('Kolekte Persembahan kebaktian umum', 1),
  ('Kolekte Ibadah Keluarga / Sektor', 2),
  ('Kolekte Untuk Pelayanan Kasih', 3),
  ('Persembahan Syukur Jemaat', 4),
  ('Kolekte Untuk Pembangunan', 5),
  ('Kolekte Ibadah Komisi Usia Indah', 6),
  ('Kolekte Ibadah Komisi Pelayanan Anak', 7),
  ('Kolekte Ibadah Komisi Pemuda', 8),
  ('Kolekte Ibadah Komisi Pelayanan Perempuan', 9),
  ('Kolekte Ibadah Komisi Pelayanan Bapak', 10),
  ('Jumlah Persembahan Transistoris Untuk Sinode', 11),
  ('Penerimaan Dukungan Dana', 12)
on conflict (name) do update
set sort_order = excluded.sort_order,
    is_active = true;

insert into public.expense_categories (name, sort_order)
values
  ('Honorarium Pendeta / Pengkhotbah', 1),
  ('Tunjangan Kesejahteraan Pendeta / Pengkhotbah', 2),
  ('Biaya Rapat', 3),
  ('Perjamuan Kasih', 4),
  ('Subsidi Pelayanan Komisi Anak', 5),
  ('PHBG', 6),
  ('Perjamuan Kudus', 7),
  ('Dana diakonia / dll', 8),
  ('Operasional Sekretariat & Bendahara', 9),
  ('Rumah Tangga Gereja', 10),
  ('Pembayaran ke Sinode', 11)
on conflict (name) do update
set sort_order = excluded.sort_order,
    is_active = true;

create table if not exists public.income_transactions (
  id uuid primary key default gen_random_uuid(),
  transaction_date date not null,
  description text not null,
  receipt_number text unique,
  category_id uuid not null references public.income_categories(id) on delete restrict,
  account_id uuid references public.cash_accounts(id) on delete set null,
  source_name text,
  amount numeric(14,2) not null check (amount >= 0),
  status text not null default 'Selesai',
  attachment_url text,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint income_transactions_status_check check (status in ('Draft', 'Pending', 'Selesai'))
);

create table if not exists public.expense_transactions (
  id uuid primary key default gen_random_uuid(),
  transaction_date date not null,
  description text not null,
  receipt_number text unique,
  category_id uuid not null references public.expense_categories(id) on delete restrict,
  account_id uuid references public.cash_accounts(id) on delete set null,
  recipient_name text,
  amount numeric(14,2) not null check (amount >= 0),
  status text not null default 'Selesai',
  attachment_url text,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint expense_transactions_status_check check (status in ('Draft', 'Pending', 'Selesai'))
);

create index if not exists income_transactions_date_idx on public.income_transactions(transaction_date);
create index if not exists income_transactions_category_idx on public.income_transactions(category_id);
create index if not exists expense_transactions_date_idx on public.expense_transactions(transaction_date);
create index if not exists expense_transactions_category_idx on public.expense_transactions(category_id);

create or replace view public.finance_transactions_view as
select
  it.id,
  'Masuk'::text as type,
  it.transaction_date,
  ic.name as category,
  ca.name as account,
  it.source_name as actor,
  it.description,
  it.receipt_number,
  it.amount,
  it.status,
  it.attachment_url,
  it.created_at,
  it.updated_at
from public.income_transactions it
join public.income_categories ic on ic.id = it.category_id
left join public.cash_accounts ca on ca.id = it.account_id
union all
select
  et.id,
  'Keluar'::text as type,
  et.transaction_date,
  ec.name as category,
  ca.name as account,
  et.recipient_name as actor,
  et.description,
  et.receipt_number,
  et.amount,
  et.status,
  et.attachment_url,
  et.created_at,
  et.updated_at
from public.expense_transactions et
join public.expense_categories ec on ec.id = et.category_id
left join public.cash_accounts ca on ca.id = et.account_id;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_sectors_updated_at on public.sectors;
create trigger set_sectors_updated_at
before update on public.sectors
for each row execute function public.set_updated_at();

drop trigger if exists set_families_updated_at on public.families;
create trigger set_families_updated_at
before update on public.families
for each row execute function public.set_updated_at();

drop trigger if exists set_individuals_updated_at on public.individuals;
create trigger set_individuals_updated_at
before update on public.individuals
for each row execute function public.set_updated_at();

drop trigger if exists set_income_transactions_updated_at on public.income_transactions;
create trigger set_income_transactions_updated_at
before update on public.income_transactions
for each row execute function public.set_updated_at();

drop trigger if exists set_expense_transactions_updated_at on public.expense_transactions;
create trigger set_expense_transactions_updated_at
before update on public.expense_transactions
for each row execute function public.set_updated_at();

-- Minimal sample KKJ data for immediate frontend testing.
insert into public.families (no_kk, nama_kepala_keluarga, pasangan, marriage_date, address, sector_id, status)
values (
  'TGR007',
  'Arifman Jaya Hura, S.Ak., M.M.',
  'Ike Trajelita Nurjana Harefa, S.Pd.',
  '2024-05-30',
  'Jalan Benda Timur 7B Blok E3 No.3, Benda Baru, Pamulang, Kota Tangerang Selatan, Banten, 15418',
  (select id from public.sectors where name = 'Nazaret'),
  'Aktif'
)
on conflict (no_kk) do update
set nama_kepala_keluarga = excluded.nama_kepala_keluarga,
    pasangan = excluded.pasangan,
    marriage_date = excluded.marriage_date,
    address = excluded.address,
    sector_id = excluded.sector_id,
    status = excluded.status;

insert into public.individuals (
  family_id,
  no_induk,
  full_name,
  nick_name,
  gender,
  birth_place,
  birth_date,
  blood_type,
  occupation,
  family_relationship,
  phone,
  marital_status,
  baptism_status,
  sidi_status,
  member_status
)
values
  ((select id from public.families where no_kk = 'TGR007'), 'TGR007', 'Arifman Jaya Hura, S.Ak.', 'A. Cia Hura', 'Laki-laki', 'Hilibadalu', '1997-08-16', null, 'Karyawan Swasta', 'Suami', '081264011171', 'Menikah', 'Sudah', 'Sudah', 'Aktif'),
  ((select id from public.families where no_kk = 'TGR007'), 'TGR007.1', 'Ike Trajelita Nurjana Harefa, S.Pd.', null, 'Perempuan', 'Lolofaoso', '1998-05-16', null, 'Karyawan Swasta', 'Istri', '082176157212', 'Menikah', 'Sudah', 'Sudah', 'Aktif'),
  ((select id from public.families where no_kk = 'TGR007'), 'TGR007.2', 'Valencia Manuella Hura', null, 'Perempuan', 'Tangerang Selatan', '2025-06-28', null, 'Belum Bekerja', 'Anak', null, 'Belum', 'Sudah', 'Belum', 'Aktif'),
  (null, 'TGR014', 'Angeraigo Buulolo', null, 'Laki-laki', 'Nias', '1997-11-21', null, 'Karyawan Swasta', 'Individu Mandiri', null, 'Belum', 'Sudah', 'Sudah', 'Aktif')
on conflict (no_induk) do update
set family_id = excluded.family_id,
    full_name = excluded.full_name,
    nick_name = excluded.nick_name,
    gender = excluded.gender,
    birth_place = excluded.birth_place,
    birth_date = excluded.birth_date,
    occupation = excluded.occupation,
    family_relationship = excluded.family_relationship,
    phone = excluded.phone,
    marital_status = excluded.marital_status,
    baptism_status = excluded.baptism_status,
    sidi_status = excluded.sidi_status,
    member_status = excluded.member_status;

-- Demo access for anon key while frontend auth is still local/dummy.
-- Before production, remove anon write grants and enforce Supabase Auth + RLS policies.
alter table public.roles enable row level security;
alter table public.profiles enable row level security;
alter table public.sectors enable row level security;
alter table public.families enable row level security;
alter table public.individuals enable row level security;
alter table public.cash_accounts enable row level security;
alter table public.income_categories enable row level security;
alter table public.expense_categories enable row level security;
alter table public.income_transactions enable row level security;
alter table public.expense_transactions enable row level security;

drop policy if exists "demo_read_roles" on public.roles;
drop policy if exists "demo_read_sectors" on public.sectors;
drop policy if exists "demo_read_families" on public.families;
drop policy if exists "demo_read_individuals" on public.individuals;
drop policy if exists "demo_read_cash_accounts" on public.cash_accounts;
drop policy if exists "demo_read_income_categories" on public.income_categories;
drop policy if exists "demo_read_expense_categories" on public.expense_categories;
drop policy if exists "demo_read_income_transactions" on public.income_transactions;
drop policy if exists "demo_read_expense_transactions" on public.expense_transactions;
drop policy if exists "profiles_self_read" on public.profiles;
drop policy if exists "jemaat_manage_by_role" on public.families;
drop policy if exists "individuals_manage_by_role" on public.individuals;
drop policy if exists "finance_manage_by_role" on public.income_transactions;
drop policy if exists "expense_manage_by_role" on public.expense_transactions;

create policy "demo_read_roles" on public.roles for select to anon, authenticated using (true);
create policy "demo_read_sectors" on public.sectors for select to anon, authenticated using (true);
create policy "demo_read_families" on public.families for select to anon, authenticated using (true);
create policy "demo_read_individuals" on public.individuals for select to anon, authenticated using (true);
create policy "demo_read_cash_accounts" on public.cash_accounts for select to anon, authenticated using (true);
create policy "demo_read_income_categories" on public.income_categories for select to anon, authenticated using (true);
create policy "demo_read_expense_categories" on public.expense_categories for select to anon, authenticated using (true);
create policy "demo_read_income_transactions" on public.income_transactions for select to anon, authenticated using (true);
create policy "demo_read_expense_transactions" on public.expense_transactions for select to anon, authenticated using (true);

-- Authenticated CRUD policies for the future Supabase Auth phase.
create policy "profiles_self_read" on public.profiles for select to authenticated using (id = auth.uid());

create policy "jemaat_manage_by_role" on public.families
for all to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.is_active
      and p.role_id in ('super_admin', 'sekretaris')
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.is_active
      and p.role_id in ('super_admin', 'sekretaris')
  )
);

create policy "individuals_manage_by_role" on public.individuals
for all to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.is_active
      and p.role_id in ('super_admin', 'sekretaris')
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.is_active
      and p.role_id in ('super_admin', 'sekretaris')
  )
);

create policy "finance_manage_by_role" on public.income_transactions
for all to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.is_active
      and p.role_id in ('super_admin', 'bendahara')
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.is_active
      and p.role_id in ('super_admin', 'bendahara')
  )
);

create policy "expense_manage_by_role" on public.expense_transactions
for all to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.is_active
      and p.role_id in ('super_admin', 'bendahara')
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.is_active
      and p.role_id in ('super_admin', 'bendahara')
  )
);
