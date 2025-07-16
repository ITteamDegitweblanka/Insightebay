import React from 'react';

export default function EmployeeDetailsModal({ employee, onClose }) {
  if (!employee) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-300 via-white to-pink-200 bg-opacity-90 backdrop-blur-sm transition-opacity animate-fadeIn" onClick={onClose} style={{zIndex: 50}} />
      {/* Popup Card */}
      <div className="absolute z-60 bg-white rounded-3xl shadow-2xl w-full max-w-xl border border-gray-200 animate-fadeIn overflow-hidden scale-100 sm:scale-105 sm:shadow-3xl transition-transform p-0" style={{top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
        {/* Header */}
        <div className="flex items-center justify-between px-10 py-8 bg-gradient-to-r from-blue-600 to-pink-400">
          <div className="flex items-center gap-5">
            <div className="bg-white/40 rounded-full p-6 shadow-lg border-2 border-blue-200">
              <span className="text-4xl font-extrabold text-blue-600 drop-shadow">{employee.initials}</span>
            </div>
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white drop-shadow mb-1">{employee.name}</h2>
              <div className="text-xs text-blue-100">Employee ID: {employee.id}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/30 rounded-full p-3 text-3xl font-bold focus:outline-none transition"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        {/* Main Content */}
        <div className="px-10 py-10 bg-gradient-to-br from-white via-blue-50 to-pink-50">
          {(!employee.newListingRevenue && !employee.optimizedListingRevenue && !employee.totalRevenue && !employee.prevTotalRevenue) ? (
            <div className="text-center text-gray-400 text-lg py-12">No details available for this employee.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-6">
              <DetailCard label="New Listing Revenue" value={`$${employee.newListingRevenue?.toLocaleString() || '0'}`} icon={<RevenueIcon />} />
              <DetailCard label="Optimized Listing Revenue" value={`$${employee.optimizedListingRevenue?.toLocaleString() || '0'}`} icon={<RevenueIcon />} />
              <DetailCard label="Total Revenue" value={`$${employee.totalRevenue?.toLocaleString() || '0'}`} icon={<RevenueIcon />} />
              <DetailCard label="Previous Total Revenue" value={`$${employee.prevTotalRevenue?.toLocaleString() || '0'}`} icon={<RevenueIcon />} />
              <DetailCard label="Change" value={(() => {
                const pct = employee.prevTotalRevenue ? (((employee.totalRevenue - employee.prevTotalRevenue) / Math.abs(employee.prevTotalRevenue)) * 100).toFixed(1) : '100.0';
                const change = employee.prevTotalRevenue ? employee.totalRevenue - employee.prevTotalRevenue : employee.totalRevenue;
                return <span className={`font-bold ${change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-400'}`}>{change > 0 ? '▲' : change < 0 ? '▼' : ''} {Math.abs(change).toLocaleString()} ({pct}%)</span>;
              })()} icon={<ChangeIcon />} />
              {/* Add more employee-related details here as needed */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RevenueIcon() {
  return (
    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 12v4" /></svg>
  );
}
function ChangeIcon() {
  return (
    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" /></svg>
  );
}

// Update DetailCard for a more modern look
function DetailCard({ label, value, icon }) {
  return (
    <div className="bg-white/90 hover:bg-blue-50 transition rounded-2xl p-7 shadow-lg flex flex-col gap-2 border border-blue-100 min-h-[120px] group cursor-pointer">
      <div className="flex items-center gap-3 mb-1">
        {icon && <span className="text-blue-400 group-hover:text-pink-400 transition">{icon}</span>}
        <span className="text-xs font-bold text-blue-500 uppercase tracking-wider group-hover:text-pink-500 transition">{label}</span>
      </div>
      <span className="text-2xl font-extrabold text-gray-900 break-words group-hover:text-pink-600 transition">{value}</span>
    </div>
  );
}
