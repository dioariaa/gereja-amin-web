# Supabase Setup

1. Buat project di Supabase.
2. Buka SQL Editor, jalankan `supabase/schema.sql`.
3. Untuk mengisi data jemaat dari Excel, jalankan `supabase/seed_jemaat_excel.sql` setelah schema selesai.
4. Untuk pengelolaan website public, jalankan `supabase/public_content_schema.sql` setelah schema utama selesai.
5. Untuk mengisi data awal website public, jalankan `supabase/public_content_seed.sql` setelah schema public content selesai.
6. Setelah tiga user admin dibuat di Supabase Authentication, jalankan `supabase/admin_profile_role_fix.sql` untuk memastikan role profile sesuai email.
7. Salin Project URL dan anon key ke `.env.local`:

```bash
VITE_SUPABASE_URL=https://project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_PUBLIC_MEDIA_BUCKET=public-assets
VITE_ENABLE_DEMO_AUTH=false
```

8. Restart dev server Vite.
9. Buat user di Supabase Authentication, lalu isi row `profiles` dengan `id` yang sama dengan `auth.users.id`.

Contoh mapping profile:

```sql
insert into public.profiles (id, full_name, role_id)
values
  ('AUTH_USER_UUID', 'Super Admin Gereja', 'super_admin');
```

Catatan fase ini:
- Jika `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` tersedia, login admin memakai Supabase Auth dan role dibaca dari `profiles.role_id`.
- Jika sidebar role terlihat tertukar, jalankan ulang `admin_profile_role_fix.sql` di Supabase SQL Editor.
- Jika env Supabase kosong, aplikasi tetap memakai dummy/local auth agar flow demo lama tidak rusak.
- `VITE_ENABLE_DEMO_AUTH=true` bisa dipakai sementara untuk mengizinkan fallback dummy walau env Supabase ada, tetapi jangan aktifkan untuk production.
- Service frontend sudah mencoba membaca Supabase jika env tersedia.
- Jika Supabase gagal/permission belum siap, UI fallback ke data localStorage/dummy.
- `seed_jemaat_excel.sql` berisi 55 keluarga, 174 individu, 4 sektor, dan aman dijalankan ulang karena memakai upsert.
- `public_content_schema.sql` menyiapkan tabel halaman public, publikasi, komisi public, jadwal ibadah tetap, jadwal pelayanan per tanggal, galeri, kontak, bucket Storage `public-assets`, dan policy CRUD untuk `super_admin` + `sekretaris`.
- `public_content_seed.sql` mengisi konten awal untuk beranda, tentang kami, publikasi, komisi, jadwal ibadah tetap, dan jadwal pelayanan event-based. Aman dijalankan ulang karena memakai upsert.
- Field gambar bisa memakai URL penuh atau path object di bucket `public-assets`, contoh `publications/warta-minggu.jpg`.
- Sebelum production, aktifkan Supabase Auth penuh dan ketatkan RLS sesuai role di tabel `profiles`.
