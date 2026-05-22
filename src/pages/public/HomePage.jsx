export default function HomePage() {
  const schedules = [
    {
      title: "Ibadah Umum",
      time: "Minggu, 10:00 – 12:00",
      description: "Ibadah umum jemaat setiap hari Minggu.",
    },
    {
      title: "Ibadah Pemuda & Remaja",
      time: "Sabtu, 19:00 – 21:00",
      description: "Persekutuan ibadah untuk pemuda dan remaja.",
    },
    {
      title: "Ibadah Sekolah Minggu",
      time: "Minggu, 10:00 – 12:00",
      description: "Ibadah dan pembinaan anak-anak sekolah minggu.",
    },
    {
      title: "Ibadah Sektor & Komisi",
      time: "Sesuai jadwal masing-masing",
      description: "Kegiatan pelayanan dan persekutuan sektor serta komisi.",
    },
  ];

  const visionPoints = [
    {
      title: "Tangguh",
      items: [
        "Mampu bertahan dalam situasi sulit.",
        "Konsisten dalam ajaran dan kesaksian.",
        "Memiliki sumber daya manusia dan iman yang kokoh.",
      ],
    },
    {
      title: "Mandiri",
      items: [
        "Kemandirian spiritual.",
        "Kemandirian organisasi.",
        "Kemandirian sosial.",
      ],
    },
    {
      title: "Peduli",
      items: [
        "Hadir sebagai jawaban atas kebutuhan jemaat dan masyarakat.",
        "Mengembangkan pelayanan diakonia.",
        "Peka terhadap persoalan sosial dan lingkungan.",
      ],
    },
  ];

  const services = [
    {
      title: "Marturia",
      description: "Pemberitaan Injil dan pelayanan sakramen sebagai panggilan gereja.",
    },
    {
      title: "Koinonia",
      description: "Membangun persekutuan jemaat dalam ibadah dan kehidupan bersama.",
    },
    {
      title: "Pengajaran",
      description: "Pembinaan firman dan pemuridan untuk pertumbuhan rohani jemaat.",
    },
    {
      title: "Diakonia",
      description: "Pelayanan kasih kepada jemaat dan masyarakat yang membutuhkan.",
    },
    {
      title: "Penggembalaan",
      description: "Pendampingan rohani agar jemaat hidup dalam tuntunan Kristus.",
    },
    {
      title: "Konseling",
      description: "Pelayanan pastoral untuk membantu jemaat menghadapi persoalan hidup.",
    },
  ];

  const stats = [
    { value: "25", label: "Pemuda & Remaja" },
    { value: "18", label: "Majelis Jemaat" },
    { value: "166", label: "Jumlah Jemaat" },
    { value: "28", label: "Anak-Anak" },
  ];

  return (
    <div className="space-y-12">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-100 to-white dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
        <div className="grid gap-8 px-6 py-10 md:grid-cols-2 md:px-10 md:py-16">
          <div className="flex flex-col justify-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Selamat Datang
            </p>
            <h1 className="text-3xl font-bold leading-tight text-slate-900 md:text-5xl dark:text-white">
              Gereja AMIN Jemaat Tangerang Raya
            </h1>
            <p className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-200">
              Tangguh – Mandiri – Peduli
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base dark:text-slate-300">
              “Inilah hidup kekal itu, yaitu bahwa mereka mengenal Engkau, satu-satunya Allah yang benar,
              dan mengenal Kristus Yesus yang telah Engkau utus.” (Yohanes 17:3)
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="/jadwal-ibadah"
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-slate-100 dark:text-slate-900"
              >
                Lihat Jadwal Ibadah
              </a>
              <a
                href="/tentang-kami"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Tentang Kami
              </a>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm text-slate-500 dark:text-slate-400">Lokasi Gereja</p>
              <h2 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                Kp. Maruga, Jl. Pembangunan, Ciater, Serpong
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Kota Tangerang Selatan, Banten 15310
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm text-slate-500 dark:text-slate-400">Telepon</p>
                <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
                  0877-7271-9168
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
                <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white break-all">
                  gerejaamintangerangraya@gmail.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{item.value}</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.label}</p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Jadwal Pelayanan
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl dark:text-white">
            Jadwal Ibadah
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {schedules.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {item.time}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Visi Pelayanan
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl dark:text-white">
            Gereja yang Tangguh – Mandiri – Peduli
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {visionPoints.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{item.title}</h3>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {item.items.map((point) => (
                  <li key={point}>• {point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Apa yang Kami Lakukan?
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl dark:text-white">
            Pelayanan Gereja AMIN Tangerang Raya
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Tentang Gereja
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl dark:text-white">
              Bagian dari Sinode Gereja AMIN
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Gereja AMIN Jemaat Tangerang Raya merupakan anggota Sinode Gereja AMIN yang berdiri
              pada 24 September 2023 dengan Nomor Anggota 102 dan ditahbiskan oleh Ketua Umum
              Gereja AMIN Bishop Sarofati Gea, S.Th., di Kota Tangerang Selatan.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href="/publikasi"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-slate-100 dark:text-slate-900"
            >
              Lihat Publikasi
            </a>
            <a
              href="/kontak"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Hubungi Kami
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}