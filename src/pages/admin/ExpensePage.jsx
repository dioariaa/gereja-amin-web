import { useMemo, useState } from "react";
import { ArrowLeft, ArrowUpCircle, Edit2, Save, Trash2, X } from "lucide-react";
import ActionButton from "../../components/admin/ActionButton";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import DataTable from "../../components/admin/DataTable";
import DataSourceNotice from "../../components/admin/DataSourceNotice";
import FormField from "../../components/admin/FormField";
import StatusBadge from "../../components/admin/StatusBadge";
import {
  cashAccounts,
  expenseCategories,
  formatCurrency,
  formatFinanceDate,
  listFinanceTransactions,
  transactionToForm,
  transactionStatuses,
} from "../../services/financeService";
import useFinanceTransactions from "../../hooks/useFinanceTransactions";

const today = new Date().toISOString().slice(0, 10);

const emptyForm = {
  date: today,
  account: "Kas Umum",
  category: expenseCategories[0],
  actor: "",
  amount: "",
  status: "Selesai",
  proof: "",
  description: "",
};

export default function ExpensePage() {
  const {
    createTransaction,
    deleteTransaction,
    error: dataError,
    loading: dataLoading,
    source: dataSource,
    transactions,
    updateTransaction,
  } = useFinanceTransactions();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const expenseTransactions = useMemo(
    () =>
      transactions
        ? listFinanceTransactions(transactions).filter((item) => item.type === "Keluar")
        : [],
    [transactions]
  );

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    const amount = Number(form.amount);
    if (!form.date || !amount || amount <= 0) {
      setMessage("Tanggal dan nominal wajib diisi dengan benar.");
      return;
    }

    setSubmitting(true);

    const sequence = expenseTransactions.length + 1;
    const formForSave = {
      ...form,
      proof: form.proof || (editingId ? "" : `KK-${String(sequence).padStart(3, "0")}`),
    };

    try {
      const result = editingId
        ? await updateTransaction(editingId, "Keluar", formForSave)
        : await createTransaction("Keluar", formForSave);
      const action = editingId ? "diperbarui" : "ditambahkan";
      const fallbackReason = result.error ? ` Supabase: ${result.error}` : "";

      setMessage(
        `Kas keluar berhasil ${action} ke ${
          result.source === "supabase" ? "Supabase" : "localStorage fallback"
        }.${fallbackReason}`
      );
      setForm({ ...emptyForm, date: form.date });
      setEditingId("");
    } catch (saveError) {
      setMessage(
        saveError.message ||
          "Transaksi gagal disimpan. Jika memakai Supabase, cek tabel, policy, dan profile role bendahara/super admin."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (transaction) => {
    setEditingId(transaction.id);
    setForm(transactionToForm(transaction));
    setMessage("Mode edit aktif. Ubah data lalu simpan perubahan.");
  };

  const cancelEdit = () => {
    setEditingId("");
    setForm(emptyForm);
    setMessage("");
  };

  const handleDelete = async (transaction) => {
    const confirmed = window.confirm(
      `Hapus kas keluar "${transaction.description || transaction.category}"?`
    );

    if (!confirmed) return;

    try {
      const result = await deleteTransaction(transaction.id, "Keluar");
      setMessage(
        `Kas keluar berhasil dihapus dari ${
          result.source === "supabase" ? "Supabase" : "localStorage fallback"
        }.`
      );
      if (editingId === transaction.id) cancelEdit();
    } catch (deleteError) {
      setMessage(
        deleteError.message ||
          "Transaksi gagal dihapus. Data lokal tidak diubah karena Supabase menolak operasi."
      );
    }
  };

  return (
    <div className="space-y-7">
      <AdminPageHeader
        eyebrow="Kas Keluar"
        title="Input transaksi kas keluar"
        description="Catat pengeluaran gereja seperti operasional, pelayanan komisi, diakonia, dan pembayaran sinode sesuai format tabelaris."
        meta={<StatusBadge value={dataSource === "supabase" ? "Supabase" : "LocalStorage"} />}
        actions={<ActionButton to="/admin/cashflow" icon={ArrowLeft}>Kembali</ActionButton>}
      />

      <DataSourceNotice
        error={dataError}
        label="kas keluar"
        loading={dataLoading}
        source={dataSource}
      />

      <section className="brand-card p-5 md:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
              <ArrowUpCircle size={20} />
            </div>
            <div>
              <p className="brand-eyebrow text-xs font-semibold uppercase tracking-[0.2em]">
                Form Transaksi
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">
                {editingId ? "Edit Kas Keluar" : "Form Kas Keluar"}
              </h2>
            </div>
          </div>
          <StatusBadge value={dataSource === "supabase" ? "Supabase" : "LocalStorage"} />
        </div>

        {message ? (
          <div className="mt-5 rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-sm text-violet-800 dark:border-violet-950/60 dark:bg-violet-950/30 dark:text-violet-100">
            {message}
          </div>
        ) : null}

        <form className="mt-6 grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
          <FormField label="Tanggal Transaksi">
            <input type="date" name="date" value={form.date} onChange={updateForm} className="input-base" />
          </FormField>
          <FormField label="Akun Kas">
            <select name="account" value={form.account} onChange={updateForm} className="input-base">
              {cashAccounts.map((account) => (
                <option key={account}>{account}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Kategori">
            <select name="category" value={form.category} onChange={updateForm} className="input-base">
              {expenseCategories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Penerima">
            <input name="actor" value={form.actor} onChange={updateForm} type="text" placeholder="Contoh: Vendor / Pengurus / Sinode" className="input-base" />
          </FormField>
          <FormField label="Nominal">
            <input name="amount" value={form.amount} onChange={updateForm} type="number" min="0" placeholder="Masukkan nominal" className="input-base text-lg font-semibold" />
          </FormField>
          <FormField label="Status">
            <select name="status" value={form.status} onChange={updateForm} className="input-base">
              {transactionStatuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Nomor Bukti">
            <input name="proof" value={form.proof} onChange={updateForm} placeholder="Contoh: KK-005" className="input-base" />
          </FormField>
          <FormField label="Keterangan">
            <input name="description" value={form.description} onChange={updateForm} placeholder="Tulis keterangan singkat" className="input-base" />
          </FormField>

          <div className="flex flex-col gap-3 sm:flex-row md:col-span-2">
            <button type="submit" disabled={submitting} className="brand-button-primary inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60">
              <Save size={17} />
              {submitting ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Simpan Kas Keluar"}
            </button>
            {editingId ? (
              <ActionButton icon={X} onClick={cancelEdit}>
                Batal Edit
              </ActionButton>
            ) : null}
            <ActionButton to="/admin/cashflow" icon={ArrowLeft}>Kembali ke Cashflow</ActionButton>
          </div>
        </form>
      </section>

      <DataTable eyebrow="Kas Keluar" title="Daftar transaksi pengeluaran">
        <table className="min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800">
              <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Tanggal</th>
              <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Kategori</th>
              <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Penerima</th>
              <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Nominal</th>
              <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Status</th>
              <th className="px-3 py-3 text-right font-semibold text-slate-600 dark:text-slate-300">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {expenseTransactions.map((item) => (
              <tr key={item.id} className="brand-table-row border-b border-slate-100 transition dark:border-slate-800">
                <td className="px-3 py-4 text-slate-700 dark:text-slate-200">{formatFinanceDate(item.date)}</td>
                <td className="px-3 py-4 font-medium text-slate-900 dark:text-white">{item.category}</td>
                <td className="px-3 py-4 text-slate-700 dark:text-slate-200">{item.actor}</td>
                <td className="px-3 py-4 text-right font-bold text-slate-950 dark:text-white">{formatCurrency(item.amount)}</td>
                <td className="px-3 py-4"><StatusBadge value={item.status} /></td>
                <td className="px-3 py-4">
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => startEdit(item)} className="rounded-xl border border-violet-200 p-2 text-violet-700 transition hover:bg-violet-50 dark:border-violet-900 dark:text-violet-300 dark:hover:bg-violet-950/30" aria-label={`Edit ${item.description}`}>
                      <Edit2 size={16} />
                    </button>
                    <button type="button" onClick={() => handleDelete(item)} className="rounded-xl border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/30" aria-label={`Hapus ${item.description}`}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {expenseTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                  Belum ada transaksi kas keluar yang tersimpan.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </DataTable>
    </div>
  );
}
