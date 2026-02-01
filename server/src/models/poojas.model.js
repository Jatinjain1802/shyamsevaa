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
  const [res] = await db.query(
    `UPDATE poojas
     SET title=?, image=?, description=?, benefits=?
     WHERE id=?`,
    [data.title, data.image, data.description, data.benefits, id]
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
    SELECT t.id, t.title, t.image
    FROM pooja_temples pt
    JOIN temples t ON t.id = pt.temple_id
    WHERE pt.pooja_id = ?
    `,
    [poojaId]
  );
  return rows;
};
