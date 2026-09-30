import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';

export const SiteLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-slate-900 font-sans">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
