import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FileText, PenLine, Plus, Trash2 } from "lucide-react";
import ActionButton from "../../components/admin/ActionButton";
import AdminModal from "../../components/admin/AdminModal";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import DataTable from "../../components/admin/DataTable";
import FormField from "../../components/admin/FormField";
import StatusBadge from "../../components/admin/StatusBadge";
import SummaryCard from "../../components/admin/SummaryCard";
import {
  PUBLICATIONS_STORAGE_KEY,
  publicationSeed,
  toSlug,
} from "../../services/publicationsService";
import useLocalStorageState from "../../hooks/useLocalStorageState";

const emptyForm = {
  id: "",
  slug: "",
  category: "Warta Jemaat",
  title: "",
  excerpt: "",
  content: "",
  author: "Sekretariat Gereja",
  status: "Draft",
  date: "",
};

export default function ArticlesPage() {
  const [searchParams] = useSearchParams();
  const [publications, setPublications] = useLocalStorageState(
    PUBLICATIONS_STORAGE_KEY,
    publicationSeed
  );
  const action = searchParams.get("action");
  const editSlug = searchParams.get("edit");
  const modeLabel = action === "create" ? "Tambah Publikasi" : editSlug ? "Edit Publikasi" : "Kelola Publikasi";
  const queryEditItem = editSlug
    ? publications.find((item) => item.slug === editSlug)
    : null;
  const [modalOpen, setModalOpen] = useState(Boolean(action === "create" || queryEditItem));
  const [form, setForm] = useState(() => {
    if (queryEditItem) return queryEditItem;
    if (action === "create") {
      return { ...emptyForm, date: new Date().toISOString().slice(0, 10) };
    }
    return emptyForm;
  });

  const stats = useMemo(
    () => ({
      total: publications.length,
      active: publications.filter((item) => item.status === "Aktif").length,
      draft: publications.filter((item) => item.status === "Draft").length,
      categories: new Set(publications.map((item) => item.category)).size,
    }),
    [publications]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      slug: name === "title" ? toSlug(value) : prev.slug,
    }));
  };

  const openCreate = () => {
    setForm({ ...emptyForm, date: new Date().toISOString().slice(0, 10) });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setForm(item);
    setModalOpen(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.title.trim()) return;

    setPublications((prev) => {
      const nextItem = {
        ...form,
        id: form.id || `pub-local-${Date.now()}`,
        slug: form.slug || toSlug(form.title),
      };

      const exists = prev.some((item) => item.id === nextItem.id);
      return exists
        ? prev.map((item) => (item.id === nextItem.id ? nextItem : item))
        : [nextItem, ...prev];
    });
    setModalOpen(false);
    setForm(emptyForm);
  };

  const handleDelete = (id) => {
    setPublications((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-7">
      <AdminPageHeader
        eyebrow="Publikasi Gereja"
        title={modeLabel}
        description="Kelola warta jemaat, renungan, dan buletin dengan dummy CRUD berbasis localStorage sebelum backend tersedia."
        meta={
          <>
            <StatusBadge value="LocalStorage" />
            <StatusBadge value={editSlug || modeLabel} />
          </>
        }
        actions={
          <ActionButton variant="primary" icon={Plus} onClick={openCreate}>
            Tambah Publikasi
          </ActionButton>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Total Publikasi" value={stats.total} description="Tersimpan di localStorage." icon={FileText} />
        <SummaryCard title="Kategori" value={stats.categories} description="Warta, renungan, buletin, dll." icon={FileText} />
        <SummaryCard title="Status Aktif" value={stats.active} description="Contoh data publish." icon={FileText} tone="success" />
        <SummaryCard title="Draft" value={stats.draft} description="Belum dipublish." icon={FileText} />
      </section>

      <DataTable eyebrow="Daftar Publikasi" title="Konten publikasi public">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800">
              <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Kategori</th>
              <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Judul</th>
              <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Tanggal</th>
              <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Status</th>
              <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {publications.map((item) => (
              <tr key={item.id} className="brand-table-row border-b border-slate-100 transition dark:border-slate-800">
                <td className="px-3 py-4 font-semibold text-slate-950 dark:text-white">{item.category}</td>
                <td className="px-3 py-4">
                  <p className="font-semibold text-slate-900 dark:text-white">{item.title}</p>
                  <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500 dark:text-slate-400">
                    {item.excerpt}
                  </p>
                </td>
                <td className="px-3 py-4 text-slate-700 dark:text-slate-200">{item.date || "-"}</td>
                <td className="px-3 py-4"><StatusBadge value={item.status} /></td>
                <td className="px-3 py-4">
                  <div className="flex gap-2">
                    <button type="button" className="brand-button-secondary rounded-xl p-2" onClick={() => openEdit(item)} title="Edit">
                      <PenLine size={16} />
                    </button>
                    <button type="button" className="rounded-xl border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/30" onClick={() => handleDelete(item.id)} title="Hapus">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>

      <AdminModal
        open={modalOpen}
        title={form.id ? "Edit Publikasi" : "Tambah Publikasi"}
        description="Data masih dummy dan tersimpan di browser untuk kebutuhan demo."
        onClose={() => setModalOpen(false)}
      >
        <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
          <FormField label="Kategori">
            <select name="category" value={form.category} onChange={handleChange} className="input-base">
              <option>Warta Jemaat</option>
              <option>Renungan Harian</option>
              <option>Buletin Khotbah</option>
              <option>Pengumuman</option>
            </select>
          </FormField>
          <FormField label="Tanggal">
            <input type="date" name="date" value={form.date} onChange={handleChange} className="input-base" />
          </FormField>
          <FormField label="Judul" className="md:col-span-2">
            <input name="title" value={form.title} onChange={handleChange} placeholder="Judul publikasi" className="input-base" />
          </FormField>
          <FormField label="Slug" className="md:col-span-2">
            <input name="slug" value={form.slug} onChange={handleChange} placeholder="slug-publikasi" className="input-base" />
          </FormField>
          <FormField label="Ringkasan" className="md:col-span-2">
            <textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows="4" placeholder="Ringkasan singkat" className="input-base" />
          </FormField>
          <FormField label="Isi Detail" className="md:col-span-2">
            <textarea name="content" value={form.content || ""} onChange={handleChange} rows="6" placeholder="Isi detail publikasi untuk halaman public" className="input-base" />
          </FormField>
          <FormField label="Penulis / Tim">
            <input name="author" value={form.author || ""} onChange={handleChange} placeholder="Sekretariat Gereja" className="input-base" />
          </FormField>
          <FormField label="Status">
            <select name="status" value={form.status} onChange={handleChange} className="input-base">
              <option>Draft</option>
              <option>Aktif</option>
            </select>
          </FormField>
          <div className="flex items-end">
            <button type="submit" className="brand-button-primary inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition">
              Simpan Publikasi
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
