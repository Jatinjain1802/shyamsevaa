const mysql = require('mysql2');

// Create connection pool
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',        // default XAMPP user
//   password: '',        // default XAMPP password (empty)
  database: 'shyamsevaa',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('❌ MySQL connection failed:', err.message);
  } else {
    console.log('✅ MySQL connected successfully');
    connection.release();
  }
});

module.exports = db;
