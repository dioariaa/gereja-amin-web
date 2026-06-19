import { Link } from "react-router-dom";
import { CalendarDays, Clock, MapPin, UsersRound } from "lucide-react";
import { PublicAdminShortcut } from "../../components/public/PublicAdminActionBar";
import {
  EmptyPublicState,
  InfoCard,
  PublicHero,
  SectionHeader,
} from "../../components/public/PublicContent";
import {
  churchInfo,
  formatScheduleDate,
  groupFixedSchedulesByCategory,
  groupSchedulesByDate,
  listActiveFixedSchedules,
  listActiveScheduleEvents,
} from "../../services/publicContentService";
import { useFixedSchedulesCms, useSchedulesCms } from "../../hooks/usePublicCmsData";
import { toTitleCase } from "../../utils/textFormat";

export default function SchedulePage() {
  const [fixedScheduleItems] = useFixedSchedulesCms();
  const [scheduleItems] = useSchedulesCms();
  const fixedSchedules = listActiveFixedSchedules(fixedScheduleItems);
  const groupedFixedSchedules = groupFixedSchedulesByCategory(fixedScheduleItems);
  const activeSchedules = listActiveScheduleEvents(scheduleItems);
  const groupedSchedules = groupSchedulesByDate(scheduleItems);
  const nextSchedule = activeSchedules[0];

  return (
    <div className="space-y-10">
      <div className="flex justify-end">
        <PublicAdminShortcut
          to="/admin/content/schedule"
          label="Kelola Jadwal"
          icon={CalendarDays}
        />
      </div>

      <PublicHero
        eyebrow="Jadwal Ibadah"
        title="Jadwal Ibadah & Pelayanan Gereja"
        description="Jadwal rutin tetap membantu pengunjung menemukan waktu ibadah utama. Jadwal pelayanan per tanggal menampilkan event khusus dengan susunan petugas yang lebih lengkap."
        aside={
          <div className="brand-soft-card p-6">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              {toTitleCase("Event pelayanan terdekat")}
            </p>
            <p className="mt-2 text-3xl font-bold text-violet-800 dark:text-violet-100">
              {nextSchedule ? formatScheduleDate(nextSchedule.eventDate) : "Belum ada jadwal"}
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {nextSchedule ? `${nextSchedule.time} - ${nextSchedule.title}` : "Admin dapat menambahkan jadwal dari panel CMS."}
            </p>
          </div>
        }
      />

      <section className="grid gap-5 md:grid-cols-3">
        <InfoCard
          icon={CalendarDays}
          title="Jadwal Ibadah"
          description={`${fixedSchedules.length} jadwal rutin tampil sebagai informasi utama jemaat dan pengunjung.`}
        />
        <InfoCard
          icon={MapPin}
          title="Lokasi Gereja AMIN Tangerang Raya"
          description={churchInfo.address}
        />
        <InfoCard
          icon={UsersRound}
          title="Event & Para Pelayan"
          description="Event per tanggal menampilkan petugas seperti khotbah, liturgos, kolektan, musik, dan multimedia."
        />
      </section>

      <section className="space-y-6">
        <SectionHeader
          eyebrow="Jadwal Ibadah Tetap"
          title="Ibadah Mingguan"
          description="Informasi jadwal tetap ini juga dipakai sebagai ringkasan di beranda. Tidak memuat susunan petugas detail."
        />
        {groupedFixedSchedules.length > 0 ? (
          <div className="grid gap-5 lg:grid-cols-3">
            {groupedFixedSchedules.map((group) => (
              <article key={group.category} className="brand-card p-6">
                <p className="brand-eyebrow text-xs font-semibold uppercase tracking-[0.18em]">
                  {toTitleCase(group.category)}
                </p>
                <h3 className="mt-2 text-xl font-bold text-slate-950 dark:text-white">
                  {toTitleCase(group.category)}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {group.description}
                </p>
                <div className="mt-5 space-y-3">
                  {group.items.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-violet-100 bg-violet-50/40 p-4 dark:border-violet-950/60 dark:bg-violet-950/20">
                      <p className="font-semibold text-slate-950 dark:text-white">
                        {toTitleCase(item.title)}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-cyan-700 dark:text-cyan-200">
                        {item.time}
                      </p>
                      <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                        {item.notes}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyPublicState
            title="Jadwal tetap belum tersedia"
            description="Admin dapat menambahkan jadwal rutin dari panel CMS tanpa mengganggu jadwal per tanggal."
          />
        )}
      </section>

      <section className="space-y-8">
        <SectionHeader
          eyebrow="Event & Jadwal"
          title="Ibadah & Susunan  Petugas Pelayanan"
          description="Setiap event punya tanggal, sesi, keterangan, dan daftar petugas yang dapat dilihat lebih lengkap."
        />
        {groupedSchedules.length > 0 ? groupedSchedules.map((group) => (
          <div key={group.date} className="space-y-5">
            <SectionHeader
              eyebrow="Tanggal Ibadah"
              title={group.label}
              description={`${group.items.length} sesi ibadah terjadwal pada tanggal ini.`}
            />
            <div className="grid gap-5 md:grid-cols-2">
              {group.items.map((item) => (
                <article key={item.id} className="brand-card p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="brand-eyebrow text-xs font-semibold uppercase tracking-[0.18em]">
                        {toTitleCase(item.category)}
                      </p>
                      <h3 className="mt-2 text-xl font-bold text-slate-950 dark:text-white">
                        {toTitleCase(item.title)}
                      </h3>
                      {item.theme ? (
                        <p className="mt-2 text-sm font-semibold text-cyan-700 dark:text-cyan-200">
                          {toTitleCase(item.theme)}
                        </p>
                      ) : null}
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
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <span className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <Clock size={15} />
                      {item.assignments?.length || 0} petugas pelayanan
                    </span>
                    <Link
                      to={`/jadwal-ibadah/${item.id}`}
                      className="brand-link text-sm font-semibold underline underline-offset-4"
                    >
                      Lihat detail jadwal
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )) : (
          <EmptyPublicState
            title="Jadwal ibadah belum tersedia"
            description="Admin dapat menambahkan jadwal ibadah per tanggal dari panel pengelolaan konten."
          />
        )}
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
