import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../utils/axios";

// Generate or retrieve session ID for guest users
const getSessionId = () => {
    let sessionId = localStorage.getItem("wishlist_session_id");
    if (!sessionId) {
        // Fallback to cart_session_id if it exists to preserve old carts during migration
        sessionId = localStorage.getItem("cart_session_id") || `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem("wishlist_session_id", sessionId);
    }
    return sessionId;
};

const WishlistContext = createContext();

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
};

export function WishlistProvider({ children }) {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [wishlistCount, setWishlistCount] = useState(0);

    // Fetch wishlist data (still uses /cart endpoint)
    const fetchWishlist = useCallback(async () => {
        try {
            setLoading(true);
            const sessionId = getSessionId();
            const res = await api.get("/cart", {
                headers: { "x-session-id": sessionId },
            });
            const items = res.data.data || [];
            setWishlistItems(items);

            // Calculate total count (items + addon quantities)
            const count = items.reduce((total, item) => {
                const addonCount = item.addons?.reduce((sum, a) => sum + (a.quantity || 1), 0) || 0;
                return total + (item.quantity || 1) + addonCount;
            }, 0);
            setWishlistCount(count);
        } catch (err) {
            console.error("Failed to fetch wishlist:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Add pooja to wishlist (via /cart/pooja)
    const addPoojaToWishlist = async ({ pooja_variant_id, temple_id, addons = [] }) => {
        try {
            const sessionId = getSessionId();
            await api.post(
                "/cart/pooja",
                { pooja_variant_id, temple_id, addons },
                { headers: { "x-session-id": sessionId } }
            );
            await fetchWishlist();
            return { success: true };
        } catch (err) {
            console.error("Failed to add pooja to wishlist:", err);
            return { success: false, error: err.message };
        }
    };

    // Add chadawa to wishlist (via /cart/chadawa)
    const addChadawaToWishlist = async ({ chadawa_item_id, temple_id, quantity = 1 }) => {
        try {
            const sessionId = getSessionId();
            await api.post(
                "/cart/chadawa",
                { chadawa_item_id, temple_id, quantity },
                { headers: { "x-session-id": sessionId } }
            );
            await fetchWishlist();
            return { success: true };
        } catch (err) {
            console.error("Failed to add chadawa to wishlist:", err);
            return { success: false, error: err.message };
        }
    };

    // Update wishlist item quantity
    const updateItemQuantity = async (itemId, quantity) => {
        try {
            const sessionId = getSessionId();
            await api.put(
                `/cart/items/${itemId}`,
                { quantity },
                { headers: { "x-session-id": sessionId } }
            );
            await fetchWishlist();
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
            await fetchWishlist();
            return { success: true };
        } catch (err) {
            console.error("Failed to update addon quantity:", err);
            return { success: false, error: err.message };
        }
    };

    // Remove item from wishlist
    const removeItem = async (itemId) => {
        try {
            const sessionId = getSessionId();
            await api.delete(`/cart/items/${itemId}`, {
                headers: { "x-session-id": sessionId },
            });
            await fetchWishlist();
            return { success: true };
        } catch (err) {
            console.error("Failed to remove item:", err);
            return { success: false, error: err.message };
        }
    };

    // Add product to wishlist (via /cart/add-product)
    const addProductToWishlist = async ({ productId, quantity = 1 }) => {
        try {
            const sessionId = getSessionId();
            await api.post(
                "/cart/add-product",
                { product_id: productId, quantity },
                { headers: { "x-session-id": sessionId } }
            );
            await fetchWishlist();
            return { success: true };
        } catch (err) {
            console.error("Failed to add product to wishlist:", err);
            return { success: false, error: err.message };
        }
    };

    // Calculate total price
    const calculateTotal = () => {
        return wishlistItems.reduce((total, item) => {
            const itemTotal = Number(item.base_price) * (item.quantity || 1);
            const addonsTotal = item.addons?.reduce((sum, addon) => {
                return sum + Number(addon.price) * (addon.quantity || 1);
            }, 0) || 0;
            return total + itemTotal + addonsTotal;
        }, 0);
    };

    // Load wishlist on mount
    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    const value = {
        wishlistItems,
        wishlistCount,
        loading,
        fetchWishlist,
        addPoojaToWishlist,
        addChadawaToWishlist,
        addProductToWishlist,
        updateItemQuantity,
        updateAddonQuantity,
        removeItem,
        calculateTotal,
    };

    return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export default WishlistContext;
