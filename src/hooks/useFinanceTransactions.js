import { useCallback, useEffect, useState } from "react";
import {
  FINANCE_STORAGE_KEY,
  financeTransactionsSeed,
  listFinanceTransactionsFromSupabase,
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
      setTransactions(data.length ? data : financeTransactionsSeed);
      setSource("supabase");
    } catch (fetchError) {
      setError(fetchError.message || "Gagal membaca transaksi dari Supabase.");
      setSource("local");
    } finally {
      setLoading(false);
    }
  }, [setTransactions]);

  useEffect(() => {
    Promise.resolve().then(refresh);
  }, [refresh]);

  return {
    error,
    loading,
    refresh,
    setTransactions,
    source,
    transactions,
  };
}
