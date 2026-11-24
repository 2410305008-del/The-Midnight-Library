import React, { useState } from 'react';
import api from '../services/api';
import { useBookstore } from '../context/BookstoreContext';

export const HelpCareSanctuary = () => {
  const { showToast, currentUser } = useBookstore();

  // Return Scheduler State
  const [returnForm, setReturnForm] = useState({
    folioNumber: 'PH-88492',
    contactName: currentUser?.name || 'Eleanor Vance',
    contactEmail: currentUser?.email || 'scholar@pagehaven.org',
    pickupAddress: '742 Evergreen Terrace, Apt 4B, New Haven, CT',
    pickupTimeSlot: 'Tomorrow, 10:00 AM - 01:00 PM',
    reason: 'Finished Reading / Exchange for New Folio'
  });
  const [returnSuccess, setReturnSuccess] = useState(null);

  // Tracking Lookup State
  const [trackQuery, setTrackQuery] = useState('PH-89412');
  const [trackResult, setTrackResult] = useState(null);
  const [isTracking, setIsTracking] = useState(false);

  // FAQ Active State
  const [activeFaq, setActiveFaq] = useState(null);

  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    const res = await api.scheduleReturn(returnForm);
    if (res && res.success) {
      setReturnSuccess(res.data);
      showToast(`Doorstep courier booked under Docket #${res.data.returnId}!`);
    } else {
      showToast('Pickup booked! Courier scheduled for tomorrow at 11:00 AM.');
    }
  };

  const handleTrackSubmit = async (e) => {
    e.preventDefault();
    if (!trackQuery.trim()) return;
    setIsTracking(true);
    const res = await api.trackParcel(trackQuery);
    setIsTracking(false);
    if (res && res.success) {
      setTrackResult(res.data);
    }
  };

  const faqs = [
    {
      q: "How does PageHaven's 14-Day Doorstep Return Sanctuary operate?",
      a: "No boxes, tape, or printing required. Our bonded white-glove courier arrives directly at your reading desk or residence, inspects the volume in our cushioned archival carrier, and issues an immediate digital receipt."
    },
    {
      q: "What are the borrowing rules for the E-Library?",
      a: "Patron Scholars may borrow up to 5 concurrent digital masterworks for 21 days with zero late fees. Volumes automatically sync your reading annotations and bookmark progress."
    },
    {
      q: "How do you guarantee museum-grade book preservation?",
      a: "Every physical book in our repository is inspected under controlled humidity (45-50% RH) and bound using acid-free cotton vellum and Smyth-sewn archival craftsmanship."
    },
    {
      q: "Can I convert a borrowed E-Library volume into a physical hardcopy?",
      a: "Yes! Simply open the volume detail modal and select 'Acquire Masterpiece'. Your current reading annotations will be mirrored onto a complimentary archival bookplate."
    }
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Hero Header */}
      <div className="rounded-2xl bg-gradient-to-r from-surface-container via-surface-container-low to-secondary-container/20 p-6 sm:p-8 border border-surface-container shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-primary text-on-primary font-bold text-xs uppercase tracking-wider">
              Care Sanctuary
            </span>
            <span className="text-xs text-outline">14-Day Complimentary Doorstep Exchanges</span>
          </div>
          <h2 className="font-headline-lg text-2xl sm:text-3xl font-bold text-primary tracking-tight">
            Help Centre & Archival Logistics Care
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-xl">
            Whether arranging a courier pickup, tracing an illuminated parcel, or inquiring about preservation, our concierge team is at your command.
          </p>
        </div>

        <div className="w-16 h-16 rounded-2xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-lg">
          <span className="material-symbols-outlined text-[36px]">support_agent</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: 14-Day Doorstep Return Scheduler */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-sm">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="material-symbols-outlined text-primary text-[22px]">assignment_return</span>
              <h3 className="font-headline-sm text-xl font-bold text-primary">
                Schedule Doorstep Return & Exchange
              </h3>
            </div>
            <p className="text-xs text-on-surface-variant mb-5">
              Enter your Folio ID to request a white-glove courier collection at zero packaging or courier fee.
            </p>

            <form onSubmit={handleReturnSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-outline block mb-1">
                    Folio / Order Number
                  </label>
                  <input
                    type="text"
                    required
                    value={returnForm.folioNumber}
                    onChange={(e) => setReturnForm({ ...returnForm, folioNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-xs border border-surface-container focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-outline block mb-1">
                    Scholar Contact Name
                  </label>
                  <input
                    type="text"
                    required
                    value={returnForm.contactName}
                    onChange={(e) => setReturnForm({ ...returnForm, contactName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-xs border border-surface-container focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-outline block mb-1">
                  Doorstep Pickup Address
                </label>
                <input
                  type="text"
                  required
                  value={returnForm.pickupAddress}
                  onChange={(e) => setReturnForm({ ...returnForm, pickupAddress: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-xs border border-surface-container focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-outline block mb-1">
                    Preferred Collection Window
                  </label>
                  <select
                    value={returnForm.pickupTimeSlot}
                    onChange={(e) => setReturnForm({ ...returnForm, pickupTimeSlot: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-xs border border-surface-container focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option>Tomorrow, 10:00 AM - 01:00 PM</option>
                    <option>Tomorrow, 02:00 PM - 05:00 PM</option>
                    <option>Day After, 10:00 AM - 01:00 PM</option>
                    <option>Day After, 02:00 PM - 05:00 PM</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-outline block mb-1">
                    Reason for Return / Exchange
                  </label>
                  <select
                    value={returnForm.reason}
                    onChange={(e) => setReturnForm({ ...returnForm, reason: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-xs border border-surface-container focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option>Finished Reading / Exchange for New Folio</option>
                    <option>Duplicate Volume in Personal Library</option>
                    <option>Request Archival Leather Replacement</option>
                    <option>Other Scholarly Inquiry</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                <span>Confirm Doorstep Courier Pickup</span>
              </button>
            </form>

            {returnSuccess && (
              <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[20px] text-emerald-600 shrink-0">check_circle</span>
                <div>
                  <strong className="block font-bold">Courier Pickup Scheduled!</strong>
                  <span>Docket #{returnSuccess.returnId} generated for Folio {returnSuccess.folioNumber}. Courier will arrive {returnSuccess.pickupTimeSlot}.</span>
                </div>
              </div>
            )}
          </div>

          {/* FAQs Accordion */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary text-[20px]">help_center</span>
              <h3 className="font-headline-sm text-lg font-bold text-primary">
                Frequently Consulted Archival Inquiries
              </h3>
            </div>

            {faqs.map((f, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="border border-surface-container rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-3.5 text-left bg-surface-container-low hover:bg-surface-container transition-colors flex items-center justify-between text-xs sm:text-sm font-semibold text-on-surface cursor-pointer"
                  >
                    <span>{f.q}</span>
                    <span className="material-symbols-outlined text-[18px] text-outline">
                      {isOpen ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="p-3.5 bg-surface-container-lowest text-xs sm:text-sm text-on-surface-variant leading-relaxed border-t border-surface-container">
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Parcel Logistics Tracking */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-primary text-[22px]">explore</span>
              <h3 className="font-headline-sm text-xl font-bold text-primary">
                Real-Time Parcel Logistics
              </h3>
            </div>
            <p className="text-xs text-on-surface-variant">
              Track your sealed folios and white-glove transport in real-time.
            </p>

            <form onSubmit={handleTrackSubmit} className="flex gap-2">
              <input
                type="text"
                required
                value={trackQuery}
                onChange={(e) => setTrackQuery(e.target.value)}
                placeholder="Enter Docket (e.g. PH-89412)"
                className="flex-1 px-3 py-2 rounded-xl bg-surface-container-low text-xs border border-surface-container focus:outline-none focus:ring-1 focus:ring-primary font-mono"
              />
              <button
                type="submit"
                disabled={isTracking}
                className="px-4 py-2 rounded-xl bg-primary text-on-primary font-semibold text-xs hover:bg-primary-container transition-all cursor-pointer shadow-sm shrink-0"
              >
                {isTracking ? 'Searching...' : 'Trace'}
              </button>
            </form>

            {/* Tracking Results Card */}
            {trackResult ? (
              <div className="mt-2 p-4 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                  <div>
                    <span className="text-[10px] text-outline uppercase tracking-wider font-bold block">
                      Active Docket
                    </span>
                    <strong className="text-xs font-mono text-primary font-bold">
                      {trackResult.trackingNumber}
                    </strong>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary-fixed text-on-secondary-fixed">
                    {trackResult.orderStatus || 'In Transit'}
                  </span>
                </div>

                <div className="text-xs text-on-surface-variant">
                  <span>Estimated Arrival: </span>
                  <strong className="text-on-surface">{trackResult.estimatedDelivery}</strong>
                </div>

                {/* Tracking Milestones Timeline */}
                <div className="flex flex-col gap-3 pt-2">
                  {(trackResult.stages || []).map((stage, sIdx) => (
                    <div key={sIdx} className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <span
                          className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                            stage.completed
                              ? 'bg-primary text-on-primary'
                              : 'bg-surface-container-highest text-outline'
                          }`}
                        >
                          {stage.completed ? '✓' : '•'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h5 className="text-xs font-bold text-on-surface">{stage.step}</h5>
                        <span className="text-[10px] text-outline block">{stage.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-surface-container-low text-xs text-outline text-center">
                Enter your parcel docket number above to view real-time delivery telemetry.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCareSanctuary;
