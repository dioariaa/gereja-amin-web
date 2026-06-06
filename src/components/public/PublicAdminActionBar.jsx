import { Link } from "react-router-dom";
import { Settings, ShieldCheck } from "lucide-react";
import { useAuth } from "../../contexts/authContextValue";
import { canManagePublicContent } from "../../data/adminAccess";

const variantClasses = {
  primary: "brand-button-primary",
  secondary: "brand-button-secondary",
};

export function ContentManageButton({
  to,
  children,
  icon: Icon = Settings,
  variant = "secondary",
  className = "",
}) {
  const { user } = useAuth();

  if (!canManagePublicContent(user?.role)) {
    return null;
  }

  return (
    <Link
      to={to}
      className={`inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold leading-none transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-200 dark:focus-visible:ring-violet-900 ${variantClasses[variant] || variantClasses.secondary} ${className}`}
    >
      <Icon className="shrink-0" size={16} />
      {children}
    </Link>
  );
}

export function PublicAdminShortcut({
  to,
  label = "Kelola Konten",
  icon: Icon = Settings,
  className = "",
}) {
  const { user } = useAuth();

  if (!canManagePublicContent(user?.role)) {
    return null;
  }

  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/85 px-3 py-1.5 text-xs font-semibold text-violet-800 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-200 dark:border-violet-900 dark:bg-[#15111c]/85 dark:text-violet-100 dark:hover:bg-violet-950/40 dark:focus-visible:ring-violet-900 ${className}`}
    >
      <Icon size={14} />
      {label}
    </Link>
  );
}

export default function PublicAdminActionBar({
  title = "Aksi Admin",
  description = "Kelola konten halaman ini dari panel admin.",
  actions = [],
  className = "",
}) {
  const { user } = useAuth();

  if (!canManagePublicContent(user?.role)) {
    return null;
  }

  return (
    <section
      className={`brand-card flex flex-col gap-4 border-l-4 border-l-violet-300 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-l-violet-700 ${className}`}
    >
      <div className="flex min-w-0 gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-200">
          <ShieldCheck size={18} />
        </div>
        <div className="min-w-0">
          <p className="brand-eyebrow text-xs font-semibold uppercase tracking-[0.2em]">
            Mode Admin
          </p>
          <h2 className="mt-1 text-base font-bold text-slate-950 dark:text-white">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
        {actions.map(({ label, to, icon, variant }) => (
          <ContentManageButton
            key={`${label}-${to}`}
            to={to}
            icon={icon}
            variant={variant}
            className="w-full sm:w-auto"
          >
            {label}
          </ContentManageButton>
        ))}
      </div>
    </section>
  );
}
