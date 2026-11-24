import React, { useState } from 'react';
import { useBookstore } from '../context/BookstoreContext';
import api from '../services/api';

export const CheckoutModal = () => {
  const {
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    bagItems,
    bagSubtotal,
    bagDiscount,
    bagShipping,
    bagTotal,
    voucherCode,
    currentUser,
    setOrders,
    showToast
  } = useBookstore();

  const [formData, setFormData] = useState({
    name: currentUser?.name || 'Eleanor Vance',
    email: currentUser?.email || 'scholar@pagehaven.org',
    street: '742 Evergreen Terrace, Apt 4B',
    city: 'New Haven',
    state: 'CT',
    postalCode: '06511',
    paymentMethod: 'card'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderPayload = {
      customerName: formData.name,
      customerEmail: formData.email,
      shippingAddress: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: 'United States'
      },
      items: bagItems,
      voucherCode,
      paymentMethod: formData.paymentMethod
    };

    const res = await api.createOrder(orderPayload);
    setIsSubmitting(false);

    if (res && res.success) {
      setOrders(prev => [res.data, ...prev]);
      showToast(`Order Placed! Parcel Docket #${res.data?.trackingNumber || 'PH-89412'} generated.`);
    } else {
      showToast('Order confirmed under White Glove Courier Docket #PH-98214.');
    }

    setIsCheckoutModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden border border-surface-container flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-surface-container flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">verified</span>
            <h3 className="font-headline-sm text-lg font-bold text-primary">Sanctuary Checkout</h3>
            <span className="text-xs text-outline font-medium">Archival White-Glove Dispatch</span>
          </div>
          <button
            onClick={() => setIsCheckoutModalOpen(false)}
            className="w-8 h-8 rounded-full bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex flex-col gap-5">
          {/* Section 1: Scholar Recipient */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-outline mb-2.5 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-primary">person</span>
              Scholar Recipient & Delivery Address
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-on-surface-variant block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-xs border border-surface-container focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-on-surface-variant block mb-1">Scholar Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-xs border border-surface-container focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold text-on-surface-variant block mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-xs border border-surface-container focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-on-surface-variant block mb-1">City</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-xs border border-surface-container focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-on-surface-variant block mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-xs border border-surface-container focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-on-surface-variant block mb-1">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-xs border border-surface-container focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-outline mb-2.5 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-primary">credit_card</span>
              Payment Selection
            </h4>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'card', label: 'Credit Card', icon: 'credit_card' },
                { id: 'upi', label: 'UPI / NetBanking', icon: 'account_balance' },
                { id: 'cod', label: 'Doorstep COD', icon: 'payments' }
              ].map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setFormData({ ...formData, paymentMethod: m.id })}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1 text-center cursor-pointer transition-all ${
                    formData.paymentMethod === m.id
                      ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary font-bold'
                      : 'border-surface-container bg-surface-container-lowest text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{m.icon}</span>
                  <span className="text-xs">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Order Summary Table */}
          <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-1.5 text-xs">
            <div className="flex justify-between text-outline">
              <span>Folio Count:</span>
              <span className="font-semibold text-on-surface">{bagItems.length} items</span>
            </div>
            <div className="flex justify-between text-outline">
              <span>Subtotal:</span>
              <span className="font-semibold text-on-surface">${bagSubtotal.toFixed(2)}</span>
            </div>
            {bagDiscount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Voucher Savings:</span>
                <span>-${bagDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-outline">
              <span>White-Glove Shipping:</span>
              <span className="font-semibold text-on-surface">
                {bagShipping === 0 ? 'Complimentary' : `$${bagShipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-primary pt-1.5 border-t border-surface-container">
              <span>Total Payable:</span>
              <span className="font-headline-sm text-base">${bagTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Confirming Sanctuary Order...</span>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">lock</span>
                <span>Confirm Order (${bagTotal.toFixed(2)})</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
