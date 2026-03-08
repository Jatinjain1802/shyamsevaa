import db from "../config/db.js";

export const createProduct = async ({ name, description, price, stock_quantity, image_url, category }) => {
  const [res] = await db.query(
    `INSERT INTO products (name, description, price, stock_quantity, image_url, category)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, description, price, stock_quantity, image_url, category]
  );
  return res.insertId;
};

export const updateProduct = async (id, data) => {
  const fields = [];
  const values = [];

  if (data.name !== undefined) {
    fields.push("name=?");
    values.push(data.name);
  }
  if (data.description !== undefined) {
    fields.push("description=?");
    values.push(data.description);
  }
  if (data.price !== undefined) {
    fields.push("price=?");
    values.push(data.price);
  }
  if (data.stock_quantity !== undefined) {
    fields.push("stock_quantity=?");
    values.push(data.stock_quantity);
  }
  if (data.image_url !== undefined) {
    fields.push("image_url=?");
    values.push(data.image_url);
  }
  if (data.category !== undefined) {
    fields.push("category=?");
    values.push(data.category);
  }
  if (data.status !== undefined) {
    fields.push("status=?");
    values.push(data.status);
  }

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
