import db from "../config/db.js";

export const searchGlobal = async (queryTerm) => {
    const searchTerm = `%${queryTerm}%`;

    const [rows] = await db.query(
        `
    (SELECT id, title, image, description, 'temple' as type, city, state 
     FROM temples 
     WHERE title LIKE ? OR description LIKE ? OR city LIKE ? OR state LIKE ?)
    UNION
    (SELECT id, title, image, description, 'pooja' as type, NULL as city, NULL as state 
     FROM poojas 
     WHERE title LIKE ? OR description LIKE ?)
    ORDER BY title ASC
    LIMIT 20
    `,
        [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm]
    );

    return rows;
};
