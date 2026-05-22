const stats = [
  { title: "Total Artikel", value: "24" },
  { title: "Kas Masuk Bulan Ini", value: "Rp 12.500.000" },
  { title: "Kas Keluar Bulan Ini", value: "Rp 7.250.000" },
  { title: "Saldo Saat Ini", value: "Rp 5.250.000" },
];

const recentTransactions = [
  {
    date: "22 Mei 2026",
    type: "Kas Masuk",
    category: "Persembahan Minggu",
    amount: "Rp 2.500.000",
    status: "Selesai",
  },
  {
    date: "21 Mei 2026",
    type: "Kas Keluar",
    category: "Operasional Gereja",
    amount: "Rp 750.000",
    status: "Selesai",
  },
  {
    date: "20 Mei 2026",
    type: "Kas Masuk",
    category: "Perpuluhan",
    amount: "Rp 1.800.000",
    status: "Selesai",
  },
  {
    date: "19 Mei 2026",
    type: "Kas Keluar",
    category: "Kegiatan Pemuda",
    amount: "Rp 500.000",
    status: "Pending",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Dashboard Admin
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
          Ringkasan website dan aliran kas
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          Halaman ini menampilkan ringkasan data artikel, pemasukan, pengeluaran,
          dan transaksi terbaru gereja.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-sm text-slate-500 dark:text-slate-400">{item.title}</p>
            <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
              {item.value}
            </p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Transaksi Terbaru
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                Aktivitas keuangan terakhir
              </h2>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Tanggal</th>
                  <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Jenis</th>
                  <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Kategori</th>
                  <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Nominal</th>
                  <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((item, index) => (
                  <tr
                    key={`${item.date}-${item.category}-${index}`}
                    className="border-b border-slate-100 dark:border-slate-800"
                  >
                    <td className="px-3 py-4 text-slate-700 dark:text-slate-200">{item.date}</td>
                    <td className="px-3 py-4 text-slate-700 dark:text-slate-200">{item.type}</td>
                    <td className="px-3 py-4 text-slate-700 dark:text-slate-200">{item.category}</td>
                    <td className="px-3 py-4 font-semibold text-slate-900 dark:text-white">{item.amount}</td>
                    <td className="px-3 py-4">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Akses Cepat
            </p>
            <div className="mt-5 grid gap-3">
              <a
                href="/admin/income"
                className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-slate-100 dark:text-slate-900"
              >
                Input Kas Masuk
              </a>
              <a
                href="/admin/expense"
                className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Input Kas Keluar
              </a>
              <a
                href="/admin/reports"
                className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Lihat Laporan
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Catatan
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Data di dashboard ini masih dummy. Nanti tinggal disambungkan ke API
              atau database online untuk menampilkan angka real.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}