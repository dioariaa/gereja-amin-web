import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  FileText,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import ActionButton from "../../../components/admin/ActionButton";
import AdminModal from "../../../components/admin/AdminModal";
import AdminPageHeader from "../../../components/admin/AdminPageHeader";
import DataTable from "../../../components/admin/DataTable";
import DataSourceNotice from "../../../components/admin/DataSourceNotice";
import EmptyState from "../../../components/admin/EmptyState";
import FilterPanel from "../../../components/admin/FilterPanel";
import FormField from "../../../components/admin/FormField";
import StatusBadge from "../../../components/admin/StatusBadge";
import SummaryCard from "../../../components/admin/SummaryCard";
import { useAuth } from "../../../contexts/authContextValue";
import {
  canManageJemaat,
  deleteFamilyFromSupabase,
  getFamilyMembersFrom,
  getJemaatStatsFrom,
  getSectorOptionsFrom,
  saveFamilyToSupabase,
} from "../../../services/jemaatService";
import { isSupabaseConfigured } from "../../../lib/supabase";
import useJemaatData from "../../../hooks/useJemaatData";

const emptyFamilyForm = {
  id: "",
  noKk: "",
  kepalaKeluarga: "",
  pasangan: "",
  tanggalPernikahan: "",
  alamat: "",
  sektor: "Nazaret",
  statusKeluarga: "Aktif",
};

export default function FamilyListPage() {
  const { user } = useAuth();
  const canManage = canManageJemaat(user?.role);
  const {
    error: dataError,
    families: localFamilies,
    individuals: localIndividuals,
    loading: dataLoading,
    setFamilies: setLocalFamilies,
  } = useJemaatData();
  const stats = getJemaatStatsFrom(localFamilies, localIndividuals);
  const sectors = getSectorOptionsFrom(localFamilies);
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("Semua");
  const [status, setStatus] = useState("Semua");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyFamilyForm);
  const [syncMessage, setSyncMessage] = useState("");

  const filteredFamilies = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return localFamilies.filter((family) => {
      const matchesSearch = [
        family.noKk,
        family.kepalaKeluarga,
        family.pasangan,
        family.alamat,
        family.sektor,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
      const matchesSector = sector === "Semua" || family.sektor === sector;
      const matchesStatus =
        status === "Semua" || family.statusKeluarga === status;

      return matchesSearch && matchesSector && matchesStatus;
    });
  }, [localFamilies, search, sector, status]);

  const openCreate = () => {
    setForm(emptyFamilyForm);
    setModalOpen(true);
  };

  const openEdit = (family) => {
    setForm(family);
    setModalOpen(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.noKk.trim() || !form.kepalaKeluarga.trim()) return;

    let nextItem = {
      ...form,
      id: form.id || `fam-local-${Date.now()}`,
    };

    if (isSupabaseConfigured) {
      try {
        nextItem = await saveFamilyToSupabase(form);
        setSyncMessage("Data keluarga berhasil disimpan.");
      } catch {
        setSyncMessage("Perubahan tersimpan pada sesi ini, tetapi sinkronisasi belum berhasil.");
      }
    }

    setLocalFamilies((prev) => {
      const exists = prev.some((item) => item.id === nextItem.id);
      return exists
        ? prev.map((item) => (item.id === nextItem.id ? nextItem : item))
        : [nextItem, ...prev];
    });
    setModalOpen(false);
    setForm(emptyFamilyForm);
  };

  const handleDelete = async (familyId) => {
    if (isSupabaseConfigured) {
      try {
        await deleteFamilyFromSupabase(familyId);
        setSyncMessage("Data keluarga berhasil dihapus.");
      } catch {
        setSyncMessage("Penghapusan belum tersinkron. Daftar pada sesi ini telah diperbarui.");
      }
    }
    setLocalFamilies((prev) => prev.filter((item) => item.id !== familyId));
  };

  return (
    <div className="space-y-7">
      <AdminPageHeader
        eyebrow="Modul Jemaat"
        title="Data Keluarga"
        description="Kelola keluarga jemaat berdasarkan nomor KK, sektor keluarga, dan anggota yang terhubung lewat familyId."
        meta={
          <>
            <StatusBadge value="Sektor ikut keluarga" />
            <StatusBadge value="KKJ siap cetak" />
          </>
        }
        actions={
          canManage ? (
            <ActionButton variant="primary" icon={Plus} onClick={openCreate}>
              Tambah Keluarga
            </ActionButton>
          ) : null
        }
      />

      <DataSourceNotice
        error={dataError}
        label="data jemaat"
        loading={dataLoading}
      />
      {syncMessage ? (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/25 dark:text-emerald-200">
          {syncMessage}
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Keluarga"
          value={stats.familyCount}
          description="Satu keluarga selalu punya satu nomor KK."
          icon={UsersRound}
        />
        <SummaryCard
          title="Total Individu"
          value={stats.individualCount}
          description="Gabungan anggota keluarga dan individu mandiri."
          icon={UserRoundCheck}
          tone="success"
        />
        <SummaryCard
          title="Individu Mandiri"
          value={stats.independentCount}
          description="Tersimpan tanpa familyId."
          icon={UsersRound}
        />
        <SummaryCard
          title="Jemaat Aktif"
          value={stats.activeCount}
          description="Berdasarkan status pada data individu."
          icon={UserRoundCheck}
          tone="success"
        />
      </section>

      <FilterPanel>
        <FormField label="Pencarian">
          <div className="brand-search-box flex items-center gap-3 rounded-xl px-4 py-3">
            <Search size={18} className="text-violet-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari no KK, kepala keluarga, alamat"
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
        </FormField>

        <FormField label="Sektor">
          <select
            value={sector}
            onChange={(event) => setSector(event.target.value)}
            className="input-base"
          >
            <option>Semua</option>
            {sectors.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Status Keluarga">
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="input-base"
          >
            <option>Semua</option>
            <option>Aktif</option>
            <option>Perlu Verifikasi</option>
          </select>
        </FormField>
      </FilterPanel>

      <DataTable
        eyebrow="Daftar Keluarga"
        title={`${filteredFamilies.length} keluarga ditemukan`}
        actions={
          <div className="inline-flex items-center gap-2 rounded-xl bg-cyan-50 px-4 py-3 text-sm font-semibold text-cyan-800 dark:bg-cyan-950/30 dark:text-cyan-200">
            <UsersRound size={17} />
            Sektor ikut keluarga
          </div>
        }
      >
        {filteredFamilies.length > 0 ? (
          <table className="min-w-[920px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">
                  No KK
                </th>
                <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">
                  Kepala Keluarga
                </th>
                <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">
                  Pasangan
                </th>
                <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">
                  Sektor
                </th>
                <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">
                  Anggota
                </th>
                <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">
                  Status
                </th>
                <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredFamilies.map((family) => {
                const memberCount = getFamilyMembersFrom(localIndividuals, family.id).length;

                return (
                  <tr
                    key={family.id}
                    className="brand-table-row border-b border-slate-100 transition dark:border-slate-800"
                  >
                    <td className="px-3 py-4 font-semibold text-slate-950 dark:text-white">
                      {family.noKk}
                    </td>
                    <td className="px-3 py-4">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {family.kepalaKeluarga}
                      </p>
                      <p className="mt-1 max-w-md text-xs leading-5 text-slate-500 dark:text-slate-400">
                        {family.alamat}
                      </p>
                    </td>
                    <td className="px-3 py-4 text-slate-700 dark:text-slate-200">
                      {family.pasangan || "-"}
                    </td>
                    <td className="px-3 py-4 text-slate-700 dark:text-slate-200">
                      {family.sektor}
                    </td>
                    <td className="px-3 py-4 text-slate-700 dark:text-slate-200">
                      {memberCount} orang
                    </td>
                    <td className="px-3 py-4">
                      <StatusBadge value={family.statusKeluarga} />
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={`/admin/jemaat/keluarga/${family.id}`}
                          className="brand-button-secondary rounded-xl p-2 text-slate-700 transition dark:text-slate-200"
                          aria-label={`Lihat keluarga ${family.noKk}`}
                          title="Detail keluarga"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link
                          to={`/admin/jemaat/keluarga/${family.id}/kkj`}
                          className="brand-button-secondary rounded-xl p-2 text-slate-700 transition dark:text-slate-200"
                          aria-label={`Preview KKJ ${family.noKk}`}
                          title="Preview KKJ"
                        >
                          <FileText size={16} />
                        </Link>
                        {canManage ? (
                          <>
                            <button
                              type="button"
                              className="brand-button-secondary rounded-xl p-2 text-slate-700 transition dark:text-slate-200"
                              aria-label={`Edit keluarga ${family.noKk}`}
                              title="Edit"
                              onClick={() => openEdit(family)}
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              type="button"
                              className="rounded-xl border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/30"
                              aria-label={`Hapus keluarga ${family.noKk}`}
                              title="Hapus"
                              onClick={() => handleDelete(family.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <EmptyState
            title="Keluarga tidak ditemukan"
            description="Tidak ada keluarga yang sesuai dengan pencarian atau filter saat ini."
          />
        )}
      </DataTable>

      <AdminModal
        open={modalOpen}
        title={form.id ? "Edit Keluarga" : "Tambah Keluarga"}
        description="Lengkapi data keluarga sesuai dokumen KK dan administrasi jemaat."
        onClose={() => setModalOpen(false)}
      >
        <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
          <FormField label="No KK">
            <input name="noKk" value={form.noKk} onChange={handleChange} className="input-base" placeholder="TGR057" />
          </FormField>
          <FormField label="Sektor">
            <select name="sektor" value={form.sektor} onChange={handleChange} className="input-base">
              <option>Eben-Haezer</option>
              <option>Anugerah</option>
              <option>Betlehem</option>
              <option>Nazaret</option>
            </select>
          </FormField>
          <FormField label="Kepala Keluarga">
            <input name="kepalaKeluarga" value={form.kepalaKeluarga} onChange={handleChange} className="input-base" />
          </FormField>
          <FormField label="Pasangan">
            <input name="pasangan" value={form.pasangan} onChange={handleChange} className="input-base" />
          </FormField>
          <FormField label="Tanggal Pernikahan">
            <input type="date" name="tanggalPernikahan" value={form.tanggalPernikahan} onChange={handleChange} className="input-base" />
          </FormField>
          <FormField label="Status Keluarga">
            <select name="statusKeluarga" value={form.statusKeluarga} onChange={handleChange} className="input-base">
              <option>Aktif</option>
              <option>Perlu Verifikasi</option>
            </select>
          </FormField>
          <FormField label="Alamat" className="md:col-span-2">
            <textarea name="alamat" value={form.alamat} onChange={handleChange} rows="4" className="input-base" />
          </FormField>
          <div className="md:col-span-2">
            <button type="submit" className="brand-button-primary inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition sm:w-auto">
              Simpan Keluarga
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
