import pool from './db.js';
import { createTablesSQL } from './models.js';

export async function initDb() {
  const conn = await pool.getConnection();
  try {
    for (const sql of createTablesSQL) {
      await conn.query(sql);
    }
    console.log('Database tables ensured.');
  } finally {
    conn.release();
  }
}
