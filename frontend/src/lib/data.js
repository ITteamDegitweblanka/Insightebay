// Mock data for prototyping
export const employees = [
  { id: 1, name: 'Alice', role: 'Manager' },
  { id: 2, name: 'Bob', role: 'Staff' },
];

export const listings = [
  { id: 1, sku: 'SKU001', title: 'Product 1', category: 'Electronics', createdBy: 1, createdAt: '2025-06-01', updatedAt: '2025-06-15' },
  { id: 2, sku: 'SKU002', title: 'Product 2', category: 'Home', createdBy: 2, createdAt: '2025-06-05', updatedAt: '2025-06-20' },
];

export const listing_metrics = [
  { listingId: 1, date: '2025-06-30', impressions: 100, clicks: 10, sales: 2, revenue: 200 },
  { listingId: 2, date: '2025-06-30', impressions: 0, clicks: 0, sales: 0, revenue: 0 },
];

export const orders = [
  { orderId: 1, listingId: 1, quantity: 2, orderDate: '2025-06-30', salesAmount: 200 },
];

export const performance_logs = [
  { employeeId: 1, period: '2025-06', newListings: 1, optimizedListings: 0, revenue: 200, score: 90 },
  { employeeId: 2, period: '2025-06', newListings: 1, optimizedListings: 1, revenue: 0, score: 60 },
];
