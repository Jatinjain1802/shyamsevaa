import React from "react";
import { Link } from "react-router-dom";

const CtaSection = () => {
    return (
        <section className="bg-orange-600 py-16">
            <div className="max-w-4xl mx-auto px-4 text-center text-white">
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Begin Your Spiritual Journey Today</h2>
                <Link to="/bookings" className="inline-block bg-white text-orange-600 font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors shadow-lg">
                    Get Started
                </Link>
            </div>
        </section>
    );
};

export default CtaSection;
