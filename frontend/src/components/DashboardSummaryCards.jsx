import React from 'react';
import { DollarSign, ShoppingCart, BarChart2, Percent } from 'lucide-react';

const icons = [
  <DollarSign size={24} className="text-primary" />,
  <ShoppingCart size={24} className="text-primary" />,
  <BarChart2 size={24} className="text-primary" />,
  <Percent size={24} className="text-primary" />,
];

const cardData = [
  { label: 'Total Revenue', key: 'revenue', icon: 0, unit: '$' },
  { label: 'Total Orders', key: 'orders', icon: 1 },
  { label: 'Impressions', key: 'impressions', icon: 2 },
  { label: 'Click-Through Rate', key: 'ctr', icon: 3, unit: '%' },
];


function DashboardSummaryCards({ data }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {cardData.map((card, i) => (
        <div
          key={card.key}
          className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-2 min-w-[200px] border border-transparent hover:border-primary/30 hover:shadow-xl transition-all duration-200 group"
        >
          <div className="flex items-center gap-2 text-gray-700 font-semibold mb-1">
            <span className="group-hover:scale-110 transition-transform">{icons[card.icon]}</span>
            <span>{card.label}</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-extrabold text-primary">
              {card.unit === '$' ? '$' : ''}
              {data?.[card.key] ?? '--'}
              {card.unit === '%' ? '%' : ''}
            </span>
          </div>
          <div className="text-xs flex items-center gap-1">
            <span className={
              data?.[`${card.key}Change`] > 0
                ? 'text-green-600'
                : data?.[`${card.key}Change`] < 0
                ? 'text-red-600'
                : 'text-gray-400'
            }>
              {data?.[`${card.key}Change`] > 0 && '▲'}
              {data?.[`${card.key}Change`] < 0 && '▼'}
              {Math.abs(data?.[`${card.key}Change`] ?? 0)}%
            </span>
            <span className="text-gray-400">from last month</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DashboardSummaryCards;
