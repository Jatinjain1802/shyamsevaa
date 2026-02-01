import { useEffect, useState } from "react";
import api from "../../utils/axios";
import { Link } from "react-router-dom";
// Removed unused imports: FiCalendar, FiClock - Always clean up unused imports to reduce bundle size
import { generateSlug } from "../../utils/slugify"; // LEARNING: Import slug utility

import UnifiedCard from "../../components/common/UnifiedCard";

export default function Poojas() {
    // STATE MANAGEMENT
    // Multiple state variables to handle different aspects of the component
    const [poojas, setPoojas] = useState([]); // All poojas from API
    const [filteredPoojas, setFilteredPoojas] = useState([]); // Filtered results
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Error state for better UX
    const [searchQuery, setSearchQuery] = useState(""); // Search functionality
    const [selectedCategory, setSelectedCategory] = useState("all"); // Category filter

    // LEARNING: useEffect hook runs after component renders
    // The empty dependency array [] means it runs only once when component mounts
    useEffect(() => {
        fetchPoojas();
    }, []);

    // LEARNING: Separate function for API calls makes code more maintainable
    // This can be reused for retry functionality
    const fetchPoojas = async () => {
        try {
            setLoading(true);
            setError(null); // Reset error state before new request

            const res = await api.get("/poojas");
            const data = res.data.data || [];
            setPoojas(data);
            setFilteredPoojas(data); // Initialize filtered poojas
        } catch (err) {
            console.error("Failed to load poojas", err);
            // LEARNING: Proper error handling improves UX
            setError(err.response?.data?.message || "Failed to load poojas. Please try again.");
            setPoojas([]);
            setFilteredPoojas([]);
        } finally {
            // LEARNING: finally block always executes, perfect for cleanup
            setLoading(false);
        }
    };

    // LEARNING: useEffect for filtering - runs whenever dependencies change
    // This pattern separates concerns: data fetching vs data filtering
    useEffect(() => {
        let results = [...poojas];

        // Filter by search query
        if (searchQuery.trim()) {
            results = results.filter(pooja =>
                pooja.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pooja.description?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by category (if your API provides categories)
        if (selectedCategory !== "all") {
            results = results.filter(pooja => pooja.category === selectedCategory);
        }

        setFilteredPoojas(results);
    }, [searchQuery, selectedCategory, poojas]); // Re-run when any of these change

    // LEARNING: Skeleton Loading Component
    // Shows placeholder cards while data loads - better UX than just a spinner
    const SkeletonCard = () => (
        <div className="bg-white rounded-t-[40px] rounded-b-xl overflow-hidden shadow-xl border-b-4 border-stone-200 animate-pulse">
            <div className="h-64 bg-stone-200"></div>
            <div className="p-6">
                <div className="h-6 bg-stone-200 rounded mb-3 w-3/4"></div>
                <div className="h-4 bg-stone-200 rounded mb-2"></div>
                <div className="h-4 bg-stone-200 rounded mb-2 w-5/6"></div>
                <div className="h-10 bg-stone-200 rounded-xl mt-4"></div>
            </div>
        </div>
    );

    // LOADING STATE with skeleton cards
    if (loading) {
        return (
            <div className="min-h-screen bg-paper-bg pt-8 pb-12">
                <div className="hidden md:block toran-border mb-8"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header skeleton */}
                    <div className="text-center mb-16">
                        <div className="h-12 bg-stone-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
                        <div className="h-4 bg-stone-200 rounded w-96 mx-auto animate-pulse"></div>
                    </div>
                    {/* Skeleton cards grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
                    </div>
                </div>
            </div>
        );
    }

    // ERROR STATE with retry functionality
    if (error) {
        return (
            <div className="min-h-screen bg-paper-bg pt-8 pb-12 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-red-500 text-4xl">error</span>
                    </div>
                    <h3 className="text-2xl font-bold text-sindoor mb-3 font-serif">Oops! Something went wrong</h3>
                    <p className="text-stone-600 mb-6 italic">{error}</p>
                    <button
                        onClick={fetchPoojas}
                        className="bg-sindoor text-white px-6 py-3 rounded-xl font-bold hover:bg-sindoor/90 transition-all shadow-lg flex items-center gap-2 mx-auto"
                    >
                        <span className="material-symbols-outlined">refresh</span>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-paper-bg pt-8 pb-12">
            <div className="hidden md:block toran-border mb-8"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Breadcrumb */}
                <div className="py-4 text-sm text-stone-500 font-bold tracking-widest uppercase mb-4">
                    <Link to="/" className="hover:text-sindoor transition-colors">Home</Link>
                    <span className="mx-2 text-marigold">/</span>
                    <span className="text-sindoor">Poojas</span>
                </div>

                {/* Header Section */}
                <div className="text-center mb-12">
                    <span className="material-symbols-outlined text-marigold text-5xl mb-2">self_improvement</span>
                    <h1 className="text-4xl md:text-5xl text-sindoor mb-4 font-serif">
                        Divine Poojas & Rituals
                    </h1>
                    <p className="text-lg text-stone-600 max-w-2xl mx-auto font-sans italic">
                        Book sacred poojas performed by experienced pandits at renowned temples.
                        Experience spiritual upliftment and divine blessings from the comfort of your home.
                    </p>
                    <div className="w-24 h-1 bg-marigold mx-auto mt-6 rounded-full"></div>
                </div>

                {/* LEARNING: Search and Filter Section */}
                {/* Controlled components: value is tied to state, onChange updates state */}
                <div className="mb-12 bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-marigold/20">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        {/* Search Bar */}
                        <div className="flex-1 w-full relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
                                search
                            </span>
                            <input
                                type="text"
                                placeholder="Search poojas by name or description..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-stone-200 focus:border-marigold focus:outline-none transition-colors font-sans"
                                aria-label="Search poojas"
                            />
                            {/* LEARNING: Clear button - only show when there's text */}
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-sindoor transition-colors"
                                    aria-label="Clear search"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            )}
                        </div>

                        {/* Category Filter - Uncomment when backend supports categories */}
                        {/* <div className="w-full md:w-auto">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full md:w-48 px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-marigold focus:outline-none transition-colors font-sans bg-white"
                                aria-label="Filter by category"
                            >
                                <option value="all">All Categories</option>
                                <option value="ganesh">Ganesh Poojas</option>
                                <option value="shiva">Shiva Poojas</option>
                                <option value="durga">Durga Poojas</option>
                            </select>
                        </div> */}

                        {/* Results Count */}
                        <div className="text-sm text-stone-500 font-medium">
                            Showing <span className="text-sindoor font-bold">{filteredPoojas.length}</span> of {poojas.length} poojas
                        </div>
                    </div>
                </div>

                {/* Poojas Grid - LEARNING: Using filteredPoojas instead of poojas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredPoojas.map((pooja) => (
                        <UnifiedCard
                            key={pooja.id}
                            image={pooja.image}
                            title={pooja.title}
                            description={pooja.description}
                            // LEARNING: Using slug instead of ID for SEO-friendly URLs
                            link={`/poojas/${generateSlug(pooja.title, pooja.id)}`}
                            buttonText="Book Now"
                            price={pooja.variants?.[0]?.price}
                        />))}
                </div>

                {/* LEARNING: Conditional rendering - Different messages for different scenarios */}
                {/* Empty State - No results from search/filter */}
                {filteredPoojas.length === 0 && poojas.length > 0 && (
                    <div className="text-center py-20 bg-white/60 rounded-[3rem] shadow-sm border border-marigold/30 backdrop-blur-sm">
                        <div className="w-16 h-16 bg-paper-bg rounded-full flex items-center justify-center mx-auto mb-4 text-sindoor text-2xl border border-marigold/20">
                            <span className="material-symbols-outlined">search_off</span>
                        </div>
                        <h3 className="text-xl font-bold text-sindoor mb-2 font-serif">No Poojas Found</h3>
                        <p className="text-stone-500 font-sans italic mb-4">
                            We couldn't find any poojas matching "{searchQuery}".
                        </p>
                        <button
                            onClick={() => setSearchQuery("")}
                            className="text-marigold font-bold hover:underline flex items-center gap-2 mx-auto"
                        >
                            <span className="material-symbols-outlined">refresh</span>
                            Clear Search
                        </button>
                    </div>
                )}

                {/* Empty State - No poojas in database */}
                {poojas.length === 0 && !loading && !error && (
                    <div className="text-center py-20 bg-white/60 rounded-[3rem] shadow-sm border border-marigold/30 backdrop-blur-sm">
                        <div className="w-16 h-16 bg-paper-bg rounded-full flex items-center justify-center mx-auto mb-4 text-sindoor text-2xl border border-marigold/20">
                            <span className="material-symbols-outlined">calendar_month</span>
                        </div>
                        <h3 className="text-xl font-bold text-sindoor mb-2 font-serif">No Poojas Available</h3>
                        <p className="text-stone-500 font-sans italic">
                            We are currently updating our spiritual offerings. Please check back soon.
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
}
