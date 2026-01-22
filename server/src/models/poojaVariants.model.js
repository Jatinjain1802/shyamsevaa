import db from "../config/db.js";
/* =======================
   POOJA VARIANTS
======================= */

export const addPoojaVariant = async ({
  poojaId,
  persons,
  description,
  price,
}) => {
  const [res] = await db.query(
    `
    INSERT INTO pooja_variants
    (pooja_id, persons, description, price)
    VALUES (?, ?, ?, ?)
    `,
    [poojaId, persons, description, price]
  );

  return res.insertId;
};

export const updatePoojaVariant = async (variantId, data) => {
  const [res] = await db.query(
    `
    UPDATE pooja_variants
    SET persons = ?, description = ?, price = ?
    WHERE id = ?
    `,
    [data.persons, data.description, data.price, variantId]
  );

  return res.affectedRows;
};

export const deletePoojaVariant = async (variantId) => {
  const [res] = await db.query(
    `DELETE FROM pooja_variants WHERE id = ?`,
    [variantId]
  );
  return res.affectedRows;
};
export const getVariantsByPoojaId = async (poojaId) => {
  const [rows] = await db.query(
    `
    SELECT id, persons, description, price
    FROM pooja_variants
    WHERE pooja_id = ?
    ORDER BY persons ASC
    `,
    [poojaId]
  );
  return rows;
};
