
import db from "./src/config/db.js";

const checkGallery = async () => {
    try {
        const [rows] = await db.query("SELECT * FROM pooja_gallery");
        console.log("Gallery entries:", rows);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkGallery();
