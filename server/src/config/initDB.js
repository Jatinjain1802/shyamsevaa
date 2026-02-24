import db from "./db.js";

const tables = [
  {
    name: "users",
    query: `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        mobile VARCHAR(20),
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        otp VARCHAR(10),
        otp_expires_at DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
  },
  {
    name: "temples",
    query: `
      CREATE TABLE IF NOT EXISTS temples (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        image VARCHAR(255),
        description TEXT,
        city VARCHAR(100),
        state VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
  },
  {
    name: "temple_gallery",
    query: `
      CREATE TABLE IF NOT EXISTS temple_gallery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        temple_id INT NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        description VARCHAR(255),
        FOREIGN KEY (temple_id) REFERENCES temples(id) ON DELETE CASCADE
      )
    `
  },
  {
    name: "poojas",
    query: `
      CREATE TABLE IF NOT EXISTS poojas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        image VARCHAR(255),
        description TEXT,
        benefits TEXT,
        pooja_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
  },
  {
    name: "pooja_faqs",
    query: `
      CREATE TABLE IF NOT EXISTS pooja_faqs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        pooja_id INT NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        status TINYINT DEFAULT 1,
        sort_order INT DEFAULT 0,
        FOREIGN KEY (pooja_id) REFERENCES poojas(id) ON DELETE CASCADE
      )
    `
  },
  {
    name: "pooja_variants",
    query: `
      CREATE TABLE IF NOT EXISTS pooja_variants (
        id INT AUTO_INCREMENT PRIMARY KEY,
        pooja_id INT NOT NULL,
        persons INT NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (pooja_id) REFERENCES poojas(id) ON DELETE CASCADE
      )
    `
  },
  {
    name: "pooja_temples",
    query: `
      CREATE TABLE IF NOT EXISTS pooja_temples (
        id INT AUTO_INCREMENT PRIMARY KEY,
        pooja_id INT NOT NULL,
        temple_id INT NOT NULL,
        FOREIGN KEY (pooja_id) REFERENCES poojas(id) ON DELETE CASCADE,
        FOREIGN KEY (temple_id) REFERENCES temples(id) ON DELETE CASCADE
      )
    `
  },
  {
    name: "pooja_gallery",
    query: `
      CREATE TABLE IF NOT EXISTS pooja_gallery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        pooja_id INT NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        description VARCHAR(255),
        FOREIGN KEY (pooja_id) REFERENCES poojas(id) ON DELETE CASCADE
      )
    `
  },
  {
    name: "addons",
    query: `
      CREATE TABLE IF NOT EXISTS addons (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        image VARCHAR(255),
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        is_common TINYINT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
  },
  {
    name: "pooja_addons",
    query: `
      CREATE TABLE IF NOT EXISTS pooja_addons (
        id INT AUTO_INCREMENT PRIMARY KEY,
        pooja_id INT NOT NULL,
        addon_id INT NOT NULL,
        FOREIGN KEY (pooja_id) REFERENCES poojas(id) ON DELETE CASCADE,
        FOREIGN KEY (addon_id) REFERENCES addons(id) ON DELETE CASCADE
      )
    `
  },
  {
    name: "chadawas",
    query: `
      CREATE TABLE IF NOT EXISTS chadawas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        image VARCHAR(255),
        description TEXT,
        benefits TEXT,
        chadawa_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
  },
  {
    name: "chadawa_items",
    query: `
      CREATE TABLE IF NOT EXISTS chadawa_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        chadawa_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (chadawa_id) REFERENCES chadawas(id) ON DELETE CASCADE
      )
    `
  },
  {
    name: "chadawa_benefits",
    query: `
      CREATE TABLE IF NOT EXISTS chadawa_benefits (
        id INT AUTO_INCREMENT PRIMARY KEY,
        chadawa_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        FOREIGN KEY (chadawa_id) REFERENCES chadawas(id) ON DELETE CASCADE
      )
    `
  },
  {
    name: "chadawa_temples",
    query: `
      CREATE TABLE IF NOT EXISTS chadawa_temples (
        id INT AUTO_INCREMENT PRIMARY KEY,
        chadawa_id INT NOT NULL,
        temple_id INT NOT NULL,
        FOREIGN KEY (chadawa_id) REFERENCES chadawas(id) ON DELETE CASCADE,
        FOREIGN KEY (temple_id) REFERENCES temples(id) ON DELETE CASCADE
      )
    `
  },
  {
    name: "chadawa_reviews",
    query: `
      CREATE TABLE IF NOT EXISTS chadawa_reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        chadawa_id INT NOT NULL,
        user_name VARCHAR(255) NOT NULL,
        rating INT NOT NULL,
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (chadawa_id) REFERENCES chadawas(id) ON DELETE CASCADE
      )
    `
  },
  {
    name: "chadawa_gallery",
    query: `
      CREATE TABLE IF NOT EXISTS chadawa_gallery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        chadawa_id INT NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        description VARCHAR(255),
        FOREIGN KEY (chadawa_id) REFERENCES chadawas(id) ON DELETE CASCADE
      )
    `
  },
  {
    name: "reviews",
    query: `
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        pooja_id INT NOT NULL,
        user_name VARCHAR(255) NOT NULL,
        rating INT NOT NULL,
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (pooja_id) REFERENCES poojas(id) ON DELETE CASCADE
      )
    `
  },
  {
    name: "carts",
    query: `
      CREATE TABLE IF NOT EXISTS carts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NULL,
        session_id VARCHAR(255) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `
  },
  {
    name: "cart_items",
    query: `
      CREATE TABLE IF NOT EXISTS cart_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        cart_id INT NOT NULL,
        product_type VARCHAR(50) NOT NULL,
        pooja_variant_id INT NULL,
        chadawa_item_id INT NULL,
        temple_id INT NOT NULL,
        quantity INT DEFAULT 1,
        base_price DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
        FOREIGN KEY (pooja_variant_id) REFERENCES pooja_variants(id) ON DELETE SET NULL,
        FOREIGN KEY (chadawa_item_id) REFERENCES chadawa_items(id) ON DELETE SET NULL,
        FOREIGN KEY (temple_id) REFERENCES temples(id) ON DELETE CASCADE
      )
    `
  },
  {
    name: "cart_item_addons",
    query: `
      CREATE TABLE IF NOT EXISTS cart_item_addons (
        id INT AUTO_INCREMENT PRIMARY KEY,
        cart_item_id INT NOT NULL,
        addon_id INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        quantity INT DEFAULT 1,
        FOREIGN KEY (cart_item_id) REFERENCES cart_items(id) ON DELETE CASCADE,
        FOREIGN KEY (addon_id) REFERENCES addons(id) ON DELETE CASCADE
      )
    `
  },
  {
    name: "orders",
    query: `
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        order_number VARCHAR(50) NOT NULL UNIQUE,
        total_amount DECIMAL(10, 2) NOT NULL,
        payment_status VARCHAR(50) DEFAULT 'pending',
        payment_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `
  },
  {
    name: "order_items",
    query: `
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_type VARCHAR(50) NOT NULL,
        pooja_variant_id INT NULL,
        chadawa_item_id INT NULL,
        temple_id INT NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (pooja_variant_id) REFERENCES pooja_variants(id) ON DELETE SET NULL,
        FOREIGN KEY (chadawa_item_id) REFERENCES chadawa_items(id) ON DELETE SET NULL,
        FOREIGN KEY (temple_id) REFERENCES temples(id) ON DELETE CASCADE
      )
    `
  },
  {
    name: "order_item_addons",
    query: `
      CREATE TABLE IF NOT EXISTS order_item_addons (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_item_id INT NOT NULL,
        addon_id INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        quantity INT NOT NULL,
        FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE,
        FOREIGN KEY (addon_id) REFERENCES addons(id) ON DELETE CASCADE
      )
    `
  },
  {
    name: "bookings",
    query: `
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_item_id INT NOT NULL,
        pooja_date DATE NOT NULL,
        devotee_name VARCHAR(255) NOT NULL,
        gotra VARCHAR(255),
        mobile VARCHAR(20),
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE
      )
    `
  }
];

export const initializeDatabase = async () => {
  console.log("\n--- 🛠️  Database Initialization Started ---");
  
  for (const table of tables) {
    try {
      await db.query(table.query);
      console.log(`✅ Table '${table.name}' checked/created successfully.`);
    } catch (error) {
      console.error(`❌ Error creating table '${table.name}':`, error.message);
    }
  }
  
  console.log("--- ✅ Database Initialization Completed ---\n");
};
