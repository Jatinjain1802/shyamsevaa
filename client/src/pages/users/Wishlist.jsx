import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import {
    Heart,
    Frown,
    ArrowLeft,
    MapPin,
    Plus,
    Minus,
    Trash2,
    PlusCircle,
    Receipt,
    ArrowRight,
    ShieldCheck,
    Truck,
    Headphones,
    Video,
    Sparkles
} from "lucide-react";
import { MdSelfImprovement, MdVolunteerActivism } from "react-icons/md";

export default function Wishlist() {
    const navigate = useNavigate();
    const {
        wishlistItems,
        loading,
        updateItemQuantity,
        removeItem,
        calculateTotal,
        fetchWishlist,
    } = useWishlist();

    const [removing, setRemoving] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchWishlist();
    }, [fetchWishlist]);

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
                return <MdSelfImprovement className="text-2xl text-marigold" />;
            case "chadawa_item":
                return <MdVolunteerActivism className="text-2xl text-marigold" />;
            default:
                return <Sparkles className="text-2xl text-marigold" />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-paper-bg">
                <div className="text-center">
                    <div className="animate-spin h-12 w-12 border-4 border-marigold border-t-sindoor rounded-full mx-auto mb-4"></div>
                    <p className="text-stone-500">Loading your divine wishlist...</p>
                </div>
            </div>
        );
    }

    if (wishlistItems.length === 0) {
        return (
            <div className="min-h-screen bg-paper-bg py-16 px-6">
                <div className="max-w-[800px] mx-auto text-center">
                    <div className="relative mb-8">
                        <div className="w-40 h-40 bg-marigold/10 rounded-full mx-auto flex items-center justify-center">
                            <Heart className="w-20 h-20 text-marigold/50" />
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <Frown className="w-16 h-16 text-sindoor animate-pulse" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-serif text-sindoor mb-4">
                        Your Sacred Wishlist is Empty
                    </h1>
                    <p className="text-stone-500 mb-8 max-w-md mx-auto">
                        Begin your spiritual journey by saving divine poojas and chadawa
                        offerings to your wishlist for future blessings.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate("/poojas")}
                            className="bg-sindoor text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-sindoor/90 transition-all shadow-lg"
                        >
                            <MdSelfImprovement className="text-xl" />
                            Explore Poojas
                        </button>
                        <button
                            onClick={() => navigate("/chadawas")}
                            className="bg-marigold text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-marigold/90 transition-all shadow-lg"
                        >
                            <MdVolunteerActivism className="text-xl" />
                            Explore Chadawa
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-paper-bg pb-32">
            <div className="bg-white border-b border-stone-100 sticky top-0 z-40">
                <div className="max-w-[1280px] mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 hover:bg-stone-100 rounded-full transition-colors"
                            >
                                <ArrowLeft className="text-stone-600 w-6 h-6" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-serif text-sindoor">My Sacred Wishlist</h1>
                                <p className="text-sm text-stone-500">
                                    {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} •
                                    Saved for divine blessings
                                </p>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center gap-2 text-stone-400 text-sm">
                            <ShieldCheck className="w-5 h-5" />
                            Secure & Blessed
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1280px] mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {wishlistItems.map((item) => (
                            <div
                                key={item.id}
                                className={`bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden transition-all ${removing === item.id ? "opacity-50 scale-98" : ""
                                    }`}
                            >
                                <div className="p-6 border-b border-stone-50">
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 bg-marigold/10 rounded-xl flex items-center justify-center shrink-0">
                                            {getProductTypeIcon(item.product_type)}
                                        </div>

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
                                                            <MapPin className="w-4 h-4" />
                                                            Temple #{item.temple_id}
                                                        </p>
                                                    )}
                                                </div>

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

                                <div className="p-4 bg-stone-50/50 flex items-center justify-between">
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
                                                <Minus className="w-4 h-4" />
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
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleRemove(item.id)}
                                        disabled={removing === item.id}
                                        className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                        <span className="text-sm font-medium hidden sm:inline">
                                            Remove
                                        </span>
                                    </button>
                                </div>

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
                                                        <PlusCircle className="text-marigold w-5 h-5" />
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

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 sticky top-32">
                            <div className="p-6 border-b border-stone-100">
                                <h2 className="text-xl font-serif text-sindoor flex items-center gap-2">
                                    <Receipt className="text-marigold w-6 h-6" />
                                    Booking Summary
                                </h2>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="flex justify-between text-stone-600">
                                    <span>Subtotal ({wishlistItems.length} items)</span>
                                    <span className="font-medium">
                                        ₹{calculateTotal().toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex justify-between text-stone-600">
                                    <span>Pandit Dakshina</span>
                                    <span className="text-green-600 font-medium">Included</span>
                                </div>

                                <div className="flex justify-between text-stone-600">
                                    <span>Prasad Delivery</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>

                                <div className="h-px bg-stone-100"></div>

                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-heritage-dark">
                                        Total Dakshina
                                    </span>
                                    <span className="text-2xl font-black text-sindoor">
                                        ₹{calculateTotal().toLocaleString()}
                                    </span>
                                </div>

                                <button
                                    onClick={() => navigate("/booking-checkout")}
                                    className="w-full bg-sindoor text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-sindoor/90 transition-all shadow-lg shadow-sindoor/20 mt-4"
                                >
                                    Proceed to Booking
                                    <ArrowRight className="w-5 h-5" />
                                </button>

                                <div className="grid grid-cols-2 gap-3 mt-6">
                                    <div className="flex items-center gap-2 text-stone-500 text-xs">
                                        <ShieldCheck className="text-green-500 w-5 h-5" />
                                        Secure Payment
                                    </div>
                                    <div className="flex items-center gap-2 text-stone-500 text-xs">
                                        <Truck className="text-marigold w-5 h-5" />
                                        Prasad Delivery
                                    </div>
                                    <div className="flex items-center gap-2 text-stone-500 text-xs">
                                        <Headphones className="text-sindoor w-5 h-5" />
                                        24/7 Support
                                    </div>
                                    <div className="flex items-center gap-2 text-stone-500 text-xs">
                                        <Video className="text-haldi w-5 h-5" />
                                        Live Darshan
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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
                        onClick={() => navigate("/booking-checkout")}
                        className="flex-1 bg-sindoor text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-sindoor/90 transition-all"
                    >
                        Book Now
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
