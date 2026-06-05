import { Images, Plus } from "lucide-react";
import PublicAdminActionBar from "../../components/public/PublicAdminActionBar";

export default function GalleryPage() {
  return (
    <div className="space-y-8">
      <PublicAdminActionBar
        title="Kelola galeri"
        description="Tambah album, foto, dan dokumentasi kegiatan gereja dari panel admin."
        actions={[
          {
            label: "Tambah Galeri",
            to: "/admin/content/gallery?action=tambah-galeri",
            icon: Plus,
            variant: "primary",
          },
          {
            label: "Kelola Galeri",
            to: "/admin/content/gallery",
            icon: Images,
          },
        ]}
      />

      <div className="brand-card p-6">
        <p className="brand-eyebrow text-sm font-semibold uppercase tracking-[0.22em]">
          Dokumentasi
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">Galeri</h1>
      </div>
    </div>
  );
}
