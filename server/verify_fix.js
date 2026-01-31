import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

console.log("Testing connection...");
console.log("Target Database:", process.env.DB_NAME);

try {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });
    console.log("✅ Successfully connected to database:", process.env.DB_NAME);
    await connection.end();
} catch (error) {
    console.error("❌ Connection failed:", error.message);
    if (error.code === 'ER_BAD_DB_ERROR') {
        console.error("The database '" + process.env.DB_NAME + "' does not exist.");
    }
    process.exit(1);
}
