import React from "react";
import { FaStar } from "react-icons/fa";

const TestimonialsSection = () => {
    return (
        <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">What Devotees Say</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            text: "ShyamSeva made it so easy to book a Pandit for my Griha Pravesh. The entire process was smooth and the Panditji was very knowledgeable.",
                            author: "Anjali Gupta",
                            location: "Bangalore"
                        },
                        {
                            text: "I was looking for a way to offer Chadawa at Kashi Vishwanath while being in the US. This platform is a blessing.",
                            author: "Rajesh Kumar",
                            location: "USA"
                        },
                        {
                            text: "Excellent service. The live streaming quality was great and I felt like I was physically present for the pooja.",
                            author: "Sunita Reddy",
                            location: "Hyderabad"
                        }
                    ].map((t, i) => (
                        <div key={i} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex text-orange-400 gap-1 text-sm mb-4">
                                {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                            </div>
                            <p className="text-gray-600 italic mb-6 leading-relaxed">"{t.text}"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500">
                                    {t.author[0]}
                                </div>
                                <div>
                                    <h5 className="font-bold text-gray-900 text-sm">{t.author}</h5>
                                    <p className="text-xs text-gray-500">{t.location}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
