import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { MdTempleHindu } from "react-icons/md";
import { useLanguage } from "../../context/LanguageContext";
import api from "../../utils/axios";
import { generatePureSlug } from "../../utils/slugify";
import { getAssetUrl } from "../../utils/assets";

const HeroSection = () => {
    const { t, language } = useLanguage();
    const [currentSlide, setCurrentSlide] = useState(0);

    const [temples, setTemples] = useState([]);
    const [loading, setLoading] = useState(true);

    const fallbackTemples = [
        {
            id: 1,
            title: "Kashi Vishwanath Temple",
            title_hi: "काशी विश्वनाथ मंदिर",
            description: "One of the most famous Hindu temples dedicated to Lord Shiva, located in Varanasi.",
            description_hi: "भगवान शिव को समर्पित सबसे प्रसिद्ध हिंदू मंदिरों में से एक, जो वाराणसी में स्थित है।",
            city: "Varanasi",
            city_hi: "वाराणसी",
            state: "Uttar Pradesh",
            state_hi: "उत्तर प्रदेश",
            image: "https://images.unsplash.com/photo-1620216518105-06da871f302f?w=1600&q=80"
        },
        {
            id: 2,
            title: "Mahalakshmi Temple",
            title_hi: "महालक्ष्मी मंदिर",
            description: "Dedicated to Mahalakshmi, the central deity of Devi Mahatmyam, located in Mumbai.",
            description_hi: "मुंबई में स्थित देवी महात्म्य की केंद्रीय देवी महालक्ष्मी को समर्पित।",
            city: "Mumbai",
            city_hi: "मुंबई",
            state: "Maharashtra",
            state_hi: "महाराष्ट्र",
            image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1600&q=80"
        }
    ];

    useEffect(() => {
        const fetchTemples = async () => {
            try {
                const res = await api.get("/temples/public");
                const data = res.data.data || [];
                setTemples(data.length > 0 ? data.slice(0, 5) : fallbackTemples);
            } catch (err) {
                console.error("Failed to fetch temples for hero", err);
                setTemples(fallbackTemples);
            } finally {
                setLoading(false);
            }
        };
        fetchTemples();
    }, []);

    useEffect(() => {
        if (!temples.length) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % temples.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [temples.length]);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % temples.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + temples.length) % temples.length);

    // Localized fields mapping
    const getLocalizedField = (obj, field) => {
        if (!obj) return "";
        const hiField = `${field}_hi`;
        return (language === 'hi' && obj[hiField]) ? obj[hiField] : obj[field];
    };

    if (loading) {
        return (
            <section className="relative px-4 sm:px-6 lg:px-8 py-6 mb-12">
                <div className="w-full h-[600px] rounded-4xl bg-stone-200 animate-pulse"></div>
            </section>
        );
    }

    return (
        <section className="relative px-4 sm:px-6 lg:px-8 py-4 lg:py-8 overflow-hidden group">
            {/* Background Decorative Elements */}
            <div className="absolute top-20 -left-10 w-72 h-72 bg-marigold/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-20 -right-10 w-96 h-96 bg-sindoor/15 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Main Hero Card */}
            <div className="relative w-full h-[550px] md:h-[650px] rounded-4xl md:rounded-[3rem] overflow-hidden shadow-2xl border border-white/20">

                {/* Carousel Slides */}
                {temples.map((temple, index) => {
                    const title = getLocalizedField(temple, 'title');
                    const desc = getLocalizedField(temple, 'description');
                    const city = getLocalizedField(temple, 'city');
                    const state = getLocalizedField(temple, 'state');

                    return (
                        <div
                            key={temple.id}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                                }`}
                        >
                            {/* Background Image with Zoom Effect */}
                            <div
                                className={`absolute inset-0 bg-cover bg-center transition-transform duration-8000 ${index === currentSlide ? "scale-110" : "scale-100"
                                    }`}
                                style={{ backgroundImage: `url("${getAssetUrl(temple.image)}")` }}
                            >
                                {/* Overlay for better text readability */}
                            </div>

                            {/* Professional Gradients */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-80 md:opacity-60"></div>

                            {/* Content Container */}
                            <div className="absolute inset-0 flex flex-col justify-center items-center px-6 sm:px-10 md:px-16 lg:px-24">
                                <div className={`max-w-4xl w-full flex flex-col items-center text-center transition-all duration-700 delay-200 transform ${index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                                    }`}>

                                    {/* Tagline / City & State */}
                                    <div className="mb-4 md:mb-6 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full shadow-lg hover:bg-white/20 transition-colors duration-300">
                                        <MapPin className="w-4 h-4 text-haldi" />
                                        <span className="text-white/90 font-sans font-bold tracking-wider uppercase text-xs md:text-sm">
                                            {city}, {state}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl text-white font-serif font-bold leading-[1.1] mb-6 drop-shadow-2xl">
                                        {title}
                                    </h1>

                                    {/* Description */}
                                    <p className="line-clamp-2 text-white/90 text-lg md:text-2xl mb-12 font-medium leading-relaxed max-w-2xl font-sans">
                                        {desc}
                                    </p>

                                    {/* Buttons */}
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
                                        <Link
                                            to={`/temples/${generatePureSlug(temple.title)}`}
                                            state={{ id: temple.id }}
                                            className="btn-primary-custom group shadow-2xl hover:shadow-marigold/40 py-4 px-8 text-base md:text-lg w-full sm:w-auto text-center flex items-center justify-center"
                                        >
                                            <MdTempleHindu className="w-5 h-5 mr-2" />
                                            <span>{t('home.hero_view_puja')}</span>
                                        </Link>

                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Navigation Controls - Responsive Positioning */}
                <div className="absolute bottom-6 md:bottom-12 right-6 md:right-16 flex items-center gap-4 z-20">
                    <button
                        onClick={prevSlide}
                        className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/30 hover:border-white bg-black/20 hover:bg-white/10 backdrop-blur-md flex items-center justify-center text-white transition-all transform hover:scale-105 active:scale-95 group"
                    >
                        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/30 hover:border-white bg-black/20 hover:bg-white/10 backdrop-blur-md flex items-center justify-center text-white transition-all transform hover:scale-105 active:scale-95 group"
                    >
                        <ChevronRight className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>

                {/* Progress Indicators */}
                <div className="absolute bottom-8 md:bottom-14 left-6 sm:left-10 md:left-24 flex gap-2 md:gap-3 z-20">
                    {temples.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            aria-label={`Go to slide ${idx + 1}`}
                            className={`h-1.5 md:h-2 rounded-full transition-all duration-500 ease-out ${idx === currentSlide
                                ? "w-10 md:w-16 bg-haldi shadow-[0_0_15px_rgba(255,215,0,0.6)]"
                                : "w-3 md:w-4 bg-white/30 hover:bg-white/50"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
