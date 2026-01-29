import { useEffect, useState } from "react";
import api from "../../utils/axios";
import { Link } from "react-router-dom";
import { FiGift } from "react-icons/fi";

import UnifiedCard from "../../components/common/UnifiedCard";

export default function Chadawas() {
    const [chadawas, setChadawas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChadawas = async () => {
            try {
                // User-facing endpoint
                const res = await api.get("/chadawas");
                setChadawas(res.data.data || []);
            } catch (err) {
                console.error("Failed to load chadawas", err);
                setChadawas([]);
            } finally {
                setLoading(false);
            }
        };

        fetchChadawas();
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
                    <span className="text-sindoor">Chadawas</span>
                </div>

                {/* Header Section */}
                <div className="text-center mb-16">
                    <span className="material-symbols-outlined text-marigold text-5xl mb-2">potted_plant</span>
                    <h1 className="text-4xl md:text-5xl text-sindoor mb-4 font-serif">
                        Sacred Chadawas
                    </h1>
                    <p className="text-lg text-stone-600 max-w-2xl mx-auto font-sans italic">
                        Offer your devotion through sacred items. Send your love and prayers to the deity with our verified chadawa services.
                    </p>
                    <div className="w-24 h-1 bg-marigold mx-auto mt-6 rounded-full"></div>
                </div>

                {/* Chadawas Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {chadawas.map((item) => (
                        <UnifiedCard
                            key={item.id}
                            image={item.image}
                            title={item.title}
                            description={item.description}
                            link={`/chadawas/${item.id}`}
                            buttonText="Offer Now"
                            className="h-full"
                        />
                    ))}
                </div>

                {/* Empty State */}
                {chadawas.length === 0 && (
                    <div className="text-center py-24 bg-white/60 rounded-[3rem] shadow-sm border border-marigold/30 backdrop-blur-sm">
                        <div className="w-20 h-20 bg-paper-bg rounded-full flex items-center justify-center mx-auto mb-6 text-sindoor border border-marigold/20">
                            <span className="material-symbols-outlined text-4xl">volunteer_activism</span>
                        </div>
                        <h3 className="text-xl font-bold text-sindoor mb-2 font-serif">No Blessings Available</h3>
                        <p className="text-stone-500 max-w-sm mx-auto font-sans italic">
                            We are curating special offerings for you. Please check back later for updated chadawa lists.
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
}
