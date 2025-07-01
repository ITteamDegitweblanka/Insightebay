import React from 'react';
import SegmentsTable from '../components/SegmentsTable';

function Segments() {
  return (
    <div className="bg-[#f8fafc] min-h-screen p-0 md:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-primary mb-6">Performance Segments</h1>
        <SegmentsTable />
      </div>
    </div>
  );
}

export default Segments;
