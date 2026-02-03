
import db from "./src/config/db.js";

const createTables = async () => {
    try {
        // Create chadawa_gallery table
        await db.query(`
      CREATE TABLE IF NOT EXISTS chadawa_gallery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        chadawa_id INT NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (chadawa_id) REFERENCES chadawas(id) ON DELETE CASCADE
      )
    `);
        console.log("Table chadawa_gallery created successfully.");

        // Create temple_gallery table
        await db.query(`
      CREATE TABLE IF NOT EXISTS temple_gallery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        temple_id INT NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (temple_id) REFERENCES temples(id) ON DELETE CASCADE
      )
    `);
        console.log("Table temple_gallery created successfully.");

        process.exit(0);
    } catch (err) {
        console.error("Error creating tables:", err);
        process.exit(1);
    }
};

createTables();
