import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  const [rows] = await connection.query("SHOW TABLES LIKE 'whatsapp_campaign%'");
  console.log('Campaign Tables Found:', rows.map(r => Object.values(r)[0]));
  
  const [cols] = await connection.query("DESCRIBE whatsapp_jobs");
  const hasCampaignId = cols.some(c => c.Field === 'campaign_id');
  console.log('whatsapp_jobs has campaign_id:', hasCampaignId);

  await connection.end();
}

check().catch(console.error);
