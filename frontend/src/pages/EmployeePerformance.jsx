import React, { useEffect, useState } from 'react';

const ranges = [
  { label: '7D', days: 7 },
  { label: '14D', days: 14 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
];

function percentChange(current, prev) {
  if (!prev || prev === 0) return current ? 100 : 0;
  return (((current - prev) / Math.abs(prev)) * 100).toFixed(1);
}

export default function EmployeePerformance() {
  const [selected, setSelected] = useState('30D');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const days = ranges.find(r => r.label === selected)?.days || 30;
    fetch(`http://localhost:5000/api/employee/performance?days=${days}`)
      .then(res => res.json())
      .then(rows => {
        setData(rows);
        setLoading(false);
      });
  }, [selected]);

  return (
    <div className="bg-[#f8fafc] min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-6">Employee Performance</h1>
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
            <div>
              <h2 className="text-2xl font-bold mb-1">Employee Revenue Details</h2>
              <p className="text-gray-500 text-sm">Revenue and performance by employee. Click a row for details.</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {ranges.map(r => (
                <button
                  key={r.label}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold border border-gray-200 shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/40 ${selected === r.label ? 'bg-primary text-white border-primary scale-105' : 'bg-gray-100 text-gray-700 hover:bg-primary/10'}`}
                  onClick={() => setSelected(r.label)}
                >{r.label}</button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-gray-100">
            <table className="min-w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-gray-500 text-xs uppercase tracking-wider">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">New Listing Revenue</th>
                  <th className="py-3 px-4">Optimized Listing Revenue</th>
                  <th className="py-3 px-4">Total Revenue</th>
                  <th className="py-3 px-4">Change</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="text-center py-8">Loading...</td></tr>
                ) : data.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8">No data</td></tr>
                ) : data.map(emp => {
                  const pct = percentChange(emp.totalRevenue, emp.prevTotalRevenue);
                  return (
                    <tr key={emp.id} className="group hover:bg-blue-50/60 cursor-pointer transition rounded-2xl shadow-sm border border-transparent hover:border-blue-200" tabIndex={0}>
                      <td className="py-3 px-4 font-semibold flex items-center gap-3 align-middle">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-primary font-bold text-base uppercase">{emp.initials}</span>
                        {emp.name}
                      </td>
                      <td className="py-3 px-4 align-middle">${emp.newListingRevenue.toLocaleString()}</td>
                      <td className="py-3 px-4 align-middle">${emp.optimizedListingRevenue.toLocaleString()}</td>
                      <td className="py-3 px-4 align-middle font-bold">${emp.totalRevenue.toLocaleString()}</td>
                      <td className={`py-3 px-4 align-middle font-semibold ${pct > 0 ? 'text-green-600' : pct < 0 ? 'text-red-600' : 'text-gray-400'}`}>{pct > 0 ? '↑' : pct < 0 ? '↓' : ''} {Math.abs(pct)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
