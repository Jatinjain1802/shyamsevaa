import { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import api from "../../utils/axios";
import toast from "react-hot-toast";
import { extractIdFromSlug, generateSlug, slugify, generatePureSlug } from "../../utils/slugify"; // LEARNING: Import slug utilities
import { getAssetUrl } from "../../utils/assets";
import { useWishlist } from "../../context/WishlistContext";
import { useLanguage } from "../../context/LanguageContext";
import {
    ChevronRight,
    Home,
    Share2,
    Check,
    CheckCircle,
    AlertCircle,
    Star,
    ArrowRight,
    ArrowLeft,
    Package,
    X,
    MessageSquareQuote,
    MousePointerClick,
    RefreshCw,
    Info,
    AlertTriangle,
    MapPin,
    Receipt,
    ShieldCheck,
    Flower,
    Heart
} from "lucide-react";
import { MdVolunteerActivism, MdTempleHindu } from "react-icons/md";

// LEARNING: Custom hook for toast notifications (Ported from PoojaDetail)
const useToast = () => {
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    return { toasts, showToast };
};

// Hero Slideshow Component (Ported from PoojaDetail)
const HeroSlideshow = ({ gallery, mainImage, title, onShare }) => {
    // Determine images to show: prefer gallery, fallback to mainImage
    const hasGallery = gallery && gallery.length > 0;
    // Ensure we have a standard format for images
    const images = hasGallery
        ? gallery
        : [{ id: 'main', image_url: mainImage }];

    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-play interval
    useEffect(() => {
        if (images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % images.length);
        }, 2500); // 2.5 seconds per slide

        return () => clearInterval(interval);
    }, [images.length]);

    // Touch handling for swipe support
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    // Minimum swipe distance (in px)
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            // Next Slide
            setCurrentIndex(prev => (prev + 1) % images.length);
        }
        if (isRightSwipe) {
            // Previous Slide
            setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
        }
    };

    return (
        <div
            className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white group transform transition-all duration-500 hover:shadow-marigold/20 bg-stone-900"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors duration-500 z-20 pointer-events-none"></div>

            {images.map((img, idx) => (
                <div
                    key={img.id || idx}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-out ${idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                    <img
                        src={getAssetUrl(img.image_url || img.image)} // Handle both gallery object and fallback string/object
                        alt={img.description || title}
                        className={`w-full h-full object-cover transform transition-transform duration-2000 ease-out ${idx === currentIndex ? 'scale-110' : 'scale-100'}`}
                    />
                </div>
            ))}

            {/* Share button */}
            <button
                onClick={onShare}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all group z-30"
                aria-label="Share this offering"
            >
                <Share2 className="text-sindoor group-hover:scale-110 transition-transform w-5 h-5" />
            </button>

            {/* Slide Indicators (only if multiple images) */}
            {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30 bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    {images.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-1 rounded-full transition-all duration-500 cursor-pointer ${idx === currentIndex ? 'w-5 bg-marigold' : 'w-1 bg-white/70'}`}
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering other clicks
                                setCurrentIndex(idx);
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default function ChadawaDetail() {
    const { t, language } = useLanguage();
    // LEARNING: Get slug from URL and extract ID from it
    const { slug } = useParams();
    const location = useLocation();

    // Priority: 1. ID from location state, 2. ID from slug (old links), 3. Finding by slug string later
    const [chadawaId, setChadawaId] = useState(location.state?.id || extractIdFromSlug(slug));

    const navigate = useNavigate();
    const { toasts, showToast } = useToast();
    const { addChadawaToWishlist } = useWishlist();

    const [data, setData] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // LEARNING: Error state for better UX

    // Slider State
    const [currentSlide, setCurrentSlide] = useState(0);
    const itemsPerSlide = 3;

    // LEARNING: Separated fetch function for retry capability
    const fetchDetail = async () => {
        try {
            setLoading(true);
            setError(null);

            let finalId = chadawaId;

            // If we don't have an ID yet (manual URL enter with pure slug)
            if (!finalId) {
                console.log("Looking up chadawa by slug:", slug);
                const resAll = await api.get("/chadawas");
                const found = resAll.data.data.find(c => slugify(c.title) === slug);

                if (found) {
                    finalId = found.id;
                    setChadawaId(found.id);
                }
            }

            if (!finalId) {
                setError("Offering not found. Please check the URL.");
                setLoading(false);
                return;
            }

            const res = await api.get(`/chadawas/${finalId}`);
            setData(res.data.data);
            // Pre-select the first item if available
            if (res.data.data.items && res.data.data.items.length > 0) {
                setSelectedItems([res.data.data.items[0]]);
            }
        } catch (err) {
            console.error("Failed to load chadawa details", err);
            setError(err.response?.data?.message || "Failed to load chadawa details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetail();
        window.scrollTo(0, 0);
    }, [slug, chadawaId]);

    // Auto-slider logic
    useEffect(() => {
        if (!data || !data.benefits || data.benefits.length === 0) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) =>
                (prev + 1) % Math.ceil(data.benefits.length / itemsPerSlide)
            );
        }, 4000);

        return () => clearInterval(interval);
    }, [data]);

    // LEARNING: Skeleton Loading Component matching heritage theme
    const SkeletonLoader = () => (
        <div className="min-h-screen bg-paper-bg pt-8 pb-12">
            <div className="hidden md:block toran-border mb-8"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb skeleton */}
                <div className="h-4 bg-stone-200 rounded w-48 mb-8 animate-pulse"></div>

                {/* Hero skeleton */}
                <div className="bg-white/80 rounded-[3rem] overflow-hidden shadow-xl mb-12 animate-pulse">
                    <div className="flex flex-col md:flex-row gap-8 p-8">
                        <div className="w-full md:w-1/3 h-64 md:h-80 bg-stone-200 rounded-2xl"></div>
                        <div className="flex-1 space-y-4">
                            <div className="h-10 bg-stone-200 rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-stone-200 rounded mb-2"></div>
                            <div className="h-4 bg-stone-200 rounded w-5/6"></div>
                            <div className="h-4 bg-stone-200 rounded w-4/6"></div>
                        </div>
                    </div>
                </div>

                {/* Selection and Summary skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="h-8 bg-stone-200 rounded w-48 animate-pulse"></div>
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-24 bg-stone-200 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                    <div className="lg:col-span-1">
                        <div className="h-80 bg-stone-200 rounded-2xl animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    );

    // LOADING STATE
    if (loading) {
        return <SkeletonLoader />;
    }

    // ERROR STATE with retry functionality
    if (error || !data) {
        return (
            <div className="min-h-screen bg-paper-bg pt-8 pb-12 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="text-red-500 w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-sindoor mb-3 font-serif">
                        {!data ? t('chadawa_detail.not_found') : t('common.error_occurred')}
                    </h3>
                    <p className="text-stone-600 mb-6 italic">
                        {error || t('chadawa_detail.not_found_desc')}
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => navigate("/chadawas")}
                            className="bg-marigold text-white px-6 py-3 rounded-xl font-bold hover:bg-marigold/90 transition-all shadow-lg flex items-center gap-2"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            {t('chadawa_detail.browse_offerings')}
                        </button>
                        {error && (
                            <button
                                onClick={fetchDetail}
                                className="bg-sindoor text-white px-6 py-3 rounded-xl font-bold hover:bg-sindoor/90 transition-all shadow-lg flex items-center gap-2"
                            >
                                <RefreshCw className="w-5 h-5" />
                                {t('chadawa_detail.try_again')}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    const { chadawa, items, benefits, reviews, temples, gallery } = data;

    // Localized fields mapping
    const getLocalizedField = (obj, field) => {
        if (!obj) return "";
        const hiField = `${field}_hi`;
        return (language === 'hi' && obj[hiField]) ? obj[hiField] : obj[field];
    };

    const currentTitle = getLocalizedField(chadawa, 'title');
    const currentDescription = getLocalizedField(chadawa, 'description');

    // Handle Share Functionality
    const handleShare = async () => {
        const shareData = {
            title: currentTitle,
            text: `Check out this divine offering: ${currentTitle}`,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                showToast(t('chadawa_detail.shared_success'), 'success');
            } else {
                await navigator.clipboard.writeText(window.location.href);
                showToast(t('chadawa_detail.link_copied'), 'success');
            }
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Error sharing:', err);
                showToast(t('chadawa_detail.shared_error'), 'error');
            }
        }
    };

    const toggleItem = (item) => {
        setSelectedItems(prev => {
            const exists = prev.find(i => i.id === item.id);
            if (exists) {
                return prev.filter(i => i.id !== item.id);
            }
            return [...prev, item];
        });
    };

    const handleOffering = () => {
        if (selectedItems.length === 0) {
            toast.error(t('chadawa_detail.select_warning'));
            return;
        }
        const totalAmount = selectedItems.reduce((sum, item) => sum + Number(item.price), 0);
        
        // Navigate to booking checkout page with chadawa data
        navigate('/booking-checkout', {
            state: {
                type: 'chadawa',
                chadawa: chadawa,
                selectedItems: selectedItems,
                totalPrice: totalAmount,
                temple_id: temples && temples.length > 0 ? temples[0].id : null
            }
        });
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % Math.ceil(benefits.length / itemsPerSlide));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + Math.ceil(benefits.length / itemsPerSlide)) % Math.ceil(benefits.length / itemsPerSlide));
    };

    const handleAddToWishlist = async () => {
        if (selectedItems.length === 0) {
            showToast(t('chadawa_detail.select_warning'), 'warning');
            return;
        }

        const response = await addChadawaToWishlist({
            chadawa_id: chadawa.id,
            temple_id: temples && temples.length > 0 ? temples[0].id : null,
            items: selectedItems.map(i => ({ chadawa_item_id: i.id, quantity: 1 }))
        });

        if (response.success) {
            showToast(t('chadawa_detail.wishlist_success'), 'success');
        } else {
            showToast(t('chadawa_detail.wishlist_error'), 'error');
        }
    };

    return (
        <div className="min-h-screen bg-paper-bg pt-8 pb-12">
            {/* Decorative Toran Border */}
            <div className="hidden md:block toran-border mb-8"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb Navigation */}
                <div className="py-4 text-sm text-stone-500 font-bold tracking-widest uppercase mb-6 flex items-center gap-2">
                    <Link to="/" className="hover:text-sindoor transition-colors">{t('nav.home')}</Link>
                    <span className="text-marigold">/</span>
                    <Link to="/chadawas" className="hover:text-sindoor transition-colors">{t('nav.offerings')}</Link>
                    <span className="text-marigold">/</span>
                    <span className="text-sindoor truncate max-w-xs">{currentTitle}</span>
                </div>

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 flex items-center gap-2 text-sindoor hover:text-marigold transition-colors font-bold group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    {t('chadawa_detail.back')}
                </button>

                {/* Hero Section */}
                <div className="bg-white/80 backdrop-blur-sm rounded-[3rem] overflow-hidden shadow-2xl border-b-4 border-marigold mb-12">
                    <div className="flex flex-col md:flex-row gap-8 p-6 md:p-10">
                        {/* Image : Left Side */}
                        <div className="w-full md:w-1/3 h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg bg-linear-to-br from-stone-100 to-stone-200 relative group">
                            {(chadawa.image || (gallery && gallery.length > 0)) ? (
                                <HeroSlideshow
                                    gallery={gallery}
                                    mainImage={chadawa.image}
                                    title={currentTitle}
                                    onShare={handleShare}
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-stone-400">
                                    <MdVolunteerActivism className="text-6xl mb-2" />
                                    <p className="text-sm">{t('chadawa_detail.no_image')}</p>
                                </div>
                            )}

                        </div>

                        {/* Content: Right Side */}
                        <div className="flex-1 space-y-6">
                            {/* Title and Description */}
                            <div>
                                <h1 className="text-3xl md:text-5xl text-sindoor mb-4 font-serif flex items-center gap-3">
                                    <MdVolunteerActivism className="text-marigold text-4xl md:text-5xl" />
                                    {currentTitle}
                                </h1>
                                <p className="text-stone-700 leading-relaxed text-base md:text-lg font-sans">
                                    {currentDescription}
                                </p>
                            </div>

                            {/* Available At Temple */}
                            {temples && temples.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <MdTempleHindu className="text-marigold text-sm" />
                                        {t('chadawa_detail.available_at')}
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {temples.map((t_item) => (
                                            <div
                                                key={t_item.id}
                                                className="flex items-center gap-3 bg-paper-bg border-2 border-marigold/20 rounded-xl p-3 pr-5 hover:bg-white hover:border-marigold hover:shadow-lg transition-all cursor-pointer group"
                                                onClick={() => navigate(`/temples/${generatePureSlug(t_item.title)}`, {
                                                    state: { id: t_item.id }
                                                })}
                                            >
                                                <div className="w-10 h-10 rounded-full bg-marigold/20 flex items-center justify-center overflow-hidden border-2 border-marigold/30">
                                                    {t_item.image ? (
                                                        <img src={getAssetUrl(t_item.image)} alt={getLocalizedField(t_item, 'title')} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <MdTempleHindu className="text-marigold text-lg" />
                                                    )}
                                                </div>
                                                <span className="font-bold text-stone-800 text-sm group-hover:text-sindoor transition-colors">{getLocalizedField(t_item, 'title')}</span>
                                                <ArrowRight className="text-stone-400 group-hover:text-marigold transition-colors w-4 h-4" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
                    {/* LEFT: Selection */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-2xl md:text-3xl text-sindoor mb-6 flex items-center font-serif">
                                <span className="bg-sindoor text-white w-10 h-10 rounded-full flex items-center justify-center text-lg mr-4 shadow-lg">1</span>
                                {t('chadawa_detail.select_offering')}
                            </h2>

                            <div className="space-y-4">
                                {items.length > 0 ? (
                                    items.map((item) => {
                                        const isSelected = selectedItems.some(i => i.id === item.id);
                                        return (
                                            <div
                                                key={item.id}
                                                onClick={() => toggleItem(item)}
                                                className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex items-center justify-between group
                                            ${isSelected
                                                        ? "border-sindoor bg-sindoor/5 ring-2 ring-sindoor/20 shadow-lg"
                                                        : "border-stone-200 bg-white/80 hover:border-marigold hover:shadow-md"}`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-sindoor bg-sindoor' : 'border-stone-300 group-hover:border-marigold'}`}>
                                                        {isSelected && <Check className="text-white w-4 h-4" />}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-stone-900 text-lg">{getLocalizedField(item, 'title')}</h3>
                                                        <p className="text-stone-500 text-sm">{getLocalizedField(item, 'description')}</p>
                                                    </div>
                                                </div>
                                                <div className={`text-xl font-bold transition-colors ${isSelected ? 'text-sindoor' : 'text-stone-700'}`}>
                                                    ₹{Number(item.price).toLocaleString()}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-12 bg-white/60 rounded-4xl shadow-sm border border-marigold/30 backdrop-blur-sm">
                                        <div className="w-16 h-16 bg-paper-bg rounded-full flex items-center justify-center mx-auto mb-4 text-sindoor text-2xl border border-marigold/20">
                                            <Package className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-xl font-bold text-sindoor mb-2 font-serif">{t('chadawa_detail.no_items')}</h3>
                                        <p className="text-stone-500 font-sans italic">
                                            {t('chadawa_detail.no_items_desc')}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Reviews Section */}
                        {reviews && reviews.length > 0 && (
                            <div className="pt-8 border-t-2 border-marigold/20">
                                <h2 className="text-2xl md:text-3xl text-sindoor mb-6 font-serif flex items-center gap-3">
                                    <MessageSquareQuote className="text-marigold w-8 h-8" />
                                    {t('chadawa_detail.devotee_experiences')}
                                </h2>
                                <div className="grid gap-4">
                                    {reviews.map((r_rev, idx) => (
                                        <div key={idx} className="bg-white/80 p-5 rounded-2xl shadow-sm border border-marigold/20 hover:shadow-md transition-all">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 rounded-full bg-sindoor/10 flex items-center justify-center text-sindoor font-bold text-sm border-2 border-sindoor/20">
                                                    {r_rev.user_name?.[0] || 'D'}
                                                </div>
                                                <div className="flex-1">
                                                    <span className="font-bold text-stone-800">{r_rev.user_name || 'Devotee'}</span>
                                                    <div className="flex items-center gap-1 text-marigold">
                                                        {[...Array(r_rev.rating || 5)].map((_, i) => (
                                                            <Star key={i} className="w-4 h-4 fill-current" />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-stone-600 leading-relaxed italic">"{r_rev.comment}"</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Summary - Sticky Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-white/90 backdrop-blur-sm rounded-4xl shadow-2xl border-2 border-marigold/30 overflow-hidden">
                            {/* Header */}
                            <div className="bg-linear-to-r from-sindoor to-sindoor/90 text-white p-6">
                                <h3 className="font-bold text-xl font-serif flex items-center gap-2">
                                    <Receipt className="w-6 h-6" />
                                    {t('chadawa_detail.offering_summary')}
                                </h3>
                            </div>

                            <div className="p-6">
                                {/* Selected Items Display */}
                                <div className="mb-6">
                                    <p className="text-xs text-stone-500 uppercase font-bold tracking-widest mb-3 flex items-center gap-2">
                                        <CheckCircle className="text-marigold w-4 h-4" />
                                        {t('chadawa_detail.selected_items')} ({selectedItems.length})
                                    </p>

                                    {selectedItems.length > 0 ? (
                                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-marigold/20">
                                            {selectedItems.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-start bg-paper-bg p-3 rounded-xl border border-marigold/20">
                                                    <span className="font-medium text-stone-900 text-sm">{getLocalizedField(item, 'title')}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-sindoor text-sm">₹{Number(item.price).toLocaleString()}</span>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleItem(item);
                                                            }}
                                                            className="text-stone-400 hover:text-red-500"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-stone-400 italic text-sm p-4 bg-stone-50 rounded-xl border border-dashed border-stone-200">
                                            {t('chadawa_detail.select_items')}
                                        </p>
                                    )}
                                </div>

                                {/* Total */}
                                <div className="pt-4 border-t-2 border-dashed border-marigold/30 mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-stone-900">{t('chadawa_detail.total_contribution')}</span>
                                        <span className="text-3xl font-bold text-sindoor">
                                            ₹{selectedItems.reduce((sum, i) => sum + Number(i.price), 0).toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleAddToWishlist}
                                        disabled={selectedItems.length === 0}
                                        className="bg-white border-2 border-marigold/30 text-marigold p-4 rounded-xl hover:bg-marigold/10 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Add to Wishlist"
                                    >
                                        <Heart className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={handleOffering}
                                        disabled={selectedItems.length === 0}
                                        className={`flex-1 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-2
                                    ${selectedItems.length > 0
                                                ? "bg-linear-to-r from-sindoor to-sindoor/90 text-white hover:from-sindoor/90 hover:to-sindoor"
                                                : "bg-stone-200 text-stone-400 cursor-not-allowed"}`}
                                    >
                                        {selectedItems.length > 0 ? <MdVolunteerActivism className="w-6 h-6" /> : <MousePointerClick className="w-6 h-6" />}
                                        {selectedItems.length > 0 ? t('chadawa_detail.make_offering_now') : t('chadawa_detail.select_items')}
                                    </button>
                                </div>

                                {/* Trust Badge */}
                                <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                                    <div className="flex items-start gap-3">
                                        <ShieldCheck className="text-green-600 w-5 h-5" />
                                        <p className="text-xs text-green-800 leading-relaxed">
                                            {t('chadawa_detail.trust_badge_desc')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* KEY BENEFITS - SLIDER SECTION */}
                {benefits && benefits.length > 0 && (
                    <div className="mb-16 bg-white/60 backdrop-blur-sm rounded-[3rem] p-8 md:p-12 shadow-lg border border-marigold/20">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl md:text-4xl text-sindoor font-serif flex items-center gap-3">
                                <Flower className="text-marigold w-10 h-10" />
                                {t('chadawa_detail.spiritual_benefits')}
                            </h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={prevSlide}
                                    className="p-3 rounded-full border-2 border-stone-200 hover:bg-sindoor hover:border-sindoor hover:text-white transition-all shadow-sm"
                                    aria-label="Previous slide"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="p-3 rounded-full border-2 border-stone-200 hover:bg-sindoor hover:border-sindoor hover:text-white transition-all shadow-sm"
                                    aria-label="Next slide"
                                >
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="overflow-hidden">
                            <div
                                className="flex transition-transform duration-500 ease-in-out"
                                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                            >
                                {Array.from({ length: Math.ceil(benefits.length / itemsPerSlide) }).map((_, slideIndex) => (
                                    <div key={slideIndex} className="min-w-full grid grid-cols-1 md:grid-cols-3 gap-6 px-1">
                                        {benefits.slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide).map((b, idx) => (
                                            <div
                                                key={idx}
                                                className="bg-white border-2 border-marigold/20 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:bg-sindoor hover:border-sindoor hover:text-white transition-all duration-300 group cursor-default"
                                            >
                                                <div className="w-14 h-14 bg-marigold/20 rounded-full flex items-center justify-center mb-6 text-marigold group-hover:bg-white/20 group-hover:text-white transition-colors">
                                                    <CheckCircle className="w-8 h-8" />
                                                </div>
                                                <h3 className="text-xl font-bold text-stone-900 mb-3 group-hover:text-white transition-colors font-serif">
                                                    {getLocalizedField(b, 'title')}
                                                </h3>
                                                <p className="text-stone-600 leading-relaxed group-hover:text-white/90 transition-colors">
                                                    {getLocalizedField(b, 'description')}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Dots Navigation */}
                        <div className="flex justify-center gap-2 mt-8">
                            {Array.from({ length: Math.ceil(benefits.length / itemsPerSlide) }).map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentSlide(idx)}
                                    className={`h-2.5 rounded-full transition-all duration-300 ${currentSlide === idx ? 'bg-sindoor w-10' : 'bg-stone-300 w-2.5 hover:bg-marigold'}`}
                                    aria-label={`Go to slide ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
