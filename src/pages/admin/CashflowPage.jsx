import { useMemo, useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, FileDown, Filter, Wallet } from "lucide-react";
import ActionButton from "../../components/admin/ActionButton";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import DataTable from "../../components/admin/DataTable";
import DataSourceNotice from "../../components/admin/DataSourceNotice";
import FilterPanel from "../../components/admin/FilterPanel";
import FormField from "../../components/admin/FormField";
import StatusBadge from "../../components/admin/StatusBadge";
import SummaryCard from "../../components/admin/SummaryCard";
import {
  cashAccounts,
  filterFinanceTransactions,
  formatCurrency,
  formatFinanceDate,
  getFinanceSummary,
  listFinanceTransactions,
} from "../../services/financeService";
import useFinanceTransactions from "../../hooks/useFinanceTransactions";

function escapeCsvValue(value) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

export default function CashflowPage() {
  const {
    error: dataError,
    loading: dataLoading,
    transactions: savedTransactions,
  } = useFinanceTransactions();
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    type: "Semua",
    account: "Semua Akun",
  });

  const transactions = useMemo(
    () => listFinanceTransactions(savedTransactions),
    [savedTransactions]
  );
  const summary = useMemo(() => getFinanceSummary(transactions), [transactions]);

  const filteredTransactions = useMemo(
    () =>
      filterFinanceTransactions(transactions, filters),
    [filters, transactions]
  );

  const updateFilter = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      type: "Semua",
      account: "Semua Akun",
    });
  };

  const exportTransactionsCsv = () => {
    const header = ["Tanggal", "Jenis", "Kategori", "Akun Kas", "Keterangan", "Nominal", "Status"];
    const rows = filteredTransactions.map((item) => [
      formatFinanceDate(item.date),
      item.type,
      item.category,
      item.account,
      item.description,
      formatCurrency(item.amount),
      item.status,
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map(escapeCsvValue).join(","))
      .join("\n");
    const blob = new Blob([`\ufeff${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "cashflow-gereja-amin.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-7">
      <AdminPageHeader
        eyebrow="Cashflow"
        title="Ringkasan aliran kas gereja"
        description="Kelola transaksi kas masuk dan kas keluar dalam satu halaman dengan filter, ringkasan, dan akses cepat ke form input transaksi."
        actions={
          <>
            <ActionButton to="/admin/income" variant="primary" icon={ArrowDownCircle}>
              Tambah Kas Masuk
            </ActionButton>
            <ActionButton to="/admin/expense" icon={ArrowUpCircle}>
              Tambah Kas Keluar
            </ActionButton>
          </>
        }
      />

      <DataSourceNotice
        error={dataError}
        label="transaksi kas"
        loading={dataLoading}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Total Kas Masuk" value={formatCurrency(summary.totalIncome)} icon={ArrowDownCircle} tone="success" />
        <SummaryCard title="Total Kas Keluar" value={formatCurrency(summary.totalExpense)} icon={ArrowUpCircle} tone="danger" />
        <SummaryCard title="Saldo Akhir" value={formatCurrency(summary.balance)} icon={Wallet} />
        <SummaryCard title="Jumlah Transaksi" value={summary.count} icon={Filter} />
      </section>

      <FilterPanel columns="md:grid-cols-2 xl:grid-cols-5">
        <FormField label="Tanggal Mulai">
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={updateFilter}
            className="input-base"
          />
        </FormField>
        <FormField label="Tanggal Akhir">
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={updateFilter}
            className="input-base"
          />
        </FormField>
        <FormField label="Jenis">
          <select name="type" value={filters.type} onChange={updateFilter} className="input-base">
            <option>Semua</option>
            <option>Masuk</option>
            <option>Keluar</option>
          </select>
        </FormField>
        <FormField label="Akun Kas">
          <select name="account" value={filters.account} onChange={updateFilter} className="input-base">
            <option>Semua Akun</option>
            {cashAccounts.map((account) => (
              <option key={account}>{account}</option>
            ))}
          </select>
        </FormField>
        <div className="flex items-end">
          <ActionButton variant="primary" icon={Filter} className="w-full" onClick={resetFilters}>
            Reset Filter
          </ActionButton>
        </div>
      </FilterPanel>

      <div className="print-area">
        <DataTable
          eyebrow="Daftar Transaksi"
          title="Semua transaksi kas"
          actions={
            <>
              <ActionButton icon={FileDown} onClick={() => window.print()}>
                Cetak PDF
              </ActionButton>
              <ActionButton icon={FileDown} onClick={exportTransactionsCsv}>
                Export CSV
              </ActionButton>
            </>
          }
        >
          <table className="min-w-[960px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Tanggal</th>
                <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Jenis</th>
                <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Kategori</th>
                <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Akun Kas</th>
                <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Keterangan</th>
                <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Nominal</th>
                <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((item) => (
                <tr
                  key={item.id}
                  className="brand-table-row border-b border-slate-100 transition dark:border-slate-800"
                >
                  <td className="px-3 py-4 text-slate-700 dark:text-slate-200">
                    {formatFinanceDate(item.date)}
                  </td>
                  <td className="px-3 py-4">
                    <StatusBadge value={item.type} />
                  </td>
                  <td className="px-3 py-4 font-medium text-slate-900 dark:text-white">
                    {item.category}
                  </td>
                  <td className="px-3 py-4 text-slate-700 dark:text-slate-200">{item.account}</td>
                  <td className="px-3 py-4 text-slate-700 dark:text-slate-200">
                    {item.description}
                  </td>
                  <td className="px-3 py-4 text-right font-bold text-slate-950 dark:text-white">
                    {formatCurrency(item.amount)}
                  </td>
                  <td className="px-3 py-4">
                    <StatusBadge value={item.status} />
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                    Tidak ada transaksi yang cocok dengan filter.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </DataTable>
      </div>
    </div>
  );
}
