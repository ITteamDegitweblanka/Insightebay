import React from 'react';

function TopListingsTable({ listings }) {
  if (!listings) return null;
  return (
    <div className="bg-white rounded-xl shadow p-6 mt-6">
      <h2 className="text-xl font-bold mb-1">Top 10 Best Performing Listings</h2>
      <p className="text-gray-500 text-sm mb-4">Sorted by revenue from the selected date range. Click a row for details.</p>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="text-gray-500 text-sm">
              <th className="py-2">Title</th>
              <th className="py-2">Revenue</th>
              <th className="py-2">Orders</th>
              <th className="py-2">CTR</th>
            </tr>
          </thead>
          <tbody>
            {listings.map(listing => (
              <tr key={listing.id} className="hover:bg-accent cursor-pointer transition">
                <td className="py-2">
                  <div className="font-semibold">{listing.title}</div>
                  <div className="text-xs text-gray-400">ID: {listing.id}</div>
                </td>
                <td className="py-2">${Number(listing.revenue).toLocaleString(undefined, {minimumFractionDigits:2})}</td>
                <td className="py-2">{listing.orders}</td>
                <td className="py-2">
                  <span className="bg-blue-50 text-primary px-2 py-1 rounded text-xs font-semibold">
                    {Number(listing.ctr).toFixed(2)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TopListingsTable;
