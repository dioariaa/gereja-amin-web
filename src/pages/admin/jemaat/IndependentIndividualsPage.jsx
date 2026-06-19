import { useMemo, useState } from "react";
import { Pencil, Search, Trash2, UserPlus, UsersRound } from "lucide-react";
import ActionButton from "../../../components/admin/ActionButton";
import AdminPageHeader from "../../../components/admin/AdminPageHeader";
import DataTable from "../../../components/admin/DataTable";
import DataSourceNotice from "../../../components/admin/DataSourceNotice";
import EmptyState from "../../../components/admin/EmptyState";
import FormField from "../../../components/admin/FormField";
import StatusBadge from "../../../components/admin/StatusBadge";
import SummaryCard from "../../../components/admin/SummaryCard";
import { useAuth } from "../../../contexts/authContextValue";
import {
  canManageJemaat,
  deleteIndividualFromSupabase,
  formatBirthPlaceDate,
  genderInitial,
  listIndependentIndividuals,
  saveIndividualToSupabase,
} from "../../../services/jemaatService";
import { isSupabaseConfigured } from "../../../lib/supabase";
import useJemaatData from "../../../hooks/useJemaatData";

const initialForm = {
  noInduk: "",
  namaLengkap: "",
  namaPanggilan: "",
  jenisKelamin: "Laki-laki",
  tempatLahir: "",
  tanggalLahir: "",
  golDarah: "",
  pekerjaan: "",
  nomorHp: "",
  statusPernikahan: "Belum",
  baptis: "Sudah",
  sidi: "Sudah",
  statusJemaat: "Aktif",
};

export default function IndependentIndividualsPage() {
  const { user } = useAuth();
  const canManage = canManageJemaat(user?.role);
  const {
    error: dataError,
    individuals,
    loading: dataLoading,
    setIndividuals,
  } = useJemaatData();
  const items = listIndependentIndividuals(individuals);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState("");
  const [syncMessage, setSyncMessage] = useState("");

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return items.filter((individual) =>
      [
        individual.noInduk,
        individual.namaLengkap,
        individual.namaPanggilan,
        individual.nomorHp,
        individual.tempatLahir,
        individual.statusJemaat,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }, [items, search]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.noInduk.trim() || !form.namaLengkap.trim()) {
      return;
    }

    let nextItem = {
      id: editingId || `ind-mandiri-local-${Date.now()}`,
      familyId: null,
      hubunganKeluarga: "Individu Mandiri",
      ...form,
    };

    if (isSupabaseConfigured) {
      try {
        nextItem = await saveIndividualToSupabase({
          ...nextItem,
          id: editingId,
        });
        setSyncMessage("Individu mandiri berhasil disimpan.");
      } catch {
        setSyncMessage("Perubahan tersimpan pada sesi ini, tetapi sinkronisasi belum berhasil.");
      }
    }

    setIndividuals((prev) =>
      editingId
        ? prev.map((item) => (item.id === editingId ? nextItem : item))
        : [nextItem, ...prev]
    );
    setForm(initialForm);
    setEditingId("");
  };

  const handleEdit = (individual) => {
    setEditingId(individual.id);
    setForm({
      noInduk: individual.noInduk || "",
      namaLengkap: individual.namaLengkap || "",
      namaPanggilan: individual.namaPanggilan || "",
      jenisKelamin: individual.jenisKelamin || "Laki-laki",
      tempatLahir: individual.tempatLahir || "",
      tanggalLahir: individual.tanggalLahir || "",
      golDarah: individual.golDarah || "",
      pekerjaan: individual.pekerjaan || "",
      nomorHp: individual.nomorHp || "",
      statusPernikahan: individual.statusPernikahan || "Belum",
      baptis: individual.baptis || "Sudah",
      sidi: individual.sidi || "Sudah",
      statusJemaat: individual.statusJemaat || "Aktif",
    });
  };

  const handleDelete = async (id) => {
    if (isSupabaseConfigured) {
      try {
        await deleteIndividualFromSupabase(id);
        setSyncMessage("Individu mandiri berhasil dihapus.");
      } catch {
        setSyncMessage("Penghapusan belum tersinkron. Daftar pada sesi ini telah diperbarui.");
      }
    }

    setIndividuals((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) {
      setEditingId("");
      setForm(initialForm);
    }
  };

  return (
    <div className="space-y-7">
      <AdminPageHeader
        eyebrow="Modul Jemaat"
        title="Individu Mandiri"
        description="Data ini berdiri sendiri tanpa keluarga. Semua individu mandiri disimpan dengan familyId kosong dan tetap memakai struktur individu jemaat."
        meta={
          <StatusBadge value="Mandiri" />
        }
      />

      <DataSourceNotice
        error={dataError}
        label="individu mandiri"
        loading={dataLoading}
      />
      {syncMessage ? (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/25 dark:text-emerald-200">
          {syncMessage}
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Total Mandiri" value={items.length} description="Data tidak memiliki familyId." icon={UsersRound} />
        <SummaryCard title="Aktif" value={items.filter((item) => item.statusJemaat === "Aktif").length} description="Status jemaat aktif." icon={UserPlus} tone="success" />
        <SummaryCard title="Meninggal" value={items.filter((item) => item.statusJemaat === "Meninggal").length} description="Status meninggal dicatat pada individu." icon={UsersRound} />
        <SummaryCard title="Belum Menikah" value={items.filter((item) => item.statusPernikahan === "Belum").length} description="Mengikuti pola status pernikahan Excel." icon={UsersRound} />
      </section>

      {canManage ? (
        <section className="brand-card p-5 md:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-100">
              <UserPlus size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                Form Individu Mandiri
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">
                {editingId ? "Edit individu mandiri" : "Tambah individu tanpa keluarga"}
              </h2>
            </div>
          </div>

          <form className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4" onSubmit={handleSubmit}>
            <FormField label="No Induk">
              <input name="noInduk" value={form.noInduk} onChange={handleChange} placeholder="Contoh: TGR057" className="input-base" />
            </FormField>
            <FormField label="Nama Lengkap">
              <input name="namaLengkap" value={form.namaLengkap} onChange={handleChange} placeholder="Nama lengkap" className="input-base" />
            </FormField>
            <FormField label="Nama Panggilan">
              <input name="namaPanggilan" value={form.namaPanggilan} onChange={handleChange} placeholder="Opsional" className="input-base" />
            </FormField>
            <FormField label="Jenis Kelamin">
              <select name="jenisKelamin" value={form.jenisKelamin} onChange={handleChange} className="input-base">
                <option>Laki-laki</option>
                <option>Perempuan</option>
              </select>
            </FormField>
            <FormField label="Tempat Lahir">
              <input name="tempatLahir" value={form.tempatLahir} onChange={handleChange} placeholder="Tempat lahir" className="input-base" />
            </FormField>
            <FormField label="Tanggal Lahir">
              <input type="date" name="tanggalLahir" value={form.tanggalLahir} onChange={handleChange} className="input-base" />
            </FormField>
            <FormField label="Pekerjaan">
              <input name="pekerjaan" value={form.pekerjaan} onChange={handleChange} placeholder="Pekerjaan" className="input-base" />
            </FormField>
            <FormField label="Nomor HP">
              <input name="nomorHp" value={form.nomorHp} onChange={handleChange} placeholder="08..." className="input-base" />
            </FormField>
            <FormField label="Status Pernikahan">
              <select name="statusPernikahan" value={form.statusPernikahan} onChange={handleChange} className="input-base">
                <option>Belum</option>
                <option>Menikah</option>
                <option>Duda</option>
                <option>Janda</option>
              </select>
            </FormField>
            <FormField label="Baptis">
              <select name="baptis" value={form.baptis} onChange={handleChange} className="input-base">
                <option>Sudah</option>
                <option>Belum</option>
              </select>
            </FormField>
            <FormField label="Sidi / Krisma">
              <select name="sidi" value={form.sidi} onChange={handleChange} className="input-base">
                <option>Sudah</option>
                <option>Belum</option>
              </select>
            </FormField>
            <FormField label="Status Jemaat">
              <select name="statusJemaat" value={form.statusJemaat} onChange={handleChange} className="input-base">
                <option>Aktif</option>
                <option>Meninggal</option>
              </select>
            </FormField>

            <div className="md:col-span-2 xl:col-span-4">
              <button
                type="submit"
                className="brand-button-primary inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition"
              >
                <UserPlus size={17} />
                {editingId ? "Update Individu Mandiri" : "Simpan Individu Mandiri"}
              </button>
              {editingId ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId("");
                    setForm(initialForm);
                  }}
                  className="brand-button-secondary ml-0 mt-3 inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition sm:ml-3 sm:mt-0"
                >
                  Batal Edit
                </button>
              ) : null}
            </div>
          </form>
        </section>
      ) : null}

      <DataTable
        eyebrow="Daftar Mandiri"
        title={`${filteredItems.length} individu ditemukan`}
        actions={
          <div className="w-full md:w-80">
            <div className="brand-search-box flex items-center gap-3 rounded-xl px-4 py-3">
              <Search size={18} className="text-violet-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari no induk, nama, status"
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>
          </div>
        }
      >
        {filteredItems.length > 0 ? (
          <table className="min-w-[860px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">No Induk</th>
                <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Nama</th>
                <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">JK</th>
                <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Tempat/Tanggal Lahir</th>
                <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Pernikahan</th>
                <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((individual) => (
                <tr
                  key={individual.id}
                  className="brand-table-row border-b border-slate-100 transition dark:border-slate-800"
                >
                  <td className="px-3 py-4 font-semibold text-slate-950 dark:text-white">
                    {individual.noInduk}
                  </td>
                  <td className="px-3 py-4">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {individual.namaLengkap}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {individual.pekerjaan || "-"} | {individual.nomorHp || "-"}
                    </p>
                  </td>
                  <td className="px-3 py-4 text-slate-700 dark:text-slate-200">
                    {genderInitial(individual.jenisKelamin)}
                  </td>
                  <td className="px-3 py-4 text-slate-700 dark:text-slate-200">
                    {formatBirthPlaceDate(individual)}
                  </td>
                  <td className="px-3 py-4">
                    <StatusBadge value={individual.statusPernikahan} />
                  </td>
                  <td className="px-3 py-4">
                    <StatusBadge value={individual.statusJemaat} />
                  </td>
                  <td className="px-3 py-4">
                    {canManage ? (
                      <div className="flex gap-2">
                        <button type="button" onClick={() => handleEdit(individual)} className="brand-button-secondary rounded-xl p-2 text-slate-700 transition dark:text-slate-200" aria-label={`Edit ${individual.namaLengkap}`} title="Edit">
                          <Pencil size={16} />
                        </button>
                        <button type="button" onClick={() => handleDelete(individual.id)} className="rounded-xl border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/30" aria-label={`Hapus ${individual.namaLengkap}`} title="Hapus">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState
            title="Individu mandiri tidak ditemukan"
            description="Tidak ada data mandiri yang sesuai dengan pencarian saat ini."
            action={
              canManage ? (
                <ActionButton icon={UserPlus} variant="primary">
                  Tambah Data
                </ActionButton>
              ) : null
            }
          />
        )}
      </DataTable>
    </div>
  );
}
