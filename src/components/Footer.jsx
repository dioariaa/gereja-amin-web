import BrandLogo from "./BrandLogo";

export default function Footer() {
  return (
    <footer className="border-t border-violet-100 bg-white/80 dark:border-violet-950/60 dark:bg-[#15111c]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-sm text-slate-600 md:flex-row md:items-center md:justify-between md:px-6 dark:text-slate-300">
        <BrandLogo size="sm" subtitle="Tangerang Raya" />
        <div className="text-left md:text-right">
          <p>&copy; 2026 Gereja AMIN Tangerang Raya</p>
          <p className="mt-1 text-xs text-cyan-700 dark:text-cyan-300">
            Tangguh - Mandiri - Peduli
          </p>
        </div>
      </div>
    </footer>
  );
}
