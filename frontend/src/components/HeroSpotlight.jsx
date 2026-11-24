import React from 'react';
import { useBookstore } from '../context/BookstoreContext';

export const HeroSpotlight = () => {
  const { spotlightBook, addToBag, borrowBook, setActiveModalBook } = useBookstore();

  if (!spotlightBook) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface-container via-surface-container-low to-secondary-fixed/30 p-6 md:p-10 shadow-sm border border-surface-container">
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column Text & Details */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-surface-container-lowest text-primary font-bold text-xs uppercase tracking-wider shadow-sm border border-surface-container">
              Illuminated Masterpiece
            </span>
            <span className="text-xs text-outline">{spotlightBook.folioNumber || 'Folio No. 8492'}</span>
          </div>

          <h1 className="font-headline-lg text-3xl sm:text-4xl lg:text-5xl text-primary font-semibold tracking-tight">
            {spotlightBook.title}
          </h1>

          <p className="font-headline-sm text-base sm:text-lg text-on-surface-variant font-normal">
            By {spotlightBook.author} • {spotlightBook.edition || 'Archival Gilded Hardcover Edition'}
          </p>

          <blockquote className="pl-4 py-2 bg-surface-container-lowest/80 rounded-r-xl border-l-4 border-primary my-2 shadow-sm">
            <p className="font-headline-sm italic text-on-surface text-sm sm:text-base leading-relaxed">
              "{spotlightBook.excerpt}"
            </p>
          </blockquote>

          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            {spotlightBook.synopsis}
          </p>

          {/* Pricing, Edition, and Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 mt-3">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-primary font-headline-sm">
                  ${spotlightBook.price.toFixed(2)}
                </span>
                <span className="text-xs text-outline">Archival Hardbound</span>
              </div>
              <span className="text-xs text-outline">
                Digital E-Book: ${spotlightBook.digitalPrice.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => addToBag(spotlightBook, "Hardbound")}
                className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:bg-primary-container transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                <span>Acquire Masterpiece</span>
              </button>

              <button
                onClick={() => borrowBook(spotlightBook)}
                className="px-4 py-2.5 rounded-xl bg-surface-container-lowest text-primary font-semibold text-sm hover:bg-surface-container border border-surface-container transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">menu_book</span>
                <span>Borrow E-Copy</span>
              </button>

              <button
                onClick={() => setActiveModalBook(spotlightBook)}
                className="px-3 py-2.5 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors"
                title="Inspect folio details"
              >
                <span className="material-symbols-outlined text-[20px]">info</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column Cover Showcase */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div
            onClick={() => setActiveModalBook(spotlightBook)}
            className="relative w-56 sm:w-64 md:w-72 aspect-[3/4] rounded-xl overflow-hidden shadow-2xl transition-transform hover:scale-102 cursor-pointer group"
          >
            <img
              src={spotlightBook.coverImage}
              alt={spotlightBook.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/35 via-black/15 to-transparent pointer-events-none" />
            <div className="absolute top-3 right-3 px-2 py-1 rounded bg-black/60 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-amber-400 fill-1">verified</span>
              <span>Sanctuary Vault</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSpotlight;
