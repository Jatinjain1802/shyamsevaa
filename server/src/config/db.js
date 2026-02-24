import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { initializeDatabase } from "./initDB.js";

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  dateStrings: true
});

// Test DB connection
db.getConnection()
  .then(async (connection) => {
    console.log("MySQL connected successfully");
    connection.release();
    
    // Initialize Database Tables
    await initializeDatabase();
  })
  .catch((error) => {
    console.error(" MySQL connection failed:", error.message);
  });

export default db;
