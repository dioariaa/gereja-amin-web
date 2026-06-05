# Supabase Setup

1. Buat project di Supabase.
2. Buka SQL Editor, jalankan `supabase/schema.sql`.
3. Salin Project URL dan anon key ke `.env.local`:

```bash
VITE_SUPABASE_URL=https://project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ENABLE_DEMO_AUTH=false
```

4. Restart dev server Vite.
5. Buat user di Supabase Authentication, lalu isi row `profiles` dengan `id` yang sama dengan `auth.users.id`.

Contoh mapping profile:

```sql
insert into public.profiles (id, full_name, role_id)
values
  ('AUTH_USER_UUID', 'Super Admin Gereja', 'super_admin');
```

Catatan fase ini:
- Jika `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` tersedia, login admin memakai Supabase Auth dan role dibaca dari `profiles.role_id`.
- Jika env Supabase kosong, aplikasi tetap memakai dummy/local auth agar flow demo lama tidak rusak.
- `VITE_ENABLE_DEMO_AUTH=true` bisa dipakai sementara untuk mengizinkan fallback dummy walau env Supabase ada, tetapi jangan aktifkan untuk production.
- Service frontend sudah mencoba membaca Supabase jika env tersedia.
- Jika Supabase gagal/permission belum siap, UI fallback ke data localStorage/dummy.
- Sebelum production, aktifkan Supabase Auth penuh dan ketatkan RLS sesuai role di tabel `profiles`.
