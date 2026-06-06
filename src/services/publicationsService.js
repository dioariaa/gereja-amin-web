import {
  PUBLICATIONS_STORAGE_KEY,
  formatPublicDate,
  getPublicationBySlug,
  publicationSeed,
  toSlug,
} from "../data/publicationsData";
import { commissions as commissionSeed } from "../data/commissionsData";

export {
  PUBLICATIONS_STORAGE_KEY,
  formatPublicDate,
  publicationSeed,
  toSlug,
};

export function listPublications(source = publicationSeed) {
  return [...source].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

export function listActivePublications(source = publicationSeed) {
  return listPublications(source).filter((item) => item.status === "Aktif");
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

export function listPublicationsByCommission(source, commissionSlug, { includeDrafts = false } = {}) {
  const publications = includeDrafts ? listPublications(source) : listActivePublications(source);

  return publications.filter((item) => item.commissionSlug === commissionSlug);
}

export function getPublicationCommission(publication, commissions = commissionSeed) {
  if (!publication?.commissionSlug) return null;

  return commissions.find((commission) => commission.slug === publication.commissionSlug) || null;
}

export function getPublicationCommissionLabel(publication, commissions = commissionSeed) {
  const commission = getPublicationCommission(publication, commissions);
  return commission?.shortName || commission?.name || "";
}
