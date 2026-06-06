import { Info, Mail, MapPin, MessageCircle, Phone, Settings } from "lucide-react";
import PublicAdminActionBar from "../../components/public/PublicAdminActionBar";
import {
  InfoCard,
  PublicHero,
  SectionHeader,
} from "../../components/public/PublicContent";
import {
  churchInfo,
  contactChannels,
  worshipScheduleGroups,
} from "../../data/publicContentData";

const channelIcons = {
  "Alamat Gereja": MapPin,
  WhatsApp: Phone,
  Email: Mail,
};

export default function ContactPage() {
  const quickSchedules = worshipScheduleGroups.flatMap((group) => group.items).slice(0, 4);

  return (
    <div className="space-y-10">
      <PublicAdminActionBar
        title="Kelola informasi kontak"
        description="Aksi untuk memperbarui alamat, telepon, email, maps, dan sosial media gereja."
        actions={[
          {
            label: "Kelola Kontak",
            to: "/admin/content/contact",
            icon: Info,
            variant: "primary",
          },
          {
            label: "Ubah Info Gereja",
            to: "/admin/content/contact?action=ubah-info-gereja",
            icon: Settings,
          },
        ]}
      />

      <PublicHero
        eyebrow="Kontak"
        title="Hubungi Gereja AMIN Jemaat Tangerang Raya"
        description="Jemaat dan pengunjung dapat menghubungi gereja untuk informasi ibadah, pelayanan, publikasi, maupun kebutuhan administrasi."
        aside={
          <div className="brand-soft-card p-6">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              Kontak utama
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
              {churchInfo.phone}
            </p>
            <p className="mt-2 break-all text-sm text-slate-600 dark:text-slate-300">
              {churchInfo.email}
            </p>
          </div>
        }
      />

      <section className="grid gap-5 md:grid-cols-3">
        {contactChannels.map((item) => {
          const Icon = channelIcons[item.type] || Info;

          return (
            <InfoCard
              key={item.type}
              icon={Icon}
              title={item.type}
              description={item.value}
            >
              {item.href ? (
                <a
                  href={item.href}
                  className="brand-link text-sm font-semibold underline underline-offset-4"
                >
                  Buka kontak
                </a>
              ) : null}
            </InfoCard>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="brand-card rounded-3xl p-6 md:p-8">
          <SectionHeader
            eyebrow="Jadwal Singkat"
            title="Waktu pelayanan gereja"
            description="Jadwal berikut menjadi acuan umum. Agenda sektor dan komisi dapat mengikuti koordinasi masing-masing pengurus."
          />

          <div className="mt-6 space-y-4">
            {quickSchedules.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-violet-100 bg-violet-50/40 p-4 dark:border-violet-950/60 dark:bg-violet-950/20"
              >
                <h3 className="text-base font-semibold text-slate-950 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm font-semibold text-cyan-700 dark:text-cyan-200">
                  {item.time}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {item.location}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="brand-card rounded-3xl p-6 md:p-8">
          <SectionHeader
            eyebrow="Lokasi"
            title="Peta lokasi gereja"
            description="Area ini disiapkan untuk embed Google Maps resmi atau link lokasi gereja ketika sudah ditetapkan."
          />

          <div className="mt-6 flex aspect-video flex-col items-center justify-center rounded-2xl border border-dashed border-cyan-200 bg-cyan-50/60 px-6 text-center text-sm text-cyan-800 dark:border-cyan-950/60 dark:bg-cyan-950/20 dark:text-cyan-200">
            <MapPin size={30} />
            <p className="mt-3 font-semibold">{churchInfo.mapStatus}</p>
            <p className="mt-2 max-w-md leading-6">{churchInfo.address}</p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <a
              href={`https://wa.me/${churchInfo.whatsapp}`}
              className="brand-button-primary inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition"
            >
              <MessageCircle size={17} />
              Chat WhatsApp
            </a>
            <a
              href={`mailto:${churchInfo.email}`}
              className="brand-button-secondary inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition"
            >
              <Mail size={17} />
              Kirim Email
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
