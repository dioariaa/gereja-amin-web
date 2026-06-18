import { Link, NavLink } from "react-router-dom";
import { ExternalLink, X } from "lucide-react";
import BrandLogo from "./BrandLogo";
import { useAuth } from "../contexts/authContextValue";
import { getRoleLabel } from "../data/adminAccess";
import { getVisibleNavigationGroups } from "../data/adminNavigation";

function navClass({ isActive }) {
  return [
    "group flex items-start gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
    isActive
      ? "bg-violet-100 text-violet-800 shadow-sm ring-1 ring-violet-200 dark:bg-violet-950/50 dark:text-violet-100 dark:ring-violet-900"
      : "text-slate-700 hover:bg-violet-50 hover:text-violet-800 dark:text-slate-200 dark:hover:bg-violet-950/30 dark:hover:text-violet-100",
  ].join(" ");
}

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();
  const groups = getVisibleNavigationGroups(user?.role);

  return (
    <>
      <button
        type="button"
        className={`fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm transition md:hidden ${
          open ? "block" : "hidden"
        }`}
        onClick={onClose}
        aria-label="Tutup sidebar"
      />

      <aside
        className={[
          "fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-violet-100 bg-white transition-transform dark:border-violet-950/60 dark:bg-[#15111c] md:sticky md:z-auto md:w-72 md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="border-b border-violet-100 px-5 py-5 dark:border-violet-950/60">
          <div className="flex items-center justify-between gap-3">
            <Link to="/admin/dashboard" className="flex min-w-0 items-center gap-3" onClick={onClose}>
              <BrandLogo size="sm" subtitle="Admin Panel" />
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-slate-600 hover:bg-violet-50 md:hidden dark:text-slate-300 dark:hover:bg-violet-950/30"
              aria-label="Tutup sidebar"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mt-5 rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 dark:border-violet-950/60 dark:bg-violet-950/20">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-700 dark:text-violet-200">
              Role aktif
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-950 dark:text-white">
              {getRoleLabel(user?.role)}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5">
          <nav className="space-y-6">
            {groups.map((group) => (
              <div key={group.label}>
                <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                  {group.label}
                </p>
                <div className="space-y-1">
                  {group.items.map(({ to, label, description, icon: Icon, end }) => (
                    <NavLink
                      key={to}
                      to={to}
                      end={end}
                      className={navClass}
                      onClick={onClose}
                    >
                      <Icon size={18} className="mt-0.5 shrink-0" />
                      <span className="min-w-0">
                        <span className="block leading-5">{label}</span>
                        {description ? (
                          <span className="block truncate text-xs font-normal opacity-70">
                            {description}
                          </span>
                        ) : null}
                      </span>
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className="border-t border-violet-100 px-5 py-4 dark:border-violet-950/60">
          <Link
            to="/"
            onClick={onClose}
            className="brand-button-secondary inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition"
          >
            <ExternalLink size={16} />
            Lihat Website Publik
          </Link>
          <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
            Menu disesuaikan dengan role akun yang sedang digunakan.
          </p>
        </div>
      </aside>
    </>
  );
}
