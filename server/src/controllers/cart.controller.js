import * as CartModel from "../models/cart.model.js";

/* ================= GET / CREATE CART ================= */

export const getCart = async (req, res) => {
    const cart = await CartModel.getOrCreateCart(req);
    const data = await CartModel.getCartDetail(cart.id);
    res.json({ success: true, data });
};

/* ================= ADD POOJA ================= */

export const addPoojaToCart = async (req, res) => {
    const { pooja_variant_id, temple_id, addons } = req.body;
    const cart = await CartModel.getOrCreateCart(req);

    const cartItemId = await CartModel.addPoojaItem({
        cart_id: cart.id,
        pooja_variant_id,
        temple_id,
    });

    // addons (optional)
    if (Array.isArray(addons)) {
        for (const a of addons) {
            await CartModel.addAddonToCartItem({
                cart_item_id: cartItemId,
                addon_id: a.addon_id,
                quantity: a.quantity || 1,
            });
        }
    }

    res.json({ success: true, message: "Pooja added to cart" });
};

/* ================= ADD CHADAWA ================= */

export const addChadawaToCart = async (req, res) => {
    const { chadawa_item_id, temple_id, quantity } = req.body;
    const cart = await CartModel.getOrCreateCart(req);

    await CartModel.addChadawaItem({
        cart_id: cart.id,
        chadawa_item_id,
        temple_id,
        quantity,
    });

    res.json({ success: true, message: "Chadawa added to cart" });
};

/* ================= ADD PRODUCT ================= */

export const addProductToCart = async (req, res) => {
    const { product_id, quantity } = req.body;
    const cart = await CartModel.getOrCreateCart(req);

    await CartModel.addProductItem({
        cart_id: cart.id,
        product_id,
        quantity,
    });

    res.json({ success: true, message: "Product added to cart" });
};

/* ================= UPDATE QTY ================= */

export const updateCartItemQty = async (req, res) => {
    await CartModel.updateCartItemQty(
        req.params.cartItemId,
        req.body.quantity
    );
    res.json({ success: true });
};

export const updateAddonQty = async (req, res) => {
    await CartModel.updateAddonQty(
        req.params.addonId,
        req.body.quantity
    );
    res.json({ success: true });
};

/* ================= REMOVE ITEM ================= */

export const removeCartItem = async (req, res) => {
    await CartModel.removeCartItem(req.params.cartItemId);
    res.json({ success: true });
};
