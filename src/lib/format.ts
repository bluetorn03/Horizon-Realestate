const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

/** Full Indian-grouped currency, e.g. ₹28,50,000 */
export function formatINR(amount: number): string {
  return inrFormatter.format(Number.isFinite(amount) ? amount : 0);
}

/** Compact Indian real-estate notation, e.g. ₹32.5 Cr or ₹85 L */
export function formatINRCompact(amount: number): string {
  if (!Number.isFinite(amount) || amount <= 0) return formatINR(0);
  if (amount >= 10000000) return `₹ ${Number((amount / 10000000).toFixed(2))} Cr`;
  if (amount >= 100000) return `₹ ${Number((amount / 100000).toFixed(2))} L`;
  return formatINR(amount);
}

/**
 * Price label used across cards, detail pages and modals.
 * Rentals always show the full monthly figure; sale/commercial use Cr / L shorthand.
 */
export function formatPropertyPrice(price: number, listingType?: string): string {
  return listingType === 'rent' ? formatINR(price) : formatINRCompact(price);
}

export const MAX_PRICE_FILTER = 1000000000; // ₹100 Cr — treated as "any"
