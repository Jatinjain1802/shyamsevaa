import db from './src/config/db.js';
try {
    const [cols] = await db.query('DESCRIBE addons');
    console.log(JSON.stringify(cols, null, 2));
} catch (err) {
    console.error(err);
}
process.exit();
