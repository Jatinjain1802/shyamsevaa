import db from "../config/db.js";

/* CHADAWA */

export const createChadawa = async (d) => {
    const [r] = await db.query(
        `INSERT INTO chadawas (title,image,description,benefits,chadawa_date)
     VALUES (?,?,?,?,?)`,
        [d.title, d.image, d.description, d.benefits, d.chadawa_date]
    );
    return r.insertId;
};

export const updateChadawa = async (id, d) => {
    const [r] = await db.query(
        `UPDATE chadawas SET title=?,image=?,description=?,benefits=?,chadawa_date=? WHERE id=?`,
        [d.title, d.image, d.description, d.benefits, d.chadawa_date, id]
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
        `INSERT INTO chadawa_items (chadawa_id,title,description,price)
     VALUES (?,?,?,?)`,
        [chadawaId, d.title, d.description, d.price]
    );
    return r.insertId;
};

export const updateChadawaItem = async (id, d) => {
    const [r] = await db.query(
        `UPDATE chadawa_items SET title=?,description=?,price=? WHERE id=?`,
        [d.title, d.description, d.price, id]
    );
    return r.affectedRows;
};

export const deleteChadawaItem = async (id) => {
    await db.query(`DELETE FROM chadawa_items WHERE id=?`, [id]);
};

/* BENEFITS */

export const addChadawaBenefit = async (chadawaId, d) => {
    const [r] = await db.query(
        `INSERT INTO chadawa_benefits (chadawa_id,title,description)
     VALUES (?,?,?)`,
        [chadawaId, d.title, d.description]
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

/* USER FETCH */

export const getChadawaItems = async (id) => {
    const [r] = await db.query(
        `SELECT id,title,description,price FROM chadawa_items WHERE chadawa_id=?`,
        [id]
    );
    return r;
};

export const getChadawaBenefits = async (id) => {
    const [r] = await db.query(
        `SELECT title,description FROM chadawa_benefits WHERE chadawa_id=?`,
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
        `SELECT c.id,c.title,c.image,c.chadawa_date
     FROM chadawa_temples ct
     JOIN chadawas c ON c.id=ct.chadawa_id
     WHERE ct.temple_id=?`,
        [templeId]
    );
    return r;
};
