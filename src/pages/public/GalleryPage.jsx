import { useMemo, useState } from "react";
import { Camera, Images, UploadCloud } from "lucide-react";
import { PublicAdminShortcut } from "../../components/public/PublicAdminActionBar";
import {
  EmptyPublicState,
  InfoCard,
  MediaFrame,
  PublicHero,
  SectionHeader,
} from "../../components/public/PublicContent";
import {
  listActiveItems,
} from "../../services/publicContentService";
import { useGalleryCms } from "../../hooks/usePublicCmsData";

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [galleryItems] = useGalleryCms();
  const activeGalleryItems = useMemo(() => listActiveItems(galleryItems), [galleryItems]);
  const categories = useMemo(
    () => ["Semua", ...new Set(activeGalleryItems.map((item) => item.category))],
    [activeGalleryItems]
  );
  const visibleAlbums = useMemo(
    () =>
      activeCategory === "Semua"
        ? activeGalleryItems
        : activeGalleryItems.filter((item) => item.category === activeCategory),
    [activeCategory, activeGalleryItems]
  );

  return (
    <div className="space-y-10">
      <div className="flex justify-end">
        <PublicAdminShortcut
          to="/admin/content/gallery"
          label="Kelola Galeri"
          icon={Images}
        />
      </div>

      <PublicHero
        eyebrow="Galeri"
        title="Dokumentasi ibadah dan pelayanan jemaat"
        description="Galeri disiapkan sebagai ruang dokumentasi kegiatan gereja. Saat data gambar real sudah tersedia, admin dapat mengisi URL media atau menghubungkannya ke Supabase Storage."
        aside={<MediaFrame label="Album dokumentasi" meta={`${activeGalleryItems.length} album siap isi`} />}
      />

      <section className="grid gap-5 md:grid-cols-3">
        <InfoCard
          icon={Camera}
          title="Dokumentasi kegiatan"
          description="Album dibagi berdasarkan ibadah, komisi, sektor, dan pelayanan kasih."
        />
        <InfoCard
          icon={UploadCloud}
          title="Siap media real"
          description="Struktur item sudah mendukung image URL untuk nanti diisi dari admin atau Supabase Storage."
        />
        <InfoCard
          icon={Images}
          title="Aman untuk demo"
          description="Tidak ada path gambar palsu, sehingga halaman tidak menampilkan broken image."
        />
      </section>

      <section className="space-y-5">
        <SectionHeader
          eyebrow="Album Gereja"
          title="Kumpulan dokumentasi pelayanan"
          description="Filter album berdasarkan kategori kegiatan untuk melihat area pelayanan yang berbeda."
          actions={
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    activeCategory === category
                      ? "border-violet-700 bg-violet-700 text-white dark:border-violet-200 dark:bg-violet-200 dark:text-violet-950"
                      : "border-violet-200 text-slate-700 hover:bg-violet-50 dark:border-violet-950/60 dark:text-slate-200 dark:hover:bg-violet-950/30"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          }
        />

        {visibleAlbums.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleAlbums.map((album) => (
              <article
                key={album.id}
                className="brand-card overflow-hidden transition hover:-translate-y-1 hover:shadow-md"
              >
                <MediaFrame
                  src={album.imageUrl}
                  label={album.title}
                  meta={album.category}
                  compact
                  className="rounded-none border-0"
                />
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-200">
                      {album.category}
                    </span>
                    <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-950/40 dark:text-violet-200">
                      {album.count} foto
                    </span>
                  </div>
                  <h2 className="mt-4 text-xl font-bold text-slate-950 dark:text-white">
                    {album.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {album.description}
                  </p>
                  <p className="mt-4 text-sm font-semibold text-slate-500 dark:text-slate-400">
                    {album.date}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyPublicState
            title="Album belum tersedia"
            description="Belum ada album pada kategori ini. Admin dapat menambahkan galeri dari panel admin."
          />
        )}
      </section>
    </div>
  );
}
