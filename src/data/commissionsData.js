export const commissions = [
  {
    slug: "pelayanan-anak",
    name: "Komisi Pelayanan Anak",
    shortName: "Pelayanan Anak",
    chair: "SNK. Herlina, S.Pd.",
    description:
      "Mendampingi anak-anak bertumbuh dalam iman melalui ibadah, pengajaran Alkitab, dan pembinaan karakter sejak dini.",
    focus: ["Sekolah Minggu", "Pembinaan iman anak", "Kreativitas dan karakter"],
    schedule: "Minggu, 10:00 - 12:00",
    activities: ["Ibadah Sekolah Minggu", "Latihan pujian anak", "Kelas cerita Alkitab"],
  },
  {
    slug: "pemuda-remaja",
    name: "Komisi Pelayanan Pemuda & Remaja",
    shortName: "Pemuda & Remaja",
    chair: "SNK. Arojasa Harefa",
    description:
      "Membangun generasi muda yang tangguh, melayani, dan berakar dalam firman Tuhan di tengah kehidupan sehari-hari.",
    focus: ["Ibadah pemuda", "Persekutuan remaja", "Kader pelayanan"],
    schedule: "Sabtu, 19:00 - 21:00",
    activities: ["Ibadah pemuda", "Diskusi remaja", "Pelatihan pelayan muda"],
  },
  {
    slug: "pelayanan-perempuan",
    name: "Komisi Pelayanan Perempuan",
    shortName: "Pelayanan Perempuan",
    chair: "SNK. Milika Daeli",
    description:
      "Menguatkan pelayanan perempuan melalui persekutuan, pembinaan keluarga, doa, dan kepedulian antarjemaat.",
    focus: ["Persekutuan perempuan", "Pembinaan keluarga", "Pelayanan doa"],
    schedule: "Sesuai agenda komisi",
    activities: ["Persekutuan perempuan", "Doa keluarga", "Kunjungan jemaat"],
  },
  {
    slug: "pria-kaum-bapak",
    name: "Komisi Pelayanan Pria Kaum Bapak",
    shortName: "Pria Kaum Bapak",
    chair: "SNK. Gregorius F. Riski Gulo",
    description:
      "Mendorong kaum bapak menjadi teladan iman, keluarga, pekerjaan, dan pelayanan dalam jemaat.",
    focus: ["Persekutuan kaum bapak", "Pembinaan keluarga", "Pelayanan sosial"],
    schedule: "Sesuai agenda komisi",
    activities: ["Persekutuan kaum bapak", "Pembinaan keluarga", "Gotong royong pelayanan"],
  },
  {
    slug: "pelayanan-kasih",
    name: "Komisi Pelayanan Kasih",
    shortName: "Pelayanan Kasih",
    chair: "SNK. Sisudin Waruwu",
    description:
      "Menghadirkan pelayanan kasih gereja melalui perhatian kepada jemaat dan masyarakat yang membutuhkan.",
    focus: ["Diakonia", "Kunjungan jemaat", "Bantuan kasih"],
    schedule: "Berdasarkan kebutuhan pelayanan",
    activities: ["Kunjungan jemaat", "Pengumpulan bantuan kasih", "Koordinasi diakonia"],
  },
  {
    slug: "pembangunan",
    name: "Komisi Pembangunan",
    shortName: "Pembangunan",
    chair: "SNK. Estomi Laia, S.Kom., M.M.",
    description:
      "Mengawal kebutuhan pembangunan, pemeliharaan fasilitas, dan kesiapan sarana pelayanan gereja.",
    focus: ["Fasilitas gereja", "Pemeliharaan", "Rencana pembangunan"],
    schedule: "Sesuai agenda program",
    activities: ["Evaluasi fasilitas", "Pemeliharaan gedung", "Koordinasi pembangunan"],
  },
  {
    slug: "ibadah-musik",
    name: "Komisi Pelayanan Ibadah & Musik",
    shortName: "Ibadah & Musik",
    chair: "SNK. Arifman Jaya Hura, S.Ak.",
    description:
      "Menyiapkan pelayanan ibadah yang tertib, rohani, dan mendukung jemaat bersekutu dengan Tuhan.",
    focus: ["Liturgi", "Musik gereja", "Petugas ibadah"],
    schedule: "Mengikuti jadwal ibadah",
    activities: ["Latihan musik", "Penyusunan liturgi", "Koordinasi petugas ibadah"],
  },
  {
    slug: "usia-indah",
    name: "Komisi Pelayanan Usia Indah",
    shortName: "Usia Indah",
    chair: "SNK. Ir. Alinur Zebua, M.M.",
    description:
      "Melayani jemaat usia indah melalui persekutuan, penguatan rohani, dan perhatian pastoral yang hangat.",
    focus: ["Persekutuan usia indah", "Pendampingan pastoral", "Kunjungan"],
    schedule: "Sesuai agenda komisi",
    activities: ["Persekutuan usia indah", "Kunjungan pastoral", "Doa dan penguatan"],
  },
];

export function getCommissionBySlug(slug) {
  return commissions.find((commission) => commission.slug === slug);
}
