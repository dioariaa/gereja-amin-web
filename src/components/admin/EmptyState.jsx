import { Inbox } from "lucide-react";

export default function EmptyState({
  title = "Data belum tersedia",
  description = "Coba ubah filter atau tambah data baru.",
  icon: Icon = Inbox,
  action,
}) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-violet-200 bg-violet-50/60 px-6 py-12 text-center dark:border-violet-900/60 dark:bg-violet-950/20">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm dark:bg-slate-900 dark:text-violet-200">
        <Icon size={22} />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-950 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
        {description}
      </p>
      {action ? <div className="mt-5 flex flex-col gap-3 sm:flex-row">{action}</div> : null}
    </div>
  );
}
