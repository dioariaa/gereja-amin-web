import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LockKeyhole, Mail } from "lucide-react";
import BrandLogo from "../../components/BrandLogo";
import ThemeToggle from "../../components/ThemeToggle";
import { useAuth } from "../../contexts/authContextValue";
import { toTitleCase } from "../../utils/textFormat";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { authLoading, login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || "/admin/dashboard";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setIsSubmitting(true);

    const result = await login(form);

    if (!result.success) {
      setError(result.message);
      setIsSubmitting(false);
      return;
    }

    if (result.message) {
      setNotice(result.message);
    }

    navigate(from, { replace: true });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-8">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-xl dark:border-violet-950/60 dark:bg-[#15111c] lg:grid-cols-2">
        <div className="hidden bg-[#2c2038] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="inline-flex rounded-2xl bg-white p-3 shadow-sm">
              <BrandLogo size="lg" showText={false} />
            </div>

            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">
              {toTitleCase("Admin Panel")}
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-tight">
              {toTitleCase("Gereja AMIN Jemaat Tangerang Raya")}
            </h1>
            <p className="mt-4 max-w-md text-sm leading-7 opacity-80">
              Panel administrasi untuk mengelola data jemaat, artikel, kas masuk,
              kas keluar, dan laporan keuangan gereja.
            </p>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 p-5 text-sm">
            <p className="font-semibold">{toTitleCase("Akses Administrasi")}</p>
            <p className="mt-2 leading-6 text-white/75">
              Masuk menggunakan akun yang telah terdaftar dan memiliki role aktif
              untuk mengelola pelayanan gereja.
            </p>
          </div>
        </div>

        <div className="p-6 md:p-10">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <BrandLogo size="lg" subtitle="Admin Panel" />
              <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
                {toTitleCase("Login Admin")}
              </h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Masuk ke panel administrasi gereja.
              </p>
              <div className="mt-4 rounded-2xl border border-violet-100 bg-violet-50 p-4 text-sm dark:border-violet-950/60 dark:bg-violet-950/20">
                <p className="font-semibold">{toTitleCase("Akses khusus pengurus")}</p>
                <p className="mt-1 leading-6 text-slate-600 dark:text-slate-300">
                  Gunakan akun yang telah diberikan sesuai tanggung jawab pelayanan.
                </p>
              </div>
            </div>

            <div className="hidden lg:block">
              <p className="brand-eyebrow text-sm font-semibold uppercase tracking-[0.2em]">
                {toTitleCase("Selamat Datang")}
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                {toTitleCase("Login Admin")}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Gunakan akun admin sesuai role untuk mengakses dashboard dan pengelolaan data gereja.
              </p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Email
                </label>
                <div className="brand-search-box flex items-center gap-3 rounded-xl px-4 py-3">
                  <Mail size={18} className="text-violet-400" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="admin@gerejaamin.org"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Password
                </label>
                <div className="brand-search-box flex items-center gap-3 rounded-xl px-4 py-3">
                  <LockKeyhole size={18} className="text-violet-400" />
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Masukkan password"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {error ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">
                  {error}
                </div>
              ) : null}

              {notice ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
                  {notice}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting || authLoading}
                className="brand-button-primary w-full rounded-xl px-5 py-3 text-sm font-semibold transition"
              >
                {isSubmitting || authLoading ? "Memeriksa akun..." : "Masuk ke Dashboard"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
