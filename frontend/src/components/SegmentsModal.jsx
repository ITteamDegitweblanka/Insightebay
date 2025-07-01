import React from 'react';

export default function SegmentsModal({ open, onClose, data }) {
  if (!open || !data) return null;
  const { title, optimizationMeta, beforeMetrics, afterMetrics, beforeSegment, afterSegment, history } = data;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl">×</button>
        <h2 className="text-xl font-bold mb-2">Listing Optimization Details</h2>
        <div className="mb-4">
          <div className="font-semibold">{title}</div>
          <div className="text-sm text-gray-500">Optimized by: <span className="font-medium text-gray-700">{optimizationMeta?.optimizerName || 'N/A'}</span></div>
          <div className="text-sm text-gray-500">Date: <span className="font-medium text-gray-700">{optimizationMeta?.optimizedDate ? new Date(optimizationMeta.optimizedDate).toLocaleDateString() : 'N/A'}</span></div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="font-semibold mb-1">Before Optimization <span className="ml-2 text-xs px-2 py-1 rounded bg-gray-200 text-gray-700">{beforeSegment}</span></div>
            <div className="text-xs text-gray-500">Impr: <b>{beforeMetrics?.impressions ?? 'N/A'}</b> | Clicks: <b>{beforeMetrics?.clicks ?? 'N/A'}</b> | Sales: <b>{beforeMetrics?.sales ?? 'N/A'}</b> | CTR: <b>{beforeMetrics?.ctr ?? 'N/A'}%</b></div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="font-semibold mb-1">After Optimization <span className="ml-2 text-xs px-2 py-1 rounded bg-gray-200 text-gray-700">{afterSegment}</span></div>
            <div className="text-xs text-gray-500">Impr: <b>{afterMetrics?.impressions ?? 'N/A'}</b> | Clicks: <b>{afterMetrics?.clicks ?? 'N/A'}</b> | Sales: <b>{afterMetrics?.sales ?? 'N/A'}</b> | CTR: <b>{afterMetrics?.ctr ?? 'N/A'}%</b></div>
          </div>
        </div>
        <div className="mb-2 font-semibold">Performance Trend (14 days)</div>
        <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center">
          {/* Chart placeholder - replace with chart lib if desired */}
          <svg width="100%" height="100%" viewBox="0 0 320 80">
            {history && history.length > 1 && (
              <polyline
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                points={history.map((h, i) => `${(i/(history.length-1))*320},${80-(h.sales/Math.max(...history.map(x=>x.sales||1)))*70}` ).join(' ')}
              />
            )}
          </svg>
        </div>
      </div>
    </div>
  );
}
