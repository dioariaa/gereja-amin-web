import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, LogIn, ShieldCheck } from "lucide-react";
import BrandLogo from "./BrandLogo";
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
    "rounded-xl px-3 py-2 text-sm font-medium transition",
    isActive
      ? "bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-100"
      : "text-slate-700 hover:bg-violet-50 hover:text-violet-800 dark:text-slate-200 dark:hover:bg-violet-950/30 dark:hover:text-violet-100",
  ].join(" ");
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-violet-100 bg-white/95 backdrop-blur dark:border-violet-950/60 dark:bg-[#111018]/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link to="/" className="flex items-center gap-3">
          <BrandLogo size="sm" />
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
            className="brand-button-primary group inline-flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/15">
              <ShieldCheck size={16} />
            </span>

            <span className="flex flex-col leading-none">
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/70 dark:text-slate-700">
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
            className="brand-button-primary inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition"
            aria-label="Login Admin"
            title="Login Admin"
          >
            <ShieldCheck size={16} />
          </Link>

          <ThemeToggle />

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
        <div className="border-t border-violet-100 bg-white px-4 py-3 shadow-lg md:hidden dark:border-violet-950/60 dark:bg-[#111018]">
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
              className="brand-button-primary mt-2 inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition"
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
