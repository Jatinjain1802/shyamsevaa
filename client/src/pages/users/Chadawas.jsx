import React, { useEffect, useState } from "react";
import api from "../../utils/axios";
import { Link } from "react-router-dom";
import { generatePureSlug } from "../../utils/slugify";
import { getAssetUrl } from "../../utils/assets";
import { Search, X, AlertCircle, RefreshCw, User, ArrowRight } from "lucide-react";
import { MdVolunteerActivism } from "react-icons/md";
import { useLanguage } from "../../context/LanguageContext";


export default function Chadawas() {
    const { language, t } = useLanguage();
    const [chadawas, setChadawas] = useState([]);

    const [filteredChadawas, setFilteredChadawas] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Infinite Scroll state
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 6;
    const observerTarget = React.useRef(null);

    useEffect(() => {
        fetchChadawas();
    }, []);

    const fetchChadawas = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get("/chadawas?status=1");
            setChadawas(res.data.data || []);
            setFilteredChadawas(res.data.data || []);
        } catch (err) {
            console.error("Failed to load chadawas", err);
            setError(err.response?.data?.message || t("common.error"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredChadawas(chadawas);
            return;
        }

        const query = searchQuery.toLowerCase();
        const results = chadawas.filter(item => {
            const title = item.title?.toLowerCase() || "";
            const title_hi = item.title_hi?.toLowerCase() || "";
            const desc = item.description?.toLowerCase() || "";
            const desc_hi = item.description_hi?.toLowerCase() || "";
            
            return title.includes(query) || 
                   title_hi.includes(query) || 
                   desc.includes(query) || 
                   desc_hi.includes(query);
        });

        setFilteredChadawas(results);
        setPage(1); // Reset page on filter/search change
    }, [searchQuery, chadawas]);

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

    const displayedChadawas = filteredChadawas.slice(0, page * ITEMS_PER_PAGE);

    const SkeletonCard = () => (
        <div className="bg-white rounded-4xl overflow-hidden shadow-xl border border-stone-100 animate-pulse h-[450px]">
            <div className="h-72 bg-stone-200"></div>
            <div className="p-8">
                <div className="h-6 bg-stone-200 rounded mb-4 w-3/4"></div>
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
                        onClick={fetchChadawas}
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
                backgroundImage: 'url("/images/vintage.jpg")',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed'
            }}
        >
            {/* Light Overlay for better text contrast */}
            <div className="absolute inset-0 bg-marigold-100/30"></div>

            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: 'url("/images/diwali-festival-patterned-background.png")',
                    backgroundSize: '400px',
                    backgroundRepeat: 'repeat',
                    filter: 'invert(1)'
                }}>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="py-4 text-sm text-stone-600 font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
                    <Link to="/" className="hover:text-sindoor transition-colors">{t('nav.home')}</Link>
                    <span className="text-marigold">/</span>
                    <span className="text-sindoor">{t('nav.offerings')}</span>
                </div>


                <div className="text-center mb-12">
                    <MdVolunteerActivism className="text-marigold text-5xl mb-2 mx-auto" />
                    <h1 className="text-4xl md:text-6xl text-heritage-dark mb-4 font-serif font-bold">
                        {t('chadawas_page.title')}
                    </h1>
                    <p className="text-lg text-stone-600 max-w-2xl mx-auto font-sans leading-relaxed">
                        {t('chadawas_page.subtitle')}
                    </p>
                    <div className="w-24 h-1 bg-marigold mx-auto mt-6 rounded-full"></div>
                </div>


                <div className="mb-12 bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/50">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-1 w-full relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5 group-focus-within:text-marigold transition-colors" />
                            <input
                                type="text"
                                placeholder={t('chadawas_page.search_placeholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-xl border border-stone-200 bg-white/50 focus:bg-white focus:border-marigold focus:ring-4 focus:ring-marigold/10 outline-none transition-all font-sans text-stone-700"
                                aria-label="Search chadawas"
                            />

                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-sindoor transition-colors"
                                    aria-label="Clear search"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        <div className="text-sm text-stone-600 font-medium px-4 py-2 bg-marigold/10 rounded-full border border-marigold/20">
                            {t('common.showing')} <span className="text-sindoor font-bold">{filteredChadawas.length}</span> {t('common.of')} {chadawas.length} {t('nav.offerings').toLowerCase()}
                        </div>

                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayedChadawas.map((item) => {
                        const title = language === 'hi' && item.title_hi ? item.title_hi : item.title;
                        const desc = language === 'hi' && item.description_hi ? item.description_hi : item.description;
                        
                        return (
                        <Link
                            to={`/chadawas/${generatePureSlug(item.title)}`}
                            state={{ id: item.id }}
                            key={item.id}
                            className="group relative bg-white rounded-4xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-stone-100 flex flex-col h-full"
                        >
                            {/* Card Image */}
                            <div className="relative aspect-4/3 w-full overflow-hidden shrink-0">
                                <div className="absolute" />
                                <img
                                    src={getAssetUrl(item.image)}
                                    alt={title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-80" />
                            </div>

                            {/* Card Content */}
                            <div className="relative p-8 flex flex-col flex-1">
                                {/* Decor Line */}
                                <div className="absolute -top-6 right-8 w-12 h-12 bg-marigold rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 z-10">
                                    <MdVolunteerActivism className="text-white w-6 h-6" />
                                </div>

                                <div className="mb-2 flex items-center gap-2 text-stone-500 text-sm font-medium">
                                    <User className="text-marigold w-4 h-4" />
                                    <span className="truncate">{language === 'hi' ? 'भक्तों की पसंद' : "Devotees' Choice"}</span>
                                </div>

                                <h3 className="text-2xl font-serif font-bold text-heritage-dark mb-3 leading-snug group-hover:text-sindoor transition-colors line-clamp-2">
                                    {title}
                                </h3>

                                <p className="text-stone-600 mb-8 line-clamp-3 leading-relaxed flex-1">
                                    {desc}
                                </p>

                                <div className="mt-auto pt-6 border-t border-stone-100 flex items-center justify-between">
                                    <div
                                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-sindoor text-white font-bold rounded-xl group-hover:bg-marigold group-hover:shadow-lg transition-all duration-300"
                                    >
                                        <span>{t('chadawas_page.send_offering')}</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </div>

                                </div>
                            </div>
                        </Link>
                        );
                    })}

                    {/* Infinite Scroll Target */}
                    {filteredChadawas.length > displayedChadawas.length && (
                        <div ref={observerTarget} className="col-span-full py-12 flex items-center justify-center gap-3 text-stone-500 font-bold">
                            <div className="w-6 h-6 border-4 border-sindoor border-t-transparent rounded-full animate-spin"></div>
                            <span>{language === 'hi' ? 'और चढ़ावा लोड हो रहा है...' : 'Loading more Offerings...'}</span>
                        </div>
                    )}
                </div>

                {filteredChadawas.length === 0 && chadawas.length > 0 && (
                    <div className="text-center py-20 bg-white/60 rounded-[3rem] shadow-sm border border-marigold/30 backdrop-blur-sm">
                        <div className="w-16 h-16 bg-paper-bg rounded-full flex items-center justify-center mx-auto mb-4 text-sindoor text-2xl border border-marigold/20">
                            <Search className="text-sindoor w-8 h-8 opacity-50" />
                        </div>
                        <h3 className="text-xl font-bold text-sindoor mb-2 font-serif">{t('chadawas_page.no_results')}</h3>
                        <p className="text-stone-500 font-sans italic mb-4">
                            {t('chadawas_page.no_results_desc')} "{searchQuery}".
                        </p>
                        <button
                            onClick={() => setSearchQuery("")}
                            className="text-marigold font-bold hover:underline flex items-center gap-2 mx-auto"
                        >
                            <RefreshCw className="w-4 h-4" />
                            {t('panchang.clear_search')}
                        </button>

                    </div>
                )}

                {chadawas.length === 0 && !loading && !error && (
                    <div className="text-center py-20 bg-white/60 rounded-[3rem] shadow-sm border border-marigold/30 backdrop-blur-sm">
                        <div className="w-16 h-16 bg-paper-bg rounded-full flex items-center justify-center mx-auto mb-4 text-sindoor text-2xl border border-marigold/20">
                            <MdVolunteerActivism className="text-sindoor text-4xl" />
                        </div>
                        <h3 className="text-xl font-bold text-sindoor mb-2 font-serif">{t('chadawas_page.no_available')}</h3>
                        <p className="text-stone-500 font-sans italic">
                            {t('chadawas_page.updating_listing')}
                        </p>

                    </div>
                )}
            </div>
        </div>
    );
}
