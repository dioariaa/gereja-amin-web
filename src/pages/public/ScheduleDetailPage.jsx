import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Clock, MapPin, PenLine, UsersRound } from "lucide-react";
import { PublicAdminShortcut } from "../../components/public/PublicAdminActionBar";
import {
  EmptyPublicState,
  InfoCard,
  PublicHero,
  SectionHeader,
} from "../../components/public/PublicContent";
import {
  findScheduleById,
  formatScheduleDate,
  listActiveScheduleEvents,
} from "../../services/publicContentService";
import { useSchedulesCms } from "../../hooks/usePublicCmsData";

export default function ScheduleDetailPage() {
  const { scheduleId } = useParams();
  const [scheduleItems] = useSchedulesCms();
  const schedule = findScheduleById(scheduleItems, scheduleId);
  const relatedSchedules = listActiveScheduleEvents(scheduleItems)
    .filter((item) => item.id !== schedule?.id)
    .slice(0, 3);

  if (!schedule || schedule.status === "Draft" || schedule.status === "Arsip") {
    return <Navigate to="/jadwal-ibadah" replace />;
  }

  const assignments = schedule.assignments || [];

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <PublicAdminShortcut
          to="/admin/content/schedule"
          label="Kelola Jadwal"
          icon={PenLine}
        />
      </div>

      <PublicHero
        eyebrow={schedule.category}
        title={schedule.title}
        description={schedule.description || schedule.notes}
        aside={
          <div className="brand-soft-card p-6">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              Tanggal dan jam
            </p>
            <p className="mt-2 text-2xl font-bold text-violet-800 dark:text-violet-100">
              {formatScheduleDate(schedule.eventDate)}
            </p>
            <p className="mt-3 text-lg font-semibold text-slate-950 dark:text-white">
              {schedule.time}
            </p>
          </div>
        }
      >
        <Link
          to="/jadwal-ibadah"
          className="brand-link inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4"
        >
          <ArrowLeft size={16} />
          Kembali ke jadwal ibadah
        </Link>
      </PublicHero>

      <section className="grid gap-5 md:grid-cols-3">
        <InfoCard
          icon={CalendarDays}
          title="Tanggal"
          description={formatScheduleDate(schedule.eventDate)}
        />
        <InfoCard
          icon={Clock}
          title="Jam Ibadah"
          description={schedule.time}
        />
        <InfoCard
          icon={MapPin}
          title="Lokasi"
          description={schedule.location}
        />
      </section>

      {schedule.theme || schedule.notes ? (
        <section className="brand-card p-6 md:p-8">
          <SectionHeader
            eyebrow="Tema dan Keterangan"
            title={schedule.theme || "Keterangan Ibadah"}
            description={schedule.notes}
          />
        </section>
      ) : null}

      <section className="brand-card p-6 md:p-8">
        <SectionHeader
          eyebrow="Susunan Petugas"
          title="Petugas pelayanan ibadah"
          description="Daftar petugas disusun sesuai kebutuhan setiap sesi ibadah."
        />

        {assignments.length > 0 ? (
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="rounded-2xl border border-violet-100 bg-white p-4 dark:border-violet-950/60 dark:bg-[#15111c]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-200">
                  {assignment.role}
                </p>
                <p className="mt-2 text-base font-bold text-slate-950 dark:text-white">
                  {assignment.name || "-"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6">
            <EmptyPublicState
              title="Petugas belum diisi"
              description="Susunan petugas untuk jadwal ini dapat dilengkapi dari admin panel."
            />
          </div>
        )}
      </section>

      <section className="brand-card p-6 md:p-8">
        <SectionHeader
          eyebrow="Jadwal Lain"
          title="Event ibadah berikutnya"
          description="Beberapa jadwal aktif lain yang dapat dilihat jemaat."
        />
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {relatedSchedules.map((item) => (
            <Link
              key={item.id}
              to={`/jadwal-ibadah/${item.id}`}
              className="rounded-2xl border border-violet-100 p-4 text-sm transition hover:bg-violet-50 dark:border-violet-950/60 dark:hover:bg-violet-950/20"
            >
              <span className="inline-flex items-center gap-2 font-semibold text-cyan-700 dark:text-cyan-200">
                <UsersRound size={15} />
                {item.time}
              </span>
              <p className="mt-2 font-bold text-slate-950 dark:text-white">{item.title}</p>
              <p className="mt-1 text-slate-500 dark:text-slate-400">{formatScheduleDate(item.eventDate)}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
