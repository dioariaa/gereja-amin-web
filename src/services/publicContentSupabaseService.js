import { isSupabaseConfigured, supabase } from "../lib/supabase";

function assertSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase belum dikonfigurasi.");
  }
}

function normalizeStatus(value) {
  return value || "Aktif";
}

function publicationFromRow(row) {
  return {
    id: row.id,
    slug: row.slug,
    category: row.category,
    title: row.title,
    excerpt: row.excerpt || "",
    content: row.content || "",
    author: row.author || "Sekretariat Gereja",
    status: normalizeStatus(row.status),
    date: row.published_at || "",
    coverImage: row.cover_image_url || "",
    coverLabel: row.cover_label || "",
    readingTime: row.reading_time || "",
    commissionSlug: row.commission_slug || "",
  };
}

function publicationToRow(item) {
  return {
    id: isUuid(item.id) ? item.id : undefined,
    slug: item.slug,
    category: item.category || "Warta Jemaat",
    title: item.title,
    excerpt: item.excerpt || "",
    content: item.content || "",
    author: item.author || "Sekretariat Gereja",
    status: normalizeStatus(item.status),
    published_at: item.date || null,
    cover_image_url: item.coverImage || null,
    cover_label: item.coverLabel || null,
    reading_time: item.readingTime || null,
    commission_slug: item.commissionSlug || null,
  };
}

function commissionFromRow(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortName: row.short_name || row.name,
    chair: row.chair || "",
    description: row.description || "",
    focus: row.focus || [],
    schedule: row.schedule || "",
    activities: row.activities || [],
    imageUrl: row.image_url || "",
    status: normalizeStatus(row.status),
    sortOrder: row.sort_order || 0,
  };
}

function commissionToRow(item) {
  return {
    id: isUuid(item.id) ? item.id : undefined,
    slug: item.slug,
    name: item.name,
    short_name: item.shortName || item.name,
    chair: item.chair || null,
    description: item.description || "",
    focus: item.focus || [],
    schedule: item.schedule || null,
    activities: item.activities || [],
    image_url: item.imageUrl || null,
    status: normalizeStatus(item.status),
    sort_order: Number(item.sortOrder) || 0,
  };
}

function scheduleFromRow(row) {
  return {
    id: row.cms_key || row.id,
    eventDate: row.event_date || "",
    category: row.category,
    title: row.title,
    theme: row.theme || "",
    time: row.time_label,
    location: row.location || "",
    notes: row.notes || "",
    description: row.description || "",
    assignments: row.assignments || [],
    status: normalizeStatus(row.status),
    sortOrder: row.sort_order || 0,
  };
}

function scheduleToRow(item) {
  return {
    id: isUuid(item.id) ? item.id : undefined,
    cms_key: item.id,
    event_date: item.eventDate || null,
    category: item.category || "Ibadah Minggu",
    title: item.title,
    theme: item.theme || null,
    time_label: item.time || "",
    location: item.location || null,
    notes: item.notes || null,
    description: item.description || null,
    assignments: item.assignments || [],
    status: normalizeStatus(item.status),
    sort_order: Number(item.sortOrder) || 0,
  };
}

function galleryFromRow(row) {
  return {
    id: row.cms_key || row.id,
    title: row.title,
    category: row.category,
    description: row.description || "",
    imageUrl: row.image_url || "",
    date: row.album_label || row.taken_at || "",
    count: row.item_count || 0,
    status: normalizeStatus(row.status),
    sortOrder: row.sort_order || 0,
  };
}

function galleryToRow(item) {
  return {
    id: isUuid(item.id) ? item.id : undefined,
    cms_key: item.id,
    title: item.title,
    category: item.category || "Dokumentasi",
    description: item.description || "",
    image_url: item.imageUrl || null,
    album_label: item.date || null,
    item_count: Number(item.count) || 0,
    status: normalizeStatus(item.status),
    sort_order: Number(item.sortOrder) || 0,
  };
}

function contactFromRow(row) {
  return {
    id: row.id,
    type: row.label,
    value: row.value,
    href: row.href || "",
    status: "Aktif",
    sortOrder: row.sort_order || 0,
  };
}

function contactToRow(item) {
  return {
    id: isUuid(item.id) ? item.id : undefined,
    label: item.type,
    value: item.value,
    href: item.href || null,
    is_primary: true,
    sort_order: Number(item.sortOrder) || 0,
  };
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value || "");
}

async function deleteMissingByKey(table, key, nextValues) {
  const { data, error } = await supabase.from(table).select(key);
  if (error) throw error;

  const nextSet = new Set(nextValues.filter(Boolean));
  const staleValues = (data || [])
    .map((item) => item[key])
    .filter((value) => value && !nextSet.has(value));

  if (staleValues.length === 0) return;

  const { error: deleteError } = await supabase.from(table).delete().in(key, staleValues);
  if (deleteError) throw deleteError;
}

async function upsertRows(table, rows, conflictKey = "id") {
  if (rows.length === 0) return;

  const { error } = await supabase
    .from(table)
    .upsert(rows, { onConflict: conflictKey });

  if (error) throw error;
}

export async function fetchSitePage(slug) {
  assertSupabase();

  const { data, error } = await supabase
    .from("site_pages")
    .select("content")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data?.content || null;
}

export async function saveSitePage(slug, title, content) {
  assertSupabase();

  const { error } = await supabase.from("site_pages").upsert(
    {
      slug,
      title,
      content,
      status: content.status || "Aktif",
    },
    { onConflict: "slug" }
  );

  if (error) throw error;
}

export async function fetchPublicationsFromSupabase({ includeDrafts = false } = {}) {
  assertSupabase();

  let query = supabase
    .from("publications")
    .select("*")
    .order("published_at", { ascending: false, nullsFirst: false });

  if (!includeDrafts) {
    query = query.eq("status", "Aktif");
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(publicationFromRow);
}

export async function savePublicationsToSupabase(items) {
  assertSupabase();
  await upsertRows("publications", items.map(publicationToRow), "slug");
  await deleteMissingByKey("publications", "slug", items.map((item) => item.slug));
}

export async function fetchCommissionsFromSupabase({ includeDrafts = false } = {}) {
  assertSupabase();

  let query = supabase.from("public_commissions").select("*").order("sort_order");
  if (!includeDrafts) {
    query = query.eq("status", "Aktif");
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(commissionFromRow);
}

export async function saveCommissionsToSupabase(items) {
  assertSupabase();
  await upsertRows("public_commissions", items.map(commissionToRow), "slug");
  await deleteMissingByKey("public_commissions", "slug", items.map((item) => item.slug));
}

export async function fetchSchedulesFromSupabase({ includeDrafts = false } = {}) {
  assertSupabase();

  let query = supabase.from("worship_schedules").select("*").order("sort_order");
  if (!includeDrafts) {
    query = query.eq("status", "Aktif");
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(scheduleFromRow);
}

export async function saveSchedulesToSupabase(items) {
  assertSupabase();
  await upsertRows("worship_schedules", items.map(scheduleToRow), "cms_key");
  await deleteMissingByKey("worship_schedules", "cms_key", items.map((item) => item.id));
}

export async function fetchGalleryFromSupabase({ includeDrafts = false } = {}) {
  assertSupabase();

  let query = supabase.from("gallery_items").select("*").order("sort_order");
  if (!includeDrafts) {
    query = query.eq("status", "Aktif");
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(galleryFromRow);
}

export async function saveGalleryToSupabase(items) {
  assertSupabase();
  await upsertRows("gallery_items", items.map(galleryToRow), "cms_key");
  await deleteMissingByKey("gallery_items", "cms_key", items.map((item) => item.id));
}

export async function fetchContactsFromSupabase() {
  assertSupabase();

  const { data, error } = await supabase
    .from("site_contacts")
    .select("*")
    .order("sort_order");

  if (error) throw error;
  return (data || []).map(contactFromRow);
}

export async function saveContactsToSupabase(items) {
  assertSupabase();
  await upsertRows("site_contacts", items.map(contactToRow), "label");
  await deleteMissingByKey("site_contacts", "label", items.map((item) => item.type));
}
