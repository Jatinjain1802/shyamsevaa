import db from "../config/db.js";

export const createTemple = async ({ title, image, description }) => {
  const [result] = await db.query(
    `
    INSERT INTO temples (title, image, description)
    VALUES (?, ?, ?)
    `,
    [title, image, description]
  );
  return result.insertId;
};

export const getAllTemples = async () => {
  const [rows] = await db.query(
    `
    SELECT id, title, image, description, created_at
    FROM temples
    ORDER BY created_at DESC
    `
  );
  return rows;
};

export const getTempleById = async (id) => {
  const [rows] = await db.query(
    `
    SELECT id, title, image, description
    FROM temples
    WHERE id = ?
    `,
    [id]
  );
  return rows[0];
};

export const updateTemple = async (id, { title, image, description }) => {
  const [result] = await db.query(
    `
    UPDATE temples
    SET title = ?, image = ?, description = ?
    WHERE id = ?
    `,
    [title, image, description, id]
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
