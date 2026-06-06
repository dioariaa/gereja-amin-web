import { useCallback, useEffect, useState } from "react";
import {
  FINANCE_STORAGE_KEY,
  createFinanceTransaction,
  createFinanceTransactionInSupabase,
  deleteFinanceTransactionFromSupabase,
  financeTransactionsSeed,
  listFinanceTransactions,
  listFinanceTransactionsFromSupabase,
  updateFinanceTransactionInSupabase,
} from "../services/financeService";
import { isSupabaseConfigured } from "../lib/supabase";
import useLocalStorageState from "./useLocalStorageState";

export default function useFinanceTransactions() {
  const [transactions, setTransactions] = useLocalStorageState(
    FINANCE_STORAGE_KEY,
    financeTransactionsSeed
  );
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState("");
  const [source, setSource] = useState(isSupabaseConfigured ? "supabase" : "local");

  const syncTransactions = useCallback(
    (nextTransactions) => {
      setTransactions(listFinanceTransactions(nextTransactions));
    },
    [setTransactions]
  );

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setSource("local");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await listFinanceTransactionsFromSupabase();
      syncTransactions(data);
      setSource("supabase");
    } catch (fetchError) {
      setError(fetchError.message || "Gagal membaca transaksi dari Supabase.");
      setSource("local");
    } finally {
      setLoading(false);
    }
  }, [syncTransactions]);

  const createTransaction = useCallback(
    async (type, form) => {
      const canUseRemote = isSupabaseConfigured && source === "supabase";
      const sequence = transactions.length + 1;

      if (canUseRemote) {
        try {
          const savedTransaction = await createFinanceTransactionInSupabase(type, form);
          syncTransactions([savedTransaction, ...transactions]);
          return { source: "supabase", transaction: savedTransaction };
        } catch (saveError) {
          const localTransaction = createFinanceTransaction(type, form, sequence);
          setError(saveError.message || "Supabase belum menerima transaksi baru.");
          setSource("local");
          syncTransactions([localTransaction, ...transactions]);
          return {
            error: saveError.message,
            source: "local",
            transaction: localTransaction,
          };
        }
      }

      const localTransaction = createFinanceTransaction(type, form, sequence);
      syncTransactions([localTransaction, ...transactions]);
      return { source: "local", transaction: localTransaction };
    },
    [source, syncTransactions, transactions]
  );

  const updateTransaction = useCallback(
    async (id, type, form) => {
      const canUseRemote = isSupabaseConfigured && source === "supabase";

      if (canUseRemote) {
        const savedTransaction = await updateFinanceTransactionInSupabase(id, type, form);
        syncTransactions(
          transactions.map((item) => (item.id === id ? savedTransaction : item))
        );
        return { source: "supabase", transaction: savedTransaction };
      }

      const existingTransaction = transactions.find((item) => item.id === id);
      const localTransaction = createFinanceTransaction(type, {
        ...form,
        id,
        proof: form.proof || existingTransaction?.proof || "",
      });
      syncTransactions(
        transactions.map((item) => (item.id === id ? localTransaction : item))
      );
      return { source: "local", transaction: localTransaction };
    },
    [source, syncTransactions, transactions]
  );

  const deleteTransaction = useCallback(
    async (id, type) => {
      const canUseRemote = isSupabaseConfigured && source === "supabase";

      if (canUseRemote) {
        await deleteFinanceTransactionFromSupabase(id, type);
      }

      syncTransactions(transactions.filter((item) => item.id !== id));
      return { source: canUseRemote ? "supabase" : "local" };
    },
    [source, syncTransactions, transactions]
  );

  useEffect(() => {
    Promise.resolve().then(refresh);
  }, [refresh]);

  return {
    createTransaction,
    deleteTransaction,
    error,
    loading,
    refresh,
    setTransactions,
    source,
    transactions,
    updateTransaction,
  };
}
