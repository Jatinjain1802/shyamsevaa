import db from "./db.js";

// =============================================================================
// DATABASE SCHEMA DEFINITION
// =============================================================================
// ðŸ“š LEARNING: This is a "single source of truth" pattern.
//   - All table structures are defined here in ONE place.
//   - The `columns` array in each table is used for AUTO-MIGRATION.
//   - When you add a new column to `columns`, the system automatically
//     runs ALTER TABLE to add it in production without manual intervention.
//   - The `query` is used for the initial CREATE TABLE (fresh install).
// =============================================================================

const tables = [
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // USERS
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    name: "users",
    query: `
      CREATE TABLE IF NOT EXISTS users (
        id              INT AUTO_INCREMENT PRIMARY KEY,
        name            VARCHAR(255) NOT NULL,
        email           VARCHAR(255) NOT NULL UNIQUE,
        mobile          VARCHAR(20),
        password        VARCHAR(255) NOT NULL,
        role            VARCHAR(50)  DEFAULT 'user',
        address         TEXT,
        city            VARCHAR(100),
        state           VARCHAR(100),
        otp             VARCHAR(10),
        otp_expires_at  DATETIME,
        created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `,
    // ðŸ“š LEARNING: `columns` mirrors the CREATE TABLE above.
    //   Each entry has: name, definition (used in ALTER TABLE ADD COLUMN),
    //   and optionally `after` (which column it should appear after).
    columns: [
      { name: "id",             definition: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "name",           definition: "VARCHAR(255) NOT NULL" },
      { name: "email",          definition: "VARCHAR(255) NOT NULL UNIQUE" },
      { name: "mobile",         definition: "VARCHAR(20)" },
      { name: "password",       definition: "VARCHAR(255) NOT NULL" },
      { name: "role",           definition: "VARCHAR(50) DEFAULT 'user'" },
      { name: "address",        definition: "TEXT",         after: "role" },
      { name: "city",           definition: "VARCHAR(100)", after: "address" },
      { name: "state",          definition: "VARCHAR(100)", after: "city" },
      { name: "otp",            definition: "VARCHAR(10)" },
      { name: "otp_expires_at", definition: "DATETIME" },
      { name: "created_at",     definition: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP" },
    ],
  },

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // TEMPLES
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    name: "temples",
    query: `
      CREATE TABLE IF NOT EXISTS temples (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        title       VARCHAR(255) NOT NULL,
        image       VARCHAR(255),
        description TEXT,
        city        VARCHAR(100),
        state       VARCHAR(100),
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `,
    columns: [
      { name: "id",          definition: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "title",       definition: "VARCHAR(255) NOT NULL" },
      { name: "image",       definition: "VARCHAR(255)" },
      { name: "description", definition: "TEXT" },
      { name: "city",        definition: "VARCHAR(100)" },
      { name: "state",       definition: "VARCHAR(100)" },
      { name: "created_at",  definition: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP" },
    ],
  },

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // TEMPLE GALLERY
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    name: "temple_gallery",
    query: `
      CREATE TABLE IF NOT EXISTS temple_gallery (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        temple_id   INT NOT NULL,
        image_url   VARCHAR(255) NOT NULL,
        description VARCHAR(255),
        FOREIGN KEY (temple_id) REFERENCES temples(id) ON DELETE CASCADE
      )
    `,
    columns: [
      { name: "id",          definition: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "temple_id",   definition: "INT NOT NULL" },
      { name: "image_url",   definition: "VARCHAR(255) NOT NULL" },
      { name: "description", definition: "VARCHAR(255)" },
    ],
  },

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // POOJAS
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    name: "poojas",
    query: `
      CREATE TABLE IF NOT EXISTS poojas (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        title       VARCHAR(255) NOT NULL,
        image       VARCHAR(255),
        description TEXT,
        benefits    TEXT,
        pooja_date  DATE,
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `,
    columns: [
      { name: "id",          definition: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "title",       definition: "VARCHAR(255) NOT NULL" },
      { name: "image",       definition: "VARCHAR(255)" },
      { name: "description", definition: "TEXT" },
      { name: "benefits",    definition: "TEXT" },
      { name: "pooja_date",  definition: "DATE" },
      { name: "created_at",  definition: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP" },
    ],
  },

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // POOJA FAQs
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    name: "pooja_faqs",
    query: `
      CREATE TABLE IF NOT EXISTS pooja_faqs (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        pooja_id   INT NOT NULL,
        question   TEXT NOT NULL,
        answer     TEXT NOT NULL,
        status     TINYINT DEFAULT 1,
        sort_order INT DEFAULT 0,
        FOREIGN KEY (pooja_id) REFERENCES poojas(id) ON DELETE CASCADE
      )
    `,
    columns: [
      { name: "id",         definition: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "pooja_id",   definition: "INT NOT NULL" },
      { name: "question",   definition: "TEXT NOT NULL" },
      { name: "answer",     definition: "TEXT NOT NULL" },
      { name: "status",     definition: "TINYINT DEFAULT 1" },
      { name: "sort_order", definition: "INT DEFAULT 0" },
    ],
  },

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // POOJA VARIANTS
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    name: "pooja_variants",
    query: `
      CREATE TABLE IF NOT EXISTS pooja_variants (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        pooja_id    INT NOT NULL,
        persons     INT NOT NULL,
        description TEXT,
        price       DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (pooja_id) REFERENCES poojas(id) ON DELETE CASCADE
      )
    `,
    columns: [
      { name: "id",          definition: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "pooja_id",    definition: "INT NOT NULL" },
      { name: "persons",     definition: "INT NOT NULL" },
      { name: "description", definition: "TEXT" },
      { name: "price",       definition: "DECIMAL(10, 2) NOT NULL" },
    ],
  },

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // POOJA TEMPLES (pivot / junction table)
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    name: "pooja_temples",
    query: `
      CREATE TABLE IF NOT EXISTS pooja_temples (
        id        INT AUTO_INCREMENT PRIMARY KEY,
        pooja_id  INT NOT NULL,
        temple_id INT NOT NULL,
        FOREIGN KEY (pooja_id)  REFERENCES poojas(id)   ON DELETE CASCADE,
        FOREIGN KEY (temple_id) REFERENCES temples(id)  ON DELETE CASCADE
      )
    `,
    columns: [
      { name: "id",        definition: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "pooja_id",  definition: "INT NOT NULL" },
      { name: "temple_id", definition: "INT NOT NULL" },
    ],
  },

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // POOJA GALLERY
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    name: "pooja_gallery",
    query: `
      CREATE TABLE IF NOT EXISTS pooja_gallery (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        pooja_id    INT NOT NULL,
        image_url   VARCHAR(255) NOT NULL,
        description VARCHAR(255),
        FOREIGN KEY (pooja_id) REFERENCES poojas(id) ON DELETE CASCADE
      )
    `,
    columns: [
      { name: "id",          definition: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "pooja_id",    definition: "INT NOT NULL" },
      { name: "image_url",   definition: "VARCHAR(255) NOT NULL" },
      { name: "description", definition: "VARCHAR(255)" },
    ],
  },

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // ADDONS
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    name: "addons",
    query: `
      CREATE TABLE IF NOT EXISTS addons (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        title       VARCHAR(255) NOT NULL,
        image       VARCHAR(255),
        description TEXT,
        price       DECIMAL(10, 2) NOT NULL,
        is_common   TINYINT DEFAULT 0,
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `,
    columns: [
      { name: "id",          definition: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "title",       definition: "VARCHAR(255) NOT NULL" },
      { name: "image",       definition: "VARCHAR(255)" },
      { name: "description", definition: "TEXT" },
      { name: "price",       definition: "DECIMAL(10, 2) NOT NULL" },
      { name: "is_common",   definition: "TINYINT DEFAULT 0" },
      { name: "created_at",  definition: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP" },
    ],
  },

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // POOJA ADDONS (pivot)
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    name: "pooja_addons",
    query: `
      CREATE TABLE IF NOT EXISTS pooja_addons (
        id       INT AUTO_INCREMENT PRIMARY KEY,
        pooja_id INT NOT NULL,
        addon_id INT NOT NULL,
        FOREIGN KEY (pooja_id) REFERENCES poojas(id)  ON DELETE CASCADE,
        FOREIGN KEY (addon_id) REFERENCES addons(id)  ON DELETE CASCADE
      )
    `,
    columns: [
      { name: "id",       definition: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "pooja_id", definition: "INT NOT NULL" },
      { name: "addon_id", definition: "INT NOT NULL" },
    ],
  },

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // CHADAWAS
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    name: "chadawas",
    query: `
      CREATE TABLE IF NOT EXISTS chadawas (
        id           INT AUTO_INCREMENT PRIMARY KEY,
        title        VARCHAR(255) NOT NULL,
        image        VARCHAR(255),
        description  TEXT,
        benefits     TEXT,
        chadawa_date DATE,
        created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `,
    columns: [
      { name: "id",           definition: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "title",        definition: "VARCHAR(255) NOT NULL" },
      { name: "image",        definition: "VARCHAR(255)" },
      { name: "description",  definition: "TEXT" },
      { name: "benefits",     definition: "TEXT" },
      { name: "chadawa_date", definition: "DATE" },
      { name: "created_at",   definition: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP" },
    ],
  },

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // CHADAWA ITEMS
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    name: "chadawa_items",
    query: `
      CREATE TABLE IF NOT EXISTS chadawa_items (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        chadawa_id  INT NOT NULL,
        title       VARCHAR(255) NOT NULL,
        description TEXT,
        price       DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (chadawa_id) REFERENCES chadawas(id) ON DELETE CASCADE
      )
    `,
    columns: [
      { name: "id",          definition: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "chadawa_id",  definition: "INT NOT NULL" },
      { name: "title",       definition: "VARCHAR(255) NOT NULL" },
      { name: "description", definition: "TEXT" },
      { name: "price",       definition: "DECIMAL(10, 2) NOT NULL" },
    ],
  },

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // CHADAWA BENEFITS
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    name: "chadawa_benefits",
    query: `
      CREATE TABLE IF NOT EXISTS chadawa_benefits (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        chadawa_id  INT NOT NULL,
        title       VARCHAR(255) NOT NULL,
        description TEXT,
        FOREIGN KEY (chadawa_id) REFERENCES chadawas(id) ON DELETE CASCADE
      )
    `,
    columns: [
      { name: "id",          definition: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "chadawa_id",  definition: "INT NOT NULL" },
      { name: "title",       definition: "VARCHAR(255) NOT NULL" },
      { name: "description", definition: "TEXT" },
    ],
  },

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // CHADAWA TEMPLES (pivot)
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    name: "chadawa_temples",
    query: `
      CREATE TABLE IF NOT EXISTS chadawa_temples (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        chadawa_id INT NOT NULL,
        temple_id  INT NOT NULL,
        FOREIGN KEY (chadawa_id) REFERENCES chadawas(id) ON DELETE CASCADE,
        FOREIGN KEY (temple_id)  REFERENCES temples(id)  ON DELETE CASCADE
      )
    `,
    columns: [
      { name: "id",         definition: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "chadawa_id", definition: "INT NOT NULL" },
      { name: "temple_id",  definition: "INT NOT NULL" },
    ],
  },

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // CHADAWA REVIEWS
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    name: "chadawa_reviews",
    query: `
      CREATE TABLE IF NOT EXISTS chadawa_reviews (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        chadawa_id INT NOT NULL,
        user_name  VARCHAR(255) NOT NULL,
        rating     INT NOT NULL,
        comment    TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (chadawa_id) REFERENCES chadawas(id) ON DELETE CASCADE
      )
    `,
    columns: [
      { name: "id",         definition: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "chadawa_id", definition: "INT NOT NULL" },
      { name: "user_name",  definition: "VARCHAR(255) NOT NULL" },
      { name: "rating",     definition: "INT NOT NULL" },
      { name: "comment",    definition: "TEXT" },
      { name: "created_at", definition: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP" },
    ],
  },

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // CHADAWA GALLERY
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    name: "chadawa_gallery",
    query: `
      CREATE TABLE IF NOT EXISTS chadawa_gallery (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        chadawa_id  INT NOT NULL,
        image_url   VARCHAR(255) NOT NULL,
        description VARCHAR(255),
        FOREIGN KEY (chadawa_id) REFERENCES chadawas(id) ON DELETE CASCADE
      )
    `,
    columns: [
      { name: "id",          definition: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "chadawa_id",  definition: "INT NOT NULL" },
      { name: "image_url",   definition: "VARCHAR(255) NOT NULL" },
      { name: "description", definition: "VARCHAR(255)" },
    ],
  },

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // REVIEWS (Pooja reviews)
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    name: "reviews",
    query: `
      CREATE TABLE IF NOT EXISTS reviews (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        pooja_id   INT NOT NULL,
        user_name  VARCHAR(255) NOT NULL,
        rating     INT NOT NULL,
        comment    TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (pooja_id) REFERENCES poojas(id) ON DELETE CASCADE
      )
    `,
    columns: [
      { name: "id",         definition: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "pooja_id",   definition: "INT NOT NULL" },
      { name: "user_name",  definition: "VARCHAR(255) NOT NULL" },
      { name: "rating",     definition: "INT NOT NULL" },
      { name: "comment",    definition: "TEXT" },
      { name: "created_at", definition: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP" },
    ],
  },

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // PRODUCTS
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    name: "products",
    query: `
      CREATE TABLE IF NOT EXISTS products (
        id             INT AUTO_INCREMENT PRIMARY KEY,
        name           VARCHAR(255) NOT NULL,
        description    TEXT,
        price          DECIMAL(10, 2) NOT NULL,
        stock_quantity INT DEFAULT 0,
        image_url      VARCHAR(255),
        category       VARCHAR(100),
        status         TINYINT DEFAULT 1,
        created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `,
    columns: [
      { name: "id",             definition: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "name",           definition: "VARCHAR(255) NOT NULL" },
      { name: "description",    definition: "TEXT" },
      { name: "price",          definition: "DECIMAL(10, 2) NOT NULL" },
      { name: "stock_quantity", definition: "INT DEFAULT 0" },
      { name: "image_url",      definition: "VARCHAR(255)" },
      { name: "category",       definition: "VARCHAR(100)" },
      { name: "status",         definition: "TINYINT DEFAULT 1",           after: "category" },
      { name: "created_at",     definition: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP" },
    ],
  },

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // CARTS
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    name: "carts",
    query: `
      CREATE TABLE IF NOT EXISTS carts (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        user_id    INT NULL,
        session_id VARCHAR(255) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `,
    columns: [
      { name: "id",         definition: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "user_id",    definition: "INT NULL" },
      { name: "session_id", definition: "VARCHAR(255) NULL" },
      { name: "created_at", definition: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP" },
    ],
  },

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // CART ITEMS
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    name: "cart_items",
    query: `
      CREATE TABLE IF NOT EXISTS cart_items (
        id               INT AUTO_INCREMENT PRIMARY KEY,
        cart_id          INT NOT NULL,
        product_type     VARCHAR(50) NOT NULL,
        pooja_variant_id INT NULL,
        chadawa_item_id  INT NULL,
        product_id       INT NULL,
        temple_id        INT NULL,
        quantity         INT DEFAULT 1,
        base_price       DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (cart_id)          REFERENCES carts(id)          ON DELETE CASCADE,
        FOREIGN KEY (pooja_variant_id) REFERENCES pooja_variants(id) ON DELETE SET NULL,
        FOREIGN KEY (chadawa_item_id)  REFERENCES chadawa_items(id)  ON DELETE SET NULL,
        FOREIGN KEY (product_id)       REFERENCES products(id)       ON DELETE SET NULL,
        FOREIGN KEY (temple_id)        REFERENCES temples(id)        ON DELETE CASCADE
      )
    `,
    columns: [
      { name: "id",               definition: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "cart_id",          definition: "INT NOT NULL" },
      { name: "product_type",     definition: "VARCHAR(50) NOT NULL" },
      { name: "pooja_variant_id", definition: "INT NULL" },
      { name: "chadawa_item_id",  definition: "INT NULL" },
      { name: "product_id",       definition: "INT NULL",                       after: "chadawa_item_id" },
      { name: "temple_id",        definition: "INT NULL" },
      { name: "quantity",         definition: "INT DEFAULT 1" },
      { name: "base_price",       definition: "DECIMAL(10, 2) NOT NULL" },
    ],
  },

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // CART ITEM ADDONS
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    name: "cart_item_addons",
    query: `
      CREATE TABLE IF NOT EXISTS cart_item_addons (
        id           INT AUTO_INCREMENT PRIMARY KEY,
        cart_item_id INT NOT NULL,
        addon_id     INT NOT NULL,
        price        DECIMAL(10, 2) NOT NULL,
        quantity     INT DEFAULT 1,
        FOREIGN KEY (cart_item_id) REFERENCES cart_items(id) ON DELETE CASCADE,
        FOREIGN KEY (addon_id)     REFERENCES addons(id)     ON DELETE CASCADE
      )
    `,
    columns: [
      { name: "id",           definition: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "cart_item_id", definition: "INT NOT NULL" },
      { name: "addon_id",     definition: "INT NOT NULL" },
      { name: "price",        definition: "DECIMAL(10, 2) NOT NULL" },
      { name: "quantity",     definition: "INT DEFAULT 1" },
    ],
  },

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // ORDERS
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    name: "orders",
    query: `
      CREATE TABLE IF NOT EXISTS orders (
        id                   INT AUTO_INCREMENT PRIMARY KEY,
        user_id              INT,
        order_number         VARCHAR(50) NOT NULL UNIQUE,
        total_amount         DECIMAL(10, 2) NOT NULL,
        payment_status       VARCHAR(50) DEFAULT 'pending',
        payment_id           VARCHAR(255),
        customer_name        VARCHAR(255),
        communication_mobile VARCHAR(20),
        shipping_address     TEXT,
        invoice_path         VARCHAR(255),
        created_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `,
    columns: [
      { name: "id",                   definition: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "user_id",              definition: "INT" },
      { name: "order_number",         definition: "VARCHAR(50) NOT NULL UNIQUE" },
      { name: "total_amount",         definition: "DECIMAL(10, 2) NOT NULL" },
      { name: "payment_status",       definition: "VARCHAR(50) DEFAULT 'pending'" },
      { name: "payment_id",           definition: "VARCHAR(255)" },
      { name: "customer_name",        definition: "VARCHAR(255)",  after: "payment_id" },
      { name: "communication_mobile", definition: "VARCHAR(20)",   after: "customer_name" },
      { name: "shipping_address",     definition: "TEXT",          after: "communication_mobile" },
      { name: "invoice_path",         definition: "VARCHAR(255)",  after: "shipping_address" },
      { name: "created_at",           definition: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP" },
    ],
  },

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // ORDER ITEMS
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    name: "order_items",
    query: `
      CREATE TABLE IF NOT EXISTS order_items (
        id               INT AUTO_INCREMENT PRIMARY KEY,
        order_id         INT NOT NULL,
        product_type     VARCHAR(50) NOT NULL,
        pooja_variant_id INT NULL,
        chadawa_item_id  INT NULL,
        product_id       INT NULL,
        temple_id        INT NULL,
        quantity         INT NOT NULL,
        price            DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (order_id)         REFERENCES orders(id)         ON DELETE CASCADE,
        FOREIGN KEY (pooja_variant_id) REFERENCES pooja_variants(id) ON DELETE SET NULL,
        FOREIGN KEY (chadawa_item_id)  REFERENCES chadawa_items(id)  ON DELETE SET NULL,
        FOREIGN KEY (product_id)       REFERENCES products(id)       ON DELETE SET NULL,
        FOREIGN KEY (temple_id)        REFERENCES temples(id)        ON DELETE CASCADE
      )
    `,
    columns: [
      { name: "id",               definition: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "order_id",         definition: "INT NOT NULL" },
      { name: "product_type",     definition: "VARCHAR(50) NOT NULL" },
      { name: "pooja_variant_id", definition: "INT NULL" },
      { name: "chadawa_item_id",  definition: "INT NULL" },
      { name: "product_id",       definition: "INT NULL",                       after: "chadawa_item_id" },
      { name: "temple_id",        definition: "INT NULL" },
      { name: "quantity",         definition: "INT NOT NULL" },
      { name: "price",            definition: "DECIMAL(10, 2) NOT NULL" },
    ],
  },

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // ORDER ITEM ADDONS
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    name: "order_item_addons",
    query: `
      CREATE TABLE IF NOT EXISTS order_item_addons (
        id            INT AUTO_INCREMENT PRIMARY KEY,
        order_item_id INT NOT NULL,
        addon_id      INT NOT NULL,
        price         DECIMAL(10, 2) NOT NULL,
        quantity      INT NOT NULL,
        FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE,
        FOREIGN KEY (addon_id)      REFERENCES addons(id)      ON DELETE CASCADE
      )
    `,
    columns: [
      { name: "id",            definition: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "order_item_id", definition: "INT NOT NULL" },
      { name: "addon_id",      definition: "INT NOT NULL" },
      { name: "price",         definition: "DECIMAL(10, 2) NOT NULL" },
      { name: "quantity",      definition: "INT NOT NULL" },
    ],
  },

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // BOOKINGS
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    name: "bookings",
    query: `
      CREATE TABLE IF NOT EXISTS bookings (
        id            INT AUTO_INCREMENT PRIMARY KEY,
        order_item_id INT NOT NULL,
        pooja_date    DATE NOT NULL,
        devotee_name  VARCHAR(255) NOT NULL,
        gotra         VARCHAR(255),
        mobile        VARCHAR(20),
        status        VARCHAR(50) DEFAULT 'pending',
        created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE
      )
    `,
    columns: [
      { name: "id",            definition: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "order_item_id", definition: "INT NOT NULL" },
      { name: "pooja_date",    definition: "DATE NOT NULL" },
      { name: "devotee_name",  definition: "VARCHAR(255) NOT NULL" },
      { name: "gotra",         definition: "VARCHAR(255)" },
      { name: "mobile",        definition: "VARCHAR(20)" },
      { name: "status",        definition: "VARCHAR(50) DEFAULT 'pending'" },
      { name: "created_at",    definition: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP" },
    ],
  },

  // -----------------------------------------------------------------------------
  // WHATSAPP TEMPLATES
  // -----------------------------------------------------------------------------
  {
    name: "whatsapp_templates",
    query: `
      CREATE TABLE IF NOT EXISTS whatsapp_templates (
        id               INT AUTO_INCREMENT PRIMARY KEY,
        name             VARCHAR(191) NOT NULL,
        category         VARCHAR(30) NOT NULL,
        language         VARCHAR(20) NOT NULL DEFAULT 'en_US',
        structure_json   JSON NOT NULL,
        status           VARCHAR(30) NOT NULL DEFAULT 'local_pending',
        meta_template_id VARCHAR(255),
        meta_status      VARCHAR(30),
        rejection_reason TEXT,
        sample_media_url TEXT,
        is_active        TINYINT(1) NOT NULL DEFAULT 1,
        created_by       INT NULL,
        last_synced_at   DATETIME,
        created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uk_whatsapp_templates_name_lang (name, language),
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `,
    columns: [
      { name: "id",               definition: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "name",             definition: "VARCHAR(191) NOT NULL" },
      { name: "category",         definition: "VARCHAR(30) NOT NULL" },
      { name: "language",         definition: "VARCHAR(20) NOT NULL DEFAULT 'en_US'" },
      { name: "structure_json",   definition: "JSON NOT NULL" },
      { name: "status",           definition: "VARCHAR(30) NOT NULL DEFAULT 'local_pending'" },
      { name: "meta_template_id", definition: "VARCHAR(255)" },
      { name: "meta_status",      definition: "VARCHAR(30)" },
      { name: "rejection_reason", definition: "TEXT" },
      { name: "sample_media_url", definition: "TEXT" },
      { name: "is_active",        definition: "TINYINT(1) NOT NULL DEFAULT 1" },
      { name: "created_by",       definition: "INT NULL" },
      { name: "last_synced_at",   definition: "DATETIME" },
      { name: "created_at",       definition: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP" },
      { name: "updated_at",       definition: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" },
    ],
  },

  // -----------------------------------------------------------------------------
  // WHATSAPP TEMPLATE USECASE MAPPINGS
  // -----------------------------------------------------------------------------
  {
    name: "whatsapp_template_usecases",
    query: `
      CREATE TABLE IF NOT EXISTS whatsapp_template_usecases (
        id               INT AUTO_INCREMENT PRIMARY KEY,
        use_case         VARCHAR(100) NOT NULL UNIQUE,
        template_id      INT NOT NULL,
        variable_mapping JSON,
        updated_by       INT NULL,
        created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (template_id) REFERENCES whatsapp_templates(id) ON DELETE CASCADE,
        FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `,
    columns: [
      { name: "id",               definition: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "use_case",         definition: "VARCHAR(100) NOT NULL UNIQUE" },
      { name: "template_id",      definition: "INT NOT NULL" },
      { name: "variable_mapping", definition: "JSON" },
      { name: "updated_by",       definition: "INT NULL" },
      { name: "created_at",       definition: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP" },
      { name: "updated_at",       definition: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" },
    ],
  },
  // -----------------------------------------------------------------------------
  // WHATSAPP CONTACTS
  // -----------------------------------------------------------------------------
  {
    name: "whatsapp_contacts",
    query: `
      CREATE TABLE IF NOT EXISTS whatsapp_contacts (
        id              INT AUTO_INCREMENT PRIMARY KEY,
        user_id         INT NULL,
        phone_e164      VARCHAR(20) NOT NULL UNIQUE,
        name            VARCHAR(255),
        opt_in_status   VARCHAR(20) DEFAULT 'unknown',
        opt_in_source   VARCHAR(100),
        opt_in_at       DATETIME,
        opt_out_at      DATETIME,
        last_inbound_at DATETIME,
        created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `,
    columns: [
      { name: "id",              definition: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "user_id",         definition: "INT NULL" },
      { name: "phone_e164",      definition: "VARCHAR(20) NOT NULL UNIQUE" },
      { name: "name",            definition: "VARCHAR(255)" },
      { name: "opt_in_status",   definition: "VARCHAR(20) DEFAULT 'unknown'" },
      { name: "opt_in_source",   definition: "VARCHAR(100)" },
      { name: "opt_in_at",       definition: "DATETIME" },
      { name: "opt_out_at",      definition: "DATETIME" },
      { name: "last_inbound_at", definition: "DATETIME" },
      { name: "created_at",      definition: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP" },
    ],
  },

  // -----------------------------------------------------------------------------
  // WHATSAPP MESSAGES
  // -----------------------------------------------------------------------------
  {
    name: "whatsapp_messages",
    query: `
      CREATE TABLE IF NOT EXISTS whatsapp_messages (
        id            BIGINT AUTO_INCREMENT PRIMARY KEY,
        wamid         VARCHAR(255) UNIQUE,
        direction     VARCHAR(20) NOT NULL DEFAULT 'outbound',
        message_type  VARCHAR(30) NOT NULL DEFAULT 'template',
        phone         VARCHAR(20) NOT NULL,
        template_name VARCHAR(255),
        content       TEXT,
        media_url     TEXT,
        status        VARCHAR(30) DEFAULT 'queued',
        order_id      INT NULL,
        booking_id    INT NULL,
        error_log     TEXT,
        sent_at       DATETIME,
        delivered_at  DATETIME,
        read_at       DATETIME,
        failed_at     DATETIME,
        created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
        FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL
      )
    `,
    columns: [
      { name: "id",            definition: "BIGINT AUTO_INCREMENT PRIMARY KEY" },
      { name: "wamid",         definition: "VARCHAR(255) UNIQUE" },
      { name: "direction",     definition: "VARCHAR(20) NOT NULL DEFAULT 'outbound'" },
      { name: "message_type",  definition: "VARCHAR(30) NOT NULL DEFAULT 'template'" },
      { name: "phone",         definition: "VARCHAR(20) NOT NULL" },
      { name: "template_name", definition: "VARCHAR(255)" },
      { name: "content",       definition: "TEXT" },
      { name: "media_url",     definition: "TEXT" },
      { name: "status",        definition: "VARCHAR(30) DEFAULT 'queued'" },
      { name: "order_id",      definition: "INT NULL" },
      { name: "booking_id",    definition: "INT NULL" },
      { name: "error_log",     definition: "TEXT" },
      { name: "sent_at",       definition: "DATETIME" },
      { name: "delivered_at",  definition: "DATETIME" },
      { name: "read_at",       definition: "DATETIME" },
      { name: "failed_at",     definition: "DATETIME" },
      { name: "created_at",    definition: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP" },
    ],
  },

  // -----------------------------------------------------------------------------
  // WHATSAPP JOB QUEUE
  // -----------------------------------------------------------------------------
  {
    name: "whatsapp_jobs",
    query: `
      CREATE TABLE IF NOT EXISTS whatsapp_jobs (
        id           BIGINT AUTO_INCREMENT PRIMARY KEY,
        job_type     VARCHAR(50) NOT NULL,
        status       VARCHAR(20) DEFAULT 'pending',
        phone        VARCHAR(20) NOT NULL,
        payload      JSON NOT NULL,
        order_id     INT NULL,
        booking_id   INT NULL,
        campaign_id  INT NULL,
        attempts     INT DEFAULT 0,
        max_attempts INT DEFAULT 5,
        scheduled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        locked_at    DATETIME,
        last_error   TEXT,
        created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
        FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
        FOREIGN KEY (campaign_id) REFERENCES whatsapp_campaigns(id) ON DELETE SET NULL
      )
    `,
    columns: [
      { name: "id",           definition: "BIGINT AUTO_INCREMENT PRIMARY KEY" },
      { name: "job_type",     definition: "VARCHAR(50) NOT NULL" },
      { name: "status",       definition: "VARCHAR(20) DEFAULT 'pending'" },
      { name: "phone",        definition: "VARCHAR(20) NOT NULL" },
      { name: "payload",      definition: "JSON NOT NULL" },
      { name: "order_id",     definition: "INT NULL" },
      { name: "booking_id",   definition: "INT NULL" },
      { name: "campaign_id",  definition: "INT NULL", after: "booking_id" },
      { name: "attempts",     definition: "INT DEFAULT 0" },
      { name: "max_attempts", definition: "INT DEFAULT 5" },
      { name: "scheduled_at", definition: "DATETIME DEFAULT CURRENT_TIMESTAMP" },
      { name: "locked_at",    definition: "DATETIME" },
      { name: "last_error",   definition: "TEXT" },
      { name: "created_at",   definition: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP" },
      { name: "updated_at",   definition: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" },
    ],
  },

  // -----------------------------------------------------------------------------
  // WHATSAPP CAMPAIGNS
  // -----------------------------------------------------------------------------
  {
    name: "whatsapp_campaigns",
    query: `
      CREATE TABLE IF NOT EXISTS whatsapp_campaigns (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        template_id INT NULL,
        template_meta_id VARCHAR(255) NOT NULL,
        template_name VARCHAR(255) NOT NULL,
        status ENUM('draft', 'scheduled', 'processing', 'completed', 'paused', 'failed') DEFAULT 'draft',
        total_recipients INT DEFAULT 0,
        sent_count INT DEFAULT 0,
        delivered_count INT DEFAULT 0,
        read_count INT DEFAULT 0,
        failed_count INT DEFAULT 0,
        variable_mapping JSON,
        custom_media_url TEXT,
        scheduled_at DATETIME NULL,
        created_by INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB;
    `,
    columns: [
      { name: "id",                definition: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "name",              definition: "VARCHAR(255) NOT NULL" },
      { name: "template_id",       definition: "INT NULL" },
      { name: "template_meta_id",  definition: "VARCHAR(255) NOT NULL", after: "template_id" },
      { name: "template_name",     definition: "VARCHAR(255) NOT NULL" },
      { name: "status",            definition: "ENUM('draft', 'scheduled', 'processing', 'completed', 'paused', 'failed') DEFAULT 'draft'" },
      { name: "total_recipients",   definition: "INT DEFAULT 0" },
      { name: "sent_count",        definition: "INT DEFAULT 0" },
      { name: "delivered_count",   definition: "INT DEFAULT 0" },
      { name: "read_count",        definition: "INT DEFAULT 0" },
      { name: "failed_count",      definition: "INT DEFAULT 0" },
      { name: "variable_mapping",  definition: "JSON" },
      { name: "custom_media_url",  definition: "TEXT", after: "variable_mapping" },
      { name: "scheduled_at",      definition: "DATETIME NULL" },
      { name: "created_by",        definition: "INT NULL" },
      { name: "created_at",        definition: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP" },
      { name: "updated_at",        definition: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" },
    ],
  },

  // -----------------------------------------------------------------------------
  // WHATSAPP CAMPAIGN LOGS
  // -----------------------------------------------------------------------------
  {
    name: "whatsapp_campaign_logs",
    query: `
      CREATE TABLE IF NOT EXISTS whatsapp_campaign_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        campaign_id INT NOT NULL,
        phone VARCHAR(20) NOT NULL,
        wamid VARCHAR(255) NULL,
        status VARCHAR(50) DEFAULT 'queued',
        error_message TEXT NULL,
        context JSON NULL,
        sent_at DATETIME NULL,
        delivered_at DATETIME NULL,
        read_at DATETIME NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (campaign_id) REFERENCES whatsapp_campaigns(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `,
    columns: [
      { name: "id",            definition: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "campaign_id",   definition: "INT NOT NULL" },
      { name: "phone",         definition: "VARCHAR(20) NOT NULL" },
      { name: "wamid",         definition: "VARCHAR(255) NULL" },
      { name: "status",        definition: "VARCHAR(50) DEFAULT 'queued'" },
      { name: "error_message",  definition: "TEXT NULL" },
      { name: "context",       definition: "JSON NULL" },
      { name: "sent_at",       definition: "DATETIME NULL" },
      { name: "delivered_at",  definition: "DATETIME NULL" },
      { name: "read_at",       definition: "DATETIME NULL" },
      { name: "updated_at",    definition: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" },
    ],
  },
];

// =============================================================================
// AUTO-MIGRATION ENGINE
// =============================================================================
// ðŸ“š LEARNING: This function handles the "existing database" problem.
//   When the server starts, for each table it:
//     1. Runs SHOW COLUMNS to get what's currently in the database.
//     2. Compares it against the `columns` array defined above.
//     3. If a column is missing â†’ runs ALTER TABLE ADD COLUMN automatically.
//
//   This means you NEVER have to manually write ALTER TABLE in production.
//   Just add the column to the `columns` array in the table definition above
//   and it will appear automatically on the next server restart. âœ¨
// =============================================================================

const migrateTableColumns = async (table) => {
  // Step 1: Get all columns that currently exist in this table
  const [existingColumns] = await db.query(`SHOW COLUMNS FROM \`${table.name}\``);
  const existingColumnNames = existingColumns.map((c) => c.Field);
  const existingColumnMap = existingColumns.reduce((acc, c) => ({ ...acc, [c.Field]: c }), {});

  let migrationsRun = 0;

  // Step 2: Loop over all expected columns (from our schema definition)
  for (const col of table.columns) {
    if (existingColumnNames.includes(col.name)) {
      // PRO TIP: This is advanced. If column exists, we check if we should MODIFY it.
      // For now, we only handle explicit NULL/NOT NULL changes or common type fixes.
      // But avoid MODIFY for Primary Keys or Auto Incs.
      if (col.definition.toLowerCase().includes("auto_increment")) continue;

      // To keep it safe, we'll only run MODIFY if explicitly required by user logic
      // For this task, we want to fix template_id in whatsapp_campaigns specifically.
      if (table.name === "whatsapp_campaigns" && col.name === "template_id") {
        const isCurrentlyNotNull = existingColumnMap[col.name].Null === 'NO';
        if (isCurrentlyNotNull && col.definition.toLowerCase().includes("null")) {
          // Drop Foreign Key first if it exists to avoid error
          try {
            await db.query(`ALTER TABLE \`${table.name}\` DROP FOREIGN KEY \`whatsapp_campaigns_ibfk_1\``);
            console.log(`  âœ¨ [${table.name}] Dropped strict FK on 'template_id' for flexibility.`);
          } catch(e) { /* ignore if not exists */ }

          await db.query(`ALTER TABLE \`${table.name}\` MODIFY COLUMN \`${col.name}\` ${col.definition}`);
          console.log(`  âœ¨ [${table.name}] Modified column: '${col.name}' to ${col.definition}`);
          migrationsRun++;
        }
      }
      continue;
    }

    // Skip primary key â€” MySQL can't ADD COLUMN for AUTO_INCREMENT PK on existing table
    if (col.definition.includes("AUTO_INCREMENT")) continue;

    // Build the ALTER TABLE statement
    // If `after` is specified, place it after that column, otherwise append at end
    const afterClause = col.after ? ` AFTER \`${col.after}\`` : "";
    const sql = `ALTER TABLE \`${table.name}\` ADD COLUMN \`${col.name}\` ${col.definition}${afterClause}`;

    await db.query(sql);
    console.log(`  âœ¨ [${table.name}] Added missing column: '${col.name}'`);
    migrationsRun++;
  }

  return migrationsRun;
};

// =============================================================================
// MAIN EXPORT: initializeDatabase
// =============================================================================
// ðŸ“š LEARNING: This is called once at server startup (see server.js / app.js).
//   It runs CREATE TABLE IF NOT EXISTS for each table (safe to run every time),
//   then runs the auto-migration engine to patch any missing columns.
// =============================================================================

export const initializeDatabase = async () => {
  console.log("\n--- ðŸ› ï¸  Database Initialization Started ---");

  let totalMigrations = 0;

  for (const table of tables) {
    try {
      // Step 1: Create table if it doesn't exist (safe for fresh installs)
      await db.query(table.query);
      console.log(`âœ… Table '${table.name}' checked/created.`);

      // Step 2: Auto-migrate any missing columns in existing tables
      const migrations = await migrateTableColumns(table);
      totalMigrations += migrations;
    } catch (error) {
      console.error(`âŒ Error on table '${table.name}':`, error.message);
    }
  }

  if (totalMigrations === 0) {
    console.log("ðŸŽ‰ All tables are up-to-date. No migrations needed.");
  } else {
    console.log(`ðŸš€ Migration complete: ${totalMigrations} column(s) added.`);
  }

  console.log("--- âœ… Database Initialization Completed ---\n");
};




