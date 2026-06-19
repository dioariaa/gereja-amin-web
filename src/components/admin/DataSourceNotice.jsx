import { AlertCircle, Database } from "lucide-react";

export default function DataSourceNotice({ error, loading, label = "data" }) {
  if (!loading && !error) return null;

  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl border px-4 py-3 text-sm sm:flex-row sm:items-center ${
        error
          ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/25 dark:text-amber-200"
          : "border-violet-100 bg-violet-50 text-violet-800 dark:border-violet-950/60 dark:bg-violet-950/25 dark:text-violet-100"
      }`}
    >
      <div className="flex items-center gap-2 font-semibold">
        {error ? <AlertCircle size={17} /> : <Database size={17} />}
        {loading ? `Memuat ${label}...` : "Data belum dapat disinkronkan"}
      </div>
      {error ? (
        <p className="leading-6">
          Sebagian informasi mungkin belum diperbarui. Silakan coba kembali beberapa saat lagi.
        </p>
      ) : null}
    </div>
  );
}
