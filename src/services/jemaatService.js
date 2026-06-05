import {
  canManageJemaat,
  families,
  formatBirthPlaceDate,
  formatDate,
  genderInitial,
  getFamilyById,
  getFamilyForIndividual,
  getFamilyMembers,
  getIndependentIndividuals,
  getSectorOptions,
  individuals,
} from "../data/jemaatData";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

export const JEMAAT_FAMILIES_STORAGE_KEY = "amin-families";
export const JEMAAT_INDIVIDUALS_STORAGE_KEY = "amin-individuals";
export const JEMAAT_INDEPENDENT_STORAGE_KEY = "amin-independent-individuals";

export const familySeed = families;
export const individualSeed = individuals;

export {
  canManageJemaat,
  formatBirthPlaceDate,
  formatDate,
  genderInitial,
  getFamilyById,
  getFamilyForIndividual,
  getFamilyMembers,
  getIndependentIndividuals,
  getSectorOptions,
};

export function listFamilies(source = familySeed) {
  return source;
}

export function listIndividuals(source = individualSeed) {
  return source;
}

export function listIndependentIndividuals(source = individualSeed) {
  return source.filter((individual) => !individual.familyId);
}

export function getFamilyMembersFrom(individualSource, familyId) {
  return listIndividuals(individualSource).filter((individual) => individual.familyId === familyId);
}

export function findFamilyByIdFrom(familySource, familyId) {
  const normalizedLegacyNoKk = familyId?.replace(/^fam-/i, "").toUpperCase();
  return listFamilies(familySource).find(
    (family) =>
      family.id === familyId ||
      family.noKk === familyId ||
      family.noKk === normalizedLegacyNoKk
  );
}

export function getFamilyForIndividualFrom(familySource, individual) {
  return individual.familyId
    ? listFamilies(familySource).find((family) => family.id === individual.familyId)
    : null;
}

export function getJemaatStatsFrom(familySource = familySeed, individualSource = individualSeed) {
  const normalizedIndividuals = listIndividuals(individualSource);

  return {
    familyCount: listFamilies(familySource).length,
    individualCount: normalizedIndividuals.length,
    independentCount: normalizedIndividuals.filter((item) => !item.familyId).length,
    activeCount: normalizedIndividuals.filter((item) => item.statusJemaat === "Aktif").length,
    deceasedCount: normalizedIndividuals.filter((item) => item.statusJemaat === "Meninggal").length,
  };
}

export function getSectorOptionsFrom(familySource = familySeed) {
  return [...new Set(listFamilies(familySource).map((family) => family.sektor))].sort();
}

export function createFamilyMember(family, form) {
  return {
    id: form.id || `ind-local-${Date.now()}`,
    familyId: family.id,
    noInduk: form.noInduk || `${family.noKk}.${Date.now().toString().slice(-3)}`,
    namaLengkap: form.namaLengkap,
    namaPanggilan: form.namaPanggilan || "",
    jenisKelamin: form.jenisKelamin || "Laki-laki",
    tempatLahir: form.tempatLahir || "",
    tanggalLahir: form.tanggalLahir || "",
    golDarah: form.golDarah || "",
    pekerjaan: form.pekerjaan || "",
    hubunganKeluarga: form.hubunganKeluarga || "Anak",
    nomorHp: form.nomorHp || "",
    statusPernikahan: form.statusPernikahan || "Belum",
    baptis: form.baptis || "Sudah",
    sidi: form.sidi || "Belum",
    statusJemaat: form.statusJemaat || "Aktif",
  };
}

const FAMILY_SELECT = `
  id,
  no_kk,
  nama_kepala_keluarga,
  pasangan,
  marriage_date,
  address,
  status,
  sector:sectors(id, name)
`;

const INDIVIDUAL_SELECT = `
  id,
  family_id,
  no_induk,
  full_name,
  nick_name,
  gender,
  birth_place,
  birth_date,
  blood_type,
  occupation,
  family_relationship,
  phone,
  marital_status,
  baptism_status,
  sidi_status,
  member_status
`;

function assertSupabaseReady() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase belum dikonfigurasi.");
  }
}

export function mapFamilyFromSupabase(row) {
  return {
    id: row.id,
    noKk: row.no_kk,
    kepalaKeluarga: row.nama_kepala_keluarga,
    pasangan: row.pasangan || "",
    tanggalPernikahan: row.marriage_date || "",
    alamat: row.address || "",
    sektor: row.sector?.name || "Tanpa Sektor",
    sectorId: row.sector?.id || null,
    statusKeluarga: row.status || "Aktif",
  };
}

export function mapIndividualFromSupabase(row) {
  return {
    id: row.id,
    familyId: row.family_id || null,
    noInduk: row.no_induk,
    namaLengkap: row.full_name,
    namaPanggilan: row.nick_name || "",
    jenisKelamin: row.gender || "Laki-laki",
    tempatLahir: row.birth_place || "",
    tanggalLahir: row.birth_date || "",
    golDarah: row.blood_type || "",
    pekerjaan: row.occupation || "",
    hubunganKeluarga: row.family_relationship || (row.family_id ? "Anggota Keluarga" : "Individu Mandiri"),
    nomorHp: row.phone || "",
    statusPernikahan: row.marital_status || "Belum",
    baptis: row.baptism_status || "Belum",
    sidi: row.sidi_status || "Belum",
    statusJemaat: row.member_status || "Aktif",
  };
}

async function resolveSectorId(sectorName) {
  assertSupabaseReady();
  const normalizedName = sectorName || "Tanpa Sektor";
  const { data: existing, error: findError } = await supabase
    .from("sectors")
    .select("id")
    .eq("name", normalizedName)
    .maybeSingle();

  if (findError) throw findError;
  if (existing?.id) return existing.id;

  const { data: created, error: createError } = await supabase
    .from("sectors")
    .insert({ name: normalizedName })
    .select("id")
    .single();

  if (createError) throw createError;
  return created.id;
}

function familyPayloadFromForm(form, sectorId) {
  return {
    no_kk: form.noKk,
    nama_kepala_keluarga: form.kepalaKeluarga,
    pasangan: form.pasangan || null,
    marriage_date: form.tanggalPernikahan || null,
    address: form.alamat || null,
    sector_id: sectorId || null,
    status: form.statusKeluarga || "Aktif",
  };
}

function individualPayloadFromForm(form) {
  return {
    family_id: form.familyId || null,
    no_induk: form.noInduk,
    full_name: form.namaLengkap,
    nick_name: form.namaPanggilan || null,
    gender: form.jenisKelamin || "Laki-laki",
    birth_place: form.tempatLahir || null,
    birth_date: form.tanggalLahir || null,
    blood_type: form.golDarah || null,
    occupation: form.pekerjaan || null,
    family_relationship: form.hubunganKeluarga || (form.familyId ? "Anggota Keluarga" : "Individu Mandiri"),
    phone: form.nomorHp || null,
    marital_status: form.statusPernikahan || "Belum",
    baptism_status: form.baptis || "Belum",
    sidi_status: form.sidi || "Belum",
    member_status: form.statusJemaat || "Aktif",
  };
}

export async function listFamiliesFromSupabase() {
  assertSupabaseReady();
  const { data, error } = await supabase
    .from("families")
    .select(FAMILY_SELECT)
    .order("no_kk", { ascending: true });

  if (error) throw error;
  return (data || []).map(mapFamilyFromSupabase);
}

export async function listIndividualsFromSupabase() {
  assertSupabaseReady();
  const { data, error } = await supabase
    .from("individuals")
    .select(INDIVIDUAL_SELECT)
    .order("no_induk", { ascending: true });

  if (error) throw error;
  return (data || []).map(mapIndividualFromSupabase);
}

export async function listJemaatFromSupabase() {
  const [familiesData, individualsData] = await Promise.all([
    listFamiliesFromSupabase(),
    listIndividualsFromSupabase(),
  ]);

  return {
    families: familiesData,
    individuals: individualsData,
  };
}

export async function saveFamilyToSupabase(form) {
  assertSupabaseReady();
  const sectorId = await resolveSectorId(form.sektor);
  const payload = familyPayloadFromForm(form, sectorId);
  const query = form.id
    ? supabase.from("families").update(payload).eq("id", form.id)
    : supabase.from("families").insert(payload);
  const { data, error } = await query.select(FAMILY_SELECT).single();

  if (error) throw error;
  return mapFamilyFromSupabase(data);
}

export async function deleteFamilyFromSupabase(familyId) {
  assertSupabaseReady();
  const { error } = await supabase.from("families").delete().eq("id", familyId);
  if (error) throw error;
}

export async function saveIndividualToSupabase(form) {
  assertSupabaseReady();
  const payload = individualPayloadFromForm(form);
  const query = form.id
    ? supabase.from("individuals").update(payload).eq("id", form.id)
    : supabase.from("individuals").insert(payload);
  const { data, error } = await query.select(INDIVIDUAL_SELECT).single();

  if (error) throw error;
  return mapIndividualFromSupabase(data);
}

export async function deleteIndividualFromSupabase(individualId) {
  assertSupabaseReady();
  const { error } = await supabase.from("individuals").delete().eq("id", individualId);
  if (error) throw error;
}
