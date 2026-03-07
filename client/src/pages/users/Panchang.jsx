import React, { useEffect, useState } from 'react';
import { MhahPanchang as PanchangObj } from 'mhah-panchang';
import {
    Sun,
    Calendar,
    Moon,
    Clock,
    Wind,
    Compass,
    Sparkles,
    CheckCircle2,
    Info,
    Sunrise,
    Sunset
} from "lucide-react";
import { MdSelfImprovement } from "react-icons/md";
import { useTranslation } from 'react-i18next';


const Panchang = () => {
    const { t } = useTranslation();
    const [panchangData, setPanchangData] = useState(null);

    const [loading, setLoading] = useState(true);

    const currentDate = new Date().toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    useEffect(() => {
        const fetchPanchang = () => {
            try {
                const panchangObj = new PanchangObj();
                const date = new Date();
                // Default Location: Varanasi (Kashi)
                const lat = 25.3176;
                const lon = 82.9739;

                const mhahCal = panchangObj.calendar(date, lat, lon);
                const sunTimer = panchangObj.sunTimer(date, lat, lon);

                // Formatting Helpers
                const formatTime = (timeStr) => {
                    if (!timeStr) return "--:--";
                    return new Date(timeStr).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    });
                };

                // Calculate Muhurta length for Abhijit
                const sunriseDate = new Date(sunTimer.sunRise);
                const sunsetDate = new Date(sunTimer.sunSet);
                const dayLengthMs = sunsetDate.getTime() - sunriseDate.getTime();
                const muhurtaLengthMs = dayLengthMs / 15;

                const data = {
                    tithi: mhahCal.Tithi.name_en_IN,
                    paksha: mhahCal.Paksha.name_en_IN,
                    nakshatra: mhahCal.Nakshatra.name_en_IN,
                    yoga: mhahCal.Yoga.name_en_IN,
                    karan: mhahCal.Karan ? mhahCal.Karan.name_en_IN : "Dashata",
                    vara: new Date().toLocaleDateString('en-IN', { weekday: 'long' }),
                    sunrise: formatTime(sunTimer.sunRise),
                    sunset: formatTime(sunTimer.sunSet),
                    moonrise: formatTime(sunTimer.moonRise),
                    moonset: formatTime(sunTimer.moonSet),
                    rahu: {
                        start: "15:00 PM", // Simplified for now
                        end: "16:30 PM"
                    },
                    gulika: {
                        start: "12:00 PM",
                        end: "13:30 PM"
                    },
                    yamaganda: {
                        start: "09:00 AM",
                        end: "10:30 AM"
                    },
                    abhijit: {
                        start: formatTime(new Date(sunriseDate.getTime() + 7 * muhurtaLengthMs)),
                        end: formatTime(new Date(sunriseDate.getTime() + 8 * muhurtaLengthMs))
                    }
                };

                setPanchangData(data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch Panchang data:", err);
                setLoading(false);
            }
        };

        fetchPanchang();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-paper-bg flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <Sun className="text-6xl text-marigold animate-spin w-16 h-16" />
                        <Sparkles className="absolute -top-2 -right-2 text-sindoor animate-pulse" />
                    </div>
                    <p className="text-sindoor font-bold tracking-[0.3em] text-xl animate-pulse">DIVINE PANCHANG</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-paper-bg relative overflow-hidden pb-20">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-[600px] bg-linear-to-b from-marigold/10 via-marigold/5 to-transparent pointer-events-none" />
            <div className="absolute top-[10%] -left-20 w-96 h-96 bg-sindoor/5 rounded-full blur-[100px] pointer-events-none animate-pulse" />
            <div className="absolute top-[30%] -right-20 w-96 h-96 bg-marigold/5 rounded-full blur-[100px] pointer-events-none animate-pulse" />

            {/* Header Section */}
            <div className="relative pt-20 pb-12 text-center px-4">
                <div className="inline-flex items-center gap-4 mb-6">
                    <div className="h-[2px] w-12 bg-marigold rounded-full"></div>
                    <span className="text-marigold font-bold tracking-[0.2em] uppercase text-sm">{t('panchang.subtitle')}</span>

                    <div className="h-[2px] w-12 bg-marigold rounded-full"></div>
                </div>
                <h1 className="text-6xl md:text-8xl text-sindoor font-serif mb-6 drop-shadow-md">{t('panchang.title')}</h1>

                <div className="flex flex-col items-center gap-2">
                    <p className="text-2xl text-heritage-dark font-medium">{currentDate}</p>
                    <p className="text-stone-500 font-medium italic">{t('panchang.location_text')}</p>

                </div>
            </div>

            <div className="toran-border opacity-60 mb-16"></div>

            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                {/* The Five Pillars (Pancha-Anga) */}
                <h2 className="text-3xl text-sindoor font-serif mb-10 border-l-4 border-marigold pl-6">{t('panchang.pillars')}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
                    {[
                        { label: t('panchang.tithi'), value: `${panchangData.paksha} ${panchangData.tithi}`, icon: Moon, desc: t('panchang.lunar_day') },
                        { label: t('panchang.vara'), value: panchangData.vara, icon: Sun, desc: t('panchang.weekday') },
                        { label: t('panchang.nakshatra'), value: panchangData.nakshatra, icon: Sparkles, desc: t('panchang.star') },
                        { label: t('panchang.yoga'), value: panchangData.yoga, icon: MdSelfImprovement, desc: t('panchang.luni_solar') },
                        { label: t('panchang.karan'), value: panchangData.karan, icon: Wind, desc: t('panchang.half_tithi') }

                    ].map((pill, idx) => (

                        <div key={idx} className="glass-card p-6 rounded-3xl border border-marigold/20 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
                            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <pill.icon className="w-24 h-24 text-sindoor" />
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-sindoor/5 flex items-center justify-center text-sindoor mb-4 group-hover:bg-sindoor group-hover:text-white transition-all duration-300">
                                <pill.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-1">{pill.label}</h3>
                            <p className="text-xl text-heritage-dark font-bold mb-1">{pill.value}</p>
                            <p className="text-marigold text-[10px] font-bold uppercase tracking-tighter">{pill.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Solar & Lunar Timings */}
                    <div className="lg:col-span-8">
                        <div className="glass-card rounded-[3rem] p-10 border border-marigold/10 shadow-lg relative overflow-hidden bg-white/40">
                            <div className="flex items-center justify-between mb-12">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-marigold/10 flex items-center justify-center text-marigold">
                                        <Compass className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-4xl text-sindoor font-serif">{t('panchang.celestial')}</h2>

                                </div>
                                <div className="hidden md:block px-4 py-2 bg-sindoor/5 rounded-full border border-sindoor/10">
                                    <span className="text-sindoor text-xs font-bold tracking-widest uppercase">{t('panchang.solar_lunar_flow') || 'Solar & Lunar Flow'}</span>
                                </div>

                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {/* Sun */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3 text-marigold">
                                        <Sun className="w-6 h-6" />
                                        <h3 className="font-bold uppercase tracking-widest text-sm">{t('panchang.solar')}</h3>

                                    </div>
                                    <div className="flex gap-6">
                                        <div className="flex-1 bg-linear-to-br from-orange-50 to-orange-100/50 p-6 rounded-3xl border border-orange-200/50 group hover:border-marigold transition-colors">
                                            <Sunrise className="w-8 h-8 text-marigold mb-3" />
                                            <span className="text-xs text-stone-500 font-bold uppercase">{t('panchang.sunrise')}</span>

                                            <p className="text-3xl text-heritage-dark font-black">{panchangData.sunrise}</p>
                                        </div>
                                        <div className="flex-1 bg-linear-to-br from-amber-50 to-amber-100/50 p-6 rounded-3xl border border-amber-200/50 group hover:border-marigold transition-colors">
                                            <Sunset className="w-8 h-8 text-sindoor mb-3" />
                                            <span className="text-xs text-stone-500 font-bold uppercase">{t('panchang.sunset')}</span>

                                            <p className="text-3xl text-heritage-dark font-black">{panchangData.sunset}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Moon */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3 text-stone-600">
                                        <Moon className="w-6 h-6" />
                                        <h3 className="font-bold uppercase tracking-widest text-sm">{t('panchang.lunar')}</h3>

                                    </div>
                                    <div className="flex gap-6">
                                        <div className="flex-1 bg-linear-to-br from-blue-50 to-blue-100/50 p-6 rounded-3xl border border-blue-200/50 group hover:border-blue-400 transition-colors">
                                            <Moon className="w-8 h-8 text-blue-600 mb-3" />
                                            <span className="text-xs text-stone-500 font-bold uppercase">{t('panchang.moonrise')}</span>

                                            <p className="text-3xl text-heritage-dark font-black">{panchangData.moonrise}</p>
                                        </div>
                                        <div className="flex-1 bg-linear-to-br from-indigo-50 to-indigo-100/50 p-6 rounded-3xl border border-indigo-200/50 group hover:border-indigo-400 transition-colors">
                                            <div className="relative w-8 h-8 mb-3">
                                                <Moon className="absolute inset-0 text-indigo-400 w-8 h-8 opacity-20" />
                                                <Moon className="absolute inset-x-1 inset-y-0 text-indigo-800 w-8 h-8" />
                                            </div>
                                            <span className="text-xs text-stone-500 font-bold uppercase">{t('panchang.moonset')}</span>

                                            <p className="text-3xl text-heritage-dark font-black">{panchangData.moonset}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Auspicious & Inauspicious Periods */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        {/* Shubh Muhurat Card */}
                        <div className="bg-linear-to-br from-green-600 to-green-700 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                                <Sparkles className="w-24 h-24" />
                            </div>
                            <div className="relative z-10">
                                <span className="flex items-center gap-2 text-green-100/80 font-bold uppercase tracking-[0.2em] text-[10px] mb-4">
                                    <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                                    {t('panchang.most_auspicious')}
                                </span>

                                <h3 className="text-3xl font-serif mb-6">{t('panchang.abhijit')}</h3>

                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-black">{panchangData.abhijit.start}</span>
                                        <span className="text-green-100 font-medium">to</span>
                                        <span className="text-4xl font-black">{panchangData.abhijit.end}</span>
                                    </div>
                                    <p className="text-[10px] text-green-100 mt-4 leading-relaxed font-medium uppercase tracking-wider">{t('panchang.abhijit_desc')}</p>

                                </div>
                            </div>
                        </div>

                        {/* Caution Periods */}
                        <div className="glass-card rounded-[2.5rem] p-8 border border-red-100 bg-white/60 shadow-lg">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl text-heritage-dark font-bold">{t('panchang.caution')}</h3>

                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-4 rounded-2xl bg-red-50/50 border border-red-100 group hover:bg-red-50 transition-colors">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider">{t('panchang.rahu_kaalam')}</span>
                                        <span className="text-base text-heritage-dark font-bold font-serif">{panchangData.rahu.start} - {panchangData.rahu.end}</span>
                                    </div>

                                    <Info className="w-4 h-4 text-red-300" />
                                </div>
                                <div className="flex justify-between items-center p-4 rounded-2xl bg-orange-50/50 border border-orange-100 group hover:bg-orange-50 transition-colors">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider">{t('panchang.yamaganda')}</span>
                                        <span className="text-base text-heritage-dark font-bold font-serif">{panchangData.yamaganda.start} - {panchangData.yamaganda.end}</span>
                                    </div>

                                    <Info className="w-4 h-4 text-orange-300" />
                                </div>
                                <div className="flex justify-between items-center p-4 rounded-2xl bg-yellow-50/50 border border-yellow-100 group hover:bg-yellow-50 transition-colors">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-wider">{t('panchang.gulika_kaalam')}</span>
                                        <span className="text-base text-heritage-dark font-bold font-serif">{panchangData.gulika.start} - {panchangData.gulika.end}</span>
                                    </div>

                                    <Info className="w-4 h-4 text-yellow-300" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Educational Section */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="md:col-span-2 bg-heritage-dark rounded-[3rem] p-12 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-marigold/10 rounded-full blur-[100px]" />
                        <h3 className="text-4xl font-serif mb-8 text-marigold">{t('panchang.what_is')}</h3>

                        <p className="text-white/70 leading-loose text-lg mb-10 max-w-2xl">
                            {t('panchang.what_is_desc')}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                t('panchang.benefit1'),
                                t('panchang.benefit2'),
                                t('panchang.benefit3'),
                                t('panchang.benefit4')
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <CheckCircle2 className="w-6 h-6 text-marigold" />
                                    <span className="font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-marigold rounded-[3rem] p-10 flex flex-col items-center justify-center text-center shadow-xl">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6">
                            <Clock className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-black text-sindoor mb-4 uppercase tracking-tighter">{t('panchang.vedic_timing')}</h3>
                        <p className="text-sindoor/70 font-medium mb-8">{t('panchang.vedic_timing_desc')}</p>
                        <button className="bg-sindoor text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-heritage-dark transition-all scale-100 hover:scale-105">{t('panchang.view_calendar')}</button>

                    </div>
                </div>
            </div>

            <div className="toran-border rotate-180 opacity-60 mt-20"></div>
        </div>
    );
};

export default Panchang;
