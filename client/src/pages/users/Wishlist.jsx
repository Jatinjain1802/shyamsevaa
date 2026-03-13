import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { getAssetUrl } from "../../utils/assets";
import {
    Heart,
    Frown,
    ArrowLeft,
    MapPin,
    Trash2,
    PlusCircle,
    ShieldCheck,
    Sparkles
} from "lucide-react";
import { MdSelfImprovement, MdVolunteerActivism } from "react-icons/md";
import { slugify, generateSlug } from "../../utils/slugify";

export default function Wishlist() {
    const navigate = useNavigate();
    const {
        wishlistItems,
        loading,
        removeItem,
        fetchWishlist,
    } = useWishlist();

    const [removing, setRemoving] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchWishlist();
    }, [fetchWishlist]);

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
            case "product":
                return "Sacred Product";
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
            case "product":
                return <Sparkles className="text-2xl text-marigold" />;
            default:
                return <Sparkles className="text-2xl text-marigold" />;
        }
    };

    const getItemLink = (item) => {
        const title = item.name || "item";
        switch (item.product_type) {
            case "pooja_variant":
                return `/poojas/${generateSlug(title, item.pooja_id)}`;
            case "chadawa_item":
                return `/chadawas/${generateSlug(title, item.chadawa_id)}`;
            case "product":
                return `/product/${generateSlug(title, item.product_id)}`;
            default:
                return "#";
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
                        <button
                            onClick={() => navigate("/products")}
                            className="bg-haldi text-heritage-dark px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-haldi/90 transition-all shadow-lg"
                        >
                            <Sparkles className="text-xl" />
                            Explore Products
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-paper-bg pb-32">
            <div className="bg-white border-b border-stone-100 sticky top-0 z-40">
                <div className="max-w-4xl mx-auto px-6 py-6 font-serif">
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

            <div className="max-w-3xl mx-auto px-6 py-8">
                <div className="space-y-6">
                    {wishlistItems.map((item) => (
                        <div
                            key={item.id}
                            className={`bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden transition-all hover:shadow-md ${removing === item.id ? "opacity-50 scale-98" : ""
                                }`}
                        >
                            <div className="p-6 border-b border-stone-50">
                                <Link
                                    to={getItemLink(item)}
                                    state={{ id: item.pooja_id || item.chadawa_id || item.product_id }}
                                    className="flex flex-col sm:flex-row items-start sm:items-center gap-6 group/item"
                                >
                                    <div className="w-full sm:w-24 h-48 sm:h-24 bg-marigold/10 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden border border-stone-100 shadow-inner group-hover/item:border-marigold/50 transition-colors">
                                        {item.image ? (
                                            <img
                                                src={getAssetUrl(item.image)}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="p-4 group-hover/item:scale-110 transition-transform">
                                                {getProductTypeIcon(item.product_type)}
                                            </div>
                                        )}
                                    </div>

                                    <div className="grow w-full">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] bg-marigold/10 text-marigold font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded">
                                                        {getProductTypeLabel(item.product_type)}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-bold text-heritage-dark leading-tight group-hover/item:text-sindoor transition-colors">
                                                    {item.name || (item.product_type === "pooja_variant"
                                                        ? `Pooja Variant #${item.pooja_variant_id}`
                                                        : item.product_type === "chadawa_item"
                                                            ? `Chadawa Item #${item.chadawa_item_id}`
                                                            : `Product #${item.product_id}`)}
                                                </h3>
                                                {item.temple_id && (
                                                    <div className="flex items-center gap-1.5 text-stone-400 text-xs font-medium">
                                                        <MapPin className="w-3.5 h-3.5" />
                                                        Divine Location ID: #{item.temple_id}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="sm:text-right bg-paper-bg/50 sm:bg-transparent p-4 sm:p-0 rounded-xl border border-stone-100 sm:border-0 group-hover/item:border-marigold/20 transition-colors">
                                                <p className="text-[10px] text-stone-400 uppercase font-bold tracking-widest mb-1">Base Price</p>
                                                <p className="text-3xl font-black text-sindoor">
                                                    ₹{Number(item.base_price).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            <div className="p-4 bg-stone-50/30 flex items-center justify-center sm:justify-end border-t border-stone-50">
                                <button
                                    onClick={() => handleRemove(item.id)}
                                    disabled={removing === item.id}
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 px-6 py-3 rounded-xl transition-all duration-300 font-bold text-sm border-2 border-transparent hover:border-red-100"
                                >
                                    {removing === item.id ? (
                                        <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <Trash2 className="w-4 h-4" />
                                    )}
                                    Remove from Wishlist
                                </button>
                            </div>

                            {item.addons && item.addons.length > 0 && (
                                <div className="p-4 border-t border-stone-100 bg-haldi/5">
                                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-3 px-2">
                                        Sacred Add-ons
                                    </p>
                                    <div className="space-y-2">
                                        {item.addons.map((addon) => (
                                            <div
                                                key={addon.id}
                                                className="flex items-center justify-between bg-white/60 p-3 rounded-xl border border-stone-100/50"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <PlusCircle className="text-marigold w-4 h-4" />
                                                    <span className="text-sm font-medium text-stone-700">
                                                        {addon.title || `Addon #${addon.addon_id}`}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="font-bold text-sindoor text-sm">
                                                        ₹{Number(addon.price).toLocaleString()}
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
            </div>
        </div>
    );
}
