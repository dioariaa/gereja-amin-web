import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, PenLine, Settings, UserRound } from "lucide-react";
import PublicAdminActionBar, {
  ContentManageButton,
} from "../../components/public/PublicAdminActionBar";
import {
  COMMISSIONS_STORAGE_KEY,
  commissionSeed,
  findCommissionBySlug,
  listCommissions,
} from "../../services/commissionsService";
import useLocalStorageState from "../../hooks/useLocalStorageState";

export default function CommissionDetailPage() {
  const { slug } = useParams();
  const [savedCommissions] = useLocalStorageState(COMMISSIONS_STORAGE_KEY, commissionSeed);
  const commissions = listCommissions(savedCommissions);
  const commission = findCommissionBySlug(commissions, slug);
  const relatedCommissions = commissions
    .filter((item) => item.slug !== commission?.slug)
    .slice(0, 3);

  if (!commission) {
    return <Navigate to="/komisi" replace />;
  }

  return (
    <div className="space-y-8">
      <PublicAdminActionBar
        title={`Kelola ${commission.shortName}`}
        description="Aksi ini hanya tampil untuk admin yang berwenang mengelola konten komisi."
        actions={[
          {
            label: "Edit Komisi",
            to: `/admin/content/commissions/${commission.slug}?action=edit`,
            icon: PenLine,
            variant: "primary",
          },
          {
            label: "Kelola Kegiatan",
            to: `/admin/content/commissions/${commission.slug}?action=activities`,
            icon: CalendarDays,
          },
        ]}
      />

      <section className="brand-card rounded-3xl px-6 py-10 md:px-10 md:py-14">
        <Link
          to="/komisi"
          className="brand-link inline-flex items-center gap-2 text-sm font-semibold"
        >
          <ArrowLeft size={16} />
          Kembali ke Komisi
        </Link>
        <p className="brand-eyebrow mt-8 text-sm font-semibold uppercase tracking-[0.22em]">
          Komisi Pelayanan
        </p>
        <h1 className="mt-3 max-w-4xl text-3xl font-bold text-slate-950 md:text-5xl dark:text-white">
          {commission.name}
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 md:text-base dark:text-slate-300">
          {commission.description}
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <InfoCard icon={UserRound} title="Pengurus Komisi" value={commission.chair} />
        <InfoCard icon={CalendarDays} title="Jadwal / Kegiatan" value={commission.schedule} />
      </section>

      <section className="brand-card p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="brand-eyebrow text-sm font-semibold uppercase tracking-[0.22em]">
              Fokus Pelayanan
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
              Ruang pelayanan {commission.shortName}
            </h2>
          </div>
          <ContentManageButton
            to={`/admin/content/commissions/${commission.slug}?action=content`}
            icon={Settings}
          >
            Tambah Konten Komisi
          </ContentManageButton>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {commission.focus.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-violet-100 bg-violet-50/50 p-4 text-sm font-semibold text-slate-700 dark:border-violet-950/60 dark:bg-violet-950/20 dark:text-slate-200"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="brand-card p-6 md:p-8">
        <p className="brand-eyebrow text-sm font-semibold uppercase tracking-[0.22em]">
          Jadwal & Kegiatan
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
          Agenda pelayanan {commission.shortName}
        </h2>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {(commission.activities || [commission.schedule]).map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-cyan-100 bg-cyan-50/50 p-4 text-sm font-semibold text-slate-700 dark:border-cyan-950/60 dark:bg-cyan-950/20 dark:text-slate-200"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="brand-card p-6 md:p-8">
        <p className="brand-eyebrow text-sm font-semibold uppercase tracking-[0.22em]">
          Komisi Lainnya
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
          Pelayanan yang saling terhubung
        </h2>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {relatedCommissions.map((item) => (
            <Link
              key={item.slug}
              to={`/komisi/${item.slug}`}
              className="rounded-2xl border border-violet-100 p-4 text-sm font-semibold text-slate-700 transition hover:bg-violet-50 dark:border-violet-950/60 dark:text-slate-200 dark:hover:bg-violet-950/20"
            >
              {item.shortName}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function InfoCard({ icon: Icon, title, value }) {
  return (
    <div className="brand-card p-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-200">
        <Icon size={20} />
      </div>
      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <p className="mt-2 text-lg font-bold text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}
