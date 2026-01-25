import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../utils/axios";
import UnifiedCard from "../../components/common/UnifiedCard";

export default function TempleChadawas() {
    const { id: templeId } = useParams();
    const [chadawas, setChadawas] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchChadawas = async () => {
        try {
            const res = await api.get(`/chadawas/temple/${templeId}`);
            setChadawas(res.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChadawas();
    }, [templeId]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link to={`/temples/${templeId}`} className="text-orange-600 font-medium hover:underline mb-2 inline-block">← Back to Temple</Link>
                    <h1 className="text-3xl font-bold text-gray-900">Available Chadawas</h1>
                    <p className="text-gray-500">Sacred offerings available at this temple.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {chadawas.map((c) => (
                        <UnifiedCard
                            key={c.id}
                            image={c.image}
                            title={c.title}
                            description={c.description}
                            link={`/chadawas/${c.id}`}
                            buttonText="Offer Now"
                            className="h-full"
                        />
                    ))}

                    {chadawas.length === 0 && (
                        <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-500">No chadawas available for this temple currently.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
