import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import BrandLogo from "./BrandLogo";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../contexts/authContextValue";
import { getRoleLabel } from "../data/adminAccess";

const links = [
  { to: "/", label: "Beranda" },
  { to: "/tentang-kami", label: "Tentang Kami" },
  { to: "/publikasi", label: "Publikasi" },
  { to: "/komisi", label: "Komisi" },
  { to: "/jadwal-ibadah", label: "Jadwal Ibadah" },
  { to: "/galeri", label: "Galeri" },
  { to: "/kontak", label: "Kontak" },
];

function navClass({ isActive }) {
  return [
    "rounded-xl px-3 py-2 text-sm font-medium transition",
    isActive
      ? "bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-100"
      : "text-slate-700 hover:bg-violet-50 hover:text-violet-800 dark:text-slate-200 dark:hover:bg-violet-950/30 dark:hover:text-violet-100",
  ].join(" ");
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { authLoading, isAuthenticated, logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-violet-100 bg-white/95 backdrop-blur dark:border-violet-950/60 dark:bg-[#111018]/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link to="/" className="flex items-center gap-3">
          <BrandLogo size="sm" />
        </Link>

        <div className="hidden items-center gap-2 xl:flex">
          <nav className="flex items-center gap-1">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={navClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <DesktopAuthActions
            authLoading={authLoading}
            isAuthenticated={isAuthenticated}
            user={user}
            onLogout={handleLogout}
          />

          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <MobileTopAuthAction
            authLoading={authLoading}
            isAuthenticated={isAuthenticated}
          />

          <ThemeToggle className="[&>span]:hidden" />

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="brand-button-secondary rounded-xl p-2 text-slate-700 dark:text-slate-200"
            aria-label="Toggle navigation"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-violet-100 bg-white px-4 py-3 shadow-lg xl:hidden dark:border-violet-950/60 dark:bg-[#111018]">
          <nav className="flex flex-col gap-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={navClass}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}

            <MobileAuthPanel
              authLoading={authLoading}
              isAuthenticated={isAuthenticated}
              user={user}
              onClose={() => setIsOpen(false)}
              onLogout={handleLogout}
            />
          </nav>
        </div>
      )}
    </header>
  );
}

function DesktopAuthActions({ authLoading, isAuthenticated, user, onLogout }) {
  if (authLoading) {
    return (
      <div
        className="h-11 w-40 animate-pulse rounded-xl bg-violet-100 dark:bg-violet-950/40"
        aria-label="Memeriksa session admin"
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <Link
        to="/admin/login"
        className="brand-button-primary group inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5"
      >
        <ShieldCheck size={16} />
        Login Admin
        <LogIn
          size={16}
          className="opacity-80 transition group-hover:translate-x-0.5"
        />
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex max-w-44 items-center gap-2 rounded-xl border border-violet-100 bg-violet-50 px-3 py-2 dark:border-violet-950/60 dark:bg-violet-950/20">
        <UserRound size={17} className="shrink-0 text-violet-700 dark:text-violet-200" />
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-sm font-semibold text-slate-950 dark:text-white">
            {user?.name || "Admin Gereja"}
          </span>
          <span className="block truncate text-[11px] text-slate-500 dark:text-slate-400">
            {getRoleLabel(user?.role)}
          </span>
        </span>
      </div>

      <Link
        to="/admin/dashboard"
        className="brand-button-primary inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition"
      >
        <LayoutDashboard size={16} />
        Dashboard
      </Link>

      <button
        type="button"
        onClick={onLogout}
        className="brand-button-secondary inline-flex items-center justify-center rounded-xl p-2.5"
        aria-label="Logout admin"
        title="Logout"
      >
        <LogOut size={17} />
      </button>
    </div>
  );
}

function MobileTopAuthAction({ authLoading, isAuthenticated }) {
  if (authLoading) {
    return (
      <div
        className="h-10 w-10 animate-pulse rounded-xl bg-violet-100 dark:bg-violet-950/40"
        aria-label="Memeriksa session admin"
      />
    );
  }

  return (
    <Link
      to={isAuthenticated ? "/admin/dashboard" : "/admin/login"}
      className="brand-button-primary inline-flex items-center justify-center rounded-xl p-2.5"
      aria-label={isAuthenticated ? "Buka Dashboard Admin" : "Login Admin"}
      title={isAuthenticated ? "Dashboard Admin" : "Login Admin"}
    >
      {isAuthenticated ? <LayoutDashboard size={17} /> : <ShieldCheck size={17} />}
    </Link>
  );
}

function MobileAuthPanel({
  authLoading,
  isAuthenticated,
  user,
  onClose,
  onLogout,
}) {
  if (authLoading) {
    return (
      <div className="mt-2 h-20 animate-pulse rounded-2xl bg-violet-100 dark:bg-violet-950/40" />
    );
  }

  if (!isAuthenticated) {
    return (
      <Link
        to="/admin/login"
        onClick={onClose}
        className="brand-button-primary mt-2 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition"
      >
        <ShieldCheck size={16} />
        Login Admin
      </Link>
    );
  }

  return (
    <div className="mt-2 rounded-2xl border border-violet-100 bg-violet-50/60 p-3 dark:border-violet-950/60 dark:bg-violet-950/20">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-violet-700 shadow-sm dark:bg-[#15111c] dark:text-violet-200">
          <UserRound size={18} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">
            {user?.name || "Admin Gereja"}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {getRoleLabel(user?.role)}
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Link
          to="/admin/dashboard"
          onClick={onClose}
          className="brand-button-primary inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold"
        >
          <LayoutDashboard size={16} />
          Dashboard
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className="brand-button-secondary inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}
