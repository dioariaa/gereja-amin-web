import { Link, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  FileBarChart2,
  FileText,
  X,
  Church,
} from "lucide-react";

const links = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/cashflow", label: "Cashflow", icon: Wallet },
  { to: "/admin/income", label: "Kas Masuk", icon: ArrowDownCircle },
  { to: "/admin/expense", label: "Kas Keluar", icon: ArrowUpCircle },
  { to: "/admin/reports", label: "Laporan", icon: FileBarChart2 },
  { to: "/admin/articles", label: "Artikel", icon: FileText },
];

function navClass({ isActive }) {
  return [
    "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
    isActive
      ? "bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900"
      : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
  ].join(" ");
}

export default function Sidebar({ open, onClose }) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition md:hidden ${
          open ? "block" : "hidden"
        }`}
        onClick={onClose}
      />

      <aside
        className={[
          "fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-slate-200 bg-white transition-transform dark:border-slate-800 dark:bg-slate-950 md:static md:z-auto md:w-72 md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5 dark:border-slate-800">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
              <Church size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Gereja AMIN
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Admin Panel
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 md:hidden dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5">
          <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Menu Utama
          </p>

          <nav className="space-y-2">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={navClass} onClick={onClose}>
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="border-t border-slate-200 px-5 py-4 dark:border-slate-800">
          <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              Gereja AMIN Jemaat Tangerang Raya
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              Kelola artikel, kas masuk, kas keluar, dan laporan gereja dari satu panel.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}