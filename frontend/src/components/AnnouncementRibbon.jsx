import React from 'react';
import { useBookstore } from '../context/BookstoreContext';

export const AnnouncementRibbon = () => {
  const { applyVoucher, showToast } = useBookstore();

  const handleCopy = () => {
    navigator.clipboard?.writeText('PAGE25');
    applyVoucher('PAGE25');
  };

  return (
    <section className="w-full bg-surface-container-high py-2 px-6 mb-6 border-b border-surface-container">
      <div className="max-w-[1280px] mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-0.5 rounded bg-primary text-on-primary font-bold tracking-widest uppercase text-[10px]">
            Privilege
          </span>
          <span className="text-on-surface">
            Autumn Salon: Enjoy <strong className="font-semibold text-primary">25% archival savings</strong> across folios with keycode
          </span>
          <span className="font-bold text-primary bg-surface-container px-2 py-0.5 rounded tracking-wide border border-surface-container-highest">
            PAGE25
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="text-primary hover:text-primary-container flex items-center gap-1 font-semibold transition-colors cursor-pointer"
          title="Click to copy and apply discount"
        >
          <span className="material-symbols-outlined text-[15px]">content_copy</span>
          <span>Copy & Apply</span>
        </button>
      </div>
    </section>
  );
};

export default AnnouncementRibbon;
