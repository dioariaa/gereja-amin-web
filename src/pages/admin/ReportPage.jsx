import { useMemo, useState } from "react";
import { FileDown, Filter, Printer, Wallet } from "lucide-react";
import ActionButton from "../../components/admin/ActionButton";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import DataSourceNotice from "../../components/admin/DataSourceNotice";
import FilterPanel from "../../components/admin/FilterPanel";
import FormField from "../../components/admin/FormField";
import StatusBadge from "../../components/admin/StatusBadge";
import SummaryCard from "../../components/admin/SummaryCard";
import {
  expenseCategories,
  formatCurrency,
  formatNumber,
  formatShortFinanceDate,
  getFinanceSummary,
  incomeCategories,
  listFinanceTransactions,
} from "../../services/financeService";
import useFinanceTransactions from "../../hooks/useFinanceTransactions";

const monthOptions = [
  { label: "Januari", value: "01" },
  { label: "Februari", value: "02" },
  { label: "Maret", value: "03" },
  { label: "April", value: "04" },
  { label: "Mei", value: "05" },
  { label: "Juni", value: "06" },
  { label: "Juli", value: "07" },
  { label: "Agustus", value: "08" },
  { label: "September", value: "09" },
  { label: "Oktober", value: "10" },
  { label: "November", value: "11" },
  { label: "Desember", value: "12" },
];

const currentDate = new Date();
const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
const currentYear = String(currentDate.getFullYear());

export default function ReportPage() {
  const {
    error: dataError,
    loading: dataLoading,
    source: dataSource,
    transactions: savedTransactions,
  } = useFinanceTransactions();
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);

  const selectedMonth = monthOptions.find((item) => item.value === month) || monthOptions[0];
  const periodStart = `${year}-${month}-01`;
  const activeTransactions = useMemo(
    () =>
      listFinanceTransactions(savedTransactions)
        .filter((item) => item.status !== "Draft"),
    [savedTransactions]
  );
  const openingTransactions = useMemo(
    () => activeTransactions.filter((item) => item.date && item.date < periodStart),
    [activeTransactions, periodStart]
  );
  const transactions = useMemo(
    () => activeTransactions.filter((item) => item.date?.startsWith(`${year}-${month}`)),
    [activeTransactions, month, year]
  );
  const receiptRows = useMemo(
    () => buildReportRows(transactions, "Masuk", incomeCategories),
    [transactions]
  );
  const expenseRows = useMemo(
    () => buildReportRows(transactions, "Keluar", expenseCategories),
    [transactions]
  );

  const totals = useMemo(() => {
    const periodOpeningBalance = getFinanceSummary(openingTransactions).balance;
    const receiptTotals = getCategoryTotals(incomeCategories, receiptRows);
    const expenseTotals = getCategoryTotals(expenseCategories, expenseRows);
    const receiptTotal = sumValues(receiptTotals);
    const expenseTotal = sumValues(expenseTotals);
    const balance = periodOpeningBalance + receiptTotal - expenseTotal;

    return {
      balance,
      expenseTotal,
      expenseTotals,
      openingBalance: periodOpeningBalance,
      receiptTotal,
      receiptTotals,
    };
  }, [expenseRows, openingTransactions, receiptRows]);

  const exportCsv = () => {
    const rows = [
      ["BUKU KAS DAN BANK TABELARIS"],
      ["GEREJA AMIN JEMAAT TANGERANG RAYA"],
      [`BULAN: ${selectedMonth.label.toUpperCase()}`, `TAHUN: ${year}`],
      [],
      ["PENERIMAAN"],
      ["Tanggal", "Uraian", "Nomor Bukti", ...incomeCategories, "Jumlah"],
      ...receiptRows.map((row) => [
        row.date,
        row.description,
        row.proof,
        ...incomeCategories.map((category) => row.values[category] || 0),
        getRowTotal(row),
      ]),
      ["Jumlah Penerimaan Bulan Ini", "", "", ...incomeCategories.map((category) => totals.receiptTotals[category]), totals.receiptTotal],
      [],
      ["PENGELUARAN"],
      ["Tanggal", "Uraian Pengeluaran", "Nomor Bukti", ...expenseCategories, "Jumlah"],
      ...expenseRows.map((row) => [
        row.date,
        row.description,
        row.proof,
        ...expenseCategories.map((category) => row.values[category] || 0),
        getRowTotal(row),
      ]),
      ["Jumlah Pengeluaran Bulan Ini", "", "", ...expenseCategories.map((category) => totals.expenseTotals[category]), totals.expenseTotal],
      ["Saldo Bulan Lalu", totals.openingBalance],
      ["Saldo Bulan Ini", totals.balance],
    ];

    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([`\ufeff${csv}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `laporan-kas-tabelaris-${selectedMonth.label}-${year}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-7">
      <AdminPageHeader
        eyebrow="Laporan Kas"
        title="Buku Kas dan Bank Tabelaris"
        description="Format laporan mengikuti referensi Excel dan dihitung dari transaksi kas yang sama dengan Cashflow."
        meta={<StatusBadge value={dataSource === "supabase" ? "Supabase" : "LocalStorage"} />}
        actions={
          <>
            <ActionButton icon={Printer} onClick={() => window.print()}>
              Cetak
            </ActionButton>
            <ActionButton variant="primary" icon={FileDown} onClick={exportCsv}>
              Export CSV
            </ActionButton>
          </>
        }
      />

      <DataSourceNotice
        error={dataError}
        label="laporan kas"
        loading={dataLoading}
        source={dataSource}
      />

      <FilterPanel columns="md:grid-cols-3">
        <FormField label="Bulan">
          <select value={month} onChange={(event) => setMonth(event.target.value)} className="input-base">
            {monthOptions.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Tahun">
          <input value={year} onChange={(event) => setYear(event.target.value)} className="input-base" />
        </FormField>
        <div className="flex items-end">
          <ActionButton variant="primary" icon={Filter} className="w-full">
            Periode {selectedMonth.label} {year}
          </ActionButton>
        </div>
      </FilterPanel>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Saldo Bulan Lalu" value={formatCurrency(totals.openingBalance)} description="Dihitung dari transaksi sebelum periode." icon={Wallet} />
        <SummaryCard title="Penerimaan Bulan Ini" value={formatCurrency(totals.receiptTotal)} description={`${receiptRows.length} transaksi masuk.`} icon={Wallet} tone="success" />
        <SummaryCard title="Pengeluaran Bulan Ini" value={formatCurrency(totals.expenseTotal)} description={`${expenseRows.length} transaksi keluar.`} icon={Wallet} tone="danger" />
        <SummaryCard title="Saldo Bulan Ini" value={formatCurrency(totals.balance)} description="Saldo akhir tabelaris." icon={Wallet} />
      </section>

      <section className="kkj-print-area print-area brand-card overflow-hidden p-4 md:p-6 print:rounded-none print:border-0 print:p-0 print:shadow-none">
        <div className="mb-5 text-center text-slate-950 dark:text-white print:text-slate-950">
          <h2 className="text-xl font-bold uppercase tracking-wide">Buku Kas dan Bank Tabelaris</h2>
          <p className="mt-1 text-sm font-semibold uppercase">Gereja AMIN Jemaat Tangerang Raya</p>
          <p className="mt-1 text-sm uppercase">Bulan: {selectedMonth.label} | Tahun: {year}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[2200px] border-collapse text-left text-[11px] text-slate-950 dark:text-slate-100 print:text-slate-950">
            <thead>
              <tr>
                <th colSpan={incomeCategories.length + 4} className="border border-slate-400 bg-violet-50 px-2 py-2 text-center text-sm uppercase print:bg-white">
                  Penerimaan (Rp)
                </th>
                <th className="w-3 border-y border-slate-400 bg-slate-100 print:bg-white" />
                <th colSpan={expenseCategories.length + 4} className="border border-slate-400 bg-cyan-50 px-2 py-2 text-center text-sm uppercase print:bg-white">
                  Pengeluaran (Rp)
                </th>
              </tr>
              <tr className="align-bottom">
                <ReportHead label="Tgl/Bln" rowSpan={2} />
                <ReportHead label="Uraian" rowSpan={2} />
                <ReportHead label="Nomor Bukti" rowSpan={2} />
                {incomeCategories.map((category) => (
                  <ReportHead key={category} label={category} rotate />
                ))}
                <ReportHead label="Jumlah (4 s/d 15)" rowSpan={2} />
                <th className="border-y border-slate-400 bg-slate-100 print:bg-white" rowSpan={2} />
                <ReportHead label="Tgl/Bln" rowSpan={2} />
                <ReportHead label="Uraian Pengeluaran" rowSpan={2} />
                <ReportHead label="Nomor Bukti" rowSpan={2} />
                {expenseCategories.map((category) => (
                  <ReportHead key={category} label={category} rotate />
                ))}
                <ReportHead label="Jumlah (17 s/d 30)" rowSpan={2} />
              </tr>
              <tr>
                {incomeCategories.map((category, index) => (
                  <ReportNumber key={category} value={index + 4} />
                ))}
                {expenseCategories.map((category, index) => (
                  <ReportNumber key={category} value={index + 20} />
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: Math.max(receiptRows.length, expenseRows.length, 1) }).map((_, index) => {
                const receipt = receiptRows[index];
                const expense = expenseRows[index];

                return (
                  <tr key={`report-row-${index}`} className="align-top">
                    <ReportCell>{receipt?.date || ""}</ReportCell>
                    <ReportCell>{receipt?.description || ""}</ReportCell>
                    <ReportCell>{receipt?.proof || ""}</ReportCell>
                    {incomeCategories.map((category) => (
                      <ReportMoney key={category} value={receipt?.values[category]} />
                    ))}
                    <ReportMoney value={receipt ? getRowTotal(receipt) : 0} strong />
                    <td className="border-y border-slate-300 bg-slate-50 print:bg-white" />
                    <ReportCell>{expense?.date || ""}</ReportCell>
                    <ReportCell>{expense?.description || ""}</ReportCell>
                    <ReportCell>{expense?.proof || ""}</ReportCell>
                    {expenseCategories.map((category) => (
                      <ReportMoney key={category} value={expense?.values[category]} />
                    ))}
                    <ReportMoney value={expense ? getRowTotal(expense) : 0} strong />
                  </tr>
                );
              })}

              <tr className="font-bold">
                <ReportCell colSpan={3}>Jumlah Penerimaan Bulan ini</ReportCell>
                {incomeCategories.map((category) => (
                  <ReportMoney key={category} value={totals.receiptTotals[category]} strong />
                ))}
                <ReportMoney value={totals.receiptTotal} strong />
                <td className="border-y border-slate-400 bg-slate-50 print:bg-white" />
                <ReportCell colSpan={3}>Jumlah Pengeluaran Bulan ini</ReportCell>
                {expenseCategories.map((category) => (
                  <ReportMoney key={category} value={totals.expenseTotals[category]} strong />
                ))}
                <ReportMoney value={totals.expenseTotal} strong />
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-2xl border border-violet-100 p-5 print:border-slate-400">
            <p className="text-sm leading-7 text-slate-700 dark:text-slate-200 print:text-slate-950">
              Pada akhir periode {selectedMonth.label} {year}, Kas Umum ditutup dengan keadaan:
            </p>
            <table className="mt-4 min-w-full border-collapse text-sm">
              <tbody>
                <SummaryRow label="Jumlah Penerimaan bulan ini dan saldo bulan lalu" value={totals.openingBalance + totals.receiptTotal} />
                <SummaryRow label="Jumlah Pengeluaran bulan ini" value={totals.expenseTotal} />
                <SummaryRow label="Total Saldo Rekening Kas Jemaat" value={totals.balance} strong />
              </tbody>
            </table>
          </div>

          <div className="rounded-2xl border border-violet-100 p-5 text-center print:border-slate-400">
            <p className="text-sm font-semibold uppercase text-slate-950 dark:text-white print:text-slate-950">
              Badan Pekerja Harian Majelis Jemaat Tangerang Raya
            </p>
            <div className="mt-12 grid gap-8 sm:grid-cols-2">
              <Signature name="SNK. KECITAAN HAREFA, S.Kom., M.Kom" role="Ketua I" />
              <Signature name="SNK. MARETI WARUWU, S.H., M.H." role="Bendahara" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ReportHead({ label, rotate = false, rowSpan }) {
  return (
    <th
      rowSpan={rowSpan}
      className={`border border-slate-400 bg-violet-50 px-2 py-2 text-center font-semibold print:bg-white ${
        rotate ? "min-w-24 max-w-28 align-bottom text-[10px] leading-4" : "min-w-20"
      }`}
    >
      {label}
    </th>
  );
}

function ReportNumber({ value }) {
  return (
    <th className="border border-slate-400 px-2 py-1 text-center font-semibold">
      {value}
    </th>
  );
}

function ReportCell({ children, colSpan = 1 }) {
  return (
    <td colSpan={colSpan} className="border border-slate-300 px-2 py-2">
      {children}
    </td>
  );
}

function ReportMoney({ value = 0, strong = false }) {
  return (
    <td className={`border border-slate-300 px-2 py-2 text-right ${strong ? "font-bold" : ""}`}>
      {value ? formatNumber(value) : "-"}
    </td>
  );
}

function SummaryRow({ label, value, strong = false }) {
  return (
    <tr className={strong ? "font-bold" : ""}>
      <td className="border border-slate-300 px-3 py-2 text-slate-700 dark:text-slate-200 print:text-slate-950">
        {label}
      </td>
      <td className="border border-slate-300 px-3 py-2 text-right text-slate-950 dark:text-white print:text-slate-950">
        {formatCurrency(value)}
      </td>
    </tr>
  );
}

function Signature({ name, role }) {
  return (
    <div>
      <div className="h-16" />
      <p className="text-sm font-bold text-slate-950 dark:text-white print:text-slate-950">{name}</p>
      <p className="text-sm text-slate-600 dark:text-slate-300 print:text-slate-950">{role}</p>
    </div>
  );
}

function buildReportRows(transactions, type, categories) {
  return transactions
    .filter((item) => item.type === type)
    .map((item) => {
      const category = categories.includes(item.category) ? item.category : categories.at(-1);
      return {
        date: formatShortFinanceDate(item.date).toUpperCase(),
        description: item.description || item.category,
        proof: item.proof || "-",
        values: {
          [category]: item.amount,
        },
      };
    });
}

function getCategoryTotals(categories, rows) {
  return categories.reduce((acc, category) => {
    acc[category] = rows.reduce((total, row) => total + (row.values[category] || 0), 0);
    return acc;
  }, {});
}

function getRowTotal(row) {
  return Object.values(row.values).reduce((total, value) => total + value, 0);
}

function sumValues(values) {
  return Object.values(values).reduce((total, value) => total + value, 0);
}
