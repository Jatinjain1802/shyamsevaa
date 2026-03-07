import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, RefreshCw, Sunrise, Sunset, ArrowRight } from "lucide-react";
import { MdSelfImprovement, MdTempleHindu } from "react-icons/md";
import { useTranslation } from 'react-i18next';
import api from "../../utils/axios";

const PanchangSection = () => {
    const { t } = useTranslation();
    const [panchang, setPanchang] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPanchang = async () => {
            try {
                const res = await api.get("/panchang");
                if (res.data.success) {
                    setPanchang(res.data.data);
                }
            } catch (err) {
                console.error("Failed to load panchang", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPanchang();
    }, []);

    return (
        <>
            <div className="toran-border"></div>
            <section className="py-16 px-6 md:px-10 bg-white/50">
                <div className="max-w-[1280px] mx-auto">
                    <div className="flex flex-col md:flex-row items-stretch gap-12">
                        {/* Panchang Card */}
                        <div className="w-full md:w-1/3 glass-card p-8 rounded-3xl border-2 border-haldi shadow-inner flex flex-col justify-center">
                            <div className="flex items-center gap-4 mb-6">
                                <Calendar className="text-4xl text-sindoor" />
                                <h3 className="text-3xl text-sindoor font-serif">{t('panchang.panchang_today')}</h3>
                            </div>


                            {loading ? (
                                <div className="py-12 flex justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sindoor"></div>
                                </div>
                            ) : panchang ? (
                                <div className="space-y-4">
                                    <div className="text-center mb-4 text-stone-500 font-bold border-b border-marigold/20 pb-2">
                                        {panchang.date}
                                    </div>
                                    <div className="flex justify-between items-center border-b border-marigold/20 pb-2">
                                        <span className="font-bold text-gray-600">{t('panchang.tithi')}:</span>
                                        <span className="text-sindoor font-bold">{panchang.tithi}</span>
                                    </div>

                                    <div className="flex justify-between items-center border-b border-marigold/20 pb-2">
                                        <span className="font-bold text-gray-600">{t('panchang.nakshatra')}:</span>
                                        <span className="text-sindoor font-bold">{panchang.nakshatra}</span>
                                    </div>

                                    <div className="flex justify-between items-center border-b border-marigold/20 pb-2">
                                        <span className="font-bold text-gray-600">{t('panchang.yoga')}:</span>
                                        <span className="text-sindoor font-bold">{panchang.yoga}</span>
                                    </div>

                                    <div className="flex justify-between items-center pt-2">
                                        <div className="flex items-center gap-1 text-sm text-stone-500">
                                            <Sunrise className="text-marigold w-5 h-5" />
                                            {panchang.sunrise}
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-stone-500">
                                            <Sunset className="text-sindoor w-5 h-5" />
                                            {panchang.sunset}
                                        </div>
                                    </div>

                                    <div className="mt-8 muhurat-badge p-4 rounded-xl text-white text-center shadow-lg transform hover:scale-105 transition-transform duration-300">
                                        <p className="text-xs tracking-widest uppercase mb-1 opacity-90">{panchang.muhurat?.name}</p>
                                        <p className="text-2xl font-bold font-serif">{panchang.muhurat?.time}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-stone-500">
                                    {t('panchang.unable_load')}
                                </div>

                            )}
                        </div>

                        {/* Services Cards */}
                        <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div
                                className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all h-full flex flex-col justify-end p-8"
                                style={{
                                    backgroundImage: `url("/images/puja-card-bg.png")`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                                <div className="absolute inset-0 bg-sindoor/20 group-hover:bg-sindoor/10 transition-colors"></div>

                                <div className="relative z-10">
                                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-6 text-haldi border border-white/20">
                                        <MdSelfImprovement className="text-3xl" />
                                    </div>
                                    <h4 className="text-3xl text-white mb-2 font-serif">{t('services.pandit')}</h4>
                                    <p className="text-sm text-stone-300 mb-6 italic leading-relaxed font-sans">
                                        {t('home.poojas_subtitle')}
                                    </p>
                                    <Link to="/poojas" className="text-haldi font-black flex items-center gap-2 group-hover:gap-4 transition-all uppercase tracking-wider text-xs">
                                        {t('home.explore_poojas')} <ArrowRight className="w-5 h-5" />
                                    </Link>

                                </div>
                            </div>

                            <div
                                className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all h-full flex flex-col justify-end p-8"
                                style={{
                                    backgroundImage: `url("/images/temple-card-bg.png")`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                                <div className="absolute inset-0 bg-marigold/10 group-hover:bg-marigold/5 transition-colors"></div>

                                <div className="relative z-10">
                                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-6 text-haldi border border-white/20">
                                        <MdTempleHindu className="text-3xl" />
                                    </div>
                                    <h4 className="text-3xl text-white mb-2 font-serif">{t('home.explore_temples').split(' ')[1]}</h4>
                                    <p className="text-sm text-stone-300 mb-6 italic leading-relaxed font-sans">
                                        {t('about.tagline')}
                                    </p>
                                    <Link to="/temples" className="text-haldi font-black flex items-center gap-2 group-hover:gap-4 transition-all uppercase tracking-wider text-xs">
                                        {t('home.explore_temples')} <ArrowRight className="w-5 h-5" />
                                    </Link>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default PanchangSection;
