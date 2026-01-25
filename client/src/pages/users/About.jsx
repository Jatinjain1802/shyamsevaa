import { FiUser, FiHeart, FiGlobe } from "react-icons/fi";

export default function About() {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative pt-32 pb-20 bg-gray-900 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <img src="https://images.unsplash.com/photo-1545642412-2d4e13024846?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover" alt="Temple Background" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">About ShyamSeva</h1>
                    <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Bridging the gap between devotees and the divine through technology and tradition.
                    </p>
                </div>
            </div>

            {/* Mission Section */}
            <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">Our Mission</h2>
                        <div className="w-20 h-1 bg-orange-500 mb-6"></div>
                        <p className="text-gray-600 leading-8 mb-6 text-lg">
                            At ShyamSeva, we believe that spirituality should be accessible to everyone, everywhere.
                            In today's fast-paced world, maintaining a connection with our roots and rituals can be challenging.
                        </p>
                        <p className="text-gray-600 leading-8 text-lg">
                            Our mission is to bring the sanctity of India's most revered temples to your doorstep.
                            Whether it's booking a specific Pooja, offering Chadawa, or simply viewing the deity's darshan,
                            we make it seamless and authentic.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4 mt-8">
                            <img src="https://images.unsplash.com/photo-1604902396830-aca29e19b067?q=80&w=800&auto=format&fit=crop" className="rounded-2xl shadow-lg w-full h-64 object-cover" alt="Ritual" />
                            <img src="https://images.unsplash.com/photo-1620608930811-140c83a73c09?q=80&w=800&auto=format&fit=crop" className="rounded-2xl shadow-lg w-full h-48 object-cover" alt="Diya" />
                        </div>
                        <div className="space-y-4">
                            <img src="https://images.unsplash.com/photo-1594132863925-bf2d0996c56d?q=80&w=800&auto=format&fit=crop" className="rounded-2xl shadow-lg w-full h-48 object-cover" alt="Idol" />
                            <img src="https://images.unsplash.com/photo-1621832009259-71285038dc3c?q=80&w=800&auto=format&fit=crop" className="rounded-2xl shadow-lg w-full h-64 object-cover" alt="Flower" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="bg-orange-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 font-serif">Why Choose Us?</h2>
                        <p className="text-gray-500 mt-4">Values that drive our service to you.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="bg-white p-8 rounded-2xl shadow-sm text-center hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-600 text-2xl">
                                <FiGlobe />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Authentic Connections</h3>
                            <p className="text-gray-600">Direct partnerships with registered temples and verified Pandits to ensure rituals are performed exactly as per scriptures.</p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm text-center hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600 text-2xl">
                                <FiHeart />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Devotee First</h3>
                            <p className="text-gray-600">Your satisfaction and spiritual peace are our top priorities. We offer dedicated support for all your queries.</p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm text-center hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600 text-2xl">
                                <FiUser />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Seamless Experience</h3>
                            <p className="text-gray-600">A modern digital platform that makes booking poojas as easy as shopping online, without compromising on sanctity.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer / CTA mockup */}
            <div className="py-20 text-center">
                <h2 className="text-3xl font-bold mb-6 font-serif">Join our Spiritual Community</h2>
                <p className="text-gray-500 mb-8">Follow us on social media for daily darshans and updates.</p>
                <button className="btn-primary-custom px-8 py-3 rounded-full text-lg">Connect With Us</button>
            </div>
        </div>
    );
}
