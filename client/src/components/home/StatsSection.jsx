import React, { useEffect, useState } from "react";

/**
 * AnimatedCounter Component
 * Simple hook-based counter for stats
 */
const AnimatedCounter = ({ end, duration = 2000 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const increment = end / (duration / 16); // 60fps
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.ceil(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [end, duration]);

    return <span>{count}+</span>;
};

const StatsSection = () => {
    return (
        <div className="bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
                    {[
                        { number: 500, label: "Verified Pandits" },
                        { number: 50, label: "Partner Temples" },
                        { number: 15000, label: "Poojas Completed" },
                        { number: 4.9, label: "User Rating", isFloat: true },
                    ].map((stat, index) => (
                        <div key={index} className="px-4">
                            <div className="text-4xl font-bold text-gray-900 font-serif mb-1">
                                {stat.isFloat ? stat.number : <AnimatedCounter end={stat.number} />}
                                {stat.isFloat ? "" : "+"}
                            </div>
                            <div className="text-sm text-gray-500 uppercase tracking-widest font-medium">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StatsSection;
