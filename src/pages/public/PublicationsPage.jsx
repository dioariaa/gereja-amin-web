import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Search } from "lucide-react";
import {
  EmptyPublicState,
  MediaFrame,
  PublicHero,
  SectionHeader,
} from "../../components/public/PublicContent";
import {
  filterPublicationsByCategory,
  formatPublicDate,
  getPublicationCommissionLabel,
  getPublicationCategories,
  listActivePublications,
  publicationSeed,
} from "../../services/publicationsService";
import { listCommissions } from "../../services/commissionsService";
import {
  useCommissionsCms,
  usePublicationsCms,
} from "../../hooks/usePublicCmsData";
import { toTitleCase } from "../../utils/textFormat";

export default function PublicationsPage() {
  const [publications] = usePublicationsCms();
  const [commissionItems] = useCommissionsCms();
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [query, setQuery] = useState("");
  const commissions = useMemo(
    () => listCommissions(commissionItems)
      .filter((item) => item.status !== "Draft" && item.status !== "Arsip"),
    [commissionItems]
  );
  const publicPublications = useMemo(
    () => listActivePublications(publications),
    [publications]
  );
  const visiblePublications = useMemo(() => {
    const filtered = filterPublicationsByCategory(publications, activeFilter);
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return filtered;

    return filtered.filter((item) =>
      [
        item.title,
        item.excerpt,
        item.category,
        item.author,
        getPublicationCommissionLabel(item, commissions),
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedQuery))
    );
  }, [activeFilter, commissions, publications, query]);
  const featuredPost = publicPublications[0] || publications[0] || publicationSeed[0];
  const filters = getPublicationCategories(publications);
  const featuredCommissionLabel = getPublicationCommissionLabel(featuredPost, commissions);

  return (
    <div className="space-y-10">
      <PublicHero
        eyebrow="Publikasi Gereja"
        title="Warta, renungan, dan buletin yang mudah diikuti jemaat."
        description="Halaman ini menjadi pusat informasi jemaat untuk pengumuman ibadah, renungan, ringkasan firman, dan catatan pelayanan gereja."
        aside={
          <MediaFrame
            src={featuredPost.coverImage}
            label={featuredPost.coverLabel || featuredPost.category}
            meta="Konten pilihan"
          />
        }
      />

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="brand-card overflow-hidden rounded-3xl">
          <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
            <MediaFrame
              src={featuredPost.coverImage}
              label={featuredPost.coverLabel || featuredPost.category}
              meta={featuredPost.category}
              className="h-full rounded-none border-0"
            />
            <div className="p-6 md:p-8">
              <span className="inline-flex rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-200">
                {toTitleCase(featuredPost.category)}
              </span>
              {featuredCommissionLabel ? (
                <span className="ml-2 inline-flex rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-950/40 dark:text-violet-200">
                  {toTitleCase(featuredCommissionLabel)}
                </span>
              ) : null}
              <h2 className="mt-4 text-2xl font-bold leading-tight text-slate-950 md:text-3xl dark:text-white">
                {toTitleCase(featuredPost.title)}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {featuredPost.excerpt}
              </p>
              <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
                <span>{formatPublicDate(featuredPost.date)}</span>
                <span>-</span>
                <span>{featuredPost.author || "Sekretariat Gereja"}</span>
                {featuredPost.readingTime ? (
                  <>
                    <span>-</span>
                    <span>{featuredPost.readingTime}</span>
                  </>
                ) : null}
              </div>
              <Link
                to={`/publikasi/${featuredPost.slug}`}
                className="brand-button-primary mt-6 inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition"
              >
                Baca Selengkapnya
              </Link>
            </div>
          </div>
        </article>

        <div className="brand-card rounded-3xl p-5 md:p-6">
          <SectionHeader
            eyebrow="Jelajahi Konten"
            title="Filter publikasi"
            description="Gunakan kategori atau pencarian untuk menemukan informasi yang dibutuhkan."
          />
          <label className="brand-search-box mt-5 flex items-center gap-3 rounded-2xl px-4 py-3">
            <Search size={18} className="shrink-0 text-violet-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari judul, kategori, atau penulis"
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </label>
          <div className="mt-4 flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  activeFilter === filter
                    ? "border-violet-700 bg-violet-700 text-white dark:border-violet-200 dark:bg-violet-200 dark:text-violet-950"
                    : "border-violet-200 text-slate-700 hover:bg-violet-50 dark:border-violet-950/60 dark:text-slate-200 dark:hover:bg-violet-950/30"
                }`}
              >
                {toTitleCase(filter)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <SectionHeader
          eyebrow="Daftar Publikasi"
          title="Informasi terbaru untuk jemaat"
          description={`${visiblePublications.length} publikasi aktif ditampilkan berdasarkan filter saat ini.`}
        />

        {visiblePublications.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visiblePublications.map((item) => (
              <article
                key={item.id}
                className="brand-card flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-md"
              >
                <MediaFrame
                  src={item.coverImage}
                  label={item.coverLabel || item.category}
                  meta={item.category}
                  compact
                  className="rounded-none border-0"
                />
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex w-fit rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-950/40 dark:text-violet-200">
                      {toTitleCase(item.category)}
                    </span>
                    {getPublicationCommissionLabel(item, commissions) ? (
                      <span className="inline-flex w-fit rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-200">
                        {toTitleCase(getPublicationCommissionLabel(item, commissions))}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-slate-950 dark:text-white">
                    {toTitleCase(item.title)}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {item.excerpt}
                  </p>
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <CalendarDays size={15} />
                      {formatPublicDate(item.date)}
                    </span>
                    <Link
                      to={`/publikasi/${item.slug}`}
                      className="brand-link text-sm font-semibold underline underline-offset-4"
                    >
                      Baca
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyPublicState
            title="Publikasi belum ditemukan"
            description="Coba ubah kategori atau kata kunci pencarian. Admin dapat menambahkan publikasi baru dari panel admin."
          />
        )}
      </section>
    </div>
  );
}
