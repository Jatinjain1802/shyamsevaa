import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function Cart() {
    const navigate = useNavigate();
    const {
        cartItems,
        loading,
        updateItemQuantity,
        removeItem,
        calculateTotal,
        fetchCart,
    } = useCart();

    const [removing, setRemoving] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchCart();
    }, [fetchCart]);

    const handleQuantityChange = async (itemId, newQty) => {
        if (newQty < 1) return;
        await updateItemQuantity(itemId, newQty);
    };

    const handleRemove = async (itemId) => {
        setRemoving(itemId);
        await removeItem(itemId);
        setRemoving(null);
    };

    const getProductTypeLabel = (type) => {
        switch (type) {
            case "pooja_variant":
                return "Pooja Seva";
            case "chadawa_item":
                return "Chadawa Offering";
            default:
                return "Item";
        }
    };

    const getProductTypeIcon = (type) => {
        switch (type) {
            case "pooja_variant":
                return "self_improvement";
            case "chadawa_item":
                return "volunteer_activism";
            default:
                return "shopping_bag";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-paper-bg">
                <div className="text-center">
                    <div className="animate-spin h-12 w-12 border-4 border-marigold border-t-sindoor rounded-full mx-auto mb-4"></div>
                    <p className="text-stone-500">Loading your sacred offerings...</p>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-paper-bg py-16 px-6">
                <div className="max-w-[800px] mx-auto text-center">
                    {/* Empty Cart Illustration */}
                    <div className="relative mb-8">
                        <div className="w-40 h-40 bg-marigold/10 rounded-full mx-auto flex items-center justify-center">
                            <span className="material-symbols-outlined text-8xl text-marigold/50">
                                shopping_cart
                            </span>
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <span className="material-symbols-outlined text-6xl text-sindoor animate-bounce">
                                sentiment_sad
                            </span>
                        </div>
                    </div>

                    <h1 className="text-3xl font-serif text-sindoor mb-4">
                        Your Sacred Cart is Empty
                    </h1>
                    <p className="text-stone-500 mb-8 max-w-md mx-auto">
                        Begin your spiritual journey by adding divine poojas and chadawa
                        offerings to receive blessings from the almighty.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate("/poojas")}
                            className="bg-sindoor text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-sindoor/90 transition-all shadow-lg"
                        >
                            <span className="material-symbols-outlined">self_improvement</span>
                            Explore Poojas
                        </button>
                        <button
                            onClick={() => navigate("/chadawas")}
                            className="bg-marigold text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-marigold/90 transition-all shadow-lg"
                        >
                            <span className="material-symbols-outlined">volunteer_activism</span>
                            Explore Chadawa
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-paper-bg pb-32">
            {/* Header */}
            <div className="bg-white border-b border-stone-100 sticky top-0 z-40">
                <div className="max-w-[1280px] mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 hover:bg-stone-100 rounded-full transition-colors"
                            >
                                <span className="material-symbols-outlined text-stone-600">
                                    arrow_back
                                </span>
                            </button>
                            <div>
                                <h1 className="text-2xl font-serif text-sindoor">Sacred Cart</h1>
                                <p className="text-sm text-stone-500">
                                    {cartItems.length} {cartItems.length === 1 ? "item" : "items"} •
                                    Ready for divine blessings
                                </p>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center gap-2 text-stone-400 text-sm">
                            <span className="material-symbols-outlined text-lg">
                                verified_user
                            </span>
                            Secure & Blessed
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1280px] mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className={`bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden transition-all ${removing === item.id ? "opacity-50 scale-98" : ""
                                    }`}
                            >
                                {/* Item Header */}
                                <div className="p-6 border-b border-stone-50">
                                    <div className="flex items-start gap-4">
                                        {/* Type Icon */}
                                        <div className="w-14 h-14 bg-marigold/10 rounded-xl flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-2xl text-marigold">
                                                {getProductTypeIcon(item.product_type)}
                                            </span>
                                        </div>

                                        {/* Item Details */}
                                        <div className="grow">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <span className="text-xs text-marigold font-bold uppercase tracking-wider">
                                                        {getProductTypeLabel(item.product_type)}
                                                    </span>
                                                    <h3 className="text-lg font-bold text-heritage-dark mt-1">
                                                        {item.product_type === "pooja_variant"
                                                            ? `Pooja Variant #${item.pooja_variant_id}`
                                                            : `Chadawa Item #${item.chadawa_item_id}`}
                                                    </h3>
                                                    {item.temple_id && (
                                                        <p className="text-sm text-stone-500 flex items-center gap-1 mt-1">
                                                            <span className="material-symbols-outlined text-sm">
                                                                location_on
                                                            </span>
                                                            Temple #{item.temple_id}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Price */}
                                                <div className="text-right">
                                                    <p className="text-2xl font-black text-sindoor">
                                                        ₹{Number(item.base_price * (item.quantity || 1)).toLocaleString()}
                                                    </p>
                                                    <p className="text-xs text-stone-400">
                                                        ₹{Number(item.base_price).toLocaleString()} × {item.quantity || 1}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quantity & Actions */}
                                <div className="p-4 bg-stone-50/50 flex items-center justify-between">
                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-stone-500 font-medium">Qty:</span>
                                        <div className="flex items-center bg-white rounded-lg border border-stone-200 overflow-hidden">
                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(item.id, (item.quantity || 1) - 1)
                                                }
                                                disabled={(item.quantity || 1) <= 1}
                                                className="p-2 hover:bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-lg">
                                                    remove
                                                </span>
                                            </button>
                                            <span className="px-4 py-2 font-bold text-heritage-dark min-w-[40px] text-center">
                                                {item.quantity || 1}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(item.id, (item.quantity || 1) + 1)
                                                }
                                                className="p-2 hover:bg-stone-100 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-lg">
                                                    add
                                                </span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => handleRemove(item.id)}
                                        disabled={removing === item.id}
                                        className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                        <span className="text-sm font-medium hidden sm:inline">
                                            Remove
                                        </span>
                                    </button>
                                </div>

                                {/* Addons */}
                                {item.addons && item.addons.length > 0 && (
                                    <div className="p-4 border-t border-stone-100 bg-haldi/5">
                                        <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">
                                            Sacred Add-ons
                                        </p>
                                        <div className="space-y-2">
                                            {item.addons.map((addon) => (
                                                <div
                                                    key={addon.id}
                                                    className="flex items-center justify-between bg-white p-3 rounded-lg"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className="material-symbols-outlined text-marigold">
                                                            add_circle
                                                        </span>
                                                        <span className="text-sm font-medium">
                                                            Addon #{addon.addon_id}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-sm text-stone-500">
                                                            × {addon.quantity || 1}
                                                        </span>
                                                        <span className="font-bold text-sindoor">
                                                            ₹{Number(addon.price * (addon.quantity || 1)).toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 sticky top-32">
                            {/* Summary Header */}
                            <div className="p-6 border-b border-stone-100">
                                <h2 className="text-xl font-serif text-sindoor flex items-center gap-2">
                                    <span className="material-symbols-outlined text-marigold">
                                        receipt_long
                                    </span>
                                    Order Summary
                                </h2>
                            </div>

                            {/* Summary Details */}
                            <div className="p-6 space-y-4">
                                {/* Items Subtotal */}
                                <div className="flex justify-between text-stone-600">
                                    <span>Subtotal ({cartItems.length} items)</span>
                                    <span className="font-medium">
                                        ₹{calculateTotal().toLocaleString()}
                                    </span>
                                </div>

                                {/* Dakshina */}
                                <div className="flex justify-between text-stone-600">
                                    <span>Pandit Dakshina</span>
                                    <span className="text-green-600 font-medium">Included</span>
                                </div>

                                {/* Delivery */}
                                <div className="flex justify-between text-stone-600">
                                    <span>Prasad Delivery</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>

                                <div className="h-px bg-stone-100"></div>

                                {/* Total */}
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-heritage-dark">
                                        Total Dakshina
                                    </span>
                                    <span className="text-2xl font-black text-sindoor">
                                        ₹{calculateTotal().toLocaleString()}
                                    </span>
                                </div>

                                {/* Checkout Button */}
                                <button
                                    onClick={() => navigate("/checkout")}
                                    className="w-full bg-sindoor text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-sindoor/90 transition-all shadow-lg shadow-sindoor/20 mt-4"
                                >
                                    Proceed to Checkout
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </button>

                                {/* Trust Badges */}
                                <div className="grid grid-cols-2 gap-3 mt-6">
                                    <div className="flex items-center gap-2 text-stone-500 text-xs">
                                        <span className="material-symbols-outlined text-green-500 text-lg">
                                            verified_user
                                        </span>
                                        Secure Payment
                                    </div>
                                    <div className="flex items-center gap-2 text-stone-500 text-xs">
                                        <span className="material-symbols-outlined text-marigold text-lg">
                                            local_shipping
                                        </span>
                                        Prasad Delivery
                                    </div>
                                    <div className="flex items-center gap-2 text-stone-500 text-xs">
                                        <span className="material-symbols-outlined text-sindoor text-lg">
                                            support_agent
                                        </span>
                                        24/7 Support
                                    </div>
                                    <div className="flex items-center gap-2 text-stone-500 text-xs">
                                        <span className="material-symbols-outlined text-haldi text-lg">
                                            videocam
                                        </span>
                                        Live Darshan
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-4 lg:hidden z-50">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-xs text-stone-500 uppercase tracking-wider">
                            Total
                        </p>
                        <p className="text-2xl font-black text-sindoor">
                            ₹{calculateTotal().toLocaleString()}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/checkout")}
                        className="flex-1 bg-sindoor text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-sindoor/90 transition-all"
                    >
                        Checkout
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
