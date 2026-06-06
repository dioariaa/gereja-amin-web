# Supabase Setup

1. Buat project di Supabase.
2. Buka SQL Editor, jalankan `supabase/schema.sql`.
3. Untuk mengisi data jemaat dari Excel, jalankan `supabase/seed_jemaat_excel.sql` setelah schema selesai.
4. Opsional untuk pengelolaan website public, jalankan `supabase/public_content_schema.sql` setelah schema utama selesai.
5. Salin Project URL dan anon key ke `.env.local`:

```bash
VITE_SUPABASE_URL=https://project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_PUBLIC_MEDIA_BUCKET=public-assets
VITE_ENABLE_DEMO_AUTH=false
```

6. Restart dev server Vite.
7. Buat user di Supabase Authentication, lalu isi row `profiles` dengan `id` yang sama dengan `auth.users.id`.

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
- `seed_jemaat_excel.sql` berisi 55 keluarga, 174 individu, 4 sektor, dan aman dijalankan ulang karena memakai upsert.
- `public_content_schema.sql` menyiapkan tabel halaman public, publikasi, komisi public, jadwal, galeri, kontak, bucket Storage `public-assets`, dan policy CRUD untuk `super_admin` + `sekretaris`.
- Field gambar bisa memakai URL penuh atau path object di bucket `public-assets`, contoh `publications/warta-minggu.jpg`.
- Sebelum production, aktifkan Supabase Auth penuh dan ketatkan RLS sesuai role di tabel `profiles`.
