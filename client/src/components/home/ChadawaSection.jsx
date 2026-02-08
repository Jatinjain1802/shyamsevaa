import { ChevronRight, ChevronLeft, Calendar, User, ArrowRight } from "lucide-react";
import { MdVolunteerActivism } from "react-icons/md";
import api from "../../utils/axios";
import { useEffect, useState, useRef } from "react";
import { generateSlug } from "../../utils/slugify";
import { Link } from "react-router-dom";

export default function ChadawaSection() {
    const [chadawas, setChadawas] = useState([]);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const fetchChadawas = async () => {
            try {
                const res = await api.get("/chadawas");
                setChadawas(res.data.data ? res.data.data : []);
            } catch (err) {
                console.error("Failed to fetch chadawas", err);
            }
        };
        fetchChadawas();
    }, []);

    const scroll = (direction) => {
        const container = scrollContainerRef.current;
        if (container) {
            const scrollAmount = container.clientWidth;
            const targetScroll = container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
            container.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        }
    };

    if (!chadawas.length) return null;

    return (
        <section
            className="relative py-18 overflow-hidden"
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

            <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                            <MdVolunteerActivism className="text-marigold w-6 h-6" />
                            <span className="text-marigold font-bold tracking-widest uppercase text-sm">Sacred Offerings</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-serif font-bold text-heritage-dark mb-6 leading-tight">
                            Popular <span className="text-sindoor">Chadawas</span>
                        </h2>
                        <p className="text-lg text-stone-600 max-w-xl font-sans leading-relaxed">
                            Offer sacred items to your beloved deities. We ensure your offerings reach the temple sanctum with devotion and care.
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
                            to="/chadawas"
                            className="inline-flex items-center px-6 py-3 bg-linear-to-r from-sindoor to-marigold text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:shadow-sindoor/30 transition-all duration-300 ml-4"
                        >
                            View All
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
                    {chadawas.map((item) => (
                        <Link
                            to={`/chadawas/${generateSlug(item.title, item.id)}`}
                            key={item.id}
                            className="min-w-[85vw] md:min-w-[45%] lg:min-w-[calc(33.333%-1rem)] snap-center group relative bg-white rounded-4xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-marigold/20 transition-all duration-500 hover:-translate-y-2 border border-stone-100 flex flex-col"
                            style={{ transform: "translateZ(0)" }}
                        >
                            {/* Card Image */}
                            <div className="relative aspect-4/3 w-full overflow-hidden shrink-0">
                                <div className="absolute" />
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-80" />
                            </div>

                            {/* Card Content */}
                            <div className="relative p-6 md:p-8 flex flex-col flex-1">
                                {/* Decor Line */}
                                <div className="absolute -top-6 right-8 w-12 h-12 bg-marigold rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 z-10">
                                    <MdVolunteerActivism className="text-white w-6 h-6" />
                                </div>

                                <div className="mb-2 flex items-center gap-2 text-stone-500 text-sm font-medium">
                                    <User className="text-marigold w-4 h-4" />
                                    <span className="truncate">Devotees' Choice</span>
                                </div>

                                <h3 className="text-2xl font-serif font-bold text-heritage-dark mb-3 leading-snug group-hover:text-sindoor transition-colors line-clamp-2">
                                    {item.title}
                                </h3>

                                <p className="text-stone-600 mb-8 line-clamp-2 leading-relaxed flex-1">
                                    {item.description}
                                </p>

                                <div className="mt-auto pt-6 border-t border-stone-100 flex items-center justify-between">
                                    <div
                                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-sindoor text-white font-bold rounded-xl group-hover:bg-marigold group-hover:shadow-lg transition-all duration-300"
                                    >
                                        <span>Send Offering</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Mobile View All Button */}
                <div className="mt-4 text-center md:hidden">
                    <Link
                        to="/chadawas"
                        className="inline-flex items-center px-6 py-3 bg-linear-to-r from-sindoor to-marigold text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:shadow-sindoor/30 transition-all duration-300"
                    >
                        View All Offerings
                        <ChevronRight className="ml-2 w-5 h-5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
