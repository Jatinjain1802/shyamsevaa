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
    // LEARNING: Check if this exact pooja variant is already in the cart (upsert pattern)
    // This prevents doubling the price when a user navigates back and re-submits the checkout form
    const [[existing]] = await db.query(
        `SELECT id FROM cart_items WHERE cart_id=? AND product_type='pooja_variant' AND pooja_variant_id=?`,
        [d.cart_id, d.pooja_variant_id]
    );

    if (existing) {
        // Item already in cart, return the existing cart_item id (do not add again)
        return existing.id;
    }

    // get variant price
    const [[variant]] = await db.query(
        `SELECT price FROM pooja_variants WHERE id=?`,
        [d.pooja_variant_id]
    );

    const [res] = await db.query(
        `INSERT INTO cart_items
     (cart_id, product_type, pooja_variant_id, temple_id, quantity, base_price)
     VALUES (?, 'pooja_variant', ?, ?, 1, ?)`,
        [d.cart_id, d.pooja_variant_id, d.temple_id || null, variant.price]
    );

    return res.insertId;
};

export const addChadawaItem = async (d) => {
    // LEARNING: Upsert pattern — if the same chadawa item is already in cart, just increment quantity
    const [[existing]] = await db.query(
        `SELECT id, quantity FROM cart_items WHERE cart_id=? AND product_type='chadawa_item' AND chadawa_item_id=?`,
        [d.cart_id, d.chadawa_item_id]
    );

    if (existing) {
        // Already exists: increase quantity instead of adding a duplicate row
        await db.query(
            `UPDATE cart_items SET quantity = quantity + ? WHERE id=?`,
            [d.quantity || 1, existing.id]
        );
        return;
    }

    const [[item]] = await db.query(
        `SELECT price FROM chadawa_items WHERE id=?`,
        [d.chadawa_item_id]
    );

    await db.query(
        `INSERT INTO cart_items
     (cart_id, product_type, chadawa_item_id, temple_id, quantity, base_price)
     VALUES (?, 'chadawa_item', ?, ?, ?, ?)`,
        [d.cart_id, d.chadawa_item_id, d.temple_id || null, d.quantity || 1, item.price]
    );
};

export const addProductItem = async (d) => {
    // LEARNING: Upsert pattern — if the same product is already in cart, just increase its quantity
    const [[existing]] = await db.query(
        `SELECT id, quantity FROM cart_items WHERE cart_id=? AND product_type='product' AND product_id=?`,
        [d.cart_id, d.product_id]
    );

    if (existing) {
        // Already exists: just increase quantity
        await db.query(
            `UPDATE cart_items SET quantity = quantity + ? WHERE id=?`,
            [d.quantity || 1, existing.id]
        );
        return;
    }

    const [[product]] = await db.query(
        `SELECT price FROM products WHERE id=?`,
        [d.product_id]
    );

    await db.query(
        `INSERT INTO cart_items
     (cart_id, product_type, product_id, quantity, base_price)
     VALUES (?, 'product', ?, ?, ?)`,
        [d.cart_id, d.product_id, d.quantity || 1, product.price]
    );
};

/* ================= ADDONS ================= */

export const addAddonToCartItem = async (d) => {
    // LEARNING: Upsert pattern for addons too — prevent duplicate addon rows
    const [[existingAddon]] = await db.query(
        `SELECT id FROM cart_item_addons WHERE cart_item_id=? AND addon_id=?`,
        [d.cart_item_id, d.addon_id]
    );

    if (existingAddon) {
        // Addon already added to this cart item, skip
        return;
    }

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
    // 1. Fetch base items
    const [items] = await db.query(
        `SELECT * FROM cart_items WHERE cart_id=?`,
        [cartId]
    );

    // 2. Fetch specific details for each item type
    for (const item of items) {
        if (item.product_type === 'pooja_variant') {
            const [[poojaDetail]] = await db.query(
                `SELECT p.id as pooja_id, p.title, p.image 
                 FROM poojas p
                 JOIN pooja_variants pv ON pv.pooja_id = p.id
                 WHERE pv.id = ?`,
                [item.pooja_variant_id]
            );
            if (poojaDetail) {
                item.name = poojaDetail.title;
                item.image = poojaDetail.image;
                item.pooja_id = poojaDetail.pooja_id;
            }
        } else if (item.product_type === 'chadawa_item') {
            const [[chadawaDetail]] = await db.query(
                `SELECT c.id as chadawa_id, c.title, c.image 
                 FROM chadawas c
                 JOIN chadawa_items ci ON ci.chadawa_id = c.id
                 WHERE ci.id = ?`,
                [item.chadawa_item_id]
            );
            if (chadawaDetail) {
                item.name = chadawaDetail.title;
                item.image = chadawaDetail.image;
                item.chadawa_id = chadawaDetail.chadawa_id;
            }
        } else if (item.product_type === 'product') {
            const [[productDetail]] = await db.query(
                `SELECT name, image_url as image FROM products WHERE id = ?`,
                [item.product_id]
            );
            if (productDetail) {
                item.name = productDetail.name;
                item.image = productDetail.image;
            }
        }

        // 3. Fetch addons
        const [addons] = await db.query(
            `SELECT cia.*, a.title 
             FROM cart_item_addons cia
             JOIN addons a ON a.id = cia.addon_id
             WHERE cia.cart_item_id = ?`,
            [item.id]
        );
        item.addons = addons;
    }

    return items;
};

export const clearCart = async (cartId) => {
    await db.query(`DELETE FROM cart_items WHERE cart_id=?`, [cartId]);
};
