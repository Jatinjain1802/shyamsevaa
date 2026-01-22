import db from "../config/db.js";

/* =======================
   ADDONS MASTER
======================= */

export const createAddon = async ({
    title,
    image,
    description,
    price,
    is_common,
}) => {
    const [res] = await db.query(
        `
    INSERT INTO addons (title, image, description, price, is_common)
    VALUES (?, ?, ?, ?, ?)
    `,
        [title, image, description, price, is_common ? 1 : 0]
    );
    return res.insertId;
};

export const updateAddon = async (id, data) => {
    const [res] = await db.query(
        `
    UPDATE addons
    SET title=?, image=?, description=?, price=?, is_common=?
    WHERE id=?
    `,
        [
            data.title,
            data.image,
            data.description,
            data.price,
            data.is_common ? 1 : 0,
            id,
        ]
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
