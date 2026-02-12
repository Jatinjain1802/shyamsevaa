import { ChevronRight, ChevronLeft, Calendar, User, ArrowRight } from "lucide-react";
import { MdVolunteerActivism } from "react-icons/md";
import api from "../../utils/axios";
import { useEffect, useState, useRef } from "react";
import { generatePureSlug } from "../../utils/slugify";
import { Link } from "react-router-dom";

export default function ChadawaSection() {
    const [chadawas, setChadawas] = useState([]);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const fetchChadawas = async () => {
            try {
                const res = await api.get("/chadawas");
                console.log("Chadawas API Response:", res.data);
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

    // Helper to format date
    const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <section
            className="relative py-20 overflow-hidden"
            style={{
                backgroundImage: 'url("/images/vintage.jpg")',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed'
            }}
        >
            {/* Light Overlay for better text contrast */}
            <div className="absolute inset-0 bg-marigold-50/40 backdrop-blur-[2px]"></div>

            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
                style={{
                    backgroundImage: 'url("/images/diwali-festival-patterned-background.png")',
                    backgroundSize: '350px',
                    backgroundRepeat: 'repeat',
                    filter: 'invert(1)'
                }}>
            </div>

            <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                            <div className="w-10 h-[2px] bg-marigold/50 hidden md:block"></div>
                            <div className="flex items-center gap-2">
                                <MdVolunteerActivism className="text-marigold w-6 h-6 animate-pulse" />
                                <span className="text-marigold font-bold tracking-[0.2em] uppercase text-xs">Divine Contributions</span>
                            </div>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-serif font-bold text-heritage-dark mb-6 leading-[1.1]">
                            Sacred <span className="text-sindoor relative italic">
                                Chadawas
                                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                                    <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="#B32D2D" strokeWidth="2" opacity="0.3" />
                                </svg>
                            </span>
                        </h2>
                        <p className="text-lg text-stone-600 max-w-xl font-sans leading-relaxed">
                            Perform sacred offerings to your beloved deities. We ensure your devotion reaches the temple sanctum with complete purity and rituals.
                        </p>
                    </div>

                    {/* Navigation Buttons for Desktop */}
                    <div className="hidden md:flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => scroll('left')}
                                className="w-14 h-14 rounded-full bg-white/80 backdrop-blur-md border border-marigold/20 text-marigold flex items-center justify-center hover:bg-marigold hover:text-white transition-all shadow-xl hover:shadow-marigold/40 active:scale-90 group"
                            >
                                <ChevronLeft className="w-7 h-7 group-hover:-translate-x-0.5 transition-transform" />
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                className="w-14 h-14 rounded-full bg-white/80 backdrop-blur-md border border-marigold/20 text-marigold flex items-center justify-center hover:bg-marigold hover:text-white transition-all shadow-xl hover:shadow-marigold/40 active:scale-90 group"
                            >
                                <ChevronRight className="w-7 h-7 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                        <Link
                            to="/chadawas"
                            className="inline-flex items-center px-8 py-4 bg-linear-to-r from-sindoor to-marigold text-white rounded-full font-bold shadow-lg shadow-sindoor/20 hover:shadow-2xl hover:shadow-sindoor/40 transition-all duration-500 hover:-translate-y-1"
                        >
                            Explore Collection
                            <ChevronRight className="ml-2 w-5 h-5" />
                        </Link>
                    </div>
                </div>

                {/* Horizontal Scroll Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto snap-x snap-mandatory gap-8 pb-16 scrollbar-none items-stretch -mx-4 px-4 md:mx-0 md:px-0"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {chadawas.map((item) => (
                        <Link
                            to={`/chadawas/${generatePureSlug(item.title)}`}
                            state={{ id: item.id }}
                            key={item.id}
                            className="min-w-[88vw] md:min-w-[42%] lg:min-w-[calc(33.333%-1.5rem)] snap-center group relative bg-white rounded-[2.5rem] overflow-hidden shadow-2xl hover:shadow-marigold/30 transition-all duration-700 hover:-translate-y-3 border border-stone-100 flex flex-col"
                        >
                            {/* Card Image Wrapper */}
                            <div className="relative aspect-16/10 w-full overflow-hidden shrink-0">
                                {/* Date Badge */}
                                {item.chadawa_date && (
                                    <div className="absolute top-5 left-5 z-20 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2 border border-marigold/10">
                                        <Calendar className="w-4 h-4 text-marigold" />
                                        <span className="text-xs font-bold text-heritage-dark uppercase tracking-wider">
                                            {formatDate(item.chadawa_date)}
                                        </span>
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-linear-to-t from-heritage-dark/80 via-transparent to-transparent z-10 opacity-60 transition-opacity duration-500 group-hover:opacity-80" />

                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-115"
                                />

                                {/* Decorative Element on Image */}
                                <div className="absolute bottom-6 left-8 z-20">
                                    <div className="w-12 h-1 bg-marigold rounded-full mb-2 transform origin-left transition-all duration-500 group-hover:w-20"></div>
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="relative p-8 md:p-10 flex flex-col flex-1 bg-linear-to-b from-white to-stone-50/50">
                                {/* Floated Action Button Icon */}
                                <div className="absolute -top-10 right-10 w-20 h-20 bg-white rounded-full p-1 shadow-2xl z-20 group-hover:rotate-12 transition-transform duration-500">
                                    <div className="w-full h-full bg-linear-to-br from-marigold to-sindoor rounded-full flex items-center justify-center">
                                        <MdVolunteerActivism className="text-white w-10 h-10" />
                                    </div>
                                </div>

                                <div className="mb-4 flex items-center gap-2 text-marigold/80 text-xs font-bold uppercase tracking-[0.15em]">
                                    <span className="bg-marigold/10 px-3 py-1 rounded-lg">Sacred Item</span>
                                </div>

                                <h3 className="text-3xl font-serif font-bold text-heritage-dark mb-4 leading-[1.2] group-hover:text-sindoor transition-colors duration-300">
                                    {item.title}
                                </h3>

                                <p className="text-stone-500 text-base mb-10 line-clamp-3 leading-relaxed flex-1 font-medium">
                                    {item.description}
                                </p>

                                <div className="mt-auto">
                                    <div
                                        className="inline-flex items-center justify-center gap-3 w-full px-8 py-4 bg-heritage-dark text-white font-bold rounded-2xl group-hover:bg-sindoor group-hover:shadow-xl group-hover:shadow-sindoor/30 transition-all duration-500"
                                    >
                                        <span className="tracking-wide">Book Offering Now</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                                    </div>

                                    {/* Bottom Decorative Pattern */}
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-marigold/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
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
