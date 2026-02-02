
import db from "./src/config/db.js";

const createTable = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS pooja_gallery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        pooja_id INT NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (pooja_id) REFERENCES poojas(id) ON DELETE CASCADE
      )
    `);
    console.log("Table pooja_gallery created successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Error creating table:", err);
    process.exit(1);
  }
};

createTable();
