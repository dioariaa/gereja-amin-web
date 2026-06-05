import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  Home,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  UserRound,
  UsersRound,
} from "lucide-react";
import ActionButton from "../../../components/admin/ActionButton";
import AdminModal from "../../../components/admin/AdminModal";
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
  createFamilyMember,
  deleteIndividualFromSupabase,
  findFamilyByIdFrom,
  formatBirthPlaceDate,
  formatDate,
  genderInitial,
  getFamilyMembersFrom,
  saveIndividualToSupabase,
} from "../../../services/jemaatService";
import { isSupabaseConfigured } from "../../../lib/supabase";
import useJemaatData from "../../../hooks/useJemaatData";

const emptyMemberForm = {
  id: "",
  noInduk: "",
  namaLengkap: "",
  namaPanggilan: "",
  jenisKelamin: "Laki-laki",
  tempatLahir: "",
  tanggalLahir: "",
  golDarah: "",
  pekerjaan: "",
  hubunganKeluarga: "Anak",
  nomorHp: "",
  statusPernikahan: "Belum",
  baptis: "Sudah",
  sidi: "Belum",
  statusJemaat: "Aktif",
};

export default function FamilyDetailPage() {
  const { familyId } = useParams();
  const { user } = useAuth();
  const canManage = canManageJemaat(user?.role);
  const {
    error: dataError,
    families: localFamilies,
    individuals: localIndividuals,
    loading: dataLoading,
    setIndividuals: setLocalIndividuals,
    source: dataSource,
  } = useJemaatData();
  const [modalOpen, setModalOpen] = useState(false);
  const [memberForm, setMemberForm] = useState(emptyMemberForm);
  const [syncMessage, setSyncMessage] = useState("");
  const family = findFamilyByIdFrom(localFamilies, familyId);

  if (!family) {
    return <Navigate to="/admin/jemaat/keluarga" replace />;
  }

  const members = getFamilyMembersFrom(localIndividuals, family.id);
  const spouse = members.find((member) => member.hubunganKeluarga.includes("Istri"));
  const children = members.filter((member) => member.hubunganKeluarga === "Anak");
  const head = members.find((member) => member.noInduk === family.noKk) || members[0];

  const openCreateMember = () => {
    setMemberForm({
      ...emptyMemberForm,
      noInduk: `${family.noKk}.${members.length + 1}`,
    });
    setModalOpen(true);
  };

  const openEditMember = (member) => {
    setMemberForm({ ...emptyMemberForm, ...member });
    setModalOpen(true);
  };

  const handleMemberChange = (event) => {
    const { name, value } = event.target;
    setMemberForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveMember = async (event) => {
    event.preventDefault();
    if (!memberForm.namaLengkap.trim()) return;

    let nextMember = createFamilyMember(family, memberForm);

    if (isSupabaseConfigured) {
      try {
        nextMember = await saveIndividualToSupabase({
          ...nextMember,
          id: memberForm.id,
        });
        setSyncMessage("Anggota keluarga tersimpan ke Supabase.");
      } catch (saveError) {
        setSyncMessage(
          `${saveError.message || "Supabase belum menerima anggota."} Perubahan disimpan lokal untuk demo.`
        );
      }
    }

    setLocalIndividuals((prev) => {
      const exists = prev.some((item) => item.id === nextMember.id);
      return exists
        ? prev.map((item) => (item.id === nextMember.id ? nextMember : item))
        : [nextMember, ...prev];
    });
    setModalOpen(false);
    setMemberForm(emptyMemberForm);
  };

  const deleteMember = async (memberId) => {
    if (isSupabaseConfigured) {
      try {
        await deleteIndividualFromSupabase(memberId);
        setSyncMessage("Anggota keluarga dihapus dari Supabase.");
      } catch (deleteError) {
        setSyncMessage(
          `${deleteError.message || "Supabase belum menerima hapus anggota."} Data hanya dihapus dari tampilan lokal.`
        );
      }
    }
    setLocalIndividuals((prev) => prev.filter((item) => item.id !== memberId));
  };

  return (
    <div className="space-y-7">
      <AdminPageHeader
        eyebrow={`No KK ${family.noKk}`}
        title={family.kepalaKeluarga}
        description="Ringkasan data keluarga, pasangan, alamat, sektor, dan anggota keluarga yang dipakai untuk laporan KKJ."
        meta={
          <>
            <StatusBadge value={family.statusKeluarga} />
            <StatusBadge value={family.sektor} />
            <StatusBadge value={dataSource === "supabase" ? "Supabase" : "LocalStorage"} />
          </>
        }
        actions={
          <>
            <ActionButton to="/admin/jemaat/keluarga" icon={ArrowLeft}>
              Kembali
            </ActionButton>
            {canManage ? (
              <ActionButton variant="primary" icon={Plus} onClick={openCreateMember}>
                Tambah Anggota
              </ActionButton>
            ) : null}
            <ActionButton
              to={`/admin/jemaat/keluarga/${family.id}/kkj`}
              icon={FileText}
            >
              Preview KKJ
            </ActionButton>
          </>
        }
      />

      <DataSourceNotice
        error={dataError}
        label="detail keluarga"
        loading={dataLoading}
        source={dataSource}
      />
      {syncMessage ? (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/25 dark:text-emerald-200">
          {syncMessage}
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="No KK" value={family.noKk} description="Nomor keluarga jemaat." icon={Home} />
        <SummaryCard title="Sektor" value={family.sektor} description="Sektor mengikuti data keluarga." icon={UsersRound} />
        <SummaryCard title="Anggota" value={`${members.length} orang`} description={`${children.length} anak tercatat dalam keluarga.`} icon={UsersRound} tone="success" />
        <SummaryCard title="Tanggal Nikah" value={formatDate(family.tanggalPernikahan)} description="Dipakai pada format KKJ." icon={CalendarDays} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="brand-card p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                Identitas Keluarga
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
                Data utama KKJ
              </h2>
            </div>
            <StatusBadge value={family.statusKeluarga} />
          </div>

          <div className="mt-6 space-y-5">
            <DetailItem icon={UserRound} label="Kepala Keluarga" value={head?.namaLengkap || family.kepalaKeluarga} />
            <DetailItem icon={UserRound} label="Pasangan" value={spouse?.namaLengkap || family.pasangan || "-"} />
            <DetailItem icon={CalendarDays} label="Tanggal Pernikahan" value={formatDate(family.tanggalPernikahan)} />
            <DetailItem icon={MapPin} label="Alamat" value={family.alamat} />
          </div>

          {canManage ? (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <ActionButton to="/admin/jemaat/keluarga" variant="primary" icon={Pencil}>
                Edit Data KK
              </ActionButton>
              <ActionButton icon={Plus} onClick={openCreateMember}>
                Tambah Anggota
              </ActionButton>
            </div>
          ) : null}
        </div>

        <DataTable eyebrow="Anggota Keluarga" title="Data anggota untuk KKJ">
          {members.length > 0 ? (
            <table className="min-w-[980px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">No Induk</th>
                  <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Nama</th>
                  <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">JK</th>
                  <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Tempat/Tanggal Lahir</th>
                  <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Hubungan</th>
                  <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Baptis / Sidi</th>
                  <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                  <th className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id} className="brand-table-row border-b border-slate-100 transition dark:border-slate-800">
                    <td className="px-3 py-4 font-semibold text-slate-950 dark:text-white">{member.noInduk}</td>
                    <td className="px-3 py-4">
                      <p className="font-semibold text-slate-900 dark:text-white">{member.namaLengkap}</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{member.pekerjaan || "-"}</p>
                    </td>
                    <td className="px-3 py-4 text-slate-700 dark:text-slate-200">{genderInitial(member.jenisKelamin)}</td>
                    <td className="px-3 py-4 text-slate-700 dark:text-slate-200">{formatBirthPlaceDate(member)}</td>
                    <td className="px-3 py-4"><StatusBadge value={member.hubunganKeluarga} /></td>
                    <td className="px-3 py-4 text-slate-700 dark:text-slate-200">{member.baptis} / {member.sidi || "-"}</td>
                    <td className="px-3 py-4"><StatusBadge value={member.statusJemaat} /></td>
                    <td className="px-3 py-4">
                      {canManage ? (
                        <div className="flex gap-2">
                          <button type="button" onClick={() => openEditMember(member)} className="brand-button-secondary rounded-xl p-2" aria-label={`Edit ${member.namaLengkap}`} title="Edit">
                            <Pencil size={16} />
                          </button>
                          <button type="button" onClick={() => deleteMember(member.id)} className="rounded-xl border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/30" aria-label={`Hapus ${member.namaLengkap}`} title="Hapus">
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
              title="Belum ada anggota keluarga"
              description="Tambahkan anggota agar preview KKJ keluarga ini lengkap."
              action={
                canManage ? (
                  <ActionButton variant="primary" icon={Plus} onClick={openCreateMember}>
                    Tambah Anggota
                  </ActionButton>
                ) : null
              }
            />
          )}
        </DataTable>
      </section>

      <AdminModal
        open={modalOpen}
        title={memberForm.id ? "Edit Anggota Keluarga" : "Tambah Anggota Keluarga"}
        description="Anggota tersimpan di localStorage dan langsung muncul di detail keluarga, Data Individu, dan preview KKJ."
        onClose={() => setModalOpen(false)}
      >
        <form className="grid gap-5 md:grid-cols-2" onSubmit={saveMember}>
          <FormField label="No Induk">
            <input name="noInduk" value={memberForm.noInduk} onChange={handleMemberChange} className="input-base" />
          </FormField>
          <FormField label="Hubungan Keluarga">
            <select name="hubunganKeluarga" value={memberForm.hubunganKeluarga} onChange={handleMemberChange} className="input-base">
              <option>Suami</option>
              <option>Istri</option>
              <option>Anak</option>
              <option>Orangtua</option>
              <option>Saudara</option>
              <option>Anggota Keluarga Lain</option>
            </select>
          </FormField>
          <FormField label="Nama Lengkap">
            <input name="namaLengkap" value={memberForm.namaLengkap} onChange={handleMemberChange} className="input-base" />
          </FormField>
          <FormField label="Nama Panggilan">
            <input name="namaPanggilan" value={memberForm.namaPanggilan} onChange={handleMemberChange} className="input-base" />
          </FormField>
          <FormField label="Jenis Kelamin">
            <select name="jenisKelamin" value={memberForm.jenisKelamin} onChange={handleMemberChange} className="input-base">
              <option>Laki-laki</option>
              <option>Perempuan</option>
            </select>
          </FormField>
          <FormField label="Golongan Darah">
            <input name="golDarah" value={memberForm.golDarah} onChange={handleMemberChange} className="input-base" placeholder="A / B / AB / O" />
          </FormField>
          <FormField label="Tempat Lahir">
            <input name="tempatLahir" value={memberForm.tempatLahir} onChange={handleMemberChange} className="input-base" />
          </FormField>
          <FormField label="Tanggal Lahir">
            <input type="date" name="tanggalLahir" value={memberForm.tanggalLahir} onChange={handleMemberChange} className="input-base" />
          </FormField>
          <FormField label="Pekerjaan">
            <input name="pekerjaan" value={memberForm.pekerjaan} onChange={handleMemberChange} className="input-base" />
          </FormField>
          <FormField label="Nomor HP">
            <input name="nomorHp" value={memberForm.nomorHp} onChange={handleMemberChange} className="input-base" />
          </FormField>
          <FormField label="Status Pernikahan">
            <select name="statusPernikahan" value={memberForm.statusPernikahan} onChange={handleMemberChange} className="input-base">
              <option>Belum</option>
              <option>Menikah</option>
              <option>Duda</option>
              <option>Janda</option>
            </select>
          </FormField>
          <FormField label="Status Jemaat">
            <select name="statusJemaat" value={memberForm.statusJemaat} onChange={handleMemberChange} className="input-base">
              <option>Aktif</option>
              <option>Meninggal</option>
            </select>
          </FormField>
          <FormField label="Baptis">
            <select name="baptis" value={memberForm.baptis} onChange={handleMemberChange} className="input-base">
              <option>Sudah</option>
              <option>Belum</option>
            </select>
          </FormField>
          <FormField label="Sidi / Krisma">
            <select name="sidi" value={memberForm.sidi} onChange={handleMemberChange} className="input-base">
              <option>Sudah</option>
              <option>Belum</option>
            </select>
          </FormField>
          <div className="md:col-span-2">
            <button type="submit" className="brand-button-primary inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition sm:w-auto">
              Simpan Anggota
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-200">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <p className="mt-1 text-sm font-semibold leading-6 text-slate-950 dark:text-white">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}
