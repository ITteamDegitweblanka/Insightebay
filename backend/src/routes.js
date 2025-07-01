
import express from 'express';
import pool from './db.js';
const router = express.Router();
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key';

function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(auth.replace('Bearer ', ''), JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user?.isAdmin) return res.status(403).json({ error: 'Admin only' });
  next();
}
// --- User Management (admin only) ---
// List users (admin only)
router.get('/users', requireAuth, requireAdmin, async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, name, email, isAdmin FROM users');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Add user (admin only)
router.post('/users', requireAuth, requireAdmin, async (req, res) => {
  const { name, email, password, isAdmin } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
  try {
    const [users] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (users.length > 0) return res.status(409).json({ error: 'Email already registered' });
    const bcrypt = (await import('bcryptjs')).default;
    const hash = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, ?)', [name, email, hash, !!isAdmin]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add user' });
  }
});

// Delete user (admin only)
router.delete('/users/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});


// ...existing code...

// Signup (admin only, or for initial user creation)
router.post('/auth/signup', async (req, res) => {
  const { username, name, email, password } = req.body;
  if (!username || !name || !password) return res.status(400).json({ error: 'All fields required' });
  try {
    const [users] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
    if (users.length > 0) return res.status(409).json({ error: 'Username already exists' });
    const hash = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (username, name, email, password) VALUES (?, ?, ?, ?)', [username, name, email, hash]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Signup failed' });
  }
});

// Login (by username)
router.post('/auth/login', async (req, res) => {
  console.log('Login request body:', req.body);
  const { username, password } = req.body;
  if (!username || !password) {
    console.log('Missing username or password');
    return res.status(400).json({ error: 'All fields required' });
  }
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    console.log('User lookup result:', users);
    if (users.length === 0) {
      console.log('No user found for username:', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    console.log('Password match result:', match);
    if (!match) {
      console.log('Password did not match for user:', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, username: user.username, name: user.name, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '1d' });
    console.log('Login successful for user:', username);
    res.json({ token, user: { id: user.id, username: user.username, name: user.name, isAdmin: user.isAdmin } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Logout (client-side: just remove token)
router.post('/auth/logout', (req, res) => {
  // No server action needed for JWT logout
  res.json({ success: true });
});





// Employee performance table API
router.get('/employee/performance', async (req, res) => {
  const days = Number(req.query.days) || 30;
  // Get all employees
  const [employees] = await pool.query('SELECT id, name FROM employees');
  // Get current and previous period logs
  const [current] = await pool.query(`
    SELECT employeeId, period, SUM(CASE WHEN period = ? THEN revenue ELSE 0 END) as totalRevenue,
      SUM(CASE WHEN period = ? THEN newListings ELSE 0 END) as newListings,
      SUM(CASE WHEN period = ? THEN optimizedListings ELSE 0 END) as optimizedListings,
      SUM(CASE WHEN period = ? THEN revenue ELSE 0 END) as newListingRevenue,
      SUM(CASE WHEN period = ? THEN revenue ELSE 0 END) as optimizedListingRevenue
    FROM performance_logs
    WHERE period IN (?, ?)
    GROUP BY employeeId
  `, [days + 'D', days + 'D', days + 'D', days + 'D', days + 'D', days + 'D', (days * 2) + 'D']);
  const [prev] = await pool.query(`
    SELECT employeeId, SUM(revenue) as prevTotalRevenue
    FROM performance_logs
    WHERE period = ?
    GROUP BY employeeId
  `, [(days * 2) + 'D']);
  const prevMap = {};
  prev.forEach(e => { prevMap[e.employeeId] = Number(e.prevTotalRevenue || 0); });
  // Compose response
  const result = employees.map(emp => {
    const row = current.find(e => e.employeeId === emp.id) || {};
    const initials = emp.name.split(' ').map(n => n[0]).join('').toUpperCase();
    return {
      id: emp.id,
      name: emp.name,
      initials,
      newListingRevenue: Number(row.newListingRevenue || 0),
      optimizedListingRevenue: Number(row.optimizedListingRevenue || 0),
      totalRevenue: Number(row.totalRevenue || 0),
      prevTotalRevenue: prevMap[emp.id] || 0
    };
  });
  res.json(result);
});



// 6. Listing Performance Segments
router.get('/listings/segments', async (req, res) => {
  // Monthly goal for sales (can be made dynamic)
  const MONTHLY_GOAL = 10;
  const WEEKLY_GOAL = MONTHLY_GOAL / 4;

  // Join optimizations, listings, employees
  const [optimizations] = await pool.query(`
    SELECT lo.id as optimizationId, lo.listingId as itemId, l.title, lo.changedAt as optimizedDate,
      lo.changedBy, e.name as optimizerName
    FROM listing_optimizations lo
    LEFT JOIN listings l ON lo.listingId = l.id
    LEFT JOIN employees e ON lo.changedBy = e.id
    ORDER BY lo.changedAt DESC
  `);
  // For each optimization, fetch before/after metrics (7 days window) and classify segment
  function classifySegment(metrics) {
    const impressions = metrics.impressions || 0;
    const clicks = metrics.clicks || 0;
    const sales = metrics.sales || 0;
    if (impressions === 0 || clicks === 0) return 'Dead';
    if (impressions > 0 && clicks > 0 && sales === 0) return 'Poor';
    if (sales < 0.2 * WEEKLY_GOAL) return 'Low';
    if (sales < 0.5 * WEEKLY_GOAL) return 'Medium';
    return 'Best';
  }
  // Segment order for comparison
  const segmentOrder = ['Dead', 'Poor', 'Low', 'Medium', 'Best'];

  const results = await Promise.all(optimizations.map(async (opt) => {
    // 7 days before and after the optimization date
    const [beforeMetrics] = await pool.query(`
      SELECT SUM(impressions) as impressions, SUM(clicks) as clicks, SUM(sales) as sales,
        ROUND(100 * SUM(clicks) / NULLIF(SUM(impressions),0), 2) as ctr
      FROM listing_metrics
      WHERE listingId = ? AND date < DATE(?) AND date >= DATE_SUB(DATE(?), INTERVAL 7 DAY)
    `, [opt.itemId, opt.optimizedDate, opt.optimizedDate]);
    const [afterMetrics] = await pool.query(`
      SELECT SUM(impressions) as impressions, SUM(clicks) as clicks, SUM(sales) as sales,
        ROUND(100 * SUM(clicks) / NULLIF(SUM(impressions),0), 2) as ctr
      FROM listing_metrics
      WHERE listingId = ? AND date >= DATE(?) AND date < DATE_ADD(DATE(?), INTERVAL 7 DAY)
    `, [opt.itemId, opt.optimizedDate, opt.optimizedDate]);

    // Segment classification
    const beforeSegment = classifySegment(beforeMetrics[0]);
    const afterSegment = classifySegment(afterMetrics[0]);

    // Change arrow logic
    const beforeIdx = segmentOrder.indexOf(beforeSegment);
    const afterIdx = segmentOrder.indexOf(afterSegment);
    let change = 'nochange';
    if (afterIdx > beforeIdx) change = afterIdx - beforeIdx === 1 ? 'up' : 'upup';
    else if (afterIdx < beforeIdx) change = 'down';

    // History for charting (14 days window)
    const [history] = await pool.query(`
      SELECT date, impressions, clicks, sales,
        ROUND(100 * clicks / NULLIF(impressions,0), 2) as ctr
      FROM listing_metrics
      WHERE listingId = ? AND date >= DATE_SUB(DATE(?), INTERVAL 7 DAY) AND date < DATE_ADD(DATE(?), INTERVAL 7 DAY)
      ORDER BY date ASC
    `, [opt.itemId, opt.optimizedDate, opt.optimizedDate]);

    return {
      itemId: opt.itemId,
      title: opt.title,
      optimizedDate: opt.optimizedDate,
      beforeSegment,
      afterSegment,
      change,
      optimizationMeta: {
        optimizerName: opt.optimizerName,
        changedBy: opt.changedBy,
        optimizedDate: opt.optimizedDate
      },
      beforeMetrics: beforeMetrics[0],
      afterMetrics: afterMetrics[0],
      history
    };
  }));
  res.json(results);
});



// 1. Analyze listing health
router.get('/listings/analyze', async (req, res) => {
  // Return all listings with performance metrics only (no health classification)
  const [rows] = await pool.query(`
    SELECT l.id, l.title, lm.impressions, lm.clicks, lm.sales
    FROM listings l
    LEFT JOIN listing_metrics lm ON l.id = lm.listingId
    ORDER BY l.id DESC
  `);
  res.json(rows);
});

// 2. Get employee KPIs
router.get('/employees/performance', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM performance_logs');
  res.json(rows);
});

// 3. Optimization before/after metrics
router.get('/listings/compare', async (req, res) => {
  // Example: return all optimizations
  const [rows] = await pool.query('SELECT * FROM listing_optimizations');
  res.json(rows);
});

// 4. Filtered sold item stats
router.get('/sales/sold', async (req, res) => {
  // Get days param, default 30
  const days = Number(req.query.days) || 30;

  // Get current period sales/orders
  const [currentRows] = await pool.query(`
    SELECT 
      o.listingId,
      l.title,
      SUM(o.quantity) as quantity,
      COUNT(o.orderId) as orders,
      SUM(o.salesAmount) as salesAmount,
      l.category
    FROM orders o
    LEFT JOIN listings l ON o.listingId = l.id
    WHERE o.orderDate >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
    GROUP BY o.listingId, l.title, l.category
    ORDER BY SUM(o.salesAmount) DESC
  `, [days]);

  // Previous period sales/orders
  const [prevRows] = await pool.query(`
    SELECT 
      o.listingId,
      SUM(o.quantity) as quantity,
      COUNT(o.orderId) as orders,
      SUM(o.salesAmount) as salesAmount
    FROM orders o
    WHERE o.orderDate >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      AND o.orderDate < DATE_SUB(CURDATE(), INTERVAL ? DAY)
    GROUP BY o.listingId
  `, [days * 2, days]);
  const prevMap = {};
  prevRows.forEach(r => { prevMap[r.listingId] = r; });

  // Get current period impressions/clicks
  const [metrics] = await pool.query(`
    SELECT listingId, SUM(impressions) as impressions, SUM(clicks) as clicks
    FROM listing_metrics
    WHERE date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
    GROUP BY listingId
  `, [days]);
  const metricsMap = {};
  metrics.forEach(m => { metricsMap[m.listingId] = m; });

  // Get previous period impressions/clicks
  const [prevMetrics] = await pool.query(`
    SELECT listingId, SUM(impressions) as impressions, SUM(clicks) as clicks
    FROM listing_metrics
    WHERE date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      AND date < DATE_SUB(CURDATE(), INTERVAL ? DAY)
    GROUP BY listingId
  `, [days * 2, days]);
  const prevMetricsMap = {};
  prevMetrics.forEach(m => { prevMetricsMap[m.listingId] = m; });

  // Attach metrics and calculate % change
  const result = currentRows.map(row => {
    const prev = prevMap[row.listingId] || {};
    const currMetrics = metricsMap[row.listingId] || {};
    const prevMetrics = prevMetricsMap[row.listingId] || {};
    function pctChange(curr, prev) {
      if (prev == null || prev === 0) return curr ? 100 : 0;
      return ((curr - prev) / Math.abs(prev) * 100).toFixed(1);
    }
    return {
      ...row,
      impressions: Number(currMetrics.impressions || 0),
      impressionsChange: Number(pctChange(currMetrics.impressions || 0, prevMetrics.impressions || 0)),
      clicks: Number(currMetrics.clicks || 0),
      clicksChange: Number(pctChange(currMetrics.clicks || 0, prevMetrics.clicks || 0)),
      soldQtyChange: Number(pctChange(row.quantity || 0, prev.quantity || 0)),
      ordersChange: Number(pctChange(row.orders || 0, prev.orders || 0)),
      salesChange: Number(pctChange(row.salesAmount || 0, prev.salesAmount || 0)),
    };
  });
  res.json(result);
});

// 5. Dashboard KPIs and top data
router.get('/dashboard/summary', async (req, res) => {
  // Accept start, end, and days params
  const { start, end, days } = req.query;
  let dateFilter = '';
  let params = [];
  let useDays = Number(days) || null;
  if (start && end) {
    dateFilter = 'WHERE lm.date >= ? AND lm.date <= ?';
    params = [start, end];
  } else if (useDays) {
    dateFilter = 'WHERE lm.date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)';
    params = [useDays];
  }
  // Aggregate summary with date filter
  const [[summary]] = await pool.query(`
    SELECT 
      SUM(lm.revenue) as revenue,
      SUM(lm.sales) as orders,
      SUM(lm.impressions) as impressions,
      ROUND(100 * SUM(lm.clicks) / NULLIF(SUM(lm.impressions),0), 2) as ctr
    FROM listing_metrics lm
    ${dateFilter}
  `, params);
  // Top 10 listings by revenue with date filter
  const [topListings] = await pool.query(`
    SELECT l.id, l.title, SUM(lm.revenue) as revenue, SUM(lm.sales) as orders, ROUND(100 * SUM(lm.clicks) / NULLIF(SUM(lm.impressions),0), 2) as ctr
    FROM listings l
    LEFT JOIN listing_metrics lm ON l.id = lm.listingId
    ${dateFilter.replace(/lm\./g, 'lm.')}
    GROUP BY l.id, l.title
    ORDER BY revenue DESC
    LIMIT 10
  `, params);

  // Employee revenue for current and previous period
  let empRevenueCurrent = [], empRevenuePrev = [];
  if (useDays) {
    // Current period
    [empRevenueCurrent] = await pool.query(`
      SELECT e.name, SUM(pl.revenue) as revenue
      FROM performance_logs pl
      LEFT JOIN employees e ON pl.employeeId = e.id
      WHERE pl.period = ?
      GROUP BY e.name
    `, [useDays + 'D']);
    // Previous period
    [empRevenuePrev] = await pool.query(`
      SELECT e.name, SUM(pl.revenue) as revenue
      FROM performance_logs pl
      LEFT JOIN employees e ON pl.employeeId = e.id
      WHERE pl.period = ?
      GROUP BY e.name
    `, [(useDays * 2) + 'D']);
  }
  // Merge for chart: [{ name, revenue, prevRevenue }]
  let employeeRevenue = [];
  if (empRevenueCurrent.length) {
    const prevMap = {};
    empRevenuePrev.forEach(e => { prevMap[e.name] = Number(e.revenue || 0); });
    employeeRevenue = empRevenueCurrent.map(e => ({
      name: e.name,
      revenue: Number(e.revenue || 0),
      prevRevenue: prevMap[e.name] || 0
    }));
  }

  res.json({ ...summary, topListings, employeeRevenue });
});

export default router;
