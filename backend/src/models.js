// Database models (table creation SQL for reference)
export const createTablesSQL = [
  `CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    role VARCHAR(50)
  )`,
  `CREATE TABLE IF NOT EXISTS listings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(50),
    title VARCHAR(255),
    category VARCHAR(100),
    createdBy INT,
    createdAt DATETIME,
    updatedAt DATETIME
  )`,
  `CREATE TABLE IF NOT EXISTS listing_metrics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    listingId INT,
    date DATE,
    impressions INT,
    clicks INT,
    sales INT,
    revenue DECIMAL(10,2)
  )`,
  `CREATE TABLE IF NOT EXISTS listing_optimizations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    listingId INT,
    oldCategory VARCHAR(100),
    newCategory VARCHAR(100),
    changedBy INT,
    changedAt DATETIME
  )`,
  `CREATE TABLE IF NOT EXISTS orders (
    orderId INT AUTO_INCREMENT PRIMARY KEY,
    listingId INT,
    quantity INT,
    orderDate DATE,
    salesAmount DECIMAL(10,2)
  )`,
  `CREATE TABLE IF NOT EXISTS performance_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employeeId INT,
    period VARCHAR(10),
    newListings INT,
    optimizedListings INT,
    revenue DECIMAL(10,2),
    score INT
  )`
];
