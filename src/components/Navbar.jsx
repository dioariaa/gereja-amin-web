import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, LogIn, ShieldCheck } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

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
    "rounded-lg px-3 py-2 text-sm font-medium transition",
    isActive
      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
      : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
  ].join(" ");
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link to="/" className="text-lg font-bold text-slate-900 dark:text-white">
          Gereja AMIN
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <nav className="flex items-center gap-1">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={navClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <Link
            to="/admin/login"
            className="group inline-flex items-center gap-3 rounded-2xl border border-slate-300 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:opacity-95 dark:border-slate-700 dark:bg-slate-100 dark:text-slate-900"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 dark:bg-slate-900/10">
              <ShieldCheck size={16} />
            </span>

            <span className="flex flex-col leading-none">
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/70 dark:text-slate-600">
                Admin
              </span>
              <span className="mt-1 text-sm font-semibold">Login Panel</span>
            </span>

            <LogIn
              size={16}
              className="opacity-80 transition group-hover:translate-x-0.5"
            />
          </Link>

          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-slate-100 dark:text-slate-900"
            aria-label="Login Admin"
            title="Login Admin"
          >
            <ShieldCheck size={16} />
          </Link>

          <ThemeToggle />

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="rounded-xl border border-slate-300 p-2 text-slate-700 dark:border-slate-700 dark:text-slate-200"
            aria-label="Toggle navigation"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-slate-200 px-4 py-3 md:hidden dark:border-slate-800">
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

            <Link
              to="/admin/login"
              onClick={() => setIsOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-slate-100 dark:text-slate-900"
            >
              <ShieldCheck size={16} />
              Login Admin Panel
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}