import { useEffect, useState } from "react";
import api from "../../utils/axios";
import { Link } from "react-router-dom";
import { generateSlug } from "../../utils/slugify"; // LEARNING: Import slug utility

import UnifiedCard from "../../components/common/UnifiedCard";

export default function Chadawas() {
    // STATE MANAGEMENT
    // Multiple state variables to handle different aspects of the component
    const [chadawas, setChadawas] = useState([]); // All chadawas from API
    const [filteredChadawas, setFilteredChadawas] = useState([]); // Filtered results
    const [searchQuery, setSearchQuery] = useState(""); // Search input
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // LEARNING: useEffect hook - Runs when component mounts
    useEffect(() => {
        fetchChadawas();
    }, []);

    // LEARNING: Separate fetch function for retry capability
    const fetchChadawas = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get("/chadawas");
            setChadawas(res.data.data || []);
            setFilteredChadawas(res.data.data || []);
        } catch (err) {
            console.error("Failed to load chadawas", err);
            setError(err.response?.data?.message || "Failed to load chadawas. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // LEARNING: Search Effect - Filters chadawas based on search query
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredChadawas(chadawas);
            return;
        }

        const query = searchQuery.toLowerCase();
        const results = chadawas.filter(chadawa =>
            chadawa.title.toLowerCase().includes(query) ||
            chadawa.description?.toLowerCase().includes(query)
        );

        setFilteredChadawas(results);
    }, [searchQuery, chadawas]);

    // LEARNING: Skeleton Loading Component
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
                        onClick={fetchChadawas}
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
            {/* Decorative Toran Border */}
            <div className="hidden md:block toran-border mb-8"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* LEARNING: Breadcrumb Navigation */}
                <div className="py-4 text-sm text-stone-500 font-bold tracking-widest uppercase mb-4">
                    <Link to="/" className="hover:text-sindoor transition-colors">Home</Link>
                    <span className="mx-2 text-marigold">/</span>
                    <span className="text-sindoor">Chadawas</span>
                </div>

                {/* Header Section */}
                <div className="text-center mb-12">
                    <span className="material-symbols-outlined text-marigold text-5xl mb-2">volunteer_activism</span>
                    <h1 className="text-4xl md:text-5xl text-sindoor mb-4 font-serif">
                        Sacred Chadawas
                    </h1>
                    <p className="text-lg text-stone-600 max-w-2xl mx-auto font-sans italic">
                        Offer your devotion through sacred items. Send your love and prayers to the deity with our verified chadawa services.
                    </p>
                    <div className="w-24 h-1 bg-marigold mx-auto mt-6 rounded-full"></div>
                </div>

                {/* LEARNING: Search Section */}
                <div className="mb-12 bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-marigold/20">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        {/* Search Bar */}
                        <div className="flex-1 w-full relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
                                search
                            </span>
                            <input
                                type="text"
                                placeholder="Search chadawas by name or description..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-stone-200 focus:border-marigold focus:outline-none transition-colors font-sans"
                                aria-label="Search chadawas"
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

                        {/* Results Count */}
                        <div className="text-sm text-stone-500 font-medium">
                            Showing <span className="text-sindoor font-bold">{filteredChadawas.length}</span> of {chadawas.length} chadawas
                        </div>
                    </div>
                </div>

                {/* Chadawas Grid - LEARNING: Using filteredChadawas instead of chadawas */}
                {/* LEARNING: Responsive grid - 1 col mobile, 2 cols tablet, 3 cols desktop for optimal card sizing */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {filteredChadawas.map((item) => (
                        <UnifiedCard
                            key={item.id}
                            image={item.image}
                            title={item.title}
                            description={item.description}
                            // LEARNING: Using slug instead of ID for SEO-friendly URLs
                            link={`/chadawas/${generateSlug(item.title, item.id)}`}
                            buttonText="Offer Now"
                        />
                    ))}
                </div>

                {/* LEARNING: Conditional rendering - Different messages for different scenarios */}
                {/* Empty State - No results from search */}
                {filteredChadawas.length === 0 && chadawas.length > 0 && (
                    <div className="text-center py-20 bg-white/60 rounded-[3rem] shadow-sm border border-marigold/30 backdrop-blur-sm">
                        <div className="w-16 h-16 bg-paper-bg rounded-full flex items-center justify-center mx-auto mb-4 text-sindoor text-2xl border border-marigold/20">
                            <span className="material-symbols-outlined">search_off</span>
                        </div>
                        <h3 className="text-xl font-bold text-sindoor mb-2 font-serif">No Chadawas Found</h3>
                        <p className="text-stone-500 font-sans italic mb-4">
                            We couldn't find any chadawas matching "{searchQuery}".
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

                {/* Empty State - No chadawas in database */}
                {chadawas.length === 0 && (
                    <div className="text-center py-20 bg-white/60 rounded-[3rem] shadow-sm border border-marigold/30 backdrop-blur-sm">
                        <div className="w-16 h-16 bg-paper-bg rounded-full flex items-center justify-center mx-auto mb-4 text-sindoor text-2xl border border-marigold/20">
                            <span className="material-symbols-outlined">volunteer_activism</span>
                        </div>
                        <h3 className="text-xl font-bold text-sindoor mb-2 font-serif">No Chadawas Available</h3>
                        <p className="text-stone-500 font-sans italic">
                            We are currently updating our chadawa listings. Please check back soon.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
