import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/axios";

const ChadawaSection = () => {
    const [chadawas, setChadawas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChadawas = async () => {
            try {
                const res = await api.get("/chadawas");
                setChadawas(res.data.data ? res.data.data.slice(0, 2) : []);
            } catch (err) {
                console.error("Failed to load chadawas", err);
            } finally {
                setLoading(false);
            }
        };

        fetchChadawas();
    }, []);

    return (
        <section className="relative bg-heritage-dark text-white overflow-hidden py-24">
            <div className="absolute top-0 w-full h-4 bg-sindoor"></div>
            <div className="toran-border opacity-50 absolute top-4"></div>
            <div className="max-w-[1280px] mx-auto px-6 md:px-10 relative">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="w-full lg:w-1/2 space-y-8">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-sindoor/30 rounded-full text-haldi border border-haldi/30">
                            <span className="text-xs font-bold tracking-[0.2em]">SACRED OFFERINGS</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl leading-tight font-serif">Offer Chadawa & Bhog</h2>
                        <p className="text-stone-400 text-lg leading-relaxed font-sans">
                            Send your love and prayers to the deity with our verified chadawa services. Physical offerings prepared with purity and delivered with devotion.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link to="/chadawas" className="bg-haldi text-sindoor font-black px-10 py-5 rounded-2xl flex items-center gap-3 hover:bg-marigold hover:text-white transition-all shadow-[0_10px_30px_rgba(255,193,7,0.3)]">
                                <span className="material-symbols-outlined text-3xl">volunteer_activism</span>
                                OFFER NOW
                            </Link>
                        </div>
                    </div>

                    <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4">
                        {loading ? (
                            <div className="col-span-2 flex justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-haldi"></div>
                            </div>
                        ) : chadawas.length > 0 ? (
                            chadawas.map((item, index) => (
                                <div key={item.id} className={`aspect-square bg-cover bg-center rounded-[2rem] border-4 border-marigold/30 overflow-hidden group shadow-2xl ${index === 1 ? 'mt-12' : ''}`}
                                    style={{ backgroundImage: `url("${item.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuD96DM72oKU3CRA7RWjHI1KySm3Kh3QTHC6QG8mNvAGZz-WD4r0efwWJyRySVeHB1GDd_7xWSFFVUS5WJDQUl2QmAvXhkJQpJ7_GFUhr0mcN3u5GRKijz6kZAuc4fz-nENo-0NOD6IvAbOQlGu_ERcg0-pVCtN_hCQYWLtb9phm3ieYtxCvlbfogIzC22k8ry_K30mBMjGzEPaGzls3MLC618WF6O08DVhMk_0S1p-zBupMXCOyzAnVCdOhv5E4SUuXrVEBXDMQZkc'}")` }}>
                                    <div className="h-full w-full bg-sindoor/20 group-hover:bg-transparent transition-all"></div>
                                </div>
                            ))
                        ) : (
                            <>
                                <div className="aspect-square bg-cover bg-center rounded-[2rem] border-4 border-marigold/30 overflow-hidden group shadow-2xl"
                                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD96DM72oKU3CRA7RWjHI1KySm3Kh3QTHC6QG8mNvAGZz-WD4r0efwWJyRySVeHB1GDd_7xWSFFVUS5WJDQUl2QmAvXhkJQpJ7_GFUhr0mcN3u5GRKijz6kZAuc4fz-nENo-0NOD6IvAbOQlGu_ERcg0-pVCtN_hCQYWLtb9phm3ieYtxCvlbfogIzC22k8ry_K30mBMjGzEPaGzls3MLC618WF6O08DVhMk_0S1p-zBupMXCOyzAnVCdOhv5E4SUuXrVEBXDMQZkc")' }}>
                                    <div className="h-full w-full bg-sindoor/20 group-hover:bg-transparent transition-all"></div>
                                </div>
                                <div className="aspect-square bg-cover bg-center rounded-[2rem] border-4 border-marigold/30 overflow-hidden group shadow-2xl mt-12"
                                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCo_r99QLy6pjU6hkjYlEDhMCGyRhArhqoj4upacanZW3z2RwngQWxanY6pND32DDsuCTyNgui4EXPt7EanvEOp-aYK-wqkDdf7qbF4NkCx5Tlefl3Ga71L-mUfHgjbqpKwMLl0LKxIu2RPpHJ3YkZMMwtWV_aSMdbJX8XOcFxcICqf_92OmR0pV1rpFapaVx4NTlYr8-7PRCViBTLHHL8QmcORGcMEhEQ5ICIQXRD3x-2qph6_Ch2nyEzc2ZPQZy0VjfUBQh7Ns2U")' }}>
                                    <div className="h-full w-full bg-sindoor/20 group-hover:bg-transparent transition-all"></div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="toran-border opacity-50 absolute bottom-0 rotate-180"></div>
        </section>
    );
};

export default ChadawaSection;
