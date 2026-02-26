import mysql from 'mysql2/promise';

async function run() {
  const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'shyampuja'
  });
  
  const [rows] = await db.query('SHOW TABLES');
  const tables = rows.map(r => Object.values(r)[0]);
  console.log('--- TABLES ---');
  tables.forEach(t => console.log(t));
  
  process.exit(0);
}
run().catch(console.error);
