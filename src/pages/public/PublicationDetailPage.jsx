import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, PenLine } from "lucide-react";
import { PublicAdminShortcut } from "../../components/public/PublicAdminActionBar";
import { MediaFrame } from "../../components/public/PublicContent";
import {
  findPublicationBySlug,
  formatPublicDate,
  getPublicationCommission,
} from "../../services/publicationsService";
import {
  listCommissions,
} from "../../services/commissionsService";
import {
  useCommissionsCms,
  usePublicationsCms,
} from "../../hooks/usePublicCmsData";
import { toTitleCase } from "../../utils/textFormat";

export default function PublicationDetailPage() {
  const { slug } = useParams();
  const [publications] = usePublicationsCms();
  const [commissionItems] = useCommissionsCms();
  const publication = findPublicationBySlug(publications, slug);
  const commissions = listCommissions(commissionItems)
    .filter((item) => item.status !== "Draft" && item.status !== "Arsip");
  const relatedCommission = getPublicationCommission(publication, commissions);

  if (!publication) {
    return (
      <div className="space-y-8">
        <div className="flex justify-end">
          <PublicAdminShortcut
            to="/admin/articles"
            label="Kelola Publikasi"
            icon={PenLine}
          />
        </div>

        <section className="brand-card p-6 md:p-8">
          <p className="brand-eyebrow text-sm font-semibold uppercase tracking-[0.22em]">
            {toTitleCase("Publikasi Gereja")}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
            {toTitleCase("Publikasi tidak ditemukan")}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
            Konten dengan slug ini belum tersedia atau masih tersimpan sebagai draft.
          </p>
          <Link
            to="/publikasi"
            className="brand-button-secondary mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition"
          >
            <ArrowLeft size={17} />
            Kembali ke Publikasi
          </Link>
        </section>
      </div>
    );
  }

  const paragraphs = (publication.content || publication.excerpt || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <PublicAdminShortcut
          to={`/admin/articles?edit=${slug || "publikasi"}`}
          label="Edit Publikasi"
          icon={PenLine}
        />
      </div>

      <article className="brand-card overflow-hidden">
        <MediaFrame
          src={publication.coverImage}
          label={publication.coverLabel || publication.category}
          meta="Publikasi Gereja"
          className="h-[260px] rounded-none border-0 md:h-[360px]"
        />
        <div className="border-b border-violet-100 px-6 py-8 md:px-10 md:py-10 dark:border-violet-950/60">
          <Link
            to="/publikasi"
            className="brand-link inline-flex items-center gap-2 text-sm font-semibold"
          >
            <ArrowLeft size={16} />
            Kembali ke daftar publikasi
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-950/40 dark:text-violet-200">
              {toTitleCase(publication.category)}
            </span>
            {relatedCommission ? (
              <Link
                to={`/komisi/${relatedCommission.slug}`}
                className="inline-flex rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-100 dark:bg-cyan-950/30 dark:text-cyan-200 dark:hover:bg-cyan-950/50"
              >
                {toTitleCase(relatedCommission.shortName || relatedCommission.name)}
              </Link>
            ) : null}
            <span className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <CalendarDays size={16} />
              {formatPublicDate(publication.date)}
            </span>
            {publication.readingTime ? (
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {publication.readingTime}
              </span>
            ) : null}
          </div>
          <h1 className="mt-4 max-w-4xl text-3xl font-bold leading-tight text-slate-950 md:text-5xl dark:text-white">
            {toTitleCase(publication.title)}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300">
            {publication.excerpt}
          </p>
          <p className="mt-4 text-sm font-semibold text-slate-500 dark:text-slate-400">
            {publication.author || "Sekretariat Gereja"}
          </p>
          {relatedCommission ? (
            <Link
              to={`/komisi/${relatedCommission.slug}`}
              className="brand-link mt-5 inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4"
            >
              Lihat profil {relatedCommission.shortName || relatedCommission.name}
            </Link>
          ) : null}
        </div>

        <div className="px-6 py-8 md:px-10 md:py-10">
          <div className="max-w-3xl space-y-5 text-base leading-8 text-slate-700 dark:text-slate-200">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
