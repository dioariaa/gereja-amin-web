import { X } from "lucide-react";

export default function AdminModal({ open, title, description, children, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 p-4 backdrop-blur-sm sm:items-center">
      <div className="brand-card max-h-[92vh] w-full max-w-3xl overflow-hidden">
        <div className="flex items-start justify-between gap-4 border-b border-violet-100 p-5 dark:border-violet-950/60">
          <div>
            <p className="brand-eyebrow text-xs font-semibold uppercase tracking-[0.2em]">
              Form Admin
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-950 dark:text-white">
              {title}
            </h2>
            {description ? (
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="brand-button-secondary rounded-xl p-2"
            aria-label="Tutup form"
          >
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[calc(92vh-120px)] overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}
