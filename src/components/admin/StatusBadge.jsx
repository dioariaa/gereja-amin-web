const badgeStyles = {
  Aktif: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  Selesai: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  Sudah: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  Masuk: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  Menikah: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  Pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  "Perlu Verifikasi":
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  Keluar: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  Meninggal: "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  Draft: "bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-200",
  Belum: "bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-200",
  Duda: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  Janda: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  Mandiri: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  Suami: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  Istri: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  Anak: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  Orangtua: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  Saudara: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  "Anggota Keluarga Lain":
    "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  "Individu Mandiri":
    "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  LocalStorage:
    "bg-slate-100 text-slate-700 dark:bg-slate-800/80 dark:text-slate-200",
  Supabase:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  "CRUD Komisi":
    "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  "Editor Konten":
    "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
};

export default function StatusBadge({ value, className = "" }) {
  const badgeClass =
    badgeStyles[value] ||
    "bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-200";

  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold leading-none ${badgeClass} ${className}`}
    >
      {value || "-"}
    </span>
  );
}
