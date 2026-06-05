import { Info, Mail, MapPin, MessageCircle, Phone, Settings } from "lucide-react";
import PublicAdminActionBar from "../../components/public/PublicAdminActionBar";

export default function ContactPage() {
  const contactCards = [
    {
      icon: MapPin,
      title: "Alamat Gereja",
      value:
        "Kp. Maruga, Jl. Pembangunan, Kel. Ciater, Kec. Serpong, Kota Tangerang Selatan, Banten 15310",
    },
    {
      icon: Phone,
      title: "Telepon / WhatsApp",
      value: "0877-7271-9168",
      href: "https://wa.me/6287772719168",
    },
    {
      icon: Mail,
      title: "Email",
      value: "gerejaamintangerangraya@gmail.com",
      href: "mailto:gerejaamintangerangraya@gmail.com",
    },
  ];

  const schedules = [
    { title: "Ibadah Umum", time: "Minggu, 10:00 - 12:00" },
    { title: "Ibadah Pemuda & Remaja", time: "Sabtu, 19:00 - 21:00" },
    { title: "Ibadah Sekolah Minggu", time: "Minggu, 10:00 - 12:00" },
    { title: "Ibadah Sektor & Komisi", time: "Sesuai jadwal masing-masing" },
  ];

  return (
    <div className="space-y-10">
      <PublicAdminActionBar
        title="Kelola informasi kontak"
        description="Aksi untuk memperbarui alamat, telepon, email, maps, dan sosial media gereja."
        actions={[
          {
            label: "Kelola Kontak",
            to: "/admin/content/contact",
            icon: Info,
            variant: "primary",
          },
          {
            label: "Ubah Info Gereja",
            to: "/admin/content/contact?action=ubah-info-gereja",
            icon: Settings,
          },
        ]}
      />

      <section className="brand-card rounded-3xl px-6 py-10 md:px-10 md:py-14">
        <p className="brand-eyebrow text-sm font-semibold uppercase tracking-[0.22em]">
          Kontak
        </p>
        <h1 className="mt-3 max-w-4xl text-3xl font-bold text-slate-950 md:text-5xl dark:text-white">
          Hubungi Gereja AMIN Jemaat Tangerang Raya
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 md:text-base dark:text-slate-300">
          Jemaat dan pengunjung dapat menghubungi gereja untuk informasi ibadah,
          pelayanan, publikasi, maupun kebutuhan administrasi.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {contactCards.map(({ icon: Icon, ...item }) => (
          <div
            key={item.title}
            className="brand-card p-6"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-200">
              <Icon size={20} />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-slate-950 dark:text-white">
              {item.title}
            </h2>
            {item.href ? (
              <a
                href={item.href}
                className="mt-3 block break-words text-sm leading-7 text-slate-600 underline underline-offset-4 dark:text-slate-300"
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

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="brand-card rounded-3xl p-6 md:p-8">
          <p className="brand-eyebrow text-sm font-semibold uppercase tracking-[0.22em]">
            Jadwal Ibadah
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
            Waktu pelayanan gereja
          </h2>

          <div className="mt-6 space-y-4">
            {schedules.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-violet-100 bg-violet-50/40 p-4 dark:border-violet-950/60 dark:bg-violet-950/20"
              >
                <h3 className="text-base font-semibold text-slate-950 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {item.time}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="brand-card rounded-3xl p-6 md:p-8">
          <p className="brand-eyebrow text-sm font-semibold uppercase tracking-[0.22em]">
            Lokasi
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
            Peta lokasi gereja
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Bagian ini dapat diganti dengan embed Google Maps ketika link lokasi resmi
            sudah tersedia.
          </p>

          <div className="mt-6 flex aspect-video items-center justify-center rounded-2xl border border-dashed border-cyan-200 bg-cyan-50/60 text-center text-sm text-cyan-700 dark:border-cyan-950/60 dark:bg-cyan-950/20 dark:text-cyan-200">
            Embed Google Maps belum diaktifkan
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <a
              href="https://wa.me/6287772719168"
              className="brand-button-primary inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition"
            >
              <MessageCircle size={17} />
              Chat WhatsApp
            </a>
            <a
              href="mailto:gerejaamintangerangraya@gmail.com"
              className="brand-button-secondary inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition"
            >
              <Mail size={17} />
              Kirim Email
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
