import React, { useEffect, useState } from 'react';
import { getPanchangam, Observer, tithiNames, nakshatraNames, yogaNames, karanaNames } from '@ishubhamx/panchangam-js';

const Muhurat = () => {
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
                // Default Location: Varanasi (Kashi)
                const observer = new Observer(25.3176, 82.9739, 81);
                const date = new Date();
                const panchang = getPanchangam(date, observer);

                // Process Data
                const tithiName = tithiNames[panchang.tithi] || "Unknown";
                const paksha = panchang.paksha || (panchang.tithi < 15 ? "Shukla" : "Krishna");
                const fullTithi = `${paksha} Paksha ${tithiName}`;

                // Formatting Helpers
                const formatTime = (isoString) => {
                    if (!isoString) return "--:--";
                    return new Date(isoString).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    });
                };

                const data = {
                    tithi: fullTithi,
                    nakshatra: nakshatraNames[panchang.nakshatra] || "Unknown",
                    yoga: yogaNames[panchang.yoga] || "Unknown",
                    karan: karanaNames[panchang.karana] || "Unknown",
                    sunrise: formatTime(panchang.sunrise),
                    sunset: formatTime(panchang.sunset),
                    moonrise: formatTime(panchang.moonrise),
                    moonset: formatTime(panchang.moonset),
                    abhijit: {
                        start: formatTime(panchang.abhijitMuhurta?.start),
                        end: formatTime(panchang.abhijitMuhurta?.end)
                    },
                    rahu: {
                        start: formatTime(panchang.rahuKaalam?.start),
                        end: formatTime(panchang.rahuKaalam?.end)
                    },
                    yamaganda: {
                        start: formatTime(panchang.yamagandaKalam?.start),
                        end: formatTime(panchang.yamagandaKalam?.end)
                    }
                };

                setPanchangData(data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to calculate Panchang:", err);
                setLoading(false);
            }
        };

        fetchPanchang();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-paper-bg flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <span className="material-symbols-outlined text-4xl text-marigold animate-spin">sunny</span>
                    <p className="text-sindoor font-bold tracking-widest">CALCULATING MUHURAT...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-paper-bg relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-linear-to-b from-marigold/10 to-transparent pointer-events-none" />

            {/* Header Section */}
            <div className="relative pt-12 pb-8 text-center">
                <div className="flex justify-center items-center gap-4 mb-4">
                    <span className="material-symbols-outlined text-4xl text-sindoor">flare</span>
                    <div className="w-16 h-1 bg-sindoor rounded-full"></div>
                    <span className="material-symbols-outlined text-4xl text-sindoor">flare</span>
                </div>
                <h1 className="text-5xl md:text-7xl text-sindoor mb-4 drop-shadow-sm">Shubh Muhurat</h1>
                <p className="text-xl text-heritage-dark/70 font-medium mb-2">{currentDate}</p>
                <p className="text-marigold font-bold tracking-widest uppercase text-sm">Vedic Timekeeping & Auspicious Timings (Varanasi)</p>
            </div>

            <div className="toran-border opacity-80 mb-12"></div>

            <div className="max-w-[1280px] mx-auto px-6 md:px-10 pb-20">

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Today's Panchang Card */}
                    <div className="glass-card p-8 rounded-3xl border-2 border-haldi/50 shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-marigold/10 rounded-full blur-3xl group-hover:bg-marigold/20 transition-all"></div>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-full bg-sindoor/10 flex items-center justify-center text-sindoor">
                                <span className="material-symbols-outlined text-2xl">calendar_month</span>
                            </div>
                            <h2 className="text-2xl text-sindoor border-b-2 border-marigold/30 pb-1 w-full">Panchang Today</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center group/item hover:bg-white/40 p-2 rounded-lg transition-colors">
                                <div className="flex flex-col">
                                    <span className="text-xs text-stone-500 uppercase tracking-widest font-bold">Tithi</span>
                                    <span className="text-heritage-dark font-medium text-lg">{panchangData?.tithi}</span>
                                </div>
                                <span className="material-symbols-outlined text-marigold opacity-50">dark_mode</span>
                            </div>

                            <div className="flex justify-between items-center group/item hover:bg-white/40 p-2 rounded-lg transition-colors">
                                <div className="flex flex-col">
                                    <span className="text-xs text-stone-500 uppercase tracking-widest font-bold">Nakshatra</span>
                                    <span className="text-heritage-dark font-medium text-lg">{panchangData?.nakshatra}</span>
                                </div>
                                <span className="material-symbols-outlined text-marigold opacity-50">stars</span>
                            </div>

                            <div className="flex justify-between items-center group/item hover:bg-white/40 p-2 rounded-lg transition-colors">
                                <div className="flex flex-col">
                                    <span className="text-xs text-stone-500 uppercase tracking-widest font-bold">Yoga</span>
                                    <span className="text-heritage-dark font-medium text-lg">{panchangData?.yoga}</span>
                                </div>
                                <span className="material-symbols-outlined text-marigold opacity-50">self_improvement</span>
                            </div>

                            <div className="flex justify-between items-center group/item hover:bg-white/40 p-2 rounded-lg transition-colors">
                                <div className="flex flex-col">
                                    <span className="text-xs text-stone-500 uppercase tracking-widest font-bold">Karan</span>
                                    <span className="text-heritage-dark font-medium text-lg">{panchangData?.karan}</span>
                                </div>
                                <span className="material-symbols-outlined text-marigold opacity-50">history_edu</span>
                            </div>
                        </div>
                    </div>

                    {/* Timings Card */}
                    <div className="glass-card p-8 rounded-3xl border-2 border-haldi/50 shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-sindoor/5 rounded-full blur-3xl group-hover:bg-sindoor/10 transition-all"></div>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-full bg-sindoor/10 flex items-center justify-center text-sindoor">
                                <span className="material-symbols-outlined text-2xl">schedule</span>
                            </div>
                            <h2 className="text-2xl text-sindoor border-b-2 border-marigold/30 pb-1 w-full">Solar & Lunar</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-white/60 p-4 rounded-2xl flex flex-col items-center text-center border border-marigold/20 hover:border-marigold transition-colors">
                                <span className="material-symbols-outlined text-3xl text-marigold mb-2">wb_sunny</span>
                                <span className="text-xs text-stone-500 uppercase font-bold">Sunrise</span>
                                <span className="text-xl text-sindoor font-bold">{panchangData?.sunrise}</span>
                            </div>
                            <div className="bg-white/60 p-4 rounded-2xl flex flex-col items-center text-center border border-marigold/20 hover:border-marigold transition-colors">
                                <span className="material-symbols-outlined text-3xl text-sindoor mb-2">wb_twilight</span>
                                <span className="text-xs text-stone-500 uppercase font-bold">Sunset</span>
                                <span className="text-xl text-sindoor font-bold">{panchangData?.sunset}</span>
                            </div>
                            <div className="bg-white/60 p-4 rounded-2xl flex flex-col items-center text-center border border-marigold/20 hover:border-marigold transition-colors">
                                <span className="material-symbols-outlined text-3xl text-heritage-dark mb-2">bedtime</span>
                                <span className="text-xs text-stone-500 uppercase font-bold">Moonrise</span>
                                <span className="text-xl text-sindoor font-bold">{panchangData?.moonrise}</span>
                            </div>
                            <div className="bg-white/60 p-4 rounded-2xl flex flex-col items-center text-center border border-marigold/20 hover:border-marigold transition-colors">
                                <span className="material-symbols-outlined text-3xl text-stone-400 mb-2">wb_twilight</span>
                                <span className="text-xs text-stone-500 uppercase font-bold">Moonset</span>
                                <span className="text-xl text-sindoor font-bold">{panchangData?.moonset}</span>
                            </div>
                        </div>
                    </div>

                    {/* Auspicious Timings */}
                    <div className="glass-card p-0 rounded-3xl border-2 border-sindoor/20 shadow-xl overflow-hidden flex flex-col">
                        <div className="bg-sindoor p-6 text-white text-center">
                            <h2 className="text-2xl font-serif tracking-wide">Muhurat Timings</h2>
                            <p className="text-haldi text-sm uppercase tracking-widest opacity-90">Plan your activities</p>
                        </div>

                        <div className="p-6 flex-1 flex flex-col justify-center gap-6">
                            {/* Abhijit */}
                            <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-green-50 to-green-100 border border-green-200 p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="flex items-center gap-2 text-green-800 font-bold uppercase tracking-wider text-xs">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                        Abhijit Muhurat
                                    </span>
                                    <span className="material-symbols-outlined text-green-600">verified</span>
                                </div>
                                <div className="text-3xl font-black text-green-900 leading-tight">
                                    {panchangData?.abhijit.start} <span className="text-base font-medium text-green-700 block text-right md:inline">to {panchangData?.abhijit.end}</span>
                                </div>
                                <p className="text-xs text-green-800/60 mt-2 font-medium">Best time for auspicious beginnings</p>
                            </div>

                            {/* Rahu Kaalam */}
                            <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-red-50 to-red-100 border border-red-200 p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="flex items-center gap-2 text-red-800 font-bold uppercase tracking-wider text-xs">
                                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                        Rahu Kaalam
                                    </span>
                                    <span className="material-symbols-outlined text-red-600">block</span>
                                </div>
                                <div className="text-3xl font-black text-red-900 leading-tight">
                                    {panchangData?.rahu.start} <span className="text-base font-medium text-red-700 block text-right md:inline">to {panchangData?.rahu.end}</span>
                                </div>
                                <p className="text-xs text-red-800/60 mt-2 font-medium">Avoid starting new ventures</p>
                            </div>

                            {/* Yamaganda */}
                            <div className="flex justify-between items-center p-3 rounded-xl bg-orange-50 border border-orange-100">
                                <span className="text-orange-900 font-bold text-sm">Yamaganda</span>
                                <span className="text-orange-800 font-bold">{panchangData?.yamaganda.start} - {panchangData?.yamaganda.end}</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Additional Info Section */}
                <div className="mt-12 bg-white/80 rounded-[3rem] p-8 md:p-12 shadow-xl border-t-8 border-marigold">
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="flex-1">
                            <h3 className="text-4xl text-sindoor mb-6">Why Follow Muhurat?</h3>
                            <p className="text-stone-600 leading-loose text-lg mb-6">
                                In Vedic Astrology, 'Muhurat' defines the most auspicious moment to perform a specific activity. aligns your actions with the cosmic rhythm, ensuring success and removing obstacles.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-4">
                                    <span className="material-symbols-outlined text-marigold bg-marigold/10 p-2 rounded-full">check_circle</span>
                                    <span className="text-heritage-dark font-medium">Enhances positive energy for new beginnings</span>
                                </li>
                                <li className="flex items-center gap-4">
                                    <span className="material-symbols-outlined text-marigold bg-marigold/10 p-2 rounded-full">check_circle</span>
                                    <span className="text-heritage-dark font-medium">Mitigates negative planetary influences</span>
                                </li>
                                <li className="flex items-center gap-4">
                                    <span className="material-symbols-outlined text-marigold bg-marigold/10 p-2 rounded-full">check_circle</span>
                                    <span className="text-heritage-dark font-medium">Aligns human efforts with universal timing</span>
                                </li>
                            </ul>
                        </div>
                        <div className="w-full md:w-1/3">
                            <div className="bg-heritage-dark rounded-3xl p-8 text-white text-center relative overflow-hidden">
                                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                                <span className="material-symbols-outlined text-6xl text-haldi mb-4">notifications_active</span>
                                <h4 className="text-2xl font-bold mb-2">Get Daily Alerts</h4>
                                <p className="text-white/60 mb-6 text-sm">Receive Abhijit Muhurat timings on your WhatsApp every morning.</p>
                                <button className="bg-haldi text-sindoor w-full py-3 rounded-xl font-black shadow-lg hover:bg-white hover:text-sindoor transition-all">SUBSCRIBE NOW</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div className="toran-border rotate-180 opacity-80"></div>
        </div>
    );
};

export default Muhurat;
