import React, { useState } from 'react';

function classifyHealth(impressions, clicks, sales) {
  if (impressions === 0 || clicks === 0) return { label: 'Dead', color: 'bg-gray-300 text-gray-700' };
  if (impressions > 0 && clicks > 0 && sales === 0) return { label: 'Poor', color: 'bg-red-100 text-red-700' };
  if (sales > 0) return { label: 'Good', color: 'bg-green-100 text-green-700' };
  return { label: 'Unknown', color: 'bg-gray-100 text-gray-500' };
}

export default function ListingHealthClassifier() {
  const [inputs, setInputs] = useState({ impressions: '', clicks: '', sales: '' });
  const { label, color } = classifyHealth(Number(inputs.impressions), Number(inputs.clicks), Number(inputs.sales));

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-1">Listing Health Classification</h2>
      <p className="text-gray-500 text-sm mb-4">Use AI to classify listing health based on performance metrics.</p>
      <form className="flex flex-col md:flex-row gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Impressions</label>
          <input type="number" className="border rounded p-2 w-32" value={inputs.impressions} onChange={e => setInputs({ ...inputs, impressions: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Clicks</label>
          <input type="number" className="border rounded p-2 w-32" value={inputs.clicks} onChange={e => setInputs({ ...inputs, clicks: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Sales</label>
          <input type="number" className="border rounded p-2 w-32" value={inputs.sales} onChange={e => setInputs({ ...inputs, sales: e.target.value })} />
        </div>
        <div className="flex flex-col items-center ml-4">
          <span className={`px-4 py-2 rounded font-semibold text-lg ${color}`}>{label}</span>
        </div>
      </form>
    </div>
  );
}
