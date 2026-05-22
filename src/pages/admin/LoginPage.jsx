import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Church, LockKeyhole, Mail } from "lucide-react";
import ThemeToggle from "../../components/ThemeToggle";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || "/admin/dashboard";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    const result = login(form);

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate(from, { replace: true });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-2">
        <div className="hidden bg-slate-900 p-10 text-white dark:bg-slate-100 dark:text-slate-900 lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 dark:bg-slate-900/10">
              <Church size={28} />
            </div>

            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] opacity-80">
              Admin Panel
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-tight">
              Gereja AMIN Jemaat Tangerang Raya
            </h1>
            <p className="mt-4 max-w-md text-sm leading-7 opacity-80">
              Panel administrasi untuk mengelola artikel, kas masuk, kas keluar,
              dan laporan keuangan gereja.
            </p>
          </div>

          <div className="space-y-2 text-sm">
            <p className="font-semibold">Demo Login</p>
            <p>Email: admin@gerejaamin.org</p>
            <p>Password: admin123</p>
          </div>
        </div>

        <div className="p-6 md:p-10">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
                <Church size={28} />
              </div>
              <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
                Login Admin
              </h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Masuk ke panel administrasi gereja.
              </p>
              <div className="mt-4 rounded-2xl bg-slate-100 p-4 text-sm dark:bg-slate-800">
                <p>Email: admin@gerejaamin.org</p>
                <p>Password: admin123</p>
              </div>
            </div>

            <div className="hidden lg:block">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                Selamat Datang
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                Login Admin
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Gunakan akun admin untuk mengakses dashboard dan pengelolaan data gereja.
              </p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Email
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-950">
                  <Mail size={18} className="text-slate-400" />
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
                <div className="flex items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-950">
                  <LockKeyhole size={18} className="text-slate-400" />
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

              <button
                type="submit"
                className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-slate-100 dark:text-slate-900"
              >
                Masuk ke Dashboard
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}