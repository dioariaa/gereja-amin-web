export default function PublicationsPage() {
  const featuredPost = {
    category: "Renungan Harian",
    title: "Hidup dalam Ketaatan dan Kasih",
    excerpt:
      "Renungan ini mengajak jemaat untuk tetap setia dalam firman, hidup dalam kasih, dan bertumbuh dalam iman di tengah tantangan sehari-hari.",
    date: "25 Mei 2026",
    author: "Admin Gereja",
  };

  const publications = [
    {
      type: "Warta Jemaat",
      title: "Informasi Ibadah Minggu dan Kegiatan Pelayanan",
      description:
        "Ringkasan informasi ibadah, pengumuman jemaat, dan agenda pelayanan minggu ini.",
      date: "22 Mei 2026",
    },
    {
      type: "Renungan Harian",
      title: "Berserah kepada Tuhan dalam Setiap Keadaan",
      description:
        "Renungan singkat untuk menguatkan jemaat dalam menghadapi proses kehidupan sehari-hari.",
      date: "21 Mei 2026",
    },
    {
      type: "Buletin Khotbah",
      title: "Iman yang Hidup dalam Perbuatan",
      description:
        "Ringkasan firman Tuhan dan poin utama khotbah untuk dibawa pulang dan direnungkan kembali.",
      date: "19 Mei 2026",
    },
    {
      type: "Warta Jemaat",
      title: "Jadwal Pelayanan Komisi Minggu Ini",
      description:
        "Informasi petugas pelayanan, jadwal kegiatan komisi, dan pembagian tanggung jawab jemaat.",
      date: "18 Mei 2026",
    },
    {
      type: "Renungan Harian",
      title: "Tetap Setia dalam Doa",
      description:
        "Penguatan rohani bagi jemaat untuk membangun kehidupan doa yang konsisten dan penuh pengharapan.",
      date: "16 Mei 2026",
    },
    {
      type: "Buletin Khotbah",
      title: "Kasih yang Menyatukan Jemaat",
      description:
        "Materi singkat khotbah tentang kasih, persekutuan, dan hidup saling membangun di dalam Tuhan.",
      date: "12 Mei 2026",
    },
  ];

  const filters = ["Semua", "Warta Jemaat", "Renungan Harian", "Buletin Khotbah"];

  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-100 to-white px-6 py-10 md:px-10 md:py-14 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Publikasi Gereja
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900 md:text-5xl dark:text-white">
          Warta, renungan, dan buletin dalam satu tempat.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 md:text-base dark:text-slate-300">
          Halaman ini menampilkan publikasi gereja untuk membantu jemaat mengikuti informasi
          terbaru, membaca renungan harian, dan mengakses ringkasan firman atau buletin khotbah.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Filter Publikasi
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              Temukan konten yang kamu cari
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Publikasi Unggulan
        </p>

        <div className="mt-4 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-2xl bg-slate-100 p-6 dark:bg-slate-800">
            <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
              {featuredPost.category}
            </span>
            <h2 className="mt-4 text-2xl font-bold text-slate-900 md:text-3xl dark:text-white">
              {featuredPost.title}
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {featuredPost.excerpt}
            </p>

            <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
              <span>{featuredPost.date}</span>
              <span>•</span>
              <span>{featuredPost.author}</span>
            </div>

            <a
              href="/publikasi/contoh-artikel"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-slate-100 dark:text-slate-900"
            >
              Baca Selengkapnya
            </a>
          </div>

          <div className="grid gap-4">
            <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-700">
              <p className="text-sm text-slate-500 dark:text-slate-400">Konten Aktif</p>
              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">24</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Total publikasi yang dapat dikelola melalui dashboard admin.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-700">
              <p className="text-sm text-slate-500 dark:text-slate-400">Kategori</p>
              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">3</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Warta Jemaat, Renungan Harian, dan Buletin Khotbah.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Daftar Publikasi
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            Informasi terbaru untuk jemaat
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {publications.map((item) => (
            <article
              key={`${item.type}-${item.title}`}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {item.type}
              </span>

              <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {item.description}
              </p>

              <div className="mt-5 flex items-center justify-between gap-3">
                <span className="text-sm text-slate-500 dark:text-slate-400">{item.date}</span>
                <a
                  href="/publikasi/contoh-artikel"
                  className="text-sm font-semibold text-slate-900 underline underline-offset-4 dark:text-slate-100"
                >
                  Baca
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Tetap Terhubung
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl dark:text-white">
              Ikuti setiap informasi dan pembinaan jemaat.
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Publikasi gereja membantu jemaat untuk tetap terinformasi dan bertumbuh dalam firman
              Tuhan melalui konten yang teratur dan mudah diakses.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href="/kontak"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-slate-100 dark:text-slate-900"
            >
              Hubungi Kami
            </a>
            <a
              href="/jadwal-ibadah"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Lihat Jadwal
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}