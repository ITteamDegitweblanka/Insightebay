import React, { useState, useEffect } from 'react';

const ranges = ["7D", "15D", "30D", "90D"];

function SoldListingsTable() {
  const [selected, setSelected] = useState("30D");
  const [data, setData] = useState({ totals: {}, rows: [] });

  useEffect(() => {
    // Map range to days
    const rangeToDays = { '7D': 7, '15D': 15, '30D': 30, '90D': 90 };
    const days = rangeToDays[selected] || 30;
    fetch(`http://localhost:5000/api/sales/sold?days=${days}`)
      .then(res => res.json())
      .then(rows => {
        // Aggregate totals and build rows for table
        let totals = { soldQty: 0, orders: 0, sales: 0 };
        const mapped = rows.map(row => {
          const salesAmount = Number(row.salesAmount || row.sales || 0);
          totals.soldQty += Number(row.quantity || row.soldQty || 0);
          totals.orders += Number(row.orders || 0);
          totals.sales += salesAmount;
          return {
            id: row.listingId,
            soldQty: Number(row.quantity || row.soldQty || 0),
            soldQtyChange: Number(row.soldQtyChange ?? 0),
            orders: Number(row.orders || 0),
            ordersChange: Number(row.ordersChange ?? 0),
            sales: salesAmount,
            salesChange: Number(row.salesChange ?? 0),
            impressions: Number(row.impressions ?? 0),
            impressionsChange: Number(row.impressionsChange ?? 0),
            clicks: Number(row.clicks ?? 0),
            clicksChange: Number(row.clicksChange ?? 0),
          };
        });
        setData({ totals, rows: mapped });
      });
  }, [selected]);

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 mb-10 border border-gray-100 transition-all duration-300">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-4 gap-2">
        <div>
          <h2 className="text-3xl font-extrabold flex items-center gap-2 mb-1 text-primary">
            Sold Listings
            <span className="ml-1 text-blue-400" title="Recently sold items overview.">
              <svg width='20' height='20' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10'/><path d='M12 8v4l3 3'/></svg>
            </span>
          </h2>
          <p className="text-gray-500 text-sm">Overview of recently sold items. Click a row for details.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {ranges.map(r => (
            <button
              key={r}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border border-gray-200 shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/40 ${selected === r ? 'bg-primary text-white border-primary scale-105' : 'bg-gray-100 text-gray-700 hover:bg-primary/10'}`}
              onClick={() => setSelected(r)}
            >{r}</button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-gray-100">
        <table className="min-w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-gray-500 text-xs uppercase tracking-wider">
              <th className="py-3 px-4">Item ID</th>
              <th className="py-3 px-4">Sold Qty</th>
              <th className="py-3 px-4">Orders</th>
              <th className="py-3 px-4">Sales</th>
              <th className="py-3 px-4">Impressions</th>
              <th className="py-3 px-4">Clicks</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-primary/5 font-bold rounded-2xl text-primary">
              <td className="px-4 py-3">Totals</td>
              <td className="px-4 py-3">{data.totals.soldQty}</td>
              <td className="px-4 py-3">{data.totals.orders}</td>
              <td className="px-4 py-3">${Number(data.totals.sales || 0).toLocaleString(undefined, {minimumFractionDigits:2})}</td>
              <td className="px-4 py-3">{data.rows.reduce((a, b) => a + (b.impressions || 0), 0)}</td>
              <td className="px-4 py-3">{data.rows.reduce((a, b) => a + (b.clicks || 0), 0)}</td>
            </tr>
            {data.rows.map(row => (
              <tr key={row.id} className="group hover:bg-blue-50/60 cursor-pointer transition rounded-2xl shadow-sm border border-transparent hover:border-blue-200" tabIndex={0} title="Click for details" style={{ borderRadius: '16px' }}>
                <td className="py-3 px-4 font-semibold group-hover:text-primary transition-colors align-middle">{row.id}</td>
                <td className="py-3 px-4 align-middle">
                  <span className="inline-block bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-bold shadow-sm">{row.soldQty}</span>
                  <span className={`ml-2 text-xs font-semibold ${row.soldQtyChange > 0 ? 'text-green-600' : row.soldQtyChange < 0 ? 'text-red-600' : 'text-gray-400'}`}> 
                    {row.soldQtyChange > 0 && '↑'}
                    {row.soldQtyChange < 0 && '↓'}
                    {Math.abs(row.soldQtyChange)}%
                  </span>
                </td>
                <td className="py-3 px-4 align-middle">
                  <span className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-bold shadow-sm">{row.orders}</span>
                  <span className={`ml-2 text-xs font-semibold ${row.ordersChange > 0 ? 'text-green-600' : row.ordersChange < 0 ? 'text-red-600' : 'text-gray-400'}`}> 
                    {row.ordersChange > 0 && '↑'}
                    {row.ordersChange < 0 && '↓'}
                    {Math.abs(row.ordersChange)}%
                  </span>
                </td>
                <td className="py-3 px-4 align-middle">
                  <span className="inline-block bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold shadow-sm">${row.sales.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
                  <span className={`ml-2 text-xs font-semibold ${row.salesChange > 0 ? 'text-green-600' : row.salesChange < 0 ? 'text-red-600' : 'text-gray-400'}`}> 
                    {row.salesChange > 0 && '↑'}
                    {row.salesChange < 0 && '↓'}
                    {Math.abs(row.salesChange)}%
                  </span>
                </td>
                <td className="py-3 px-4 align-middle">
                  <span className="inline-block bg-gray-50 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold shadow-sm">{row.impressions}</span>
                  <span className={`ml-2 text-xs font-semibold ${row.impressionsChange > 0 ? 'text-green-600' : row.impressionsChange < 0 ? 'text-red-600' : 'text-gray-400'}`}> 
                    {row.impressionsChange > 0 && '↑'}
                    {row.impressionsChange < 0 && '↓'}
                    {Math.abs(row.impressionsChange)}%
                  </span>
                </td>
                <td className="py-3 px-4 align-middle">
                  <span className="inline-block bg-gray-50 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold shadow-sm">{row.clicks}</span>
                  <span className={`ml-2 text-xs font-semibold ${row.clicksChange > 0 ? 'text-green-600' : row.clicksChange < 0 ? 'text-red-600' : 'text-gray-400'}`}> 
                    {row.clicksChange > 0 && '↑'}
                    {row.clicksChange < 0 && '↓'}
                    {Math.abs(row.clicksChange)}%
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

export default SoldListingsTable;
