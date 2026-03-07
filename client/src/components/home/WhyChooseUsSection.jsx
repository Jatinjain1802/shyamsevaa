import React from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const WhyChooseUsSection = () => {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                            <img
                                src="https://plus.unsplash.com/premium_photo-1682092591636-224424388dc8?q=80&w=800&auto=format&fit=crop"
                                alt="Why Choose Us"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Decorative border element */}
                        <div className="absolute inset-0 border-2 border-orange-500 rounded-3xl translate-x-4 translate-y-4 -z-10 bg-orange-50"></div>
                    </div>

                    <div>
                        <div className="text-orange-600 font-bold uppercase tracking-wider text-sm mb-2">Why Choose ShyamPuja</div>
                        <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6 leading-tight">
                            Bridging Tradition <br /> with Modern Convenience
                        </h2>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            We ensure that your spiritual journey is seamless, authentic, and secure. Our platform connects you directly with trusted religious institutions and vedic experts.
                        </p>

                        <div className="space-y-6">
                            {[
                                { title: "Authenticated Pandits", desc: "100% verified Vedic experts." },
                                { title: "Secure Transactions", desc: "Bank-grade security for all bookings." },
                                { title: "Live Streaming", desc: "Watch your rituals live in HD." },
                                { title: "Prompt Support", desc: "24/7 assistance for your queries." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <FaCheckCircle className="text-green-500 text-xl flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900">{item.title}</h4>
                                        <p className="text-gray-500 text-sm">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10">
                            <Link to="/about" className="text-orange-600 font-semibold hover:text-orange-700 transition-colors">
                                Learn more about our mission &rarr;
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUsSection;
