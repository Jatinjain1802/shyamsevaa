import * as CartModel from "../models/cart.model.js";
import * as ProductModel from "../models/products.model.js";

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
    const { chadawa_item_id, temple_id, quantity, items } = req.body;
    const cart = await CartModel.getOrCreateCart(req);

    // Support bulk add from ChadawaDetail
    if (Array.isArray(items)) {
        for (const item of items) {
            await CartModel.addChadawaItem({
                cart_id: cart.id,
                chadawa_item_id: item.chadawa_item_id,
                temple_id,
                quantity: item.quantity || 1,
            });
        }
    } else if (chadawa_item_id) {
        // Fallback for single item add
        await CartModel.addChadawaItem({
            cart_id: cart.id,
            chadawa_item_id,
            temple_id,
            quantity: quantity || 1,
        });
    }

    res.json({ success: true, message: "Chadawa added to cart" });
};

/* ================= ADD PRODUCT ================= */

export const addProductToCart = async (req, res) => {
    const { product_id, quantity } = req.body;
    const cart = await CartModel.getOrCreateCart(req);

    // Check stock
    const product = await ProductModel.getProductById(product_id);
    if (!product || product.stock_quantity < (quantity || 1)) {
        return res.status(400).json({ 
            success: false, 
            message: product ? `Insufficient stock. Available: ${product.stock_quantity}` : "Product not found" 
        });
    }

    await CartModel.addProductItem({
        cart_id: cart.id,
        product_id,
        quantity,
    });

    res.json({ success: true, message: "Product added to cart" });
};

/* ================= UPDATE QTY ================= */

export const updateCartItemQty = async (req, res) => {
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    // Optional: check stock if it's a product
    const [item] = await CartModel.getCartDetailById(cartItemId);
    if (item && item.product_type === 'product' && item.product_id) {
        const product = await ProductModel.getProductById(item.product_id);
        if (product && product.stock_quantity < quantity) {
            return res.status(400).json({ 
                success: false, 
                message: `Insufficient stock. Available: ${product.stock_quantity}` 
            });
        }
    }

    await CartModel.updateCartItemQty(cartItemId, quantity);
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
export const clearCart = async (req, res) => {
    const cart = await CartModel.getOrCreateCart(req);
    await CartModel.clearCart(cart.id);
    res.json({ success: true, message: "Cart cleared" });
};
