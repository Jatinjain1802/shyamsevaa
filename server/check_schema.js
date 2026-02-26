import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

async function run() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'shyampuja',
    port: process.env.DB_PORT || 3306
  });

  const [t] = await db.query("SHOW CREATE TABLE poojas").catch(() => [[{}]]);
  console.log('--- poojas Schema ---');
  console.log(t[0]['Create Table']);
  
  const [u] = await db.query("SHOW CREATE TABLE users").catch(() => [[{}]]);
  console.log('--- users Schema ---');
  console.log(u[0]['Create Table']);
  
  process.exit(0);
}

run().catch(console.error);
