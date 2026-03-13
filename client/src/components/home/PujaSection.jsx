
import { ChevronRight, Calendar, MapPin, ArrowRight, ChevronLeft } from "lucide-react";
import { MdTempleHindu } from "react-icons/md";
import api from "../../utils/axios";
import { useEffect, useState, useRef } from "react";
import { generatePureSlug } from "../../utils/slugify";
import { Link } from "react-router-dom";
import { getAssetUrl } from "../../utils/assets";
import { useLanguage } from "../../context/LanguageContext";


export default function PujaSection() {
    const { t, language } = useLanguage();
    const [pujas, setPujas] = useState([]);

    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const fetchPujas = async () => {
            try {
                const res = await api.get("/poojas?status=1"); // Fetch only active items
                setPujas(res.data.data || []);
            } catch (err) {
                console.error("Failed to fetch pujas for home section", err);
            }
        };
        fetchPujas();
    }, []);

    const scroll = (direction) => {
        const container = scrollContainerRef.current;
        if (container) {
            const scrollAmount = container.clientWidth; // Scroll one full view width
            const targetScroll = container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
            container.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        }
    };

    // Localized fields mapping
    const getLocalizedField = (obj, field) => {
        if (!obj) return "";
        const hiField = `${field}_hi`;
        return (language === 'hi' && obj[hiField]) ? obj[hiField] : obj[field];
    };

    if (!pujas.length) return null;

    return (
        <section
            className="relative py-18 overflow-hidden"
            style={{
                backgroundImage: 'url("/images/simple2.jpg")',
                // backgroundSize: '100% 100%',
                backgroundPosition: 'top center',
                backgroundAttachment: 'fixed'
            }}
        >
            {/* Premium Overlay */}
            <div className="absolute inset-0 bg-marigold-100/30"></div>

            <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div className="text-center md:text-left">
                        <h2 className="text-4xl md:text-6xl font-serif font-bold text-heritage-dark mb-6 leading-tight">
                            {t('home.poojas_title')} <span className="text-sindoor">{t('nav.poojas')}</span>
                        </h2>
                        <p className="text-lg text-stone-600 max-w-xl font-sans leading-relaxed">
                            {t('home.poojas_subtitle')}
                        </p>
                    </div>


                    {/* Navigation Buttons for Desktop */}
                    <div className="hidden md:flex items-center gap-4">
                        <button
                            onClick={() => scroll('left')}
                            className="w-12 h-12 rounded-full bg-white border border-marigold/30 text-marigold flex items-center justify-center hover:bg-marigold hover:text-white transition-all shadow-lg hover:shadow-marigold/30 active:scale-95"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="w-12 h-12 rounded-full bg-white border border-marigold/30 text-marigold flex items-center justify-center hover:bg-marigold hover:text-white transition-all shadow-lg hover:shadow-marigold/30 active:scale-95"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                        <Link
                            to="/poojas"
                            className="inline-flex items-center px-6 py-3 bg-linear-to-r from-sindoor to-marigold text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:shadow-sindoor/30 transition-all duration-300 ml-4"
                        >
                            {t('common.view_all')}
                            <ChevronRight className="ml-1 w-5 h-5" />
                        </Link>

                    </div>
                </div>

                {/* Horizontal Scroll Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-12 scrollbar-none items-stretch -mx-4 px-4 md:mx-0 md:px-0"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {pujas.map((puja) => {
                        const title = getLocalizedField(puja, 'title');
                        const desc = getLocalizedField(puja, 'description');
                        const templeName = getLocalizedField(puja, 'temple_name');
                        const templeCity = getLocalizedField(puja, 'temple_city');
                        const templeState = getLocalizedField(puja, 'temple_state');

                        return (
                        <Link
                            to={`/poojas/${generatePureSlug(puja.title)}`}
                            state={{ id: puja.id }}
                            key={puja.id}
                            className="min-w-[85vw] md:min-w-[45%] lg:min-w-[calc(33.333%-1rem)] snap-center group relative bg-white rounded-4xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-stone-100 flex flex-col"
                            style={{ transform: "translateZ(0)" }}
                        >
                            {/* Card Image */}
                            <div className="relative aspect-4/3 w-full overflow-hidden shrink-0">
                                <div className="absolute" />
                                <img
                                    src={getAssetUrl(puja.image)}
                                    alt={title}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-80" />
                            </div>

                            {/* Card Content */}
                            <div className="relative p-6 md:p-8 flex flex-col flex-1">
                                {/* Decor Line */}
                                <div className="absolute -top-6 right-8 w-12 h-12 bg-marigold rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 z-10">
                                    <Calendar className="text-white w-6 h-6" />
                                </div>

                                <div className="mb-2 flex items-center gap-2 text-stone-500 text-sm font-medium">
                                    <MdTempleHindu className="text-marigold text-lg" />
                                    <span className="truncate">{templeName || (language === 'hi' ? "प्राचीन मंदिर" : "Ancient Temple")}</span>
                                </div>

                                <h3 className="text-2xl font-serif font-bold text-heritage-dark mb-3 leading-snug group-hover:text-sindoor transition-colors line-clamp-2">
                                    {title}
                                </h3>

                                <div className="flex items-center gap-2 mb-4 text-stone-500 text-sm">
                                    <MapPin className="w-4 h-4 text-marigold" />
                                    <span>
                                        {templeCity && templeState
                                            ? `${templeCity}, ${templeState}`
                                            : templeCity || templeState || (language === 'hi' ? "उज्जैन, मध्य प्रदेश" : "Ujjain, Madhya Pradesh")
                                        }
                                    </span>
                                </div>

                                <p className="text-stone-600 mb-8 line-clamp-2 leading-relaxed flex-1">
                                    {desc}
                                </p>

                                <div className="mt-auto pt-6 border-t border-stone-100 flex items-center justify-between">
                                    <div
                                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-sindoor text-white font-bold rounded-xl group-hover:bg-marigold group-hover:shadow-lg transition-all duration-300"
                                    >
                                        <span>{t('common.view_details')}</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </div>


                                    {/* Bottom Decorative Pattern */}
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-marigold/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                </div>
                            </div>
                        </Link>
                        );
                    })}
                </div>

                <div className="mt-16 text-center md:hidden">
                    <Link
                        to="/poojas"
                        className="inline-flex items-center px-8 py-4 bg-white border-2 border-marigold text-marigold rounded-full font-bold hover:bg-marigold hover:text-white transition-all duration-300 shadow-lg"
                    >
                        {t('common.view_all')}
                        <ChevronRight className="ml-2 w-5 h-5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
