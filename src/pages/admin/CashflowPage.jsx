const summary = [
  { title: "Total Kas Masuk", value: "Rp 25.800.000" },
  { title: "Total Kas Keluar", value: "Rp 13.450.000" },
  { title: "Saldo Akhir", value: "Rp 12.350.000" },
  { title: "Jumlah Transaksi", value: "38" },
];

const transactions = [
  {
    date: "22 Mei 2026",
    type: "Masuk",
    category: "Persembahan Minggu",
    account: "Kas Umum",
    description: "Ibadah Minggu pagi",
    amount: "Rp 2.500.000",
    status: "Selesai",
  },
  {
    date: "21 Mei 2026",
    type: "Keluar",
    category: "Operasional Gereja",
    account: "Kas Umum",
    description: "Pembelian perlengkapan gereja",
    amount: "Rp 750.000",
    status: "Selesai",
  },
  {
    date: "20 Mei 2026",
    type: "Masuk",
    category: "Perpuluhan",
    account: "Kas Umum",
    description: "Setoran jemaat",
    amount: "Rp 1.800.000",
    status: "Selesai",
  },
  {
    date: "19 Mei 2026",
    type: "Keluar",
    category: "Kegiatan Pemuda",
    account: "Kas Pemuda",
    description: "Dana kegiatan pemuda",
    amount: "Rp 500.000",
    status: "Pending",
  },
  {
    date: "18 Mei 2026",
    type: "Masuk",
    category: "Dana Pembangunan",
    account: "Kas Pembangunan",
    description: "Donasi pembangunan",
    amount: "Rp 3.200.000",
    status: "Draft",
  },
];

function statusClass(status) {
  if (status === "Selesai") {
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
  }

  if (status === "Pending") {
    return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
  }

  return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200";
}

function typeClass(type) {
  if (type === "Masuk") {
    return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
  }

  return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300";
}

export default function CashflowPage() {
  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Cashflow
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            Ringkasan aliran kas gereja
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
            Kelola seluruh transaksi kas masuk dan kas keluar gereja dalam satu halaman
            dengan filter, ringkasan, dan akses cepat ke form input transaksi.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="/admin/income"
            className="rounded-xl bg-slate-900 px-5 py-3 text-center text-sm font-semibold text-white transition hover:opacity-90 dark:bg-slate-100 dark:text-slate-900"
          >
            Tambah Kas Masuk
          </a>
          <a
            href="/admin/expense"
            className="rounded-xl border border-slate-300 px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Tambah Kas Keluar
          </a>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
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

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
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
              Jenis
            </label>
            <select className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white">
              <option>Semua</option>
              <option>Masuk</option>
              <option>Keluar</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Akun Kas
            </label>
            <select className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white">
              <option>Semua Akun</option>
              <option>Kas Umum</option>
              <option>Kas Pembangunan</option>
              <option>Kas Diakonia</option>
              <option>Kas Pemuda</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-slate-100 dark:text-slate-900"
            >
              Filter Data
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Daftar Transaksi
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              Semua transaksi kas
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
                  Akun Kas
                </th>
                <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">
                  Keterangan
                </th>
                <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">
                  Nominal
                </th>
                <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((item, index) => (
                <tr
                  key={`${item.date}-${item.category}-${index}`}
                  className="border-b border-slate-100 dark:border-slate-800"
                >
                  <td className="px-3 py-4 text-slate-700 dark:text-slate-200">
                    {item.date}
                  </td>
                  <td className="px-3 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${typeClass(item.type)}`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-slate-700 dark:text-slate-200">
                    {item.category}
                  </td>
                  <td className="px-3 py-4 text-slate-700 dark:text-slate-200">
                    {item.account}
                  </td>
                  <td className="px-3 py-4 text-slate-700 dark:text-slate-200">
                    {item.description}
                  </td>
                  <td className="px-3 py-4 font-semibold text-slate-900 dark:text-white">
                    {item.amount}
                  </td>
                  <td className="px-3 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(item.status)}`}
                    >
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