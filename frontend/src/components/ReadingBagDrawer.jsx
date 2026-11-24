import React, { useState } from 'react';
import { useBookstore } from '../context/BookstoreContext';

export const ReadingBagDrawer = () => {
  const {
    isBagOpen,
    setIsBagOpen,
    bagItems,
    updateBagQty,
    removeBagItem,
    bagSubtotal,
    bagDiscount,
    bagShipping,
    bagTotal,
    voucherApplied,
    voucherCode,
    applyVoucher,
    setIsCheckoutModalOpen
  } = useBookstore();

  const [inputCode, setInputCode] = useState('');

  if (!isBagOpen) return null;

  const handleApplyVoucher = (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    applyVoucher(inputCode);
    setInputCode('');
  };

  const handleProceedCheckout = () => {
    setIsBagOpen(false);
    setIsCheckoutModalOpen(true);
  };

  const freeShippingThreshold = 50.0;
  const progressPercent = Math.min(100, (bagSubtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={() => setIsBagOpen(false)} />

      {/* Drawer Panel */}
      <div
        className="relative w-full max-w-md bg-surface-container-lowest h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-surface-container flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">local_mall</span>
            <h3 className="font-headline-sm text-lg font-bold text-primary">Your Reading Bag</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container font-semibold">
              {bagItems.reduce((acc, it) => acc + it.qty, 0)} items
            </span>
          </div>
          <button
            onClick={() => setIsBagOpen(false)}
            className="w-8 h-8 rounded-full bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-6 py-3 bg-surface-container-lowest border-b border-surface-container">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-on-surface flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-primary">local_shipping</span>
              {bagSubtotal >= freeShippingThreshold ? (
                <strong className="text-emerald-700">Archival White-Glove Shipping Unlocked!</strong>
              ) : (
                <span>Add ${(freeShippingThreshold - bagSubtotal).toFixed(2)} more for Free Archival Delivery</span>
              )}
            </span>
            <span className="text-outline font-semibold">{progressPercent.toFixed(0)}%</span>
          </div>
          <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Bag Items List */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3">
          {bagItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-outline">
              <span className="material-symbols-outlined text-5xl mb-2 text-outline-variant">
                menu_book
              </span>
              <p className="text-sm font-medium">Your reading bag is currently empty.</p>
              <p className="text-xs mt-1">Explore our rare folios and curated editions to begin.</p>
            </div>
          ) : (
            bagItems.map((item, index) => (
              <div
                key={`${item.title}-${item.edition}-${index}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low border border-surface-container"
              >
                <div className="w-12 h-16 rounded overflow-hidden bg-surface-container shrink-0 shadow-sm">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-on-surface truncate">{item.title}</h4>
                  <span className="text-[11px] text-outline block">
                    {item.author} • {item.edition}
                  </span>
                  <span className="text-xs font-bold text-primary mt-1 block">
                    ${(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateBagQty(index, -1)}
                    className="w-6 h-6 rounded bg-surface-container-lowest text-xs flex items-center justify-center hover:bg-surface-container font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold px-1.5">{item.qty}</span>
                  <button
                    onClick={() => updateBagQty(index, 1)}
                    className="w-6 h-6 rounded bg-surface-container-lowest text-xs flex items-center justify-center hover:bg-surface-container font-bold cursor-pointer"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeBagItem(index)}
                    className="w-6 h-6 text-error text-xs flex items-center justify-center ml-1 cursor-pointer hover:bg-error-container/20 rounded"
                    title="Remove item"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Voucher & Pricing Footer */}
        {bagItems.length > 0 && (
          <div className="p-6 border-t border-surface-container bg-surface-container-low flex flex-col gap-3">
            {/* Voucher Input */}
            <form onSubmit={handleApplyVoucher} className="flex gap-2">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Keycode (e.g. PAGE25)"
                className="flex-1 px-3 py-1.5 bg-surface-container-lowest text-xs rounded-lg border border-surface-container focus:outline-none focus:ring-1 focus:ring-primary uppercase tracking-wider font-semibold"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-surface-container hover:bg-primary hover:text-on-primary text-primary text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Apply
              </button>
            </form>

            {voucherApplied && (
              <div className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 flex items-center justify-between font-medium">
                <span>Keycode PAGE25 Applied (25% Savings)</span>
                <span className="material-symbols-outlined text-[14px]">check</span>
              </div>
            )}

            {/* Calculations Breakdown */}
            <div className="flex flex-col gap-1 text-xs text-on-surface-variant pt-1 border-t border-surface-container">
              <div className="flex justify-between">
                <span>Folios Subtotal</span>
                <span className="font-semibold">${bagSubtotal.toFixed(2)}</span>
              </div>

              {voucherApplied && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Archival Privilege Discount (25%)</span>
                  <span>-${bagDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Archival Handling & Logistics</span>
                <span className="font-semibold">
                  {bagShipping === 0 ? <span className="text-emerald-700">Complimentary</span> : `$${bagShipping.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between text-sm font-bold text-on-surface pt-1 border-t border-surface-container">
                <span>Grand Due</span>
                <span className="text-primary font-headline-sm text-base">${bagTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Proceed to Checkout CTA */}
            <button
              onClick={handleProceedCheckout}
              className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer mt-1"
            >
              <span>Proceed to White Glove Checkout</span>
              <span className="material-symbols-outlined text-[18px]">lock</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingBagDrawer;
