import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Plus } from "lucide-react";
import PublicAdminActionBar from "../../components/public/PublicAdminActionBar";
import {
  PUBLICATIONS_STORAGE_KEY,
  filterPublicationsByCategory,
  formatPublicDate,
  getPublicationCategories,
  listActivePublications,
  publicationSeed,
} from "../../services/publicationsService";
import useLocalStorageState from "../../hooks/useLocalStorageState";

export default function PublicationsPage() {
  const [publications] = useLocalStorageState(PUBLICATIONS_STORAGE_KEY, publicationSeed);
  const [activeFilter, setActiveFilter] = useState("Semua");
  const publicPublications = useMemo(
    () => listActivePublications(publications),
    [publications]
  );
  const visiblePublications = useMemo(
    () => filterPublicationsByCategory(publications, activeFilter),
    [activeFilter, publications]
  );
  const featuredPost = publicPublications[0] || publications[0] || publicationSeed[0];
  const filters = getPublicationCategories(publications);

  return (
    <div className="space-y-10">
      <PublicAdminActionBar
        title="Kelola publikasi gereja"
        description="Tambah atau edit warta jemaat, renungan, dan buletin khotbah dari panel admin."
        actions={[
          {
            label: "Tambah Publikasi",
            to: "/admin/articles?action=create",
            icon: Plus,
            variant: "primary",
          },
          {
            label: "Kelola Publikasi",
            to: "/admin/articles",
            icon: FileText,
          },
        ]}
      />

      <section className="brand-card rounded-3xl px-6 py-10 md:px-10 md:py-14">
        <p className="brand-eyebrow text-sm font-semibold uppercase tracking-[0.22em]">
          Publikasi Gereja
        </p>
        <h1 className="mt-3 max-w-4xl text-3xl font-bold text-slate-950 md:text-5xl dark:text-white">
          Warta, renungan, dan buletin dalam satu tempat.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 md:text-base dark:text-slate-300">
          Ikuti informasi terbaru, renungan harian, dan ringkasan firman untuk
          mendukung pertumbuhan jemaat.
        </p>
      </section>

      <section className="brand-card p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="brand-eyebrow text-sm font-semibold uppercase tracking-[0.22em]">
              Filter Publikasi
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
              Temukan konten yang dicari
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((filter, index) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  activeFilter === filter || (index === 0 && activeFilter === "Semua")
                    ? "border-violet-700 bg-violet-700 text-white dark:border-violet-200 dark:bg-violet-200 dark:text-violet-950"
                    : "border-violet-200 text-slate-700 hover:bg-violet-50 dark:border-violet-950/60 dark:text-slate-200 dark:hover:bg-violet-950/30"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <article className="rounded-3xl border border-violet-200 bg-[#2c2038] p-6 text-white shadow-sm md:p-8 dark:border-violet-950/60">
          <span className="inline-flex rounded-full bg-cyan-100/15 px-3 py-1 text-xs font-semibold text-cyan-100">
            {featuredPost.category}
          </span>
          <h2 className="mt-4 text-2xl font-bold md:text-3xl">{featuredPost.title}</h2>
          <p className="mt-4 text-sm leading-7 text-white/80">{featuredPost.excerpt}</p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm text-white/60">
            <span>{formatPublicDate(featuredPost.date)}</span>
            <span>-</span>
            <span>{featuredPost.author || "Sekretariat Gereja"}</span>
          </div>
          <Link
            to={`/publikasi/${featuredPost.slug}`}
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-violet-900 transition hover:bg-violet-50"
          >
            Baca Selengkapnya
          </Link>
        </article>

        <div className="grid gap-4">
          <MetricCard title="Konten Aktif" value={publicPublications.length} description="Total publikasi aktif dari dummy localStorage." />
          <MetricCard title="Kategori" value={new Set(publicPublications.map((item) => item.category)).size} description="Kategori mengikuti data publikasi admin." />
        </div>
      </section>

      <section>
        <div className="mb-5">
          <p className="brand-eyebrow text-sm font-semibold uppercase tracking-[0.22em]">
            Daftar Publikasi
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
            Informasi terbaru untuk jemaat
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visiblePublications.map((item) => (
            <article
              key={item.id}
              className="brand-card p-6 transition hover:-translate-y-1 hover:shadow-md"
            >
              <span className="inline-flex rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-950/40 dark:text-violet-200">
                {item.category}
              </span>
              <h3 className="mt-4 text-xl font-semibold text-slate-950 dark:text-white">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {item.excerpt}
              </p>
              <div className="mt-5 flex items-center justify-between gap-3">
                <span className="text-sm text-slate-500 dark:text-slate-400">{formatPublicDate(item.date)}</span>
                <Link
                  to={`/publikasi/${item.slug}`}
                  className="brand-link text-sm font-semibold underline underline-offset-4"
                >
                  Baca
                </Link>
              </div>
            </article>
          ))}
          {visiblePublications.length === 0 ? (
            <div className="brand-card p-6 text-sm leading-7 text-slate-600 dark:text-slate-300 md:col-span-2 xl:col-span-3">
              Belum ada publikasi aktif untuk kategori ini.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function MetricCard({ title, value, description }) {
  return (
    <div className="brand-card p-5">
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <p className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {description}
      </p>
    </div>
  );
}
