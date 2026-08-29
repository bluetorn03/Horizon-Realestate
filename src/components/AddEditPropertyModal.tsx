import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Building, 
  Home, 
  MapPin, 
  DollarSign, 
  Check, 
  Image as ImageIcon, 
  Layers, 
  Sparkles,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Property, PropertyCategory, ListingType } from '../types';
import { useAuth } from '../context/AuthContext';
import { createProperty, updateProperty } from '../lib/firebase';

interface AddEditPropertyModalProps {
  propertyToEdit?: Property | null;
  onClose: () => void;
  onOpenAuth: () => void;
  onSuccess: (property: Property, isEdit: boolean) => void;
}

export const AddEditPropertyModal: React.FC<AddEditPropertyModalProps> = ({
  propertyToEdit,
  onClose,
  onOpenAuth,
  onSuccess,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState(propertyToEdit?.title || '');
  const [description, setDescription] = useState(propertyToEdit?.description || '');
  const [price, setPrice] = useState<number | string>(propertyToEdit?.price || '');
  const [listingType, setListingType] = useState<ListingType>(propertyToEdit?.listingType || 'sale');
  const [category, setCategory] = useState<PropertyCategory>(propertyToEdit?.category || 'House');
  const [location, setLocation] = useState(propertyToEdit?.location || '');
  const [address, setAddress] = useState(propertyToEdit?.address || '');
  const [city, setCity] = useState(propertyToEdit?.city || '');
  const [state, setState] = useState(propertyToEdit?.state || '');
  const [zipCode, setZipCode] = useState(propertyToEdit?.zipCode || '');
  const [bedrooms, setBedrooms] = useState<number | string>(propertyToEdit?.bedrooms ?? 3);
  const [bathrooms, setBathrooms] = useState<number | string>(propertyToEdit?.bathrooms ?? 2);
  const [sqft, setSqft] = useState<number | string>(propertyToEdit?.sqft ?? 2400);
  const [lotSize, setLotSize] = useState(propertyToEdit?.lotSize || '');
  const [yearBuilt, setYearBuilt] = useState<number | string>(propertyToEdit?.yearBuilt ?? 2023);
  const [imageUrl, setImageUrl] = useState(propertyToEdit?.images?.[0] || '');
  const [additionalImages, setAdditionalImages] = useState<string[]>(propertyToEdit?.images?.slice(1) || []);
  const [newImageInput, setNewImageInput] = useState('');
  
  // Amenities list
  const availableAmenities = [
    'Private Pool',
    'Smart Home System',
    'Chef Kitchen',
    'Wine Cellar',
    'Garage / Reserved Parking',
    'Central AC & Heating',
    'Security System',
    'Balcony / Terrace',
    'Ocean View',
    'Mountain Views',
    '24/7 Concierge',
    'Fitness Studio',
    'Zen Garden',
    'High-Speed Fiber'
  ];

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    propertyToEdit?.amenities || ['Smart Home System', 'Central AC & Heating', 'Garage / Reserved Parking']
  );

  // Preset luxury architectural images for convenience
  const luxuryPresets = [
    { label: 'Modern House', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Luxury Villa', url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Highrise Penthouse', url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Commercial Office', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Scenic Plot / Land', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Minimalist Estate', url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80' },
  ];

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleAddImage = () => {
    if (newImageInput.trim() && !additionalImages.includes(newImageInput.trim())) {
      setAdditionalImages([...additionalImages, newImageInput.trim()]);
      setNewImageInput('');
    }
  };

  const handleRemoveAdditionalImage = (index: number) => {
    setAdditionalImages(additionalImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }

    if (!title || !price || !location || !city) {
      setError('Please provide property title, price, location, and city.');
      return;
    }

    const mainImg = imageUrl.trim() || luxuryPresets[0].url;
    const allImages = [mainImg, ...additionalImages];

    setLoading(true);
    setError(null);

    try {
      if (propertyToEdit) {
        // Update existing property
        await updateProperty(propertyToEdit.id, {
          title,
          description,
          price: Number(price),
          listingType,
          category,
          location,
          address,
          city,
          state,
          zipCode,
          bedrooms: Number(bedrooms) || 0,
          bathrooms: Number(bathrooms) || 0,
          sqft: Number(sqft) || 0,
          lotSize,
          yearBuilt: Number(yearBuilt) || 2023,
          images: allImages,
          amenities: selectedAmenities,
        });

        const updated: Property = {
          ...propertyToEdit,
          title,
          description,
          price: Number(price),
          listingType,
          category,
          location,
          address,
          city,
          state,
          zipCode,
          bedrooms: Number(bedrooms) || 0,
          bathrooms: Number(bathrooms) || 0,
          sqft: Number(sqft) || 0,
          lotSize,
          yearBuilt: Number(yearBuilt) || 2023,
          images: allImages,
          amenities: selectedAmenities,
          updatedAt: new Date().toISOString()
        };

        onSuccess(updated, true);
      } else {
        // Create new property
        const created = await createProperty({
          title,
          description: description || 'Spectacular property in prime location with premium finishes and luxury appointments.',
          price: Number(price),
          listingType,
          category,
          location,
          address: address || location,
          city,
          state: state || 'CA',
          zipCode: zipCode || '90210',
          bedrooms: Number(bedrooms) || 0,
          bathrooms: Number(bathrooms) || 0,
          sqft: Number(sqft) || 0,
          lotSize,
          yearBuilt: Number(yearBuilt) || 2024,
          images: allImages,
          featured: false,
          amenities: selectedAmenities,
          ownerId: user.uid,
          ownerName: user.displayName || 'Property Owner',
          ownerEmail: user.email || '',
          ownerPhone: '+1 (212) 555-7890',
          ownerPhoto: user.photoURL || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80',
        });

        // Trigger confetti celebration
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#d8a853', '#0b1329', '#10b981']
        });

        onSuccess(created, false);
      }
    } catch (err: any) {
      console.error('Error saving property:', err);
      setError(err.message || 'Failed to save property listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        id="add-edit-property-modal-container"
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col border border-stone-200 animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-slate-900 font-serif-luxury">
              {propertyToEdit ? 'Edit Property Listing' : 'List New Property For Sale / Rent'}
            </h3>
          </div>
          <button
            id="close-add-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!user ? (
          <div className="p-8 text-center bg-stone-50">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold font-serif-luxury text-slate-900">
              Sign In to List Your Property
            </h4>
            <p className="text-xs text-slate-600 mt-2 max-w-md mx-auto">
              You must be an authenticated member to list properties on Horizon Estates, manage pricing, and receive client viewing requests.
            </p>
            <div className="mt-6">
              <button
                id="add-modal-signin-btn"
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="px-6 py-2.5 bg-[#0b1329] hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md"
              >
                Sign In / Sign Up Now
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-y-auto p-6 sm:p-8 space-y-6">
            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-medium">
                {error}
              </div>
            )}

            {/* Basic Info */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 border-b border-stone-100 pb-2">
                1. Core Property Information
              </h4>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                  Property Title / Name *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Modern Sunset Villa with Infinity Pool"
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Listing Type *
                  </label>
                  <select
                    value={listingType}
                    onChange={(e) => setListingType(e.target.value as ListingType)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as PropertyCategory)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="House">House</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Plot">Plot / Land</option>
                    <option value="Villa">Luxury Villa</option>
                    <option value="Commercial">Commercial Office</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Price (USD $) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 2850000"
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Location Details */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 border-b border-stone-100 pb-2">
                2. Location & Address
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Display Location (City, State) *
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Beverly Hills, California"
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 742 Evergreen Crest Way"
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Beverly Hills"
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="CA"
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="90210"
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 border-b border-stone-100 pb-2">
                3. Dimensions & Specifications
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Sq Ft Area
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={sqft}
                    onChange={(e) => setSqft(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Year Built
                  </label>
                  <input
                    type="number"
                    value={yearBuilt}
                    onChange={(e) => setYearBuilt(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Photos & Presets */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 border-b border-stone-100 pb-2">
                4. Property Images
              </h4>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                  Main Photo URL (or select preset below) *
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Preset selector */}
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-2">
                  Quick Select Premium Presets:
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {luxuryPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImageUrl(preset.url)}
                      className={`relative rounded-lg overflow-hidden border-2 aspect-video group text-left transition-all ${
                        imageUrl === preset.url ? 'border-amber-600 ring-2 ring-amber-500/30' : 'border-transparent opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/40 flex items-end p-1 text-[9px] font-bold text-white leading-tight">
                        {preset.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Images list */}
              <div>
                <div className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={newImageInput}
                    onChange={(e) => setNewImageInput(e.target.value)}
                    placeholder="Add additional gallery photo URL..."
                    className="flex-1 bg-stone-50 border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-3 py-1.5 bg-stone-800 text-white rounded-lg text-xs font-semibold hover:bg-black"
                  >
                    Add
                  </button>
                </div>
                {additionalImages.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto py-1">
                    {additionalImages.map((img, i) => (
                      <div key={i} className="relative w-16 h-12 rounded border overflow-hidden shrink-0 group">
                        <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <button
                          type="button"
                          onClick={() => handleRemoveAdditionalImage(i)}
                          className="absolute top-0.5 right-0.5 bg-rose-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Narrative & Amenities */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 border-b border-stone-100 pb-2">
                5. Description & Key Amenities
              </h4>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                  Full Property Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe architectural features, view orientation, designer appliances, and lifestyle amenities..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-700 mb-2">
                  Select Included Amenities
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableAmenities.map((amenity) => {
                    const isSelected = selectedAmenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-left border transition-all ${
                          isSelected
                            ? 'bg-amber-50 border-amber-400 text-amber-900 font-bold'
                            : 'bg-stone-50 border-stone-200 text-slate-600 hover:bg-stone-100'
                        }`}
                      >
                        <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                          isSelected ? 'bg-amber-600 border-amber-600 text-white' : 'border-stone-300'
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                        <span className="truncate">{amenity}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                id="submit-property-form-btn"
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-[#0b1329] hover:bg-slate-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-md disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>{loading ? 'Saving Listing...' : propertyToEdit ? 'Save Changes' : 'Publish Property Listing'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
