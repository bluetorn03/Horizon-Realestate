import React, { useState } from 'react';
import {
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  Calendar,
  Heart,
  Share2,
  Check,
  ShieldCheck,
  Phone,
  Mail,
  Edit,
  Trash2,
  Car,
  Building2,
  Compass,
  BadgeCheck,
  Ruler,
  Layers,
  ChevronLeft,
  ChevronRight,
  Wrench,
} from 'lucide-react';
import type { Property } from '../types';
import { useAuth } from '../context/AuthContext';
import { Modal, ModalHeader } from './Modal';
import { MagneticButton } from './MagneticButton';
import {
  formatArea,
  formatINRFull,
  formatMonthly,
  formatPrice,
  formatPriceWithExact,
  formatRatePerSqft,
} from '../lib/format';
import { PLACEHOLDER_IMAGE, unsplashUrl } from '../lib/images';

interface PropertyDetailsModalProps {
  property: Property | null;
  onClose: () => void;
  onBookViewing: (property: Property) => void;
  onEditProperty: (property: Property) => void;
  onDeleteProperty: (property: Property) => void;
  isFavorite: boolean;
  onToggleFavorite: (propertyId: string) => void;
}

const LISTING_BADGE: Record<string, { label: string; className: string }> = {
  sale: { label: 'For Sale', className: 'bg-gold-500 text-ink-950' },
  rent: { label: 'For Rent', className: 'bg-ink-900 text-bone-50' },
  commercial: { label: 'Commercial Lease', className: 'bg-sage-600 text-bone-50' },
};

export const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({
  property,
  onClose,
  onBookViewing,
  onEditProperty,
  onDeleteProperty,
  isFavorite,
  onToggleFavorite,
}) => {
  const { user } = useAuth();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!property) return null;

  const isOwner = Boolean(user && property.ownerId === user.uid);
  const images =
    property.images && property.images.length > 0 ? property.images : [PLACEHOLDER_IMAGE];
  const badge = LISTING_BADGE[property.listingType] ?? LISTING_BADGE.sale;
  const area = property.sqft > 0 ? property.sqft : null;

  const handleShare = () => {
    void navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 3000);
  };

  const specs: { icon: typeof BedDouble; label: string; value: string }[] = [
    {
      icon: BedDouble,
      label: 'Configuration',
      value:
        property.bedrooms > 0
          ? `${property.bedrooms} BHK`
          : property.category === 'Plot'
            ? 'Land parcel'
            : property.listingType === 'commercial'
              ? 'Office unit'
              : '—',
    },
    {
      icon: Bath,
      label: 'Bathrooms',
      value: property.bathrooms > 0 ? `${property.bathrooms}` : '—',
    },
    {
      icon: Maximize2,
      label: 'Super Built-up',
      value: area ? formatArea(area) : '—',
    },
    {
      icon: Ruler,
      label: 'Carpet Area',
      value: property.carpetArea ? formatArea(property.carpetArea) : '—',
    },
    {
      icon: Layers,
      label: 'Built-up Area',
      value: property.builtUpArea ? formatArea(property.builtUpArea) : '—',
    },
    {
      icon: Car,
      label: 'Parking',
      value:
        property.garage || property.openParking
          ? [property.garage ? `${property.garage} covered` : null, property.openParking ? `${property.openParking} open` : null]
              .filter(Boolean)
              .join(' · ')
          : '—',
    },
    {
      icon: Building2,
      label: 'Floor',
      value:
        property.floor && property.totalFloors
          ? `${property.floor} of ${property.totalFloors}`
          : property.totalFloors
            ? `${property.totalFloors} floors`
            : '—',
    },
    {
      icon: Compass,
      label: 'Facing',
      value: property.facing || '—',
    },
  ];

  const meta: { label: string; value: string }[] = [
    { label: 'Furnishing', value: property.furnishing || '—' },
    { label: 'Possession', value: property.possession || '—' },
    { label: 'Age of property', value: property.ageOfProperty || '—' },
    { label: 'Year built', value: property.yearBuilt ? String(property.yearBuilt) : '—' },
    { label: 'Balconies', value: property.balconies ? String(property.balconies) : '—' },
    { label: 'Overlooking', value: property.overlooking || '—' },
    { label: 'Plot size', value: property.lotSize || '—' },
    {
      label: 'Maintenance',
      value: property.maintenance ? `${formatMonthly(property.maintenance)}` : '—',
    },
    ...(property.listingType === 'rent' && property.securityDeposit
      ? [
          {
            label: 'Security deposit',
            value: formatINRFull(property.securityDeposit),
          },
        ]
      : []),
    { label: 'RERA registration', value: property.rera || 'Not applicable' },
  ];

  return (
    <Modal onClose={onClose} size="xl" id="property-details-container">
      titleId="property-details-title"
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 border-b border-bone-200 bg-bone-100/60 px-4 py-3 pr-16 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${badge.className}`}
          >
            {badge.label}
          </span>
          <span className="rounded border border-bone-300 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-ink-800">
            {property.category}
          </span>
          {property.featured && (
            <span className="rounded bg-gold-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-gold-800">
              ★ Featured
            </span>
          )}
          {property.rera && (
            <span className="flex items-center gap-1 rounded bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700">
              <BadgeCheck className="h-3 w-3" />
              RERA
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            id="details-share-btn"
            onClick={handleShare}
            title="Copy listing link"
            className="flex items-center gap-1.5 rounded-full px-2.5 py-2 text-xs font-semibold text-ink-600 transition-colors hover:bg-bone-200"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Share2 className="h-4 w-4" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
          </button>
          <button
            type="button"
            id="details-favorite-btn"
            onClick={() => onToggleFavorite(property.id)}
            aria-pressed={isFavorite}
            title={isFavorite ? 'Remove from shortlist' : 'Save to shortlist'}
            className="grid h-9 w-9 place-items-center rounded-full text-ink-600 transition-colors hover:bg-rose-50 hover:text-rose-600"
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-rose-600 text-rose-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="overflow-y-auto p-4 sm:p-8">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="group relative aspect-[16/9] overflow-hidden rounded-xl bg-ink-900 shadow-lux-md sm:aspect-[21/9]">
            <img
              src={unsplashUrl(images[activeImageIndex], { width: 1600, quality: 78 })}
              alt={`${property.title} — photograph ${activeImageIndex + 1} of ${images.length}`}
              width={1600}
              height={900}
              decoding="async"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
                  }
                  aria-label="Previous photograph"
                  className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-ink-950/55 text-bone-50 backdrop-blur-sm transition-colors hover:bg-ink-950/85"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
                  }
                  aria-label="Next photograph"
                  className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-ink-950/55 text-bone-50 backdrop-blur-sm transition-colors hover:bg-ink-950/85"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <span className="absolute bottom-3 right-3 rounded-md bg-ink-950/65 px-2.5 py-1 text-[11px] font-bold text-bone-50 backdrop-blur-sm">
                  {activeImageIndex + 1} / {images.length}
                </span>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
              {images.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                    index === activeImageIndex
                      ? 'border-gold-500 ring-2 ring-gold-500/25'
                      : 'border-transparent opacity-65 hover:opacity-100'
                  }`}
                >
                  <img
                    src={unsplashUrl(image, { width: 200, quality: 60 })}
                    alt=""
                    width={80}
                    height={56}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Title + price */}
        <div className="mt-7 flex flex-col items-start justify-between gap-5 border-b border-bone-200 pb-6 md:flex-row md:items-end">
          <div>
            <h3
              id="property-details-title"
              className="font-display text-2xl font-bold leading-tight text-ink-950 sm:text-3xl"
            >
              {property.title}
            </h3>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-bone-500">
              <MapPin className="h-4 w-4 shrink-0 text-gold-500" />
              <span>
                {property.address ? `${property.address}, ` : ''}
                {property.location || property.city}
                {property.state ? `, ${property.state}` : ''}
                {property.zipCode ? ` ${property.zipCode}` : ''}
              </span>
            </div>
          </div>

          <div className="md:text-right">
            <div className="font-display text-2xl font-bold tracking-tight text-gold-600 sm:text-3xl">
              {formatPrice(property.price, property.listingType)}
            </div>
            <div className="mt-1 text-xs text-bone-500">
              {formatPriceWithExact(property.price, property.listingType)}
            </div>
            <div className="mt-1 text-[11px] text-bone-500">
              Listing ID #{property.id.slice(0, 8).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Specs */}
        <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-bone-200 bg-bone-100/50 p-5 sm:grid-cols-4">
          {specs.map((spec) => {
            const Icon = spec.icon;
            return (
              <div key={spec.label} className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-bone-300 bg-white text-gold-600 shadow-lux-sm">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-bone-500">
                    {spec.label}
                  </div>
                  <div className="truncate text-sm font-bold text-ink-900">{spec.value}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Value analysis */}
        {area ? (
          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 rounded-xl border border-gold-400/40 bg-gold-50/60 px-5 py-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold-700">
                Rate on carpet area
              </div>
              <div className="font-display text-lg font-bold text-ink-950">
                {property.carpetArea
                  ? formatRatePerSqft(property.price, property.carpetArea)
                  : formatRatePerSqft(property.price, area)}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold-700">
                Rate on built-up area
              </div>
              <div className="font-display text-lg font-bold text-ink-950">
                {formatRatePerSqft(property.price, area)}
              </div>
            </div>
            <p className="max-w-md text-[11px] leading-relaxed text-bone-500">
              Circle rates in this micro-market typically lag registered consideration by 12–18
              months. Ask your advisor for the latest comparable-transaction sheet.
            </p>
          </div>
        ) : null}

        {/* Description */}
        <div className="mt-8">
          <h4 className="mb-3 font-display text-lg font-bold text-ink-950">About this residence</h4>
          <p className="whitespace-pre-line text-sm leading-relaxed text-ink-700">
            {property.description}
          </p>
        </div>

        {/* Key facts */}
        <div className="mt-8">
          <h4 className="mb-4 font-display text-lg font-bold text-ink-950">Key facts</h4>
          <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {meta.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-3 border-b border-bone-200 pb-2"
              >
                <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-bone-500">
                  {item.label}
                </dt>
                <dd className="text-right text-xs font-bold text-ink-900">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Amenities */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="mt-8">
            <h4 className="mb-4 font-display text-lg font-bold text-ink-950">
              Amenities & specifications
            </h4>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {property.amenities.map((amenity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-lg border border-bone-200 bg-bone-100/60 px-3 py-2.5"
                >
                  <Check className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span className="text-xs font-semibold text-ink-800">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Advisor */}
        <div className="wash-ink mt-9 flex flex-col items-start justify-between gap-6 rounded-2xl p-6 text-bone-50 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <img
              src={unsplashUrl(property.ownerPhoto || PLACEHOLDER_IMAGE, { width: 160, quality: 70 })}
              alt=""
              width={56}
              height={56}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              className="h-14 w-14 rounded-full border-2 border-gold-400/70 object-cover"
            />
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-300">
                {isOwner ? 'Listed by you' : 'Your private advisor'}
              </div>
              <h4 className="mt-0.5 text-base font-bold text-bone-50">
                {property.ownerName || 'Horizon Estates Advisory Desk'}
              </h4>
              <div className="mt-1.5 flex flex-wrap items-center gap-4 text-xs text-bone-400">
                {property.ownerEmail && (
                  <a
                    href={`mailto:${property.ownerEmail}`}
                    className="flex items-center gap-1.5 transition-colors hover:text-gold-300"
                  >
                    <Mail className="h-3.5 w-3.5 text-gold-400" />
                    {property.ownerEmail}
                  </a>
                )}
                {property.ownerPhone && (
                  <a
                    href={`tel:${property.ownerPhone.replace(/\s/g, '')}`}
                    className="flex items-center gap-1.5 transition-colors hover:text-gold-300"
                  >
                    <Phone className="h-3.5 w-3.5 text-gold-400" />
                    {property.ownerPhone}
                  </a>
                )}
              </div>
            </div>
          </div>

          <MagneticButton
            id="details-book-viewing-cta"
            variant="gold"
            size="md"
            onClick={() => onBookViewing(property)}
            className="w-full md:w-auto"
          >
            <Calendar className="h-4 w-4" />
            Schedule Private Viewing
          </MagneticButton>
        </div>

        {/* Owner controls */}
        {isOwner && (
          <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-xl border border-gold-400/50 bg-gold-50 p-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-gold-700" />
              <span className="text-xs font-bold text-gold-900">
                You are the verified owner of this listing.
              </span>
            </div>
            <div className="flex w-full items-center gap-2 sm:w-auto">
              <button
                type="button"
                id="details-edit-prop-btn"
                onClick={() => onEditProperty(property)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gold-300 bg-white px-4 py-2 text-xs font-bold text-gold-900 transition-colors hover:bg-gold-100 sm:flex-initial"
              >
                <Edit className="h-3.5 w-3.5" />
                Edit Listing
              </button>
              <button
                type="button"
                id="details-delete-prop-btn"
                onClick={() => onDeleteProperty(property)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-rose-700 sm:flex-initial"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </div>
        )}

        <p className="mt-8 flex items-start gap-2 text-[11px] leading-relaxed text-bone-500">
          <Wrench className="mt-0.5 h-3.5 w-3.5 shrink-0 text-bone-400" />
          Areas are as measured and certified by the developer. Stamping duty and registration
          charges in Maharashtra are 5% (plus 1% metro cess and 1% LBT where applicable) of the
          agreement value.
        </p>
      </div>
    </Modal>
  );
};
