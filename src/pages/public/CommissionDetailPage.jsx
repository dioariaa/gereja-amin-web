import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Newspaper, PenLine, Plus, UserRound } from "lucide-react";
import { PublicAdminShortcut } from "../../components/public/PublicAdminActionBar";
import {
  EmptyPublicState,
  MediaFrame,
  PublicHero,
  SectionHeader,
  TagList,
} from "../../components/public/PublicContent";
import {
  findCommissionBySlug,
  listCommissions,
} from "../../services/commissionsService";
import {
  formatPublicDate,
  listPublicationsByCommission,
} from "../../services/publicationsService";
import {
  useCommissionsCms,
  usePublicationsCms,
} from "../../hooks/usePublicCmsData";

export default function CommissionDetailPage() {
  const { slug } = useParams();
  const [savedCommissions] = useCommissionsCms();
  const [publications] = usePublicationsCms();
  const commissions = listCommissions(savedCommissions)
    .filter((item) => item.status !== "Draft" && item.status !== "Arsip");
  const commission = findCommissionBySlug(commissions, slug);
  const commissionPublications = listPublicationsByCommission(
    publications,
    commission?.slug
  );
  const relatedCommissions = commissions
    .filter((item) => item.slug !== commission?.slug)
    .slice(0, 3);

  if (!commission) {
    return <Navigate to="/komisi" replace />;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <PublicAdminShortcut
          to={`/admin/content/commissions/${commission.slug}?action=edit`}
          label="Edit Komisi"
          icon={PenLine}
        />
      </div>

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
          eyebrow="Publikasi Komisi"
          title={`Berita dan kegiatan ${commission.shortName}`}
          description="Publikasi yang terhubung langsung dengan pelayanan komisi ini."
          actions={
            <PublicAdminShortcut
              to={`/admin/articles?action=create&commission=${commission.slug}`}
              label="Tambah Publikasi"
              icon={Plus}
            />
          }
        />

        {commissionPublications.length > 0 ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {commissionPublications.map((item) => (
              <Link
                key={item.id}
                to={`/publikasi/${item.slug}`}
                className="group brand-card flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-md"
              >
                <MediaFrame
                  src={item.coverImage}
                  label={item.coverLabel || commission.shortName}
                  meta={item.category}
                  compact
                  className="rounded-none border-0"
                />
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex w-fit rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-950/40 dark:text-violet-200">
                      {item.category}
                    </span>
                    <span className="inline-flex w-fit rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-200">
                      {commission.shortName}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold leading-tight text-slate-950 transition group-hover:text-violet-700 dark:text-white dark:group-hover:text-violet-200">
                    {item.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {item.excerpt}
                  </p>
                  <div className="mt-5 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Newspaper size={15} />
                    <span>{formatPublicDate(item.date)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-6">
            <EmptyPublicState
              title="Belum ada publikasi komisi"
              description="Publikasi kegiatan komisi akan tampil di sini setelah admin menautkan artikel ke komisi ini."
            />
          </div>
        )}
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
