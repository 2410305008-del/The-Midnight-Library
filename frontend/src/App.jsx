import React, { useState } from 'react';
import { BookstoreProvider, useBookstore } from './context/BookstoreContext';
import Header from './components/Header';
import AnnouncementRibbon from './components/AnnouncementRibbon';
import HeroSpotlight from './components/HeroSpotlight';
import CuratedShelf from './components/CuratedShelf';
import BookCard from './components/BookCard';
import BookDetailModal from './components/BookDetailModal';
import ReadingBagDrawer from './components/ReadingBagDrawer';
import CheckoutModal from './components/CheckoutModal';
import AuthModal from './components/AuthModal';
import ReadGeniusAI from './components/ReadGeniusAI';
import HelpCareSanctuary from './components/HelpCareSanctuary';
import AccountLibraryHub from './components/AccountLibraryHub';
import Footer from './components/Footer';
import Toast from './components/Toast';

const BookstoreApp = () => {
  const { activeView, setActiveView, books, searchQuery, setSearchQuery } = useBookstore();
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  // Filter books based on search or active category view
  const getFilteredBooks = () => {
    let list = [...books];

    // Search query takes precedence if present
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return list.filter(
        b =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.genre.toLowerCase().includes(q) ||
          b.synopsis.toLowerCase().includes(q)
      );
    }

    // View filter
    if (activeView === 'story-fiction') {
      list = list.filter(b => b.category === 'story-fiction');
    } else if (activeView === 'comics-graphic') {
      list = list.filter(b => b.category === 'comics-graphic');
    } else if (activeView === 'anime-manga') {
      list = list.filter(b => b.category === 'anime-manga');
    } else if (activeView === 'wisdom-mind') {
      list = list.filter(b => b.category === 'wisdom-mind');
    } else if (activeView === 'magazines-gk') {
      list = list.filter(b => b.category === 'magazines-gk' || b.category === 'academic');
    } else if (activeView === 'home' && selectedCategoryFilter !== 'all') {
      list = list.filter(b => b.category === selectedCategoryFilter);
    }

    // Sort
    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  };

  const displayedBooks = getFilteredBooks();

  // Curated collections for the home page
  const fictionBooks = books.filter(b => b.category === 'story-fiction').slice(0, 4);
  const graphicNovels = books.filter(b => b.category === 'comics-graphic').slice(0, 4);
  const mangaBooks = books.filter(b => b.category === 'anime-manga').slice(0, 4);
  const wisdomBooks = books.filter(b => b.category === 'wisdom-mind').slice(0, 4);
  const magazineAndTextbooks = books.filter(b => b.category === 'magazines-gk' || b.category === 'academic').slice(0, 4);

  return (
    <div className="min-h-screen bg-background font-body-md text-on-surface flex flex-col">
      {/* Sticky Header */}
      <Header />

      {/* Main Content Area */}
      <main className="w-full pt-32 pb-16 bg-background flex-1">
        {/* Announcement Ribbon with Promo Code */}
        <AnnouncementRibbon />

        <div className="max-w-[1280px] w-full mx-auto px-6 flex flex-col gap-10">
          {/* VIEW: HOME */}
          {activeView === 'home' && (
            <div className="flex flex-col gap-10 animate-in fade-in duration-300">
              {/* Spotlight Illuminated Masterpiece */}
              <HeroSpotlight />

              {/* Curated Salon Highlights */}
              <CuratedShelf
                title="Curated Salon Masterpieces"
                subtitle="Rare acid-free hardbounds and coveted literary debuts"
                books={fictionBooks}
                viewAllCategory="story-fiction"
              />

              {/* Comics & Graphic Epics Shelf */}
              <CuratedShelf
                title="Comics & Graphic Novel Epics"
                subtitle="Eisner award winners, gothic noir, and modern mythological visual narratives"
                books={graphicNovels}
                viewAllCategory="comics-graphic"
              />

              {/* Anime & Manga Tankobon Vault */}
              <CuratedShelf
                title="Anime & Manga Tankobon Vault"
                subtitle="Authentic Japanese editions, dark fantasy, and classic shonen serialization"
                books={mangaBooks}
                viewAllCategory="anime-manga"
              />

              {/* Motivational & Human Wisdom */}
              <CuratedShelf
                title="Motivational & Human Wisdom"
                subtitle="Behavioral psychology, existential inquiry, and mental discipline"
                books={wisdomBooks}
                viewAllCategory="wisdom-mind"
              />

              {/* Periodicals, GK & University Stacks */}
              <CuratedShelf
                title="Periodicals, World Factbooks & Academic Stacks"
                subtitle="Heavy artboard magazines, global geopolitical yearbooks, and university textbooks"
                books={magazineAndTextbooks}
                viewAllCategory="magazines-gk"
              />

              {/* Complete Repository Grid with Faceted Filters */}
              <section className="flex flex-col gap-5 pt-6 border-t border-surface-container">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-headline-md text-2xl font-bold text-primary tracking-tight">
                      Explore All Sanctuary Folios
                    </h2>
                    <p className="text-xs sm:text-sm text-outline">
                      {displayedBooks.length} preserved volumes available for immediate order or E-Library borrowing
                    </p>
                  </div>

                  {/* Filter Pills & Sort Selector */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-surface-container text-xs">
                      {[
                        { id: 'all', label: 'All Folios' },
                        { id: 'story-fiction', label: 'Fiction' },
                        { id: 'comics-graphic', label: 'Comics' },
                        { id: 'anime-manga', label: 'Manga' },
                        { id: 'wisdom-mind', label: 'Wisdom' },
                        { id: 'magazines-gk', label: 'Periodicals' },
                      ].map((chip) => (
                        <button
                          key={chip.id}
                          onClick={() => setSelectedCategoryFilter(chip.id)}
                          className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                            selectedCategoryFilter === chip.id
                              ? 'bg-primary text-on-primary shadow-sm'
                              : 'text-on-surface-variant hover:text-on-surface'
                          }`}
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-surface-container-low border border-surface-container text-xs font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                    >
                      <option value="featured">Sort: Curated</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Scholarly Rating</option>
                    </select>
                  </div>
                </div>

                {/* Grid of Books */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                  {displayedBooks.map((book) => (
                    <BookCard key={book._id} book={book} />
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* VIEW: CATEGORY VIEWS (Story, Comics, Manga, Wisdom, Magazines) */}
          {(activeView === 'story-fiction' ||
            activeView === 'comics-graphic' ||
            activeView === 'anime-manga' ||
            activeView === 'wisdom-mind' ||
            activeView === 'magazines-gk') && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
              {/* Category Header Banner */}
              <div className="rounded-2xl bg-gradient-to-r from-surface-container to-surface-container-low p-6 sm:p-8 border border-surface-container shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-surface-container-lowest px-2.5 py-1 rounded-md border border-surface-container">
                    Archival Wing
                  </span>
                  <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-primary tracking-tight mt-2">
                    {activeView === 'story-fiction' && 'Story & Acclaimed Fiction Salon'}
                    {activeView === 'comics-graphic' && 'Comics & Graphic Novel Epics'}
                    {activeView === 'anime-manga' && 'Anime & Authentic Manga Vault'}
                    {activeView === 'wisdom-mind' && 'Motivational & Human Wisdom Salon'}
                    {activeView === 'magazines-gk' && 'Magazines, General Knowledge & University Stacks'}
                  </h1>
                  <p className="text-xs sm:text-sm text-outline mt-1">
                    Displaying {displayedBooks.length} master folios preserved in this wing
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-surface-container-lowest border border-surface-container text-xs font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer shadow-sm"
                  >
                    <option value="featured">Sort: Curated</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Scholarly Rating</option>
                  </select>
                </div>
              </div>

              {/* Books Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                {displayedBooks.map((book) => (
                  <BookCard key={book._id} book={book} />
                ))}
              </div>
            </div>
          )}

          {/* VIEW: READGENIUS AI CONCIERGE */}
          {activeView === 'ai-concierge' && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
              <ReadGeniusAI />
            </div>
          )}

          {/* VIEW: HELP CARE SANCTUARY */}
          {activeView === 'help-care' && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
              <HelpCareSanctuary />
            </div>
          )}

          {/* VIEW: MY LIBRARY & ACCOUNT HUB */}
          {activeView === 'my-library' && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
              <AccountLibraryHub />
            </div>
          )}
        </div>
      </main>

      {/* Global Modals & Drawers */}
      <BookDetailModal />
      <ReadingBagDrawer />
      <CheckoutModal />
      <AuthModal />
      <Toast />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export const App = () => {
  return (
    <BookstoreProvider>
      <BookstoreApp />
    </BookstoreProvider>
  );
};

export default App;
