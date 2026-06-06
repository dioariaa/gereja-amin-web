import { useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  Images,
  Info,
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
  COMMISSIONS_STORAGE_KEY,
  commissionSeed,
} from "../../services/commissionsService";
import useLocalStorageState from "../../hooks/useLocalStorageState";

const sectionMeta = {
  home: {
    eyebrow: "Konten Website",
    title: "Kelola Beranda",
    description: "Atur hero, highlight, jadwal ringkas, dan CTA pada halaman beranda public.",
    icon: Settings,
  },
  about: {
    eyebrow: "Konten Website",
    title: "Kelola Tentang Kami",
    description: "Atur profil gereja, sejarah, pengakuan iman, dan informasi pengurus.",
    icon: Info,
  },
  leadership: {
    eyebrow: "Konten Website",
    title: "Kelola Pengurus / Sektor",
    description: "Kelola BPHMJ, pengurus sektor, dan komisi yang tampil di halaman tentang.",
    icon: Settings,
  },
  schedule: {
    eyebrow: "Konten Website",
    title: "Kelola Jadwal Ibadah",
    description: "Atur jadwal ibadah umum, pemuda, sekolah minggu, sektor, dan komisi.",
    icon: CalendarDays,
  },
  gallery: {
    eyebrow: "Konten Website",
    title: "Kelola Galeri",
    description: "Tambah foto, album, dan dokumentasi kegiatan gereja.",
    icon: Images,
  },
  contact: {
    eyebrow: "Konten Website",
    title: "Kelola Kontak Gereja",
    description: "Atur alamat, nomor telepon, email, maps, dan sosial media gereja.",
    icon: Info,
  },
  commissions: {
    eyebrow: "Konten Website",
    title: "Kelola Komisi Pelayanan",
    description: "Atur profil komisi, pengurus, jadwal, kegiatan, dan konten pelayanan.",
    icon: Settings,
  },
};

const publicPaths = {
  home: "/",
  about: "/tentang-kami",
  leadership: "/tentang-kami",
  schedule: "/jadwal-ibadah",
  gallery: "/galeri",
  contact: "/kontak",
  commissions: "/komisi",
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
};

const emptyContentForm = {
  headline: "",
  summary: "",
  primaryCta: "",
  status: "Draft",
};

export default function AdminContentPage() {
  const { section = "home", itemSlug } = useParams();
  const [searchParams] = useSearchParams();
  const action = searchParams.get("action");
  const meta = sectionMeta[section] || sectionMeta.home;
  const Icon = meta.icon;

  const [contentDrafts, setContentDrafts] = useLocalStorageState(
    "amin-public-content-drafts",
    {}
  );
  const [commissionItems, setCommissionItems] = useLocalStorageState(
    COMMISSIONS_STORAGE_KEY,
    commissionSeed
  );

  const commission = section === "commissions" && itemSlug
    ? commissionItems.find((item) => item.slug === itemSlug)
    : null;

  const pageTitle = commission ? `Kelola ${commission.shortName}` : meta.title;
  const publicPath = commission ? `/komisi/${commission.slug}` : publicPaths[section] || "/";
  const actionLabel = useMemo(() => {
    if (!action) return "Kelola Konten";
    return action.split("-").join(" ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  }, [action]);
  const [contentForm, setContentForm] = useState(() => ({
    ...emptyContentForm,
    headline: contentDrafts[section]?.headline || meta.title,
    summary: contentDrafts[section]?.summary || meta.description,
    primaryCta: contentDrafts[section]?.primaryCta || "",
    status: contentDrafts[section]?.status || "Draft",
  }));
  const [commissionForm, setCommissionForm] = useState(() => {
    if (action === "create") return emptyCommission;
    return commission || emptyCommission;
  });
  const [commissionModalOpen, setCommissionModalOpen] = useState(
    section === "commissions" && (action === "create" || action === "edit")
  );

  const handleContentChange = (event) => {
    const { name, value } = event.target;
    setContentForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveContentDraft = (event) => {
    event.preventDefault();
    setContentDrafts((prev) => ({
      ...prev,
      [section]: {
        ...contentForm,
        updatedAt: new Date().toISOString(),
      },
    }));
  };

  const openCreateCommission = () => {
    setCommissionForm(emptyCommission);
    setCommissionModalOpen(true);
  };

  const resetContentForm = () => {
    setContentForm({
      ...emptyContentForm,
      headline: "",
      summary: "",
      primaryCta: "",
    });
  };

  const openEditCommission = (item) => {
    setCommissionForm(item);
    setCommissionModalOpen(true);
  };

  const handleCommissionChange = (event) => {
    const { name, value } = event.target;
    setCommissionForm((prev) => ({
      ...prev,
      [name]: ["focus", "activities"].includes(name)
        ? value.split(",").map((item) => item.trim()).filter(Boolean)
        : value,
      slug: name === "name" && !prev.slug ? toSlug(value) : prev.slug,
      shortName: name === "name" && !prev.shortName ? value.replace("Komisi ", "") : prev.shortName,
    }));
  };

  const saveCommission = (event) => {
    event.preventDefault();
    if (!commissionForm.name.trim()) return;

    const nextItem = {
      ...commissionForm,
      slug: commissionForm.slug || toSlug(commissionForm.name),
      shortName: commissionForm.shortName || commissionForm.name,
      focus: Array.isArray(commissionForm.focus) ? commissionForm.focus : [],
      activities: Array.isArray(commissionForm.activities) ? commissionForm.activities : [],
    };

    setCommissionItems((prev) => {
      const exists = prev.some((item) => item.slug === nextItem.slug);
      return exists
        ? prev.map((item) => (item.slug === nextItem.slug ? nextItem : item))
        : [nextItem, ...prev];
    });
    setCommissionModalOpen(false);
  };

  const deleteCommission = (slug) => {
    setCommissionItems((prev) => prev.filter((item) => item.slug !== slug));
  };

  const isCommissions = section === "commissions";

  return (
    <div className="space-y-7">
      <AdminPageHeader
        eyebrow={meta.eyebrow}
        title={pageTitle}
        description={commission ? commission.description : meta.description}
        meta={
          <>
            <StatusBadge value={isCommissions ? "CRUD Komisi" : "Editor Konten"} />
            <StatusBadge value={actionLabel} />
          </>
        }
        actions={
          <>
            <ActionButton to={publicPath} icon={ArrowLeft}>
              Lihat Public
            </ActionButton>
            <ActionButton
              variant="primary"
              icon={Plus}
              onClick={isCommissions ? openCreateCommission : resetContentForm}
            >
              {isCommissions ? "Tambah Komisi" : "Tambah Konten"}
            </ActionButton>
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Status Modul" value={isCommissions ? "CRUD" : "Draft"} description="Dummy localStorage." icon={Icon} />
        <SummaryCard title="Akses Role" value="2 Role" description="Super admin dan sekretaris." icon={Settings} />
        <SummaryCard title="Aksi Saat Ini" value={actionLabel} description="Dari CTA halaman public." icon={FileText} />
        <SummaryCard title="Koneksi Public" value={section} description={itemSlug || "Halaman utama"} icon={Info} />
      </section>

      {isCommissions ? (
        <div className="space-y-7">
          {commission ? (
            <CommissionAdminDetail
              commission={commission}
              onEdit={() => openEditCommission(commission)}
            />
          ) : null}
          <CommissionManager
            items={commissionItems}
            onEdit={openEditCommission}
            onDelete={deleteCommission}
          />
        </div>
      ) : (
        <ContentEditor
          section={section}
          form={contentForm}
          savedDraft={contentDrafts[section]}
          onChange={handleContentChange}
          onSubmit={saveContentDraft}
        />
      )}

      <AdminModal
        open={commissionModalOpen}
        title={commissionForm.slug ? "Edit Komisi" : "Tambah Komisi"}
        description="Data komisi tersimpan di localStorage dan langsung dipakai halaman public komisi."
        onClose={() => setCommissionModalOpen(false)}
      >
        <form className="grid gap-5 md:grid-cols-2" onSubmit={saveCommission}>
          <FormField label="Nama Komisi" className="md:col-span-2">
            <input name="name" value={commissionForm.name} onChange={handleCommissionChange} className="input-base" placeholder="Komisi Pelayanan..." />
          </FormField>
          <FormField label="Nama Singkat">
            <input name="shortName" value={commissionForm.shortName} onChange={handleCommissionChange} className="input-base" placeholder="Pelayanan Anak" />
          </FormField>
          <FormField label="Slug">
            <input name="slug" value={commissionForm.slug} onChange={handleCommissionChange} className="input-base" placeholder="pelayanan-anak" />
          </FormField>
          <FormField label="Ketua / Pengurus">
            <input name="chair" value={commissionForm.chair} onChange={handleCommissionChange} className="input-base" placeholder="Nama ketua komisi" />
          </FormField>
          <FormField label="Jadwal / Kegiatan">
            <input name="schedule" value={commissionForm.schedule} onChange={handleCommissionChange} className="input-base" placeholder="Sesuai agenda komisi" />
          </FormField>
          <FormField label="Image URL" className="md:col-span-2" hint="Opsional. Bisa pakai public URL dari Supabase Storage nanti.">
            <input name="imageUrl" value={commissionForm.imageUrl || ""} onChange={handleCommissionChange} className="input-base" placeholder="https://..." />
          </FormField>
          <FormField label="Deskripsi" className="md:col-span-2">
            <textarea name="description" value={commissionForm.description} onChange={handleCommissionChange} rows="4" className="input-base" placeholder="Deskripsi singkat komisi" />
          </FormField>
          <FormField label="Fokus Pelayanan" className="md:col-span-2" hint="Pisahkan dengan koma, contoh: Sekolah Minggu, Pembinaan iman anak">
            <input name="focus" value={(commissionForm.focus || []).join(", ")} onChange={handleCommissionChange} className="input-base" />
          </FormField>
          <FormField label="Jadwal / Kegiatan Basic" className="md:col-span-2" hint="Pisahkan dengan koma, contoh: Ibadah komisi, Pembinaan, Kunjungan">
            <input name="activities" value={(commissionForm.activities || []).join(", ")} onChange={handleCommissionChange} className="input-base" />
          </FormField>
          <div className="md:col-span-2">
            <button type="submit" className="brand-button-primary inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition sm:w-auto">
              Simpan Komisi
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}

function CommissionAdminDetail({ commission, onEdit }) {
  return (
    <section className="brand-card p-5 md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="brand-eyebrow text-xs font-semibold uppercase tracking-[0.22em]">
            Detail Komisi
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
            {commission.name}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
            {commission.description}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <ActionButton to={`/komisi/${commission.slug}`} icon={ArrowLeft}>
            Lihat Public
          </ActionButton>
          <ActionButton variant="primary" icon={PenLine} onClick={onEdit}>
            Edit Komisi
          </ActionButton>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <InfoPanel icon={UsersRound} title="Pengurus" value={commission.chair || "-"} />
        <InfoPanel icon={CalendarDays} title="Jadwal" value={commission.schedule || "-"} />
        <InfoPanel icon={FileText} title="Kegiatan" value={`${(commission.activities || []).length || 0} item`} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <TagPanel title="Fokus Pelayanan" items={commission.focus || []} />
        <TagPanel title="Kegiatan Basic" items={commission.activities || []} tone="cyan" />
      </div>
    </section>
  );
}

function InfoPanel({ icon: Icon, title, value }) {
  return (
    <div className="rounded-2xl border border-violet-100 bg-violet-50/40 p-4 dark:border-violet-950/60 dark:bg-violet-950/20">
      <Icon size={18} className="text-violet-600 dark:text-violet-200" />
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <p className="mt-1 text-sm font-bold text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}

function TagPanel({ title, items, tone = "violet" }) {
  const classes = tone === "cyan"
    ? "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-200"
    : "bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-200";

  return (
    <div>
      <p className="text-sm font-semibold text-slate-950 dark:text-white">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.length > 0 ? items.map((item) => (
          <span key={item} className={`rounded-full px-3 py-1 text-xs font-semibold ${classes}`}>
            {item}
          </span>
        )) : (
          <span className="text-sm text-slate-500 dark:text-slate-400">Belum ada data.</span>
        )}
      </div>
    </div>
  );
}

function ContentEditor({ section, form, savedDraft, onChange, onSubmit }) {
  return (
    <section className="brand-card p-5 md:p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="brand-eyebrow text-xs font-semibold uppercase tracking-[0.2em]">
            Editor Konten Public
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
            Draft halaman {section}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Editor ini menjaga flow demo sebelum schema CMS final dibuat.
          </p>
        </div>
        {savedDraft?.updatedAt ? (
          <StatusBadge value="Draft" className="self-start" />
        ) : null}
      </div>

      <form className="mt-6 grid gap-5 md:grid-cols-2" onSubmit={onSubmit}>
        <FormField label="Headline" className="md:col-span-2">
          <input name="headline" value={form.headline} onChange={onChange} className="input-base" />
        </FormField>
        <FormField label="Ringkasan" className="md:col-span-2">
          <textarea name="summary" value={form.summary} onChange={onChange} rows="4" className="input-base" />
        </FormField>
        <FormField label="CTA Utama">
          <input name="primaryCta" value={form.primaryCta} onChange={onChange} placeholder="Contoh: Hubungi Kami" className="input-base" />
        </FormField>
        <FormField label="Status">
          <select name="status" value={form.status} onChange={onChange} className="input-base">
            <option>Draft</option>
            <option>Aktif</option>
          </select>
        </FormField>
        <div className="md:col-span-2">
          <button type="submit" className="brand-button-primary inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition sm:w-auto">
            Simpan Draft Konten
          </button>
        </div>
      </form>
    </section>
  );
}

function CommissionManager({ items, onEdit, onDelete }) {
  return (
    <DataTable eyebrow="CRUD Komisi" title={`${items.length} komisi pelayanan`}>
      <table className="min-w-[980px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800">
            <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Komisi</th>
            <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Ketua</th>
            <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Jadwal</th>
            <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Fokus</th>
            <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Kegiatan</th>
            <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Aksi</th>
          </tr>
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
              <td className="px-3 py-4 text-slate-700 dark:text-slate-200">{(item.activities || []).join(", ") || "-"}</td>
              <td className="px-3 py-4">
                <div className="flex gap-2">
                  <Link to={`/admin/content/commissions/${item.slug}`} className="brand-button-secondary rounded-xl p-2" title="Detail admin">
                    <FileText size={16} />
                  </Link>
                  <button type="button" className="brand-button-secondary rounded-xl p-2" onClick={() => onEdit(item)} title="Edit">
                    <PenLine size={16} />
                  </button>
                  <button type="button" className="rounded-xl border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/30" onClick={() => onDelete(item.slug)} title="Hapus">
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </DataTable>
  );
}

function toSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
