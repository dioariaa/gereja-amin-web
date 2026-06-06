import { Link } from "react-router-dom";
import { CalendarDays, MapPin, Newspaper, UsersRound } from "lucide-react";
import heroImage from "../../assets/hero.png";
import {
  churchInfo,
  getPrimaryContact,
  listActiveFixedSchedules,
  ministryPillars,
  publicStats,
  serviceAreas,
} from "../../services/publicContentService";
import {
  formatPublicDate,
  listActivePublications,
} from "../../services/publicationsService";
import {
  useCommissionsCms,
  useContactsCms,
  useFixedSchedulesCms,
  useHomeContentCms,
  usePublicationsCms,
} from "../../hooks/usePublicCmsData";
import {
  InfoCard,
  MediaFrame,
  SectionHeader,
  TagList,
} from "../../components/public/PublicContent";

export default function HomePage() {
  const [homeContent] = useHomeContentCms();
  const [fixedScheduleItems] = useFixedSchedulesCms();
  const [contactItems] = useContactsCms();
  const [publications] = usePublicationsCms();
  const [commissions] = useCommissionsCms();
  const primarySchedules = listActiveFixedSchedules(fixedScheduleItems).slice(0, 3);
  const mainFixedSchedule = primarySchedules[0];
  const featuredPublications = listActivePublications(publications).slice(0, 2);
  const featuredCommissions = commissions
    .filter((item) => item.status !== "Draft" && item.status !== "Arsip")
    .slice(0, 4);
  const phoneContact = getPrimaryContact(contactItems, "WhatsApp");
  const emailContact = getPrimaryContact(contactItems, "Email");
  const addressContact = getPrimaryContact(contactItems, "Alamat Gereja");

  return (
    <div className="space-y-12">
      <section className="relative isolate overflow-hidden rounded-3xl border border-violet-100 bg-[#2c2038] text-white shadow-sm dark:border-violet-950/60">
        <img
          src={heroImage}
          alt={churchInfo.name}
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 -z-10 bg-[#2c2038]/75" />

        <div className="grid min-h-[560px] gap-8 px-6 py-10 md:grid-cols-[1.1fr_0.9fr] md:px-10 md:py-16">
          <div className="flex flex-col justify-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-cyan-100">
              {homeContent.heroEyebrow}
            </p>
            <h1 className="max-w-3xl text-3xl font-bold leading-tight md:text-5xl">
              {homeContent.heroTitle}
            </h1>
            <p className="mt-4 text-lg font-semibold text-white/90">
              {homeContent.heroSubtitle}
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 md:text-base">
              {homeContent.heroDescription}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to={homeContent.primaryCtaTo}
                className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-violet-900 transition hover:bg-violet-50"
              >
                {homeContent.primaryCtaLabel}
              </Link>
              <Link
                to={homeContent.secondaryCtaTo}
                className="inline-flex items-center justify-center rounded-xl border border-cyan-100/40 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {homeContent.secondaryCtaLabel}
              </Link>
            </div>
          </div>

          <div className="grid content-end gap-4">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
              <p className="text-sm text-cyan-100">Ibadah Umum Minggu</p>
              <h2 className="mt-2 text-lg font-semibold">
                {mainFixedSchedule
                  ? mainFixedSchedule.time
                  : "Jadwal segera diperbarui"}
              </h2>
              <p className="mt-2 text-sm text-white/75">
                {mainFixedSchedule?.title || "Terbuka untuk jemaat dan pengunjung yang ingin beribadah bersama."}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                <p className="text-sm text-cyan-100">Lokasi</p>
                <p className="mt-2 text-sm font-semibold leading-6">{addressContact?.value || churchInfo.address}</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                <p className="text-sm text-cyan-100">Kontak</p>
                <p className="mt-2 text-lg font-bold">{phoneContact?.value || churchInfo.phone}</p>
                <p className="mt-1 break-all text-xs text-white/70">{emailContact?.value || churchInfo.email}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {publicStats.map((item) => (
          <div key={item.label} className="brand-card p-5">
            <p className="text-3xl font-bold text-violet-800 dark:text-violet-100">
              {item.value}
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
              {item.label}
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              {item.helper}
            </p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <SectionHeader
          eyebrow="Jadwal Ibadah Tetap"
          title="Ibadah dan persekutuan rutin"
          description="Beranda menampilkan jadwal rutin agar pengunjung cepat menemukan waktu ibadah utama."
          actions={
            <Link to="/jadwal-ibadah" className="brand-link text-sm font-semibold underline underline-offset-4">
              Lihat semua jadwal
            </Link>
          }
        />

        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {primarySchedules.map((item) => (
            <InfoCard
              key={item.id}
              icon={CalendarDays}
              title={item.title}
              description={item.time}
              meta={item.location}
            />
          ))}
        </div>
      </section>

      <section className="brand-card rounded-3xl p-6 md:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <SectionHeader
              eyebrow="Arah Pelayanan"
              title={homeContent.welcomeTitle}
              description={homeContent.welcomeDescription}
            />
            <div className="mt-6">
              <TagList items={serviceAreas} tone="cyan" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {ministryPillars.map((item) => (
              <InfoCard key={item.title} title={item.title} description={item.description} />
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <SectionHeader
          eyebrow="Komisi Pelayanan"
          title="Ruang pelayanan lintas usia dan kebutuhan"
          description="Setiap komisi membantu jemaat bertumbuh melalui pembinaan, pelayanan kasih, dan koordinasi kegiatan gereja."
          actions={
            <Link to="/komisi" className="brand-link text-sm font-semibold underline underline-offset-4">
              Jelajahi komisi
            </Link>
          }
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featuredCommissions.map((commission) => (
            <Link
              key={commission.slug}
              to={`/komisi/${commission.slug}`}
              className="brand-card block p-5 transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-200">
                <UsersRound size={20} />
              </div>
              <p className="brand-eyebrow mt-4 text-xs font-semibold uppercase tracking-[0.18em]">
                {commission.shortName}
              </p>
              <h3 className="mt-2 text-lg font-bold text-slate-950 dark:text-white">
                {commission.name}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {commission.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="brand-card rounded-3xl p-6 md:p-8">
          <SectionHeader
            eyebrow="Publikasi"
            title="Warta dan renungan terbaru"
            description="Konten publikasi disiapkan untuk membantu jemaat mengikuti informasi dan merenungkan firman."
          />
          <div className="mt-6 space-y-4">
            {featuredPublications.map((item) => (
              <Link
                key={item.id}
                to={`/publikasi/${item.slug}`}
                className="block rounded-2xl border border-violet-100 p-4 transition hover:bg-violet-50/60 dark:border-violet-950/60 dark:hover:bg-violet-950/20"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-cyan-700 dark:text-cyan-200">
                  <Newspaper size={15} />
                  <span>{item.category}</span>
                  <span>-</span>
                  <span>{formatPublicDate(item.date)}</span>
                </div>
                <h3 className="mt-2 text-base font-bold text-slate-950 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {item.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="brand-card rounded-3xl p-6 md:p-8">
          <MediaFrame label="Dokumentasi pelayanan" meta="Galeri gereja" className="mb-6" />
          <SectionHeader
            eyebrow="Kontak Singkat"
            title="Datang dan bersekutu bersama"
            description="Untuk informasi ibadah, pelayanan, atau kebutuhan administrasi, jemaat dapat menghubungi sekretariat gereja."
          />
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/kontak"
              className="brand-button-primary inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition"
            >
              <MapPin size={17} />
              Lihat Kontak
            </Link>
            <Link
              to="/galeri"
              className="brand-button-secondary inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition"
            >
              Lihat Galeri
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
