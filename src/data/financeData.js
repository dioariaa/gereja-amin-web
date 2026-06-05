export const FINANCE_STORAGE_KEY = "amin-cash-transactions";

export const cashAccounts = [
  "Kas Umum",
  "Kas Pembangunan",
  "Kas Diakonia",
  "Kas Pemuda",
];

export const transactionStatuses = ["Draft", "Pending", "Selesai"];

export const incomeCategories = [
  "Kolekte Persembahan kebaktian umum",
  "Kolekte Ibadah Keluarga / Sektor",
  "Kolekte Untuk Pelayanan Kasih",
  "Persembahan Syukur Jemaat",
  "Kolekte Untuk Pembangunan",
  "Kolekte Ibadah Komisi Usia Indah",
  "Kolekte Ibadah Komisi Pelayanan Anak",
  "Kolekte Ibadah Komisi Pemuda",
  "Kolekte Ibadah Komisi Pelayanan Perempuan",
  "Kolekte Ibadah Komisi Pelayanan Bapak",
  "Jumlah Persembahan Transistoris Untuk Sinode",
  "Penerimaan Dukungan Dana",
];

export const expenseCategories = [
  "Honorarium Pendeta / Pengkhotbah",
  "Tunjangan Kesejahteraan Pendeta / Pengkhotbah",
  "Biaya Rapat",
  "Perjamuan Kasih",
  "Subsidi Pelayanan Komisi Anak",
  "PHBG",
  "Perjamuan Kudus",
  "Dana diakonia / dll",
  "Operasional Sekretariat & Bendahara",
  "Rumah Tangga Gereja",
  "Pembayaran ke Sinode",
];

export const openingBalance = 10000000;

export const financeTransactionsSeed = [
  {
    id: "trx-income-001",
    date: "2026-04-06",
    type: "Masuk",
    category: "Kolekte Persembahan kebaktian umum",
    account: "Kas Umum",
    actor: "Ibadah Umum",
    description: "Persembahan ibadah minggu",
    proof: "KM-001",
    amount: 2500000,
    status: "Selesai",
  },
  {
    id: "trx-income-002",
    date: "2026-04-13",
    type: "Masuk",
    category: "Kolekte Ibadah Keluarga / Sektor",
    account: "Kas Umum",
    actor: "Sektor Nazaret",
    description: "Ibadah keluarga sektor Nazaret",
    proof: "KM-002",
    amount: 850000,
    status: "Selesai",
  },
  {
    id: "trx-income-003",
    date: "2026-04-20",
    type: "Masuk",
    category: "Kolekte Ibadah Komisi Pelayanan Anak",
    account: "Kas Umum",
    actor: "Komisi Pelayanan Anak",
    description: "Kolekte ibadah komisi pelayanan anak",
    proof: "KM-003",
    amount: 350000,
    status: "Selesai",
  },
  {
    id: "trx-income-004",
    date: "2026-04-20",
    type: "Masuk",
    category: "Kolekte Ibadah Komisi Pemuda",
    account: "Kas Pemuda",
    actor: "Komisi Pemuda & Remaja",
    description: "Kolekte ibadah komisi pemuda",
    proof: "KM-004",
    amount: 425000,
    status: "Selesai",
  },
  {
    id: "trx-income-005",
    date: "2026-04-27",
    type: "Masuk",
    category: "Penerimaan Dukungan Dana",
    account: "Kas Pembangunan",
    actor: "Dukungan jemaat",
    description: "Penerimaan dukungan dana pelayanan",
    proof: "KM-005",
    amount: 1200000,
    status: "Selesai",
  },
  {
    id: "trx-expense-001",
    date: "2026-04-07",
    type: "Keluar",
    category: "Honorarium Pendeta / Pengkhotbah",
    account: "Kas Umum",
    actor: "Pengkhotbah",
    description: "Honor pengkhotbah ibadah umum",
    proof: "KK-001",
    amount: 750000,
    status: "Selesai",
  },
  {
    id: "trx-expense-002",
    date: "2026-04-12",
    type: "Keluar",
    category: "Operasional Sekretariat & Bendahara",
    account: "Kas Umum",
    actor: "Sekretariat",
    description: "Operasional sekretariat dan bendahara",
    proof: "KK-002",
    amount: 450000,
    status: "Selesai",
  },
  {
    id: "trx-expense-003",
    date: "2026-04-18",
    type: "Keluar",
    category: "Subsidi Pelayanan Komisi Anak",
    account: "Kas Diakonia",
    actor: "Komisi Pelayanan Anak",
    description: "Subsidi pelayanan komisi anak",
    proof: "KK-003",
    amount: 400000,
    status: "Pending",
  },
  {
    id: "trx-expense-004",
    date: "2026-04-29",
    type: "Keluar",
    category: "Pembayaran ke Sinode",
    account: "Kas Umum",
    actor: "Sinode",
    description: "Setoran pembayaran ke sinode",
    proof: "KK-004",
    amount: 900000,
    status: "Selesai",
  },
];

export function normalizeFinanceTransaction(transaction) {
  const rawAmount = transaction.amountNumber ?? transaction.amount ?? 0;
  const amount = typeof rawAmount === "number"
    ? rawAmount
    : Number(String(rawAmount).replace(/[^\d-]/g, "")) || 0;

  return {
    ...transaction,
    date: transaction.date || transaction.dateIso || "",
    actor: transaction.actor || transaction.source || transaction.recipient || "-",
    proof: transaction.proof || "-",
    amount,
  };
}

export function getFinanceSummary(transactions) {
  const normalized = transactions.map(normalizeFinanceTransaction);
  const totalIncome = normalized
    .filter((item) => item.type === "Masuk")
    .reduce((total, item) => total + item.amount, 0);
  const totalExpense = normalized
    .filter((item) => item.type === "Keluar")
    .reduce((total, item) => total + item.amount, 0);

  return {
    totalIncome,
    totalExpense,
    balance: openingBalance + totalIncome - totalExpense,
    count: normalized.length,
  };
}

export function createFinanceTransactionId(type) {
  const prefix = type === "Masuk" ? "trx-income" : "trx-expense";
  return `${prefix}-${Date.now()}`;
}

export function formatFinanceDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

export function formatShortFinanceDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
  }).format(new Date(`${value}T00:00:00`));
}

export function formatNumber(value) {
  return new Intl.NumberFormat("id-ID").format(value || 0);
}

export function formatCurrency(value) {
  return `Rp ${formatNumber(value)}`;
}

