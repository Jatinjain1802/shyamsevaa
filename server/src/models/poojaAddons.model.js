import db from "../config/db.js";

/* =======================
   ADDONS MASTER
======================= */

export const createAddon = async ({
    title,
    title_hi,
    image,
    description,
    description_hi,
    price,
    is_common,
}) => {
    const [res] = await db.query(
        `
    INSERT INTO addons (title, title_hi, image, description, description_hi, price, is_common)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
        [title, title_hi, image, description, description_hi, price, is_common ? 1 : 0]
    );
    return res.insertId;
};

export const updateAddon = async (id, data) => {
    const fields = [];
    const values = [];

    if (data.title !== undefined) { fields.push("title=?"); values.push(data.title); }
    if (data.title_hi !== undefined) { fields.push("title_hi=?"); values.push(data.title_hi); }
    if (data.image !== undefined) { fields.push("image=?"); values.push(data.image); }
    if (data.description !== undefined) { fields.push("description=?"); values.push(data.description); }
    if (data.description_hi !== undefined) { fields.push("description_hi=?"); values.push(data.description_hi); }
    if (data.price !== undefined) { fields.push("price=?"); values.push(data.price); }
    if (data.is_common !== undefined) { fields.push("is_common=?"); values.push(data.is_common ? 1 : 0); }

    if (fields.length === 0) return 0;

    values.push(id);

    const [res] = await db.query(
        `UPDATE addons SET ${fields.join(", ")} WHERE id=?`,
        values
    );
    return res.affectedRows;
};

export const deleteAddon = async (id) => {
    const [res] = await db.query(
        `DELETE FROM addons WHERE id=?`,
        [id]
    );
    return res.affectedRows;
};

/* =======================
   POOJA ↔ ADDON MAPPING
======================= */

export const mapAddonToPooja = async (poojaId, addonId) => {
    const [res] = await db.query(
        `
    INSERT INTO pooja_addons (pooja_id, addon_id)
    VALUES (?, ?)
    `,
        [poojaId, addonId]
    );
    return res.insertId;
};

export const removeAddonFromPooja = async (mapId) => {
    await db.query(
        `DELETE FROM pooja_addons WHERE id=?`,
        [mapId]
    );
};
/* =======================
   GET ADDONS (READ)
======================= */

// all addons (admin)
export const getAllAddons = async () => {
    const [rows] = await db.query(
        `SELECT id, title, title_hi, price, image, is_common FROM addons ORDER BY created_at DESC`
    );
    return rows;
};

// addons linked to pooja (with mapId)
export const getAddonsByPooja = async (poojaId) => {
    const [rows] = await db.query(
        `
    SELECT DISTINCT
      a.id AS id,
      a.title,
      a.title_hi,
      a.price,
      a.image,
      a.description,
      a.description_hi,
      pa.id AS mapId
    FROM addons a
    LEFT JOIN pooja_addons pa ON a.id = pa.addon_id AND pa.pooja_id = ?
    WHERE a.is_common = 1 OR pa.pooja_id IS NOT NULL
    `,
        [poojaId]
    );
    return rows;
};

