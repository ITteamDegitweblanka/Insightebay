import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#2563eb', '#22c55e', '#a21caf', '#fbbf24', '#f97316'];

function CategoryPerformancePie({ data }) {
  if (!data) return null;
  return (
    <div className="bg-white rounded-xl shadow p-6 min-w-[300px]">
      <h2 className="text-xl font-bold mb-1">Category Performance</h2>
      <p className="text-gray-500 text-sm mb-4">Breakdown of performance by category.</p>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            fill="#2563eb"
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CategoryPerformancePie;
