import React from 'react';
import { useBookstore } from '../context/BookstoreContext';

export const Footer = () => {
  const { setActiveView } = useBookstore();

  return (
    <footer className="w-full bg-surface-container-high border-t border-surface-container mt-16 text-xs text-on-surface-variant">
      <div className="max-w-[1280px] mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Brand & Mission */}
        <div className="md:col-span-4 flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">auto_stories</span>
            </div>
            <span className="font-headline-sm text-lg text-primary font-bold">PageHaven</span>
          </div>
          <p className="text-on-surface-variant leading-relaxed">
            A serene sanctuary uniting the rich physical heritage of classical bookmaking with state-of-the-art digital reading technology. All folios are preserved to museum-grade standards.
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-0.5 rounded bg-surface-container text-primary font-bold text-[10px] uppercase tracking-wider border border-surface-container-highest">
              Acid-Free Guaranteed
            </span>
            <span className="px-2 py-0.5 rounded bg-surface-container text-primary font-bold text-[10px] uppercase tracking-wider border border-surface-container-highest">
              Smyth-Sewn Cloth
            </span>
          </div>
        </div>

        {/* Salons & Wings */}
        <div className="md:col-span-3 flex flex-col gap-2">
          <h4 className="font-bold text-on-surface text-xs uppercase tracking-wider mb-1">
            Archival Wings & Salons
          </h4>
          <button
            onClick={() => { setActiveView('story-fiction'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="text-left hover:text-primary transition-colors cursor-pointer"
          >
            Story & Acclaimed Fiction
          </button>
          <button
            onClick={() => { setActiveView('comics-graphic'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="text-left hover:text-primary transition-colors cursor-pointer"
          >
            Comics & Graphic Novel Masterworks
          </button>
          <button
            onClick={() => { setActiveView('anime-manga'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="text-left hover:text-primary transition-colors cursor-pointer"
          >
            Anime & Manga Vault (Tankobon)
          </button>
          <button
            onClick={() => { setActiveView('wisdom-mind'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="text-left hover:text-primary transition-colors cursor-pointer"
          >
            Motivational & Human Wisdom
          </button>
          <button
            onClick={() => { setActiveView('magazines-gk'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="text-left hover:text-primary transition-colors cursor-pointer"
          >
            Periodicals, GK & University Stacks
          </button>
        </div>

        {/* Services & Sanctuary Care */}
        <div className="md:col-span-3 flex flex-col gap-2">
          <h4 className="font-bold text-on-surface text-xs uppercase tracking-wider mb-1">
            Patron Services
          </h4>
          <button
            onClick={() => { setActiveView('my-library'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="text-left hover:text-primary transition-colors cursor-pointer"
          >
            Digital E-Library Access (21-Day Loans)
          </button>
          <button
            onClick={() => { setActiveView('help-care'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="text-left hover:text-primary transition-colors cursor-pointer"
          >
            14-Day Doorstep Courier Returns
          </button>
          <button
            onClick={() => { setActiveView('help-care'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="text-left hover:text-primary transition-colors cursor-pointer"
          >
            White Glove Parcel Telemetry
          </button>
          <button
            onClick={() => { setActiveView('ai-concierge'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="text-left hover:text-primary transition-colors cursor-pointer"
          >
            ReadGenius AI Literary Guide
          </button>
        </div>

        {/* Hours & Sanctuary Guarantee */}
        <div className="md:col-span-2 flex flex-col gap-2">
          <h4 className="font-bold text-on-surface text-xs uppercase tracking-wider mb-1">
            Sanctuary Hours
          </h4>
          <p className="text-on-surface-variant leading-relaxed">
            Digital Stacks: Open 24/7<br />
            White Glove Logistics: Monday – Saturday, 08:00 – 20:00 EST
          </p>
          <p className="text-[11px] text-outline mt-2">
            Archival Preservation Center<br />
            New Haven, CT
          </p>
        </div>
      </div>

      <div className="border-t border-surface-container py-4 text-center text-[11px] text-outline">
        © {new Date().getFullYear()} PageHaven Bookstore & Curated E-Library. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
