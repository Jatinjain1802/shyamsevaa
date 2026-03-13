import db from "../config/db.js";

export const getAll = async () => {
  const [rows] = await db.query(
    "SELECT * FROM youtube_links ORDER BY sort_order ASC, created_at DESC"
  );
  return rows;
};

export const getActive = async () => {
  const [rows] = await db.query(
    "SELECT * FROM youtube_links WHERE status = 1 ORDER BY sort_order ASC, created_at DESC"
  );
  return rows;
};

export const create = async (data) => {
  const { title, video_url, status, sort_order } = data;
  const [res] = await db.query(
    "INSERT INTO youtube_links (title, video_url, status, sort_order) VALUES (?, ?, ?, ?)",
    [title, video_url, status || 1, sort_order || 0]
  );
  return res.insertId;
};

export const update = async (id, data) => {
  const { title, video_url, status, sort_order } = data;
  await db.query(
    "UPDATE youtube_links SET title=?, video_url=?, status=?, sort_order=? WHERE id=?",
    [title, video_url, status, sort_order, id]
  );
};

export const remove = async (id) => {
  await db.query("DELETE FROM youtube_links WHERE id=?", [id]);
};
