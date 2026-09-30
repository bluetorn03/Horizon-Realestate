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
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import type { Property } from '../types';
import { useAuth } from '../context/AuthContext';
import { formatPropertyPrice } from '../lib/format';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
  onBookViewing: (property: Property) => void;
  onEdit?: (property: Property) => void;
  onDelete?: (property: Property) => void;
  isFavorite: boolean;
  onToggleFavorite: (propertyId: string) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  onBookViewing,
  onEdit,
  onDelete,
  isFavorite,
  onToggleFavorite,
}) => {
  const { user } = useAuth();
  const isOwner = user && property.ownerId === user.uid;

  const formattedPrice = formatPropertyPrice(property.price, property.listingType);

  const primaryImage = property.images && property.images.length > 0
    ? property.images[0]
    : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80';

  return (
    <div 
      id={`property-card-${property.id}`}
      className="bg-white rounded-xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
    >
      {/* Property Image Container */}
      <div className="relative w-full h-56 bg-stone-100 overflow-hidden cursor-pointer" onClick={() => onSelect(property)}>
        <img
          src={primaryImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Badge: FOR SALE / FOR RENT / COMMERCIAL matching reference */}
        <div className="absolute top-3.5 left-3.5 z-10">
          <span 
            className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded shadow-sm text-white ${
              property.listingType === 'sale'
                ? 'bg-[#c98e32]'
                : property.listingType === 'rent'
                ? 'bg-slate-900'
                : 'bg-emerald-700'
            }`}
          >
            {property.listingType === 'sale' ? 'FOR SALE' : property.listingType === 'rent' ? 'FOR RENT' : 'COMMERCIAL'}
          </span>
          {property.featured && (
            <span className="ml-1.5 bg-indigo-900/90 text-amber-300 text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded shadow-sm">
              ★ FEATURED
            </span>
          )}
        </div>

        {/* Category Pill */}
        <div className="absolute bottom-3 left-3.5 z-10">
          <span className="bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded shadow-xs">
            {property.category}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          id={`favorite-btn-${property.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(property.id);
          }}
          className="absolute top-3.5 right-3.5 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-slate-700 hover:text-rose-600 transition-all shadow-sm focus:outline-none"
          title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${
              isFavorite ? 'fill-rose-600 text-rose-600' : 'text-slate-700'
            }`} 
          />
        </button>
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between">
        <div>
          {/* Property Title */}
          <h3 
            onClick={() => onSelect(property)}
            className="text-base font-bold text-slate-900 hover:text-amber-700 transition-colors cursor-pointer line-clamp-1"
          >
            {property.title}
          </h3>

          {/* Location with Map Pin */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5 mb-3.5">
            <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="truncate">{property.location || property.city}</span>
          </div>

          {/* Specs Row matching reference: Beds | Baths | Sq Ft */}
          <div className="grid grid-cols-3 gap-2 py-2.5 border-t border-b border-stone-100 text-xs text-slate-600 mb-4">
            {/* Bedrooms */}
            <div className="flex items-center gap-1.5 justify-start">
              <BedDouble className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="font-semibold text-slate-800">
                {property.bedrooms > 0 ? `${property.bedrooms} Beds` : property.category === 'Plot' ? 'Land' : '- Beds'}
              </span>
            </div>

            {/* Bathrooms */}
            <div className="flex items-center gap-1.5 justify-start">
              <Bath className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="font-semibold text-slate-800">
                {property.bathrooms > 0 ? `${property.bathrooms} Baths` : '- Baths'}
              </span>
            </div>

            {/* Sq Ft */}
            <div className="flex items-center gap-1.5 justify-start">
              <Maximize2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-semibold text-slate-800 truncate">
                {property.sqft > 0 ? `${property.sqft.toLocaleString()} Sq Ft` : property.lotSize || '- Sq Ft'}
              </span>
            </div>
          </div>
        </div>

        {/* Price & Actions Row */}
        <div>
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-lg sm:text-xl font-bold text-[#b47c28] tracking-tight">
                {formattedPrice}
              </span>
              {property.listingType === 'rent' && (
                <span className="text-xs text-slate-500 font-normal ml-1">/ Month</span>
              )}
            </div>
            {isOwner && (
              <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                Your Listing
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              id={`view-details-${property.id}`}
              onClick={() => onSelect(property)}
              className="w-full text-xs font-semibold py-2 px-3 rounded-md bg-stone-100 hover:bg-stone-200 text-slate-800 transition-colors text-center cursor-pointer"
            >
              Details
            </button>
            <button
              id={`book-viewing-${property.id}`}
              onClick={() => onBookViewing(property)}
              className="w-full text-xs font-semibold py-2 px-3 rounded-md bg-[#0b1329] hover:bg-slate-900 text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Viewing</span>
            </button>
          </div>

          {/* Owner Quick Controls */}
          {isOwner && onEdit && onDelete && (
            <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-end gap-2 text-xs">
              <button
                id={`edit-property-${property.id}`}
                onClick={() => onEdit(property)}
                className="flex items-center gap-1 text-slate-600 hover:text-amber-700 px-2 py-1 rounded hover:bg-amber-50"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                id={`delete-property-${property.id}`}
                onClick={() => onDelete(property)}
                className="flex items-center gap-1 text-rose-600 hover:text-rose-700 px-2 py-1 rounded hover:bg-rose-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
