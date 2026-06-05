import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, PenLine } from "lucide-react";
import PublicAdminActionBar from "../../components/public/PublicAdminActionBar";
import {
  PUBLICATIONS_STORAGE_KEY,
  findPublicationBySlug,
  formatPublicDate,
  publicationSeed,
} from "../../services/publicationsService";
import useLocalStorageState from "../../hooks/useLocalStorageState";

export default function PublicationDetailPage() {
  const { slug } = useParams();
  const [publications] = useLocalStorageState(PUBLICATIONS_STORAGE_KEY, publicationSeed);
  const publication = findPublicationBySlug(publications, slug);

  if (!publication) {
    return (
      <div className="space-y-8">
        <PublicAdminActionBar
          title="Kelola publikasi"
          description="Publikasi tidak ditemukan di data dummy. Admin dapat kembali ke daftar publikasi untuk mengecek slug."
          actions={[
            {
              label: "Kelola Publikasi",
              to: "/admin/articles",
              icon: ArrowLeft,
              variant: "primary",
            },
          ]}
        />

        <section className="brand-card p-6 md:p-8">
          <p className="brand-eyebrow text-sm font-semibold uppercase tracking-[0.22em]">
            Publikasi Gereja
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
            Publikasi tidak ditemukan
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
      <PublicAdminActionBar
        title="Kelola detail publikasi"
        description="Aksi cepat untuk mengedit publikasi yang sedang dilihat atau kembali ke daftar publikasi admin."
        actions={[
          {
            label: "Edit Publikasi",
            to: `/admin/articles?edit=${slug || "publikasi"}`,
            icon: PenLine,
            variant: "primary",
          },
          {
            label: "Kelola Publikasi",
            to: "/admin/articles",
            icon: ArrowLeft,
          },
        ]}
      />

      <article className="brand-card overflow-hidden">
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
              {publication.category}
            </span>
            <span className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <CalendarDays size={16} />
              {formatPublicDate(publication.date)}
            </span>
          </div>
          <h1 className="mt-4 max-w-4xl text-3xl font-bold leading-tight text-slate-950 md:text-5xl dark:text-white">
            {publication.title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300">
            {publication.excerpt}
          </p>
          <p className="mt-4 text-sm font-semibold text-slate-500 dark:text-slate-400">
            {publication.author || "Sekretariat Gereja"}
          </p>
        </div>

        <div className="px-6 py-8 md:px-10">
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
