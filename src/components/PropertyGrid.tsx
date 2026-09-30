import React from 'react';
import { Search } from 'lucide-react';
import type { Property } from '../types';
import { PropertyCard } from './PropertyCard';

interface PropertyGridProps {
  properties: Property[];
  loading?: boolean;
  favorites: string[];
  onSelect: (property: Property) => void;
  onBookViewing: (property: Property) => void;
  onEditProperty: (property: Property) => void;
  onDeleteProperty: (property: Property) => void;
  onToggleFavorite: (propertyId: string) => void;
  emptyMessage?: string;
  skeletonCount?: number;
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({
  properties,
  loading = false,
  favorites,
  onSelect,
  onBookViewing,
  onEditProperty,
  onDeleteProperty,
  onToggleFavorite,
  emptyMessage = 'No properties available right now.',
  skeletonCount = 4,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: skeletonCount }).map((_, n) => (
          <div key={n} className="bg-white rounded-xl overflow-hidden border border-stone-200 shadow-xs animate-pulse">
            <div className="w-full h-52 bg-stone-200"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-stone-200 rounded w-3/4"></div>
              <div className="h-3 bg-stone-100 rounded w-1/2"></div>
              <div className="h-6 bg-stone-100 rounded w-full"></div>
              <div className="h-5 bg-amber-100 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 max-w-xl mx-auto shadow-xs">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 font-serif-luxury">No properties found</h3>
        <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          onSelect={onSelect}
          onBookViewing={onBookViewing}
          onEdit={onEditProperty}
          onDelete={onDeleteProperty}
          isFavorite={favorites.includes(property.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
};
