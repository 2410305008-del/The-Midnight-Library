import React, { useState } from 'react';
import { useBookstore } from '../context/BookstoreContext';

export const BookDetailModal = () => {
  const { activeModalBook, setActiveModalBook, addToBag, borrowBook } = useBookstore();
  const [selectedEdition, setSelectedEdition] = useState('Hardbound');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'excerpt' | 'specs'

  if (!activeModalBook) return null;

  const currentPrice = selectedEdition === 'Digital' ? activeModalBook.digitalPrice : activeModalBook.price;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden border border-surface-container flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-surface-container flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary text-on-primary">
              {activeModalBook.category.replace('-', ' ')}
            </span>
            <span className="text-xs text-outline font-medium">
              {activeModalBook.folioNumber || 'Folio Cataloged'}
            </span>
          </div>

          <button
            onClick={() => setActiveModalBook(null)}
            className="w-8 h-8 rounded-full bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Cover & Quick Stats */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="relative aspect-[3/4] w-48 sm:w-56 rounded-xl overflow-hidden shadow-xl border border-surface-container">
              <img
                src={activeModalBook.coverImage}
                alt={activeModalBook.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/25 via-black/10 to-transparent pointer-events-none" />
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-outline">
              <span className="material-symbols-outlined text-[16px] text-amber-500 fill-1">star</span>
              <strong className="text-on-surface font-semibold">{activeModalBook.rating || 4.9}</strong>
              <span>({activeModalBook.reviewsCount || 120} scholarly reviews)</span>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <span className="text-[11px] px-2 py-0.5 rounded bg-surface-container text-on-surface font-mono">
                ISBN: {activeModalBook.isbn || '978-00000000'}
              </span>
            </div>
          </div>

          {/* Details & Interactive Actions */}
          <div className="md:col-span-7 flex flex-col justify-between gap-4">
            <div>
              <span className="text-xs text-outline uppercase tracking-wider font-semibold">
                Curated Edition
              </span>
              <h2 className="font-headline-lg text-2xl sm:text-3xl font-bold text-primary tracking-tight mt-0.5">
                {activeModalBook.title}
              </h2>
              <p className="font-headline-sm text-sm sm:text-base text-on-surface-variant mt-0.5">
                By {activeModalBook.author}
              </p>

              {/* Tabs for Overview, Sample Excerpt, and Specs */}
              <div className="flex items-center gap-2 border-b border-surface-container mt-4 mb-3">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-1.5 text-xs font-semibold cursor-pointer border-b-2 transition-colors ${
                    activeTab === 'overview'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-outline hover:text-on-surface'
                  }`}
                >
                  Overview & Synopsis
                </button>
                <button
                  onClick={() => setActiveTab('excerpt')}
                  className={`pb-1.5 text-xs font-semibold cursor-pointer border-b-2 transition-colors ${
                    activeTab === 'excerpt'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-outline hover:text-on-surface'
                  }`}
                >
                  Sample Excerpt
                </button>
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`pb-1.5 text-xs font-semibold cursor-pointer border-b-2 transition-colors ${
                    activeTab === 'specs'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-outline hover:text-on-surface'
                  }`}
                >
                  Archival Specs
                </button>
              </div>

              {/* Tab Contents */}
              {activeTab === 'overview' && (
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  {activeModalBook.synopsis || activeModalBook.excerpt}
                </p>
              )}

              {activeTab === 'excerpt' && (
                <blockquote className="p-3 rounded-xl bg-surface-container-low border-l-4 border-primary text-xs sm:text-sm italic font-headline-sm text-on-surface leading-relaxed">
                  "{activeModalBook.excerpt}"
                </blockquote>
              )}

              {activeTab === 'specs' && (
                <div className="grid grid-cols-2 gap-2 text-xs text-on-surface-variant bg-surface-container-low p-3 rounded-xl">
                  <div><strong>Paper:</strong> 90gsm Acid-Free Cream Vellum</div>
                  <div><strong>Binding:</strong> Smyth-Sewn Archival Cloth</div>
                  <div><strong>Format:</strong> {activeModalBook.genre}</div>
                  <div><strong>Stock:</strong> {activeModalBook.stock || 24} preserved copies</div>
                </div>
              )}

              {/* Edition Selector */}
              <div className="mt-4">
                <label className="text-[11px] font-bold uppercase tracking-wider text-outline block mb-1.5">
                  Select Preserved Edition
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedEdition('Hardbound')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      selectedEdition === 'Hardbound'
                        ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                        : 'border-surface-container bg-surface-container-lowest text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    <span className="block text-xs font-bold">Hardbound Cloth</span>
                    <span className="block text-[11px] text-outline font-medium mt-0.5">
                      ${activeModalBook.price.toFixed(2)} • In Stock
                    </span>
                  </button>

                  <button
                    onClick={() => setSelectedEdition('Digital')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      selectedEdition === 'Digital'
                        ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                        : 'border-surface-container bg-surface-container-lowest text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    <span className="block text-xs font-bold">Digital E-Book</span>
                    <span className="block text-[11px] text-outline font-medium mt-0.5">
                      ${activeModalBook.digitalPrice.toFixed(2)} • Instant Access
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-surface-container flex items-center justify-between gap-3">
              <div className="flex flex-col">
                <span className="text-xl font-bold text-primary font-headline-sm">
                  ${currentPrice.toFixed(2)}
                </span>
                <span className="text-[10px] text-outline">
                  {selectedEdition === 'Digital' ? 'Cloud E-Book Delivered' : 'Doorstep White Glove Delivery'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => borrowBook(activeModalBook)}
                  className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-secondary-container hover:text-on-secondary-container text-primary font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Borrow 21-day digital copy in My Library"
                >
                  <span className="material-symbols-outlined text-[16px]">menu_book</span>
                  <span>Borrow (21 Days)</span>
                </button>

                <button
                  onClick={() => {
                    addToBag(activeModalBook, selectedEdition);
                    setActiveModalBook(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                  <span>Add to Bag</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailModal;
