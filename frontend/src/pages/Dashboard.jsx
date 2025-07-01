
import React, { useEffect, useState } from 'react';
import DashboardSummaryCards from '../components/DashboardSummaryCards';
import EmployeeRevenueChart from '../components/EmployeeRevenueChart';
import CategoryPerformancePie from '../components/CategoryPerformancePie';
import TopListingsTable from '../components/TopListingsTable';

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [start, setStart] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().slice(0, 10);
  });
  const [end, setEnd] = useState(() => new Date().toISOString().slice(0, 10));
  const [empRange, setEmpRange] = useState('30D');
  const rangeToDays = { '7D': 7, '14D': 14, '30D': 30, '90D': 90 };

  // Fetch summary for cards, pie, top listings (date range)
  useEffect(() => {
    fetch(`http://localhost:5000/api/dashboard/summary?start=${start}&end=${end}`)
      .then(res => res.json())
      .then(data => setSummary(data));
  }, [start, end]);

  // Fetch employee revenue for selected range
  const [employeeRevenue, setEmployeeRevenue] = useState([]);
  useEffect(() => {
    const days = rangeToDays[empRange] || 30;
    fetch(`http://localhost:5000/api/dashboard/summary?days=${days}`)
      .then(res => res.json())
      .then(data => setEmployeeRevenue(data.employeeRevenue || []));
  }, [empRange]);

  return (
    <div className="bg-[#f8fafc] min-h-screen p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <h1 className="text-4xl font-bold text-primary mb-2 md:mb-0">Dashboard</h1>
        <div className="flex items-center gap-2 bg-white border px-4 py-2 rounded shadow text-gray-700 text-sm">
          <svg width="18" height="18" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="4"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          <input type="date" value={start} onChange={e => setStart(e.target.value)} className="border rounded px-2 py-1 mr-1" />
          <span>-</span>
          <input type="date" value={end} onChange={e => setEnd(e.target.value)} className="border rounded px-2 py-1 ml-1" />
        </div>
      </div>
      <DashboardSummaryCards data={summary} />
      <div className="flex flex-col md:flex-row gap-6">
        <EmployeeRevenueChart data={employeeRevenue} onRangeChange={setEmpRange} />
        <CategoryPerformancePie data={summary?.categoryPerformance} />
      </div>
      <TopListingsTable listings={summary?.topListings || []} />
    </div>
  );
}

export default Dashboard;
