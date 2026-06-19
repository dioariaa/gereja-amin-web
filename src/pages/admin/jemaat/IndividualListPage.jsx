import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Search, Trash2, UserPlus, UserRoundCheck, UsersRound } from "lucide-react";
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
  deleteIndividualFromSupabase,
  formatBirthPlaceDate,
  genderInitial,
  getFamilyForIndividualFrom,
  getJemaatStatsFrom,
  getSectorOptionsFrom,
  saveIndividualToSupabase,
} from "../../../services/jemaatService";
import { isSupabaseConfigured } from "../../../lib/supabase";
import useJemaatData from "../../../hooks/useJemaatData";

const emptyIndividualForm = {
  id: "",
  noInduk: "",
  namaLengkap: "",
  namaPanggilan: "",
  jenisKelamin: "Laki-laki",
  tempatLahir: "",
  tanggalLahir: "",
  pekerjaan: "",
  nomorHp: "",
  statusPernikahan: "Belum",
  baptis: "Sudah",
  sidi: "Sudah",
  statusJemaat: "Aktif",
};

export default function IndividualListPage() {
  const { user } = useAuth();
  const canManage = canManageJemaat(user?.role);
  const {
    error: dataError,
    families: localFamilies,
    individuals: localIndividuals,
    loading: dataLoading,
    setIndividuals: setLocalIndividuals,
  } = useJemaatData();
  const stats = getJemaatStatsFrom(localFamilies, localIndividuals);
  const sectors = getSectorOptionsFrom(localFamilies);
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("Semua");
  const [status, setStatus] = useState("Semua");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyIndividualForm);
  const [syncMessage, setSyncMessage] = useState("");

  const filteredIndividuals = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return localIndividuals.filter((individual) => {
      const family = getFamilyForIndividualFrom(localFamilies, individual);
      const sectorName = family?.sektor || "Mandiri";
      const matchesSearch = [
        individual.noInduk,
        individual.namaLengkap,
        individual.namaPanggilan,
        individual.nomorHp,
        individual.tempatLahir,
        individual.hubunganKeluarga,
        family?.noKk,
        family?.kepalaKeluarga,
        sectorName,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
      const matchesSector = sector === "Semua" || sectorName === sector;
      const matchesStatus =
        status === "Semua" || individual.statusJemaat === status;

      return matchesSearch && matchesSector && matchesStatus;
    });
  }, [localFamilies, localIndividuals, search, sector, status]);

  const openEdit = (individual) => {
    setForm({
      ...emptyIndividualForm,
      ...individual,
    });
    setModalOpen(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let nextIndividual = { ...form };

    if (isSupabaseConfigured) {
      try {
        nextIndividual = await saveIndividualToSupabase(form);
        setSyncMessage("Data individu berhasil disimpan.");
      } catch {
        setSyncMessage("Perubahan tersimpan pada sesi ini, tetapi sinkronisasi belum berhasil.");
      }
    }

    setLocalIndividuals((prev) =>
      prev.map((item) => (item.id === nextIndividual.id ? nextIndividual : item))
    );
    setModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (isSupabaseConfigured) {
      try {
        await deleteIndividualFromSupabase(id);
        setSyncMessage("Data individu berhasil dihapus.");
      } catch {
        setSyncMessage("Penghapusan belum tersinkron. Daftar pada sesi ini telah diperbarui.");
      }
    }
    setLocalIndividuals((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-7">
      <AdminPageHeader
        eyebrow="Modul Jemaat"
        title="Data Individu"
        description="Data individu mengikuti kolom Excel jemaat seperti No Induk, nama lengkap, panggilan, jenis kelamin, nomor HP, baptis, sidi, dan status jemaat."
        actions={
          canManage ? (
            <ActionButton to="/admin/jemaat/individu-mandiri" variant="primary" icon={UserPlus}>
              Tambah Individu
            </ActionButton>
          ) : null
        }
      />

      <DataSourceNotice
        error={dataError}
        label="data individu"
        loading={dataLoading}
      />
      {syncMessage ? (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/25 dark:text-emerald-200">
          {syncMessage}
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Total Individu" value={stats.individualCount} description="Semua data individu jemaat." icon={UsersRound} />
        <SummaryCard title="Individu Aktif" value={stats.activeCount} description="Status jemaat aktif." icon={UserRoundCheck} tone="success" />
        <SummaryCard title="Individu Mandiri" value={stats.independentCount} description="Tidak terhubung ke familyId." icon={UserPlus} />
        <SummaryCard
          title="Status Meninggal"
          value={localIndividuals.filter((item) => item.statusJemaat === "Meninggal").length}
          description="Dicatat sebagai status individu."
          icon={UsersRound}
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
              placeholder="Cari no induk, nama, keluarga, nomor HP"
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
            <option>Mandiri</option>
          </select>
        </FormField>

        <FormField label="Status Jemaat">
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="input-base"
          >
            <option>Semua</option>
            <option>Aktif</option>
            <option>Meninggal</option>
          </select>
        </FormField>
      </FilterPanel>

      <DataTable eyebrow="Daftar Individu" title={`${filteredIndividuals.length} individu ditemukan`}>
        {filteredIndividuals.length > 0 ? (
          <table className="min-w-[980px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">No Induk</th>
                <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Nama</th>
                <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">JK</th>
                <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Tempat/Tanggal Lahir</th>
                <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Keluarga / Sektor</th>
                <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Baptis / Sidi</th>
                <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredIndividuals.map((individual) => {
                const family = getFamilyForIndividualFrom(localFamilies, individual);

                return (
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
                        {individual.namaPanggilan || "-"} | {individual.nomorHp || "-"}
                      </p>
                    </td>
                    <td className="px-3 py-4 text-slate-700 dark:text-slate-200">
                      {genderInitial(individual.jenisKelamin)}
                    </td>
                    <td className="px-3 py-4 text-slate-700 dark:text-slate-200">
                      {formatBirthPlaceDate(individual)}
                    </td>
                    <td className="px-3 py-4">
                      {family ? (
                        <Link
                          to={`/admin/jemaat/keluarga/${family.id}`}
                          className="brand-link font-semibold underline-offset-4 hover:underline"
                        >
                          {family.noKk} / {family.sektor}
                        </Link>
                      ) : (
                        <StatusBadge value="Mandiri" />
                      )}
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {individual.hubunganKeluarga}
                      </p>
                    </td>
                    <td className="px-3 py-4 text-slate-700 dark:text-slate-200">
                      {individual.baptis} / {individual.sidi || "-"}
                    </td>
                    <td className="px-3 py-4">
                      <StatusBadge value={individual.statusJemaat} />
                    </td>
                    <td className="px-3 py-4">
                      {canManage ? (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="brand-button-secondary rounded-xl p-2 text-slate-700 transition dark:text-slate-200"
                            aria-label={`Edit ${individual.namaLengkap}`}
                            title="Edit"
                            onClick={() => openEdit(individual)}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            className="rounded-xl border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/30"
                            aria-label={`Hapus ${individual.namaLengkap}`}
                            title="Hapus"
                            onClick={() => handleDelete(individual.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <EmptyState
            title="Individu tidak ditemukan"
            description="Tidak ada individu yang sesuai dengan pencarian atau filter saat ini."
          />
        )}
      </DataTable>

      <AdminModal
        open={modalOpen}
        title="Edit Data Individu"
        description="Perbarui informasi individu sesuai data administrasi jemaat."
        onClose={() => setModalOpen(false)}
      >
        <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
          <FormField label="No Induk">
            <input name="noInduk" value={form.noInduk} onChange={handleChange} className="input-base" />
          </FormField>
          <FormField label="Status Jemaat">
            <select name="statusJemaat" value={form.statusJemaat} onChange={handleChange} className="input-base">
              <option>Aktif</option>
              <option>Meninggal</option>
            </select>
          </FormField>
          <FormField label="Nama Lengkap">
            <input name="namaLengkap" value={form.namaLengkap} onChange={handleChange} className="input-base" />
          </FormField>
          <FormField label="Nama Panggilan">
            <input name="namaPanggilan" value={form.namaPanggilan} onChange={handleChange} className="input-base" />
          </FormField>
          <FormField label="Jenis Kelamin">
            <select name="jenisKelamin" value={form.jenisKelamin} onChange={handleChange} className="input-base">
              <option>Laki-laki</option>
              <option>Perempuan</option>
            </select>
          </FormField>
          <FormField label="Status Pernikahan">
            <select name="statusPernikahan" value={form.statusPernikahan} onChange={handleChange} className="input-base">
              <option>Belum</option>
              <option>Menikah</option>
              <option>Duda</option>
              <option>Janda</option>
            </select>
          </FormField>
          <FormField label="Tempat Lahir">
            <input name="tempatLahir" value={form.tempatLahir} onChange={handleChange} className="input-base" />
          </FormField>
          <FormField label="Tanggal Lahir">
            <input type="date" name="tanggalLahir" value={form.tanggalLahir} onChange={handleChange} className="input-base" />
          </FormField>
          <FormField label="Pekerjaan">
            <input name="pekerjaan" value={form.pekerjaan} onChange={handleChange} className="input-base" />
          </FormField>
          <FormField label="Nomor HP">
            <input name="nomorHp" value={form.nomorHp} onChange={handleChange} className="input-base" />
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
          <div className="md:col-span-2">
            <button type="submit" className="brand-button-primary inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition sm:w-auto">
              Simpan Individu
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
