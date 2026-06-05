import { CalendarDays, Plus } from "lucide-react";
import PublicAdminActionBar from "../../components/public/PublicAdminActionBar";

export default function SchedulePage() {
  return (
    <div className="space-y-8">
      <PublicAdminActionBar
        title="Kelola jadwal ibadah"
        description="Atur jadwal ibadah, sektor, dan kegiatan pelayanan dari panel admin."
        actions={[
          {
            label: "Kelola Jadwal",
            to: "/admin/content/schedule",
            icon: CalendarDays,
            variant: "primary",
          },
          {
            label: "Tambah Jadwal",
            to: "/admin/content/schedule?action=tambah-jadwal",
            icon: Plus,
          },
        ]}
      />

      <div className="brand-card p-6">
        <p className="brand-eyebrow text-sm font-semibold uppercase tracking-[0.22em]">
          Pelayanan Mingguan
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">Jadwal Ibadah</h1>
      </div>
    </div>
  );
}
