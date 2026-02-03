import { ChevronRight, Calendar } from "lucide-react";
import api from "../../utils/axios"; // Adjust path if needed
import { useEffect, useState } from "react";
import UnifiedCard from '../common/UnifiedCard';
import { generateSlug } from "../../utils/slugify";
import { Link } from "react-router-dom";

export default function PujaSection() {
    const [pujas, setPujas] = useState([]);

    useEffect(() => {
        // Fetch limited number of pujas for the home section
        const fetchPujas = async () => {
            try {
                const res = await api.get("/poojas?limit=3");
                setPujas(res.data.data ? res.data.data.slice(0, 3) : []);
            } catch (err) {
                console.error("Failed to fetch pujas for home section", err);
            }
        };
        fetchPujas();
    }, []);

    if (!pujas.length) return null;

    return (
        <section className="py-20 bg-orange-50/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                            <Calendar className="text-marigold w-5 h-5" />
                            <span className="text-marigold font-bold tracking-widest uppercase text-sm"> Sacred Rituals</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-serif text-sindoor mb-4">
                            Featured Poojas
                        </h2>
                        <p className="text-lg text-stone-600 max-w-xl font-sans italic">
                            Participate in powerful rituals performed at ancient temples. Book online and receive divine blessings.
                        </p>
                    </div>

                    <Link
                        to="/poojas"
                        className="hidden md:flex items-center px-6 py-3 bg-white border-2 border-marigold text-marigold rounded-full font-bold hover:bg-marigold hover:text-white transition-all duration-300 group"
                    >
                        View All Poojas
                        <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pujas.map((puja) => (
                        <UnifiedCard
                            key={puja.id}
                            image={puja.image}
                            title={puja.title}
                            description={puja.description}
                            link={`/poojas/${generateSlug(puja.title, puja.id)}`}
                            buttonText="Book Seva"
                            price={puja.variants?.[0]?.price}
                        />
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <Link
                        to="/poojas"
                        className="inline-flex items-center px-6 py-3 bg-white border-2 border-marigold text-marigold rounded-full font-bold hover:bg-marigold hover:text-white transition-all duration-300 group"
                    >
                        View All Poojas
                        <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
