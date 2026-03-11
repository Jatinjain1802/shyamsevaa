import db from "../config/db.js";

/* CHADAWA */

export const createChadawa = async (d) => {
    const [r] = await db.query(
        `INSERT INTO chadawas (title, title_hi, image, description, description_hi, benefits, benefits_hi, chadawa_date, status)
     VALUES (?,?,?,?,?,?,?,?,?)`,
        [d.title, d.title_hi, d.image, d.description, d.description_hi, d.benefits, d.benefits_hi, d.chadawa_date, d.status !== undefined ? d.status : 1]
    );
    return r.insertId;
};

export const updateChadawa = async (id, d) => {
    const fields = [];
    const values = [];

    if (d.title !== undefined) { fields.push("title=?"); values.push(d.title); }
    if (d.title_hi !== undefined) { fields.push("title_hi=?"); values.push(d.title_hi); }
    if (d.image !== undefined) { fields.push("image=?"); values.push(d.image); }
    if (d.description !== undefined) { fields.push("description=?"); values.push(d.description); }
    if (d.description_hi !== undefined) { fields.push("description_hi=?"); values.push(d.description_hi); }
    if (d.benefits !== undefined) { fields.push("benefits=?"); values.push(d.benefits); }
    if (d.benefits_hi !== undefined) { fields.push("benefits_hi=?"); values.push(d.benefits_hi); }
    if (d.chadawa_date !== undefined) { fields.push("chadawa_date=?"); values.push(d.chadawa_date); }
    if (d.status !== undefined) { fields.push("status=?"); values.push(d.status); }

    if (fields.length === 0) return 0;

    values.push(id);

    const [r] = await db.query(
        `UPDATE chadawas SET ${fields.join(", ")} WHERE id=?`,
        values
    );
    return r.affectedRows;
};

export const deleteChadawa = async (id) => {
    const [r] = await db.query(`DELETE FROM chadawas WHERE id=?`, [id]);
    return r.affectedRows;
};

export const getChadawaById = async (id) => {
    const [[row]] = await db.query(`SELECT * FROM chadawas WHERE id=?`, [id]);
    return row;
};

/* ITEMS */

export const addChadawaItem = async (chadawaId, d) => {
    const [r] = await db.query(
        `INSERT INTO chadawa_items (chadawa_id,title,title_hi,description,description_hi,price)
     VALUES (?,?,?,?,?,?)`,
        [chadawaId, d.title, d.title_hi, d.description, d.description_hi, d.price]
    );
    return r.insertId;
};

export const updateChadawaItem = async (id, d) => {
    const [r] = await db.query(
        `UPDATE chadawa_items SET title=?,title_hi=?,description=?,description_hi=?,price=?,chadawa_id=? WHERE id=?`,
        [d.title, d.title_hi, d.description, d.description_hi, d.price, d.chadawa_id, id]
    );
    return r.affectedRows;
};

export const deleteChadawaItem = async (id) => {
    await db.query(`DELETE FROM chadawa_items WHERE id=?`, [id]);
};

/* BENEFITS */

export const addChadawaBenefit = async (chadawaId, d) => {
    const [r] = await db.query(
        `INSERT INTO chadawa_benefits (chadawa_id,title,title_hi,description,description_hi)
     VALUES (?,?,?,?,?)`,
        [chadawaId, d.title, d.title_hi, d.description, d.description_hi]
    );
    return r.insertId;
};

export const deleteChadawaBenefit = async (id) => {
    await db.query(`DELETE FROM chadawa_benefits WHERE id=?`, [id]);
};

/* TEMPLE MAP */

export const mapChadawaTemple = async (chadawaId, templeId) => {
    await db.query(
        `INSERT INTO chadawa_temples (chadawa_id,temple_id) VALUES (?,?)`,
        [chadawaId, templeId]
    );
};
export const deleteChadawaTemple = async (chadawaId, templeId) => {
    await db.query(`DELETE FROM chadawa_temples WHERE chadawa_id=? AND temple_id=?`, [
        chadawaId,
        templeId,
    ]);
};

/* USER FETCH */

export const getChadawaItems = async (id) => {
    const [r] = await db.query(
        `SELECT id,title,title_hi,description,description_hi,price FROM chadawa_items WHERE chadawa_id=?`,
        [id]
    );
    return r;
};

export const getChadawaBenefits = async (id) => {
    const [r] = await db.query(
        `SELECT id,title,title_hi,description,description_hi FROM chadawa_benefits WHERE chadawa_id=?`,
        [id]
    );
    return r;
};

export const getChadawaTemples = async (id) => {
    const [r] = await db.query(
        `SELECT t.id,t.title FROM chadawa_temples ct
     JOIN temples t ON t.id=ct.temple_id
     WHERE ct.chadawa_id=?`,
        [id]
    );
    return r;
};

export const getChadawaReviews = async (id) => {
    const [r] = await db.query(
        `SELECT user_name,rating,comment FROM chadawa_reviews WHERE chadawa_id=?`,
        [id]
    );
    return r;
};

export const getChadawasByTemple = async (templeId) => {
    const [r] = await db.query(
        `SELECT c.id, c.title, c.title_hi, c.image, c.description, c.description_hi, c.chadawa_date
     FROM chadawa_temples ct
     JOIN chadawas c ON c.id=ct.chadawa_id
     WHERE ct.temple_id=?`,
        [templeId]
    );
    return r;
};
export const getAllChadawas = async () => {
    const [r] = await db.query(`
    SELECT id, title, title_hi, image, description, description_hi, benefits, benefits_hi, chadawa_date, status
    FROM chadawas
    ORDER BY created_at DESC
  `);
    return r;
};

/* GALLERY */

export const addChadawaImage = async (chadawaId, imageUrl, description = "") => {
    const [res] = await db.query(
        `INSERT INTO chadawa_gallery (chadawa_id, image_url, description) VALUES (?, ?, ?)`,
        [chadawaId, imageUrl, description]
    );
    return res.insertId;
};

export const getChadawaImages = async (chadawaId) => {
    const [rows] = await db.query(
        `SELECT id, image_url, description FROM chadawa_gallery WHERE chadawa_id = ?`,
        [chadawaId]
    );
    return rows;
};

export const deleteChadawaImage = async (id) => {
    const [res] = await db.query(`DELETE FROM chadawa_gallery WHERE id = ?`, [id]);
    return res.affectedRows;
};
