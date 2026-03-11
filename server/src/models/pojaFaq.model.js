import db from "../config/db.js";

// Get FAQs by pooja ID
export const getFaqsByPoojaId = async (poojaId) => {
    const [rows] = await db.query(
        `SELECT * FROM pooja_faqs 
     WHERE pooja_id = ? AND status = 1 
     ORDER BY sort_order ASC`,
        [poojaId]
    );
    return rows;
};

// Create FAQ
export const createFaq = async ({ pooja_id, question, question_hi, answer, answer_hi, sort_order }) => {
    const [result] = await db.query(
        `INSERT INTO pooja_faqs 
     (pooja_id, question, question_hi, answer, answer_hi, sort_order) 
     VALUES (?, ?, ?, ?, ?, ?)`,
        [pooja_id, question, question_hi, answer, answer_hi, sort_order || 0]
    );

    return result.insertId;
};

// Delete FAQ
export const deleteFaq = async (faqId) => {
    await db.query(
        `DELETE FROM pooja_faqs WHERE id = ?`,
        [faqId]
    );
};
