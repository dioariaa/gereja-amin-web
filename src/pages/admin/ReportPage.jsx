const summaryCards = [
  { title: "Saldo Awal", value: "Rp 10.000.000" },
  { title: "Total Kas Masuk", value: "Rp 12.500.000" },
  { title: "Total Kas Keluar", value: "Rp 7.250.000" },
  { title: "Saldo Akhir", value: "Rp 15.250.000" },
];

const reportRows = [
  {
    date: "01 Mei 2026",
    type: "Masuk",
    category: "Persembahan Minggu",
    description: "Ibadah umum minggu pertama",
    amount: "Rp 2.500.000",
  },
  {
    date: "05 Mei 2026",
    type: "Keluar",
    category: "Operasional",
    description: "Pembelian alat kebersihan",
    amount: "Rp 450.000",
  },
  {
    date: "10 Mei 2026",
    type: "Masuk",
    category: "Perpuluhan",
    description: "Setoran jemaat",
    amount: "Rp 1.800.000",
  },
  {
    date: "12 Mei 2026",
    type: "Keluar",
    category: "Diakonia",
    description: "Bantuan sosial jemaat",
    amount: "Rp 1.000.000",
  },
  {
    date: "18 Mei 2026",
    type: "Masuk",
    category: "Dana Pembangunan",
    description: "Donasi pembangunan gereja",
    amount: "Rp 3.200.000",
  },
];

export default function ReportPage() {
  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Laporan Kas
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
          Ringkasan laporan keuangan gereja
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          Halaman ini menampilkan filter laporan, total pemasukan, total pengeluaran,
          dan daftar transaksi berdasarkan periode tertentu.
        </p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Tanggal Mulai
            </label>
            <input
              type="date"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Tanggal Akhir
            </label>
            <input
              type="date"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Jenis Transaksi
            </label>
            <select className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white">
              <option>Semua</option>
              <option>Kas Masuk</option>
              <option>Kas Keluar</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-slate-100 dark:text-slate-900"
            >
              Tampilkan Laporan
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((item) => (
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

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Detail Laporan
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              Daftar transaksi
            </h2>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Export PDF
            </button>
            <button
              type="button"
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Export Excel
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">
                  Tanggal
                </th>
                <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">
                  Jenis
                </th>
                <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">
                  Kategori
                </th>
                <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">
                  Keterangan
                </th>
                <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">
                  Nominal
                </th>
              </tr>
            </thead>
            <tbody>
              {reportRows.map((item, index) => (
                <tr
                  key={`${item.date}-${item.category}-${index}`}
                  className="border-b border-slate-100 dark:border-slate-800"
                >
                  <td className="px-3 py-4 text-slate-700 dark:text-slate-200">{item.date}</td>
                  <td className="px-3 py-4 text-slate-700 dark:text-slate-200">{item.type}</td>
                  <td className="px-3 py-4 text-slate-700 dark:text-slate-200">{item.category}</td>
                  <td className="px-3 py-4 text-slate-700 dark:text-slate-200">
                    {item.description}
                  </td>
                  <td className="px-3 py-4 font-semibold text-slate-900 dark:text-white">
                    {item.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}