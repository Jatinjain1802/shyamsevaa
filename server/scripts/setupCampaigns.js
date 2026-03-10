import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const schema = `
CREATE TABLE IF NOT EXISTS whatsapp_campaigns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  template_id INT NOT NULL,
  template_name VARCHAR(255) NOT NULL,
  status ENUM('draft', 'scheduled', 'processing', 'completed', 'paused', 'failed') DEFAULT 'draft',
  total_recipients INT DEFAULT 0,
  sent_count INT DEFAULT 0,
  delivered_count INT DEFAULT 0,
  read_count INT DEFAULT 0,
  failed_count INT DEFAULT 0,
  variable_mapping JSON,
  scheduled_at DATETIME NULL,
  created_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (template_id) REFERENCES whatsapp_templates(id)
) ENGINE=InnoDB;

-- Add campaign_id to whatsapp_jobs to track which job belongs to which campaign
ALTER TABLE whatsapp_jobs ADD COLUMN IF NOT EXISTS campaign_id INT NULL AFTER booking_id;
ALTER TABLE whatsapp_jobs ADD INDEX IF NOT EXISTS idx_campaign_id (campaign_id);

-- Track individual logs for campaigns
CREATE TABLE IF NOT EXISTS whatsapp_campaign_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  campaign_id INT NOT NULL,
  phone VARCHAR(20) NOT NULL,
  wamid VARCHAR(255) NULL,
  status VARCHAR(50) DEFAULT 'queued', -- queued, sent, delivered, read, failed
  error_message TEXT NULL,
  context JSON NULL, -- stores the specific variables used for this recipient
  sent_at DATETIME NULL,
  delivered_at DATETIME NULL,
  read_at DATETIME NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (campaign_id) REFERENCES whatsapp_campaigns(id) ON DELETE CASCADE
) ENGINE=InnoDB;
`;

async function setup() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
  });

  try {
    console.log('--- Initializing Campaign Tables ---');
    await connection.query(schema);
    console.log('✅ Campaign tables created/updated successfully.');
  } catch (err) {
    console.error('❌ Error creating campaign tables:', err.message);
  } finally {
    await connection.end();
  }
}

setup();
