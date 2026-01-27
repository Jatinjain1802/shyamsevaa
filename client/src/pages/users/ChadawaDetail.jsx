import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/axios";
import { FiCheck, FiHeart, FiArrowRight, FiArrowLeft } from "react-icons/fi";

export default function ChadawaDetail() {
    const { chadawaId } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(true);

    // Slider State
    const [currentSlide, setCurrentSlide] = useState(0);
    const itemsPerSlide = 3;

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await api.get(`/chadawas/${chadawaId}`);
                setData(res.data.data);
                // Pre-select the first item if available
                if (res.data.data.items && res.data.data.items.length > 0) {
                    setSelectedItem(res.data.data.items[0]);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

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


    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
    );

    if (!data) return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-gray-500 font-medium text-lg">Chadawa not found</p>
        </div>
    );

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
        <div className="bg-gray-50 min-h-screen pb-20 pt-20">
            {/* Hero Header */}
            <div className="bg-white shadow-sm mb-10">
                <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Image : Left Side */}
                        <div className="w-full md:w-1/3 h-64 md:h-80 rounded-2xl overflow-hidden shadow-md bg-gray-100 relative group">
                            {chadawa.image ? (
                                <img
                                    src={chadawa.image}
                                    alt={chadawa.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    No Image
                                </div>
                            )}
                            <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-full text-orange-600 shadow-sm">
                                <FiHeart className="w-6 h-6 fill-current" />
                            </div>
                        </div>

                        {/* Content: Right Side */}
                        <div className="flex-1 space-y-8">

                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 font-serif">
                                    {chadawa.title}
                                </h1>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    {chadawa.description}
                                </p>
                            </div>

                            {/* Available At Temple */}
                            {temples && temples.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                                        AVAILABLE AT TEMPLE
                                    </h3>
                                    <div className="flex flex-wrap gap-4">
                                        {temples.map((t) => (
                                            <div key={t.id} className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3 pr-6 hover:bg-white hover:shadow-sm transition-all cursor-pointer" onClick={() => navigate(`/temples/${t.id}`)}>
                                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden">
                                                    {/* Start of temple image logic - if available, otherwise fallback */}
                                                    {t.image ? (
                                                        <img src={t.image} alt={t.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="text-xs font-bold text-orange-600">{t.title[0]}</div>
                                                    )}
                                                </div>
                                                <span className="font-bold text-gray-800 text-sm">{t.title}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Key Benefits REMOVED from here as per request */}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">

                    {/* LEFT: Selection */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                <span className="bg-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">1</span>
                                Select Your Offering
                            </h2>

                            <div className="space-y-4">
                                {items.length > 0 ? (
                                    items.map((item) => (
                                        <div
                                            key={item.id}
                                            onClick={() => setSelectedItem(item)}
                                            className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center justify-between
                                            ${selectedItem?.id === item.id
                                                    ? "border-orange-500 bg-orange-50 ring-1 ring-orange-200"
                                                    : "border-gray-200 bg-white hover:border-gray-300"}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedItem?.id === item.id ? 'border-orange-600 bg-orange-600' : 'border-gray-300'}`}>
                                                    {selectedItem?.id === item.id && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
                                                    <p className="text-gray-500 text-sm">{item.description}</p>
                                                </div>
                                            </div>
                                            <div className="text-xl font-bold text-gray-900">
                                                ₹{Number(item.price).toLocaleString()}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-gray-500 italic p-6 bg-white rounded-xl border border-dashed text-center">
                                        No specific items listed for this offering yet.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Reviews Section Placeholder */}
                        {reviews && reviews.length > 0 && (
                            <div className="pt-8 border-t border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Devotee Experiences</h2>
                                <div className="grid gap-4">
                                    {reviews.map((r, idx) => (
                                        <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">
                                                    {r.user_name?.[0] || 'D'}
                                                </div>
                                                <span className="font-bold text-sm">{r.user_name || 'Devotee'}</span>
                                                <span className="text-yellow-400 text-xs">{'⭐'.repeat(r.rating || 5)}</span>
                                            </div>
                                            <p className="text-gray-600 text-sm">{r.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                            <div className="bg-linear-to-r from-gray-900 to-gray-800 text-white p-5">
                                <h3 className="font-bold text-lg">Offering Summary</h3>
                            </div>

                            <div className="p-6">
                                <div className="mb-6">
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Selected Item</p>
                                    {selectedItem ? (
                                        <div className="flex justify-between items-start">
                                            <span className="font-medium text-gray-900">{selectedItem.title}</span>
                                            <span className="font-bold">₹{Number(selectedItem.price).toLocaleString()}</span>
                                        </div>
                                    ) : (
                                        <p className="text-gray-400 italic text-sm">Please select an item</p>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-dashed border-gray-200 mb-6 flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-900">Total Contribution</span>
                                    <span className="text-2xl font-bold text-orange-600">
                                        ₹{selectedItem ? Number(selectedItem.price).toLocaleString() : '0'}
                                    </span>
                                </div>

                                <button
                                    onClick={handleOffering}
                                    disabled={!selectedItem}
                                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transfom active:scale-95
                                    ${selectedItem
                                            ? "bg-linear-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700"
                                            : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                                >
                                    {selectedItem ? "Make Offering Now" : "Select an Item"}
                                </button>

                                <p className="text-xs text-center text-gray-400 mt-4 leading-relaxed">
                                    Your offering will be processed securely. You will receive a confirmation and digital receipt.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* KEY BENEFITS - SLIDER SECTION (New Placement) */}
                {benefits && benefits.length > 0 && (
                    <div className="mb-16">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 font-serif">
                                Spiritual Benefits
                            </h2>
                            <div className="flex gap-2">
                                <button onClick={prevSlide} className="p-2 rounded-full border border-gray-300 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 transition-colors">
                                    <FiArrowLeft />
                                </button>
                                <button onClick={nextSlide} className="p-2 rounded-full border border-gray-300 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 transition-colors">
                                    <FiArrowRight />
                                </button>
                            </div>
                        </div>

                        <div className="overflow-hidden">
                            <div
                                className="flex transition-transform duration-500 ease-in-out"
                                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                            >
                                {/* We chunk benefits into slides or just map them 100% / 3 width. 
                                    Better approach for responsive:
                                    Use grid with fixed widths or flex with basis. 
                                    To simplify sliding logic with translateX(-100% * slide), we group them into pages.
                                */}
                                {Array.from({ length: Math.ceil(benefits.length / itemsPerSlide) }).map((_, slideIndex) => (
                                    <div key={slideIndex} className="min-w-full grid grid-cols-1 md:grid-cols-3 gap-6 px-1">
                                        {benefits.slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide).map((b, idx) => (
                                            <div
                                                key={idx}
                                                className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:bg-orange-600 hover:text-white transition-all duration-300 group cursor-default"
                                            >
                                                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-6 text-orange-600 group-hover:bg-white/20 group-hover:text-white transition-colors">
                                                    <FiCheck className="w-6 h-6" />
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-white transition-colors">
                                                    {b.title}
                                                </h3>
                                                <p className="text-gray-600 leading-relaxed group-hover:text-orange-50 transition-colors">
                                                    {b.description}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Dots */}
                        <div className="flex justify-center gap-2 mt-6">
                            {Array.from({ length: Math.ceil(benefits.length / itemsPerSlide) }).map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentSlide(idx)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all ${currentSlide === idx ? 'bg-orange-600 w-8' : 'bg-gray-300'}`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
