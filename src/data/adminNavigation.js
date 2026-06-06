import {
  ArrowDownCircle,
  ArrowUpCircle,
  CalendarDays,
  FileBarChart2,
  FileText,
  Home,
  Images,
  Info,
  LayoutDashboard,
  Mail,
  Settings,
  UsersRound,
  Wallet,
} from "lucide-react";
import { accessGroups } from "./adminAccess";

export const adminNavigationGroups = [
  {
    label: "Utama",
    items: [
      {
        to: "/admin/dashboard",
        label: "Dashboard",
        description: "Ringkasan role",
        icon: LayoutDashboard,
        roles: accessGroups.dashboard,
        end: true,
      },
    ],
  },
  {
    label: "Keuangan",
    items: [
      {
        to: "/admin/cashflow",
        label: "Cashflow",
        description: "Ringkasan transaksi",
        icon: Wallet,
        roles: accessGroups.finance,
      },
      {
        to: "/admin/income",
        label: "Kas Masuk",
        description: "Input penerimaan",
        icon: ArrowDownCircle,
        roles: accessGroups.finance,
      },
      {
        to: "/admin/expense",
        label: "Kas Keluar",
        description: "Input pengeluaran",
        icon: ArrowUpCircle,
        roles: accessGroups.finance,
      },
      {
        to: "/admin/reports",
        label: "Laporan Kas",
        description: "Tabelaris",
        icon: FileBarChart2,
        roles: accessGroups.finance,
      },
    ],
  },
  {
    label: "Jemaat",
    items: [
      {
        to: "/admin/jemaat/keluarga",
        label: "Data Keluarga",
        description: "KK dan sektor",
        icon: UsersRound,
        roles: accessGroups.jemaat,
      },
      {
        to: "/admin/jemaat/individu",
        label: "Data Individu",
        description: "Anggota jemaat",
        icon: UsersRound,
        roles: accessGroups.jemaat,
      },
      {
        to: "/admin/jemaat/individu-mandiri",
        label: "Individu Mandiri",
        description: "Tanpa familyId",
        icon: UsersRound,
        roles: accessGroups.jemaat,
      },
    ],
  },
  {
    label: "Konten",
    items: [
      {
        to: "/admin/articles",
        label: "Publikasi",
        description: "Warta & renungan",
        icon: FileText,
        roles: accessGroups.content,
      },
      {
        to: "/admin/content/home",
        label: "Beranda",
        description: "Hero & highlight",
        icon: Home,
        roles: accessGroups.content,
      },
      {
        to: "/admin/content/about",
        label: "Tentang Kami",
        description: "Profil gereja",
        icon: Info,
        roles: accessGroups.content,
      },
      {
        to: "/admin/content/commissions",
        label: "Komisi",
        description: "Pelayanan",
        icon: Settings,
        roles: accessGroups.content,
      },
      {
        to: "/admin/content/schedule",
        label: "Jadwal Ibadah",
        description: "Tetap & event",
        icon: CalendarDays,
        roles: accessGroups.content,
      },
      {
        to: "/admin/content/gallery",
        label: "Galeri",
        description: "Album & media",
        icon: Images,
        roles: accessGroups.content,
      },
      {
        to: "/admin/content/contact",
        label: "Kontak",
        description: "Info gereja",
        icon: Mail,
        roles: accessGroups.content,
      },
    ],
  },
];

export function getVisibleNavigationGroups(role) {
  return adminNavigationGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.roles.includes(role)),
    }))
    .filter((group) => group.items.length > 0);
}
