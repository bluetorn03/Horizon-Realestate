/**
 * Indian real-estate formatting utilities.
 *
 * Every monetary value in the application is stored as a plain number of
 * Indian Rupees (INR) in Firestore and rendered through these helpers so the
 * currency is displayed in the format Indian buyers actually read:
 *
 *   ₹75,000      (below 1 lakh — typically monthly rent)
 *   ₹85 Lakh     (below 1 crore)
 *   ₹1.25 Cr     (crore, 2 decimals)
 *   ₹2.40 Cr
 *   ₹1,200 Cr    (very large portfolios)
 */

export const LAKH = 100000; // 1,00,000
export const CRORE = 10000000; // 1,00,00,000

const indianNumberFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 0,
});

const decimalFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 2,
});

/** Indian digit grouping: 12345678 -> "1,23,45,678" */
export function formatIndianNumber(value: number): string {
  if (!Number.isFinite(value)) return '—';
  return indianNumberFormatter.format(Math.round(value));
}

/** Indian digit grouping with decimals: 1850.5 -> "1,850.5" */
export function formatIndianDecimal(value: number, fractionDigits = 2): string {
  if (!Number.isFinite(value)) return '—';
  return decimalFormatter.format(Number(value.toFixed(fractionDigits)));
}

function trimTrailingZeros(value: string): string {
  return value.includes('.') ? value.replace(/\.?0+$/, '') : value;
}

function croreSuffix(value: number): string {
  const cr = value / CRORE;
  if (cr >= 100) return `₹${formatIndianNumber(Math.round(cr))} Cr`;
  if (cr >= 10) return `₹${trimTrailingZeros(cr.toFixed(1))} Cr`;
  return `₹${trimTrailingZeros(cr.toFixed(2))} Cr`;
}

function lakhSuffix(value: number): string {
  const lakh = value / LAKH;
  if (lakh >= 100) return `₹${trimTrailingZeros(lakh.toFixed(0))} Lakh`;
  if (lakh >= 10) return `₹${trimTrailingZeros(lakh.toFixed(1))} Lakh`;
  return `₹${trimTrailingZeros(lakh.toFixed(2))} Lakh`;
}

/**
 * Compact Indian price label without the currency symbol prefix logic repeated.
 *   8500000   -> "85 Lakh"
 *   12500000  -> "1.25 Cr"
 *   24000000  -> "2.40 Cr"
 *   75000     -> "75,000"
 */
export function formatINRCompact(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return 'Price on request';
  if (value >= CRORE) return croreSuffix(value);
  if (value >= LAKH) return lakhSuffix(value);
  return `₹${formatIndianNumber(value)}`;
}

/** Full INR amount with Indian grouping: 12500000 -> "₹1,25,00,000" */
export function formatINRFull(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return 'Price on request';
  return `₹${formatIndianNumber(value)}`;
}

export type PriceQualifier = 'sale' | 'rent' | 'commercial';

/**
 * Canonical price label for a listing.
 * Rent is always expressed per month, sale / commercial as a capital value.
 */
export function formatPrice(price: number, listingType?: string | null): string {
  const base = formatINRCompact(price);
  if (!listingType) return base;
  return listingType === 'rent' ? `${base}/month` : base;
}

/** Price plus the exact figure, used in editorial detail views. */
export function formatPriceWithExact(price: number, listingType?: string | null): string {
  const compact = formatINRCompact(price);
  const exact = formatINRFull(price);
  if (compact === exact) return listingType === 'rent' ? `${compact}/month` : compact;
  return listingType === 'rent' ? `${compact}/month · ${exact}/month` : `${compact} · ${exact}`;
}

/** Area in Indian real-estate units: 1850 -> "1,850 sq ft" */
export function formatArea(sqft?: number | null): string {
  if (!sqft || !Number.isFinite(sqft) || sqft <= 0) return '—';
  return `${formatIndianNumber(sqft)} sq ft`;
}

/** Rate per square foot, the standard Indian comparison metric. */
export function formatRatePerSqft(price?: number | null, sqft?: number | null): string {
  if (!price || !sqft || sqft <= 0) return '—';
  return `₹${formatIndianNumber(Math.round(price / sqft))}/sq ft`;
}

export function ratePerSqft(price?: number | null, sqft?: number | null): number | null {
  if (!price || !sqft || sqft <= 0) return null;
  return Math.round(price / sqft);
}

/** Monthly maintenance charges: 4500 -> "₹4,500/month" */
export function formatMonthly(value?: number | null): string {
  if (!value || !Number.isFinite(value) || value <= 0) return '—';
  return `₹${formatIndianNumber(value)}/month`;
}

/**
 * Parse a human typed amount back into rupees.
 * Accepts "1.25 Cr", "85 Lakh", "85L", "12,50,000", "₹ 1.2 cr", "75000".
 */
export function parseINRInput(raw: string): number {
  if (!raw) return 0;
  const cleaned = raw.toString().toLowerCase().replace(/[₹,\s]/g, '');
  const match = cleaned.match(/^([\d.]+)\s*(cr|crore|crores|lakh|lakhs|lac|lacs|k|thousand)?$/);
  if (!match) return 0;
  const value = Number.parseFloat(match[1]);
  if (!Number.isFinite(value)) return 0;
  const unit = match[2];
  if (unit && ['cr', 'crore', 'crores'].includes(unit)) return Math.round(value * CRORE);
  if (unit && ['lakh', 'lakhs', 'lac', 'lacs'].includes(unit)) return Math.round(value * LAKH);
  if (unit === 'k' || unit === 'thousand') return Math.round(value * 1000);
  return Math.round(value);
}

/** Select options for budget filters, expressed in Indian units. */
export interface PriceBand {
  label: string;
  value: number;
}

export const SALE_PRICE_BANDS: PriceBand[] = [
  { label: 'Under ₹50 Lakh', value: 0 },
  { label: '₹50 Lakh – ₹1 Cr', value: 5000000 },
  { label: '₹1 Cr – ₹2.5 Cr', value: 10000000 },
  { label: '₹2.5 Cr – ₹5 Cr', value: 25000000 },
  { label: '₹5 Cr – ₹10 Cr', value: 50000000 },
  { label: '₹10 Cr +', value: 100000000 },
];

export const RENT_PRICE_BANDS: PriceBand[] = [
  { label: 'Under ₹25,000/month', value: 0 },
  { label: '₹25,000 – ₹50,000/month', value: 25000 },
  { label: '₹50,000 – ₹1 Lakh/month', value: 50000 },
  { label: '₹1 Lakh – ₹2.5 Lakh/month', value: 100000 },
  { label: '₹2.5 Lakh+/month', value: 250000 },
];

export const MIN_PRICE_OPTIONS: PriceBand[] = [
  { label: 'No minimum', value: 0 },
  { label: '₹25 Lakh', value: 2500000 },
  { label: '₹50 Lakh', value: 5000000 },
  { label: '₹1 Cr', value: 10000000 },
  { label: '₹2 Cr', value: 20000000 },
  { label: '₹5 Cr', value: 50000000 },
];

export const MAX_PRICE_OPTIONS: PriceBand[] = [
  { label: 'No maximum', value: 0 },
  { label: '₹50 Lakh', value: 5000000 },
  { label: '₹1 Cr', value: 10000000 },
  { label: '₹2 Cr', value: 20000000 },
  { label: '₹5 Cr', value: 50000000 },
  { label: '₹10 Cr', value: 100000000 },
  { label: '₹25 Cr', value: 250000000 },
];

/** Upper bound used to represent "any price" in the filter state. */
export const PRICE_CEILING = 1000000000; // ₹1,000 Cr
