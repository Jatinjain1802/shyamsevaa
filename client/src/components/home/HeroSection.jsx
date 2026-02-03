import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Flower, BookOpen } from "lucide-react";
import { MdTempleHindu } from "react-icons/md";

const HeroSection = () => {
    return (
        <section className="relative py-8">
            <div className="max-w-[1440px] mx-auto p-4 md:p-8">
                <div className="relative h-[600px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-haldi">
                    <div className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA-oMjsjkReCjtyX1Q9OGUDrV1Rwy4IqHQUhvT-oRth2nHDItC8vZC1XQCL2MyqWYxK76p2yXIlsvbuWEekZkXsTPAgfvPduVatgtizyG3LNuqbx9LNTW8yo60LfNZhHL8JqrUo4x56GsnZ6bOH33LF8HgjY-zuwAiVFkXLWSlHRdzy6cVwf0BnWmN35bcMTZ18F3K1NuXZEeb4jqA_kmptUhqAziVdlxpPLSymxAoBDIUTpvRQi93MrOwdyF8xhi2vv1Drp4djgXs")' }}>
                    </div>
                    <div className="absolute inset-0 mandap-gradient"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                        <div className="mb-6 flex items-center gap-4 text-haldi">
                            <Flower className="w-12 h-12" />
                            <div className="w-24 h-[2px] bg-haldi"></div>
                            <Sparkles className="w-8 h-8" />
                            <div className="w-24 h-[2px] bg-haldi"></div>
                            <Flower className="w-12 h-12" />
                        </div>
                        <h2 className="text-white text-5xl md:text-8xl mb-6 drop-shadow-2xl font-serif">Authentic Spiritual Connection</h2>
                        <p className="text-haldi text-xl md:text-2xl max-w-3xl mb-10 font-medium leading-relaxed drop-shadow-md font-sans">
                            Bringing the sacred traditions of Bharat to your doorstep. Book Vedic Pandits and Temple Poojas
                            with complete authenticity.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
                            <Link to="/muhurat"
                                className="bg-marigold hover:bg-marigold/90 text-white font-black py-5 rounded-2xl shadow-xl transition-all transform hover:-translate-y-1 flex flex-col items-center justify-center gap-1 group">
                                <BookOpen className="w-8 h-8 group-hover:scale-110 transition-transform" />
                                <span className="tracking-widest text-sm md:text-base mt-1">TODAY'S MUHURAT</span>
                            </Link>
                            <Link to="/poojas"
                                className="bg-sindoor hover:bg-sindoor/90 text-white font-black py-5 rounded-2xl shadow-xl transition-all transform hover:-translate-y-1 flex flex-col items-center justify-center gap-1 group">
                                <MdTempleHindu className="text-3xl group-hover:scale-110 transition-transform" />
                                <span className="tracking-widest text-sm md:text-base mt-1">BOOK A POOJA</span>
                            </Link>
                            <Link to="/temples"
                                className="bg-haldi hover:bg-haldi/90 text-sindoor font-black py-5 rounded-2xl shadow-xl transition-all transform hover:-translate-y-1 flex flex-col items-center justify-center gap-1 group">
                                <MdTempleHindu className="text-3xl group-hover:scale-110 transition-transform" />
                                <span className="tracking-widest text-sm md:text-base mt-1">TEMPLES NEARBY</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
