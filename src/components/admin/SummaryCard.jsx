import { toTitleCase } from "../../utils/textFormat";

export default function SummaryCard({ title, value, description, icon: Icon, tone = "default" }) {
  const toneClass =
    tone === "success"
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
      : tone === "warning"
        ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
        : tone === "danger"
        ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
          : "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-200";

  return (
    <div className="brand-card h-full p-5 transition duration-200 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-slate-500 dark:text-slate-400">{toTitleCase(title)}</p>
          <p className="mt-3 break-words text-2xl font-bold leading-tight tracking-tight text-slate-950 dark:text-white">
            {value}
          </p>
        </div>
        {Icon ? (
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${toneClass}`}>
            <Icon size={18} />
          </div>
        ) : null}
      </div>
      {description ? (
        <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
          {description}
        </p>
      ) : null}
    </div>
  );
}
