import React from 'react';
import SoldListingsTable from '../components/SoldListingsTable';
import ListingHealthClassifier from '../components/ListingHealthClassifier';

function Reports() {
  return (
    <div className="bg-[#f8fafc] min-h-screen p-0 md:p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-primary mb-6">Reports</h1>
        <div className="mb-8">
          <SoldListingsTable />
        </div>
        {/* ListingHealthClassifier removed as requested */}
      </div>
    </div>
  );
}

export default Reports;
