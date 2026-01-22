import db from "../config/db.js";

export const linkTempleToPooja = async (poojaId, templeId) => {
    const [res] = await db.query(
        `INSERT INTO pooja_temples (pooja_id, temple_id) VALUES (?, ?)`,
        [poojaId, templeId]
    );
    return res.insertId;
};

export const unlinkTempleFromPooja = async (mapId) => {
    await db.query(
        `DELETE FROM pooja_temples WHERE id = ?`,
        [mapId]
    );
};

export const getTemplesByPooja = async (poojaId) => {
    const [rows] = await db.query(
        `
    SELECT 
      pt.id AS mapId,
      t.id AS templeId,
      t.title,
      t.image
    FROM pooja_temples pt
    JOIN temples t ON t.id = pt.temple_id
    WHERE pt.pooja_id = ?
    `,
        [poojaId]
    );
    return rows;
};
