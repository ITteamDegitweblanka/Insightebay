// Script to create an admin user in the users table
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const dbConfig = {
  host: 'localhost',
  user: 'root', // change as needed
  password: '', // change as needed
  database: 'insights_db' // change as needed
};

const adminUser = {
  username: 'admin',
  name: 'Administrator',
  email: 'admin@example.com',
  password: 'admin@123', // CHANGE THIS to a strong password
  isAdmin: true
};

async function createAdmin() {
  const conn = await mysql.createConnection(dbConfig);
  const hash = await bcrypt.hash(adminUser.password, 10);
  await conn.execute(
    'INSERT INTO users (username, name, email, password, isAdmin) VALUES (?, ?, ?, ?, ?)',
    [adminUser.username, adminUser.name, adminUser.email, hash, adminUser.isAdmin]
  );
  await conn.end();
  console.log('Admin user created!');
}

createAdmin().catch(console.error);
