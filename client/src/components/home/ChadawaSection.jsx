import { ChevronRight, Heart } from "lucide-react";
import UnifiedCard from '../common/UnifiedCard';
import { useEffect, useState } from "react";
import api from "../../utils/axios";
import { generateSlug } from "../../utils/slugify";
import { Link } from "react-router-dom";
import { MdVolunteerActivism } from "react-icons/md";

export default function ChadawaSection() {
    const [chadawas, setChadawas] = useState([]);

    useEffect(() => {
        const fetchChadawas = async () => {
            try {
                const res = await api.get("/chadawas?limit=3");
                setChadawas(res.data.data ? res.data.data.slice(0, 3) : []);
            } catch (err) {
                console.error("Failed to fetch chadawas", err);
            }
        };
        fetchChadawas();
    }, []);

    if (!chadawas.length) return null;

    return (
        <section className="py-20 bg-white relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF9933' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                            <MdVolunteerActivism className="text-marigold w-5 h-5" />
                            <span className="text-marigold font-bold tracking-widest uppercase text-sm"> Sacred Offerings</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-serif text-sindoor mb-4">
                            Popular Chadawas
                        </h2>
                        <p className="text-lg text-stone-600 max-w-xl font-sans italic">
                            Offer sacred items to your beloved deities. We ensure your offerings reach the temple sanctum with devotion.
                        </p>
                    </div>

                    <Link
                        to="/chadawas"
                        className="hidden md:flex items-center px-6 py-3 bg-white border-2 border-marigold text-marigold rounded-full font-bold hover:bg-marigold hover:text-white transition-all duration-300 group"
                    >
                        View All Offerings
                        <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {chadawas.map((item) => (
                        <UnifiedCard
                            key={item.id}
                            image={item.image}
                            title={item.title}
                            description={item.description}
                            link={`/chadawas/${generateSlug(item.title, item.id)}`}
                            buttonText="Send Offering"
                        />
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <Link
                        to="/chadawas"
                        className="inline-flex items-center px-6 py-3 bg-white border-2 border-marigold text-marigold rounded-full font-bold hover:bg-marigold hover:text-white transition-all duration-300 group"
                    >
                        View All Offerings
                        <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
