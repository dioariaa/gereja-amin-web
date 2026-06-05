import { commissions as commissionSeed, getCommissionBySlug } from "../data/commissionsData";

export const COMMISSIONS_STORAGE_KEY = "amin-commissions";

export { commissionSeed };

export function listCommissions(source = commissionSeed) {
  return source;
}

export function findCommissionBySlug(source, slug) {
  return source.find((commission) => commission.slug === slug) || getCommissionBySlug(slug);
}

export function getCommissionMetrics(source = commissionSeed) {
  return {
    total: source.length,
    chairs: source.filter((commission) => Boolean(commission.chair)).length,
    scheduled: source.filter((commission) => Boolean(commission.schedule)).length,
    focusCount: source.reduce((total, commission) => total + (commission.focus?.length || 0), 0),
  };
}

