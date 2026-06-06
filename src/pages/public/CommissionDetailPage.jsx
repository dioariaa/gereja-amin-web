import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, PenLine, Settings, UserRound } from "lucide-react";
import PublicAdminActionBar, {
  ContentManageButton,
} from "../../components/public/PublicAdminActionBar";
import {
  MediaFrame,
  PublicHero,
  SectionHeader,
  TagList,
} from "../../components/public/PublicContent";
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

      <PublicHero
        eyebrow="Komisi Pelayanan"
        title={commission.name}
        description={commission.description}
        aside={
          <MediaFrame
            src={commission.imageUrl}
            label={commission.shortName}
            meta="Profil Komisi"
          />
        }
      >
        <Link
          to="/komisi"
          className="brand-link inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4"
        >
          <ArrowLeft size={16} />
          Kembali ke Komisi
        </Link>
      </PublicHero>

      <section className="grid gap-5 md:grid-cols-2">
        <InfoCard icon={UserRound} title="Pengurus Komisi" value={commission.chair} />
        <InfoCard icon={CalendarDays} title="Jadwal / Kegiatan" value={commission.schedule} />
      </section>

      <section className="brand-card p-6 md:p-8">
        <SectionHeader
          eyebrow="Fokus Pelayanan"
          title={`Ruang pelayanan ${commission.shortName}`}
          description="Area pelayanan utama yang menjadi perhatian komisi dalam pembinaan dan kegiatan jemaat."
          actions={
          <ContentManageButton
            to={`/admin/content/commissions/${commission.slug}?action=content`}
            icon={Settings}
          >
            Tambah Konten Komisi
          </ContentManageButton>
          }
        />

        <div className="mt-6">
          <TagList items={commission.focus} />
        </div>
      </section>

      <section className="brand-card p-6 md:p-8">
        <SectionHeader
          eyebrow="Jadwal & Kegiatan"
          title={`Agenda pelayanan ${commission.shortName}`}
          description="Kegiatan ini masih berbasis data dummy/localStorage dan siap disambungkan ke database public content."
        />
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
        <SectionHeader
          eyebrow="Komisi Lainnya"
          title="Pelayanan yang saling terhubung"
          description="Setiap komisi bergerak dalam koordinasi pelayanan jemaat yang sama."
        />
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
