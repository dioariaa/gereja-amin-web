-- Initial public content seed for Gereja AMIN Jemaat Tangerang Raya.
-- Run after supabase/public_content_schema.sql.

insert into public.site_pages (slug, title, content, status)
values
  (
    'home',
    'Beranda',
    '{
      "heroEyebrow": "Selamat Datang",
      "heroTitle": "Gereja AMIN Jemaat Tangerang Raya",
      "heroSubtitle": "Bertumbuh dalam iman, melayani dalam kasih",
      "heroDescription": "\"Akulah jalan dan kebenaran dan hidup.\" (Yohanes 14:6)",
      "primaryCtaLabel": "Lihat Jadwal Ibadah",
      "primaryCtaTo": "/jadwal-ibadah",
      "secondaryCtaLabel": "Mengenal Gereja",
      "secondaryCtaTo": "/tentang-kami",
      "welcomeTitle": "Gereja yang bertumbuh bersama jemaat",
      "welcomeDescription": "Pelayanan gereja dibangun untuk menolong jemaat beribadah, bertumbuh, melayani, dan saling memperhatikan.",
      "status": "Aktif"
    }'::jsonb,
    'Aktif'
  ),
  (
    'about',
    'Tentang Kami',
    '{
      "pageEyebrow": "Tentang Kami",
      "title": "Gereja AMIN Jemaat Tangerang Raya",
      "summary": "Gereja AMIN Jemaat Tangerang Raya hadir untuk membangun jemaat yang tangguh dalam iman, mandiri dalam pelayanan, dan peduli terhadap sesama.",
      "historyTitle": "Ringkasan Sejarah",
      "historyBody": "Gereja AMIN Jemaat Tangerang Raya hadir sebagai bagian dari pelayanan Gereja AMIN untuk membangun ibadah, pembinaan rohani, persekutuan, dan pelayanan kasih secara berkelanjutan.",
      "contactTitle": "Kontak dan Lokasi",
      "contactBody": "Kp. Maruga, Jl. Pembangunan, Kel. Ciater, Kec. Serpong, Kota Tangerang Selatan, Banten 15310.",
      "values": [
        { "title": "Ibadah", "description": "Mengarahkan jemaat untuk hidup bersekutu dengan Tuhan." },
        { "title": "Pembinaan", "description": "Membangun iman jemaat melalui pengajaran dan persekutuan." },
        { "title": "Pelayanan Kasih", "description": "Menghadirkan perhatian gereja bagi sesama." }
      ],
      "timeline": [
        { "date": "2016", "title": "Pelayanan Jemaat", "description": "Pelayanan jemaat bertumbuh melalui ibadah dan kegiatan sektor." },
        { "date": "Sekarang", "title": "Pengembangan Pelayanan", "description": "Gereja terus merapikan administrasi dan pelayanan public." }
      ],
      "sectors": [
        { "name": "Sektor Nazaret", "chair": "Pengurus Sektor", "area": "Tangerang Raya" },
        { "name": "Sektor Betlehem", "chair": "Pengurus Sektor", "area": "Tangerang Raya" }
      ],
      "status": "Aktif"
    }'::jsonb,
    'Aktif'
  )
on conflict (slug) do update
set title = excluded.title,
    content = excluded.content,
    status = excluded.status,
    updated_at = now();

insert into public.public_commissions
  (slug, name, short_name, chair, description, focus, schedule, activities, image_url, status, sort_order)
values
  ('pelayanan-anak', 'Komisi Pelayanan Anak', 'Pelayanan Anak', 'SNK. Herlina, S.Pd.', 'Mendampingi anak-anak bertumbuh dalam iman melalui ibadah, pengajaran Alkitab, dan pembinaan karakter sejak dini.', array['Sekolah Minggu', 'Pembinaan iman anak', 'Kreativitas dan karakter'], 'Minggu, 10:00 - 12:00', array['Ibadah Sekolah Minggu', 'Latihan pujian anak', 'Kelas cerita Alkitab'], null, 'Aktif', 1),
  ('pemuda-remaja', 'Komisi Pelayanan Pemuda & Remaja', 'Pemuda & Remaja', 'SNK. Arojasa Harefa', 'Membangun generasi muda yang tangguh, melayani, dan berakar dalam firman Tuhan di tengah kehidupan sehari-hari.', array['Ibadah pemuda', 'Persekutuan remaja', 'Kader pelayanan'], 'Sabtu, 19:00 - 21:00', array['Ibadah pemuda', 'Diskusi remaja', 'Pelatihan pelayan muda'], null, 'Aktif', 2),
  ('pelayanan-perempuan', 'Komisi Pelayanan Perempuan', 'Pelayanan Perempuan', 'SNK. Milika Daeli', 'Menguatkan pelayanan perempuan melalui persekutuan, pembinaan keluarga, doa, dan kepedulian antarjemaat.', array['Persekutuan perempuan', 'Pembinaan keluarga', 'Pelayanan doa'], 'Sesuai agenda komisi', array['Persekutuan perempuan', 'Doa keluarga', 'Kunjungan jemaat'], null, 'Aktif', 3),
  ('pria-kaum-bapak', 'Komisi Pelayanan Pria Kaum Bapak', 'Pria Kaum Bapak', 'SNK. Gregorius F. Riski Gulo', 'Mendorong kaum bapak menjadi teladan iman, keluarga, pekerjaan, dan pelayanan dalam jemaat.', array['Persekutuan kaum bapak', 'Pembinaan keluarga', 'Pelayanan sosial'], 'Sesuai agenda komisi', array['Persekutuan kaum bapak', 'Pembinaan keluarga', 'Gotong royong pelayanan'], null, 'Aktif', 4),
  ('pelayanan-kasih', 'Komisi Pelayanan Kasih', 'Pelayanan Kasih', 'SNK. Sisudin Waruwu', 'Menghadirkan pelayanan kasih gereja melalui perhatian kepada jemaat dan masyarakat yang membutuhkan.', array['Diakonia', 'Kunjungan jemaat', 'Bantuan kasih'], 'Berdasarkan kebutuhan pelayanan', array['Kunjungan jemaat', 'Pengumpulan bantuan kasih', 'Koordinasi diakonia'], null, 'Aktif', 5),
  ('pembangunan', 'Komisi Pembangunan', 'Pembangunan', 'SNK. Estomi Laia, S.Kom., M.M.', 'Mengawal kebutuhan pembangunan, pemeliharaan fasilitas, dan kesiapan sarana pelayanan gereja.', array['Fasilitas gereja', 'Pemeliharaan', 'Rencana pembangunan'], 'Sesuai agenda program', array['Evaluasi fasilitas', 'Pemeliharaan gedung', 'Koordinasi pembangunan'], null, 'Aktif', 6),
  ('ibadah-musik', 'Komisi Pelayanan Ibadah & Musik', 'Ibadah & Musik', 'SNK. Arifman Jaya Hura, S.Ak.', 'Menyiapkan pelayanan ibadah yang tertib, rohani, dan mendukung jemaat bersekutu dengan Tuhan.', array['Liturgi', 'Musik gereja', 'Petugas ibadah'], 'Mengikuti jadwal ibadah', array['Latihan musik', 'Penyusunan liturgi', 'Koordinasi petugas ibadah'], null, 'Aktif', 7),
  ('usia-indah', 'Komisi Pelayanan Usia Indah', 'Usia Indah', 'SNK. Ir. Alinur Zebua, M.M.', 'Melayani jemaat usia indah melalui persekutuan, penguatan rohani, dan perhatian pastoral yang hangat.', array['Persekutuan usia indah', 'Pendampingan pastoral', 'Kunjungan'], 'Sesuai agenda komisi', array['Persekutuan usia indah', 'Kunjungan pastoral', 'Doa dan penguatan'], null, 'Aktif', 8)
on conflict (slug) do update
set name = excluded.name,
    short_name = excluded.short_name,
    chair = excluded.chair,
    description = excluded.description,
    focus = excluded.focus,
    schedule = excluded.schedule,
    activities = excluded.activities,
    image_url = excluded.image_url,
    status = excluded.status,
    sort_order = excluded.sort_order,
    updated_at = now();

insert into public.publications
  (slug, category, title, excerpt, content, author, status, published_at, cover_image_url, cover_label, reading_time, commission_slug)
values
  ('warta-jemaat-minggu', 'Warta Jemaat', 'Informasi Ibadah Minggu dan Kegiatan Pelayanan', 'Ringkasan ibadah, pengumuman jemaat, dan agenda pelayanan minggu ini.', 'Ibadah Minggu dilaksanakan di gedung Gereja AMIN Jemaat Tangerang Raya. Jemaat diundang hadir lebih awal untuk mengikuti persiapan ibadah dengan tertib.' || E'\n\n' || 'Agenda pelayanan minggu ini mencakup ibadah keluarga sektor, pembinaan komisi, dan koordinasi pelayanan musik.', 'Sekretariat Gereja', 'Aktif', '2026-05-22', null, 'Warta Jemaat', '3 menit baca', null),
  ('hidup-dalam-ketaatan-dan-kasih', 'Renungan Harian', 'Hidup dalam Ketaatan dan Kasih', 'Renungan untuk tetap setia dalam firman dan bertumbuh dalam kasih.', 'Ketaatan kepada Tuhan bukan sekadar sikap lahiriah, melainkan respons iman yang lahir dari kasih.' || E'\n\n' || 'Di tengah kesibukan hidup, gereja menjadi ruang untuk saling menguatkan.', 'Tim Renungan', 'Aktif', '2026-05-25', null, 'Renungan', '4 menit baca', null),
  ('sekolah-minggu-belajar-dalam-sukacita', 'Kegiatan Komisi', 'Sekolah Minggu Belajar dalam Sukacita', 'Komisi Pelayanan Anak menyiapkan ibadah dan kelas cerita Alkitab yang ramah untuk anak.', 'Komisi Pelayanan Anak terus mendampingi anak-anak jemaat melalui ibadah sekolah minggu, pujian, dan cerita Alkitab yang disampaikan dengan sederhana.', 'Komisi Pelayanan Anak', 'Aktif', '2026-05-12', null, 'Pelayanan Anak', '3 menit baca', 'pelayanan-anak'),
  ('pemuda-remaja-bertumbuh-dalam-pelayanan', 'Kegiatan Komisi', 'Pemuda & Remaja Bertumbuh dalam Pelayanan', 'Persekutuan pemuda menjadi ruang pembinaan iman, diskusi, dan kader pelayanan muda.', 'Komisi Pelayanan Pemuda & Remaja mengajak generasi muda untuk aktif dalam ibadah, diskusi firman, dan latihan pelayanan.', 'Komisi Pemuda & Remaja', 'Aktif', '2026-05-14', null, 'Pemuda & Remaja', '4 menit baca', 'pemuda-remaja'),
  ('perempuan-gereja-menguatkan-keluarga', 'Kegiatan Komisi', 'Perempuan Gereja Menguatkan Keluarga', 'Komisi Pelayanan Perempuan mengadakan pembinaan keluarga, doa, dan persekutuan rutin.', 'Persekutuan Komisi Pelayanan Perempuan diarahkan untuk menguatkan kehidupan keluarga, pelayanan doa, dan kepedulian antarjemaat.', 'Komisi Pelayanan Perempuan', 'Aktif', '2026-05-16', null, 'Pelayanan Perempuan', '3 menit baca', 'pelayanan-perempuan'),
  ('ibadah-dan-musik-yang-tertib-dan-rohani', 'Kegiatan Komisi', 'Ibadah dan Musik yang Tertib dan Rohani', 'Komisi Ibadah & Musik menyiapkan pelayanan liturgi, musik, dan petugas ibadah.', 'Komisi Pelayanan Ibadah & Musik berperan dalam menyiapkan ibadah yang tertib, rohani, dan mendukung jemaat bersekutu dengan Tuhan.', 'Komisi Ibadah & Musik', 'Aktif', '2026-05-23', null, 'Ibadah & Musik', '4 menit baca', 'ibadah-musik')
on conflict (slug) do update
set category = excluded.category,
    title = excluded.title,
    excerpt = excluded.excerpt,
    content = excluded.content,
    author = excluded.author,
    status = excluded.status,
    published_at = excluded.published_at,
    cover_image_url = excluded.cover_image_url,
    cover_label = excluded.cover_label,
    reading_time = excluded.reading_time,
    commission_slug = excluded.commission_slug,
    updated_at = now();

insert into public.fixed_worship_schedules
  (cms_key, category, title, time_label, location, notes, description, status, sort_order)
values
  (
    'fixed-ibadah-utama-1',
    'Ibadah Utama',
    'Ibadah Umum Minggu',
    'Minggu, 10:00 - 12:00 WIB',
    'Gedung Gereja AMIN Jemaat Tangerang Raya',
    'Jemaat diundang hadir lebih awal untuk persiapan ibadah.',
    'Jadwal ibadah reguler yang terbuka untuk jemaat dan pengunjung.',
    'Aktif',
    1
  ),
  (
    'fixed-ibadah-utama-2',
    'Ibadah Utama',
    'Ibadah Sekolah Minggu',
    'Minggu, 10:00 - 12:00 WIB',
    'Ruang pelayanan anak',
    'Pembinaan anak melalui cerita Alkitab, pujian, dan aktivitas kreatif.',
    'Jadwal ibadah reguler yang terbuka untuk jemaat dan pengunjung.',
    'Aktif',
    2
  ),
  (
    'fixed-pemuda-dan-remaja-1',
    'Pemuda dan Remaja',
    'Ibadah Pemuda & Remaja',
    'Sabtu, 19:00 - 21:00 WIB',
    'Gedung gereja / sesuai agenda',
    'Ibadah, diskusi, dan kaderisasi pelayanan muda.',
    'Persekutuan generasi muda untuk bertumbuh dalam firman dan pelayanan.',
    'Aktif',
    11
  ),
  (
    'fixed-sektor-dan-komisi-1',
    'Sektor dan Komisi',
    'Ibadah Keluarga / Sektor',
    'Sesuai jadwal sektor',
    'Rumah jemaat / lokasi sektor',
    'Koordinasi melalui ketua sektor masing-masing.',
    'Agenda pelayanan yang mengikuti koordinasi sektor dan komisi.',
    'Aktif',
    21
  ),
  (
    'fixed-sektor-dan-komisi-2',
    'Sektor dan Komisi',
    'Kegiatan Komisi',
    'Sesuai agenda komisi',
    'Gedung gereja / lokasi kegiatan',
    'Mencakup pembinaan, latihan, kunjungan, dan rapat pelayanan.',
    'Agenda pelayanan yang mengikuti koordinasi sektor dan komisi.',
    'Aktif',
    22
  )
on conflict (cms_key) do update
set category = excluded.category,
    title = excluded.title,
    time_label = excluded.time_label,
    location = excluded.location,
    notes = excluded.notes,
    description = excluded.description,
    status = excluded.status,
    sort_order = excluded.sort_order,
    updated_at = now();

insert into public.worship_schedules
  (cms_key, event_date, category, title, theme, time_label, location, notes, description, assignments, status, sort_order)
values
  (
    'schedule-2026-06-07-0600',
    '2026-06-07',
    'Ibadah Minggu',
    'Kebaktian Pagi',
    'Bertumbuh dalam Kasih Kristus',
    '06:00 WIB',
    'Gereja AMIN Jemaat Tangerang Raya',
    'Jemaat hadir 15 menit sebelum ibadah dimulai.',
    'Sesi ibadah pagi dengan susunan petugas pelayanan yang sudah ditetapkan.',
    '[{"id":"staff-0600-1","role":"Khotbah","name":"Pdt. Yusman Hulu","sortOrder":1},{"id":"staff-0600-2","role":"Liturgos","name":"SNK. Mareti Waruwu","sortOrder":2},{"id":"staff-0600-3","role":"Koordinator","name":"SNK. Arifman Jaya Hura, S.Ak.","sortOrder":3},{"id":"staff-0600-4","role":"Kolektan","name":"Sektor Nazaret","sortOrder":4},{"id":"staff-0600-5","role":"Organis","name":"Tim Musik Gereja","sortOrder":5},{"id":"staff-0600-6","role":"Songleader","name":"Tim Pujian","sortOrder":6},{"id":"staff-0600-7","role":"Infokus","name":"Tim Multimedia","sortOrder":7}]'::jsonb,
    'Aktif',
    1
  ),
  (
    'schedule-2026-06-07-0900',
    '2026-06-07',
    'Ibadah Minggu',
    'Kebaktian Siang',
    'Setia Melayani dalam Persekutuan',
    '09:00 WIB',
    'Gereja AMIN Jemaat Tangerang Raya',
    'Ibadah utama untuk jemaat dan pengunjung.',
    'Sesi ibadah siang dengan petugas pelayanan lintas sektor.',
    '[{"id":"staff-0900-1","role":"Khotbah","name":"Pdt. Yusman Hulu","sortOrder":1},{"id":"staff-0900-2","role":"Liturgos","name":"SNK. Kecitaan Harefa, S.Kom., M.Kom","sortOrder":2},{"id":"staff-0900-3","role":"Penyaji Firman dan Doa","name":"SNK. Gregorius F. Riski Gulo","sortOrder":3},{"id":"staff-0900-4","role":"Pelayan Huria","name":"Majelis Jemaat","sortOrder":4},{"id":"staff-0900-5","role":"Kolektan","name":"Sektor Betlehem","sortOrder":5},{"id":"staff-0900-6","role":"Organis","name":"Tim Musik Gereja","sortOrder":6},{"id":"staff-0900-7","role":"Songleader","name":"Komisi Ibadah & Musik","sortOrder":7},{"id":"staff-0900-8","role":"Infokus","name":"Tim Multimedia","sortOrder":8}]'::jsonb,
    'Aktif',
    2
  ),
  (
    'schedule-2026-06-07-1100',
    '2026-06-07',
    'Ibadah Minggu',
    'Kebaktian Sore',
    'Dikuatkan untuk Menjadi Berkat',
    '11:00 WIB',
    'Gereja AMIN Jemaat Tangerang Raya',
    'Disiapkan untuk jemaat yang mengikuti sesi ibadah akhir.',
    'Sesi ibadah sore dengan format pelayanan yang lebih ringkas.',
    '[{"id":"staff-1100-1","role":"Khotbah","name":"Pdt. Yusman Hulu","sortOrder":1},{"id":"staff-1100-2","role":"Liturgos","name":"SNK. Milika Daeli","sortOrder":2},{"id":"staff-1100-3","role":"Koordinator","name":"SNK. Estomi Laia, S.Kom., M.M.","sortOrder":3},{"id":"staff-1100-4","role":"Kolektan","name":"Sektor Galilea","sortOrder":4},{"id":"staff-1100-5","role":"Organis","name":"Tim Musik Gereja","sortOrder":5},{"id":"staff-1100-6","role":"Songleader","name":"Tim Pujian","sortOrder":6},{"id":"staff-1100-7","role":"Infokus","name":"Tim Multimedia","sortOrder":7}]'::jsonb,
    'Aktif',
    3
  )
on conflict (cms_key) do update
set event_date = excluded.event_date,
    category = excluded.category,
    title = excluded.title,
    theme = excluded.theme,
    time_label = excluded.time_label,
    location = excluded.location,
    notes = excluded.notes,
    description = excluded.description,
    assignments = excluded.assignments,
    status = excluded.status,
    sort_order = excluded.sort_order,
    updated_at = now();

insert into public.site_contacts (label, value, href, is_primary, sort_order)
values
  ('Alamat Gereja', 'Kp. Maruga, Jl. Pembangunan, Kel. Ciater, Kec. Serpong, Kota Tangerang Selatan, Banten 15310', null, true, 1),
  ('WhatsApp', '0877-7271-9168', 'https://wa.me/6287772719168', true, 2),
  ('Email', 'gerejaamintangerangraya@gmail.com', 'mailto:gerejaamintangerangraya@gmail.com', true, 3)
on conflict (label) do update
set value = excluded.value,
    href = excluded.href,
    is_primary = excluded.is_primary,
    sort_order = excluded.sort_order,
    updated_at = now();
