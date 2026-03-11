import db from "../config/db.js";

export const createProduct = async (data) => {
  const { name, name_hi, description, description_hi, price, stock_quantity, image_url, category, category_hi } = data;
  const [res] = await db.query(
    `INSERT INTO products (name, name_hi, description, description_hi, price, stock_quantity, image_url, category, category_hi)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, name_hi || null, description || null, description_hi || null, price, stock_quantity || 0, image_url || null, category || null, category_hi || null]
  );
  return res.insertId;
};

export const updateProduct = async (id, data) => {
  const fields = [];
  const values = [];

  const updateableFields = [
    "name",
    "name_hi",
    "description",
    "description_hi",
    "price",
    "stock_quantity",
    "image_url",
    "category",
    "category_hi",
    "status",
  ];

  updateableFields.forEach((field) => {
    if (data[field] !== undefined) {
      fields.push(`${field}=?`);
      values.push(data[field]);
    }
  });

  if (fields.length === 0) return 0;

  values.push(id);

  const [res] = await db.query(
    `UPDATE products SET ${fields.join(", ")} WHERE id=?`,
    values
  );
  return res.affectedRows;
};

export const deleteProduct = async (id) => {
  const [res] = await db.query(`DELETE FROM products WHERE id=?`, [id]);
  return res.affectedRows;
};

export const getProductById = async (id) => {
  const [[row]] = await db.query(`SELECT * FROM products WHERE id=?`, [id]);
  return row;
};

export const getAllProducts = async (filters = {}) => {
  let query = `SELECT * FROM products WHERE 1=1`;
  const values = [];

  if (filters.category) {
    query += ` AND category = ?`;
    values.push(filters.category);
  }
  if (filters.status !== undefined) {
    query += ` AND status = ?`;
    values.push(filters.status);
  }

  query += ` ORDER BY created_at DESC`;

  const [rows] = await db.query(query, values);
  return rows;
};
