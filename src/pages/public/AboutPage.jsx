import { useState } from "react";
import { Church, Compass, Info, User } from "lucide-react";
import BrandLogo from "../../components/BrandLogo";
import { PublicAdminShortcut } from "../../components/public/PublicAdminActionBar";
import { InfoCard, SectionHeader } from "../../components/public/PublicContent";
import {
  churchInfo,
} from "../../services/publicContentService";
import { useAboutContentCms } from "../../hooks/usePublicCmsData";

function PersonCard({ role, name, photo = "" }) {
  const [hasPhoto, setHasPhoto] = useState(Boolean(photo));

  return (
    <div className="group brand-card overflow-hidden rounded-2xl transition hover:-translate-y-1 hover:shadow-md">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-violet-50 dark:bg-violet-950/20">
        {hasPhoto ? (
          <img
            src={photo}
            alt={name}
            onError={() => setHasPhoto(false)}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-slate-400 dark:text-slate-500">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-violet-500 shadow-sm dark:bg-slate-900 dark:text-violet-200">
              <User size={28} />
            </div>
            <span className="text-sm font-medium">Belum ada foto</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{role}</p>
        <h3 className="mt-2 text-base font-semibold leading-6 text-slate-950 dark:text-white">
          {name}
        </h3>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const [aboutContent] = useAboutContentCms();
  const bphmj = [
    ["Pendeta Jemaat", "Pdt. Niatmawati Fakho, S.Th.", "/images/pengurus/niatmawati-fakho.jpg"],
    ["Ketua I", "SNK. Kecitaan Harefa, S.Kom., M.Kom.", "/images/pengurus/kecitaan-harefa.jpg"],
    ["Ketua II", "SNK. Dr (Cand). Desman Berkati Larosa, S.Th., M.Th.", "/images/pengurus/desman-larosa.jpg"],
    ["Sekretaris I", "SNK. Yustinus Hura, S.Th., S.H., M.H., CMLE., CPCL., CPLA.", "/images/pengurus/yustinus-hura.jpg"],
    ["Sekretaris II", "SNK. Yemima Daeli, A.Md.Kep.", "/images/pengurus/yemima-daeli.jpg"],
    ["Bendahara", "SNK. Mareti Waruwu, S.H., M.H.", "/images/pengurus/mareti-waruwu.jpg"],
  ];

  const sectors = [
    ["Ketua Sektor Eben-Haezer", "SNK. Fatiria Daeli", "/images/pengurus/fatiria-daeli.jpg"],
    ["Ketua Sektor Anugerah", "SNK. Simei Waruwu", "/images/pengurus/simei-waruwu.jpg"],
    ["Ketua Sektor Betlehem", "SNK. Oktafpianus Gea", "/images/pengurus/oktafpianus-gea.jpg"],
    ["Ketua Sektor Nazaret", "SNK. Fazokhi Waruwu, S.Pd., S.Th.", "/images/pengurus/fazokhi-waruwu.jpg"],
  ];

  const commissions = [
    ["Ketua Komisi Pelayanan Anak", "SNK. Herlina, S.Pd.", "/images/pengurus/herlina.jpg"],
    ["Ketua Komisi Pelayanan Pemuda & Remaja", "SNK. Arojasa Harefa", "/images/pengurus/arojasa-harefa.jpg"],
    ["Ketua Komisi Pelayanan Perempuan", "SNK. Milika Daeli", "/images/pengurus/milika-daeli.jpg"],
    ["Ketua Komisi Pelayanan Pria Kaum Bapak", "SNK. Gregorius F. Riski Gulo", "/images/pengurus/gregorius-gulo.jpg"],
    ["Ketua Komisi Pelayanan Kasih", "SNK. Sisudin Waruwu", "/images/pengurus/sisudin-waruwu.jpg"],
    ["Ketua Komisi Pembangunan", "SNK. Estomi Laia, S.Kom., M.M.", "/images/pengurus/estomi-laia.jpg"],
    ["Ketua Komisi Pelayanan Ibadah & Musik", "SNK. Arifman Jaya Hura, S.Ak.", "/images/pengurus/arifman-hura.jpg"],
    ["Ketua Komisi Pelayanan Usia Indah", "SNK. Ir. Alinur Zebua, M.M.", "/images/pengurus/alinur-zebua.jpg"],
  ];

  const highlights = [
    { title: "Berdiri", value: churchInfo.founded },
    { title: "Nomor Anggota", value: churchInfo.memberNumber },
    { title: "Sinode", value: churchInfo.synod },
    { title: "Lokasi", value: "Tangerang Selatan" },
  ];

  return (
    <div className="space-y-10">
      <div className="flex justify-end">
        <PublicAdminShortcut
          to="/admin/content/about"
          label="Edit Tentang Kami"
          icon={Info}
        />
      </div>

      <section className="brand-card rounded-3xl px-6 py-10 md:px-10 md:py-14">
        <BrandLogo size="lg" subtitle="Tangerang Raya" />
        <p className="brand-eyebrow mt-8 text-sm font-semibold uppercase tracking-[0.22em]">
          {aboutContent.pageEyebrow}
        </p>
        <h1 className="mt-3 max-w-4xl text-3xl font-bold text-slate-950 md:text-5xl dark:text-white">
          {aboutContent.title}
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 md:text-base dark:text-slate-300">
          {aboutContent.summary}
        </p>
        <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
          {churchInfo.tagline}
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {highlights.map((item) => (
          <div
            key={item.title}
            className="brand-card p-5"
          >
            <p className="text-sm text-slate-500 dark:text-slate-400">{item.title}</p>
            <p className="mt-2 text-lg font-bold text-slate-950 dark:text-white">
              {item.value}
            </p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <InfoPanel title={aboutContent.historyTitle} eyebrow="Sejarah Jemaat">
          {aboutContent.historyBody}
        </InfoPanel>
        <InfoPanel title={aboutContent.contactTitle} eyebrow="Informasi Gereja">
          {aboutContent.contactBody}
        </InfoPanel>
      </section>

      <section className="space-y-5">
        <SectionHeader
          eyebrow="Nilai Pelayanan"
          title="Arah pertumbuhan jemaat"
          description="Nilai ini menjadi bahasa bersama dalam ibadah, pembinaan keluarga, dan pelayanan lintas komisi."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {(aboutContent.values || []).map((item) => (
            <InfoCard
              key={item.title}
              icon={Compass}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </section>

      <section className="brand-card rounded-3xl p-6 md:p-8">
        <SectionHeader
          eyebrow="Perjalanan Jemaat"
          title="Dari penetapan jemaat menuju digitalisasi pelayanan"
          description="Timeline ini membantu pengunjung memahami konteks pertumbuhan Gereja AMIN Jemaat Tangerang Raya."
        />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {(aboutContent.timeline || []).map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-violet-100 bg-violet-50/40 p-5 dark:border-violet-950/60 dark:bg-violet-950/20"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-200">
                {item.date}
              </p>
              <h3 className="mt-2 text-lg font-bold text-slate-950 dark:text-white">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <PeopleSection title="Badan Pekerja Harian Majelis Jemaat" eyebrow="BPHMJ" items={bphmj} />
      <PeopleSection title="Pengurus sektor / kelompok keluarga" eyebrow="Sektor-Sektor" items={sectors} columns="xl:grid-cols-4" />
      <section className="space-y-5">
        <SectionHeader
          eyebrow="Sektor Jemaat"
          title="Pembinaan keluarga dalam sektor"
          description="Sektor membantu koordinasi ibadah keluarga, perhatian pastoral, dan komunikasi jemaat."
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {(aboutContent.sectors || []).map((sector) => (
            <InfoCard
              key={sector.name}
              icon={Church}
              title={sector.name}
              description={sector.area}
              meta={sector.chair}
            />
          ))}
        </div>
      </section>
      <PeopleSection title="Komisi pelayanan gereja" eyebrow="Komisi-Komisi" items={commissions} columns="xl:grid-cols-4" />

      <section className="rounded-3xl border border-violet-200 bg-[#2c2038] p-6 text-white shadow-sm md:p-8 dark:border-violet-950/60">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-100">
          Pengakuan Iman
        </p>
        <h2 className="mt-2 text-2xl font-bold md:text-3xl">Dasar keyakinan gereja</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {[
            "Percaya kepada Allah Tritunggal: Bapa, Anak, dan Roh Kudus.",
            "Menjunjung Alkitab sebagai dasar iman dan pedoman hidup orang percaya.",
            "Mengakui Yesus Kristus sebagai Tuhan dan Juruselamat.",
            "Mendorong jemaat hidup dalam pertobatan, kekudusan, dan kasih.",
          ].map((point) => (
            <div key={point} className="rounded-2xl border border-white/15 bg-white/10 p-4 text-sm leading-7 text-white/85">
              {point}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function InfoPanel({ eyebrow, title, children }) {
  return (
    <div className="brand-card p-6">
      <p className="brand-eyebrow text-sm font-semibold uppercase tracking-[0.22em]">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">{title}</h2>
      <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
        {children}
      </p>
    </div>
  );
}

function PeopleSection({ eyebrow, title, items, columns = "xl:grid-cols-3" }) {
  return (
    <section className="space-y-5">
      <div>
        <p className="brand-eyebrow text-sm font-semibold uppercase tracking-[0.22em]">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950 md:text-3xl dark:text-white">
          {title}
        </h2>
      </div>
      <div className={`grid gap-5 sm:grid-cols-2 ${columns}`}>
        {items.map(([role, name, photo]) => (
          <PersonCard key={`${role}-${name}`} role={role} name={name} photo={photo} />
        ))}
      </div>
    </section>
  );
}
