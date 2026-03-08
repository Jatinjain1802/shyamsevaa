import React, { useEffect, useState } from "react";
import api from "../../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import { generateSlug } from "../../utils/slugify";
import { getAssetUrl } from "../../utils/assets";
import { Search, X, AlertCircle, RefreshCw, ShoppingBag, ArrowRight, Package, IndianRupee } from "lucide-react";
import { MdStorefront } from "react-icons/md";
import { useTranslation } from 'react-i18next';
import toast from "react-hot-toast";

export default function Products() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    // Infinite Scroll state
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 9;
    const observerTarget = React.useRef(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get("/products");
            const data = res.data.data || [];
            setProducts(data);
            setFilteredProducts(data);
        } catch (err) {
            console.error("Failed to load products", err);
            setError(err.response?.data?.message || "Failed to load products. Please try again.");
            setProducts([]);
            setFilteredProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let results = [...products];

        if (searchQuery.trim()) {
            results = results.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedCategory !== "all") {
            results = results.filter(product => product.category === selectedCategory);
        }

        setFilteredProducts(results);
        setPage(1); // Reset page on filter/search change
    }, [searchQuery, selectedCategory, products]);

    // Intersection Observer for Infinite Scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    setPage(prev => prev + 1);
                }
            },
            { threshold: 0.1 }
        );

        const target = observerTarget.current;
        if (target) {
            observer.observe(target);
        }

        return () => {
            if (target) {
                observer.unobserve(target);
            }
        };
    }, [observerTarget]);

    const displayedProducts = filteredProducts.slice(0, page * ITEMS_PER_PAGE);

    const handleOrderNow = (e, product) => {
        e.preventDefault();
        e.stopPropagation();

        navigate("/booking-checkout", {
            state: {
                product: product,
                quantity: 1,
                totalPrice: product.price,
                type: 'product'
            }
        });
    };

    const categories = ["all", ...new Set(products.map(p => p.category).filter(Boolean))];

    const SkeletonCard = () => (
        <div className="bg-white rounded-4xl overflow-hidden shadow-xl border border-stone-100 animate-pulse h-[500px]">
            <div className="h-72 bg-stone-200"></div>
            <div className="p-8">
                <div className="h-6 bg-stone-200 rounded mb-4 w-3/4"></div>
                <div className="h-4 bg-stone-200 rounded mb-3"></div>
                <div className="h-4 bg-stone-200 rounded mb-6 w-5/6"></div>
                <div className="h-12 bg-stone-200 rounded-xl mt-auto"></div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-paper-bg pt-8 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="h-12 bg-stone-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
                        <div className="h-4 bg-stone-200 rounded w-96 mx-auto animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-paper-bg pt-8 pb-12 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="text-red-500 w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-sindoor mb-3 font-serif">{t('common.error')}</h3>
                    <p className="text-stone-600 mb-6 italic">{error}</p>
                    <button
                        onClick={fetchProducts}
                        className="bg-sindoor text-white px-6 py-3 rounded-xl font-bold hover:bg-sindoor/90 transition-all shadow-lg flex items-center gap-2 mx-auto"
                    >
                        <RefreshCw className="w-5 h-5" />
                        {t('common.try_again')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen relative py-12"
            style={{
                backgroundImage: 'url("/images/simple2.jpg")',
                backgroundPosition: 'top center',
                backgroundAttachment: 'fixed'
            }}
        >
            {/* Premium Overlay */}
            <div className="absolute inset-0 bg-marigold-100/30 pointer-events-none"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumbs */}
                <div className="py-4 text-sm text-stone-600 font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
                    <Link to="/" className="hover:text-sindoor transition-colors">{t('nav.home')}</Link>
                    <span className="text-marigold">/</span>
                    <span className="text-sindoor">{t('nav.products')}</span>
                </div>

                {/* Header */}
                <div className="text-center mb-12">
                    <MdStorefront className="text-marigold text-5xl mb-2 mx-auto" />
                    <h1 className="text-4xl md:text-6xl text-heritage-dark mb-4 font-serif font-bold">
                        {t('products_page.title')}
                    </h1>
                    <p className="text-lg text-stone-600 max-w-2xl mx-auto font-sans leading-relaxed">
                        {t('products_page.subtitle')}
                    </p>
                    <div className="w-24 h-1 bg-marigold mx-auto mt-6 rounded-full"></div>
                </div>

                {/* Search and Filters */}
                <div className="mb-12 bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/50">
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="flex-1 w-full relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5 group-focus-within:text-marigold transition-colors" />
                            <input
                                type="text"
                                placeholder={t('products_page.search_placeholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-xl border border-stone-200 bg-white/50 focus:bg-white focus:border-marigold focus:ring-4 focus:ring-marigold/10 outline-none transition-all font-sans text-stone-700"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-sindoor transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {/* Category Filter */}
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-all ${selectedCategory === cat
                                        ? "bg-marigold text-white shadow-lg"
                                        : "bg-white/50 text-stone-600 hover:bg-white hover:text-marigold"
                                        }`}
                                >
                                    {cat === "all" ? "All Items" : cat}
                                </button>
                            ))}
                        </div>

                        <div className="text-sm text-stone-600 font-medium px-4 py-2 bg-marigold/10 rounded-full border border-marigold/20 shrink-0">
                            {t('common.showing')} <span className="text-sindoor font-bold">{filteredProducts.length}</span> {t('common.of')} {products.length} Items
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayedProducts.map((product) => (
                        <Link
                            to={`/product/${generateSlug(product.name, product.id)}`}
                            state={{ id: product.id }}
                            key={product.id}
                            className="group relative bg-white rounded-4xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-marigold/10 transition-all duration-500 hover:-translate-y-2 border border-stone-100 flex flex-col h-full"
                        >
                            {/* Stock Badge */}
                            {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                                <div className="absolute top-4 left-4 z-20 bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider animate-pulse shadow-md">
                                    Only {product.stock_quantity} Left
                                </div>
                            )}
                            {product.stock_quantity === 0 && (
                                <div className="absolute top-4 left-4 z-20 bg-stone-500/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                                    Out of Stock
                                </div>
                            )}

                            {/* Image Container */}
                            <div className="relative aspect-4/3 w-full overflow-hidden shrink-0 bg-stone-50">
                                <img
                                    src={getAssetUrl(product.image_url || product.image)}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>

                            {/* Content */}
                            <div className="relative p-6 sm:p-8 flex flex-col flex-1 bg-white">
                                <div className="absolute -top-7 right-6 sm:right-8 w-14 h-14 bg-marigold rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-sindoor transition-all duration-300 z-10 border-4 border-white">
                                    <ShoppingBag className="text-white w-5 h-5" />
                                </div>

                                <div className="mb-3 flex items-center gap-2 text-stone-500 text-sm font-bold">
                                    <Package className="text-marigold w-5 h-5" />
                                    <span className="capitalize">{product.category || "Sacred Item"}</span>
                                </div>

                                <h3 className="text-2xl font-serif font-black text-heritage-dark mb-2 leading-tight group-hover:text-sindoor transition-colors line-clamp-2">
                                    {product.name}
                                </h3>

                                <p className="text-stone-500 mb-6 line-clamp-2 leading-relaxed text-sm flex-1 font-medium">
                                    {product.description}
                                </p>

                                <div className="mt-auto pt-6 border-t border-stone-100 flex items-center justify-between gap-4">
                                    <div className="flex flex-col shrink-0">
                                        <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1 font-black">Price</p>
                                        <div className="flex items-center gap-1 font-black text-2xl text-sindoor">
                                            <IndianRupee className="w-5 h-5" />
                                            <span>{Number(product.price).toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={(e) => handleOrderNow(e, product)}
                                        disabled={product.stock_quantity === 0}
                                        className={`px-6 py-3.5 rounded-xl font-black transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 whitespace-nowrap ${product.stock_quantity === 0
                                            ? "bg-stone-100 text-stone-400 cursor-not-allowed shadow-none"
                                            : "bg-marigold text-white hover:bg-sindoor hover:shadow-sindoor/30"
                                            }`}
                                    >
                                        <ShoppingBag className="w-5 h-5" />
                                        {product.stock_quantity === 0 ? "Sold Out" : "Order Now"}
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {/* Infinite Scroll Target */}
                    {filteredProducts.length > displayedProducts.length && (
                        <div ref={observerTarget} className="col-span-full py-12 flex items-center justify-center gap-3 text-stone-500 font-bold">
                            <div className="w-6 h-6 border-4 border-sindoor border-t-transparent rounded-full animate-spin"></div>
                            <span>Loading more sacred items...</span>
                        </div>
                    )}
                </div>

                {/* Empty States */}
                {filteredProducts.length === 0 && products.length > 0 && (
                    <div className="text-center py-20 bg-white/60 rounded-[3rem] shadow-sm border border-marigold/30 backdrop-blur-sm">
                        <Search className="text-sindoor w-12 h-12 opacity-30 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-sindoor mb-2 font-serif">{t('products_page.no_results')}</h3>
                        <p className="text-stone-500 font-sans italic mb-6">
                            We couldn't find any sacred items matching "{searchQuery}".
                        </p>
                        <button
                            onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
                            className="text-marigold font-bold hover:underline flex items-center gap-2 mx-auto"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Clear all filters
                        </button>
                    </div>
                )}

                {products.length === 0 && !loading && !error && (
                    <div className="text-center py-20 bg-white/60 rounded-[3rem] shadow-sm border border-marigold/30 backdrop-blur-sm">
                        <Package className="text-sindoor w-12 h-12 opacity-30 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-sindoor mb-2 font-serif">{t('products_page.no_available')}</h3>
                        <p className="text-stone-500 font-sans italic">
                            {t('products_page.updating_listing')}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
