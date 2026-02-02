
import db from "./src/config/db.js";

const updateTable = async () => {
    try {
        // Check if column exists first or just try to add it.
        // Simpler to just try adding it. If it fails (duplicate column), we catch it.
        await db.query(`
      ALTER TABLE pooja_gallery
      ADD COLUMN description TEXT
    `);
        console.log("Column description added to pooja_gallery.");
        process.exit(0);
    } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log("Column description already exists.");
            process.exit(0);
        }
        console.error("Error updating table:", err);
        process.exit(1);
    }
};

updateTable();
