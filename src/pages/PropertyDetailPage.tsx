import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  Building,
  Calendar,
  Heart,
  Share2,
  Check,
  Phone,
  Mail,
  Edit,
  Trash2,
  ShieldCheck,
  Car,
  ArrowLeft,
} from 'lucide-react';
import type { Property } from '../types';
import { useAuth } from '../context/AuthContext';
import { useSite } from '../context/SiteContext';
import { fetchPropertyById } from '../lib/firebase';
import { formatPropertyPrice } from '../lib/format';
import { PropertyGrid } from '../components/PropertyGrid';

export const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const {
    properties,
    loading,
    favorites,
    isFavorite,
    toggleFavorite,
    openBookViewing,
    openEditProperty,
    removeProperty,
    viewProperty,
    openAuth,
  } = useSite();

  const [property, setProperty] = useState<Property | null>(null);
  const [fetching, setFetching] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    const fromList = properties.find((p) => p.id === id);
    if (fromList) {
      setProperty(fromList);
      setFetching(false);
      return;
    }
    if (loading) return;

    setFetching(true);
    fetchPropertyById(id || '')
      .then((found) => {
        if (active) {
          setProperty(found);
          setFetching(false);
        }
      })
      .catch(() => active && setFetching(false));
    return () => {
      active = false;
    };
  }, [id, properties, loading]);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [id]);

  if (fetching) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-20">
        <div className="h-8 w-48 bg-stone-200 rounded animate-pulse mb-6" />
        <div className="h-[360px] w-full bg-stone-200 rounded-2xl animate-pulse mb-6" />
        <div className="h-6 w-2/3 bg-stone-200 rounded animate-pulse mb-3" />
        <div className="h-4 w-1/3 bg-stone-100 rounded animate-pulse" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900 font-serif-luxury">Property not found</h1>
        <p className="text-sm text-slate-500 mt-3">
          The listing you are looking for may have been sold, withdrawn or moved.
        </p>
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-[#0b1329] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Properties</span>
        </Link>
      </div>
    );
  }

  const isOwner = !!user && property.ownerId === user.uid;
  const images =
    property.images && property.images.length > 0
      ? property.images
      : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80'];

  const similar = properties
    .filter((p) => p.id !== property.id && p.category === property.category)
    .slice(0, 4);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const specs = [
    { icon: BedDouble, label: 'Bedrooms', value: property.bedrooms > 0 ? `${property.bedrooms} Beds` : property.category === 'Plot' ? 'N/A' : 'Studio / Office' },
    { icon: Bath, label: 'Bathrooms', value: property.bathrooms > 0 ? `${property.bathrooms} Baths` : 'N/A' },
    { icon: Maximize2, label: 'Total Area', value: property.sqft > 0 ? `${property.sqft.toLocaleString('en-IN')} Sq Ft` : property.lotSize || 'N/A' },
    { icon: Building, label: 'Year Built', value: property.yearBuilt ? String(property.yearBuilt) : 'Contemporary' },
  ];

  return (
    <div className="bg-stone-50">
      {/* Breadcrumb bar */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <nav className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            <Link to="/" className="hover:text-amber-700">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link to="/properties" className="hover:text-amber-700">Properties</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-amber-700 truncate max-w-[160px]">{property.title}</span>
          </nav>

          <div className="flex items-center gap-2">
            <button
              id="details-share-btn"
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-stone-100 text-slate-600 transition-colors flex items-center gap-1 text-xs font-semibold"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Link Copied' : 'Share'}</span>
            </button>
            <button
              id="details-favorite-btn"
              onClick={() => toggleFavorite(property.id)}
              className="p-2 rounded-full hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors"
              title={isFavorite(property.id) ? 'Remove Favorite' : 'Save to Favorites'}
            >
              <Heart className={`w-5 h-5 ${isFavorite(property.id) ? 'fill-rose-600 text-rose-600' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-10 space-y-10">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden bg-stone-900 shadow-md group">
            <img
              src={images[activeImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover transition-all duration-300"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span
                className={`text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded text-white shadow-sm ${
                  property.listingType === 'sale' ? 'bg-amber-600' : property.listingType === 'rent' ? 'bg-slate-900' : 'bg-emerald-700'
                }`}
              >
                {property.listingType === 'sale' ? 'FOR SALE' : property.listingType === 'rent' ? 'FOR RENT' : 'COMMERCIAL'}
              </span>
              <span className="bg-white/90 backdrop-blur-xs text-slate-800 text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded">
                {property.category}
              </span>
            </div>

            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
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

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-24 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    activeImageIndex === idx ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Title & Price */}
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
              {formatPropertyPrice(property.price, property.listingType)}
              {property.listingType === 'rent' && <span className="text-xs text-slate-500 font-normal ml-1">/ Month</span>}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Property ID: #{property.id.slice(0, 8).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-white rounded-xl border border-stone-200">
          {specs.map((spec) => (
            <div key={spec.label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-center text-amber-700 shadow-xs">
                <spec.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">{spec.label}</div>
                <div className="text-sm font-bold text-slate-900">{spec.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-serif-luxury mb-3">Property Description</h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {property.amenities && property.amenities.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-serif-luxury mb-4">Key Features & Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-stone-200">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-xs font-semibold text-slate-800">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(property.lotSize || property.garage) && (
              <div className="grid grid-cols-2 gap-4">
                {property.lotSize && (
                  <div className="p-4 bg-white rounded-xl border border-stone-200 flex items-center gap-3">
                    <Maximize2 className="w-5 h-5 text-amber-700" />
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Plot / Carpet</div>
                      <div className="text-sm font-bold text-slate-900">{property.lotSize}</div>
                    </div>
                  </div>
                )}
                {property.garage ? (
                  <div className="p-4 bg-white rounded-xl border border-stone-200 flex items-center gap-3">
                    <Car className="w-5 h-5 text-amber-700" />
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Parking</div>
                      <div className="text-sm font-bold text-slate-900">{property.garage} Cars</div>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="p-6 bg-slate-900 text-white rounded-2xl">
              <div className="flex items-center gap-4 mb-5">
                <img
                  src={property.ownerPhoto || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80'}
                  alt={property.ownerName || 'Advisor'}
                  className="w-14 h-14 rounded-full object-cover border-2 border-amber-500/80"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                    {isOwner ? 'Listed by You' : 'Designated Private Advisor'}
                  </div>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    {property.ownerName || 'Horizon Premier Advisor'}
                  </h3>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300 mb-5">
                {property.ownerEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>{property.ownerEmail}</span>
                  </div>
                )}
                {property.ownerPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>{property.ownerPhone}</span>
                  </div>
                )}
              </div>

              <button
                id="details-book-viewing-cta"
                onClick={() => openBookViewing(property)}
                className="w-full bg-[#d8a853] hover:bg-[#c9973e] text-slate-950 font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-transform transform hover:-translate-y-0.5"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Private Viewing</span>
              </button>

              {!user && (
                <button
                  onClick={openAuth}
                  className="w-full mt-2 text-[11px] text-slate-300 hover:text-white underline"
                >
                  Sign in to book a viewing
                </button>
              )}
            </div>

            {isOwner && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-700" />
                  <span className="text-xs font-bold text-amber-900">
                    You are the verified owner of this listing.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    id="details-edit-prop-btn"
                    onClick={() => openEditProperty(property)}
                    className="flex-1 px-4 py-2 bg-white border border-amber-300 text-amber-900 rounded-lg text-xs font-bold hover:bg-amber-100 flex items-center justify-center gap-1.5"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Listing</span>
                  </button>
                  <button
                    id="details-delete-prop-btn"
                    onClick={() => removeProperty(property)}
                    className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Similar properties */}
        {similar.length > 0 && (
          <div className="pt-4">
            <h2 className="text-lg font-bold text-slate-900 font-serif-luxury mb-5">
              Similar {property.category} Listings
            </h2>
            <PropertyGrid
              properties={similar}
              favorites={favorites}
              onSelect={viewProperty}
              onBookViewing={openBookViewing}
              onEditProperty={openEditProperty}
              onDeleteProperty={removeProperty}
              onToggleFavorite={toggleFavorite}
            />
          </div>
        )}
      </div>
    </div>
  );
};
