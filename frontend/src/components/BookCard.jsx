import React from 'react';
import { useBookstore } from '../context/BookstoreContext';

export const BookCard = ({ book }) => {
  const { addToBag, borrowBook, setActiveModalBook } = useBookstore();

  return (
    <article className="group relative flex flex-col bg-surface-container-lowest rounded-xl overflow-hidden border border-surface-container book-card-hover">
      {/* Cover Image Container */}
      <div
        onClick={() => setActiveModalBook(book)}
        className="relative aspect-[3/4] w-full overflow-hidden bg-surface-container-low cursor-pointer"
      >
        <img
          src={book.coverImage}
          alt={book.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = "/covers/book_cover_for_the_midnight_library_by_matt_haig_warm_atmospheric_glowing.png";
          }}
        />
        {/* Subtle spine shadow overlay */}
        <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/25 via-black/10 to-transparent pointer-events-none" />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/90 text-on-primary backdrop-blur-sm shadow-sm">
            {book.category.replace('-', ' ')}
          </span>
          {book.rating && (
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-surface-container-lowest/90 text-on-surface backdrop-blur-sm shadow-sm">
              <span className="material-symbols-outlined text-[12px] text-amber-500 fill-1">star</span>
              {book.rating}
            </span>
          )}
        </div>

        {/* Quick Excerpt Preview Hover Banner */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between">
          <span className="text-[11px] font-medium tracking-wide flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">visibility</span>
            Inspect Folio
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-secondary-container">
            {book.folioNumber || 'Curated'}
          </span>
        </div>
      </div>

      {/* Book Metadata */}
      <div className="flex flex-col flex-1 p-3.5 justify-between gap-3">
        <div onClick={() => setActiveModalBook(book)} className="cursor-pointer">
          <span className="text-[11px] text-outline font-medium block truncate">
            {book.author}
          </span>
          <h3 className="font-headline-sm text-sm sm:text-base font-bold text-on-surface line-clamp-1 group-hover:text-primary transition-colors mt-0.5">
            {book.title}
          </h3>
          <p className="text-[11px] text-on-surface-variant line-clamp-2 mt-1 leading-relaxed">
            {book.synopsis || book.excerpt}
          </p>
        </div>

        {/* Pricing & Formats */}
        <div className="pt-2 border-t border-surface-container flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-primary">
              ${book.price.toFixed(2)}
            </span>
            <span className="text-[10px] text-outline">
              Digital: ${book.digitalPrice.toFixed(2)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            {/* E-Library Borrow Button */}
            <button
              onClick={() => borrowBook(book)}
              className="p-1.5 rounded-lg bg-surface-container-low hover:bg-secondary-container hover:text-on-secondary-container text-on-surface-variant transition-colors cursor-pointer"
              title="Borrow digital copy from E-Library (21 days)"
            >
              <span className="material-symbols-outlined text-[18px]">menu_book</span>
            </button>

            {/* Add to Reading Bag Button */}
            <button
              onClick={() => addToBag(book, "Hardbound")}
              className="px-2.5 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-sm"
              title="Add hardbound edition to bag"
            >
              <span className="material-symbols-outlined text-[15px]">add_shopping_cart</span>
              <span>Bag</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BookCard;
