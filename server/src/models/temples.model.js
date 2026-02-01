import db from "../config/db.js";

export const createTemple = async ({ title, image, description, city, state }) => {
  const [result] = await db.query(
    `
    INSERT INTO temples (title, image, description, city, state)
    VALUES (?, ?, ?, ?, ?)
    `,
    [title, image, description, city, state]
  );
  return result.insertId;
};

export const getAllTemples = async () => {
  const [rows] = await db.query(
    `
    SELECT id, title, image, description, city, state, created_at
    FROM temples
    ORDER BY created_at DESC
    `
  );
  return rows;
};

export const getTempleById = async (id) => {
  const [rows] = await db.query(
    `
    SELECT id, title, image, description, city, state
    FROM temples
    WHERE id = ?
    `,
    [id]
  );
  return rows[0];
};

export const updateTemple = async (id, { title, image, description, city, state }) => {
  const [result] = await db.query(
    `
    UPDATE temples
    SET title = ?, image = ?, description = ?, city = ?, state = ?
    WHERE id = ?
    `,
    [title, image, description, city, state, id]
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
