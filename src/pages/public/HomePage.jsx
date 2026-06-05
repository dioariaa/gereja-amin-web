import { Home, Plus } from "lucide-react";
import PublicAdminActionBar from "../../components/public/PublicAdminActionBar";
import heroImage from "../../assets/hero.png";

export default function HomePage() {
  const schedules = [
    {
      title: "Ibadah Umum",
      time: "Minggu, 10:00 - 12:00",
      description: "Ibadah umum jemaat setiap hari Minggu.",
    },
    {
      title: "Ibadah Pemuda & Remaja",
      time: "Sabtu, 19:00 - 21:00",
      description: "Persekutuan ibadah untuk pemuda dan remaja.",
    },
    {
      title: "Ibadah Sekolah Minggu",
      time: "Minggu, 10:00 - 12:00",
      description: "Ibadah dan pembinaan anak-anak sekolah minggu.",
    },
    {
      title: "Ibadah Sektor & Komisi",
      time: "Sesuai jadwal masing-masing",
      description: "Kegiatan pelayanan dan persekutuan sektor serta komisi.",
    },
  ];

  const stats = [
    { value: "25", label: "Pemuda & Remaja" },
    { value: "18", label: "Majelis Jemaat" },
    { value: "166", label: "Jumlah Jemaat" },
    { value: "28", label: "Anak-Anak" },
  ];

  const visionPoints = [
    {
      title: "Tangguh",
      description: "Kokoh dalam iman, pengajaran, dan kesaksian hidup.",
    },
    {
      title: "Mandiri",
      description: "Bertumbuh dalam kemandirian spiritual, organisasi, dan pelayanan.",
    },
    {
      title: "Peduli",
      description: "Hadir melalui pelayanan kasih bagi jemaat dan masyarakat.",
    },
  ];

  const services = [
    "Marturia",
    "Koinonia",
    "Pengajaran",
    "Diakonia",
    "Penggembalaan",
    "Konseling",
  ];

  return (
    <div className="space-y-12">
      <PublicAdminActionBar
        title="Kelola konten beranda"
        description="Langsung menuju panel admin untuk mengatur hero, highlight, dan konten utama beranda."
        actions={[
          {
            label: "Kelola Beranda",
            to: "/admin/content/home",
            icon: Home,
            variant: "primary",
          },
          {
            label: "Tambah Highlight",
            to: "/admin/content/home?action=tambah-highlight",
            icon: Plus,
          },
        ]}
      />

      <section className="relative isolate overflow-hidden rounded-3xl border border-violet-100 bg-[#2c2038] text-white shadow-sm dark:border-violet-950/60">
        <img
          src={heroImage}
          alt="Gereja AMIN Jemaat Tangerang Raya"
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 -z-10 bg-[#2c2038]/72" />

        <div className="grid min-h-[560px] gap-8 px-6 py-10 md:grid-cols-[1.1fr_0.9fr] md:px-10 md:py-16">
          <div className="flex flex-col justify-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-cyan-100">
              Selamat Datang
            </p>
            <h1 className="max-w-3xl text-3xl font-bold leading-tight md:text-5xl">
              Gereja AMIN Jemaat Tangerang Raya
            </h1>
            <p className="mt-4 text-lg font-semibold text-white/90">
              Tangguh - Mandiri - Peduli
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 md:text-base">
              "Inilah hidup kekal itu, yaitu bahwa mereka mengenal Engkau,
              satu-satunya Allah yang benar, dan mengenal Kristus Yesus yang telah
              Engkau utus." (Yohanes 17:3)
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="/jadwal-ibadah"
                className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-violet-900 transition hover:bg-violet-50"
              >
                Lihat Jadwal Ibadah
              </a>
              <a
                href="/tentang-kami"
                className="inline-flex items-center justify-center rounded-xl border border-cyan-100/40 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Tentang Kami
              </a>
            </div>
          </div>

          <div className="grid content-end gap-4">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
              <p className="text-sm text-cyan-100">Lokasi Gereja</p>
              <h2 className="mt-2 text-lg font-semibold">
                Kp. Maruga, Jl. Pembangunan, Ciater, Serpong
              </h2>
              <p className="mt-2 text-sm text-white/75">
                Kota Tangerang Selatan, Banten 15310
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                <p className="text-sm text-cyan-100">Telepon</p>
                <p className="mt-2 text-lg font-bold">0877-7271-9168</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                <p className="text-sm text-cyan-100">Email</p>
                <p className="mt-2 break-all text-sm font-semibold">
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
            className="brand-card p-5"
          >
            <p className="text-3xl font-bold text-violet-800 dark:text-violet-100">{item.value}</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.label}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="brand-eyebrow text-sm font-semibold uppercase tracking-[0.22em]">
            Jadwal Pelayanan
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950 md:text-3xl dark:text-white">
            Jadwal Ibadah
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Informasi jadwal utama untuk jemaat dan pengunjung.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {schedules.map((item) => (
            <div
              key={item.title}
              className="brand-card p-5"
            >
              <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
                {item.title}
              </h3>
              <span className="mt-3 inline-flex rounded-full bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-200">
                {item.time}
              </span>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {visionPoints.map((item) => (
          <div
            key={item.title}
            className="brand-card p-6"
          >
            <p className="brand-eyebrow text-sm font-semibold uppercase tracking-[0.22em]">
              Visi
            </p>
            <h3 className="mt-2 text-xl font-bold text-slate-950 dark:text-white">
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {item.description}
            </p>
          </div>
        ))}
      </section>

      <section className="brand-card rounded-3xl p-6 md:p-8">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="brand-eyebrow text-sm font-semibold uppercase tracking-[0.22em]">
              Pelayanan Gereja
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950 md:text-3xl dark:text-white">
              Pelayanan Gereja AMIN Tangerang Raya
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {services.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-violet-100 bg-violet-50/50 px-4 py-4 text-sm font-semibold text-slate-700 dark:border-violet-950/60 dark:bg-violet-950/20 dark:text-slate-200"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="brand-card rounded-3xl p-6 md:p-8">
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <div>
            <p className="brand-eyebrow text-sm font-semibold uppercase tracking-[0.22em]">
              Tentang Gereja
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950 md:text-3xl dark:text-white">
              Bagian dari Sinode Gereja AMIN
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Gereja AMIN Jemaat Tangerang Raya berdiri pada 24 September 2023 dan
              menjadi pusat persekutuan, pelayanan, dan pembinaan jemaat di Tangerang Raya.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href="/publikasi"
              className="brand-button-primary inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition"
            >
              Lihat Publikasi
            </a>
            <a
              href="/kontak"
              className="brand-button-secondary inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition"
            >
              Hubungi Kami
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
