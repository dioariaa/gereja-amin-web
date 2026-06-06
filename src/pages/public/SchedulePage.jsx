import { Link } from "react-router-dom";
import { CalendarDays, Clock, MapPin, Plus } from "lucide-react";
import PublicAdminActionBar from "../../components/public/PublicAdminActionBar";
import {
  InfoCard,
  PublicHero,
  SectionHeader,
} from "../../components/public/PublicContent";
import {
  churchInfo,
  worshipScheduleGroups,
} from "../../data/publicContentData";

export default function SchedulePage() {
  const totalSchedules = worshipScheduleGroups.reduce(
    (total, group) => total + group.items.length,
    0
  );

  return (
    <div className="space-y-10">
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

      <PublicHero
        eyebrow="Jadwal Ibadah"
        title="Ibadah dan kegiatan pelayanan Gereja AMIN"
        description="Jadwal disusun agar jemaat dan pengunjung mudah mengetahui waktu ibadah umum, pembinaan anak, pemuda, sektor, dan kegiatan komisi."
        aside={
          <div className="brand-soft-card p-6">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              Jadwal aktif
            </p>
            <p className="mt-2 text-5xl font-bold text-violet-800 dark:text-violet-100">
              {totalSchedules}
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Data saat ini masih dummy terstruktur dan siap dipindahkan ke tabel jadwal.
            </p>
          </div>
        }
      />

      <section className="grid gap-5 md:grid-cols-3">
        <InfoCard
          icon={Clock}
          title="Datang lebih awal"
          description="Jemaat dianjurkan hadir sebelum ibadah dimulai agar persiapan berlangsung tertib."
        />
        <InfoCard
          icon={MapPin}
          title="Lokasi ibadah"
          description={churchInfo.address}
        />
        <InfoCard
          icon={CalendarDays}
          title="Konfirmasi agenda"
          description="Agenda sektor dan komisi dapat berubah mengikuti koordinasi pengurus."
        />
      </section>

      <section className="space-y-8">
        {worshipScheduleGroups.map((group) => (
          <div key={group.category} className="space-y-5">
            <SectionHeader
              eyebrow="Kategori Jadwal"
              title={group.category}
              description={group.description}
            />
            <div className="grid gap-5 md:grid-cols-2">
              {group.items.map((item) => (
                <article key={`${group.category}-${item.title}`} className="brand-card p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="brand-eyebrow text-xs font-semibold uppercase tracking-[0.18em]">
                        {group.category}
                      </p>
                      <h3 className="mt-2 text-xl font-bold text-slate-950 dark:text-white">
                        {item.title}
                      </h3>
                    </div>
                    <span className="inline-flex w-fit rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-200">
                      {item.time}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {item.notes}
                  </p>
                  <p className="mt-4 flex items-start gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    <MapPin size={16} className="mt-0.5 shrink-0 text-violet-500" />
                    {item.location}
                  </p>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="brand-card rounded-3xl p-6 md:p-8">
        <SectionHeader
          eyebrow="Butuh Informasi?"
          title="Hubungi sekretariat gereja"
          description="Untuk jadwal khusus, ibadah keluarga, atau kegiatan komisi, jemaat dapat menghubungi kontak resmi gereja."
          actions={
            <Link
              to="/kontak"
              className="brand-button-primary inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition"
            >
              Lihat Kontak
            </Link>
          }
        />
      </section>
    </div>
  );
}
