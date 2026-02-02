import db from "../config/db.js";


/* POOJA */

export const createPooja = async ({ title, image, description, benefits }) => {
  const [res] = await db.query(
    `INSERT INTO poojas (title,image,description,benefits)
     VALUES (?,?,?,?)`,
    [title, image, description, benefits]
  );
  return res.insertId;
};

export const updatePooja = async (id, data) => {
  const fields = [];
  const values = [];

  if (data.title !== undefined) fields.push("title=?");
  if (data.title !== undefined) values.push(data.title);

  if (data.image !== undefined) fields.push("image=?");
  if (data.image !== undefined) values.push(data.image);

  if (data.description !== undefined) fields.push("description=?");
  if (data.description !== undefined) values.push(data.description);

  if (data.benefits !== undefined) fields.push("benefits=?");
  if (data.benefits !== undefined) values.push(data.benefits);

  if (fields.length === 0) return 0;

  values.push(id);

  const [res] = await db.query(
    `UPDATE poojas SET ${fields.join(", ")} WHERE id=?`,
    values
  );
  return res.affectedRows;
};

export const deletePooja = async (id) => {
  const [res] = await db.query(
    `DELETE FROM poojas WHERE id=?`,
    [id]
  );
  return res.affectedRows;
};

export const getPoojaById = async (id) => {
  const [[row]] = await db.query(
    `SELECT * FROM poojas WHERE id=?`,
    [id]
  );
  return row;
};

export const getAllPoojas = async () => {
  const [rows] = await db.query("SELECT * FROM poojas");
  return rows;
};

/* TEMPLE MAPPING */

export const getPoojasByTemple = async (templeId) => {
  const [rows] = await db.query(
    `
    SELECT p.id, p.title, p.image
    FROM pooja_temples pt
    JOIN poojas p ON p.id = pt.pooja_id
    WHERE pt.temple_id = ?
    `,
    [templeId]
  );
  return rows;
};

/* VARIANTS */

export const getVariantsByPooja = async (poojaId) => {
  const [rows] = await db.query(
    `SELECT id, persons, description, price
     FROM pooja_variants
     WHERE pooja_id=?
     ORDER BY persons ASC`,
    [poojaId]
  );
  return rows;
};

/* ADDONS */

export const getAddonsByPooja = async (poojaId) => {
  const [rows] = await db.query(
    `
    SELECT a.id, a.title, a.price, a.image, a.description
    FROM pooja_addons pa
    JOIN addons a ON a.id = pa.addon_id
    WHERE pa.pooja_id = ?
    `,
    [poojaId]
  );
  return rows;
};

/* REVIEWS */

export const getReviewsByPooja = async (poojaId) => {
  const [rows] = await db.query(
    `
    SELECT user_name, rating, comment, created_at
    FROM reviews
    WHERE pooja_id=?
    ORDER BY created_at DESC
    `,
    [poojaId]
  );
  return rows;
};

/* TEMPLES */

export const getTemplesByPooja = async (poojaId) => {
  const [rows] = await db.query(
    `
    SELECT t.id, t.title, t.image, t.description, t.city, t.state
    FROM pooja_temples pt
    JOIN temples t ON t.id = pt.temple_id
    WHERE pt.pooja_id = ?
    `,
    [poojaId]
  );
  return rows;
};

/* GALLERY */

export const addPoojaImage = async (poojaId, imageUrl, description = "") => {
  const [res] = await db.query(
    `INSERT INTO pooja_gallery (pooja_id, image_url, description) VALUES (?, ?, ?)`,
    [poojaId, imageUrl, description]
  );
  return res.insertId;
};

export const getPoojaImages = async (poojaId) => {
  const [rows] = await db.query(
    `SELECT id, image_url, description FROM pooja_gallery WHERE pooja_id = ?`,
    [poojaId]
  );
  return rows;
};

export const deletePoojaImage = async (id) => {
  const [res] = await db.query(`DELETE FROM pooja_gallery WHERE id = ?`, [id]);
  return res.affectedRows;
};
