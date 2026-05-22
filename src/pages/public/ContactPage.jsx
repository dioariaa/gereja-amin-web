export default function ContactPage() {
  const contactCards = [
    {
      title: "Alamat Gereja",
      value:
        "Kp. Maruga, Jl. Pembangunan, Kel. Ciater, Kec. Serpong, Kota Tangerang Selatan, Banten 15310",
    },
    {
      title: "Telepon / WhatsApp",
      value: "0877-7271-9168",
      href: "https://wa.me/6287772719168",
    },
    {
      title: "Email",
      value: "gerejaamintangerangraya@gmail.com",
      href: "mailto:gerejaamintangerangraya@gmail.com",
    },
  ];

  const schedules = [
    { title: "Ibadah Umum", time: "Minggu, 10:00 – 12:00" },
    { title: "Ibadah Pemuda & Remaja", time: "Sabtu, 19:00 – 21:00" },
    { title: "Ibadah Sekolah Minggu", time: "Minggu, 10:00 – 12:00" },
    { title: "Ibadah Sektor & Komisi", time: "Sesuai jadwal masing-masing" },
  ];

  const socials = [
    { name: "Facebook", href: "#" },
    { name: "Instagram", href: "#" },
  ];

  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-100 to-white px-6 py-10 md:px-10 md:py-14 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Kontak
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900 md:text-5xl dark:text-white">
          Hubungi Gereja AMIN Jemaat Tangerang Raya
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 md:text-base dark:text-slate-300">
          Jemaat dan pengunjung dapat menghubungi gereja untuk informasi ibadah,
          pelayanan, publikasi, maupun kebutuhan administrasi gereja.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {contactCards.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              {item.title}
            </h2>

            {item.href ? (
              <a
                href={item.href}
                className="mt-3 block text-sm leading-7 text-slate-600 underline underline-offset-4 dark:text-slate-300"
              >
                {item.value}
              </a>
            ) : (
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {item.value}
              </p>
            )}
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Jadwal Ibadah
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            Waktu pelayanan gereja
          </h2>

          <div className="mt-6 space-y-4">
            {schedules.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"
              >
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {item.time}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Lokasi
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            Peta lokasi gereja
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Bagian ini bisa diganti nanti dengan Google Maps embed lokasi gereja.
          </p>

          <div className="mt-6 flex aspect-video items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-100 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
            Map Placeholder
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href="https://wa.me/6287772719168"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-slate-100 dark:text-slate-900"
            >
              Chat WhatsApp
            </a>
            <a
              href="mailto:gerejaamintangerangraya@gmail.com"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Kirim Email
            </a>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Media Sosial Gereja
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl dark:text-white">
              Tetap terhubung dengan pelayanan
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Kamu bisa menambahkan link media sosial resmi gereja di bagian ini.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {socials.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}