import pool from './src/db.js';

async function migrate() {

  // Employees
  await pool.query(`INSERT IGNORE INTO employees (id, name, role) VALUES
    (1, 'Alice', 'Manager'),
    (2, 'Bob', 'Staff'),
    (3, 'Priya Patel', 'Analyst'),
    (4, 'James Smith', 'Sales'),
    (5, 'Maria Garcia', 'Support')
  `);

  // Listings
  await pool.query(`INSERT IGNORE INTO listings (id, sku, title, category, createdBy, createdAt, updatedAt) VALUES
    (1, 'SKU001', 'iPhone 14 Pro Case', 'Electronics', 1, '2025-05-01', '2025-06-15'),
    (2, 'SKU002', 'USB-C Fast Charger', 'Electronics', 2, '2025-05-10', '2025-06-20'),
    (3, 'SKU003', 'Gaming Mouse Pad', 'Computers', 3, '2025-05-15', '2025-06-10'),
    (4, 'SKU004', 'LED Strip Light', 'Home & Garden', 4, '2025-05-20', '2025-06-15'),
    (5, 'SKU005', 'Vintage Leather Jacket', 'Fashion', 5, '2025-05-25', '2025-06-18'),
    (6, 'SKU006', 'Smart Home Hub Pro', 'Electronics', 1, '2025-06-01', '2025-06-25'),
    (7, 'SKU007', 'Antique Wooden Chess Set', 'Collectibles', 2, '2025-06-05', '2025-06-22'),
    (8, 'SKU008', 'Ergonomic Office Chair', 'Home & Garden', 3, '2025-06-10', '2025-06-28'),
    (9, 'SKU009', 'High-Performance Blender', 'Appliances', 4, '2025-06-15', '2025-06-29')
  `);

  // Listing Metrics (simulate 30 days for each listing)
  for (let l = 1; l <= 9; l++) {
    for (let d = 0; d < 30; d++) {
      const date = new Date(2025, 5, 1 + d); // June 2025
      const impressions = Math.floor(Math.random() * 3000 + 200);
      const clicks = Math.floor(impressions * (0.03 + Math.random() * 0.07));
      const sales = Math.floor(clicks * (0.05 + Math.random() * 0.15));
      const revenue = sales * (50 + Math.random() * 200);
      await pool.query(`INSERT IGNORE INTO listing_metrics (listingId, date, impressions, clicks, sales, revenue) VALUES (?, ?, ?, ?, ?, ?)`,
        [l, date.toISOString().slice(0, 10), impressions, clicks, sales, revenue]);
    }
  }

  // Listing Optimizations
  await pool.query(`INSERT IGNORE INTO listing_optimizations (id, listingId, oldCategory, newCategory, changedBy, changedAt) VALUES
    (1, 1, 'Electronics', 'Gadgets', 1, '2025-06-15'),
    (2, 2, 'Electronics', 'Chargers', 2, '2025-06-20'),
    (3, 3, 'Computers', 'Gaming', 3, '2025-06-10'),
    (4, 4, 'Home & Garden', 'Lighting', 4, '2025-06-15'),
    (5, 5, 'Fashion', 'Vintage', 5, '2025-06-18')
  `);

  // Orders (simulate some orders for each listing)
  let orderId = 1;
  for (let l = 1; l <= 9; l++) {
    for (let d = 0; d < 10; d++) {
      const date = new Date(2025, 5, 10 + d);
      const quantity = Math.floor(Math.random() * 3 + 1);
      const salesAmount = quantity * (50 + Math.random() * 200);
      await pool.query(`INSERT IGNORE INTO orders (orderId, listingId, quantity, orderDate, salesAmount) VALUES (?, ?, ?, ?, ?)`,
        [orderId++, l, quantity, date.toISOString().slice(0, 10), salesAmount]);
    }
  }

  // Performance Logs for all periods and employees
  const employees = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Priya Patel' },
    { id: 4, name: 'James Smith' },
    { id: 5, name: 'Maria Garcia' },
  ];
  const periods = [
    { label: '7D', base: 7 },
    { label: '14D', base: 14 },
    { label: '30D', base: 30 },
    { label: '90D', base: 90 },
  ];
  let perfRows = [];
  let perfId = 1;
  for (const emp of employees) {
    let baseRevenue = 50000 + Math.floor(Math.random() * 100000);
    for (const period of periods) {
      // Simulate previous period as well for chart comparison
      for (let which = 0; which < 2; which++) {
        const pLabel = which === 0 ? period.label : (period.base * 2) + 'D';
        // Make previous period revenue a bit lower or higher
        let revenue = baseRevenue + (which === 0 ? 0 : Math.floor((Math.random() - 0.5) * 20000));
        let newListings = Math.floor(Math.random() * 3 + 1);
        let optimizedListings = Math.floor(Math.random() * 2 + 1);
        let score = 70 + Math.floor(Math.random() * 30);
        perfRows.push(`(${perfId++}, ${emp.id}, '${pLabel}', ${newListings}, ${optimizedListings}, ${revenue}, ${score})`);
      }
    }
  }
  await pool.query(`DELETE FROM performance_logs`);
  await pool.query(`INSERT IGNORE INTO performance_logs (id, employeeId, period, newListings, optimizedListings, revenue, score) VALUES ${perfRows.join(",\n")}`);

  console.log('Mock data migrated successfully!');
  process.exit(0);
}

migrate().catch(e => { console.error(e); process.exit(1); });
