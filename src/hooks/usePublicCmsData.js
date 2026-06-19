import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  COMMISSIONS_STORAGE_KEY,
  commissionSeed,
} from "../services/commissionsService";
import {
  PUBLICATIONS_STORAGE_KEY,
  publicationSeed,
} from "../services/publicationsService";
import {
  PUBLIC_CONTENT_STORAGE_KEYS,
  aboutContentSeed,
  contactItemsSeed,
  fixedScheduleItemsSeed,
  galleryItemsSeed,
  homeContentSeed,
  scheduleItemsSeed,
} from "../services/publicContentService";
import {
  fetchCommissionsFromSupabase,
  fetchContactsFromSupabase,
  fetchFixedSchedulesFromSupabase,
  fetchGalleryFromSupabase,
  fetchPublicationsFromSupabase,
  fetchSchedulesFromSupabase,
  fetchSitePage,
  saveCommissionsToSupabase,
  saveContactsToSupabase,
  saveFixedSchedulesToSupabase,
  saveGalleryToSupabase,
  savePublicationsToSupabase,
  saveSchedulesToSupabase,
  saveSitePage,
} from "../services/publicContentSupabaseService";
import { isSupabaseConfigured } from "../lib/supabase";
import useLocalStorageState from "./useLocalStorageState";

function useSyncedCmsState(storageKey, initialValue, { loadRemote, saveRemote, fallbackWhenEmpty = false }) {
  const fallbackValueRef = useRef(initialValue);
  const [value, setLocalValue] = useLocalStorageState(storageKey, initialValue);
  const [meta, setMeta] = useState(() => ({
    source: isSupabaseConfigured ? "Local fallback" : "Local only",
    error: "",
    isRemoteReady: false,
  }));

  useEffect(() => {
    let cancelled = false;

    if (!isSupabaseConfigured || !loadRemote) {
      return undefined;
    }

    Promise.resolve()
      .then(loadRemote)
      .then((remoteValue) => {
        if (cancelled) return;

        if (remoteValue !== null && remoteValue !== undefined) {
          if (fallbackWhenEmpty && Array.isArray(remoteValue) && remoteValue.length === 0) {
            setLocalValue((currentValue) =>
              Array.isArray(currentValue) && currentValue.length > 0
                ? currentValue
                : fallbackValueRef.current
            );
            setMeta({
              source: "Local fallback",
              error: "Supabase belum punya data untuk konten ini.",
              isRemoteReady: false,
            });
            return;
          }

          setLocalValue(remoteValue);
          setMeta({ source: "Supabase", error: "", isRemoteReady: true });
          return;
        }

        setMeta({
          source: "Local fallback",
          error: "Supabase belum punya data untuk halaman ini.",
          isRemoteReady: false,
        });
      })
      .catch((error) => {
        if (cancelled) return;
        setMeta({
          source: "Local fallback",
          error: error.message || "Gagal membaca Supabase.",
          isRemoteReady: false,
        });
      });

    return () => {
      cancelled = true;
    };
  }, [fallbackWhenEmpty, loadRemote, setLocalValue]);

  const setValue = useCallback(
    (nextValue) => {
      setLocalValue((previousValue) => {
        const resolvedValue = typeof nextValue === "function"
          ? nextValue(previousValue)
          : nextValue;

        if (isSupabaseConfigured && saveRemote) {
          Promise.resolve()
            .then(() => saveRemote(resolvedValue))
            .then(() => {
              setMeta({ source: "Supabase", error: "", isRemoteReady: true });
            })
            .catch((error) => {
              setMeta({
                source: "Local fallback",
                error: error.message || "Gagal menyimpan ke Supabase.",
                isRemoteReady: false,
              });
            });
        }

        return resolvedValue;
      });
    },
    [saveRemote, setLocalValue]
  );

  return [value, setValue, meta];
}

const loadHomeContent = () => fetchSitePage("home");
const saveHomeContent = (value) => saveSitePage("home", "Beranda", value);
const loadAboutContent = () => fetchSitePage("about");
const saveAboutContent = (value) => saveSitePage("about", "Tentang Kami", value);
const loadPublicPublications = () => fetchPublicationsFromSupabase({ includeDrafts: true });
const loadAdminPublications = () => fetchPublicationsFromSupabase({ includeDrafts: true });
const savePublications = (value) => savePublicationsToSupabase(value);
const loadCommissions = () => fetchCommissionsFromSupabase({ includeDrafts: true });
const saveCommissions = (value) => saveCommissionsToSupabase(value);
const loadPublicFixedSchedules = () => fetchFixedSchedulesFromSupabase({ includeDrafts: true });
const loadAdminFixedSchedules = () => fetchFixedSchedulesFromSupabase({ includeDrafts: true });
const saveFixedSchedules = (value) => saveFixedSchedulesToSupabase(value);
const loadSchedules = () => fetchSchedulesFromSupabase({ includeDrafts: true });
const saveSchedules = (value) => saveSchedulesToSupabase(value);
const loadPublicGallery = () => fetchGalleryFromSupabase({ includeDrafts: true });
const loadAdminGallery = () => fetchGalleryFromSupabase({ includeDrafts: true });
const saveGallery = (value) => saveGalleryToSupabase(value);
const loadContacts = () => fetchContactsFromSupabase();
const saveContacts = (value) => saveContactsToSupabase(value);

export function useHomeContentCms() {
  return useSyncedCmsState(PUBLIC_CONTENT_STORAGE_KEYS.home, homeContentSeed, {
    loadRemote: loadHomeContent,
    saveRemote: saveHomeContent,
  });
}

export function useAboutContentCms() {
  return useSyncedCmsState(PUBLIC_CONTENT_STORAGE_KEYS.about, aboutContentSeed, {
    loadRemote: loadAboutContent,
    saveRemote: saveAboutContent,
  });
}

export function usePublicationsCms({ admin = false } = {}) {
  const options = useMemo(
    () => ({
      loadRemote: admin ? loadAdminPublications : loadPublicPublications,
      saveRemote: admin ? savePublications : undefined,
      fallbackWhenEmpty: !admin,
    }),
    [admin]
  );

  return useSyncedCmsState(PUBLICATIONS_STORAGE_KEY, publicationSeed, options);
}

export function useCommissionsCms({ admin = false } = {}) {
  const options = useMemo(
    () => ({
      loadRemote: loadCommissions,
      saveRemote: admin ? saveCommissions : undefined,
      fallbackWhenEmpty: true,
    }),
    [admin]
  );

  return useSyncedCmsState(COMMISSIONS_STORAGE_KEY, commissionSeed, options);
}

export function useFixedSchedulesCms({ admin = false } = {}) {
  const options = useMemo(
    () => ({
      loadRemote: admin ? loadAdminFixedSchedules : loadPublicFixedSchedules,
      saveRemote: admin ? saveFixedSchedules : undefined,
      fallbackWhenEmpty: !admin,
    }),
    [admin]
  );

  return useSyncedCmsState(PUBLIC_CONTENT_STORAGE_KEYS.fixedSchedules, fixedScheduleItemsSeed, options);
}

export function useSchedulesCms({ admin = false } = {}) {
  const options = useMemo(
    () => ({
      loadRemote: loadSchedules,
      saveRemote: admin ? saveSchedules : undefined,
      fallbackWhenEmpty: true,
    }),
    [admin]
  );

  return useSyncedCmsState(PUBLIC_CONTENT_STORAGE_KEYS.schedules, scheduleItemsSeed, options);
}

export function useGalleryCms({ admin = false } = {}) {
  const options = useMemo(
    () => ({
      loadRemote: admin ? loadAdminGallery : loadPublicGallery,
      saveRemote: admin ? saveGallery : undefined,
      fallbackWhenEmpty: !admin,
    }),
    [admin]
  );

  return useSyncedCmsState(PUBLIC_CONTENT_STORAGE_KEYS.gallery, galleryItemsSeed, options);
}

export function useContactsCms({ admin = false } = {}) {
  const options = useMemo(
    () => ({
      loadRemote: loadContacts,
      saveRemote: admin ? saveContacts : undefined,
      fallbackWhenEmpty: !admin,
    }),
    [admin]
  );

  return useSyncedCmsState(PUBLIC_CONTENT_STORAGE_KEYS.contacts, contactItemsSeed, options);
}
