import db from "./db.js";

// =============================================================================
// DATABASE SCHEMA DEFINITION
// =============================================================================
// 📚 LEARNING: This is a "single source of truth" pattern.
//   - All table structures are defined here in ONE place.
//   - The `columns` array in each table is used for AUTO-MIGRATION.
//   - When you add a new column to `columns`, the system automatically
//     runs ALTER TABLE to add it in production without manual intervention.
//   - The `query` is used for the initial CREATE TABLE (fresh install).
// =============================================================================

const tables = [
  // ─────────────────────────────────────────────────────────────────────────
  // USERS
  // ─────────────────────────────────────────────────────────────────────────
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
    // 📚 LEARNING: `columns` mirrors the CREATE TABLE above.
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

  // ─────────────────────────────────────────────────────────────────────────
  // TEMPLES
  // ─────────────────────────────────────────────────────────────────────────
  {
    name: "temples",
    query: `
      CREATE TABLE IF NOT EXISTS temples (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        title       VARCHAR(255) NOT NULL,
        title_hi    VARCHAR(255),
        image       VARCHAR(255),
        description TEXT,
        description_hi TEXT,
        city        VARCHAR(100),
        city_hi     VARCHAR(100),
        state       VARCHAR(100),
        state_hi    VARCHAR(100),
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `,
    columns: [
      { name: "id",          definition: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "title",       definition: "VARCHAR(255) NOT NULL" },
      { name: "title_hi",    definition: "VARCHAR(255)", after: "title" },
      { name: "image",       definition: "VARCHAR(255)" },
      { name: "description", definition: "TEXT" },
      { name: "description_hi", definition: "TEXT", after: "description" },
      { name: "city",        definition: "VARCHAR(100)" },
      { name: "city_hi",     definition: "VARCHAR(100)", after: "city" },
      { name: "state",       definition: "VARCHAR(100)" },
      { name: "state_hi",    definition: "VARCHAR(100)", after: "state" },
      { name: "created_at",  definition: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // TEMPLE GALLERY
  // ─────────────────────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────────────────
  // POOJAS
  // ─────────────────────────────────────────────────────────────────────────
  {
    name: "poojas",
    query: `
      CREATE TABLE IF NOT EXISTS poojas (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        title       VARCHAR(255) NOT NULL,
        title_hi    VARCHAR(255),
        image       VARCHAR(255),
        description TEXT,
        description_hi TEXT,
        benefits    TEXT,
        benefits_hi TEXT,
        pooja_date  DATE,
        status      TINYINT DEFAULT 1,
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `,
    columns: [
      { name: "id",          definition: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "title",       definition: "VARCHAR(255) NOT NULL" },
      { name: "title_hi",    definition: "VARCHAR(255)", after: "title" },
      { name: "image",       definition: "VARCHAR(255)" },
      { name: "description", definition: "TEXT" },
      { name: "description_hi", definition: "TEXT", after: "description" },
      { name: "benefits",    definition: "TEXT" },
      { name: "benefits_hi",    definition: "TEXT", after: "benefits" },
      { name: "pooja_date",  definition: "DATE" },
      { name: "status",      definition: "TINYINT DEFAULT 1", after: "pooja_date" },
      { name: "created_at",  definition: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // POOJA FAQs
  // ─────────────────────────────────────────────────────────────────────────
  {
    name: "pooja_faqs",
    query: `
      CREATE TABLE IF NOT EXISTS pooja_faqs (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        pooja_id   INT NOT NULL,
        question   TEXT NOT NULL,
        question_hi TEXT,
        answer     TEXT NOT NULL,
        answer_hi  TEXT,
        status     TINYINT DEFAULT 1,
        sort_order INT DEFAULT 0,
        FOREIGN KEY (pooja_id) REFERENCES poojas(id) ON DELETE CASCADE
      )
    `,
    columns: [
      { name: "id",          definition: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "pooja_id",    definition: "INT NOT NULL" },
      { name: "question",    definition: "TEXT NOT NULL" },
      { name: "question_hi", definition: "TEXT", after: "question" },
      { name: "answer",      definition: "TEXT NOT NULL" },
      { name: "answer_hi",   definition: "TEXT", after: "answer" },
      { name: "status",      definition: "TINYINT DEFAULT 1" },
      { name: "sort_order",  definition: "INT DEFAULT 0" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // POOJA VARIANTS
  // ─────────────────────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────────────────
  // POOJA TEMPLES (pivot / junction table)
  // ─────────────────────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────────────────
  // POOJA GALLERY
  // ─────────────────────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────────────────
  // ADDONS
  // ─────────────────────────────────────────────────────────────────────────
  {
    name: "addons",
    query: `
      CREATE TABLE IF NOT EXISTS addons (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        title       VARCHAR(255) NOT NULL,
        title_hi    VARCHAR(255),
        image       VARCHAR(255),
        description TEXT,
        description_hi TEXT,
        price       DECIMAL(10, 2) NOT NULL,
        is_common   TINYINT DEFAULT 0,
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `,
    columns: [
      { name: "id",          definition: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "title",       definition: "VARCHAR(255) NOT NULL" },
      { name: "title_hi",    definition: "VARCHAR(255)", after: "title" },
      { name: "image",       definition: "VARCHAR(255)" },
      { name: "description", definition: "TEXT" },
      { name: "description_hi", definition: "TEXT", after: "description" },
      { name: "price",       definition: "DECIMAL(10, 2) NOT NULL" },
      { name: "is_common",   definition: "TINYINT DEFAULT 0" },
      { name: "created_at",  definition: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // POOJA ADDONS (pivot)
  // ─────────────────────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────────────────
  // CHADAWAS
  // ─────────────────────────────────────────────────────────────────────────
  {
    name: "chadawas",
    query: `
      CREATE TABLE IF NOT EXISTS chadawas (
        id           INT AUTO_INCREMENT PRIMARY KEY,
        title        VARCHAR(255) NOT NULL,
        title_hi     VARCHAR(255),
        image        VARCHAR(255),
        description  TEXT,
        description_hi TEXT,
        benefits     TEXT,
        benefits_hi  TEXT,
        chadawa_date DATE,
        status       TINYINT DEFAULT 1,
        created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `,
    columns: [
      { name: "id",           definition: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "title",        definition: "VARCHAR(255) NOT NULL" },
      { name: "title_hi",     definition: "VARCHAR(255)", after: "title" },
      { name: "image",        definition: "VARCHAR(255)" },
      { name: "description",  definition: "TEXT" },
      { name: "description_hi", definition: "TEXT", after: "description" },
      { name: "benefits",     definition: "TEXT" },
      { name: "benefits_hi",  definition: "TEXT", after: "benefits" },
      { name: "chadawa_date", definition: "DATE" },
      { name: "status",       definition: "TINYINT DEFAULT 1", after: "chadawa_date" },
      { name: "created_at",   definition: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CHADAWA ITEMS
  // ─────────────────────────────────────────────────────────────────────────
  {
    name: "chadawa_items",
    query: `
      CREATE TABLE IF NOT EXISTS chadawa_items (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        chadawa_id  INT NOT NULL,
        title       VARCHAR(255) NOT NULL,
        title_hi    VARCHAR(255),
        description TEXT,
        description_hi TEXT,
        price       DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (chadawa_id) REFERENCES chadawas(id) ON DELETE CASCADE
      )
    `,
    columns: [
      { name: "id",          definition: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "chadawa_id",  definition: "INT NOT NULL" },
      { name: "title",       definition: "VARCHAR(255) NOT NULL" },
      { name: "title_hi",    definition: "VARCHAR(255)", after: "title" },
      { name: "description", definition: "TEXT" },
      { name: "description_hi", definition: "TEXT", after: "description" },
      { name: "price",       definition: "DECIMAL(10, 2) NOT NULL" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CHADAWA BENEFITS
  // ─────────────────────────────────────────────────────────────────────────
  {
    name: "chadawa_benefits",
    query: `
      CREATE TABLE IF NOT EXISTS chadawa_benefits (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        chadawa_id  INT NOT NULL,
        title       VARCHAR(255) NOT NULL,
        title_hi    VARCHAR(255),
        description TEXT,
        description_hi TEXT,
        FOREIGN KEY (chadawa_id) REFERENCES chadawas(id) ON DELETE CASCADE
      )
    `,
    columns: [
      { name: "id",          definition: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "chadawa_id",  definition: "INT NOT NULL" },
      { name: "title",       definition: "VARCHAR(255) NOT NULL" },
      { name: "title_hi",    definition: "VARCHAR(255)", after: "title" },
      { name: "description", definition: "TEXT" },
      { name: "description_hi", definition: "TEXT", after: "description" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CHADAWA TEMPLES (pivot)
  // ─────────────────────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────────────────
  // CHADAWA REVIEWS
  // ─────────────────────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────────────────
  // CHADAWA GALLERY
  // ─────────────────────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────────────────
  // REVIEWS (Pooja reviews)
  // ─────────────────────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────────────────
  // PRODUCTS
  // ─────────────────────────────────────────────────────────────────────────
  {
    name: "products",
    query: `
      CREATE TABLE IF NOT EXISTS products (
        id             INT AUTO_INCREMENT PRIMARY KEY,
        name           VARCHAR(255) NOT NULL,
        name_hi        VARCHAR(255),
        description    TEXT,
        description_hi TEXT,
        price          DECIMAL(10, 2) NOT NULL,
        stock_quantity INT DEFAULT 0,
        image_url      VARCHAR(255),
        category       VARCHAR(100),
        category_hi    VARCHAR(100),
        status         TINYINT DEFAULT 1,
        created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `,
    columns: [
      { name: "id",             definition: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "name",           definition: "VARCHAR(255) NOT NULL" },
      { name: "name_hi",        definition: "VARCHAR(255)",                 after: "name" },
      { name: "description",    definition: "TEXT" },
      { name: "description_hi", definition: "TEXT",                         after: "description" },
      { name: "price",          definition: "DECIMAL(10, 2) NOT NULL" },
      { name: "stock_quantity", definition: "INT DEFAULT 0" },
      { name: "image_url",      definition: "VARCHAR(255)" },
      { name: "category",       definition: "VARCHAR(100)" },
      { name: "category_hi",    definition: "VARCHAR(100)",                after: "category" },
      { name: "status",         definition: "TINYINT DEFAULT 1",           after: "category_hi" },
      { name: "created_at",     definition: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CARTS
  // ─────────────────────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────────────────
  // CART ITEMS
  // ─────────────────────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────────────────
  // CART ITEM ADDONS
  // ─────────────────────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────────────────
  // ORDERS
  // ─────────────────────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────────────────
  // ORDER ITEMS
  // ─────────────────────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────────────────
  // ORDER ITEM ADDONS
  // ─────────────────────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────────────────
  // BOOKINGS
  // ─────────────────────────────────────────────────────────────────────────
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
];

// =============================================================================
// AUTO-MIGRATION ENGINE
// =============================================================================
// 📚 LEARNING: This function handles the "existing database" problem.
//   When the server starts, for each table it:
//     1. Runs SHOW COLUMNS to get what's currently in the database.
//     2. Compares it against the `columns` array defined above.
//     3. If a column is missing → runs ALTER TABLE ADD COLUMN automatically.
//
//   This means you NEVER have to manually write ALTER TABLE in production.
//   Just add the column to the `columns` array in the table definition above
//   and it will appear automatically on the next server restart. ✨
// =============================================================================

const migrateTableColumns = async (table) => {
  // Step 1: Get all columns that currently exist in this table
  const [existingColumns] = await db.query(`SHOW COLUMNS FROM \`${table.name}\``);
  const existingColumnNames = existingColumns.map((c) => c.Field);

  let migrationsRun = 0;

  // Step 2: Loop over all expected columns (from our schema definition)
  for (const col of table.columns) {
    // Skip columns that already exist
    if (existingColumnNames.includes(col.name)) continue;

    // Skip primary key — MySQL can't ADD COLUMN for AUTO_INCREMENT PK on existing table
    if (col.definition.includes("AUTO_INCREMENT")) continue;

    // Build the ALTER TABLE statement
    // If `after` is specified, place it after that column, otherwise append at end
    const afterClause = col.after ? ` AFTER \`${col.after}\`` : "";
    const sql = `ALTER TABLE \`${table.name}\` ADD COLUMN \`${col.name}\` ${col.definition}${afterClause}`;

    await db.query(sql);
    console.log(`  ✨ [${table.name}] Added missing column: '${col.name}'`);
    migrationsRun++;
  }

  return migrationsRun;
};

// =============================================================================
// MAIN EXPORT: initializeDatabase
// =============================================================================
// 📚 LEARNING: This is called once at server startup (see server.js / app.js).
//   It runs CREATE TABLE IF NOT EXISTS for each table (safe to run every time),
//   then runs the auto-migration engine to patch any missing columns.
// =============================================================================

export const initializeDatabase = async () => {
  console.log("\n--- 🛠️  Database Initialization Started ---");

  let totalMigrations = 0;

  for (const table of tables) {
    try {
      // Step 1: Create table if it doesn't exist (safe for fresh installs)
      await db.query(table.query);
      console.log(`✅ Table '${table.name}' checked/created.`);

      // Step 2: Auto-migrate any missing columns in existing tables
      const migrations = await migrateTableColumns(table);
      totalMigrations += migrations;
    } catch (error) {
      console.error(`❌ Error on table '${table.name}':`, error.message);
    }
  }

  if (totalMigrations === 0) {
    console.log("🎉 All tables are up-to-date. No migrations needed.");
  } else {
    console.log(`🚀 Migration complete: ${totalMigrations} column(s) added.`);
  }

  console.log("--- ✅ Database Initialization Completed ---\n");
};
