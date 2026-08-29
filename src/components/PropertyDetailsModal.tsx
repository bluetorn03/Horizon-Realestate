import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  BedDouble, 
  Bath, 
  Maximize2, 
  Calendar, 
  Heart, 
  Share2, 
  Check, 
  ShieldCheck, 
  User, 
  Phone, 
  Mail, 
  Edit, 
  Trash2, 
  Car, 
  Building, 
  Compass, 
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import type { Property } from '../types';
import { useAuth } from '../context/AuthContext';

interface PropertyDetailsModalProps {
  property: Property | null;
  onClose: () => void;
  onBookViewing: (property: Property) => void;
  onEditProperty: (property: Property) => void;
  onDeleteProperty: (property: Property) => void;
  isFavorite: boolean;
  onToggleFavorite: (propertyId: string) => void;
}

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

  const isOwner = user && property.ownerId === user.uid;

  const images = property.images && property.images.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80'];

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(property.price);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        id="property-details-container"
        className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col border border-stone-200 animate-in zoom-in-95 duration-200"
      >
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-3">
            <span 
              className={`text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded text-white shadow-xs ${
                property.listingType === 'sale'
                  ? 'bg-amber-600'
                  : property.listingType === 'rent'
                  ? 'bg-slate-900'
                  : 'bg-emerald-700'
              }`}
            >
              {property.listingType === 'sale' ? 'FOR SALE' : property.listingType === 'rent' ? 'FOR RENT' : 'COMMERCIAL'}
            </span>
            <span className="bg-white border border-stone-200 text-slate-800 text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded">
              {property.category}
            </span>
            {property.featured && (
              <span className="bg-amber-100 text-amber-900 text-[11px] font-bold px-2.5 py-1 rounded">
                ★ Featured
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              id="details-share-btn"
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-stone-200 text-slate-600 transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Share property link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Link Copied' : 'Share'}</span>
            </button>

            <button
              id="details-favorite-btn"
              onClick={() => onToggleFavorite(property.id)}
              className="p-2 rounded-full hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors"
              title={isFavorite ? 'Remove Favorite' : 'Save to Favorites'}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-600 text-rose-600' : ''}`} />
            </button>

            <button
              id="details-close-btn"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-stone-200 text-slate-500 hover:text-slate-900 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-8 space-y-8">
          {/* Gallery Carousel */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-xl overflow-hidden bg-stone-900 shadow-md group">
              <img
                src={images[activeImageIndex]}
                alt={property.title}
                className="w-full h-full object-cover transition-all duration-300"
                referrerPolicy="no-referrer"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                    {activeImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      activeImageIndex === idx ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Price Bar */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-200">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif-luxury">
                {property.title}
              </h1>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-2">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{property.address ? `${property.address}, ` : ''}{property.location || property.city}</span>
              </div>
            </div>

            <div className="text-left md:text-right">
              <div className="text-2xl sm:text-3xl font-bold text-[#b47c28] tracking-tight">
                {formattedPrice}
                {property.listingType === 'rent' && <span className="text-xs text-slate-500 font-normal ml-1">/ Month</span>}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Property ID: #{property.id.slice(0, 8).toUpperCase()}
              </div>
            </div>
          </div>

          {/* Key Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-stone-50 rounded-xl border border-stone-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-amber-700 shadow-xs">
                <BedDouble className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Bedrooms</div>
                <div className="text-sm font-bold text-slate-900">
                  {property.bedrooms > 0 ? `${property.bedrooms} Beds` : property.category === 'Plot' ? 'N/A' : 'Studio / Office'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-amber-700 shadow-xs">
                <Bath className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Bathrooms</div>
                <div className="text-sm font-bold text-slate-900">
                  {property.bathrooms > 0 ? `${property.bathrooms} Baths` : 'N/A'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-amber-700 shadow-xs">
                <Maximize2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Total Area</div>
                <div className="text-sm font-bold text-slate-900">
                  {property.sqft > 0 ? `${property.sqft.toLocaleString()} Sq Ft` : property.lotSize || 'N/A'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-amber-700 shadow-xs">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Year Built</div>
                <div className="text-sm font-bold text-slate-900">
                  {property.yearBuilt || 'Contemporary'}
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-serif-luxury mb-3">
              Property Description
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Amenities Checklist */}
          {property.amenities && property.amenities.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-serif-luxury mb-4">
                Key Features & Amenities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {property.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2.5 bg-stone-50 rounded-lg border border-stone-200/80">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-xs font-semibold text-slate-800">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Owner / Listing Agent Profile */}
          <div className="p-6 bg-slate-900 text-white rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={property.ownerPhoto || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80'}
                alt={property.ownerName || 'Agent'}
                className="w-14 h-14 rounded-full object-cover border-2 border-amber-500/80"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                  {isOwner ? 'Listed by You (Owner)' : 'Designated Private Advisor'}
                </div>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {property.ownerName || 'Horizon Premier Advisor'}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-1.5">
                  {property.ownerEmail && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-amber-400" />
                      <span>{property.ownerEmail}</span>
                    </span>
                  )}
                  {property.ownerPhone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-amber-400" />
                      <span>{property.ownerPhone}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Book Viewing CTA button inside card */}
            <button
              id="details-book-viewing-cta"
              onClick={() => onBookViewing(property)}
              className="w-full md:w-auto bg-[#d8a853] hover:bg-[#c9973e] text-slate-950 font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 cursor-pointer shrink-0 transition-transform transform hover:-translate-y-0.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Private Viewing</span>
            </button>
          </div>

          {/* Owner Edit / Delete Controls */}
          {isOwner && (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-700" />
                <span className="text-xs font-bold text-amber-900">
                  You are the verified owner of this listing.
                </span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  id="details-edit-prop-btn"
                  onClick={() => onEditProperty(property)}
                  className="flex-1 sm:flex-initial px-4 py-2 bg-white border border-amber-300 text-amber-900 rounded-lg text-xs font-bold hover:bg-amber-100 flex items-center justify-center gap-1.5"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Listing</span>
                </button>
                <button
                  id="details-delete-prop-btn"
                  onClick={() => onDeleteProperty(property)}
                  className="flex-1 sm:flex-initial px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Listing</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
