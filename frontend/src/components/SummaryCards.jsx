import React from 'react';

function SummaryCards({ data }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded shadow p-4 flex flex-col items-center">
        <span className="text-lg font-semibold">Total Revenue</span>
        <span className="text-2xl font-bold text-primary">${data?.revenue ?? 0}</span>
      </div>
      <div className="bg-white rounded shadow p-4 flex flex-col items-center">
        <span className="text-lg font-semibold">Total Orders</span>
        <span className="text-2xl font-bold text-primary">{data?.orders ?? 0}</span>
      </div>
      <div className="bg-white rounded shadow p-4 flex flex-col items-center">
        <span className="text-lg font-semibold">Impressions</span>
        <span className="text-2xl font-bold text-primary">{data?.impressions ?? 0}</span>
      </div>
      <div className="bg-white rounded shadow p-4 flex flex-col items-center">
        <span className="text-lg font-semibold">CTR</span>
        <span className="text-2xl font-bold text-primary">{data?.ctr ?? 0}%</span>
      </div>
    </div>
  );
}

export default SummaryCards;
