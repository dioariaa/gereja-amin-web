import { ArrowDownCircle, ArrowUpCircle, FileText, UsersRound, Wallet } from "lucide-react";
import ActionButton from "../../components/admin/ActionButton";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import DataTable from "../../components/admin/DataTable";
import DataSourceNotice from "../../components/admin/DataSourceNotice";
import StatusBadge from "../../components/admin/StatusBadge";
import SummaryCard from "../../components/admin/SummaryCard";
import { useAuth } from "../../contexts/authContextValue";
import { adminRoles, canAccessFinance, canManageJemaat, getRoleLabel } from "../../data/adminAccess";
import useFinanceTransactions from "../../hooks/useFinanceTransactions";
import useJemaatData from "../../hooks/useJemaatData";
import {
  formatCurrency,
  formatFinanceDate,
  getFinanceSummary,
  listFinanceTransactions,
} from "../../services/financeService";
import { getJemaatStatsFrom } from "../../services/jemaatService";
import { toTitleCase } from "../../utils/textFormat";

export default function DashboardPage() {
  const { user } = useAuth();
  const role = user?.role;
  const showFinance = canAccessFinance(role);
  const showJemaat = canManageJemaat(role);
  const showContent = role === adminRoles.superAdmin;
  const {
    error: financeError,
    loading: financeLoading,
    transactions: financeTransactions,
  } = useFinanceTransactions();
  const {
    error: jemaatError,
    families,
    individuals,
    loading: jemaatLoading,
  } = useJemaatData();
  const normalizedFinanceTransactions = listFinanceTransactions(financeTransactions);
  const financeSummary = getFinanceSummary(normalizedFinanceTransactions);
  const jemaatStats = getJemaatStatsFrom(families, individuals);
  const financeStats = [
    {
      title: "Total Kas Masuk",
      value: formatCurrency(financeSummary.totalIncome),
      icon: ArrowDownCircle,
      tone: "success",
    },
    {
      title: "Total Kas Keluar",
      value: formatCurrency(financeSummary.totalExpense),
      icon: ArrowUpCircle,
      tone: "danger",
    },
    {
      title: "Saldo Saat Ini",
      value: formatCurrency(financeSummary.balance),
      icon: Wallet,
    },
  ];
  const recentTransactions = normalizedFinanceTransactions.slice(0, 4);

  const stats = [
    ...(showContent ? [{ title: "Total Artikel", value: "24", icon: FileText }] : []),
    ...(showFinance ? financeStats : []),
    ...(showJemaat
      ? [
          { title: "Total Keluarga", value: jemaatStats.familyCount, icon: UsersRound },
          { title: "Total Individu", value: jemaatStats.individualCount, icon: UsersRound },
          { title: "Individu Mandiri", value: jemaatStats.independentCount, icon: UsersRound },
        ]
      : []),
  ];

  return (
    <div className="space-y-7">
      <AdminPageHeader
        eyebrow="Dashboard Admin"
        title={`Ringkasan untuk ${getRoleLabel(role)}`}
        description="Dashboard menampilkan area kerja yang relevan dengan role akun yang sedang digunakan."
        meta={<StatusBadge value={getRoleLabel(role)} />}
      />

      <DataSourceNotice
        error={financeError || jemaatError}
        label="dashboard"
        loading={(showFinance && financeLoading) || (showJemaat && jemaatLoading)}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <SummaryCard
            key={item.title}
            title={item.title}
            value={item.value}
            icon={item.icon}
            tone={item.tone}
          />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        {showFinance ? (
          <DataTable eyebrow="Transaksi Terbaru" title="Aktivitas keuangan terakhir">
            <table className="min-w-[760px] text-left text-sm">
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
                  <tr key={`${item.date}-${item.category}-${index}`} className="brand-table-row border-b border-slate-100 transition dark:border-slate-800">
                    <td className="px-3 py-4 text-slate-700 dark:text-slate-200">{formatFinanceDate(item.date)}</td>
                    <td className="px-3 py-4"><StatusBadge value={item.type} /></td>
                    <td className="px-3 py-4 font-medium text-slate-900 dark:text-white">{item.category}</td>
                    <td className="px-3 py-4 text-right font-bold text-slate-950 dark:text-white">{formatCurrency(item.amount)}</td>
                    <td className="px-3 py-4"><StatusBadge value={item.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DataTable>
        ) : (
          <div className="brand-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              {toTitleCase("Fokus Sekretariat")}
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
              {toTitleCase("Kelola data jemaat")}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Role sekretaris difokuskan untuk data keluarga, data individu, dan
              preview KKJ.
            </p>
          </div>
        )}

        <div className="space-y-6">
          <div className="brand-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              {toTitleCase("Akses Cepat")}
            </p>
            <div className="mt-5 grid gap-3">
              {showFinance ? (
                <>
                  <ActionButton to="/admin/income" variant="primary" icon={ArrowDownCircle}>
                    Input Kas Masuk
                  </ActionButton>
                  <ActionButton to="/admin/expense" icon={ArrowUpCircle}>
                    Input Kas Keluar
                  </ActionButton>
                  <ActionButton to="/admin/reports" icon={Wallet}>
                    Lihat Laporan Kas
                  </ActionButton>
                </>
              ) : null}
              {showJemaat ? (
                <>
                  <ActionButton to="/admin/jemaat/keluarga" variant={showFinance ? "secondary" : "primary"} icon={UsersRound}>
                    Data Keluarga
                  </ActionButton>
                  <ActionButton to="/admin/jemaat/individu" icon={UsersRound}>
                    Data Individu
                  </ActionButton>
                </>
              ) : null}
              {showContent ? (
                <ActionButton to="/admin/articles" icon={FileText}>
                  Kelola Artikel
                </ActionButton>
              ) : null}
            </div>
          </div>

          <div className="brand-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              {toTitleCase("Informasi Sistem")}
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Ringkasan diperbarui dari data terbaru pada setiap modul yang dapat diakses oleh akun ini.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
