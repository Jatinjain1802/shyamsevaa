import React from "react";
import { Link } from "react-router-dom";

const LiveDarshanSection = () => {
    return (
        <section className="relative bg-heritage-dark text-white overflow-hidden py-24">
            <div className="absolute top-0 w-full h-4 bg-sindoor"></div>
            <div className="toran-border opacity-50 absolute top-4"></div>
            <div className="max-w-[1280px] mx-auto px-6 md:px-10 relative">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="w-full lg:w-1/2 space-y-8">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-sindoor/30 rounded-full text-haldi border border-haldi/30">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                            </span>
                            <span className="text-xs font-bold tracking-[0.2em]">GANGA AARTI LIVE</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl leading-tight font-serif">Divine Experience From Varanasi</h2>
                        <p className="text-stone-400 text-lg leading-relaxed font-sans">
                            Witness the majestic Ganga Aarti live from the ghats of Kashi. Participate digitally by offering
                            a virtual 'Deep Daan' and 'Sankalp' through our priest.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <button className="bg-haldi text-sindoor font-black px-10 py-5 rounded-2xl flex items-center gap-3 hover:bg-marigold hover:text-white transition-all shadow-[0_10px_30px_rgba(255,193,7,0.3)]">
                                <span className="material-symbols-outlined text-3xl">play_circle</span>
                                WATCH LIVE DARSHAN
                            </button>
                            <button className="border-2 border-white/20 hover:bg-white/10 px-10 py-5 rounded-2xl font-bold flex items-center gap-3 transition-all">
                                <span className="material-symbols-outlined">schedule</span>
                                TIMINGS & CALENDAR
                            </button>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4">
                        <div className="aspect-square bg-cover bg-center rounded-[2rem] border-4 border-marigold/30 overflow-hidden group shadow-2xl"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA3zG0ZywU3AdT_hCtPA9BKo0nce9Un6-yUmMfVbG2HoxaHA5hV7140EhXwfMP8xrC8nFV6rkj-eaZLzWkOhMTtgY5hEmueMW89KKIpOsMLr9Kq3Q0KIBJ9USkhe3_IHcdT_dqkGctGQZGaSYW_8K1qYsUDpqiXoHSCweMh0PcBspJpoIs9ZsiMqJp6m8i0uV6_241Y9sElQmwE_EMqp4joZ1RIvnFBJTjkROTTonSnCDkTGnVNYnt5Y5x07yxH836cQz8p-cwjW80")' }}>
                            <div className="h-full w-full bg-sindoor/20 group-hover:bg-transparent transition-all"></div>
                        </div>
                        <div className="aspect-square bg-cover bg-center rounded-[2rem] border-4 border-marigold/30 overflow-hidden group shadow-2xl mt-12"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD7kETH2PyTUsCNO2bmIiuYHpB5Lr6Vmf9M10aNWaJNNaotXI3MYQ11btJIKjeyM0q_hsi1i-jpSXFniVftmkNH_vC-pY6_dc8J49Ocwrbb9zHMl-S8WlskHDRQOBdRA5rLg5kYn8h32VYlZQorikY4Xqa_wz5rkYJZfJlczt3SeT1DQ3fSlEAF-3omyPYMgG5sE27gMzlqPvdINEAC7f8xryT0TYPXOdm0dyvm_6ojo6Z9-sFlLuv_qxnp_lsPOWnH4Eg0Vb7_itg")' }}>
                            <div className="h-full w-full bg-sindoor/20 group-hover:bg-transparent transition-all"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="toran-border opacity-50 absolute bottom-0 rotate-180"></div>
        </section>
    );
};

export default LiveDarshanSection;
