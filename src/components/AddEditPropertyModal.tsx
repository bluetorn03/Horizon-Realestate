import React, { useState } from 'react';
import {
  Plus,
  Building,
  MapPin,
  IndianRupee,
  Check,
  Image as ImageIcon,
  Layers,
  Sparkles,
  Lock,
  Ruler,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Property, PropertyCategory, ListingType } from '../types';
import { useAuth } from '../context/AuthContext';
import { createProperty, updateProperty } from '../lib/firebase';
import { Modal, ModalHeader } from './Modal';
import { MagneticButton } from './MagneticButton';
import { parseINRInput } from '../lib/format';
import {
  AMENITY_OPTIONS,
  FACING_OPTIONS,
  FURNISHING_OPTIONS,
  INDIAN_CITIES,
  INDIAN_STATES,
  POSSESSION_OPTIONS,
} from '../lib/locations';

interface AddEditPropertyModalProps {
  propertyToEdit?: Property | null;
  onClose: () => void;
  onOpenAuth: () => void;
  onSuccess: (property: Property, isEdit: boolean) => void;
}

const PRESETS = [
  { label: 'Sea-Facing Apartment', url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Contemporary Villa', url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Independent House', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Living Room', url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Bedroom', url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Grade-A Office', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Residential Plot', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Heritage Bungalow', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80' },
];

const inputClass =
  'w-full rounded-lg border border-bone-300 bg-bone-50 px-3.5 py-2.5 text-xs font-medium text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30';
const labelClass = 'mb-1 block text-[10px] font-bold uppercase tracking-[0.16em] text-ink-700';
const sectionClass =
  'text-[11px] font-bold uppercase tracking-[0.18em] text-gold-700 border-b border-bone-200 pb-2';

export const AddEditPropertyModal: React.FC<AddEditPropertyModalProps> = ({
  propertyToEdit,
  onClose,
  onOpenAuth,
  onSuccess,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(propertyToEdit?.title || '');
  const [description, setDescription] = useState(propertyToEdit?.description || '');
  const [priceInput, setPriceInput] = useState(
    propertyToEdit?.price ? String(propertyToEdit.price) : '',
  );
  const [listingType, setListingType] = useState<ListingType>(propertyToEdit?.listingType || 'sale');
  const [category, setCategory] = useState<PropertyCategory>(propertyToEdit?.category || 'Apartment');
  const [location, setLocation] = useState(propertyToEdit?.location || '');
  const [address, setAddress] = useState(propertyToEdit?.address || '');
  const [city, setCity] = useState(propertyToEdit?.city || 'Mumbai');
  const [state, setState] = useState(propertyToEdit?.state || 'Maharashtra');
  const [zipCode, setZipCode] = useState(propertyToEdit?.zipCode || '');
  const [bedrooms, setBedrooms] = useState<number | string>(propertyToEdit?.bedrooms ?? 3);
  const [bathrooms, setBathrooms] = useState<number | string>(propertyToEdit?.bathrooms ?? 3);
  const [sqft, setSqft] = useState<number | string>(propertyToEdit?.sqft ?? 1850);
  const [carpetArea, setCarpetArea] = useState<number | string>(propertyToEdit?.carpetArea ?? '');
  const [builtUpArea, setBuiltUpArea] = useState<number | string>(propertyToEdit?.builtUpArea ?? '');
  const [lotSize, setLotSize] = useState(propertyToEdit?.lotSize || '');
  const [yearBuilt, setYearBuilt] = useState<number | string>(propertyToEdit?.yearBuilt ?? 2023);
  const [garage, setGarage] = useState<number | string>(propertyToEdit?.garage ?? 1);
  const [openParking, setOpenParking] = useState<number | string>(propertyToEdit?.openParking ?? '');
  const [furnishing, setFurnishing] = useState<string>(propertyToEdit?.furnishing || 'Semi-Furnished');
  const [possession, setPossession] = useState<string>(propertyToEdit?.possession || 'Ready to Move');
  const [rera, setRera] = useState(propertyToEdit?.rera || '');
  const [maintenance, setMaintenance] = useState<number | string>(propertyToEdit?.maintenance ?? '');
  const [securityDeposit, setSecurityDeposit] = useState<number | string>(
    propertyToEdit?.securityDeposit ?? '',
  );
  const [floor, setFloor] = useState<number | string>(propertyToEdit?.floor ?? '');
  const [totalFloors, setTotalFloors] = useState<number | string>(propertyToEdit?.totalFloors ?? '');
  const [facing, setFacing] = useState(propertyToEdit?.facing || 'East');
  const [balconies, setBalconies] = useState<number | string>(propertyToEdit?.balconies ?? '');
  const [overlooking, setOverlooking] = useState(propertyToEdit?.overlooking || '');

  const [imageUrl, setImageUrl] = useState(propertyToEdit?.images?.[0] || '');
  const [additionalImages, setAdditionalImages] = useState<string[]>(
    propertyToEdit?.images?.slice(1) || [],
  );
  const [newImageInput, setNewImageInput] = useState('');

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    propertyToEdit?.amenities || ['RERA Registered', 'Covered Parking', 'Lift / Elevator', '24x7 Security'],
  );

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((current) =>
      current.includes(amenity)
        ? current.filter((item) => item !== amenity)
        : [...current, amenity],
    );
  };

  const handleAddImage = () => {
    const value = newImageInput.trim();
    if (value && !additionalImages.includes(value)) {
      setAdditionalImages((current) => [...current, value]);
      setNewImageInput('');
    }
  };

  const handleRemoveAdditionalImage = (index: number) => {
    setAdditionalImages((current) => current.filter((_, i) => i !== index));
  };

  const toNumber = (value: number | string): number => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const handleCityChange = (nextCity: string) => {
    setCity(nextCity);
    const match = INDIAN_CITIES.find((item) => item.name === nextCity);
    if (match) setState(match.state);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }

    const price = parseINRInput(priceInput);
    if (!title.trim() || price <= 0 || !location.trim() || !city.trim()) {
      setError(
        'Please provide a title, a price in ₹, a display locality and a city. Prices may be typed as “1.25 Cr”, “85 Lakh” or “1850000”.',
      );
      return;
    }

    const mainImage = imageUrl.trim() || PRESETS[0].url;
    const allImages = [mainImage, ...additionalImages];

    const payload = {
      title: title.trim(),
      description:
        description.trim() ||
        'A well-located residence presented with full RERA documentation, verified carpet-area figures and private viewing access through Horizon Estates.',
      price,
      listingType,
      category,
      location: location.trim(),
      address: address.trim() || location.trim(),
      city: city.trim(),
      state: state.trim() || 'Maharashtra',
      zipCode: zipCode.trim(),
      bedrooms: toNumber(bedrooms),
      bathrooms: toNumber(bathrooms),
      sqft: toNumber(sqft),
      carpetArea: toNumber(carpetArea) || undefined,
      builtUpArea: toNumber(builtUpArea) || undefined,
      lotSize: lotSize.trim() || undefined,
      yearBuilt: toNumber(yearBuilt) || undefined,
      garage: toNumber(garage) || undefined,
      openParking: toNumber(openParking) || undefined,
      furnishing: (furnishing || undefined) as Property['furnishing'],
      possession: (possession || undefined) as Property['possession'],
      rera: rera.trim() || undefined,
      maintenance: toNumber(maintenance) || undefined,
      securityDeposit: toNumber(securityDeposit) || undefined,
      floor: toNumber(floor) || undefined,
      totalFloors: toNumber(totalFloors) || undefined,
      facing: facing || undefined,
      balconies: toNumber(balconies) || undefined,
      overlooking: overlooking.trim() || undefined,
      images: allImages,
      amenities: selectedAmenities,
    };

    setLoading(true);
    setError(null);

    try {
      if (propertyToEdit) {
        await updateProperty(propertyToEdit.id, payload);
        onSuccess(
          {
            ...propertyToEdit,
            ...payload,
            updatedAt: new Date().toISOString(),
          } as Property,
          true,
        );
      } else {
        const created = await createProperty({
          ...payload,
          featured: false,
          ownerId: user.uid,
          ownerName: user.displayName || 'Property Owner',
          ownerEmail: user.email || '',
          ownerPhone: user.phoneNumber || '',
          ownerPhoto:
            user.photoURL ||
            'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80',
        });

        confetti({
          particleCount: 110,
          spread: 80,
          origin: { y: 0.62 },
          colors: ['#b08d3f', '#0b1220', '#d3b25f'],
        });

        onSuccess(created, false);
      }
    } catch (err) {
      console.error('Error saving property listing:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to save the listing. Please check your connection and try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose} size="lg" id="add-edit-property-modal-container">
      titleId="add-edit-property-title"
      <ModalHeader
        icon={Building}
        title={propertyToEdit ? 'Edit Property Listing' : 'List a Residence'}
        titleId="add-edit-property-title"
        subtitle={
          propertyToEdit
            ? 'Update pricing, areas and amenities — changes go live immediately.'
            : 'Publish a residence to the Horizon Estates marketplace. No brokerage from owners.'
        }
      />

      {!user ? (
        <div className="bg-bone-100/60 p-8 text-center">
          <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-gold-100 text-gold-800">
            <Lock className="h-7 w-7" />
          </span>
          <h3 className="font-display text-lg font-bold text-ink-950">
            Sign in to list your property
          </h3>
          <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-bone-500">
            You need a Horizon Estates account to publish listings, manage ₹ pricing and receive
            viewing requests from pre-qualified buyers.
          </p>
          <div className="mt-6">
            <MagneticButton
              id="add-modal-signin-btn"
              variant="ink"
              size="md"
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
            >
              Sign In / Sign Up
            </MagneticButton>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-7 overflow-y-auto p-6 sm:p-8">
          {error && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-3.5 text-xs font-medium text-rose-700">
              {error}
            </div>
          )}

          {/* 1. Core */}
          <div className="space-y-4">
            <h4 className={sectionClass}>1 · Core information</h4>

            <div>
              <label htmlFor="prop-title" className={labelClass}>
                Listing title *
              </label>
              <input
                id="prop-title"
                type="text"
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Sea-Facing 3 BHK at Worli"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="prop-listing-type" className={labelClass}>
                  Listing type *
                </label>
                <select
                  id="prop-listing-type"
                  value={listingType}
                  onChange={(event) => setListingType(event.target.value as ListingType)}
                  className={inputClass}
                >
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                  <option value="commercial">Commercial Lease</option>
                </select>
              </div>

              <div>
                <label htmlFor="prop-category" className={labelClass}>
                  Category *
                </label>
                <select
                  id="prop-category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value as PropertyCategory)}
                  className={inputClass}
                >
                  <option value="Apartment">Apartment / Flat</option>
                  <option value="Villa">Villa</option>
                  <option value="House">House / Bungalow</option>
                  <option value="Plot">Residential Plot</option>
                  <option value="Commercial">Commercial Office</option>
                </select>
              </div>

              <div>
                <label htmlFor="prop-price" className={labelClass}>
                  {listingType === 'rent' ? 'Monthly rent (₹) *' : 'Price (₹) *'}
                </label>
                <div className="relative">
                  <IndianRupee className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-bone-400" />
                  <input
                    id="prop-price"
                    type="text"
                    inputMode="decimal"
                    required
                    value={priceInput}
                    onChange={(event) => setPriceInput(event.target.value)}
                    placeholder={listingType === 'rent' ? 'e.g. 75000' : 'e.g. 1.25 Cr'}
                    className={`${inputClass} pl-8`}
                  />
                </div>
                <p className="mt-1 text-[10px] text-bone-500">
                  Accepts “1.25 Cr”, “85 Lakh”, “75,000” or a plain number.
                </p>
              </div>
            </div>
          </div>

          {/* 2. Location */}
          <div className="space-y-4">
            <h4 className={sectionClass}>2 · Location</h4>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="prop-location" className={labelClass}>
                  Display locality *
                </label>
                <input
                  id="prop-location"
                  type="text"
                  required
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="e.g. Bandra West, Mumbai"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="prop-address" className={labelClass}>
                  Project / street address *
                </label>
                <input
                  id="prop-address"
                  type="text"
                  required
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  placeholder="e.g. Hill Road, Bandra West"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="prop-city" className={labelClass}>
                  City *
                </label>
                <select
                  id="prop-city"
                  value={city}
                  onChange={(event) => handleCityChange(event.target.value)}
                  className={inputClass}
                >
                  {INDIAN_CITIES.map((item) => (
                    <option key={item.name} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="prop-state" className={labelClass}>
                    State
                  </label>
                  <select
                    id="prop-state"
                    value={state}
                    onChange={(event) => setState(event.target.value)}
                    className={inputClass}
                  >
                    {INDIAN_STATES.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="prop-zip" className={labelClass}>
                    PIN code
                  </label>
                  <input
                    id="prop-zip"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={zipCode}
                    onChange={(event) => setZipCode(event.target.value.replace(/\D/g, ''))}
                    placeholder="400050"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Areas & specs */}
          <div className="space-y-4">
            <h4 className={sectionClass}>3 · Areas & specifications</h4>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div>
                <label htmlFor="prop-bedrooms" className={labelClass}>
                  Bedrooms (BHK)
                </label>
                <input
                  id="prop-bedrooms"
                  type="number"
                  min={0}
                  max={20}
                  value={bedrooms}
                  onChange={(event) => setBedrooms(event.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="prop-bathrooms" className={labelClass}>
                  Bathrooms
                </label>
                <input
                  id="prop-bathrooms"
                  type="number"
                  min={0}
                  max={20}
                  value={bathrooms}
                  onChange={(event) => setBathrooms(event.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="prop-sqft" className={labelClass}>
                  Super built-up (sq ft)
                </label>
                <input
                  id="prop-sqft"
                  type="number"
                  min={0}
                  value={sqft}
                  onChange={(event) => setSqft(event.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="prop-year" className={labelClass}>
                  Year built
                </label>
                <input
                  id="prop-year"
                  type="number"
                  min={1900}
                  max={2100}
                  value={yearBuilt}
                  onChange={(event) => setYearBuilt(event.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="prop-carpet" className={labelClass}>
                  Carpet area (sq ft)
                </label>
                <input
                  id="prop-carpet"
                  type="number"
                  min={0}
                  value={carpetArea}
                  onChange={(event) => setCarpetArea(event.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="prop-builtup" className={labelClass}>
                  Built-up area (sq ft)
                </label>
                <input
                  id="prop-builtup"
                  type="number"
                  min={0}
                  value={builtUpArea}
                  onChange={(event) => setBuiltUpArea(event.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="prop-lot" className={labelClass}>
                  Plot size
                </label>
                <input
                  id="prop-lot"
                  type="text"
                  value={lotSize}
                  onChange={(event) => setLotSize(event.target.value)}
                  placeholder="2,400 sq ft plot"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="prop-balconies" className={labelClass}>
                  Balconies
                </label>
                <input
                  id="prop-balconies"
                  type="number"
                  min={0}
                  value={balconies}
                  onChange={(event) => setBalconies(event.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div>
                <label htmlFor="prop-garage" className={labelClass}>
                  Covered parking
                </label>
                <input
                  id="prop-garage"
                  type="number"
                  min={0}
                  value={garage}
                  onChange={(event) => setGarage(event.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="prop-open-parking" className={labelClass}>
                  Open parking
                </label>
                <input
                  id="prop-open-parking"
                  type="number"
                  min={0}
                  value={openParking}
                  onChange={(event) => setOpenParking(event.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="prop-floor" className={labelClass}>
                  Floor
                </label>
                <input
                  id="prop-floor"
                  type="number"
                  min={0}
                  value={floor}
                  onChange={(event) => setFloor(event.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="prop-total-floors" className={labelClass}>
                  Total floors
                </label>
                <input
                  id="prop-total-floors"
                  type="number"
                  min={0}
                  value={totalFloors}
                  onChange={(event) => setTotalFloors(event.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="prop-furnishing" className={labelClass}>
                  Furnishing
                </label>
                <select
                  id="prop-furnishing"
                  value={furnishing}
                  onChange={(event) => setFurnishing(event.target.value)}
                  className={inputClass}
                >
                  {FURNISHING_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="prop-possession" className={labelClass}>
                  Possession
                </label>
                <select
                  id="prop-possession"
                  value={possession}
                  onChange={(event) => setPossession(event.target.value)}
                  className={inputClass}
                >
                  {POSSESSION_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="prop-facing" className={labelClass}>
                  Facing
                </label>
                <select
                  id="prop-facing"
                  value={facing}
                  onChange={(event) => setFacing(event.target.value)}
                  className={inputClass}
                >
                  {FACING_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="prop-overlooking" className={labelClass}>
                  Overlooking
                </label>
                <input
                  id="prop-overlooking"
                  type="text"
                  value={overlooking}
                  onChange={(event) => setOverlooking(event.target.value)}
                  placeholder="Sea / Garden / Pool"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* 4. Charges & compliance */}
          <div className="space-y-4">
            <h4 className={sectionClass}>4 · Charges & compliance</h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label htmlFor="prop-maintenance" className={labelClass}>
                  Maintenance (₹ / month)
                </label>
                <input
                  id="prop-maintenance"
                  type="number"
                  min={0}
                  value={maintenance}
                  onChange={(event) => setMaintenance(event.target.value)}
                  placeholder="4200"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="prop-deposit" className={labelClass}>
                  Security deposit (₹)
                </label>
                <input
                  id="prop-deposit"
                  type="number"
                  min={0}
                  value={securityDeposit}
                  onChange={(event) => setSecurityDeposit(event.target.value)}
                  placeholder="1110000"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="prop-rera" className={labelClass}>
                  RERA registration number
                </label>
                <input
                  id="prop-rera"
                  type="text"
                  value={rera}
                  onChange={(event) => setRera(event.target.value)}
                  placeholder="P51900012345"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* 5. Photography */}
          <div className="space-y-4">
            <h4 className={sectionClass}>5 · Photography</h4>

            <div>
              <label htmlFor="prop-image" className={labelClass}>
                Main photograph URL
              </label>
              <input
                id="prop-image"
                type="url"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="https://images.unsplash.com/…"
                className={inputClass}
              />
            </div>

            <div>
              <span className="mb-2 block text-[11px] font-semibold text-bone-500">
                Or pick a curated preset
              </span>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                      imageUrl === preset.url
                        ? 'border-gold-500 ring-2 ring-gold-500/30'
                        : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                    title={preset.label}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      width={120}
                      height={120}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="prop-additional-image" className={labelClass}>
                Add gallery photographs
              </label>
              <div className="flex gap-2">
                <input
                  id="prop-additional-image"
                  type="url"
                  value={newImageInput}
                  onChange={(event) => setNewImageInput(event.target.value)}
                  placeholder="https://images.unsplash.com/…"
                  className={`${inputClass} flex-1`}
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-ink-900 px-4 text-xs font-bold text-bone-50 transition-colors hover:bg-ink-800"
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  Add
                </button>
              </div>
              {additionalImages.length > 0 && (
                <div className="scrollbar-none mt-2 flex gap-2 overflow-x-auto py-1">
                  {additionalImages.map((image, index) => (
                    <div
                      key={index}
                      className="relative h-12 w-16 shrink-0 overflow-hidden rounded border border-bone-300"
                    >
                      <img
                        src={image}
                        alt=""
                        width={64}
                        height={48}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveAdditionalImage(index)}
                        aria-label="Remove photograph"
                        className="absolute right-0.5 top-0.5 grid h-4 w-4 place-items-center rounded-full bg-rose-600 text-[10px] font-bold text-white"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 6. Description & amenities */}
          <div className="space-y-4">
            <h4 className={sectionClass}>6 · Description & amenities</h4>

            <div>
              <label htmlFor="prop-description" className={labelClass}>
                Full description
              </label>
              <textarea
                id="prop-description"
                rows={4}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Layout, light and ventilation, society specifications, view orientation, proximity to metro and schools…"
                className={`${inputClass} resize-none`}
              />
            </div>

            <div>
              <span className="mb-2 block text-[11px] font-semibold text-bone-500">
                Included amenities ({selectedAmenities.length} selected)
              </span>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {AMENITY_OPTIONS.map((amenity) => {
                  const isSelected = selectedAmenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      aria-pressed={isSelected}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs font-medium transition-all ${
                        isSelected
                          ? 'border-gold-400 bg-gold-50 font-bold text-gold-900'
                          : 'border-bone-300 bg-bone-50 text-ink-600 hover:bg-bone-100'
                      }`}
                    >
                      <span
                        className={`grid h-3.5 w-3.5 shrink-0 place-items-center rounded border ${
                          isSelected ? 'border-gold-600 bg-gold-600 text-white' : 'border-bone-400'
                        }`}
                      >
                        {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                      </span>
                      <span className="truncate">{amenity}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-bone-200 pt-5">
            <MagneticButton variant="ghost" size="md" onClick={onClose} type="button">
              Cancel
            </MagneticButton>
            <MagneticButton
              id="submit-property-form-btn"
              variant="ink"
              size="md"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Sparkles className="h-4 w-4 animate-pulse text-gold-400" />
                  Saving…
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 text-gold-400" />
                  {propertyToEdit ? 'Save Changes' : 'Publish Listing'}
                </>
              )}
            </MagneticButton>
          </div>

          <p className="flex items-start gap-2 text-[11px] leading-relaxed text-bone-500">
            <Ruler className="mt-0.5 h-3.5 w-3.5 shrink-0 text-bone-400" />
            Please publish the actual carpet area. Listings with accurate area data convert roughly
            three times better and are prioritised in search results.
          </p>
        </form>
      )}
    </Modal>
  );
};
