import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { HeroSection } from '../components/HeroSection';
import { TrustBadges } from '../components/TrustBadges';
import { PropertyGrid } from '../components/PropertyGrid';
import { StatsCounter } from '../components/StatsCounter';
import { AboutSection } from '../components/AboutSection';
import { ServicesSection } from '../components/ServicesSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { ContactSection } from '../components/ContactSection';
import { useSite } from '../context/SiteContext';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    properties,
    loading,
    favorites,
    filters,
    locationsList,
    handleFilterChange,
    viewProperty,
    openBookViewing,
    openEditProperty,
    removeProperty,
    openAddProperty,
    toggleFavorite,
  } = useSite();

  const featured = properties.filter((p) => p.featured).slice(0, 8);

  return (
    <>
      {/* 1. Hero */}
      <HeroSection
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={() => navigate('/properties')}
        onExploreClick={() => navigate('/properties')}
        onLearnMoreClick={() => navigate('/about')}
        locationsList={locationsList}
      />

      {/* 2. Trust badges */}
      <TrustBadges />

      {/* 3. Featured properties */}
      <section id="properties-section" className="py-16 sm:py-20 bg-stone-50 px-4 sm:px-8 border-b border-stone-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="text-[11px] font-bold tracking-[0.2em] text-amber-700 uppercase mb-1.5">
                FEATURED PROPERTIES
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-950 font-serif-luxury tracking-tight">
                Explore Our Exclusive Properties
              </h2>
            </div>
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-900 hover:text-amber-700 uppercase tracking-wider transition-colors px-3 py-2 border border-slate-900 hover:border-amber-700 rounded-md"
            >
              <span>VIEW ALL PROPERTIES</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <PropertyGrid
            properties={featured}
            loading={loading}
            favorites={favorites}
            onSelect={viewProperty}
            onBookViewing={openBookViewing}
            onEditProperty={openEditProperty}
            onDeleteProperty={removeProperty}
            onToggleFavorite={toggleFavorite}
            emptyMessage="Our curated portfolio is being updated. Please check back shortly."
          />
        </div>
      </section>

      {/* 4. Stats */}
      <StatsCounter />

      {/* 5. About preview */}
      <AboutSection onLearnMore={() => navigate('/about')} />

      {/* 6. Services preview */}
      <ServicesSection
        onSelectCategory={(cat) =>
          navigate(cat === 'All' ? '/properties' : `/properties?category=${encodeURIComponent(cat)}`)
        }
        onOpenAddProperty={openAddProperty}
      />

      {/* 7. Testimonials */}
      <TestimonialsSection />

      {/* 8. Contact */}
      <ContactSection />
    </>
  );
};
