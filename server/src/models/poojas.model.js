import db from "../config/db.js";


/* POOJA */

export const createPooja = async ({ title, title_hi, image, description, description_hi, benefits, benefits_hi, pooja_date, status }) => {
  const [res] = await db.query(
    `INSERT INTO poojas (title, title_hi, image, description, description_hi, benefits, benefits_hi, pooja_date, status)
     VALUES (?,?,?,?,?,?,?,?,?)`,
    [title, title_hi, image, description, description_hi, benefits, benefits_hi, pooja_date, status !== undefined ? status : 1]
  );
  return res.insertId;
};

export const updatePooja = async (id, data) => {
  const fields = [];
  const values = [];

  if (data.title !== undefined) { fields.push("title=?"); values.push(data.title); }
  if (data.title_hi !== undefined) { fields.push("title_hi=?"); values.push(data.title_hi); }
  if (data.image !== undefined) { fields.push("image=?"); values.push(data.image); }
  if (data.description !== undefined) { fields.push("description=?"); values.push(data.description); }
  if (data.description_hi !== undefined) { fields.push("description_hi=?"); values.push(data.description_hi); }
  if (data.benefits !== undefined) { fields.push("benefits=?"); values.push(data.benefits); }
  if (data.benefits_hi !== undefined) { fields.push("benefits_hi=?"); values.push(data.benefits_hi); }
  if (data.pooja_date !== undefined) { fields.push("pooja_date=?"); values.push(data.pooja_date); }
  if (data.status !== undefined) { fields.push("status=?"); values.push(data.status); }

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
  const [rows] = await db.query(`
    SELECT p.*, 
           t.title AS temple_name, 
           t.city AS temple_city, 
           t.state AS temple_state
    FROM poojas p
    LEFT JOIN (
        SELECT pooja_id, MIN(temple_id) as tid
        FROM pooja_temples
        GROUP BY pooja_id
    ) first_pt ON p.id = first_pt.pooja_id
    LEFT JOIN temples t ON first_pt.tid = t.id
  `);
  return rows;
};

/* TEMPLE MAPPING */

export const getPoojasByTemple = async (templeId) => {
  const [rows] = await db.query(
    `
    SELECT p.id, p.title, p.title_hi, p.image, p.description, p.description_hi
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
    SELECT DISTINCT a.id, a.title, a.title_hi, a.price, a.image, a.description, a.description_hi
    FROM addons a
    LEFT JOIN pooja_addons pa ON a.id = pa.addon_id AND pa.pooja_id = ?
    WHERE a.is_common = 1 OR pa.pooja_id IS NOT NULL
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
    SELECT t.id, t.title, t.title_hi, t.image, t.description, t.description_hi, t.city, t.city_hi, t.state, t.state_hi
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
