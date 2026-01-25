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
            <div className="flex items-center justify-center min-h-screen pt-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-4 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Breadcrumb */}
                <div className="py-4 text-sm text-gray-500 font-medium">
                    <Link to="/" className="hover:text-orange-600 transition-colors">Home</Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900">Chadawas</span>
                </div>

                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-serif">
                        Sacred Chadawas
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Offer your devotion through sacred items. Send your love and prayers to the deity with our verified chadawa services.
                    </p>
                    <div className="w-24 h-1 bg-orange-500 mx-auto mt-6 rounded-full"></div>
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
                    <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-500">
                            <FiGift className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Blessings Available</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">
                            We are curating special offerings for you. Please check back later for updated chadawa lists.
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
}
