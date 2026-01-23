import db from "../config/db.js";

/* ================= CART ================= */

export const getOrCreateCart = async (req) => {
    const userId = req.user?.id || null;
    const sessionId = req.headers["x-session-id"] || null;

    const [[existing]] = await db.query(
        `SELECT * FROM carts WHERE user_id <=> ? AND session_id <=> ?`,
        [userId, sessionId]
    );

    if (existing) return existing;

    const [res] = await db.query(
        `INSERT INTO carts (user_id, session_id) VALUES (?, ?)`,
        [userId, sessionId]
    );

    return { id: res.insertId };
};

/* ================= ADD ITEMS ================= */

export const addPoojaItem = async (d) => {
    // get variant price
    const [[variant]] = await db.query(
        `SELECT price FROM pooja_variants WHERE id=?`,
        [d.pooja_variant_id]
    );

    const [res] = await db.query(
        `INSERT INTO cart_items
     (cart_id, product_type, pooja_variant_id, temple_id, quantity, base_price)
     VALUES (?, 'pooja_variant', ?, ?, 1, ?)`,
        [d.cart_id, d.pooja_variant_id, d.temple_id, variant.price]
    );

    return res.insertId;
};

export const addChadawaItem = async (d) => {
    const [[item]] = await db.query(
        `SELECT price FROM chadawa_items WHERE id=?`,
        [d.chadawa_item_id]
    );

    await db.query(
        `INSERT INTO cart_items
     (cart_id, product_type, chadawa_item_id, temple_id, quantity, base_price)
     VALUES (?, 'chadawa_item', ?, ?, ?, ?)`,
        [d.cart_id, d.chadawa_item_id, d.temple_id, d.quantity || 1, item.price]
    );
};

/* ================= ADDONS ================= */

export const addAddonToCartItem = async (d) => {
    const [[addon]] = await db.query(
        `SELECT price FROM addons WHERE id=?`,
        [d.addon_id]
    );

    await db.query(
        `INSERT INTO cart_item_addons
     (cart_item_id, addon_id, price, quantity)
     VALUES (?, ?, ?, ?)`,
        [d.cart_item_id, d.addon_id, addon.price, d.quantity]
    );
};

/* ================= UPDATE ================= */

export const updateCartItemQty = async (id, qty) => {
    await db.query(
        `UPDATE cart_items SET quantity=? WHERE id=?`,
        [qty, id]
    );
};

export const updateAddonQty = async (id, qty) => {
    await db.query(
        `UPDATE cart_item_addons SET quantity=? WHERE id=?`,
        [qty, id]
    );
};

/* ================= REMOVE ================= */

export const removeCartItem = async (id) => {
    await db.query(`DELETE FROM cart_items WHERE id=?`, [id]);
};

/* ================= VIEW CART ================= */

export const getCartDetail = async (cartId) => {
    const [items] = await db.query(
        `SELECT * FROM cart_items WHERE cart_id=?`,
        [cartId]
    );

    for (const item of items) {
        const [addons] = await db.query(
            `SELECT * FROM cart_item_addons WHERE cart_item_id=?`,
            [item.id]
        );
        item.addons = addons;
    }

    return items;
};
