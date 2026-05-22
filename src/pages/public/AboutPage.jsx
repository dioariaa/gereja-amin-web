import { User } from "lucide-react";

function PersonCard({ role, name, photo = "" }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        {photo ? (
          <img
            src={photo}
            alt={name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-slate-400 dark:text-slate-500">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm dark:bg-slate-900">
              <User size={28} />
            </div>
            <span className="text-sm font-medium">Belum ada foto</span>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <div className="p-5">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{role}</p>
        <h3 className="mt-2 text-base font-semibold leading-6 text-slate-900 dark:text-white">
          {name}
        </h3>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const bphmj = [
    {
      role: "Pendeta Jemaat",
      name: "Pdt. Niatmawati Fakho, S.Th.",
      photo: "/images/pengurus/niatmawati-fakho.jpg",
    },
    {
      role: "Ketua I",
      name: "SNK. Kecitaan Harefa, S.Kom., M.Kom.",
      photo: "/images/pengurus/kecitaan-harefa.jpg",
    },
    {
      role: "Ketua II",
      name: "SNK. Dr (Cand). Desman Berkati Larosa, S.Th., M.Th.",
      photo: "/images/pengurus/desman-larosa.jpg",
    },
    {
      role: "Sekretaris I",
      name: "SNK. Yustinus Hura, S.Th., S.H., M.H., CMLE., CPCL., CPLA.",
      photo: "/images/pengurus/yustinus-hura.jpg",
    },
    {
      role: "Sekretaris II",
      name: "SNK. Yemima Daeli, A.Md.Kep.",
      photo: "/images/pengurus/yemima-daeli.jpg",
    },
    {
      role: "Bendahara",
      name: "SNK. Mareti Waruwu, S.H., M.H.",
      photo: "/images/pengurus/mareti-waruwu.jpg",
    },
  ];

  const sectors = [
    {
      role: "Ketua Sektor Eben-Haezer",
      name: "SNK. Fatiria Daeli",
      photo: "/images/pengurus/fatiria-daeli.jpg",
    },
    {
      role: "Ketua Sektor Anugerah",
      name: "SNK. Simei Waruwu",
      photo: "/images/pengurus/simei-waruwu.jpg",
    },
    {
      role: "Ketua Sektor Betlehem",
      name: "SNK. Oktafpianus Gea",
      photo: "/images/pengurus/oktafpianus-gea.jpg",
    },
    {
      role: "Ketua Sektor Nazaret",
      name: "SNK. Fazokhi Waruwu, S.Pd., S.Th.",
      photo: "/images/pengurus/fazokhi-waruwu.jpg",
    },
  ];

  const commissions = [
    {
      role: "Ketua Komisi Pelayanan Anak",
      name: "SNK. Herlina, S.Pd.",
      photo: "/images/pengurus/herlina.jpg",
    },
    {
      role: "Ketua Komisi Pelayanan Pemuda & Remaja",
      name: "SNK. Arojasa Harefa",
      photo: "/images/pengurus/arojasa-harefa.jpg",
    },
    {
      role: "Ketua Komisi Pelayanan Perempuan",
      name: "SNK. Milika Daeli",
      photo: "/images/pengurus/milika-daeli.jpg",
    },
    {
      role: "Ketua Komisi Pelayanan Pria Kaum Bapak",
      name: "SNK. Gregorius F. Riski Gulo",
      photo: "/images/pengurus/gregorius-gulo.jpg",
    },
    {
      role: "Ketua Komisi Pelayanan Kasih",
      name: "SNK. Sisudin Waruwu",
      photo: "/images/pengurus/sisudin-waruwu.jpg",
    },
    {
      role: "Ketua Komisi Pembangunan",
      name: "SNK. Estomi Laia, S.Kom., M.M.",
      photo: "/images/pengurus/estomi-laia.jpg",
    },
    {
      role: "Ketua Komisi Pelayanan Ibadah & Musik",
      name: "SNK. Arifman Jaya Hura, S.Ak.",
      photo: "/images/pengurus/arifman-hura.jpg",
    },
    {
      role: "Ketua Komisi Pelayanan Usia Indah",
      name: "SNK. Ir. Alinur Zebua, M.M.",
      photo: "/images/pengurus/alinur-zebua.jpg",
    },
  ];

  const faithPoints = [
    "Percaya kepada Allah Tritunggal: Bapa, Anak, dan Roh Kudus.",
    "Menjunjung Alkitab sebagai dasar iman dan pedoman hidup orang percaya.",
    "Mengakui Yesus Kristus sebagai Tuhan dan Juruselamat.",
    "Mendorong jemaat hidup dalam pertobatan, kekudusan, dan kasih.",
    "Membangun gereja yang setia dalam ibadah, persekutuan, pengajaran, dan pelayanan.",
  ];

  const highlights = [
    { title: "Berdiri", value: "24 September 2023" },
    { title: "Nomor Anggota", value: "102" },
    { title: "Sinode", value: "Gereja AMIN" },
    { title: "Lokasi", value: "Tangerang Selatan" },
  ];

  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-100 to-white px-6 py-10 md:px-10 md:py-14 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Tentang Kami
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900 md:text-5xl dark:text-white">
          Gereja AMIN Jemaat Tangerang Raya
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 md:text-base dark:text-slate-300">
          Gereja AMIN Jemaat Tangerang Raya merupakan bagian dari Sinode Gereja AMIN
          yang hadir untuk membangun jemaat yang tangguh dalam iman, mandiri dalam
          pelayanan, dan peduli terhadap sesama.
        </p>
        <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
          Tangguh – Mandiri – Peduli
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {highlights.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-sm text-slate-500 dark:text-slate-400">{item.title}</p>
            <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
              {item.value}
            </p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Ringkasan Sejarah
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            Awal pelayanan jemaat
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Gereja AMIN Jemaat Tangerang Raya berdiri pada 24 September 2023 dan
            tercatat sebagai anggota Sinode Gereja AMIN dengan Nomor Anggota 102.
            Jemaat ini hadir untuk membangun kehidupan ibadah, pertumbuhan rohani,
            persekutuan, dan pelayanan jemaat secara berkelanjutan.
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Halaman ini dirancang sebagai pusat informasi untuk mengenal struktur
            pelayanan gereja, mulai dari kepengurusan inti, pengurus sektor, sampai
            komisi-komisi pelayanan.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Informasi Gereja
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            Kontak dan lokasi
          </h2>

          <div className="mt-5 space-y-4">
            <div className="rounded-2xl bg-slate-100 p-5 dark:bg-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">Alamat</p>
              <p className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-200">
                Kp. Maruga, Jl. Pembangunan, Kel. Ciater, Kec. Serpong,
                Kota Tangerang Selatan, Banten 15310
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                <p className="text-sm text-slate-500 dark:text-slate-400">Telepon</p>
                <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
                  0877-7271-9168
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
                <p className="mt-2 break-all text-sm font-semibold text-slate-900 dark:text-white">
                  gerejaamintangerangraya@gmail.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            BPHMJ
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl dark:text-white">
            Badan Pekerja Harian Majelis Jemaat
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {bphmj.map((item) => (
            <PersonCard key={item.role} role={item.role} name={item.name} photo={item.photo} />
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Sektor-Sektor
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl dark:text-white">
            Pengurus sektor / kelompok keluarga
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {sectors.map((item) => (
            <PersonCard key={item.role} role={item.role} name={item.name} photo={item.photo} />
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Komisi-Komisi
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl dark:text-white">
            Komisi pelayanan gereja
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {commissions.map((item) => (
            <PersonCard key={item.role} role={item.role} name={item.name} photo={item.photo} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Pengakuan Iman
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            Dasar keyakinan gereja
          </h2>

          <div className="mt-5 grid gap-3">
            {faithPoints.map((point) => (
              <div
                key={point}
                className="rounded-xl border border-slate-200 px-4 py-4 text-sm leading-7 text-slate-700 dark:border-slate-700 dark:text-slate-200"
              >
                {point}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Catatan Foto
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            Struktur file foto
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Simpan semua foto pengurus di folder <code>public/images/pengurus</code>.
            Kalau file belum ada, kartu akan otomatis menampilkan placeholder.
          </p>

          <div className="mt-5 rounded-2xl bg-slate-100 p-5 dark:bg-slate-800">
            <p className="text-sm leading-7 text-slate-700 dark:text-slate-200">
              Contoh path:
              <br />
              <code>/images/pengurus/niatmawati-fakho.jpg</code>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}