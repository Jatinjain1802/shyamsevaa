import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../utils/axios";
import { extractIdFromSlug, generateSlug } from "../../utils/slugify"; // LEARNING: Import slug utilities

// LEARNING: Custom hook for toast notifications
// This is a simple implementation - in production, use libraries like react-hot-toast or react-toastify
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

export default function PoojaDetail() {
    // LEARNING: Get slug from URL and extract ID from it
    const { slug } = useParams();  // Changed from 'poojaId' to 'slug'
    const poojaId = extractIdFromSlug(slug);  // Extract numeric ID from slug

    const navigate = useNavigate();
    const { toasts, showToast } = useToast();

    // STATE MANAGEMENT
    const [data, setData] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedAddons, setSelectedAddons] = useState([]);
    const [similarPoojas, setSimilarPoojas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [similarLoading, setSimilarLoading] = useState(true);

    // LEARNING: useEffect with dependency array [poojaId]
    // This runs when component mounts AND when poojaId changes
    useEffect(() => {
        window.scrollTo(0, 0);
        fetchPoojaDetails();
        fetchSimilarPoojas();
    }, [poojaId]);

    // LEARNING: Separate async functions for better error handling and reusability
    const fetchPoojaDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get(`/poojas/${poojaId}`);
            setData(res.data.data);

            // Auto-select first variant if available
            if (res.data.data.variants && res.data.data.variants.length > 0) {
                setSelectedVariant(res.data.data.variants[0]);
            }
        } catch (err) {
            console.error("Failed to load pooja details", err);
            setError(err.response?.data?.message || "Failed to load pooja details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fetchSimilarPoojas = async () => {
        try {
            setSimilarLoading(true);
            const res = await api.get("/poojas");
            if (res.data.data) {
                const others = res.data.data.filter(p => p.id !== poojaId).slice(0, 4);
                setSimilarPoojas(others);
            }
        } catch (err) {
            console.error("Failed to load similar poojas", err);
            // Don't show error for similar poojas - it's not critical
        } finally {
            setSimilarLoading(false);
        }
    };

    // LOADING STATE
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-paper-bg">
                <div className="text-center">
                    <div className="animate-spin h-16 w-16 border-4 border-marigold border-t-sindoor rounded-full mx-auto mb-4"></div>
                    <p className="text-stone-600 font-sans italic">Loading divine details...</p>
                </div>
            </div>
        );
    }

    // ERROR STATE
    if (error || !data) {
        return (
            <div className="min-h-screen bg-paper-bg pt-8 pb-12 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-red-500 text-4xl">error</span>
                    </div>
                    <h3 className="text-2xl font-bold text-sindoor mb-3 font-serif">Unable to Load Pooja Details</h3>
                    <p className="text-stone-600 mb-6 italic">{error || "Pooja not found"}</p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={fetchPoojaDetails}
                            className="bg-sindoor text-white px-6 py-3 rounded-xl font-bold hover:bg-sindoor/90 transition-all shadow-lg flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined">refresh</span>
                            Try Again
                        </button>
                        <button
                            onClick={() => navigate('/poojas')}
                            className="bg-stone-200 text-stone-700 px-6 py-3 rounded-xl font-bold hover:bg-stone-300 transition-all flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                            Back to Poojas
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const { pooja, variants, addons, temples } = data;

    const toggleAddon = (addon) => {
        const exists = selectedAddons.find((a) => a.id === addon.id);
        if (exists) {
            setSelectedAddons(selectedAddons.filter((a) => a.id !== addon.id));
        } else {
            setSelectedAddons([...selectedAddons, addon]);
        }
    };

    const totalPrice = () => {
        let total = selectedVariant ? Number(selectedVariant.price) : 0;
        selectedAddons.forEach((a) => {
            total += Number(a.price);
        });
        return total;
    };

    // LEARNING: Better UX with toast notifications instead of alerts
    const handleBookNow = (e) => {
        e.preventDefault();

        // Validation with user-friendly feedback
        if (!selectedVariant) {
            showToast("Please select a Sankalp option to proceed.", 'warning');
            // Scroll to variants section
            document.getElementById('variants-section')?.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        // Navigate to booking checkout page with all data
        navigate('/booking-checkout', {
            state: {
                pooja: pooja,
                selectedVariant: selectedVariant,
                selectedAddons: selectedAddons,
                totalPrice: totalPrice()
            }
        });
    };

    // LEARNING: Share functionality using Web Share API
    const handleShare = async () => {
        const shareData = {
            title: pooja.title,
            text: `Check out this divine pooja: ${pooja.title}`,
            url: window.location.href
        };

        try {
            // Check if Web Share API is supported
            if (navigator.share) {
                await navigator.share(shareData);
                showToast('Shared successfully!', 'success');
            } else {
                // Fallback: Copy to clipboard
                await navigator.clipboard.writeText(window.location.href);
                showToast('Link copied to clipboard!', 'success');
            }
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Error sharing:', err);
                showToast('Failed to share', 'error');
            }
        }
    };

    // Placeholder images for addons if missing 
    const addonImages = [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC99gj6xmNd98QZXOJVhoPhk_1tZScKwWdEdYyDyi7lxR9HJd599UcHXecmpP8BEgZ3A8-oX0GCerssFDnm0gv3zoYdB_U4XrChcFTubtihPUcnhsX0wZxY6-smWxpF2r-t5edVJx4jrxIrcy9mS4xmCZ4GYOvHcBLZMcJMo1A-hoYOw9LFGDtsFjivGQyBH5nhindi2s-gL_vnLeYrGxc7_KNuevPIT5Ap4yUCgDEx_fKh7Eq34o6eda2WfRfIMwAL1J2aMHINaRw",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDAvg-e-B9R7ohFqwAeL3xE3UMlnCfUCStPXoVHf1P83XcWUBUMRD1PqBgZVu8G9TCEviFCAPFFGPYKR6OAwHfUfqZOHoATkcrHRLGUXCq5Ic9eWfPW5I7XAZrfpVOIEvSFjrbSzN92xuJBi9KhRuug61-B-62QmmR-EMQxfVaXYV_uTffyZxUxvxL9IKC6OWdj7694k17Z1FQy-PwQcKRDpynOkmKRVPEGOYibq3oit-SVGFhrMecWz7BfxRZV3rlwmX-pJyV5eog",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCGJ-e_FDEwhf8whXyzLxIv7gQbXK2cDpm9ufV_Nv93ekvlfOc7jTDbZt3xUKidZFm4adzgxW7V5FsdTrItCDM1ipywE-2YbjSwTJjVPFB3jy4afaqchX8VnCeEjzdkKbjvC-0Vlj_lpom2N02KdkhIQgtTOdHSqv4eQhRPofwZxU_FI9nA7V1k19knLFdynPp5z0GGmF1beHcvKCEmGTBoRkLzDweYZyovM6qBlqKUqnM6b_raGRMjoUgHytLkK1y6c3Hplbmtzrs",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA-z2Wisab7QkOJODO0IfzwBu6fxh9u29pfaXrxZi921BoZ6n87X2VlQ1YazvHKqamnQ662qrvCcn0QJOWFBGoUfhQHazaJsBpX1BXYiHAEpmk1rLKvg2zyujPQXNACPXPkPr0h7Zjw7d4G_I_JzGqZSpyvnkQIkT5Xa6EI6PR-j-HyOLAhzW8en9SKxUCt9rFdxXvj9b1cpc0RDijIIzH8aHvMdqJ_13jqRIqArRKg57m-d0COaAZttJ2qQl-Fr5LJWjG0QmYWEBk"
    ];

    return (
        <div className="flex flex-col min-h-screen pb-24">
            {/* LEARNING: Toast Notifications Component */}
            {/* Position fixed to show notifications on top of everything */}
            <div className="fixed top-20 right-4 z-[70] space-y-2">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`px-6 py-3 rounded-xl shadow-lg backdrop-blur-sm animate-slide-in-right flex items-center gap-3 ${toast.type === 'success' ? 'bg-green-500 text-white' :
                            toast.type === 'error' ? 'bg-red-500 text-white' :
                                toast.type === 'warning' ? 'bg-yellow-500 text-white' :
                                    'bg-blue-500 text-white'
                            }`}
                    >
                        <span className="material-symbols-outlined">
                            {toast.type === 'success' ? 'check_circle' :
                                toast.type === 'error' ? 'error' :
                                    toast.type === 'warning' ? 'warning' : 'info'}
                        </span>
                        {toast.message}
                    </div>
                ))}
            </div>

            <main className="flex-grow">
                {/* LEARNING: Breadcrumb Navigation for better UX */}
                <div className="bg-paper-bg border-b border-marigold/10 py-4">
                    <div className="max-w-[1280px] mx-auto px-6">
                        <nav className="flex items-center gap-2 text-sm text-stone-500 font-medium" aria-label="Breadcrumb">
                            <Link to="/" className="hover:text-sindoor transition-colors flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">home</span>
                                Home
                            </Link>
                            <span className="material-symbols-outlined text-xs">chevron_right</span>
                            <Link to="/poojas" className="hover:text-sindoor transition-colors">
                                Poojas
                            </Link>
                            <span className="material-symbols-outlined text-xs">chevron_right</span>
                            <span className="text-sindoor font-bold truncate max-w-xs">{pooja.title}</span>
                        </nav>
                    </div>
                </div>

                {/* Hero Section - Split Layout */}
                <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px] border-b border-marigold/10">
                    {/* Image Gallery Side */}
                    <div className="relative overflow-hidden bg-stone-200 h-[500px] lg:h-auto">
                        <img
                            alt={pooja.title}
                            className="w-full h-full object-cover transition-opacity duration-500"
                            src={pooja.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuA-oMjsjkReCjtyX1Q9OGUDrV1Rwy4IqHQUhvT-oRth2nHDItC8vZC1XQCL2MyqWYxK76p2yXIlsvbuWEekZkXsTPAgfvPduVatgtizyG3LNuqbx9LNTW8yo60LfNZhHL8JqrUo4x56GsnZ6bOH33LF8HgjY-zuwAiVFkXLWSlHRdzy6cVwf0BnWmN35bcMTZ18F3K1NuXZEeb4jqA_kmptUhqAziVdlxpPLSymxAoBDIUTpvRQi93MrOwdyF8xhi2vv1Drp4djgXs"}
                        />
                        {/* LEARNING: Share button overlay */}
                        <button
                            onClick={handleShare}
                            className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all group"
                            aria-label="Share this pooja"
                        >
                            <span className="material-symbols-outlined text-sindoor group-hover:scale-110 transition-transform">share</span>
                        </button>
                    </div>

                    {/* Details Side */}
                    <div className="p-12 lg:p-20 flex flex-col justify-center bg-white relative">
                        <div className="absolute inset-0 mandala-bg opacity-5 pointer-events-none"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-marigold mb-4 font-bold text-sm tracking-widest uppercase">
                                <span className="material-symbols-outlined text-lg">star</span>
                                Most Revered Ritual
                            </div>
                            <h1 className="font-serif text-5xl md:text-6xl text-sindoor mb-4 leading-tight">
                                {pooja.title}
                            </h1>
                            {temples && temples.length > 0 && (
                                <div className="flex items-center gap-3 text-stone-500 mb-8 border-l-2 border-marigold pl-4">
                                    <span className="material-symbols-outlined text-marigold">location_on</span>
                                    <span className="text-xl font-medium">{temples[0].title}</span>
                                </div>
                            )}
                            <p className="text-lg text-stone-600 leading-relaxed max-w-lg mb-10 italic">
                                {pooja.description || "Invoke the blessings of the divine for prosperity, wisdom, and the removal of all obstacles in your life's journey."}
                            </p>
                            <div className="flex items-center gap-8">
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Dakshina from</p>
                                    <p className="text-4xl font-black text-sindoor">
                                        ₹{variants.length > 0 ? Number(variants[0].price).toLocaleString() : "1,101"}
                                    </p>
                                </div>
                                <div className="h-12 w-px bg-stone-200"></div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Next Muhurat</p>
                                    <p className="text-xl font-bold text-heritage-dark">Available Daily</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Sacred Significance */}
                <section className="py-24 px-6 bg-paper-bg">
                    <div className="max-w-[1280px] mx-auto">
                        <div className="flex flex-col md:flex-row gap-16 items-start">
                            <div className="w-full md:w-1/2">
                                <h2 className="text-4xl text-sindoor font-serif mb-8 flex items-center gap-4">
                                    <span className="w-12 h-px bg-marigold"></span>
                                    Sacred Significance
                                </h2>
                                <p className="text-lg text-stone-700 leading-relaxed mb-6">
                                    {pooja.description || "This sacred ritual is performed with strict Vedic protocols to invoke divine blessings and spiritual power. Worshipping at the start of any new venture ensures the removal of karmic hurdles and brings prosperity to your household."}
                                </p>
                                <p className="text-lg text-stone-700 leading-relaxed">
                                    The ritual involves traditional chanting and sacred offerings, creating a powerful spiritual vibration that resonates within the devotee's life.
                                </p>
                            </div>
                            <div className="w-full md:w-1/2">
                                <h2 className="text-4xl text-sindoor font-serif mb-8 flex items-center gap-4">
                                    Blessings & Fruits
                                    <span className="w-12 h-px bg-marigold"></span>
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { icon: 'local_florist', title: 'Vighna Nashak', desc: 'Removal of all unseen obstacles and hurdles in life.' },
                                        { icon: 'savings', title: 'Riddhi Siddhi', desc: 'Attraction of wealth, wisdom, and overall prosperity.' },
                                        { icon: 'home', title: 'Griha Shanti', desc: 'Spiritual purification of the home and family bonds.' },
                                        { icon: 'psychology', title: 'Buddhi Vardhak', desc: 'Enhanced intellectual capacity and decision making.' },
                                    ].map((item, idx) => (
                                        <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-marigold/10 flex flex-col items-center text-center hover:shadow-md transition-all">
                                            <span className="material-symbols-outlined text-marigold text-4xl mb-4">{item.icon}</span>
                                            <h4 className="font-bold text-sindoor mb-2">{item.title}</h4>
                                            <p className="text-sm text-stone-500">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Choose Participation */}
                {/* LEARNING: ID attribute for smooth scrolling from validation */}
                <section id="variants-section" className="py-24 px-6 bg-white">
                    <div className="max-w-[1280px] mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl text-sindoor font-serif mb-4">Choose Participation</h2>
                            <p className="text-stone-500">Select the number of devotees to be included in the Sankalp</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {variants.map((variant, idx) => {
                                const isSelected = selectedVariant?.id === variant.id;
                                const isMiddle = idx === 1;
                                return (
                                    <div
                                        key={variant.id}
                                        onClick={() => setSelectedVariant(variant)}
                                        className={`relative p-8 rounded-3xl border-2 cursor-pointer transition-all group ${isSelected
                                            ? 'border-sindoor bg-sindoor/5'
                                            : 'border-stone-100 hover:border-marigold/50'
                                            }`}
                                    >
                                        {isSelected && (
                                            <div className="absolute top-4 right-4 text-sindoor">
                                                <span className="material-symbols-outlined text-3xl">check_circle</span>
                                            </div>
                                        )}
                                        {isMiddle && !isSelected && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-marigold text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                                                Most Chosen
                                            </div>
                                        )}
                                        <span className="material-symbols-outlined text-4xl text-marigold mb-4">
                                            {variant.persons > 2 ? 'groups' : (variant.persons === 2 ? 'favorite' : 'person')}
                                        </span>
                                        <h4 className="text-xl font-bold mb-2">{variant.title}</h4>
                                        <p className="text-sm text-stone-500 mb-6">
                                            {variant.description || "Personalized Vedic ritual with complete Sankalp"}
                                        </p>
                                        <div className="text-3xl font-black text-sindoor mb-1">₹{Number(variant.price).toLocaleString()}</div>
                                        <p className="text-[10px] uppercase text-stone-400 tracking-wider">Personalized Seva</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Sacred Offerings */}
                {addons && addons.length > 0 && (
                    <section className="py-24 px-6 bg-paper-bg">
                        <div className="max-w-[1280px] mx-auto">
                            <div className="flex items-center justify-between mb-16">
                                <div>
                                    <h2 className="text-4xl text-sindoor font-serif mb-2">Sacred Offerings (Chadawa)</h2>
                                    <p className="text-stone-500">Enhance your ritual with these traditional offerings</p>
                                </div>
                                <div className="hidden md:block h-px flex-grow mx-10 bg-marigold/20"></div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                                {addons.map((addon, i) => {
                                    const isSelected = selectedAddons.find(a => a.id === addon.id);
                                    return (
                                        <div
                                            key={addon.id}
                                            className={`bg-white p-4 rounded-2xl shadow-sm border flex flex-col items-center group transition-all ${isSelected ? 'border-marigold bg-marigold/5' : 'border-stone-100'
                                                }`}
                                        >
                                            <div className="w-full aspect-square rounded-xl overflow-hidden mb-4 bg-stone-100 flex items-center justify-center relative">
                                                {addon.images?.[0] ? (
                                                    <img className="w-full h-full object-cover group-hover:scale-110 transition-transform" src={addon.images[0]} alt={addon.title} />
                                                ) : (
                                                    <img className="w-full h-full object-cover group-hover:scale-110 transition-transform" src={addonImages[i % addonImages.length]} alt={addon.title} />
                                                )}
                                                {isSelected && (
                                                    <div className="absolute top-1 right-1 bg-marigold text-white rounded-full p-0.5">
                                                        <span className="material-symbols-outlined text-xs">done</span>
                                                    </div>
                                                )}
                                            </div>
                                            <h5 className="text-sm font-bold text-heritage-dark mb-1 text-center">{addon.title}</h5>
                                            <p className="text-xs text-stone-400 mb-3 text-center">
                                                {addon.description ? (addon.description.length > 20 ? addon.description.substring(0, 20) + "..." : addon.description) : "Sacred offering"} • ₹{Number(addon.price).toLocaleString()}
                                            </p>
                                            <button
                                                onClick={() => toggleAddon(addon)}
                                                className={`w-full py-2 rounded-lg flex items-center justify-center transition-all ${isSelected
                                                    ? 'bg-sindoor text-white'
                                                    : 'bg-stone-50 hover:bg-marigold hover:text-white'
                                                    }`}
                                            >
                                                <span className="material-symbols-outlined text-lg">{isSelected ? 'remove' : 'add'}</span>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                )}

                {/* Booking Form Section */}
                {/* Temple Venue Showcase */}
                {/* LEARNING: Using actual temple data from API instead of hardcoded values */}
                {temples && temples.length > 0 && (
                    <section className="py-24 px-6 bg-white">
                        <div className="max-w-[1280px] mx-auto">
                            <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-stone-200">
                                <div className="grid grid-cols-1 lg:grid-cols-2">
                                    {/* Temple Image */}
                                    <div className="h-[400px] md:h-auto relative">
                                        <img
                                            alt={temples[0].title}
                                            className="w-full h-full object-cover"
                                            src={temples[0].image || "https://lh3.googleusercontent.com/aida-public/AB6AXuCNKQD_nvQc4mh-teWAdK6Q5iVGF9dwO-syFh8kptR5ynYxEd18m7mGdjdsp6iMEhUqbGggTgwkmYl6CNCwGXexErLDC6PgaivNRf_35hoVMTjhEMPDzfQK5VJxJ56y3wHN_sb3LiTHHm11674jLnidEZlqOvEzbLOFIo4Su7xhJiyL1IWUyXbN0I_rkhOqC1yKOdxM8jg5T4ZYCDHUBlWXmZIgOdWRrSkcMMFjATg-EIOyUsOlNa-MgMJXSviTWk4K48hwyaZJkx0"}
                                        />
                                        {/* LEARNING: Combining city and state fields for location display */}
                                        {(temples[0].city || temples[0].state) && (
                                            <div className="absolute top-8 left-8 bg-sindoor text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-2xl">
                                                <span className="material-symbols-outlined">location_on</span>
                                                <span className="text-xs font-bold uppercase tracking-[0.2em]">
                                                    {/* LEARNING: Conditional string building - combine city and state if both exist */}
                                                    {temples[0].city && temples[0].state
                                                        ? `${temples[0].city}, ${temples[0].state}`
                                                        : temples[0].city || temples[0].state
                                                    }
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Temple Details */}
                                    <div className="p-10 md:p-16 flex flex-col justify-center bg-white">
                                        <div className="flex items-center gap-3 mb-8">
                                            <span className="material-symbols-outlined text-4xl text-sindoor">home_storage</span>
                                            <h3 className="text-3xl text-sindoor m-0 uppercase tracking-wide font-serif">TEMPLE VENUE</h3>
                                        </div>

                                        <h4 className="text-2xl text-marigold mb-5 font-bold">{temples[0].title}</h4>

                                        {/* LEARNING: Check multiple possible field names for description */}
                                        {/* Backend might use 'description', 'desc', 'about', or 'details' */}
                                        {(temples[0].description || temples[0].desc || temples[0].about || temples[0].details) && (
                                            <p className="text-stone-600 leading-relaxed mb-8 italic border-l-2 border-haldi pl-6">
                                                {temples[0].description || temples[0].desc || temples[0].about || temples[0].details}
                                            </p>
                                        )}

                                        {/* LEARNING: Conditional rendering - only show metadata if it exists */}
                                        {(temples[0].established || temples[0].ritual_style || temples[0].founded_year || temples[0].tradition) && (
                                            <div className="grid grid-cols-2 gap-6">
                                                {/* Show "Established" if data exists */}
                                                {(temples[0].established || temples[0].founded_year) && (
                                                    <div className="bg-haldi/5 p-5 rounded-2xl border border-haldi/10">
                                                        <h6 className="text-sindoor font-bold text-sm mb-1 uppercase tracking-wider">Established</h6>
                                                        <p className="text-stone-500 text-sm italic">
                                                            {temples[0].established || temples[0].founded_year}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Show "Ritual Style" if data exists */}
                                                {(temples[0].ritual_style || temples[0].tradition) && (
                                                    <div className="bg-haldi/5 p-5 rounded-2xl border border-haldi/10">
                                                        <h6 className="text-sindoor font-bold text-sm mb-1 uppercase tracking-wider">Ritual Style</h6>
                                                        <p className="text-stone-500 text-sm italic">
                                                            {temples[0].ritual_style || temples[0].tradition}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Stories of Devotion */}
                <section className="bg-heritage-dark py-24 relative overflow-hidden">
                    <div className="absolute inset-0 mandala-bg opacity-10"></div>
                    <div className="max-w-[1280px] mx-auto px-6 relative z-10 text-center">
                        <h3 className="text-4xl text-haldi font-serif mb-16">Stories of Devotion</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {[
                                { name: "Rajesh Khanna", loc: "Mumbai", text: "The Pandit ji was very knowledgeable and explained every mantra. It felt as if we were in a grand temple right at our home. Highly recommended!", initials: "RK" },
                                { name: "Sneha Iyer", loc: "Bengaluru", text: "Booked for my parents' anniversary. The arrangements for Samagri were perfect. The modaks were fresh and delicious. Extremely satisfied.", initials: "SI" },
                                { name: "Amit Sharma", loc: "Delhi", text: "Divine experience. Digital booking made it so easy. The live Sankalp through video call was very emotional and spiritual for us.", initials: "AS" }
                            ].map((t, idx) => (
                                <div key={idx} className="text-left group">
                                    <p className="text-stone-300 italic mb-6 text-lg group-hover:text-white transition-colors">
                                        "{t.text}"
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-marigold flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                                            {t.initials}
                                        </div>
                                        <div>
                                            <p className="text-white font-bold">{t.name}</p>
                                            <p className="text-xs text-stone-500 uppercase tracking-widest">{t.loc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Similar Poojas */}
                <section className="py-24 px-6 bg-paper-bg">
                    <div className="max-w-[1280px] mx-auto">
                        <div className="flex items-end justify-between mb-16">
                            <div>
                                <h3 className="text-4xl text-sindoor uppercase tracking-wide mb-3 font-serif">Similar Sacred Poojas</h3>
                                <div className="h-1 w-24 bg-marigold"></div>
                            </div>
                            <button onClick={() => navigate('/poojas')} className="text-marigold font-bold flex items-center gap-2 hover:gap-4 transition-all tracking-widest text-xs uppercase">
                                View All Sevas <span className="material-symbols-outlined">arrow_right_alt</span>
                            </button>
                        </div>

                        {/* LEARNING: Conditional rendering - show skeleton while loading */}
                        {similarLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-stone-100 animate-pulse">
                                        <div className="h-52 bg-stone-200"></div>
                                        <div className="p-6">
                                            <div className="h-6 bg-stone-200 rounded mb-3"></div>
                                            <div className="h-4 bg-stone-200 rounded mb-6 w-3/4"></div>
                                            <div className="flex justify-between items-center">
                                                <div className="h-6 bg-stone-200 rounded w-20"></div>
                                                <div className="h-4 bg-stone-200 rounded w-16"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {similarPoojas.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => {
                                            navigate(`/poojas/${item.id}`);
                                            window.scrollTo(0, 0);
                                        }}
                                        className="bg-white rounded-3xl overflow-hidden shadow-lg border border-stone-100 hover:border-marigold transition-all group cursor-pointer"
                                    >
                                        <div className="h-52 relative overflow-hidden">
                                            <img
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                src={item.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuAF-AmO5J7i7qBRyubRd6pU8NlefSUtbOUer8TKkIUpNodXdMGSEJeQ1czPjsD4R46L6miPZHVBBlser3Wz6FJ-zRcf8kR_QbfQK34GmnUo6pAWYzQXqnosQmxn1LGeWuKZmo6oGMkM3xWUTV_gBVGrL-nzStMFBkKQ2WUmjIFNypcJsTgH4ZQzDKeOUn6eZKFoSl2moEF3rcyP0gQK3NdRIawD4LT6J4N7kicYnT-JVjPaXSbGWszDQgvnUd0-vUAER8gzo1pb-UI"}
                                            />
                                            <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-[10px] font-black text-sindoor uppercase">
                                                Trending
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h4 className="text-xl text-sindoor mb-2 font-serif line-clamp-1">{item.title}</h4>
                                            <p className="text-xs text-stone-500 mb-6 italic line-clamp-1">
                                                {item.description || "Divine puja service"}
                                            </p>
                                            <div className="flex justify-between items-center border-t border-stone-100 pt-4">
                                                <span className="text-xl font-black text-sindoor">
                                                    ₹{item.variants?.[0]?.price ? Number(item.variants[0].price).toLocaleString() : "1,101"}
                                                </span>
                                                <button className="text-marigold font-bold text-sm hover:underline">EXPLORE</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Sticky Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-[60] bg-white border-t border-stone-200 py-4 px-6 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)]">
                <div className="max-w-[1280px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-widest text-stone-500 font-bold mb-1">Selected Seva</span>
                            <span className="text-heritage-dark font-bold flex items-center gap-2">
                                {pooja.title} ({selectedVariant ? selectedVariant.title : "Select Variant"})
                            </span>
                        </div>
                        <div className="h-10 w-px bg-stone-200 hidden sm:block"></div>
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-widest text-stone-500 font-bold mb-1">Total Dakshina</span>
                            <span className="text-2xl font-black text-sindoor">₹{totalPrice().toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden lg:flex items-center gap-2 text-stone-400 text-xs italic">
                            <span className="material-symbols-outlined text-sm">verified_user</span>
                            Secure payment gateway
                        </div>
                        <button
                            onClick={handleBookNow}
                            className="bg-sindoor text-white px-8 md:px-10 py-3 md:py-4 rounded-2xl font-black tracking-widest shadow-lg shadow-sindoor/20 hover:bg-sindoor/90 transition-all flex items-center gap-3"
                        >
                            PROCEED TO BOOK
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
