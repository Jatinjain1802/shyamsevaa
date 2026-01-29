import React from "react";
import { Link } from "react-router-dom";
import { FaOm, FaPlaceOfWorship, FaGift, FaArrowRight } from "react-icons/fa";

const ServicesSection = () => {
    return (
        <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Our Core Services</h2>
                    <div className="w-20 h-1 bg-orange-500 mx-auto rounded-full"></div>
                    <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                        Comprehensive spiritual solutions designed for your peace of mind.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Pooja Card */}
                    <Link to="/poojas" className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                        <div className="h-64 overflow-hidden relative">
                            <img
                                src="https://images.unsplash.com/photo-1629814249584-bd4d053cf0e7d?q=80&w=800&auto=format&fit=crop"
                                alt="Pooja"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-sm">
                                <FaOm className="text-2xl text-orange-600" />
                            </div>
                        </div>
                        <div className="p-8 flex-1 flex flex-col">
                            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3">Online Poojas</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed flex-1">
                                Connect with verified pandits for personalized Vedic rituals performed at auspicious times.
                            </p>
                            <div className="font-semibold text-orange-600 flex items-center gap-2 group-hover:gap-4 transition-all">
                                Book Now <FaArrowRight />
                            </div>
                        </div>
                    </Link>

                    {/* Temple Card */}
                    <Link to="/temples" className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                        <div className="h-64 overflow-hidden relative">
                            <img
                                src="https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=800&auto=format&fit=crop"
                                alt="Temples"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-sm">
                                <FaPlaceOfWorship className="text-2xl text-orange-600" />
                            </div>
                        </div>
                        <div className="p-8 flex-1 flex flex-col">
                            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3">Temple Connect</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed flex-1">
                                Discover historical temples, view darshan timings, and plan your spiritual visits effortlessly.
                            </p>
                            <div className="font-semibold text-orange-600 flex items-center gap-2 group-hover:gap-4 transition-all">
                                Explore <FaArrowRight />
                            </div>
                        </div>
                    </Link>

                    {/* Chadawa Card */}
                    <Link to="/chadawas" className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                        <div className="h-64 overflow-hidden relative">
                            <img
                                src="https://images.unsplash.com/photo-1585640243160-b989679f0f35?q=80&w=800&auto=format&fit=crop"
                                alt="Chadawa"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-sm">
                                <FaGift className="text-2xl text-orange-600" />
                            </div>
                        </div>
                        <div className="p-8 flex-1 flex flex-col">
                            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3">E-Chadawa</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed flex-1">
                                Send offerings to deities across India and have the sacred Prasad delivered to your doorstep.
                            </p>
                            <div className="font-semibold text-orange-600 flex items-center gap-2 group-hover:gap-4 transition-all">
                                Send Offering <FaArrowRight />
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;
