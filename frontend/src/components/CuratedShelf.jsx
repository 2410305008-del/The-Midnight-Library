import React from 'react';
import { useBookstore } from '../context/BookstoreContext';
import BookCard from './BookCard';

export const CuratedShelf = ({ title, subtitle, books, viewAllCategory }) => {
  const { setActiveView } = useBookstore();

  if (!books || books.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-end justify-between border-b border-surface-container pb-2">
        <div>
          <h2 className="font-headline-md text-2xl font-bold text-primary tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-outline mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {viewAllCategory && (
          <button
            onClick={() => {
              setActiveView(viewAllCategory);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs sm:text-sm font-semibold text-primary hover:text-primary-container flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>View Full Salon</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
        {books.map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
    </section>
  );
};

export default CuratedShelf;
