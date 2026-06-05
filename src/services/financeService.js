import {
  FINANCE_STORAGE_KEY,
  cashAccounts,
  createFinanceTransactionId,
  expenseCategories,
  financeTransactionsSeed,
  formatCurrency,
  formatFinanceDate,
  formatNumber,
  formatShortFinanceDate,
  getFinanceSummary,
  incomeCategories,
  normalizeFinanceTransaction,
  openingBalance,
  transactionStatuses,
} from "../data/financeData";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

export {
  FINANCE_STORAGE_KEY,
  cashAccounts,
  expenseCategories,
  financeTransactionsSeed,
  formatCurrency,
  formatFinanceDate,
  formatNumber,
  formatShortFinanceDate,
  getFinanceSummary,
  incomeCategories,
  openingBalance,
  transactionStatuses,
};

export function listFinanceTransactions(source = financeTransactionsSeed) {
  return source.map(normalizeFinanceTransaction);
}

export function getRecentFinanceTransactions(transactions, type, limit = 6) {
  return transactions
    .filter((item) => item.type === type)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}

export function filterFinanceTransactions(transactions, filters) {
  return transactions.filter((item) => {
    const matchesStart = !filters.startDate || item.date >= filters.startDate;
    const matchesEnd = !filters.endDate || item.date <= filters.endDate;
    const matchesType = filters.type === "Semua" || item.type === filters.type;
    const matchesAccount = filters.account === "Semua Akun" || item.account === filters.account;

    return matchesStart && matchesEnd && matchesType && matchesAccount;
  });
}

export function createFinanceTransaction(type, form, sequence = 1) {
  const isIncome = type === "Masuk";
  const fallbackActor = isIncome ? "Jemaat" : "Penerima";
  const proofPrefix = isIncome ? "KM" : "KK";

  return {
    id: createFinanceTransactionId(type),
    type,
    date: form.date,
    account: form.account,
    category: form.category,
    actor: form.actor || fallbackActor,
    amount: Number(form.amount),
    status: form.status,
    proof: form.proof || `${proofPrefix}-${String(sequence).padStart(3, "0")}`,
    description: form.description || form.category,
  };
}

const INCOME_SELECT = `
  id,
  transaction_date,
  description,
  receipt_number,
  source_name,
  amount,
  status,
  attachment_url,
  category:income_categories(id, name),
  account:cash_accounts(id, name)
`;

const EXPENSE_SELECT = `
  id,
  transaction_date,
  description,
  receipt_number,
  recipient_name,
  amount,
  status,
  attachment_url,
  category:expense_categories(id, name),
  account:cash_accounts(id, name)
`;

function assertSupabaseReady() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase belum dikonfigurasi.");
  }
}

function mapIncomeFromSupabase(row) {
  return normalizeFinanceTransaction({
    id: row.id,
    type: "Masuk",
    date: row.transaction_date,
    category: row.category?.name || "-",
    account: row.account?.name || "Kas Umum",
    actor: row.source_name || "-",
    description: row.description || row.category?.name || "-",
    proof: row.receipt_number || "-",
    amount: Number(row.amount) || 0,
    status: row.status || "Selesai",
    attachmentUrl: row.attachment_url || "",
  });
}

function mapExpenseFromSupabase(row) {
  return normalizeFinanceTransaction({
    id: row.id,
    type: "Keluar",
    date: row.transaction_date,
    category: row.category?.name || "-",
    account: row.account?.name || "Kas Umum",
    actor: row.recipient_name || "-",
    description: row.description || row.category?.name || "-",
    proof: row.receipt_number || "-",
    amount: Number(row.amount) || 0,
    status: row.status || "Selesai",
    attachmentUrl: row.attachment_url || "",
  });
}

async function resolveLookupId(table, name) {
  assertSupabaseReady();
  const normalizedName = name || "-";
  const { data, error } = await supabase
    .from(table)
    .select("id")
    .eq("name", normalizedName)
    .maybeSingle();

  if (error) throw error;
  if (data?.id) return data.id;

  const { data: created, error: createError } = await supabase
    .from(table)
    .insert({ name: normalizedName })
    .select("id")
    .single();

  if (createError) throw createError;
  return created.id;
}

async function resolveCashAccountId(name) {
  return resolveLookupId("cash_accounts", name || "Kas Umum");
}

function incomePayloadFromForm(form, categoryId, accountId) {
  return {
    transaction_date: form.date,
    description: form.description || form.category,
    receipt_number: form.proof || null,
    category_id: categoryId,
    account_id: accountId,
    source_name: form.actor || "Jemaat",
    amount: Number(form.amount) || 0,
    status: form.status || "Selesai",
    attachment_url: form.attachmentUrl || null,
  };
}

function expensePayloadFromForm(form, categoryId, accountId) {
  return {
    transaction_date: form.date,
    description: form.description || form.category,
    receipt_number: form.proof || null,
    category_id: categoryId,
    account_id: accountId,
    recipient_name: form.actor || "Penerima",
    amount: Number(form.amount) || 0,
    status: form.status || "Selesai",
    attachment_url: form.attachmentUrl || null,
  };
}

export async function listIncomeTransactionsFromSupabase() {
  assertSupabaseReady();
  const { data, error } = await supabase
    .from("income_transactions")
    .select(INCOME_SELECT)
    .order("transaction_date", { ascending: false });

  if (error) throw error;
  return (data || []).map(mapIncomeFromSupabase);
}

export async function listExpenseTransactionsFromSupabase() {
  assertSupabaseReady();
  const { data, error } = await supabase
    .from("expense_transactions")
    .select(EXPENSE_SELECT)
    .order("transaction_date", { ascending: false });

  if (error) throw error;
  return (data || []).map(mapExpenseFromSupabase);
}

export async function listFinanceTransactionsFromSupabase() {
  const [incomeRows, expenseRows] = await Promise.all([
    listIncomeTransactionsFromSupabase(),
    listExpenseTransactionsFromSupabase(),
  ]);

  return [...incomeRows, ...expenseRows].sort((a, b) => b.date.localeCompare(a.date));
}

export async function createIncomeTransactionInSupabase(form) {
  assertSupabaseReady();
  const [categoryId, accountId] = await Promise.all([
    resolveLookupId("income_categories", form.category),
    resolveCashAccountId(form.account),
  ]);
  const { data, error } = await supabase
    .from("income_transactions")
    .insert(incomePayloadFromForm(form, categoryId, accountId))
    .select(INCOME_SELECT)
    .single();

  if (error) throw error;
  return mapIncomeFromSupabase(data);
}

export async function createExpenseTransactionInSupabase(form) {
  assertSupabaseReady();
  const [categoryId, accountId] = await Promise.all([
    resolveLookupId("expense_categories", form.category),
    resolveCashAccountId(form.account),
  ]);
  const { data, error } = await supabase
    .from("expense_transactions")
    .insert(expensePayloadFromForm(form, categoryId, accountId))
    .select(EXPENSE_SELECT)
    .single();

  if (error) throw error;
  return mapExpenseFromSupabase(data);
}
