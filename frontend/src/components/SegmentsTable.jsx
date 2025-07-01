import React, { useEffect, useState } from 'react';
import SegmentsModal from './SegmentsModal';

const badgeStyle = segment => {
  switch (segment) {
    case 'Best':
    case 'Best Performer':
      return 'bg-green-100 text-green-700 border border-green-300 shadow-sm';
    case 'Medium':
    case 'Medium Performer':
      return 'bg-yellow-100 text-yellow-800 border border-yellow-300 shadow-sm';
    case 'Low':
    case 'Low Performer':
      return 'bg-red-100 text-red-700 border border-red-300 shadow-sm';
    case 'Poor':
      return 'bg-orange-100 text-orange-700 border border-orange-300 shadow-sm';
    case 'Dead':
      return 'bg-gray-200 text-gray-600 border border-gray-300 shadow-sm';
    case 'N/A':
      return 'bg-blue-500 text-white border border-blue-400 shadow-sm';
    default:
      return 'bg-blue-100 text-blue-700 border border-blue-300 shadow-sm';
  }
};

const badgeLabel = segment => {
  switch (segment) {
    case 'Best':
    case 'Best Performer':
      return 'Best Performer';
    case 'Medium':
    case 'Medium Performer':
      return 'Medium Performer';
    case 'Low':
    case 'Low Performer':
      return 'Low Performer';
    case 'Poor':
      return 'Poor Performer';
    case 'Dead':
      return 'Dead';
    case 'N/A':
      return 'N/A';
    default:
      return segment || 'N/A';
  }
};


function SegmentsTable() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null); // for modal
  useEffect(() => {
    fetch('http://localhost:5000/api/listings/segments')
      .then(res => res.json())
      .then(rows => {
        setData(rows.map(row => ({
          id: row.itemId,
          name: row.title || 'N/A',
          date: row.optimizedDate ? new Date(row.optimizedDate).toLocaleDateString() : 'N/A',
          before: row.beforeSegment,
          after: row.afterSegment,
          change: row.change,
          full: row // keep full row for modal
        })));
      });
  }, []);
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-300">
      <h2 className="text-2xl font-extrabold mb-1 flex items-center gap-2">
        Listing Performance Segments
        <span className="ml-2 text-blue-400" title="Compare before/after optimization.">
          <svg width='18' height='18' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10'/><path d='M12 8v4l3 3'/></svg>
        </span>
      </h2>
      <p className="text-gray-500 text-sm mb-6">Comparison of listing performance before and after optimization. Click a row for details.</p>
      <div className="overflow-x-auto rounded-xl bg-white">
        <table className="min-w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-gray-500 text-sm">
              <th className="py-2 px-3">Item No</th>
              <th className="py-2 px-3">Name</th>
              <th className="py-2 px-3">Optimized Date</th>
              <th className="py-2 px-3">Segment Before</th>
              <th className="py-2 px-3">Segment After</th>
            </tr>
          </thead>
          <tbody>
            {data.map(row => (
              <tr
                key={row.id}
                className="group hover:bg-blue-50 cursor-pointer transition rounded-xl"
                tabIndex={0}
                title="Click for details"
                style={{ borderRadius: '12px' }}
                onClick={() => setSelected(row.full)}
              >
                <td className="py-2 px-3 font-semibold group-hover:text-primary transition-colors">{row.id}</td>
                <td className="py-2 px-3">{row.name}</td>
                <td className="py-2 px-3">{row.date}</td>
                <td className="py-2 px-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow transition ${badgeStyle(row.before)}`}>{badgeLabel(row.before)}</span>
                </td>
                <td className="py-2 px-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow transition ${badgeStyle(row.after)}`}>{badgeLabel(row.after)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SegmentsModal open={!!selected} onClose={() => setSelected(null)} data={selected} />
    </div>
  );
}

export default SegmentsTable;
