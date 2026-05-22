const recentIncome = [
  {
    date: "22 Mei 2026",
    category: "Persembahan Minggu",
    source: "Ibadah Umum",
    amount: "Rp 2.500.000",
    status: "Selesai",
  },
  {
    date: "20 Mei 2026",
    category: "Perpuluhan",
    source: "Jemaat",
    amount: "Rp 1.800.000",
    status: "Selesai",
  },
  {
    date: "18 Mei 2026",
    category: "Dana Pembangunan",
    source: "Donatur",
    amount: "Rp 3.200.000",
    status: "Pending",
  },
];

export default function IncomePage() {
  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Kas Masuk
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
          Input transaksi kas masuk
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          Catat pemasukan gereja seperti persembahan, perpuluhan, donasi, dan dana khusus
          dengan data yang rapi dan mudah dilacak.
        </p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Form Kas Masuk</h2>

        <form className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Tanggal Transaksi
            </label>
            <input
              type="date"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Akun Kas
            </label>
            <select className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white">
              <option>Kas Umum</option>
              <option>Kas Pembangunan</option>
              <option>Kas Diakonia</option>
              <option>Kas Pemuda</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Kategori
            </label>
            <select className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white">
              <option>Persembahan Minggu</option>
              <option>Perpuluhan</option>
              <option>Donasi</option>
              <option>Dana Pembangunan</option>
              <option>Sumbangan Khusus</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Sumber Dana
            </label>
            <input
              type="text"
              placeholder="Contoh: Jemaat / Persembahan Ibadah"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Nominal
            </label>
            <input
              type="number"
              placeholder="Masukkan nominal"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Status
            </label>
            <select className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white">
              <option>Draft</option>
              <option>Pending</option>
              <option>Selesai</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Keterangan
            </label>
            <textarea
              rows="4"
              placeholder="Tulis keterangan transaksi"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Upload Bukti Transaksi
            </label>
            <input
              type="file"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-white dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:file:bg-slate-100 dark:file:text-slate-900"
            />
          </div>

          <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
            >
              Simpan Kas Masuk
            </button>
            <a
              href="/admin/cashflow"
              className="rounded-xl border border-slate-300 px-5 py-3 text-center text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
            >
              Kembali
            </a>
          </div>
        </form>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Transaksi Kas Masuk Terbaru
        </h2>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Tanggal</th>
                <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Kategori</th>
                <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Sumber</th>
                <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Nominal</th>
                <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentIncome.map((item, index) => (
                <tr
                  key={`${item.date}-${item.category}-${index}`}
                  className="border-b border-slate-100 dark:border-slate-800"
                >
                  <td className="px-3 py-4 text-slate-700 dark:text-slate-200">{item.date}</td>
                  <td className="px-3 py-4 text-slate-700 dark:text-slate-200">{item.category}</td>
                  <td className="px-3 py-4 text-slate-700 dark:text-slate-200">{item.source}</td>
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
      </section>
    </div>
  );
}