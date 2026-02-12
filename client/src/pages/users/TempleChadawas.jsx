import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import api from "../../utils/axios";
import UnifiedCard from "../../components/common/UnifiedCard";
import { generatePureSlug, extractIdFromSlug, slugify } from "../../utils/slugify";

export default function TempleChadawas() {
    const { slug } = useParams();
    const location = useLocation();

    // Priority: 1. ID from location state, 2. ID from slug (old links), 3. Finding by slug string later
    const [templeId, setTempleId] = useState(location.state?.id || extractIdFromSlug(slug));

    const [chadawas, setChadawas] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchChadawas = async () => {
        try {
            setLoading(true);
            let finalId = templeId;

            // If we don't have an ID yet (manual URL enter with pure slug)
            if (!finalId) {
                console.log("Looking up temple by slug:", slug);
                const resAll = await api.get("/temples/public");
                const found = resAll.data.data.find(c => slugify(c.title) === slug);

                if (found) {
                    finalId = found.id;
                    setTempleId(found.id);
                }
            }

            if (!finalId) {
                setLoading(false);
                return;
            }

            const res = await api.get(`/chadawas/temple/${finalId}`);
            setChadawas(res.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChadawas();
    }, [templeId, slug]);

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
                    <Link to={`/temples/${slug}`} state={{ id: templeId }} className="text-orange-600 font-medium hover:underline mb-2 inline-block">← Back to Temple</Link>
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
                            link={`/chadawas/${generatePureSlug(c.title)}`}
                            state={{ id: c.id }}
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
