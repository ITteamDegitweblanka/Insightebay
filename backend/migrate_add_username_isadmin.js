// Migration script to update users table for username and isAdmin fields
import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'root', // change as needed
  password: '', // change as needed
  database: 'insights_db' // change as needed
};

async function migrate() {
  const conn = await mysql.createConnection(dbConfig);
  // Add username column if not exists
  await conn.execute(`ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(100) UNIQUE`);
  // Add isAdmin column if not exists
  await conn.execute(`ALTER TABLE users ADD COLUMN IF NOT EXISTS isAdmin BOOLEAN DEFAULT FALSE`);
  // Optionally, set username for existing users (copy from email or name)
  await conn.execute(`UPDATE users SET username = email WHERE username IS NULL OR username = ''`);
  await conn.end();
  console.log('Migration complete!');
}

migrate().catch(console.error);
