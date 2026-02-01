import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../utils/axios";
import { extractIdFromSlug, generateSlug } from "../../utils/slugify"; // LEARNING: Import slug utilities

export default function ChadawaDetail() {
    // LEARNING: Get slug from URL and extract ID from it
    const { slug } = useParams();  // Changed from 'chadawaId' to 'slug'
    const chadawaId = extractIdFromSlug(slug);  // Extract numeric ID from slug

    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
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
            const res = await api.get(`/chadawas/${chadawaId}`);
            setData(res.data.data);
            // Pre-select the first item if available
            if (res.data.data.items && res.data.data.items.length > 0) {
                setSelectedItem(res.data.data.items[0]);
            }
        } catch (err) {
            console.error("Failed to load chadawa details", err);
            setError(err.response?.data?.message || "Failed to load chadawa details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // LEARNING: Only fetch if we have a valid ID
        if (!chadawaId) {
            setError("Invalid chadawa URL");
            setLoading(false);
            return;
        }

        fetchDetail();
        window.scrollTo(0, 0);
    }, [chadawaId]);

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
                        <span className="material-symbols-outlined text-red-500 text-4xl">error</span>
                    </div>
                    <h3 className="text-2xl font-bold text-sindoor mb-3 font-serif">
                        {!data ? "Chadawa Not Found" : "Oops! Something went wrong"}
                    </h3>
                    <p className="text-stone-600 mb-6 italic">
                        {error || "The chadawa you're looking for doesn't exist or has been removed."}
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => navigate("/chadawas")}
                            className="bg-marigold text-white px-6 py-3 rounded-xl font-bold hover:bg-marigold/90 transition-all shadow-lg flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                            Browse Chadawas
                        </button>
                        {error && (
                            <button
                                onClick={fetchDetail}
                                className="bg-sindoor text-white px-6 py-3 rounded-xl font-bold hover:bg-sindoor/90 transition-all shadow-lg flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined">refresh</span>
                                Try Again
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    const { chadawa, items, benefits, reviews, temples } = data;

    const handleOffering = () => {
        if (!selectedItem) {
            alert("Please select an offering item.");
            return;
        }
        alert(`Proceeding to offer ${selectedItem.title} for ₹${selectedItem.price}`);
        // Implementation for checkout navigation would go here
        // navigate('/checkout', { state: { type: 'chadawa', ... } })
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % Math.ceil(benefits.length / itemsPerSlide));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + Math.ceil(benefits.length / itemsPerSlide)) % Math.ceil(benefits.length / itemsPerSlide));
    };

    return (
        <div className="min-h-screen bg-paper-bg pt-8 pb-12">
            {/* Decorative Toran Border */}
            <div className="hidden md:block toran-border mb-8"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* LEARNING: Breadcrumb Navigation for better UX */}
                <div className="py-4 text-sm text-stone-500 font-bold tracking-widest uppercase mb-6 flex items-center gap-2">
                    <Link to="/" className="hover:text-sindoor transition-colors">Home</Link>
                    <span className="text-marigold">/</span>
                    <Link to="/chadawas" className="hover:text-sindoor transition-colors">Chadawas</Link>
                    <span className="text-marigold">/</span>
                    <span className="text-sindoor truncate max-w-xs">{chadawa.title}</span>
                </div>

                {/* Back Button - Mobile Friendly */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 flex items-center gap-2 text-sindoor hover:text-marigold transition-colors font-bold group"
                >
                    <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    Back
                </button>

                {/* LEARNING: Hero Section with Heritage Design */}
                <div className="bg-white/80 backdrop-blur-sm rounded-[3rem] overflow-hidden shadow-2xl border-b-4 border-marigold mb-12">
                    <div className="flex flex-col md:flex-row gap-8 p-6 md:p-10">
                        {/* Image : Left Side */}
                        <div className="w-full md:w-1/3 h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg bg-linear-to-br from-stone-100 to-stone-200 relative group">
                            {chadawa.image ? (
                                <img
                                    src={chadawa.image}
                                    alt={chadawa.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-stone-400">
                                    <span className="material-symbols-outlined text-6xl mb-2">volunteer_activism</span>
                                    <p className="text-sm">No Image Available</p>
                                </div>
                            )}
                            {/* Favorite Button */}
                            <div className="absolute top-4 right-4 bg-white/90 p-3 rounded-full text-sindoor shadow-lg hover:bg-sindoor hover:text-white transition-all cursor-pointer">
                                <span className="material-symbols-outlined">favorite</span>
                            </div>
                        </div>

                        {/* Content: Right Side */}
                        <div className="flex-1 space-y-6">
                            {/* Title and Description */}
                            <div>
                                <h1 className="text-3xl md:text-5xl text-sindoor mb-4 font-serif flex items-center gap-3">
                                    <span className="material-symbols-outlined text-marigold text-4xl md:text-5xl">volunteer_activism</span>
                                    {chadawa.title}
                                </h1>
                                <p className="text-stone-700 leading-relaxed text-base md:text-lg font-sans">
                                    {chadawa.description}
                                </p>
                            </div>

                            {/* Available At Temple */}
                            {temples && temples.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-marigold text-sm">temple_hindu</span>
                                        AVAILABLE AT TEMPLE
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {temples.map((t) => (
                                            // LEARNING: Using slug for temple navigation
                                            <div
                                                key={t.id}
                                                className="flex items-center gap-3 bg-paper-bg border-2 border-marigold/20 rounded-xl p-3 pr-5 hover:bg-white hover:border-marigold hover:shadow-lg transition-all cursor-pointer group"
                                                onClick={() => navigate(`/temples/${generateSlug(t.title, t.id)}`)}
                                            >
                                                <div className="w-10 h-10 rounded-full bg-marigold/20 flex items-center justify-center overflow-hidden border-2 border-marigold/30">
                                                    {/* Start of temple image logic - if available, otherwise fallback */}
                                                    {t.image ? (
                                                        <img src={t.image} alt={t.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="material-symbols-outlined text-marigold text-lg">temple_hindu</span>
                                                    )}
                                                </div>
                                                <span className="font-bold text-stone-800 text-sm group-hover:text-sindoor transition-colors">{t.title}</span>
                                                <span className="material-symbols-outlined text-stone-400 group-hover:text-marigold transition-colors text-sm">arrow_forward</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Decorative Divider */}
                            <div className="flex items-center gap-3 pt-2">
                                <div className="garland-decoration"></div>
                                <div className="garland-decoration"></div>
                                <div className="garland-decoration"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">

                    {/* LEFT: Selection */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-2xl md:text-3xl text-sindoor mb-6 flex items-center font-serif">
                                <span className="bg-sindoor text-white w-10 h-10 rounded-full flex items-center justify-center text-lg mr-4 shadow-lg">1</span>
                                Select Your Offering
                            </h2>

                            <div className="space-y-4">
                                {items.length > 0 ? (
                                    items.map((item) => (
                                        <div
                                            key={item.id}
                                            onClick={() => setSelectedItem(item)}
                                            className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex items-center justify-between group
                                            ${selectedItem?.id === item.id
                                                    ? "border-sindoor bg-sindoor/5 ring-2 ring-sindoor/20 shadow-lg"
                                                    : "border-stone-200 bg-white/80 hover:border-marigold hover:shadow-md"}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${selectedItem?.id === item.id ? 'border-sindoor bg-sindoor' : 'border-stone-300 group-hover:border-marigold'}`}>
                                                    {selectedItem?.id === item.id && <span className="material-symbols-outlined text-white text-sm">check</span>}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-stone-900 text-lg">{item.title}</h3>
                                                    <p className="text-stone-500 text-sm">{item.description}</p>
                                                </div>
                                            </div>
                                            <div className={`text-xl font-bold transition-colors ${selectedItem?.id === item.id ? 'text-sindoor' : 'text-stone-700'}`}>
                                                ₹{Number(item.price).toLocaleString()}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 bg-white/60 rounded-4xl shadow-sm border border-marigold/30 backdrop-blur-sm">
                                        <div className="w-16 h-16 bg-paper-bg rounded-full flex items-center justify-center mx-auto mb-4 text-sindoor text-2xl border border-marigold/20">
                                            <span className="material-symbols-outlined">inventory_2</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-sindoor mb-2 font-serif">No Items Listed</h3>
                                        <p className="text-stone-500 font-sans italic">
                                            No specific items listed for this offering yet.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Reviews Section */}
                        {reviews && reviews.length > 0 && (
                            <div className="pt-8 border-t-2 border-marigold/20">
                                <h2 className="text-2xl md:text-3xl text-sindoor mb-6 font-serif flex items-center gap-3">
                                    <span className="material-symbols-outlined text-marigold">reviews</span>
                                    Devotee Experiences
                                </h2>
                                <div className="grid gap-4">
                                    {reviews.map((r, idx) => (
                                        <div key={idx} className="bg-white/80 p-5 rounded-2xl shadow-sm border border-marigold/20 hover:shadow-md transition-all">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 rounded-full bg-sindoor/10 flex items-center justify-center text-sindoor font-bold text-sm border-2 border-sindoor/20">
                                                    {r.user_name?.[0] || 'D'}
                                                </div>
                                                <div className="flex-1">
                                                    <span className="font-bold text-stone-800">{r.user_name || 'Devotee'}</span>
                                                    <div className="flex items-center gap-1 text-marigold">
                                                        {[...Array(r.rating || 5)].map((_, i) => (
                                                            <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-stone-600 leading-relaxed italic">"{r.comment}"</p>
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
                                    <span className="material-symbols-outlined">receipt_long</span>
                                    Offering Summary
                                </h3>
                            </div>

                            <div className="p-6">
                                {/* Selected Item Display */}
                                <div className="mb-6">
                                    <p className="text-xs text-stone-500 uppercase font-bold tracking-widest mb-3 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-marigold text-sm">check_circle</span>
                                        Selected Item
                                    </p>
                                    {selectedItem ? (
                                        <div className="flex justify-between items-start bg-paper-bg p-4 rounded-xl border border-marigold/20">
                                            <span className="font-medium text-stone-900">{selectedItem.title}</span>
                                            <span className="font-bold text-sindoor">₹{Number(selectedItem.price).toLocaleString()}</span>
                                        </div>
                                    ) : (
                                        <p className="text-stone-400 italic text-sm p-4 bg-stone-50 rounded-xl border border-dashed border-stone-200">Please select an item from the list</p>
                                    )}
                                </div>

                                {/* Total */}
                                <div className="pt-4 border-t-2 border-dashed border-marigold/30 mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-stone-900">Total Contribution</span>
                                        <span className="text-3xl font-bold text-sindoor">
                                            ₹{selectedItem ? Number(selectedItem.price).toLocaleString() : '0'}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <button
                                    onClick={handleOffering}
                                    disabled={!selectedItem}
                                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-2
                                    ${selectedItem
                                            ? "bg-linear-to-r from-sindoor to-sindoor/90 text-white hover:from-sindoor/90 hover:to-sindoor"
                                            : "bg-stone-200 text-stone-400 cursor-not-allowed"}`}
                                >
                                    <span className="material-symbols-outlined">{selectedItem ? 'volunteer_activism' : 'touch_app'}</span>
                                    {selectedItem ? "Make Offering Now" : "Select an Item"}
                                </button>

                                {/* Trust Badge */}
                                <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                                    <div className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-green-600">verified_user</span>
                                        <p className="text-xs text-green-800 leading-relaxed">
                                            Your offering will be processed securely. You will receive a confirmation and digital receipt via email.
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
                                <span className="material-symbols-outlined text-marigold text-4xl">spa</span>
                                Spiritual Benefits
                            </h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={prevSlide}
                                    className="p-3 rounded-full border-2 border-stone-200 hover:bg-sindoor hover:border-sindoor hover:text-white transition-all shadow-sm"
                                    aria-label="Previous slide"
                                >
                                    <span className="material-symbols-outlined">arrow_back</span>
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="p-3 rounded-full border-2 border-stone-200 hover:bg-sindoor hover:border-sindoor hover:text-white transition-all shadow-sm"
                                    aria-label="Next slide"
                                >
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </button>
                            </div>
                        </div>

                        <div className="overflow-hidden">
                            <div
                                className="flex transition-transform duration-500 ease-in-out"
                                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                            >
                                {/* LEARNING: We chunk benefits into slides
                                    To simplify sliding logic with translateX(-100% * slide), we group them into pages.
                                */}
                                {Array.from({ length: Math.ceil(benefits.length / itemsPerSlide) }).map((_, slideIndex) => (
                                    <div key={slideIndex} className="min-w-full grid grid-cols-1 md:grid-cols-3 gap-6 px-1">
                                        {benefits.slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide).map((b, idx) => (
                                            <div
                                                key={idx}
                                                className="bg-white border-2 border-marigold/20 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:bg-sindoor hover:border-sindoor hover:text-white transition-all duration-300 group cursor-default"
                                            >
                                                <div className="w-14 h-14 bg-marigold/20 rounded-full flex items-center justify-center mb-6 text-marigold group-hover:bg-white/20 group-hover:text-white transition-colors">
                                                    <span className="material-symbols-outlined text-2xl">check_circle</span>
                                                </div>
                                                <h3 className="text-xl font-bold text-stone-900 mb-3 group-hover:text-white transition-colors font-serif">
                                                    {b.title}
                                                </h3>
                                                <p className="text-stone-600 leading-relaxed group-hover:text-white/90 transition-colors">
                                                    {b.description}
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
