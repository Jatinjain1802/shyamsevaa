import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../utils/axios";

// Generate or retrieve session ID for guest users
const getSessionId = () => {
    let sessionId = localStorage.getItem("cart_session_id");
    if (!sessionId) {
        sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem("cart_session_id", sessionId);
    }
    return sessionId;
};

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    // Fetch cart data
    const fetchCart = useCallback(async () => {
        try {
            setLoading(true);
            const sessionId = getSessionId();
            const res = await api.get("/cart", {
                headers: { "x-session-id": sessionId },
            });
            const items = res.data.data || [];
            setCartItems(items);

            // Calculate total count (items + addon quantities)
            const count = items.reduce((total, item) => {
                const addonCount = item.addons?.reduce((sum, a) => sum + (a.quantity || 1), 0) || 0;
                return total + (item.quantity || 1) + addonCount;
            }, 0);
            setCartCount(count);
        } catch (err) {
            console.error("Failed to fetch cart:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Add pooja to cart
    const addPoojaToCart = async ({ pooja_variant_id, temple_id, addons = [] }) => {
        try {
            const sessionId = getSessionId();
            await api.post(
                "/cart/pooja",
                { pooja_variant_id, temple_id, addons },
                { headers: { "x-session-id": sessionId } }
            );
            await fetchCart();
            return { success: true };
        } catch (err) {
            console.error("Failed to add pooja to cart:", err);
            return { success: false, error: err.message };
        }
    };

    // Add chadawa to cart
    const addChadawaToCart = async ({ chadawa_item_id, temple_id, quantity = 1 }) => {
        try {
            const sessionId = getSessionId();
            await api.post(
                "/cart/chadawa",
                { chadawa_item_id, temple_id, quantity },
                { headers: { "x-session-id": sessionId } }
            );
            await fetchCart();
            return { success: true };
        } catch (err) {
            console.error("Failed to add chadawa to cart:", err);
            return { success: false, error: err.message };
        }
    };

    // Update cart item quantity
    const updateItemQuantity = async (cartItemId, quantity) => {
        try {
            const sessionId = getSessionId();
            await api.put(
                `/cart/items/${cartItemId}`,
                { quantity },
                { headers: { "x-session-id": sessionId } }
            );
            await fetchCart();
            return { success: true };
        } catch (err) {
            console.error("Failed to update quantity:", err);
            return { success: false, error: err.message };
        }
    };

    // Update addon quantity
    const updateAddonQuantity = async (addonId, quantity) => {
        try {
            const sessionId = getSessionId();
            await api.put(
                `/cart/addons/${addonId}`,
                { quantity },
                { headers: { "x-session-id": sessionId } }
            );
            await fetchCart();
            return { success: true };
        } catch (err) {
            console.error("Failed to update addon quantity:", err);
            return { success: false, error: err.message };
        }
    };

    // Remove item from cart
    const removeItem = async (cartItemId) => {
        try {
            const sessionId = getSessionId();
            await api.delete(`/cart/items/${cartItemId}`, {
                headers: { "x-session-id": sessionId },
            });
            await fetchCart();
            return { success: true };
        } catch (err) {
            console.error("Failed to remove item:", err);
            return { success: false, error: err.message };
        }
    };

    // Calculate total price
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const itemTotal = Number(item.base_price) * (item.quantity || 1);
            const addonsTotal = item.addons?.reduce((sum, addon) => {
                return sum + Number(addon.price) * (addon.quantity || 1);
            }, 0) || 0;
            return total + itemTotal + addonsTotal;
        }, 0);
    };

    // Load cart on mount
    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const value = {
        cartItems,
        cartCount,
        loading,
        fetchCart,
        addPoojaToCart,
        addChadawaToCart,
        updateItemQuantity,
        updateAddonQuantity,
        removeItem,
        calculateTotal,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export default CartContext;
