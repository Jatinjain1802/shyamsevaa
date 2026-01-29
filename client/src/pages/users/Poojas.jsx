import { useEffect, useState } from "react";
import api from "../../utils/axios";
import { Link } from "react-router-dom";
import { FiCalendar, FiClock } from "react-icons/fi";

import UnifiedCard from "../../components/common/UnifiedCard";

export default function Poojas() {
    const [poojas, setPoojas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPoojas = async () => {
            try {
                // User-facing endpoint
                const res = await api.get("/poojas");
                setPoojas(res.data.data || []);
            } catch (err) {
                console.error("Failed to load poojas", err);
                // Fallback or empty state handling
                setPoojas([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPoojas();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen pt-16 bg-paper-bg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sindoor"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-paper-bg pt-8 pb-12">
            <div className="hidden md:block toran-border mb-8"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Breadcrumb */}
                <div className="py-4 text-sm text-stone-500 font-bold tracking-widest uppercase mb-4">
                    <Link to="/" className="hover:text-sindoor transition-colors">Home</Link>
                    <span className="mx-2 text-marigold">/</span>
                    <span className="text-sindoor">Poojas</span>
                </div>

                {/* Header Section */}
                <div className="text-center mb-16">
                    <span className="material-symbols-outlined text-marigold text-5xl mb-2">self_improvement</span>
                    <h1 className="text-4xl md:text-5xl text-sindoor mb-4 font-serif">
                        Divine Poojas & Rituals
                    </h1>
                    <p className="text-lg text-stone-600 max-w-2xl mx-auto font-sans italic">
                        Book sacred poojas performed by experienced pandits at renowned temples.
                        Experience spiritual upliftment and divine blessings from the comfort of your home.
                    </p>
                    <div className="w-24 h-1 bg-marigold mx-auto mt-6 rounded-full"></div>
                </div>

                {/* Poojas Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {poojas.map((pooja) => (
                        <UnifiedCard
                            key={pooja.id}
                            image={pooja.image}
                            title={pooja.title}
                            description={pooja.description}
                            link={`/poojas/${pooja.id}`}
                            buttonText="Book Now"
                        />
                    ))}
                </div>

                {/* Empty State */}
                {poojas.length === 0 && (
                    <div className="text-center py-20 bg-white/60 rounded-[3rem] shadow-sm border border-marigold/30 backdrop-blur-sm">
                        <div className="w-16 h-16 bg-paper-bg rounded-full flex items-center justify-center mx-auto mb-4 text-sindoor text-2xl border border-marigold/20">
                            <span className="material-symbols-outlined">calendar_month</span>
                        </div>
                        <h3 className="text-xl font-bold text-sindoor mb-2 font-serif">No Poojas Available</h3>
                        <p className="text-stone-500 font-sans italic">
                            We are currently updating our spiritual offerings. Please check back soon.
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
}
