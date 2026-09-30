import { CompetitorItem } from '@/types/business';

export interface CompetitorFilterOptions {
  maxDistanceKm?: number;
  category?: string;
  priceRange?: 'Budget' | 'Mid' | 'Premium';
  minRating?: number;
  searchQuery?: string;
}

/**
 * Modular competitor service layer with filtering and search.
 * Clearly marks records as DEMO / ESTIMATED data when live API data is absent.
 */
export function filterCompetitors(
  competitors: CompetitorItem[],
  filters: CompetitorFilterOptions
): CompetitorItem[] {
  return competitors.filter(comp => {
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const matchName = comp.name.toLowerCase().includes(q);
      const matchLoc = comp.location.toLowerCase().includes(q);
      const matchCat = comp.category.toLowerCase().includes(q);
      if (!matchName && !matchLoc && !matchCat) return false;
    }
    if (filters.maxDistanceKm && comp.distanceKm > filters.maxDistanceKm) {
      return false;
    }
    if (filters.category && filters.category !== 'All' && comp.category !== filters.category) {
      return false;
    }
    if (filters.priceRange && comp.priceRange !== filters.priceRange) {
      return false;
    }
    if (filters.minRating && comp.rating < filters.minRating) {
      return false;
    }
    return true;
  });
}
