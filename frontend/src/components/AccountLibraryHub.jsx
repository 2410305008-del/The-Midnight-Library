import React, { useState } from 'react';
import { useBookstore } from '../context/BookstoreContext';

export const AccountLibraryHub = () => {
  const {
    borrowedBooks,
    returnBorrowedBook,
    updateProgress,
    orders,
    currentUser,
    setActiveModalBook,
    showToast
  } = useBookstore();

  const [activeHubTab, setActiveHubTab] = useState('library'); // 'library' | 'orders' | 'profile'

  return (
    <div className="flex flex-col gap-6">
      {/* Profile Header Banner */}
      <section className="relative bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src="/covers/a_warm_friendly_modern_portrait_profile_photo_of_a_young_reader_or_book.png"
              alt="Scholar Profile"
              className="w-16 h-16 rounded-full object-cover border-2 border-primary shadow-sm"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";
              }}
            />
            <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-surface-container-lowest" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="font-headline-sm text-2xl font-bold text-primary">
                {currentUser?.name || 'Eleanor Vance'}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-on-primary uppercase tracking-wider">
                Patron Scholar
              </span>
            </div>
            <p className="text-xs text-outline mt-0.5">
              {currentUser?.email || 'scholar@pagehaven.org'} • Member since Autumn 2024
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-4 sm:gap-6 bg-surface-container-low px-4 py-2.5 rounded-xl border border-surface-container">
          <div className="text-center">
            <span className="text-lg font-bold text-primary font-headline-sm block leading-none">
              {borrowedBooks.length}
            </span>
            <span className="text-[10px] text-outline uppercase font-semibold">Active Loans</span>
          </div>
          <div className="h-6 w-px bg-surface-container-highest" />
          <div className="text-center">
            <span className="text-lg font-bold text-amber-600 font-headline-sm block leading-none">
              {currentUser?.readingStreaks || 14}d
            </span>
            <span className="text-[10px] text-outline uppercase font-semibold">Reading Streak</span>
          </div>
          <div className="h-6 w-px bg-surface-container-highest" />
          <div className="text-center">
            <span className="text-lg font-bold text-on-surface font-headline-sm block leading-none">
              {currentUser?.booksReadCount || 18}
            </span>
            <span className="text-[10px] text-outline uppercase font-semibold">Folios Finished</span>
          </div>
        </div>
      </section>

      {/* Hub Navigation Tabs */}
      <div className="flex border-b border-surface-container gap-4">
        {[
          { id: 'library', label: 'Digital E-Library Shelf', icon: 'menu_book', count: borrowedBooks.length },
          { id: 'orders', label: 'Hardcopy Orders & Deliveries', icon: 'local_shipping', count: orders.length },
          { id: 'profile', label: 'Scholar Profile & Preferences', icon: 'manage_accounts' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveHubTab(tab.id)}
            className={`pb-3 text-xs sm:text-sm font-semibold flex items-center gap-1.5 cursor-pointer border-b-2 transition-all ${
              activeHubTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-outline hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-surface-container text-primary font-bold">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab 1: Digital E-Library */}
      {activeHubTab === 'library' && (
        <section className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-headline-sm text-lg font-bold text-primary">
                Currently Borrowed E-Library Volumetrics
              </h3>
              <p className="text-xs text-outline">
                21-day complimentary loans with synchronized cloud progress and bookmarks.
              </p>
            </div>
          </div>

          {borrowedBooks.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-surface-container-lowest border border-surface-container text-outline">
              <span className="material-symbols-outlined text-5xl mb-2 text-outline-variant">
                auto_stories
              </span>
              <p className="text-sm font-semibold text-on-surface">No books currently on loan.</p>
              <p className="text-xs mt-1">Browse our collection and click "Borrow" on any volume to begin reading.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {borrowedBooks.map((loan) => (
                <div
                  key={loan.bookId || loan._id}
                  className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-sm flex flex-col justify-between gap-3"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={loan.coverImage}
                      alt={loan.title}
                      className="w-16 h-22 object-cover rounded-lg shadow-sm border border-surface-container shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full inline-block">
                        Active E-Loan
                      </span>
                      <h4 className="font-headline-sm text-sm font-bold text-on-surface truncate mt-1">
                        {loan.title}
                      </h4>
                      <p className="text-xs text-outline">{loan.author}</p>
                      <div className="flex items-center gap-1.5 mt-2 text-[11px] text-on-surface-variant font-medium">
                        <span className="material-symbols-outlined text-[14px] text-amber-600">timer</span>
                        <span>{loan.daysLeft || 18} days remaining on loan</span>
                      </div>
                    </div>
                  </div>

                  {/* Reading Progress Slider */}
                  <div className="pt-2 border-t border-surface-container flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-outline font-semibold">Reading Progress:</span>
                      <strong className="text-primary font-bold">{loan.readingProgress || 0}%</strong>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={loan.readingProgress || 0}
                      onChange={(e) => updateProgress(loan.bookId, Number(e.target.value))}
                      className="w-full accent-primary cursor-pointer"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      onClick={() => showToast(`Opening "${loan.title}" Cloud Reader at page ${Math.round((loan.readingProgress || 0) * 3.2)}`)}
                      className="px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                    >
                      <span className="material-symbols-outlined text-[16px]">chrome_reader_mode</span>
                      <span>Continue Reading</span>
                    </button>

                    <button
                      onClick={() => returnBorrowedBook(loan.bookId, loan.title)}
                      className="px-3 py-1.5 rounded-xl bg-surface-container-low hover:bg-error-container/20 text-on-surface hover:text-error text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">keyboard_return</span>
                      <span>Return Volume</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Tab 2: Hardcopy Orders */}
      {activeHubTab === 'orders' && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-sm text-lg font-bold text-primary">
              Hardcopy Parchment & Gilded Deliveries
            </h3>
          </div>

          {orders.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-surface-container-lowest border border-surface-container text-outline">
              <span className="material-symbols-outlined text-4xl mb-1 text-outline-variant">
                local_shipping
              </span>
              <p className="text-sm font-semibold text-on-surface">No orders placed yet.</p>
              <p className="text-xs mt-1">Orders placed with White Glove courier will appear here.</p>
            </div>
          ) : (
            orders.map((ord) => (
              <div
                key={ord._id || ord.orderNumber}
                className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-sm flex flex-col gap-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-surface-container">
                  <div>
                    <span className="text-[10px] text-outline uppercase tracking-wider font-bold block">
                      Order Number
                    </span>
                    <strong className="text-xs sm:text-sm font-mono text-primary font-bold">
                      #{ord.orderNumber}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-outline uppercase tracking-wider font-bold block">
                      Tracking Docket
                    </span>
                    <span className="text-xs font-mono text-on-surface font-semibold">
                      {ord.trackingNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-outline uppercase tracking-wider font-bold block">
                      Status
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-secondary-fixed text-on-secondary-fixed">
                      {ord.orderStatus || 'Confirmed'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-outline uppercase tracking-wider font-bold block">
                      Total Paid
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-primary">
                      ${ord.totalAmount?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                </div>

                {/* Items in order */}
                <div className="flex items-center gap-3 overflow-x-auto py-1">
                  {(ord.items || []).map((it, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-low shrink-0">
                      <img src={it.image} alt={it.title} className="w-8 h-11 object-cover rounded shadow-sm" />
                      <div>
                        <h5 className="text-xs font-bold text-on-surface truncate max-w-[140px]">{it.title}</h5>
                        <span className="text-[10px] text-outline block">{it.edition} • Qty {it.qty}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-xs text-outline flex items-center justify-between pt-1">
                  <span>Estimated Delivery: {ord.estimatedDelivery}</span>
                  <button
                    onClick={() => showToast(`Invoice downloaded for Order #${ord.orderNumber}`)}
                    className="text-primary hover:underline font-semibold cursor-pointer text-xs"
                  >
                    Download Archival Invoice (PDF)
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      )}

      {/* Tab 3: Scholar Profile & Preferences */}
      {activeHubTab === 'profile' && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-sm flex flex-col gap-3">
            <h4 className="font-headline-sm text-base font-bold text-primary">
              Archival Reading Preferences
            </h4>
            <div className="flex flex-col gap-2 text-xs text-on-surface-variant">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-primary" />
                <span>Default to Smyth-Sewn Clothbound Editions</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-primary" />
                <span>Receive Archival Preservation Notifications (45% RH alert)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-primary" />
                <span>White-Glove Courier Doorstep Handover Required</span>
              </label>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-sm flex flex-col gap-3">
            <h4 className="font-headline-sm text-base font-bold text-primary">
              Saved Address & Sanctuary Vault
            </h4>
            <div className="text-xs text-on-surface-variant leading-relaxed">
              <strong>Primary Reading Desk:</strong>
              <p>742 Evergreen Terrace, Apt 4B</p>
              <p>New Haven, CT 06511</p>
              <p className="mt-2 text-outline">Payment Method: Archival Encrypted Visa ending in 4242</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default AccountLibraryHub;
