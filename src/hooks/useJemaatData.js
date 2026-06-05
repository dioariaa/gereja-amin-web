import { useCallback, useEffect, useState } from "react";
import {
  JEMAAT_FAMILIES_STORAGE_KEY,
  JEMAAT_INDIVIDUALS_STORAGE_KEY,
  familySeed,
  individualSeed,
  listJemaatFromSupabase,
} from "../services/jemaatService";
import { isSupabaseConfigured } from "../lib/supabase";
import useLocalStorageState from "./useLocalStorageState";

export default function useJemaatData() {
  const [families, setFamilies] = useLocalStorageState(
    JEMAAT_FAMILIES_STORAGE_KEY,
    familySeed
  );
  const [individuals, setIndividuals] = useLocalStorageState(
    JEMAAT_INDIVIDUALS_STORAGE_KEY,
    individualSeed
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
      const data = await listJemaatFromSupabase();
      setFamilies(data.families.length ? data.families : familySeed);
      setIndividuals(data.individuals.length ? data.individuals : individualSeed);
      setSource("supabase");
    } catch (fetchError) {
      setError(fetchError.message || "Gagal membaca data jemaat dari Supabase.");
      setSource("local");
    } finally {
      setLoading(false);
    }
  }, [setFamilies, setIndividuals]);

  useEffect(() => {
    Promise.resolve().then(refresh);
  }, [refresh]);

  return {
    error,
    families,
    individuals,
    loading,
    refresh,
    setFamilies,
    setIndividuals,
    source,
  };
}
