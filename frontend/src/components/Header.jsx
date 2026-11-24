import React from 'react';
import { useBookstore } from '../context/BookstoreContext';

export const Header = () => {
  const {
    activeView,
    setActiveView,
    searchQuery,
    setSearchQuery,
    bagItemCount,
    setIsBagOpen,
    currentUser,
    setIsAuthModalOpen,
  } = useBookstore();

  const navTabs = [
    { id: 'home', label: 'Home' },
    { id: 'story-fiction', label: 'Story & Fiction' },
    { id: 'comics-graphic', label: 'Comics & Graphic Novels' },
    { id: 'anime-manga', label: 'Anime & Manga Vault' },
    { id: 'wisdom-mind', label: 'Motivational Wisdom' },
    { id: 'magazines-gk', label: 'Magazines & GK' },
    { id: 'ai-concierge', label: 'ReadGenius AI Concierge' },
    { id: 'help-care', label: 'Help Care Sanctuary' },
    { id: 'my-library', label: 'My Library & Account' }
  ];

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    const q = val.toLowerCase();
    if (q.includes('comic') || q.includes('lore') || q.includes('watchmen') || q.includes('sandman')) {
      setActiveView('comics-graphic');
    } else if (q.includes('manga') || q.includes('one piece') || q.includes('frieren') || q.includes('titan')) {
      setActiveView('anime-manga');
    } else if (q.includes('fiction') || q.includes('library') || q.includes('coffee') || q.includes('klara')) {
      setActiveView('story-fiction');
    } else if (q.includes('habit') || q.includes('meaning') || q.includes('goggins') || q.includes('courage')) {
      setActiveView('wisdom-mind');
    } else if (q.includes('vogue') || q.includes('forbes') || q.includes('physics') || q.includes('biology')) {
      setActiveView('magazines-gk');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container/60">
      <div className="max-w-[1280px] mx-auto px-6 flex flex-col justify-between pt-3 pb-2">
        {/* Top bar with Brand, Search, Bag & Profile */}
        <div className="flex items-center justify-between gap-4 md:gap-6">
          {/* Brand Logo & Title */}
          <div
            onClick={() => setActiveView('home')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-sm group-hover:bg-primary-container transition-all">
              <span className="material-symbols-outlined text-[22px]">auto_stories</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-xl text-primary font-bold tracking-tight leading-none group-hover:text-primary-container transition-colors">
                PageHaven
              </span>
              <span className="font-label-sm text-[10px] sm:text-xs text-outline tracking-wider uppercase mt-1">
                Sanctuary of Rare Books & Curated Editions
              </span>
            </div>
          </div>

          {/* Search Input */}
          <div className="flex-1 max-w-xl mx-2 md:mx-6 hidden sm:block">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-outline pointer-events-none text-[20px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search titles, rare folios, graphic novels, or authors..."
                className="w-full bg-surface-container-low pl-10 pr-10 py-2 rounded-xl text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all border border-surface-container"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-outline hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>
          </div>

          {/* Bag & User Actions */}
          <div className="flex items-center gap-3">
            {/* Reading Bag Trigger */}
            <button
              onClick={() => setIsBagOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer border border-surface-container"
              title="Open Reading Bag"
            >
              <span className="material-symbols-outlined text-[20px] text-primary">local_mall</span>
              <span className="hidden md:inline text-xs font-semibold text-on-surface">Reading Bag</span>
              <span className="w-5 h-5 rounded-full bg-primary text-on-primary font-label-sm text-[10px] font-bold flex items-center justify-center shadow-sm">
                {bagItemCount}
              </span>
            </button>

            {/* Scholar Profile */}
            <div
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-surface-container-low hover:bg-surface-container border border-surface-container transition-all cursor-pointer"
              title="Scholar Profile / Member Access"
            >
              <img
                src="/covers/a_warm_friendly_modern_portrait_profile_photo_of_a_young_reader_or_book.png"
                alt="Scholar Avatar"
                className="w-7 h-7 rounded-full object-cover border border-outline-variant"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80";
                }}
              />
              <span className="text-xs font-semibold text-on-surface truncate max-w-[110px] hidden lg:inline">
                {currentUser?.name || 'Scholar'}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex items-center gap-1.5 overflow-x-auto py-2 scrollbar-none mt-1">
          {navTabs.map((tab) => {
            const isActive = activeView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveView(tab.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3 py-1 text-xs sm:text-sm rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low font-medium'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Header;
