import db from "../config/db.js";

export const createTemple = async ({ title, title_hi, image, description, description_hi, city, city_hi, state, state_hi }) => {
  const [result] = await db.query(
    `
    INSERT INTO temples (title, title_hi, image, description, description_hi, city, city_hi, state, state_hi)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [title, title_hi, image, description, description_hi, city, city_hi, state, state_hi]
  );
  return result.insertId;
};

export const getAllTemples = async () => {
  const [rows] = await db.query(
    `
    SELECT id, title, title_hi, image, description, description_hi, city, city_hi, state, state_hi, created_at
    FROM temples
    ORDER BY created_at DESC
    `
  );
  return rows;
};

export const getTempleById = async (id) => {
  const [rows] = await db.query(
    `
    SELECT id, title, title_hi, image, description, description_hi, city, city_hi, state, state_hi
    FROM temples
    WHERE id = ?
    `,
    [id]
  );
  return rows[0];
};

export const updateTemple = async (id, data) => {
  const fields = [];
  const values = [];

  const { title, title_hi, image, description, description_hi, city, city_hi, state, state_hi } = data;

  if (title !== undefined) { fields.push("title = ?"); values.push(title); }
  if (title_hi !== undefined) { fields.push("title_hi = ?"); values.push(title_hi); }
  if (image !== undefined) { fields.push("image = ?"); values.push(image); }
  if (description !== undefined) { fields.push("description = ?"); values.push(description); }
  if (description_hi !== undefined) { fields.push("description_hi = ?"); values.push(description_hi); }
  if (city !== undefined) { fields.push("city = ?"); values.push(city); }
  if (city_hi !== undefined) { fields.push("city_hi = ?"); values.push(city_hi); }
  if (state !== undefined) { fields.push("state = ?"); values.push(state); }
  if (state_hi !== undefined) { fields.push("state_hi = ?"); values.push(state_hi); }

  if (fields.length === 0) return 0;

  values.push(id);

  const [result] = await db.query(
    `UPDATE temples SET ${fields.join(", ")} WHERE id = ?`,
    values
  );
  return result.affectedRows;
};

export const deleteTemple = async (id) => {
  const [result] = await db.query(
    `
    DELETE FROM temples WHERE id = ?
    `,
    [id]
  );
  return result.affectedRows;
};

/* GALLERY */

export const addTempleImage = async (templeId, imageUrl, description = "") => {
  const [res] = await db.query(
    `INSERT INTO temple_gallery(temple_id, image_url, description) VALUES(?, ?, ?)`,
    [templeId, imageUrl, description]
  );
  return res.insertId;
};

export const getTempleImages = async (templeId) => {
  const [rows] = await db.query(
    `SELECT id, image_url, description FROM temple_gallery WHERE temple_id = ? `,
    [templeId]
  );
  return rows;
};

export const deleteTempleImage = async (id) => {
  const [res] = await db.query(`DELETE FROM temple_gallery WHERE id = ? `, [id]);
  return res.affectedRows;
};
