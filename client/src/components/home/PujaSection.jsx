import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/axios";
import UnifiedCard from "../common/UnifiedCard";

const PujaSection = () => {
    const [poojas, setPoojas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPoojas = async () => {
            try {
                const res = await api.get("/poojas");
                // Limit to 4 items for the home page section
                setPoojas(res.data.data ? res.data.data.slice(0, 4) : []);
            } catch (err) {
                console.error("Failed to load poojas", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPoojas();
    }, []);

    return (
        <>
            <div className="toran-border rotate-180"></div>
            <section className="py-20 px-6 md:px-10">
                <div className="max-w-[1280px] mx-auto">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                        <div className="relative">
                            <span className="material-symbols-outlined text-haldi text-4xl mb-2">flare</span>
                            <h2 className="text-5xl text-sindoor tracking-wide font-serif">Sacred Puja Services</h2>
                            <div className="h-1 w-32 bg-marigold mt-2"></div>
                        </div>
                        <Link to="/poojas" className="bg-haldi text-sindoor font-bold px-8 py-3 rounded-full flex items-center gap-2 hover:bg-marigold hover:text-white transition-all shadow-md">
                            VIEW ALL RITUALS <span className="material-symbols-outlined">keyboard_double_arrow_right</span>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center w-full py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sindoor"></div>
                        </div>
                    ) : poojas.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {poojas.map((pooja) => (
                                <UnifiedCard
                                    key={pooja.id}
                                    image={pooja.image}
                                    title={pooja.title}
                                    description={pooja.description}
                                    link={`/poojas/${pooja.id}`}
                                    price={pooja.basePrice || pooja.price} // Assuming price might be in basePrice or price
                                    tag={pooja.tag} // Assuming tag might exist, or could be empty
                                    buttonText="BOOK SEVA NOW"
                                />
                            ))}
                        </div>
                    ) : (
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
            </section>
        </>
    );
};

export default PujaSection;
