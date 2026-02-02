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

export const updateTemple = async (id, data) => {
  const fields = [];
  const values = [];

  const { title, image, description, city, state } = data;

  if (title !== undefined) { fields.push("title = ?"); values.push(title); }
  if (image !== undefined) { fields.push("image = ?"); values.push(image); }
  if (description !== undefined) { fields.push("description = ?"); values.push(description); }
  if (city !== undefined) { fields.push("city = ?"); values.push(city); }
  if (state !== undefined) { fields.push("state = ?"); values.push(state); }

  if (fields.length === 0) return 0;

  values.push(id);

  const [result] = await db.query(
    `UPDATE temples SET ${fields.join(", ")} WHERE id = ?`,
    values
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
