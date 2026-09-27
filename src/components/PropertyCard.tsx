import React from 'react';
import {
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  Heart,
  Calendar,
  Edit,
  Trash2,
  BadgeCheck,
  Car,
  Building2,
  Ruler,
} from 'lucide-react';
import type { Property } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTilt3D } from '../hooks/useTilt3D';
import { formatArea, formatPrice, formatRatePerSqft, ratePerSqft } from '../lib/format';
import { unsplashUrl, PLACEHOLDER_IMAGE } from '../lib/images';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
  onBookViewing: (property: Property) => void;
  onEdit?: (property: Property) => void;
  onDelete?: (property: Property) => void;
  isFavorite: boolean;
  onToggleFavorite: (propertyId: string) => void;
  /** Larger editorial card variant used by the horizontal storytelling rail. */
  variant?: 'grid' | 'feature';
}

const LISTING_BADGE: Record<string, { label: string; className: string }> = {
  sale: { label: 'For Sale', className: 'bg-gold-500 text-ink-950' },
  rent: { label: 'For Rent', className: 'bg-ink-900 text-bone-50' },
  commercial: { label: 'Commercial', className: 'bg-sage-600 text-bone-50' },
};

function bhkLabel(property: Property): string {
  if (property.category === 'Plot') return 'Land Parcel';
  if (property.bedrooms > 0) return `${property.bedrooms} BHK`;
  if (property.listingType === 'commercial') return 'Office Unit';
  return 'Studio';
}

/**
 * Premium property card.
 *
 * All monetary values render through the INR formatter; areas use sq ft with
 * carpet / built-up area shown wherever the listing provides it. The card
 * carries a pointer-driven 3D tilt and a scroll-driven transform layer that
 * both read CSS custom properties, so hovering never triggers a React render.
 */
export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  onBookViewing,
  onEdit,
  onDelete,
  isFavorite,
  onToggleFavorite,
  variant = 'grid',
}) => {
  const { user } = useAuth();
  const isOwner = Boolean(user && property.ownerId === user.uid);
  const tiltRef = useTilt3D<HTMLElement>({ max: 6.5, hoverScale: 1.012 });

  const photoId = property.images?.[0] || PLACEHOLDER_IMAGE;
  const imageSrc = unsplashUrl(photoId, { width: variant === 'feature' ? 1100 : 820, quality: 74 });
  const rate = ratePerSqft(property.price, property.sqft);
  const badge = LISTING_BADGE[property.listingType] ?? LISTING_BADGE.sale;
  const isFeature = variant === 'feature';

  return (
    <article
      ref={tiltRef}
      id={`property-card-${property.id}`}
      className={`property-card-shell group relative flex flex-col overflow-hidden rounded-xl border border-bone-300/70 bg-white shadow-lux-sm transition-shadow duration-500 hover:shadow-lux-lg ${
        isFeature ? 'w-[78vw] sm:w-[420px] lg:w-[460px]' : 'w-full'
      }`}
      data-cursor="hover"
    >
      {/* ---------------- Media ---------------- */}
      <div
        className={`relative w-full cursor-pointer overflow-hidden bg-bone-200 ${
          isFeature ? 'aspect-[4/5]' : 'aspect-[4/3]'
        }`}
        onClick={() => onSelect(property)}
      >
        <img
          src={imageSrc}
          alt={`${property.title} — ${property.location}`}
          width={820}
          height={615}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
        />

        {/* Editorial gradient */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/55 via-transparent to-transparent opacity-70"
          aria-hidden="true"
        />

        {/* Badges */}
        <div className="absolute left-3.5 top-3.5 z-10 flex flex-wrap items-center gap-1.5">
          <span
            className={`rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] shadow-sm ${badge.className}`}
          >
            {badge.label}
          </span>
          {property.featured && (
            <span className="rounded bg-bone-50/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-gold-700 shadow-sm">
              ★ Featured
            </span>
          )}
          {property.rera && (
            <span
              className="flex items-center gap-1 rounded bg-bone-50/95 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-sage-600 shadow-sm"
              title={`RERA ${property.rera}`}
            >
              <BadgeCheck className="h-3 w-3" />
              RERA
            </span>
          )}
        </div>

        {/* Favourite */}
        <button
          id={`favorite-btn-${property.id}`}
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onToggleFavorite(property.id);
          }}
          aria-pressed={isFavorite}
          className="absolute right-3.5 top-3.5 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/85 text-ink-700 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white hover:text-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
          title={isFavorite ? 'Remove from shortlist' : 'Add to shortlist'}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-rose-600 text-rose-600' : ''}`} />
          <span className="sr-only">{isFavorite ? 'Remove from shortlist' : 'Add to shortlist'}</span>
        </button>

        {/* Category / possession strip */}
        <div className="absolute bottom-3 left-3.5 z-10 flex flex-wrap items-center gap-1.5">
          <span className="rounded bg-white/92 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-800 shadow-xs backdrop-blur-sm">
            {property.category}
          </span>
          {property.possession && (
            <span className="rounded bg-ink-950/70 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-bone-100 backdrop-blur-sm">
              {property.possession}
            </span>
          )}
        </div>

        <div className="card-glare absolute inset-0 z-[5]" aria-hidden="true" />
      </div>

      {/* ---------------- Body ---------------- */}
      <div className={`flex flex-1 flex-col ${isFeature ? 'p-6 sm:p-7' : 'p-4 sm:p-5'}`}>
        <div className="flex items-start justify-between gap-3">
          <h3
            onClick={() => onSelect(property)}
            className={`cursor-pointer font-display font-bold text-ink-900 transition-colors duration-300 hover:text-gold-600 ${
              isFeature ? 'text-xl' : 'text-[15px]'
            } line-clamp-1`}
          >
            {property.title}
          </h3>
          {isOwner && (
            <span className="shrink-0 rounded bg-gold-100 px-2 py-0.5 text-[10px] font-bold text-gold-800">
              Your Listing
            </span>
          )}
        </div>

        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-bone-500">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-gold-500" />
          <span className="truncate">{property.location || property.city}</span>
        </div>

        {/* Specs */}
        <div className="mt-4 grid grid-cols-3 gap-2 border-y border-bone-200 py-3 text-[11px] text-ink-600">
          <div className="flex items-center gap-1.5">
            <BedDouble className="h-4 w-4 shrink-0 text-bone-400" />
            <span className="font-semibold text-ink-800">{bhkLabel(property)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="h-4 w-4 shrink-0 text-bone-400" />
            <span className="font-semibold text-ink-800">
              {property.bathrooms > 0 ? `${property.bathrooms} Bath` : '—'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Maximize2 className="h-3.5 w-3.5 shrink-0 text-bone-400" />
            <span className="truncate font-semibold text-ink-800">
              {property.sqft > 0 ? `${property.sqft.toLocaleString('en-IN')} sq ft` : '—'}
            </span>
          </div>
        </div>

        {/* Area breakdown + parking */}
        {(property.carpetArea || property.builtUpArea || property.garage || property.maintenance) && (
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-bone-500">
            {property.carpetArea ? (
              <span className="flex items-center gap-1.5">
                <Ruler className="h-3.5 w-3.5 text-bone-400" />
                Carpet {formatArea(property.carpetArea)}
              </span>
            ) : null}
            {property.builtUpArea ? <span>Built-up {formatArea(property.builtUpArea)}</span> : null}
            {property.garage || property.openParking ? (
              <span className="flex items-center gap-1.5">
                <Car className="h-3.5 w-3.5 text-bone-400" />
                {[property.garage ? `${property.garage} Covered` : null, property.openParking ? `${property.openParking} Open` : null]
                  .filter(Boolean)
                  .join(' · ')}
              </span>
            ) : null}
            {property.maintenance ? <span>Maint. ₹{property.maintenance.toLocaleString('en-IN')}/mo</span> : null}
          </div>
        )}

        {/* Price */}
        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <div className="font-display text-2xl font-bold tracking-tight text-gold-600">
              {formatPrice(property.price, property.listingType)}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-bone-500">
              {rate ? <span>{formatRatePerSqft(property.price, property.sqft)}</span> : null}
              {property.furnishing ? <span>{property.furnishing}</span> : null}
            </div>
          </div>
          {property.listingType === 'rent' && property.securityDeposit ? (
            <div className="text-right text-[11px] text-bone-500">
              <div className="font-semibold text-ink-700">
                ₹{property.securityDeposit.toLocaleString('en-IN')}
              </div>
              <div>deposit</div>
            </div>
          ) : null}
        </div>

        {/* Actions */}
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            id={`view-details-${property.id}`}
            type="button"
            onClick={() => onSelect(property)}
            className="rounded-md bg-bone-100 px-3 py-2.5 text-xs font-semibold text-ink-800 transition-colors duration-300 hover:bg-bone-200"
          >
            View Details
          </button>
          <button
            id={`book-viewing-${property.id}`}
            type="button"
            onClick={() => onBookViewing(property)}
            className="flex items-center justify-center gap-1.5 rounded-md bg-ink-900 px-3 py-2.5 text-xs font-semibold text-bone-50 shadow-sm transition-colors duration-300 hover:bg-ink-800"
          >
            <Calendar className="h-3.5 w-3.5" />
            Book Viewing
          </button>
        </div>

        {isOwner && onEdit && onDelete ? (
          <div className="mt-3 flex items-center justify-end gap-2 border-t border-bone-100 pt-3 text-xs">
            <button
              id={`edit-property-${property.id}`}
              type="button"
              onClick={() => onEdit(property)}
              className="flex items-center gap-1 rounded px-2 py-1 text-ink-600 transition-colors hover:bg-gold-50 hover:text-gold-700"
            >
              <Edit className="h-3.5 w-3.5" />
              Edit
            </button>
            <button
              id={`delete-property-${property.id}`}
              type="button"
              onClick={() => onDelete(property)}
              className="flex items-center gap-1 rounded px-2 py-1 text-rose-600 transition-colors hover:bg-rose-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        ) : null}
      </div>
    </article>
  );
};

/** Compact horizontal card used inside the dashboard lists. */
export const PropertyRow: React.FC<{
  property: Property;
  onSelect: (property: Property) => void;
  onToggleFavorite?: (id: string) => void;
  actionLabel?: string;
  onAction?: (property: Property) => void;
}> = ({ property, onSelect, onToggleFavorite, actionLabel = 'Remove', onAction }) => {
  const photoId = property.images?.[0] || PLACEHOLDER_IMAGE;
  return (
    <div className="flex items-start gap-3.5 rounded-xl border border-bone-200 bg-white p-4 shadow-lux-sm">
      <img
        src={unsplashUrl(photoId, { width: 220, quality: 70 })}
        alt={property.title}
        width={80}
        height={80}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        className="h-20 w-20 shrink-0 rounded-lg border border-bone-200 object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="rounded bg-bone-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold-700">
            {property.category}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-bone-500">
            {property.listingType}
          </span>
        </div>
        <h5 className="mt-1 truncate text-sm font-bold text-ink-900">{property.title}</h5>
        <p className="truncate text-[11px] text-bone-500">{property.location}</p>
        <p className="mt-1 font-display text-sm font-bold text-gold-600">
          {formatPrice(property.price, property.listingType)}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <button
          type="button"
          onClick={() => onSelect(property)}
          className="flex items-center gap-1 text-xs font-semibold text-ink-700 hover:text-ink-900"
        >
          <Building2 className="h-3.5 w-3.5" />
          View
        </button>
        {onToggleFavorite && onAction ? (
          <button
            type="button"
            onClick={() => onAction(property)}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
};
