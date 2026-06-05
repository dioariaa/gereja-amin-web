import {
  PUBLICATIONS_STORAGE_KEY,
  formatPublicDate,
  getPublicationBySlug,
  publicationSeed,
  toSlug,
} from "../data/publicationsData";

export {
  PUBLICATIONS_STORAGE_KEY,
  formatPublicDate,
  publicationSeed,
  toSlug,
};

export function listPublications(source = publicationSeed) {
  return source;
}

export function listActivePublications(source = publicationSeed) {
  return source.filter((item) => item.status === "Aktif");
}

export function findPublicationBySlug(source, slug) {
  return getPublicationBySlug(source, slug) || getPublicationBySlug(publicationSeed, slug);
}

export function getPublicationCategories(source = publicationSeed) {
  return ["Semua", ...new Set(listActivePublications(source).map((item) => item.category))];
}

export function filterPublicationsByCategory(source, category) {
  const activePublications = listActivePublications(source);
  return category === "Semua"
    ? activePublications
    : activePublications.filter((item) => item.category === category);
}

