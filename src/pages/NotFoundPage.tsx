import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <section className="min-h-[60vh] flex items-center justify-center px-4 sm:px-8 py-24 bg-stone-50">
      <div className="text-center max-w-lg">
        <div className="text-6xl font-bold text-amber-500/30 font-serif-luxury mb-4">404</div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-950 font-serif-luxury">
          This page has moved on
        </h1>
        <p className="text-sm text-slate-600 mt-3">
          The page you are looking for could not be found. It may have been sold, withdrawn or renamed.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#0b1329] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-slate-900"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 px-5 py-3 border border-stone-300 text-slate-800 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-white"
          >
            <Search className="w-4 h-4" />
            <span>Browse Properties</span>
          </Link>
        </div>
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-amber-700 mt-8">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to the homepage</span>
        </Link>
      </div>
    </section>
  );
};
