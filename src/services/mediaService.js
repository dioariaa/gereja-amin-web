import { isSupabaseConfigured, supabase } from "../lib/supabase";

export const PUBLIC_MEDIA_BUCKET =
  import.meta.env.VITE_SUPABASE_PUBLIC_MEDIA_BUCKET || "public-assets";

export function resolvePublicMediaUrl(value) {
  if (!value) return "";

  const trimmedValue = value.trim();

  if (
    trimmedValue.startsWith("http://") ||
    trimmedValue.startsWith("https://") ||
    trimmedValue.startsWith("/")
  ) {
    return trimmedValue;
  }

  if (!isSupabaseConfigured || !supabase) {
    return trimmedValue;
  }

  const { data } = supabase.storage
    .from(PUBLIC_MEDIA_BUCKET)
    .getPublicUrl(trimmedValue);

  return data?.publicUrl || trimmedValue;
}

export function getMediaFieldHint() {
  return `Isi URL penuh atau path Supabase Storage bucket "${PUBLIC_MEDIA_BUCKET}", contoh: publications/warta-minggu.jpg.`;
}
