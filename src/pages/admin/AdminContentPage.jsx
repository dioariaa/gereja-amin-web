import { useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Eye,
  FileText,
  Home,
  Images,
  Info,
  Mail,
  PenLine,
  Plus,
  Settings,
  Trash2,
  UsersRound,
} from "lucide-react";
import ActionButton from "../../components/admin/ActionButton";
import AdminModal from "../../components/admin/AdminModal";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import DataTable from "../../components/admin/DataTable";
import FormField from "../../components/admin/FormField";
import StatusBadge from "../../components/admin/StatusBadge";
import SummaryCard from "../../components/admin/SummaryCard";
import {
  createEmptyScheduleAssignment,
  createEmptyContactItem,
  createEmptyGalleryItem,
  createEmptySchedule,
  createRecordId,
  formatScheduleDateShort,
  listScheduleEvents,
  normalizeScheduleAssignments,
} from "../../services/publicContentService";
import {
  formatPublicDate,
  listPublicationsByCommission,
} from "../../services/publicationsService";
import {
  useAboutContentCms,
  useCommissionsCms,
  useContactsCms,
  useGalleryCms,
  useHomeContentCms,
  usePublicationsCms,
  useSchedulesCms,
} from "../../hooks/usePublicCmsData";
import { getMediaFieldHint } from "../../services/mediaService";

const sectionMeta = {
  home: {
    eyebrow: "CMS Website",
    title: "Kelola Beranda",
    description: "Editor untuk hero, sambutan, CTA, dan ringkasan konten utama beranda.",
    icon: Home,
    publicPath: "/",
  },
  about: {
    eyebrow: "CMS Website",
    title: "Kelola Tentang Kami",
    description: "Editor profil gereja, sejarah, nilai pelayanan, timeline, dan sektor.",
    icon: Info,
    publicPath: "/tentang-kami",
  },
  leadership: {
    eyebrow: "CMS Website",
    title: "Kelola Pengurus / Sektor",
    description: "Untuk fase ini pengurus masih dikelola bersama konten Tentang Kami.",
    icon: UsersRound,
    publicPath: "/tentang-kami",
  },
  schedule: {
    eyebrow: "CMS Website",
    title: "Kelola Jadwal Ibadah",
    description: "CRUD jadwal ibadah umum, sekolah minggu, pemuda/remaja, sektor, dan komisi.",
    icon: CalendarDays,
    publicPath: "/jadwal-ibadah",
  },
  gallery: {
    eyebrow: "CMS Website",
    title: "Kelola Galeri",
    description: "CRUD album atau item dokumentasi kegiatan gereja.",
    icon: Images,
    publicPath: "/galeri",
  },
  contact: {
    eyebrow: "CMS Website",
    title: "Kelola Kontak Gereja",
    description: "CRUD informasi alamat, telepon, email, maps, dan kanal kontak gereja.",
    icon: Mail,
    publicPath: "/kontak",
  },
  commissions: {
    eyebrow: "CMS Website",
    title: "Kelola Komisi Pelayanan",
    description: "CRUD profil komisi, pengurus, fokus pelayanan, jadwal, kegiatan, dan visual.",
    icon: Settings,
    publicPath: "/komisi",
  },
};

const emptyCommission = {
  slug: "",
  name: "",
  shortName: "",
  chair: "",
  description: "",
  focus: [],
  schedule: "",
  imageUrl: "",
  activities: [],
  status: "Aktif",
};

export default function AdminContentPage() {
  const { section = "home", itemSlug } = useParams();
  const [searchParams] = useSearchParams();
  const action = searchParams.get("action");
  const normalizedSection = section === "leadership" ? "about" : section;
  const meta = sectionMeta[section] || sectionMeta.home;
  const Icon = meta.icon;

  const [homeContent, setHomeContent, homeMeta] = useHomeContentCms();
  const [aboutContent, setAboutContent, aboutMeta] = useAboutContentCms();
  const [scheduleItems, setScheduleItems, scheduleMeta] = useSchedulesCms({ admin: true });
  const [galleryItems, setGalleryItems, galleryMeta] = useGalleryCms({ admin: true });
  const [contactItems, setContactItems, contactMeta] = useContactsCms({ admin: true });
  const [commissionItems, setCommissionItems, commissionMeta] = useCommissionsCms({ admin: true });
  const [publicationItems] = usePublicationsCms({ admin: true });

  const commission = normalizedSection === "commissions" && itemSlug
    ? commissionItems.find((item) => item.slug === itemSlug)
    : null;
  const publicPath = commission ? `/komisi/${commission.slug}` : meta.publicPath;
  const pageTitle = commission ? `Kelola ${commission.shortName}` : meta.title;
  const actionLabel = useMemo(
    () => action ? action.split("-").join(" ").replace(/\b\w/g, (letter) => letter.toUpperCase()) : "CRUD Utama",
    [action]
  );

  const isCrudSection = ["schedule", "gallery", "contact", "commissions"].includes(normalizedSection);
  const sourceMeta = {
    home: homeMeta,
    about: aboutMeta,
    schedule: scheduleMeta,
    gallery: galleryMeta,
    contact: contactMeta,
    commissions: commissionMeta,
  }[normalizedSection] || homeMeta;

  return (
    <div className="space-y-7">
      <AdminPageHeader
        eyebrow={meta.eyebrow}
        title={pageTitle}
        description={commission ? commission.description : meta.description}
        meta={
          <>
            <StatusBadge value={isCrudSection ? "CRUD" : "Singleton Page"} />
            <StatusBadge value={actionLabel} />
            <StatusBadge value={sourceMeta.source} />
          </>
        }
        actions={
          <>
            <ActionButton to={publicPath} icon={Eye}>
              Preview Public
            </ActionButton>
            <QuickCreateAction section={normalizedSection} />
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Domain Konten" value={meta.title.replace("Kelola ", "")} description="Dikelola dari admin panel." icon={Icon} />
        <SummaryCard title="Akses Role" value="2 Role" description="Super admin dan sekretaris." icon={Settings} />
        <SummaryCard title="Sumber Data" value={sourceMeta.source} description={sourceMeta.error || "Supabase-aware service layer."} icon={FileText} />
        <SummaryCard title="Public Link" value={publicPath} description="Preview halaman public." icon={ArrowLeft} />
      </section>

      {normalizedSection === "home" ? (
        <HomeContentManager content={homeContent} onSave={setHomeContent} />
      ) : null}

      {normalizedSection === "about" ? (
        <AboutContentManager content={aboutContent} onSave={setAboutContent} />
      ) : null}

      {normalizedSection === "schedule" ? (
        <ScheduleManager
          key={`schedule-${action || "list"}`}
          items={scheduleItems}
          onChange={setScheduleItems}
          initialCreate={action === "tambah-jadwal"}
        />
      ) : null}

      {normalizedSection === "gallery" ? (
        <GalleryManager
          key={`gallery-${action || "list"}`}
          items={galleryItems}
          onChange={setGalleryItems}
          initialCreate={action === "tambah-galeri"}
        />
      ) : null}

      {normalizedSection === "contact" ? (
        <ContactManager
          key={`contact-${action || "list"}`}
          items={contactItems}
          onChange={setContactItems}
          initialCreate={action === "ubah-info-gereja"}
        />
      ) : null}

      {normalizedSection === "commissions" ? (
        <CommissionContentManager
          key={`commissions-${itemSlug || "list"}-${action || "list"}`}
          items={commissionItems}
          onChange={setCommissionItems}
          publications={publicationItems}
          selectedCommission={commission}
          initialCreate={action === "create"}
          initialEdit={action === "edit" && Boolean(commission)}
        />
      ) : null}
    </div>
  );
}

function QuickCreateAction({ section }) {
  if (section === "schedule") {
    return (
      <ActionButton to="/admin/content/schedule?action=tambah-jadwal" variant="primary" icon={Plus}>
        Tambah Jadwal
      </ActionButton>
    );
  }

  if (section === "gallery") {
    return (
      <ActionButton to="/admin/content/gallery?action=tambah-galeri" variant="primary" icon={Plus}>
        Tambah Galeri
      </ActionButton>
    );
  }

  if (section === "contact") {
    return (
      <ActionButton to="/admin/content/contact?action=ubah-info-gereja" variant="primary" icon={Plus}>
        Tambah Kontak
      </ActionButton>
    );
  }

  if (section === "commissions") {
    return (
      <ActionButton to="/admin/content/commissions?action=create" variant="primary" icon={Plus}>
        Tambah Komisi
      </ActionButton>
    );
  }

  return null;
}

function HomeContentManager({ content, onSave }) {
  const [form, setForm] = useState(content);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({ ...form, updatedAt: new Date().toISOString() });
  };

  return (
    <section className="brand-card p-5 md:p-6">
      <ContentFormHeader
        eyebrow="Beranda"
        title="Editor konten homepage"
        description="Beranda tetap bersih di sisi public. Pengelolaan kontennya dilakukan dari admin panel."
      />
      <form className="mt-6 grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
        <FormField label="Eyebrow Hero">
          <input name="heroEyebrow" value={form.heroEyebrow} onChange={handleChange} className="input-base" />
        </FormField>
        <FormField label="Status">
          <select name="status" value={form.status} onChange={handleChange} className="input-base">
            <option>Aktif</option>
            <option>Draft</option>
          </select>
        </FormField>
        <FormField label="Judul Hero" className="md:col-span-2">
          <input name="heroTitle" value={form.heroTitle} onChange={handleChange} className="input-base" />
        </FormField>
        <FormField label="Subjudul Hero" className="md:col-span-2">
          <input name="heroSubtitle" value={form.heroSubtitle} onChange={handleChange} className="input-base" />
        </FormField>
        <FormField label="Deskripsi Hero" className="md:col-span-2">
          <textarea name="heroDescription" value={form.heroDescription} onChange={handleChange} rows="4" className="input-base" />
        </FormField>
        <FormField label="CTA Utama">
          <input name="primaryCtaLabel" value={form.primaryCtaLabel} onChange={handleChange} className="input-base" />
        </FormField>
        <FormField label="Link CTA Utama">
          <input name="primaryCtaTo" value={form.primaryCtaTo} onChange={handleChange} className="input-base" />
        </FormField>
        <FormField label="CTA Sekunder">
          <input name="secondaryCtaLabel" value={form.secondaryCtaLabel} onChange={handleChange} className="input-base" />
        </FormField>
        <FormField label="Link CTA Sekunder">
          <input name="secondaryCtaTo" value={form.secondaryCtaTo} onChange={handleChange} className="input-base" />
        </FormField>
        <FormField label="Judul Sambutan" className="md:col-span-2">
          <input name="welcomeTitle" value={form.welcomeTitle} onChange={handleChange} className="input-base" />
        </FormField>
        <FormField label="Isi Sambutan" className="md:col-span-2">
          <textarea name="welcomeDescription" value={form.welcomeDescription} onChange={handleChange} rows="4" className="input-base" />
        </FormField>
        <SubmitArea publicPath="/" />
      </form>
    </section>
  );
}

function AboutContentManager({ content, onSave }) {
  const [form, setForm] = useState(() => serializeAboutContent(content));

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      ...content,
      pageEyebrow: form.pageEyebrow,
      title: form.title,
      summary: form.summary,
      historyTitle: form.historyTitle,
      historyBody: form.historyBody,
      contactTitle: form.contactTitle,
      contactBody: form.contactBody,
      values: parsePipeRows(form.valuesText, ["title", "description"]),
      timeline: parsePipeRows(form.timelineText, ["date", "title", "description"]),
      sectors: parsePipeRows(form.sectorsText, ["name", "chair", "area"]),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <section className="brand-card p-5 md:p-6">
      <ContentFormHeader
        eyebrow="Tentang Kami"
        title="Editor profil gereja"
        description="Konten yang disimpan di sini langsung dipakai halaman public Tentang Kami."
      />
      <form className="mt-6 grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
        <FormField label="Eyebrow">
          <input name="pageEyebrow" value={form.pageEyebrow} onChange={handleChange} className="input-base" />
        </FormField>
        <FormField label="Judul">
          <input name="title" value={form.title} onChange={handleChange} className="input-base" />
        </FormField>
        <FormField label="Ringkasan Profil" className="md:col-span-2">
          <textarea name="summary" value={form.summary} onChange={handleChange} rows="4" className="input-base" />
        </FormField>
        <FormField label="Judul Sejarah">
          <input name="historyTitle" value={form.historyTitle} onChange={handleChange} className="input-base" />
        </FormField>
        <FormField label="Judul Kontak">
          <input name="contactTitle" value={form.contactTitle} onChange={handleChange} className="input-base" />
        </FormField>
        <FormField label="Isi Sejarah" className="md:col-span-2">
          <textarea name="historyBody" value={form.historyBody} onChange={handleChange} rows="4" className="input-base" />
        </FormField>
        <FormField label="Isi Kontak" className="md:col-span-2">
          <textarea name="contactBody" value={form.contactBody} onChange={handleChange} rows="3" className="input-base" />
        </FormField>
        <FormField label="Nilai Pelayanan" className="md:col-span-2" hint="Format per baris: Judul | Deskripsi">
          <textarea name="valuesText" value={form.valuesText} onChange={handleChange} rows="4" className="input-base" />
        </FormField>
        <FormField label="Timeline" className="md:col-span-2" hint="Format per baris: Tanggal | Judul | Deskripsi">
          <textarea name="timelineText" value={form.timelineText} onChange={handleChange} rows="4" className="input-base" />
        </FormField>
        <FormField label="Sektor" className="md:col-span-2" hint="Format per baris: Nama Sektor | Ketua | Area pelayanan">
          <textarea name="sectorsText" value={form.sectorsText} onChange={handleChange} rows="5" className="input-base" />
        </FormField>
        <SubmitArea publicPath="/tentang-kami" />
      </form>
    </section>
  );
}

function ScheduleManager({ items, onChange, initialCreate }) {
  const [modalOpen, setModalOpen] = useState(initialCreate);
  const [form, setForm] = useState(createEmptySchedule);
  const scheduleEvents = listScheduleEvents(items);

  const openCreate = () => {
    setForm(createEmptySchedule());
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setForm(item);
    setModalOpen(true);
  };

  const saveItem = (event) => {
    event.preventDefault();
    if (!form.title.trim()) return;

    const nextItem = {
      ...form,
      id: form.id || createRecordId("schedule"),
      sortOrder: Number(form.sortOrder) || 99,
      assignments: normalizeScheduleAssignments(form.assignments),
    };

    upsertItem(items, onChange, nextItem);
    setModalOpen(false);
  };

  return (
    <>
      <DataTable
        eyebrow="CRUD Jadwal"
        title={`${scheduleEvents.length} event jadwal tersimpan`}
        actions={<ActionButton variant="primary" icon={Plus} onClick={openCreate}>Tambah Jadwal</ActionButton>}
      >
        <table className="min-w-[1100px] text-left text-sm">
          <thead>
            <AdminTableHeader columns={["Tanggal", "Jam", "Jadwal", "Kategori", "Petugas", "Status", "Aksi"]} />
          </thead>
          <tbody>
            {scheduleEvents.map((item) => (
              <tr key={item.id} className="brand-table-row border-b border-slate-100 transition dark:border-slate-800">
                <td className="px-3 py-4 font-semibold text-slate-950 dark:text-white">
                  {formatScheduleDateShort(item.eventDate)}
                </td>
                <td className="px-3 py-4 text-slate-700 dark:text-slate-200">{item.time}</td>
                <td className="px-3 py-4">
                  <p className="font-semibold text-slate-900 dark:text-white">{item.title}</p>
                  {item.theme ? (
                    <p className="mt-1 max-w-md text-xs font-semibold text-cyan-700 dark:text-cyan-200">
                      {item.theme}
                    </p>
                  ) : null}
                  <p className="mt-1 max-w-md text-xs leading-5 text-slate-500 dark:text-slate-400">{item.notes}</p>
                </td>
                <td className="px-3 py-4 text-slate-700 dark:text-slate-200">{item.category}</td>
                <td className="px-3 py-4 text-slate-700 dark:text-slate-200">
                  {item.assignments?.length || 0} petugas
                </td>
                <td className="px-3 py-4"><StatusBadge value={item.status} /></td>
                <td className="px-3 py-4">
                  <div className="flex gap-2">
                    <Link to={`/jadwal-ibadah/${item.id}`} className="brand-button-secondary rounded-xl p-2" title="Detail public">
                      <Eye size={16} />
                    </Link>
                    <RowActions onEdit={() => openEdit(item)} onDelete={() => deleteItem(items, onChange, item.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {scheduleEvents.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                  Belum ada jadwal ibadah. Tambahkan event per tanggal dan jam.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </DataTable>
      <ScheduleModal open={modalOpen} form={form} setForm={setForm} onClose={() => setModalOpen(false)} onSubmit={saveItem} />
    </>
  );
}

function GalleryManager({ items, onChange, initialCreate }) {
  const [modalOpen, setModalOpen] = useState(initialCreate);
  const [form, setForm] = useState(createEmptyGalleryItem);

  const openCreate = () => {
    setForm(createEmptyGalleryItem());
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setForm(item);
    setModalOpen(true);
  };

  const saveItem = (event) => {
    event.preventDefault();
    if (!form.title.trim()) return;

    const nextItem = {
      ...form,
      id: form.id || createRecordId("gallery"),
      count: Number(form.count) || 0,
      sortOrder: Number(form.sortOrder) || 99,
    };

    upsertItem(items, onChange, nextItem);
    setModalOpen(false);
  };

  return (
    <>
      <DataTable
        eyebrow="CRUD Galeri"
        title={`${items.length} item galeri`}
        actions={<ActionButton variant="primary" icon={Plus} onClick={openCreate}>Tambah Galeri</ActionButton>}
      >
        <table className="min-w-[980px] text-left text-sm">
          <thead>
            <AdminTableHeader columns={["Kategori", "Album", "Foto", "Media", "Status", "Aksi"]} />
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="brand-table-row border-b border-slate-100 transition dark:border-slate-800">
                <td className="px-3 py-4 font-semibold text-slate-950 dark:text-white">{item.category}</td>
                <td className="px-3 py-4">
                  <p className="font-semibold text-slate-900 dark:text-white">{item.title}</p>
                  <p className="mt-1 max-w-md text-xs leading-5 text-slate-500 dark:text-slate-400">{item.description}</p>
                </td>
                <td className="px-3 py-4 text-slate-700 dark:text-slate-200">{item.count || 0}</td>
                <td className="px-3 py-4 text-slate-700 dark:text-slate-200">{item.imageUrl ? "Ada URL" : "Belum ada"}</td>
                <td className="px-3 py-4"><StatusBadge value={item.status} /></td>
                <td className="px-3 py-4">
                  <RowActions onEdit={() => openEdit(item)} onDelete={() => deleteItem(items, onChange, item.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>
      <GalleryModal open={modalOpen} form={form} setForm={setForm} onClose={() => setModalOpen(false)} onSubmit={saveItem} />
    </>
  );
}

function ContactManager({ items, onChange, initialCreate }) {
  const [modalOpen, setModalOpen] = useState(initialCreate);
  const [form, setForm] = useState(createEmptyContactItem);

  const openCreate = () => {
    setForm(createEmptyContactItem());
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setForm(item);
    setModalOpen(true);
  };

  const saveItem = (event) => {
    event.preventDefault();
    if (!form.type.trim() || !form.value.trim()) return;

    const nextItem = {
      ...form,
      id: form.id || createRecordId("contact"),
      sortOrder: Number(form.sortOrder) || 99,
    };

    upsertItem(items, onChange, nextItem);
    setModalOpen(false);
  };

  return (
    <>
      <DataTable
        eyebrow="CRUD Kontak"
        title={`${items.length} informasi kontak`}
        actions={<ActionButton variant="primary" icon={Plus} onClick={openCreate}>Tambah Kontak</ActionButton>}
      >
        <table className="min-w-[860px] text-left text-sm">
          <thead>
            <AdminTableHeader columns={["Tipe", "Nilai", "Link", "Status", "Aksi"]} />
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="brand-table-row border-b border-slate-100 transition dark:border-slate-800">
                <td className="px-3 py-4 font-semibold text-slate-950 dark:text-white">{item.type}</td>
                <td className="px-3 py-4 text-slate-700 dark:text-slate-200">{item.value}</td>
                <td className="px-3 py-4 text-slate-700 dark:text-slate-200">{item.href || "-"}</td>
                <td className="px-3 py-4"><StatusBadge value={item.status} /></td>
                <td className="px-3 py-4">
                  <RowActions onEdit={() => openEdit(item)} onDelete={() => deleteItem(items, onChange, item.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>
      <ContactModal open={modalOpen} form={form} setForm={setForm} onClose={() => setModalOpen(false)} onSubmit={saveItem} />
    </>
  );
}

function CommissionContentManager({
  items,
  onChange,
  publications,
  selectedCommission,
  initialCreate,
  initialEdit,
}) {
  const [modalOpen, setModalOpen] = useState(initialCreate || initialEdit);
  const [form, setForm] = useState(() => selectedCommission || emptyCommission);
  const commissionPublications = selectedCommission
    ? listPublicationsByCommission(publications, selectedCommission.slug, { includeDrafts: true })
    : [];

  const openCreate = () => {
    setForm(emptyCommission);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setForm(item);
    setModalOpen(true);
  };

  const saveCommission = (event) => {
    event.preventDefault();
    if (!form.name.trim()) return;

    const nextItem = {
      ...form,
      slug: form.slug || toSlug(form.name),
      shortName: form.shortName || form.name,
      focus: Array.isArray(form.focus) ? form.focus : [],
      activities: Array.isArray(form.activities) ? form.activities : [],
    };

    const exists = items.some((item) => item.slug === nextItem.slug);
    onChange(exists ? items.map((item) => item.slug === nextItem.slug ? nextItem : item) : [nextItem, ...items]);
    setModalOpen(false);
  };

  return (
    <div className="space-y-7">
      {selectedCommission ? (
        <>
          <section className="brand-card p-5 md:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="brand-eyebrow text-xs font-semibold uppercase tracking-[0.22em]">
                  Detail Komisi
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
                  {selectedCommission.name}
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {selectedCommission.description}
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <ActionButton to={`/komisi/${selectedCommission.slug}`} icon={Eye}>
                  Preview
                </ActionButton>
                <ActionButton to={`/admin/articles?action=create&commission=${selectedCommission.slug}`} icon={Plus}>
                  Tambah Publikasi
                </ActionButton>
                <ActionButton variant="primary" icon={PenLine} onClick={() => openEdit(selectedCommission)}>
                  Edit Komisi
                </ActionButton>
              </div>
            </div>
          </section>

          <DataTable
            eyebrow="Publikasi Komisi"
            title={`${commissionPublications.length} publikasi terkait ${selectedCommission.shortName}`}
            actions={
              <ActionButton to={`/admin/articles?action=create&commission=${selectedCommission.slug}`} variant="primary" icon={Plus}>
                Tambah Publikasi Komisi
              </ActionButton>
            }
          >
            <table className="min-w-[820px] text-left text-sm">
              <thead>
                <AdminTableHeader columns={["Judul", "Kategori", "Tanggal", "Status", "Aksi"]} />
              </thead>
              <tbody>
                {commissionPublications.map((item) => (
                  <tr key={item.id} className="brand-table-row border-b border-slate-100 transition dark:border-slate-800">
                    <td className="px-3 py-4">
                      <p className="font-semibold text-slate-950 dark:text-white">{item.title}</p>
                      <p className="mt-1 max-w-lg text-xs leading-5 text-slate-500 dark:text-slate-400">
                        {item.excerpt}
                      </p>
                    </td>
                    <td className="px-3 py-4 text-slate-700 dark:text-slate-200">{item.category}</td>
                    <td className="px-3 py-4 text-slate-700 dark:text-slate-200">{formatPublicDate(item.date)}</td>
                    <td className="px-3 py-4"><StatusBadge value={item.status || "Aktif"} /></td>
                    <td className="px-3 py-4">
                      <div className="flex gap-2">
                        <Link to={`/publikasi/${item.slug}`} className="brand-button-secondary rounded-xl p-2" title="Preview public">
                          <Eye size={16} />
                        </Link>
                        <Link to={`/admin/articles?edit=${item.slug}`} className="brand-button-secondary rounded-xl p-2" title="Edit publikasi">
                          <PenLine size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
                {commissionPublications.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                      Belum ada publikasi yang ditautkan ke komisi ini.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </DataTable>
        </>
      ) : null}

      <DataTable
        eyebrow="CRUD Komisi"
        title={`${items.length} komisi pelayanan`}
        actions={<ActionButton variant="primary" icon={Plus} onClick={openCreate}>Tambah Komisi</ActionButton>}
      >
        <table className="min-w-[980px] text-left text-sm">
          <thead>
            <AdminTableHeader columns={["Komisi", "Ketua", "Jadwal", "Fokus", "Status", "Aksi"]} />
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.slug} className="brand-table-row border-b border-slate-100 transition dark:border-slate-800">
                <td className="px-3 py-4">
                  <p className="font-semibold text-slate-950 dark:text-white">{item.name}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">/{item.slug}</p>
                </td>
                <td className="px-3 py-4 text-slate-700 dark:text-slate-200">{item.chair || "-"}</td>
                <td className="px-3 py-4 text-slate-700 dark:text-slate-200">{item.schedule || "-"}</td>
                <td className="px-3 py-4 text-slate-700 dark:text-slate-200">{(item.focus || []).join(", ") || "-"}</td>
                <td className="px-3 py-4"><StatusBadge value={item.status || "Aktif"} /></td>
                <td className="px-3 py-4">
                  <div className="flex gap-2">
                    <Link to={`/admin/content/commissions/${item.slug}`} className="brand-button-secondary rounded-xl p-2" title="Detail admin">
                      <FileText size={16} />
                    </Link>
                    <Link to={`/komisi/${item.slug}`} className="brand-button-secondary rounded-xl p-2" title="Preview public">
                      <Eye size={16} />
                    </Link>
                    <button type="button" className="brand-button-secondary rounded-xl p-2" onClick={() => openEdit(item)} title="Edit">
                      <PenLine size={16} />
                    </button>
                    <button type="button" className="rounded-xl border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/30" onClick={() => onChange(items.filter((candidate) => candidate.slug !== item.slug))} title="Hapus">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>
      <CommissionModal open={modalOpen} form={form} setForm={setForm} onClose={() => setModalOpen(false)} onSubmit={saveCommission} />
    </div>
  );
}

function ScheduleModal({ open, form, setForm, onClose, onSubmit }) {
  const assignments = form.assignments || [];
  const updateAssignment = (assignmentId, field, value) => {
    setForm((prev) => ({
      ...prev,
      assignments: (prev.assignments || []).map((item) =>
        item.id === assignmentId ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addAssignment = () => {
    setForm((prev) => ({
      ...prev,
      assignments: [
        ...(prev.assignments || []),
        createEmptyScheduleAssignment(prev.assignments?.length || 0),
      ],
    }));
  };

  const removeAssignment = (assignmentId) => {
    setForm((prev) => ({
      ...prev,
      assignments: (prev.assignments || []).filter((item) => item.id !== assignmentId),
    }));
  };

  return (
    <AdminModal open={open} title={form.id ? "Edit Jadwal Ibadah" : "Tambah Jadwal Ibadah"} description="Kelola event ibadah per tanggal, jam, dan susunan petugas pelayanan." onClose={onClose}>
      <form className="grid gap-5 md:grid-cols-2" onSubmit={onSubmit}>
        <FormField label="Tanggal Ibadah">
          <input type="date" name="eventDate" value={form.eventDate || ""} onChange={(event) => updateForm(setForm, event)} className="input-base" />
        </FormField>
        <FormField label="Jam">
          <input name="time" value={form.time} onChange={(event) => updateForm(setForm, event)} className="input-base" placeholder="06:00 WIB" />
        </FormField>
        <FormField label="Kategori">
          <input name="category" value={form.category} onChange={(event) => updateForm(setForm, event)} className="input-base" />
        </FormField>
        <FormField label="Status">
          <StatusSelect value={form.status} onChange={(event) => updateForm(setForm, event)} />
        </FormField>
        <FormField label="Judul Jadwal" className="md:col-span-2">
          <input name="title" value={form.title} onChange={(event) => updateForm(setForm, event)} className="input-base" />
        </FormField>
        <FormField label="Tema / Subtema" className="md:col-span-2">
          <input name="theme" value={form.theme || ""} onChange={(event) => updateForm(setForm, event)} className="input-base" placeholder="Opsional" />
        </FormField>
        <FormField label="Urutan">
          <input type="number" name="sortOrder" value={form.sortOrder} onChange={(event) => updateForm(setForm, event)} className="input-base" />
        </FormField>
        <FormField label="Lokasi" className="md:col-span-2">
          <input name="location" value={form.location} onChange={(event) => updateForm(setForm, event)} className="input-base" />
        </FormField>
        <FormField label="Deskripsi Kategori" className="md:col-span-2">
          <textarea name="description" value={form.description || ""} onChange={(event) => updateForm(setForm, event)} rows="3" className="input-base" />
        </FormField>
        <FormField label="Catatan" className="md:col-span-2">
          <textarea name="notes" value={form.notes} onChange={(event) => updateForm(setForm, event)} rows="4" className="input-base" />
        </FormField>
        <div className="md:col-span-2">
          <div className="flex flex-col gap-3 rounded-2xl border border-violet-100 bg-violet-50/40 p-4 dark:border-violet-950/60 dark:bg-violet-950/20">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-slate-950 dark:text-white">
                  Susunan Petugas
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Role fleksibel. Tambahkan role lain bila jadwal ibadah membutuhkan petugas tambahan.
                </p>
              </div>
              <ActionButton icon={Plus} onClick={addAssignment}>
                Tambah Petugas
              </ActionButton>
            </div>

            <div className="space-y-3">
              {assignments.map((assignment, index) => (
                <div key={assignment.id} className="grid gap-3 rounded-2xl border border-white bg-white p-3 dark:border-violet-950/60 dark:bg-[#15111c] md:grid-cols-[0.8fr_1fr_0.4fr_auto]">
                  <input
                    value={assignment.role}
                    onChange={(event) => updateAssignment(assignment.id, "role", event.target.value)}
                    className="input-base"
                    placeholder="Role petugas"
                  />
                  <input
                    value={assignment.name}
                    onChange={(event) => updateAssignment(assignment.id, "name", event.target.value)}
                    className="input-base"
                    placeholder="Nama petugas"
                  />
                  <input
                    type="number"
                    value={assignment.sortOrder || index + 1}
                    onChange={(event) => updateAssignment(assignment.id, "sortOrder", event.target.value)}
                    className="input-base"
                    aria-label="Urutan petugas"
                  />
                  <button
                    type="button"
                    onClick={() => removeAssignment(assignment.id)}
                    className="rounded-xl border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/30"
                  >
                    Hapus
                  </button>
                </div>
              ))}
              {assignments.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-violet-200 px-4 py-5 text-center text-sm text-slate-500 dark:border-violet-950/60 dark:text-slate-400">
                  Belum ada petugas untuk jadwal ini.
                </p>
              ) : null}
            </div>
          </div>
        </div>
        <SubmitArea />
      </form>
    </AdminModal>
  );
}

function GalleryModal({ open, form, setForm, onClose, onSubmit }) {
  return (
    <AdminModal open={open} title={form.id ? "Edit Galeri" : "Tambah Galeri"} description="Gunakan URL gambar publik dari Supabase Storage ketika media sudah tersedia." onClose={onClose}>
      <form className="grid gap-5 md:grid-cols-2" onSubmit={onSubmit}>
        <FormField label="Kategori">
          <input name="category" value={form.category} onChange={(event) => updateForm(setForm, event)} className="input-base" />
        </FormField>
        <FormField label="Status">
          <StatusSelect value={form.status} onChange={(event) => updateForm(setForm, event)} />
        </FormField>
        <FormField label="Judul Album" className="md:col-span-2">
          <input name="title" value={form.title} onChange={(event) => updateForm(setForm, event)} className="input-base" />
        </FormField>
        <FormField label="Tanggal / Label Waktu">
          <input name="date" value={form.date} onChange={(event) => updateForm(setForm, event)} className="input-base" />
        </FormField>
        <FormField label="Jumlah Foto">
          <input type="number" name="count" value={form.count} onChange={(event) => updateForm(setForm, event)} className="input-base" />
        </FormField>
        <FormField label="Image / Storage Path" className="md:col-span-2" hint={getMediaFieldHint()}>
          <input name="imageUrl" value={form.imageUrl || ""} onChange={(event) => updateForm(setForm, event)} className="input-base" placeholder="https://..." />
        </FormField>
        <FormField label="Deskripsi" className="md:col-span-2">
          <textarea name="description" value={form.description} onChange={(event) => updateForm(setForm, event)} rows="4" className="input-base" />
        </FormField>
        <FormField label="Urutan">
          <input type="number" name="sortOrder" value={form.sortOrder} onChange={(event) => updateForm(setForm, event)} className="input-base" />
        </FormField>
        <SubmitArea />
      </form>
    </AdminModal>
  );
}

function ContactModal({ open, form, setForm, onClose, onSubmit }) {
  return (
    <AdminModal open={open} title={form.id ? "Edit Kontak" : "Tambah Kontak"} description="Kontak yang aktif dipakai oleh halaman Beranda dan Kontak public." onClose={onClose}>
      <form className="grid gap-5 md:grid-cols-2" onSubmit={onSubmit}>
        <FormField label="Tipe Kontak">
          <input name="type" value={form.type} onChange={(event) => updateForm(setForm, event)} className="input-base" placeholder="WhatsApp, Email, Alamat Gereja" />
        </FormField>
        <FormField label="Status">
          <StatusSelect value={form.status} onChange={(event) => updateForm(setForm, event)} />
        </FormField>
        <FormField label="Nilai" className="md:col-span-2">
          <textarea name="value" value={form.value} onChange={(event) => updateForm(setForm, event)} rows="3" className="input-base" />
        </FormField>
        <FormField label="Link / Href" className="md:col-span-2" hint="Opsional. Contoh: https://wa.me/... atau mailto:...">
          <input name="href" value={form.href || ""} onChange={(event) => updateForm(setForm, event)} className="input-base" />
        </FormField>
        <FormField label="Urutan">
          <input type="number" name="sortOrder" value={form.sortOrder} onChange={(event) => updateForm(setForm, event)} className="input-base" />
        </FormField>
        <SubmitArea />
      </form>
    </AdminModal>
  );
}

function CommissionModal({ open, form, setForm, onClose, onSubmit }) {
  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: ["focus", "activities"].includes(name)
        ? value.split(",").map((item) => item.trim()).filter(Boolean)
        : value,
      slug: name === "name" && !prev.slug ? toSlug(value) : prev.slug,
      shortName: name === "name" && !prev.shortName ? value.replace("Komisi ", "") : prev.shortName,
    }));
  };

  return (
    <AdminModal open={open} title={form.slug ? "Edit Komisi" : "Tambah Komisi"} description="Data komisi dipakai oleh landing dan detail komisi public." onClose={onClose}>
      <form className="grid gap-5 md:grid-cols-2" onSubmit={onSubmit}>
        <FormField label="Nama Komisi" className="md:col-span-2">
          <input name="name" value={form.name} onChange={handleChange} className="input-base" placeholder="Komisi Pelayanan..." />
        </FormField>
        <FormField label="Nama Singkat">
          <input name="shortName" value={form.shortName} onChange={handleChange} className="input-base" />
        </FormField>
        <FormField label="Slug">
          <input name="slug" value={form.slug} onChange={handleChange} className="input-base" />
        </FormField>
        <FormField label="Ketua / Pengurus">
          <input name="chair" value={form.chair} onChange={handleChange} className="input-base" />
        </FormField>
        <FormField label="Jadwal">
          <input name="schedule" value={form.schedule} onChange={handleChange} className="input-base" />
        </FormField>
        <FormField label="Image / Storage Path" className="md:col-span-2" hint={getMediaFieldHint()}>
          <input name="imageUrl" value={form.imageUrl || ""} onChange={handleChange} className="input-base" placeholder="https://..." />
        </FormField>
        <FormField label="Deskripsi" className="md:col-span-2">
          <textarea name="description" value={form.description} onChange={handleChange} rows="4" className="input-base" />
        </FormField>
        <FormField label="Fokus Pelayanan" className="md:col-span-2" hint="Pisahkan dengan koma.">
          <input name="focus" value={(form.focus || []).join(", ")} onChange={handleChange} className="input-base" />
        </FormField>
        <FormField label="Kegiatan Basic" className="md:col-span-2" hint="Pisahkan dengan koma.">
          <input name="activities" value={(form.activities || []).join(", ")} onChange={handleChange} className="input-base" />
        </FormField>
        <SubmitArea />
      </form>
    </AdminModal>
  );
}

function ContentFormHeader({ eyebrow, title, description }) {
  return (
    <div>
      <p className="brand-eyebrow text-xs font-semibold uppercase tracking-[0.22em]">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
        {title}
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
        {description}
      </p>
    </div>
  );
}

function SubmitArea({ publicPath }) {
  return (
    <div className="flex flex-col gap-3 md:col-span-2 sm:flex-row">
      <button type="submit" className="brand-button-primary inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition">
        Simpan Perubahan
      </button>
      {publicPath ? (
        <Link to={publicPath} className="brand-button-secondary inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition">
          Preview Public
        </Link>
      ) : null}
    </div>
  );
}

function StatusSelect({ value, onChange }) {
  return (
    <select name="status" value={value} onChange={onChange} className="input-base">
      <option>Aktif</option>
      <option>Draft</option>
      <option>Arsip</option>
    </select>
  );
}

function RowActions({ onEdit, onDelete }) {
  return (
    <div className="flex gap-2">
      <button type="button" className="brand-button-secondary rounded-xl p-2" onClick={onEdit} title="Edit">
        <PenLine size={16} />
      </button>
      <button type="button" className="rounded-xl border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/30" onClick={onDelete} title="Hapus">
        <Trash2 size={16} />
      </button>
    </div>
  );
}

function AdminTableHeader({ columns }) {
  return (
    <tr className="border-b border-slate-200 dark:border-slate-800">
      {columns.map((column) => (
        <th key={column} className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">
          {column}
        </th>
      ))}
    </tr>
  );
}

function updateForm(setForm, event) {
  const { name, value } = event.target;
  setForm((prev) => ({ ...prev, [name]: value }));
}

function upsertItem(items, onChange, nextItem) {
  const exists = items.some((item) => item.id === nextItem.id);
  onChange(exists ? items.map((item) => item.id === nextItem.id ? nextItem : item) : [nextItem, ...items]);
}

function deleteItem(items, onChange, id) {
  onChange(items.filter((item) => item.id !== id));
}

function serializeAboutContent(content) {
  return {
    pageEyebrow: content.pageEyebrow,
    title: content.title,
    summary: content.summary,
    historyTitle: content.historyTitle,
    historyBody: content.historyBody,
    contactTitle: content.contactTitle,
    contactBody: content.contactBody,
    valuesText: formatPipeRows(content.values, ["title", "description"]),
    timelineText: formatPipeRows(content.timeline, ["date", "title", "description"]),
    sectorsText: formatPipeRows(content.sectors, ["name", "chair", "area"]),
  };
}

function formatPipeRows(items = [], keys = []) {
  return items.map((item) => keys.map((key) => item[key] || "").join(" | ")).join("\n");
}

function parsePipeRows(value, keys) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("|").map((item) => item.trim());
      return keys.reduce((record, key, index) => ({ ...record, [key]: parts[index] || "" }), {});
    });
}

function toSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
