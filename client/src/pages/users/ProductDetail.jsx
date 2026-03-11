import { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import api from "../../utils/axios";
import { getAssetUrl } from "../../utils/assets";
import { extractIdFromSlug, generateSlug } from "../../utils/slugify";
import {
    ShoppingCart,
    Truck,
    ShieldCheck,
    History,
    Star,
    Share2,
    IndianRupee,
    ChevronRight,
    Home,
    Plus,
    Minus,
    Package,
    CheckCircle,
    MoveRight,
    ShoppingBag
} from "lucide-react";
import toast from "react-hot-toast";
import { useLanguage } from "../../context/LanguageContext";
import { useWishlist } from "../../context/WishlistContext";

// Hero Slideshow Component for Products
const HeroSlideshow = ({ images, title, onShare }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!images || images.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images]);

    if (!images || images.length === 0) return null;

    return (
        <div className="relative w-full h-full rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white group transform transition-all duration-500 hover:shadow-marigold/20 bg-stone-900">
            {images.map((img, idx) => (
                <div
                    key={idx}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-out ${idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                    <img
                        src={getAssetUrl(img)}
                        alt={`${title} - ${idx + 1}`}
                        className={`w-full h-full object-cover transform transition-transform duration-2000 ease-out ${idx === currentIndex ? 'scale-110' : 'scale-100'}`}
                    />
                </div>
            ))}

            <button
                onClick={onShare}
                className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all group z-30"
            >
                <Share2 className="text-sindoor group-hover:scale-110 transition-transform w-5 h-5" />
            </button>

            {images.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30 bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    {images.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${idx === currentIndex ? 'w-6 bg-marigold' : 'w-1.5 bg-white/70'}`}
                            onClick={() => setCurrentIndex(idx)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default function ProductDetail() {
    const { id: slug } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { t, language } = useLanguage();

    // Attempt to get numeric ID: first from state, then from slug
    const [productId, setProductId] = useState(location.state?.id || extractIdFromSlug(slug));

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [similarProducts, setSimilarProducts] = useState([]);

    const getLocalizedField = (obj, field) => {
        if (!obj) return "";
        const hiField = `${field}_hi`;
        return (language === 'hi' && obj[hiField]) ? obj[hiField] : obj[field];
    };

    const fetchProduct = async () => {
        try {
            setLoading(true);

            let finalId = productId;

            // If we don't have an ID yet (manual URL entry), try searching for product by slugified name
            if (!finalId) {
                const resAll = await api.get("/products");
                const found = resAll.data.data.find(p => extractIdFromSlug(generateSlug(p.name, p.id)) === slug || p.id === parseInt(slug));
                if (found) finalId = found.id;
            }

            if (!finalId) {
                toast.error(t('chadawa_detail.not_found'));
                navigate("/products");
                return;
            }

            const res = await api.get(`/products/${finalId}`);
            const prod = res.data.data;
            setProduct(prod);
            setProductId(prod.id);

            // Fetch similar products
            try {
                const allRes = await api.get("/products");
                const others = (allRes.data.data || []).filter(p => String(p.id) !== String(prod.id)).slice(0, 4);
                setSimilarProducts(others);
            } catch (err) {
                console.error("Failed to fetch similar products", err);
            }
        } catch (err) {
            console.error(err);
            toast.error(t('chadawa_detail.not_found'));
            navigate("/products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchProduct();
    }, [slug, productId, language]);

    const handleOrderNow = async () => {
        // Direct checkout flow
        navigate("/booking-checkout", {
            state: {
                product: product,
                quantity: parseInt(quantity),
                totalPrice: product.price * quantity,
                type: 'product'
            }
        });
    };

    const handleShare = async () => {
        const localizedName = getLocalizedField(product, 'name');
        const localizedDesc = getLocalizedField(product, 'description');
        try {
            if (navigator.share) {
                await navigator.share({
                    title: localizedName,
                    text: localizedDesc,
                    url: window.location.href
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success(t('chadawa_detail.link_copied'));
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-paper-bg">
                <div className="text-center">
                    <div className="animate-spin h-16 w-16 border-4 border-marigold border-t-sindoor rounded-full mx-auto mb-4"></div>
                    <p className="text-stone-600 font-sans italic">{t('common.loading')}</p>
                </div>
            </div>
        );
    }

    if (!product) return null;

    const localizedName = getLocalizedField(product, 'name');
    const localizedDesc = getLocalizedField(product, 'description');
    const localizedCat = getLocalizedField(product, 'category');

    return (
        <div className="flex flex-col min-h-screen pb-24 group/page">
            <main className="grow">
                {/* Breadcrumbs */}
                <div className="bg-paper-bg border-b border-marigold/10 py-4">
                    <div className="max-w-[1280px] mx-auto px-6">
                        <nav className="flex items-center gap-2 text-sm text-stone-500 font-bold uppercase tracking-wider">
                            <Link to="/" className="hover:text-sindoor transition-colors flex items-center gap-1">
                                <Home className="w-3 h-3" />
                                {t('nav.home')}
                            </Link>
                            <ChevronRight className="w-3 h-3 text-marigold" />
                            <Link to="/products" className="hover:text-sindoor transition-colors">
                                {t('nav.products')}
                            </Link>
                            <ChevronRight className="w-3 h-3 text-marigold" />
                            <span className="text-sindoor font-bold truncate max-w-xs">{localizedName}</span>
                        </nav>
                    </div>
                </div>

                {/* Hero Section */}
                <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px] border-b border-marigold/10">
                    {/* Image Side */}
                    <div className="relative p-6 lg:p-12 bg-paper-bg h-[450px] md:h-[600px] lg:h-auto flex items-center justify-center">
                        <HeroSlideshow
                            images={product.image_url ? [product.image_url] : [product.image]}
                            title={localizedName}
                            onShare={handleShare}
                        />
                    </div>

                    {/* Details Side */}
                    <div className="p-8 md:p-16 lg:p-24 flex flex-col justify-center bg-white relative overflow-hidden">
                        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'url("/images/diwali-festival-patterned-background.png")', backgroundSize: '300px' }}></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-marigold mb-6 font-bold text-sm tracking-widest uppercase">
                                <Star className="w-4 h-4 fill-current" />
                                {t('product_detail.authentic_offering')}
                                <div className="h-px w-12 bg-marigold/30 ml-2"></div>
                            </div>

                            <h1 className="font-serif text-4xl md:text-6xl text-sindoor mb-6 leading-tight font-black">
                                {localizedName}
                            </h1>

                            <div className="flex items-center gap-4 mb-8">
                                <span className="bg-marigold/10 text-marigold text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full border border-marigold/10">
                                    {localizedCat || t('common.sacred_item')}
                                </span>
                                {product.stock_quantity > 0 ? (
                                    <span className="flex items-center gap-1.5 text-green-600 text-[10px] font-black uppercase tracking-widest bg-green-50 px-3 py-2 rounded-full shadow-sm">
                                        <CheckCircle className="w-3.5 h-3.5" /> {t('common.in_stock')}
                                    </span>
                                ) : (
                                    <span className="bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-full shadow-sm">{t('common.out_of_stock')}</span>
                                )}
                            </div>

                            <p className="text-xl text-stone-600 leading-relaxed max-w-lg mb-12 italic border-l-4 border-marigold/20 pl-6 bg-paper-bg/30 py-4 pr-4 rounded-r-2xl font-serif">
                                {localizedDesc}
                            </p>

                            <div className="flex flex-wrap items-center gap-10 mb-12">
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-black">{t('product_detail.dakshina')}</p>
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-5xl font-black text-sindoor flex items-center">
                                            <IndianRupee className="w-8 h-8 mt-2" />
                                            {Number(product.price).toLocaleString()}
                                        </span>
                                        <span className="text-stone-400 line-through font-bold text-xl font-serif">
                                            ₹{(product.price * 1.25).toFixed(0)}
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-marigold/10 p-5 rounded-3xl border border-marigold/10 shadow-lg shadow-marigold/5">
                                    <p className="text-[10px] uppercase tracking-widest text-marigold mb-0.5 font-black">{t('product_detail.divine_savings')}</p>
                                    <p className="text-2xl font-serif font-black text-heritage-dark text-center">20% {t('product_detail.off')}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-6">
                                <div className="flex items-center bg-stone-50 border-2 border-stone-100 rounded-4xl p-2 self-start ring-4 ring-stone-50/50">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-sm hover:text-sindoor hover:shadow-md transition-all active:scale-95 disabled:opacity-50"
                                        disabled={quantity <= 1}
                                    >
                                        <Minus className="w-5 h-5" />
                                    </button>
                                    <span className="w-14 text-center font-black text-2xl text-heritage-dark">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(q => q + 1)}
                                        className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-sm hover:text-sindoor hover:shadow-md transition-all active:scale-95"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>

                                <button
                                    onClick={handleOrderNow}
                                    disabled={product.stock_quantity === 0}
                                    className={`flex-1 flex items-center justify-center gap-3 px-10 py-5 rounded-4xl font-black text-lg transition-all shadow-xl hover:-translate-y-1 active:scale-95 ${product.stock_quantity === 0
                                        ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                                        : "bg-marigold text-white hover:bg-sindoor hover:shadow-sindoor/20 shadow-marigold/30"
                                        }`}
                                >
                                    <ShoppingBag className="w-6 h-6" />
                                    <span>{product.stock_quantity === 0 ? t('common.sold_out') : t('common.order_now')}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Significance Section */}
                <section className="py-24 px-6 bg-paper-bg relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-b from-white to-transparent pointer-events-none"></div>
                    <div className="max-w-[1280px] mx-auto relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                            <div>
                                <h2 className="text-3xl md:text-5xl text-sindoor font-serif mb-10 flex items-center gap-4 font-black">
                                    <span className="w-12 h-1 bg-marigold rounded-full"></span>
                                    {t('product_detail.sacred_essence')}
                                </h2>
                                <div className="prose prose-stone prose-lg max-w-none">
                                    <p className="text-2xl leading-relaxed mb-8 font-serif italic text-heritage-dark opacity-80">
                                        "{t('product_detail.essence_quote')}"
                                    </p>
                                    <p className="text-stone-600 leading-relaxed text-lg bg-white/50 p-8 rounded-[3rem] border border-marigold/10 shadow-inner">
                                        {localizedDesc}
                                        {localizedDesc.length < 150 && " " + t('product_detail.default_description_extension')}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
                                <div className="absolute -inset-4 bg-marigold/5 rounded-[4rem] blur-3xl -z-10"></div>
                                <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-marigold/10 hover:shadow-2xl hover:-translate-y-2 transition-all group overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-marigold/5 rounded-bl-full transform translate-x-12 -translate-y-12 group-hover:scale-150 transition-transform"></div>
                                    <div className="w-14 h-14 bg-marigold/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-marigold transition-colors relative z-10">
                                        <Truck className="w-7 h-7 text-marigold group-hover:text-white" />
                                    </div>
                                    <h4 className="text-xl font-black mb-3 text-heritage-dark font-serif">{t('product_detail.delivery_title')}</h4>
                                    <p className="text-sm text-stone-500 leading-relaxed font-sans font-medium">{t('product_detail.delivery_desc')}</p>
                                </div>
                                <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-marigold/10 hover:shadow-2xl hover:-translate-y-2 transition-all group overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-marigold/5 rounded-bl-full transform translate-x-12 -translate-y-12 group-hover:scale-150 transition-transform"></div>
                                    <div className="w-14 h-14 bg-marigold/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-marigold transition-colors relative z-10">
                                        <ShieldCheck className="w-7 h-7 text-marigold group-hover:text-white" />
                                    </div>
                                    <h4 className="text-xl font-black mb-3 text-heritage-dark font-serif">{t('product_detail.purity_title')}</h4>
                                    <p className="text-sm text-stone-500 leading-relaxed font-sans font-medium">{t('product_detail.purity_desc')}</p>
                                </div>
                                <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-marigold/10 hover:shadow-2xl hover:-translate-y-2 transition-all group overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-marigold/5 rounded-bl-full transform translate-x-12 -translate-y-12 group-hover:scale-150 transition-transform"></div>
                                    <div className="w-14 h-14 bg-marigold/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-marigold transition-colors relative z-10">
                                        <Package className="w-7 h-7 text-marigold group-hover:text-white" />
                                    </div>
                                    <h4 className="text-xl font-black mb-3 text-heritage-dark font-serif">{t('product_detail.quality_title')}</h4>
                                    <p className="text-sm text-stone-500 leading-relaxed font-sans font-medium">{t('product_detail.quality_desc')}</p>
                                </div>
                                <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-marigold/10 hover:shadow-2xl hover:-translate-y-2 transition-all group overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-marigold/5 rounded-bl-full transform translate-x-12 -translate-y-12 group-hover:scale-150 transition-transform"></div>
                                    <div className="w-14 h-14 bg-marigold/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-marigold transition-colors relative z-10">
                                        <History className="w-7 h-7 text-marigold group-hover:text-white" />
                                    </div>
                                    <h4 className="text-xl font-black mb-3 text-heritage-dark font-serif">{t('product_detail.return_title')}</h4>
                                    <p className="text-sm text-stone-500 leading-relaxed font-sans font-medium">{t('product_detail.return_desc')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Similar Products */}
                {similarProducts.length > 0 && (
                    <section className="py-24 px-6 bg-white overflow-hidden relative">
                        <div className="max-w-[1280px] mx-auto relative z-10">
                            <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
                                <div>
                                    <h2 className="text-3xl md:text-5xl text-sindoor font-serif font-black mb-2">{t('product_detail.related_items')}</h2>
                                    <p className="text-stone-500 font-sans font-bold tracking-widest uppercase text-xs">{t('product_detail.related_tagline')}</p>
                                </div>
                                <Link to="/products" className="bg-marigold/10 text-marigold px-8 py-3 rounded-full font-black flex items-center gap-2 hover:bg-marigold hover:text-white transition-all group shadow-sm">
                                    {t('product_detail.explore_sanctuary')} <MoveRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {similarProducts.map((p) => {
                                    const localizedPName = getLocalizedField(p, 'name');
                                    const localizedPDesc = getLocalizedField(p, 'description');
                                    const localizedPCat = getLocalizedField(p, 'category');

                                    return (
                                        <Link
                                            key={p.id}
                                            to={`/product/${generateSlug(p.name, p.id)}`}
                                            className="group relative bg-white rounded-4xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-marigold/10 transition-all duration-500 hover:-translate-y-2 border border-stone-100 flex flex-col h-full"
                                        >
                                            {/* Image Container */}
                                            <div className="relative aspect-4/3 w-full overflow-hidden shrink-0 bg-stone-50">
                                                <img
                                                    src={getAssetUrl(p.image_url || p.image)}
                                                    alt={localizedPName}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                            </div>

                                            {/* Content */}
                                            <div className="relative p-6 flex flex-col flex-1 bg-white">
                                                <div className="absolute -top-6 right-6 w-12 h-12 bg-marigold rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-sindoor transition-all duration-300 z-10 border-4 border-white">
                                                    <ShoppingBag className="text-white w-5 h-5" />
                                                </div>

                                                <div className="mb-3 flex items-center gap-2 text-stone-500 text-xs font-bold">
                                                    <Package className="text-marigold w-4 h-4" />
                                                    <span className="capitalize">{localizedPCat || t('common.sacred_item')}</span>
                                                </div>

                                                <h3 className="text-lg font-serif font-black text-heritage-dark mb-2 leading-tight group-hover:text-sindoor transition-colors line-clamp-2">
                                                    {localizedPName}
                                                </h3>

                                                <p className="text-stone-500 mb-6 line-clamp-2 leading-relaxed text-xs flex-1 font-medium">
                                                    {localizedPDesc}
                                                </p>

                                                <div className="mt-auto pt-5 border-t border-stone-100 flex items-center justify-between gap-2">
                                                    <div className="flex flex-col shrink-0">
                                                        <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1 font-black">{t('common.price')}</p>
                                                        <div className="flex items-center gap-1 font-black text-lg text-sindoor">
                                                            <IndianRupee className="w-4 h-4" />
                                                            <span>{Number(p.price).toLocaleString()}</span>
                                                        </div>
                                                    </div>

                                                    <button
                                                        disabled={p.stock_quantity === 0}
                                                        className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 whitespace-nowrap ${p.stock_quantity === 0
                                                                ? "bg-stone-100 text-stone-400 cursor-not-allowed shadow-none"
                                                                : "bg-marigold text-white hover:bg-sindoor hover:shadow-sindoor/30"
                                                            }`}
                                                    >
                                                        <ShoppingBag className="w-4 h-4" />
                                                        {p.stock_quantity === 0 ? t('common.sold_out') : t('common.order')}
                                                    </button>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
