-- Optional public website content schema for Gereja AMIN Jemaat Tangerang Raya.
-- Run after supabase/schema.sql when you are ready to manage public content in Supabase.

create table if not exists public.site_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  content jsonb not null default '{}'::jsonb,
  status text not null default 'Aktif',
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint site_pages_status_check check (status in ('Draft', 'Aktif', 'Arsip'))
);

create table if not exists public.publications (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category text not null default 'Warta Jemaat',
  title text not null,
  excerpt text,
  content text,
  author text default 'Sekretariat Gereja',
  status text not null default 'Draft',
  published_at date,
  cover_image_url text,
  cover_label text,
  reading_time text,
  commission_slug text,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint publications_status_check check (status in ('Draft', 'Aktif', 'Arsip'))
);

alter table public.publications
add column if not exists commission_slug text;

create table if not exists public.public_commissions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_name text,
  chair text,
  description text,
  focus text[] not null default '{}',
  schedule text,
  activities text[] not null default '{}',
  image_url text,
  status text not null default 'Aktif',
  sort_order integer not null default 0,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint public_commissions_status_check check (status in ('Draft', 'Aktif', 'Arsip'))
);

create table if not exists public.fixed_worship_schedules (
  id uuid primary key default gen_random_uuid(),
  cms_key text unique,
  category text not null default 'Ibadah Utama',
  title text not null,
  time_label text not null,
  location text,
  notes text,
  description text,
  status text not null default 'Aktif',
  sort_order integer not null default 0,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint fixed_worship_schedules_status_check check (status in ('Draft', 'Aktif', 'Arsip'))
);

create table if not exists public.worship_schedules (
  id uuid primary key default gen_random_uuid(),
  cms_key text unique,
  event_date date,
  category text not null,
  title text not null,
  theme text,
  time_label text not null,
  location text,
  notes text,
  description text,
  assignments jsonb not null default '[]'::jsonb,
  status text not null default 'Aktif',
  sort_order integer not null default 0,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint worship_schedules_status_check check (status in ('Draft', 'Aktif', 'Arsip'))
);

alter table public.worship_schedules
add column if not exists event_date date;

alter table public.worship_schedules
add column if not exists theme text;

alter table public.worship_schedules
add column if not exists description text;

alter table public.worship_schedules
add column if not exists assignments jsonb not null default '[]'::jsonb;

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  cms_key text unique,
  title text not null,
  category text not null default 'Dokumentasi',
  description text,
  image_url text,
  album_label text,
  item_count integer not null default 0,
  taken_at date,
  status text not null default 'Aktif',
  sort_order integer not null default 0,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint gallery_items_status_check check (status in ('Draft', 'Aktif', 'Arsip'))
);

create table if not exists public.site_contacts (
  id uuid primary key default gen_random_uuid(),
  label text not null unique,
  value text not null,
  href text,
  is_primary boolean not null default false,
  sort_order integer not null default 0,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists publications_status_idx on public.publications(status);
create index if not exists site_pages_status_idx on public.site_pages(status);
create index if not exists publications_published_at_idx on public.publications(published_at desc);
create index if not exists publications_commission_slug_idx on public.publications(commission_slug);
create index if not exists public_commissions_status_idx on public.public_commissions(status);
create index if not exists fixed_worship_schedules_cms_key_idx on public.fixed_worship_schedules(cms_key);
create index if not exists fixed_worship_schedules_status_idx on public.fixed_worship_schedules(status);
create index if not exists worship_schedules_cms_key_idx on public.worship_schedules(cms_key);
create index if not exists worship_schedules_event_date_idx on public.worship_schedules(event_date);
create index if not exists worship_schedules_status_idx on public.worship_schedules(status);
create index if not exists gallery_items_cms_key_idx on public.gallery_items(cms_key);
create index if not exists gallery_items_status_idx on public.gallery_items(status);

drop trigger if exists set_site_pages_updated_at on public.site_pages;
create trigger set_site_pages_updated_at
before update on public.site_pages
for each row execute function public.set_updated_at();

drop trigger if exists set_publications_updated_at on public.publications;
create trigger set_publications_updated_at
before update on public.publications
for each row execute function public.set_updated_at();

drop trigger if exists set_public_commissions_updated_at on public.public_commissions;
create trigger set_public_commissions_updated_at
before update on public.public_commissions
for each row execute function public.set_updated_at();

drop trigger if exists set_fixed_worship_schedules_updated_at on public.fixed_worship_schedules;
create trigger set_fixed_worship_schedules_updated_at
before update on public.fixed_worship_schedules
for each row execute function public.set_updated_at();

drop trigger if exists set_worship_schedules_updated_at on public.worship_schedules;
create trigger set_worship_schedules_updated_at
before update on public.worship_schedules
for each row execute function public.set_updated_at();

drop trigger if exists set_gallery_items_updated_at on public.gallery_items;
create trigger set_gallery_items_updated_at
before update on public.gallery_items
for each row execute function public.set_updated_at();

drop trigger if exists set_site_contacts_updated_at on public.site_contacts;
create trigger set_site_contacts_updated_at
before update on public.site_contacts
for each row execute function public.set_updated_at();

alter table public.site_pages enable row level security;
alter table public.publications enable row level security;
alter table public.public_commissions enable row level security;
alter table public.fixed_worship_schedules enable row level security;
alter table public.worship_schedules enable row level security;
alter table public.gallery_items enable row level security;
alter table public.site_contacts enable row level security;

drop policy if exists "public_read_site_pages" on public.site_pages;
drop policy if exists "public_read_publications" on public.publications;
drop policy if exists "public_read_public_commissions" on public.public_commissions;
drop policy if exists "public_read_fixed_worship_schedules" on public.fixed_worship_schedules;
drop policy if exists "public_read_worship_schedules" on public.worship_schedules;
drop policy if exists "public_read_gallery_items" on public.gallery_items;
drop policy if exists "public_read_site_contacts" on public.site_contacts;

create policy "public_read_site_pages" on public.site_pages
for select to anon, authenticated using (status = 'Aktif');

create policy "public_read_publications" on public.publications
for select to anon, authenticated using (status = 'Aktif');

create policy "public_read_public_commissions" on public.public_commissions
for select to anon, authenticated using (status = 'Aktif');

create policy "public_read_fixed_worship_schedules" on public.fixed_worship_schedules
for select to anon, authenticated using (status = 'Aktif');

create policy "public_read_worship_schedules" on public.worship_schedules
for select to anon, authenticated using (status = 'Aktif');

create policy "public_read_gallery_items" on public.gallery_items
for select to anon, authenticated using (status = 'Aktif');

create policy "public_read_site_contacts" on public.site_contacts
for select to anon, authenticated using (true);

drop policy if exists "content_manage_site_pages" on public.site_pages;
drop policy if exists "content_manage_publications" on public.publications;
drop policy if exists "content_manage_public_commissions" on public.public_commissions;
drop policy if exists "content_manage_fixed_worship_schedules" on public.fixed_worship_schedules;
drop policy if exists "content_manage_worship_schedules" on public.worship_schedules;
drop policy if exists "content_manage_gallery_items" on public.gallery_items;
drop policy if exists "content_manage_site_contacts" on public.site_contacts;

create policy "content_manage_site_pages" on public.site_pages
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

create policy "content_manage_publications" on public.publications
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

create policy "content_manage_public_commissions" on public.public_commissions
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

create policy "content_manage_fixed_worship_schedules" on public.fixed_worship_schedules
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

create policy "content_manage_worship_schedules" on public.worship_schedules
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

create policy "content_manage_gallery_items" on public.gallery_items
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

create policy "content_manage_site_contacts" on public.site_contacts
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

insert into public.site_contacts (label, value, href, is_primary, sort_order)
values
  ('Alamat Gereja', 'Kp. Maruga, Jl. Pembangunan, Kel. Ciater, Kec. Serpong, Kota Tangerang Selatan, Banten 15310', null, true, 1),
  ('WhatsApp', '0877-7271-9168', 'https://wa.me/6287772719168', true, 2),
  ('Email', 'gerejaamintangerangraya@gmail.com', 'mailto:gerejaamintangerangraya@gmail.com', true, 3)
on conflict (label) do update
set value = excluded.value,
    href = excluded.href,
    is_primary = excluded.is_primary,
    sort_order = excluded.sort_order;

insert into storage.buckets (id, name, public)
values ('public-assets', 'public-assets', true)
on conflict (id) do update
set public = true;

drop policy if exists "public_assets_read" on storage.objects;
drop policy if exists "public_assets_manage_by_content_role" on storage.objects;

create policy "public_assets_read" on storage.objects
for select to anon, authenticated
using (bucket_id = 'public-assets');

create policy "public_assets_manage_by_content_role" on storage.objects
for all to authenticated
using (
  bucket_id = 'public-assets'
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.is_active
      and p.role_id in ('super_admin', 'sekretaris')
  )
)
with check (
  bucket_id = 'public-assets'
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.is_active
      and p.role_id in ('super_admin', 'sekretaris')
  )
);
