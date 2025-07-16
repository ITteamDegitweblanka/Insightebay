
import React from 'react';

export default function ListingDetailsModal({ listing, onClose }) {
  if (!listing) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity animate-fadeIn" onClick={onClose} />
      {/* Popup Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl p-0 w-full max-w-2xl border border-gray-100 animate-fadeIn overflow-hidden scale-100 sm:scale-105 sm:shadow-3xl transition-transform">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 bg-gradient-to-r from-primary to-blue-400">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 rounded-full p-4 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            </div>
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white drop-shadow">Listing Details</h2>
              <div className="text-xs text-blue-100 mt-1">ID: {listing.id}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 text-3xl font-bold focus:outline-none transition"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        {/* Main Content */}
        <div className="px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-6">
            <DetailCard label="Title" value={listing.title} icon={<TitleIcon />} />
            <DetailCard label="Revenue" value={`$${Number(listing.revenue).toLocaleString(undefined, {minimumFractionDigits:2})}`} icon={<RevenueIcon />} />
            <DetailCard label="Orders" value={listing.orders} icon={<OrdersIcon />} />
            <DetailCard label="CTR" value={`${Number(listing.ctr).toFixed(2)}%`} icon={<CtrIcon />} />
            {/* Add more fields as needed, e.g. SKU, category, createdBy, createdAt, updatedAt */}
          </div>
          <div className="border-t pt-6 mt-4 flex flex-col gap-2">
            {/* Add more details here as needed */}
            <div className="text-sm text-gray-600">More details and actions can go here.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailCard({ label, value, icon }) {
  return (
    <div className="bg-gradient-to-br from-white via-gray-50 to-blue-50 rounded-xl p-6 shadow flex flex-col gap-2 border border-gray-100 min-h-[110px]">
      <div className="flex items-center gap-2 mb-1">
        {icon && <span className="text-primary/80">{icon}</span>}
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
      </div>
      <span className="text-xl font-semibold text-gray-900 break-words">{value}</span>
    </div>
  );
}

function TitleIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
  );
}
function RevenueIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 12v4" /></svg>
  );
}
function OrdersIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" /></svg>
  );
}
function CtrIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 12l2 2 4-4" /></svg>
  );
}


