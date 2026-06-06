export const PUBLICATIONS_STORAGE_KEY = "amin-publications";

export const publicationSeed = [
  {
    id: "pub-warta-001",
    slug: "warta-jemaat-minggu",
    category: "Warta Jemaat",
    title: "Informasi Ibadah Minggu dan Kegiatan Pelayanan",
    excerpt: "Ringkasan ibadah, pengumuman jemaat, dan agenda pelayanan minggu ini.",
    coverImage: "",
    coverLabel: "Warta Jemaat",
    readingTime: "3 menit baca",
    content:
      "Ibadah Minggu dilaksanakan pukul 10.00 WIB di gedung Gereja AMIN Jemaat Tangerang Raya. Jemaat diundang hadir lebih awal untuk mengikuti persiapan ibadah dengan tertib.\n\nAgenda pelayanan minggu ini mencakup ibadah keluarga sektor, pembinaan komisi, dan koordinasi pelayanan musik. Informasi teknis dapat dikonfirmasi melalui pengurus sektor masing-masing.",
    author: "Sekretariat Gereja",
    status: "Aktif",
    date: "2026-05-22",
  },
  {
    id: "pub-renungan-001",
    slug: "hidup-dalam-ketaatan-dan-kasih",
    category: "Renungan Harian",
    title: "Hidup dalam Ketaatan dan Kasih",
    excerpt: "Renungan untuk tetap setia dalam firman dan bertumbuh dalam kasih.",
    coverImage: "",
    coverLabel: "Renungan",
    readingTime: "4 menit baca",
    content:
      "Ketaatan kepada Tuhan bukan sekadar sikap lahiriah, melainkan respons iman yang lahir dari kasih. Jemaat diajak untuk terus bertumbuh dalam firman dan menyatakan kasih Kristus dalam keluarga, pekerjaan, dan pelayanan.\n\nDi tengah kesibukan hidup, gereja menjadi ruang untuk saling menguatkan. Melalui ibadah, doa, dan pelayanan, setiap jemaat dipanggil menjadi saksi yang membawa damai.",
    author: "Tim Renungan",
    status: "Aktif",
    date: "2026-05-25",
  },
  {
    id: "pub-buletin-001",
    slug: "iman-yang-hidup-dalam-perbuatan",
    category: "Buletin Khotbah",
    title: "Iman yang Hidup dalam Perbuatan",
    excerpt: "Ringkasan firman Tuhan dan poin utama khotbah untuk direnungkan kembali.",
    coverImage: "",
    coverLabel: "Buletin Khotbah",
    readingTime: "5 menit baca",
    content:
      "Iman yang hidup tampak melalui tindakan nyata. Firman Tuhan mengingatkan jemaat agar pelayanan, kepedulian, dan kesaksian hidup berjalan bersama dengan pengakuan iman.\n\nBuletin ini disiapkan sebagai bahan renungan ulang bagi keluarga jemaat setelah ibadah Minggu.",
    author: "Tim Publikasi",
    status: "Draft",
    date: "2026-05-19",
  },
];

export function formatPublicDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

export function getPublicationBySlug(publications, slug) {
  return publications.find((item) => item.slug === slug);
}

export function toSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
