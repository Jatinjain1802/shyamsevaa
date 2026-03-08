import express from "express";
import {
    getCart,
    addPoojaToCart,
    addChadawaToCart,
    addProductToCart,
    updateCartItemQty,
    updateAddonQty,
    removeCartItem,
} from "../controllers/cart.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// get cart (user or guest)
router.get("/", authMiddleware.optional, getCart);

// add pooja variant
router.post("/pooja", authMiddleware.optional, addPoojaToCart);

// add chadawa item
router.post("/chadawa", authMiddleware.optional, addChadawaToCart);

// add product
router.post("/add-product", authMiddleware.optional, addProductToCart);

// update item quantity
router.put("/items/:cartItemId", authMiddleware.optional, updateCartItemQty);

// update addon quantity
router.put("/addons/:addonId", authMiddleware.optional, updateAddonQty);

// remove item
router.delete("/items/:cartItemId", authMiddleware.optional, removeCartItem);

export default router;
