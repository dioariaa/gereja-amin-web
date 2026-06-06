import { Link } from "react-router-dom";
import { CalendarDays, PenLine, UsersRound } from "lucide-react";
import {
  MediaFrame,
  PublicHero,
  SectionHeader,
  TagList,
} from "../../components/public/PublicContent";
import {
  getCommissionMetrics,
  listCommissions,
} from "../../services/commissionsService";
import { useCommissionsCms } from "../../hooks/usePublicCmsData";

export default function CommissionsPage() {
  const [savedCommissions] = useCommissionsCms();
  const commissions = listCommissions(savedCommissions)
    .filter((item) => item.status !== "Draft" && item.status !== "Arsip");
  const metrics = getCommissionMetrics(commissions);

  return (
    <div className="space-y-8">
      <PublicHero
        eyebrow="Komisi Pelayanan"
        title="Ruang pelayanan Gereja AMIN Jemaat Tangerang Raya"
        description="Setiap komisi hadir untuk memperlengkapi jemaat dalam persekutuan, pengajaran, pelayanan kasih, dan pengelolaan kebutuhan gereja secara terarah."
        aside={<MediaFrame label="Pelayanan jemaat" meta="8 komisi pelayanan" />}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Total Komisi" value={metrics.total} />
        <MetricCard title="Area Pelayanan" value="8" />
        <MetricCard title="Pengurus Aktif" value={metrics.chairs} />
        <MetricCard title="Fokus Program" value={metrics.focusCount} accent="Pelayanan terpetakan" />
      </section>

      <section className="space-y-5">
        <SectionHeader
          eyebrow="Daftar Komisi"
          title="Komisi yang melayani jemaat"
          description="Pilih komisi untuk melihat fokus pelayanan, pengurus, dan kegiatan basic yang sudah disiapkan."
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {commissions.map((commission) => (
            <article key={commission.slug} className="brand-card flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-md">
              <MediaFrame
                src={commission.imageUrl}
                label={commission.shortName}
                meta="Komisi Pelayanan"
                compact
                className="rounded-none border-0"
              />
              <div className="flex flex-1 flex-col p-6">
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

              <div className="mt-5">
                <TagList items={commission.focus} tone="cyan" />
              </div>

              <div className="mt-6">
                <Link
                  to={`/komisi/${commission.slug}`}
                  className="brand-button-primary inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition"
                >
                  Lihat Detail
                </Link>
              </div>
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
