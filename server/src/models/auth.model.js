import db from "../config/db.js";

export const findByEmail = async (email) => {
  const [rows] = await db.query(
    "SELECT id, name, email, password, role, otp, otp_expires_at FROM users WHERE email = ? LIMIT 1",
    [email]
  );
  return rows[0];
};

export const createUser = async ({ name, email, mobile, password, role }) => {
  const [result] = await db.query(
    `INSERT INTO users (name, email, mobile, password, role)
     VALUES (?, ?, ?, ?, ?)`,
    [name, email, mobile, password, role]
  );
  return result.insertId;
};

export const saveOtp = async (email, otp, expiresAt) => {
  const [result] = await db.query(
    `
    UPDATE users 
    SET otp = ?, otp_expires_at = ?
    WHERE LOWER(email) = LOWER(?)
    `,
    [otp, expiresAt, email]
  );

  return result.affectedRows; // debugging ke liye
};

export const updatePasswordAndClearOtp = async (email, hashedPassword) => {
  const [result] = await db.query(
    `
    UPDATE users
    SET 
      password = ?,
      otp = NULL,
      otp_expires_at = NULL
    WHERE LOWER(email) = LOWER(?)
    `,
    [hashedPassword, email]
  );

  return result.affectedRows;
};
