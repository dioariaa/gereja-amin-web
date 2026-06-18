import { useMemo, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ExternalLink, LogOut, Menu } from "lucide-react";
import BrandLogo from "../components/BrandLogo";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../contexts/authContextValue";
import { getRoleLabel } from "../data/adminAccess";

function getPageTitle(pathname) {
  if (pathname.startsWith("/admin/dashboard")) return "Dashboard";
  if (pathname.startsWith("/admin/cashflow")) return "Cashflow";
  if (pathname.startsWith("/admin/income")) return "Kas Masuk";
  if (pathname.startsWith("/admin/expense")) return "Kas Keluar";
  if (pathname.startsWith("/admin/reports")) return "Laporan Kas";
  if (pathname.startsWith("/admin/articles")) return "Publikasi";
  if (pathname.startsWith("/admin/content")) return "Konten Website";
  if (pathname.includes("/kkj")) return "Preview KKJ";
  if (pathname.startsWith("/admin/jemaat/keluarga")) return "Data Keluarga";
  if (pathname.startsWith("/admin/jemaat/individu-mandiri")) return "Individu Mandiri";
  if (pathname.startsWith("/admin/jemaat/individu")) return "Data Individu";
  if (pathname.startsWith("/admin/jemaat")) return "Modul Jemaat";
  return "Admin Panel";
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const pageTitle = useMemo(() => getPageTitle(location.pathname), [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-violet-100 bg-white/90 backdrop-blur print:hidden dark:border-violet-950/60 dark:bg-[#111018]/90">
            <div className="flex flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="brand-button-secondary rounded-xl p-2 text-slate-700 md:hidden dark:text-slate-200"
                  aria-label="Buka sidebar"
                >
                  <Menu size={20} />
                </button>

                <div className="block">
                  <BrandLogo size="sm" showText={false} />
                </div>

                <div className="min-w-0">
                  <p className="brand-eyebrow text-xs font-semibold uppercase tracking-[0.2em]">
                    Admin Gereja
                  </p>
                  <h1 className="truncate text-lg font-bold text-slate-950 md:text-2xl dark:text-white">
                    {pageTitle}
                  </h1>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 md:justify-end md:gap-3">
                <div className="min-w-0 rounded-xl border border-violet-100 bg-violet-50 px-3 py-2 dark:border-violet-950/60 dark:bg-violet-950/20">
                  <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">
                    {user?.name || "Admin Gereja"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {getRoleLabel(user?.role)}
                  </p>
                </div>

                <Link
                  to="/"
                  className="brand-button-secondary inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition"
                >
                  <ExternalLink size={16} />
                  <span className="hidden lg:inline">Website</span>
                </Link>

                <ThemeToggle />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="brand-button-secondary inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition"
                  aria-label="Logout"
                >
                  <LogOut size={16} />
                  <span className="hidden lg:inline">Logout</span>
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 md:px-6 md:py-8 print:p-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
