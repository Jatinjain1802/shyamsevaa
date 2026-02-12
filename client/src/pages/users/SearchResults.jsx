import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../utils/axios";
import UnifiedCard from "../../components/common/UnifiedCard";
import { generatePureSlug } from "../../utils/slugify";
import { Search, AlertCircle, RefreshCw, X } from "lucide-react";

export default function SearchResults() {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get("q") || "";

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Local state for search input to allow user to modify it
    const [searchInput, setSearchInput] = useState(query);

    useEffect(() => {
        setSearchInput(query);
        if (query) {
            fetchResults(query);
        } else {
            setResults([]);
        }
    }, [query]);

    const fetchResults = async (searchQuery) => {
        try {
            setLoading(true);
            setError(null);

            const res = await api.get(`/search?q=${encodeURIComponent(searchQuery)}`);

            if (res.data.success) {
                setResults(res.data.data);
            } else {
                setResults([]);
            }
        } catch (err) {
            console.error("Search failed", err);
            setError("Failed to fetch search results. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
            setSearchParams({ q: searchInput });
        }
    };

    const clearSearch = () => {
        setSearchInput("");
        setSearchParams({});
        setResults([]);
    };

    return (
        <div className="min-h-screen bg-paper-bg pt-8 pb-12">
            <div className="hidden md:block toran-border mb-8"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="text-center mb-12">
                    <Search className="text-marigold text-5xl mb-2 mx-auto" />
                    <h1 className="text-4xl md:text-5xl text-sindoor mb-4 font-serif">
                        Search Results
                    </h1>
                    <p className="text-lg text-stone-600 max-w-2xl mx-auto font-sans italic">
                        {query
                            ? `Found ${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`
                            : "Search for temples, poojas, and divine services"
                        }
                    </p>
                    <div className="w-24 h-1 bg-marigold mx-auto mt-6 rounded-full"></div>
                </div>

                {/* Search Input Area */}
                <div className="max-w-2xl mx-auto mb-12 relative z-10">
                    <form onSubmit={handleSearchSubmit} className="relative">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search for temples or poojas..."
                            className="w-full pl-6 pr-14 py-4 rounded-full border-2 border-marigold/30 focus:border-marigold focus:ring-4 focus:ring-marigold/10 shadow-lg text-lg outline-none transition-all placeholder:text-stone-400 text-sindoor font-medium"
                        />
                        {searchInput && (
                            <button
                                type="button"
                                onClick={() => setSearchInput('')}
                                className="absolute right-14 top-1/2 -translate-y-1/2 text-stone-400 hover:text-sindoor p-1"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-linear-to-r from-marigold to-sindoor text-white p-2.5 rounded-full shadow-md hover:shadow-lg transition-transform active:scale-95"
                        >
                            <Search className="w-6 h-6" />
                        </button>
                    </form>
                </div>

                {/* Content Area */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-[40px] h-96 shadow-xl border-b-4 border-stone-200"></div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-stone-700 mb-2">Error Loading Results</h3>
                        <p className="text-stone-500 mb-6">{error}</p>
                        <button
                            onClick={() => fetchResults(query)}
                            className="px-6 py-2 bg-sindoor text-white rounded-full font-bold hover:bg-sindoor/90 transition-colors"
                        >
                            TryAgain
                        </button>
                    </div>
                ) : results.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {results.map((item) => (
                            <UnifiedCard
                                key={`${item.type}-${item.id}`}
                                image={item.image}
                                title={item.title}
                                description={item.description}
                                location={item.city ? `${item.city}, ${item.state}` : null}
                                tag={item.type.toUpperCase()}
                                link={
                                    item.type === 'temple'
                                        ? `/temples/${generatePureSlug(item.title)}`
                                        : `/poojas/${generatePureSlug(item.title)}`
                                }
                                state={{ id: item.id }}
                                buttonText={item.type === 'temple' ? 'View Temple' : 'View Pooja'}
                            />
                        ))}
                    </div>
                ) : (
                    query && (
                        <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-[3rem] border border-marigold/20">
                            <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-400">
                                <Search className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-sindoor mb-2 font-serif">No Results Found</h3>
                            <p className="text-stone-500 italic mb-8 max-w-md mx-auto">
                                We couldn't find any temples or poojas matching "{query}". Try checking for typos or using broader keywords.
                            </p>
                            <button
                                onClick={clearSearch}
                                className="px-8 py-3 bg-white border-2 border-marigold/30 text-marigold font-bold rounded-xl hover:bg-marigold hover:text-white transition-all shadow-md flex items-center gap-2 mx-auto"
                            >
                                <RefreshCw className="w-5 h-5" />
                                Clear Filters
                            </button>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
