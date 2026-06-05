import {
  ArrowDownCircle,
  ArrowUpCircle,
  FileBarChart2,
  FileText,
  Globe2,
  LayoutDashboard,
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
        label: "Konten Website",
        description: "Public content",
        icon: Globe2,
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
