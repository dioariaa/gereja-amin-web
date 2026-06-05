import { Link } from "react-router-dom";
import { CalendarDays, PenLine, Plus, Settings, UsersRound } from "lucide-react";
import PublicAdminActionBar, {
  ContentManageButton,
} from "../../components/public/PublicAdminActionBar";
import {
  COMMISSIONS_STORAGE_KEY,
  commissionSeed,
  getCommissionMetrics,
  listCommissions,
} from "../../services/commissionsService";
import useLocalStorageState from "../../hooks/useLocalStorageState";

export default function CommissionsPage() {
  const [savedCommissions] = useLocalStorageState(COMMISSIONS_STORAGE_KEY, commissionSeed);
  const commissions = listCommissions(savedCommissions);
  const metrics = getCommissionMetrics(commissions);

  return (
    <div className="space-y-8">
      <PublicAdminActionBar
        title="Kelola konten komisi pelayanan"
        description="Aksi ini mengarah ke panel admin untuk mengatur profil, pengurus, jadwal, dan konten komisi."
        actions={[
          {
            label: "Tambah Komisi",
            to: "/admin/content/commissions?action=create",
            icon: Plus,
            variant: "primary",
          },
          {
            label: "Kelola Komisi",
            to: "/admin/content/commissions",
            icon: Settings,
          },
        ]}
      />

      <section className="brand-card rounded-3xl px-6 py-10 md:px-10 md:py-14">
        <p className="brand-eyebrow text-sm font-semibold uppercase tracking-[0.22em]">
          Komisi Pelayanan
        </p>
        <h1 className="mt-3 max-w-4xl text-3xl font-bold text-slate-950 md:text-5xl dark:text-white">
          Ruang pelayanan Gereja AMIN Jemaat Tangerang Raya
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 md:text-base dark:text-slate-300">
          Setiap komisi hadir untuk memperlengkapi jemaat dalam persekutuan,
          pengajaran, pelayanan kasih, dan pengelolaan kebutuhan gereja secara
          terarah.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Total Komisi" value={metrics.total} />
        <MetricCard title="Area Pelayanan" value="8" />
        <MetricCard title="Pengurus Aktif" value={metrics.chairs} />
        <MetricCard title="Fokus Program" value={metrics.focusCount} accent="Pelayanan terpetakan" />
      </section>

      <section className="space-y-5">
        <div>
          <p className="brand-eyebrow text-sm font-semibold uppercase tracking-[0.22em]">
            Daftar Komisi
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950 md:text-3xl dark:text-white">
            Komisi yang melayani jemaat
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {commissions.map((commission) => (
            <article key={commission.slug} className="brand-card flex flex-col p-6 transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-200">
                  <UsersRound size={20} />
                </div>
                <div className="min-w-0">
                  <p className="brand-eyebrow text-xs font-semibold uppercase tracking-[0.18em]">
                    {commission.shortName}
                  </p>
                  <h3 className="text-lg font-bold leading-6 text-slate-950 dark:text-white">
                    {commission.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {commission.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <InfoLine icon={PenLine} label="Ketua" value={commission.chair} />
                <InfoLine icon={CalendarDays} label="Jadwal" value={commission.schedule} />
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {commission.focus.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-200"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <Link
                  to={`/komisi/${commission.slug}`}
                  className="brand-button-primary inline-flex flex-1 items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition"
                >
                  Lihat Detail
                </Link>
                <ContentManageButton
                  to={`/admin/content/commissions/${commission.slug}?action=edit`}
                  icon={Settings}
                  className="flex-1"
                >
                  Kelola
                </ContentManageButton>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function MetricCard({ title, value, accent }) {
  return (
    <div className="brand-card p-5">
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <p className="mt-2 text-2xl font-bold text-violet-800 dark:text-violet-100">
        {value}
      </p>
      {accent ? (
        <p className="mt-1 text-sm font-semibold text-cyan-700 dark:text-cyan-200">
          {accent}
        </p>
      ) : null}
    </div>
  );
}

function InfoLine({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-2 text-slate-600 dark:text-slate-300">
      <Icon size={16} className="mt-0.5 shrink-0 text-violet-500" />
      <p>
        <span className="font-semibold text-slate-800 dark:text-slate-100">
          {label}:
        </span>{" "}
        {value}
      </p>
    </div>
  );
}
