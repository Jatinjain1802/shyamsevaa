import db from "../config/db.js";

export const createPooja = async (data) => {
  const [res] = await db.query(
    `
    INSERT INTO poojas (temple_id, title, image, description, benefits)
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      data.temple_id,
      data.title,
      data.image,
      data.description,
      data.benefits,
    ]
  );
  return res.insertId;
};

export const getPoojasByTemple = async (templeId) => {
  const [rows] = await db.query(
    `
    SELECT id, title, image
    FROM poojas
    WHERE temple_id = ?
    `,
    [templeId]
  );
  return rows;
};

export const getPoojaDetail = async (poojaId) => {
  const [[pooja]] = await db.query(
    `SELECT * FROM poojas WHERE id = ?`,
    [poojaId]
  );

  if (!pooja) return null;

  const [variants] = await db.query(
    `SELECT * FROM pooja_variants WHERE pooja_id = ?`,
    [poojaId]
  );

  const [addons] = await db.query(
    `
    SELECT a.id, a.title, a.price
    FROM addons a
    JOIN pooja_addons pa ON pa.addon_id = a.id
    WHERE pa.pooja_id = ?
    `,
    [poojaId]
  );

  return { ...pooja, variants, addons };
};

export const deletePooja = async (id) => {
  const [res] = await db.query(
    `DELETE FROM poojas WHERE id = ?`,
    [id]
  );
  return res.affectedRows;
};
