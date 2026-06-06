import {
  aboutTimeline,
  aboutValues,
  churchInfo,
  contactChannels,
  galleryAlbums,
  ministryPillars,
  publicStats,
  sectorProfiles,
  serviceAreas,
  worshipScheduleGroups,
} from "../data/publicContentData";

export const PUBLIC_CONTENT_STORAGE_KEYS = {
  home: "amin-cms-home",
  about: "amin-cms-about",
  fixedSchedules: "amin-cms-fixed-schedules",
  schedules: "amin-cms-schedules-events",
  gallery: "amin-cms-gallery",
  contacts: "amin-cms-contacts",
};

export const homeContentSeed = {
  heroEyebrow: "Selamat Datang",
  heroTitle: churchInfo.name,
  heroSubtitle: churchInfo.tagline,
  heroDescription: `"${churchInfo.scripture}" (${churchInfo.scriptureRef})`,
  primaryCtaLabel: "Lihat Jadwal Ibadah",
  primaryCtaTo: "/jadwal-ibadah",
  secondaryCtaLabel: "Mengenal Gereja",
  secondaryCtaTo: "/tentang-kami",
  welcomeTitle: "Gereja yang bertumbuh bersama jemaat",
  welcomeDescription:
    "Pelayanan gereja dibangun untuk menolong jemaat beribadah, bertumbuh, melayani, dan saling memperhatikan.",
  status: "Aktif",
};

export const aboutContentSeed = {
  pageEyebrow: "Tentang Kami",
  title: churchInfo.name,
  summary:
    "Gereja AMIN Jemaat Tangerang Raya hadir untuk membangun jemaat yang tangguh dalam iman, mandiri dalam pelayanan, dan peduli terhadap sesama.",
  historyTitle: "Ringkasan Sejarah",
  historyBody:
    `Gereja AMIN Jemaat Tangerang Raya berdiri pada ${churchInfo.founded} dan tercatat sebagai anggota ${churchInfo.synod} dengan Nomor Anggota ${churchInfo.memberNumber}. Jemaat ini hadir untuk membangun ibadah, pembinaan rohani, persekutuan, dan pelayanan kasih secara berkelanjutan.`,
  contactTitle: "Kontak dan Lokasi",
  contactBody: `${churchInfo.address}. Telepon: ${churchInfo.phone}. Email: ${churchInfo.email}.`,
  values: aboutValues,
  timeline: aboutTimeline,
  sectors: sectorProfiles,
  status: "Aktif",
};

export const scheduleStaffRoles = [
  "Khotbah",
  "Liturgos",
  "Penyaji Firman dan Doa",
  "Koordinator",
  "Pelayan Huria",
  "Kolektan",
  "Organis",
  "Songleader",
  "Infokus",
];

export const fixedScheduleItemsSeed = worshipScheduleGroups.flatMap((group, groupIndex) =>
  group.items.map((item, itemIndex) => ({
    id: `fixed-${toSimpleSlug(group.category)}-${itemIndex + 1}`,
    category: group.category,
    title: item.title,
    time: item.time,
    location: item.location,
    notes: item.notes,
    description: group.description,
    status: "Aktif",
    sortOrder: groupIndex * 10 + itemIndex + 1,
  }))
);

export const scheduleItemsSeed = [
  {
    id: "schedule-2026-06-07-0600",
    eventDate: "2026-06-07",
    time: "06:00 WIB",
    title: "Kebaktian Pagi",
    category: "Ibadah Minggu",
    theme: "Bertumbuh dalam Kasih Kristus",
    location: churchInfo.name,
    notes: "Jemaat hadir 15 menit sebelum ibadah dimulai.",
    description: "Sesi ibadah pagi dengan susunan petugas pelayanan yang sudah ditetapkan.",
    status: "Aktif",
    sortOrder: 1,
    assignments: [
      { id: "staff-0600-1", role: "Khotbah", name: "Pdt. Yusman Hulu", sortOrder: 1 },
      { id: "staff-0600-2", role: "Liturgos", name: "SNK. Mareti Waruwu", sortOrder: 2 },
      { id: "staff-0600-3", role: "Koordinator", name: "SNK. Arifman Jaya Hura, S.Ak.", sortOrder: 3 },
      { id: "staff-0600-4", role: "Kolektan", name: "Sektor Nazaret", sortOrder: 4 },
      { id: "staff-0600-5", role: "Organis", name: "Tim Musik Gereja", sortOrder: 5 },
      { id: "staff-0600-6", role: "Songleader", name: "Tim Pujian", sortOrder: 6 },
      { id: "staff-0600-7", role: "Infokus", name: "Tim Multimedia", sortOrder: 7 },
    ],
  },
  {
    id: "schedule-2026-06-07-0900",
    eventDate: "2026-06-07",
    time: "09:00 WIB",
    title: "Kebaktian Siang",
    category: "Ibadah Minggu",
    theme: "Setia Melayani dalam Persekutuan",
    location: churchInfo.name,
    notes: "Ibadah utama untuk jemaat dan pengunjung.",
    description: "Sesi ibadah siang dengan petugas pelayanan lintas sektor.",
    status: "Aktif",
    sortOrder: 2,
    assignments: [
      { id: "staff-0900-1", role: "Khotbah", name: "Pdt. Yusman Hulu", sortOrder: 1 },
      { id: "staff-0900-2", role: "Liturgos", name: "SNK. Kecitaan Harefa, S.Kom., M.Kom", sortOrder: 2 },
      { id: "staff-0900-3", role: "Penyaji Firman dan Doa", name: "SNK. Gregorius F. Riski Gulo", sortOrder: 3 },
      { id: "staff-0900-4", role: "Pelayan Huria", name: "Majelis Jemaat", sortOrder: 4 },
      { id: "staff-0900-5", role: "Kolektan", name: "Sektor Betlehem", sortOrder: 5 },
      { id: "staff-0900-6", role: "Organis", name: "Tim Musik Gereja", sortOrder: 6 },
      { id: "staff-0900-7", role: "Songleader", name: "Komisi Ibadah & Musik", sortOrder: 7 },
      { id: "staff-0900-8", role: "Infokus", name: "Tim Multimedia", sortOrder: 8 },
    ],
  },
  {
    id: "schedule-2026-06-07-1100",
    eventDate: "2026-06-07",
    time: "11:00 WIB",
    title: "Kebaktian Sore",
    category: "Ibadah Minggu",
    theme: "Dikuatkan untuk Menjadi Berkat",
    location: churchInfo.name,
    notes: "Disiapkan untuk jemaat yang mengikuti sesi ibadah akhir.",
    description: "Sesi ibadah sore dengan format pelayanan yang lebih ringkas.",
    status: "Aktif",
    sortOrder: 3,
    assignments: [
      { id: "staff-1100-1", role: "Khotbah", name: "Pdt. Yusman Hulu", sortOrder: 1 },
      { id: "staff-1100-2", role: "Liturgos", name: "SNK. Milika Daeli", sortOrder: 2 },
      { id: "staff-1100-3", role: "Koordinator", name: "SNK. Estomi Laia, S.Kom., M.M.", sortOrder: 3 },
      { id: "staff-1100-4", role: "Kolektan", name: "Sektor Galilea", sortOrder: 4 },
      { id: "staff-1100-5", role: "Organis", name: "Tim Musik Gereja", sortOrder: 5 },
      { id: "staff-1100-6", role: "Songleader", name: "Tim Pujian", sortOrder: 6 },
      { id: "staff-1100-7", role: "Infokus", name: "Tim Multimedia", sortOrder: 7 },
    ],
  },
  {
    id: "schedule-2026-06-14-1000",
    eventDate: "2026-06-14",
    time: "10:00 WIB",
    title: "Ibadah Minggu dan Perjamuan Kasih",
    category: "Ibadah Minggu",
    theme: "Persekutuan yang Saling Membangun",
    location: churchInfo.name,
    notes: "Dilanjutkan dengan perjamuan kasih jemaat.",
    description: "Ibadah umum minggu berikutnya dengan agenda persekutuan jemaat.",
    status: "Aktif",
    sortOrder: 4,
    assignments: [
      { id: "staff-1406-1", role: "Khotbah", name: "Pdt. Tamu", sortOrder: 1 },
      { id: "staff-1406-2", role: "Liturgos", name: "SNK. Sisudin Waruwu", sortOrder: 2 },
      { id: "staff-1406-3", role: "Koordinator", name: "BPH Majelis", sortOrder: 3 },
      { id: "staff-1406-4", role: "Kolektan", name: "Sektor Kana", sortOrder: 4 },
      { id: "staff-1406-5", role: "Songleader", name: "Komisi Ibadah & Musik", sortOrder: 5 },
    ],
  },
];

export const galleryItemsSeed = galleryAlbums.map((album, index) => ({
  ...album,
  status: "Aktif",
  sortOrder: index + 1,
}));

export const contactItemsSeed = contactChannels.map((item, index) => ({
  id: `contact-${index + 1}`,
  ...item,
  status: "Aktif",
  sortOrder: index + 1,
}));

export function listActiveItems(items = []) {
  return items
    .filter((item) => item.status !== "Draft" && item.status !== "Arsip")
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
}

export function normalizeFixedScheduleItem(item = {}) {
  return {
    id: item.id || createRecordId("fixed-schedule"),
    category: item.category || "Ibadah Utama",
    title: item.title || "",
    time: item.time || "",
    location: item.location || churchInfo.name,
    notes: item.notes || "",
    description: item.description || "",
    status: item.status || "Draft",
    sortOrder: Number(item.sortOrder) || 99,
  };
}

export function listFixedSchedules(items = []) {
  return items
    .map(normalizeFixedScheduleItem)
    .sort((a, b) => {
      const categoryCompare = (a.category || "").localeCompare(b.category || "");
      if (categoryCompare !== 0) return categoryCompare;
      return (a.sortOrder || 0) - (b.sortOrder || 0);
    });
}

export function listActiveFixedSchedules(items = []) {
  return listFixedSchedules(items).filter((item) => item.status !== "Draft" && item.status !== "Arsip");
}

export function groupFixedSchedulesByCategory(items = []) {
  return listActiveFixedSchedules(items).reduce((groups, item) => {
    const existingGroup = groups.find((group) => group.category === item.category);

    if (existingGroup) {
      existingGroup.items.push(item);
      return groups;
    }

    groups.push({
      category: item.category,
      description: item.description || "Jadwal ibadah rutin Gereja AMIN Jemaat Tangerang Raya.",
      items: [item],
    });
    return groups;
  }, []);
}

export function normalizeScheduleItem(item = {}) {
  return {
    id: item.id || createRecordId("schedule"),
    eventDate: item.eventDate || item.date || "",
    time: item.time || "",
    title: item.title || "",
    category: item.category || "Ibadah Minggu",
    theme: item.theme || "",
    location: item.location || churchInfo.name,
    notes: item.notes || "",
    description: item.description || "",
    status: item.status || "Draft",
    sortOrder: Number(item.sortOrder) || 99,
    assignments: normalizeScheduleAssignments(item.assignments),
  };
}

export function normalizeScheduleAssignments(assignments = []) {
  return (assignments || [])
    .map((item, index) => ({
      id: item.id || createRecordId(`staff-${index + 1}`),
      role: item.role || "",
      name: item.name || "",
      sortOrder: Number(item.sortOrder) || index + 1,
    }))
    .filter((item) => item.role || item.name)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
}

export function listScheduleEvents(items = []) {
  return items
    .map(normalizeScheduleItem)
    .sort((a, b) => {
      const dateCompare = (a.eventDate || "").localeCompare(b.eventDate || "");
      if (dateCompare !== 0) return dateCompare;
      const timeCompare = (a.time || "").localeCompare(b.time || "");
      if (timeCompare !== 0) return timeCompare;
      return (a.sortOrder || 0) - (b.sortOrder || 0);
    });
}

export function listActiveScheduleEvents(items = []) {
  return listScheduleEvents(items).filter((item) => item.status !== "Draft" && item.status !== "Arsip");
}

export function getUpcomingScheduleEvents(items = [], limit = 3) {
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = listActiveScheduleEvents(items).filter((item) => !item.eventDate || item.eventDate >= today);
  const source = upcoming.length > 0 ? upcoming : listActiveScheduleEvents(items);

  return source.slice(0, limit);
}

export function groupSchedulesByDate(items = []) {
  return listActiveScheduleEvents(items).reduce((groups, item) => {
    const groupKey = item.eventDate || "Tanggal belum ditentukan";
    const existingGroup = groups.find((group) => group.date === groupKey);

    if (existingGroup) {
      existingGroup.items.push(item);
      return groups;
    }

    groups.push({
      date: groupKey,
      label: formatScheduleDate(item.eventDate),
      items: [item],
    });
    return groups;
  }, []);
}

export function groupSchedulesByCategory(items = []) {
  return listActiveScheduleEvents(items).reduce((groups, item) => {
    const existingGroup = groups.find((group) => group.category === item.category);

    if (existingGroup) {
      existingGroup.items.push(item);
      return groups;
    }

    groups.push({
      category: item.category,
      description: item.description || "Jadwal pelayanan gereja.",
      items: [item],
    });
    return groups;
  }, []);
}

export function findScheduleById(items = [], scheduleId) {
  return listScheduleEvents(items).find((item) => item.id === scheduleId);
}

export function formatScheduleDate(value) {
  if (!value) return "Tanggal belum ditentukan";

  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

export function formatScheduleDateShort(value) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

export function getPrimaryContact(items = contactItemsSeed, type) {
  return items.find((item) => item.type === type) || contactItemsSeed.find((item) => item.type === type);
}

export function createEmptySchedule() {
  return {
    id: "",
    eventDate: new Date().toISOString().slice(0, 10),
    time: "10:00 WIB",
    category: "Ibadah Minggu",
    title: "",
    theme: "",
    location: churchInfo.name,
    notes: "",
    description: "",
    status: "Draft",
    sortOrder: 99,
    assignments: scheduleStaffRoles.slice(0, 5).map((role, index) => ({
      id: createRecordId(`staff-${index + 1}`),
      role,
      name: "",
      sortOrder: index + 1,
    })),
  };
}

export function createEmptyFixedSchedule() {
  return {
    id: "",
    category: "Ibadah Utama",
    title: "",
    time: "Minggu, 10:00 - 12:00 WIB",
    location: churchInfo.name,
    notes: "",
    description: "Jadwal ibadah rutin gereja.",
    status: "Draft",
    sortOrder: 99,
  };
}

export function createEmptyScheduleAssignment(index = 0) {
  return {
    id: createRecordId("staff"),
    role: scheduleStaffRoles[index] || "",
    name: "",
    sortOrder: index + 1,
  };
}

export function createEmptyGalleryItem() {
  return {
    id: "",
    title: "",
    category: "Dokumentasi",
    date: "",
    description: "",
    count: 0,
    imageUrl: "",
    status: "Draft",
    sortOrder: 99,
  };
}

export function createEmptyContactItem() {
  return {
    id: "",
    type: "",
    value: "",
    href: "",
    status: "Aktif",
    sortOrder: 99,
  };
}

export function createRecordId(prefix) {
  return `${prefix}-${Date.now()}`;
}

function toSimpleSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export {
  churchInfo,
  ministryPillars,
  publicStats,
  serviceAreas,
};
