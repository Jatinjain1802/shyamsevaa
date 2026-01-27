import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  dateStrings: true
});

// Test DB connection
try {
  const connection = await db.getConnection();
  console.log("MySQL connected successfully");
  connection.release();
} catch (error) {
  console.error(" MySQL connection failed:", error.message);
}

export default db;
