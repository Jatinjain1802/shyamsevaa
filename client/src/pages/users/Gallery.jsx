import { useState } from "react";
import { FiImage, FiZoomIn } from "react-icons/fi";

const DUMMY_IMAGES = [
    { id: 1, src: "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?q=80&w=2070&auto=format&fit=crop", category: "Temples", title: "Sacred Architecture" },
    { id: 2, src: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1974&auto=format&fit=crop", category: "Rituals", title: "Morning Aarti" },
    { id: 3, src: "https://images.unsplash.com/photo-1542351336-d41138b134d1?q=80&w=2048&auto=format&fit=crop", category: "Deities", title: "Divine Grace" },
    { id: 4, src: "https://images.unsplash.com/photo-1606216794074-735e56c90d23?q=80&w=2070&auto=format&fit=crop", category: "Rituals", title: "Sacred Fire" },
    { id: 5, src: "https://images.unsplash.com/photo-1555461765-b1a7f0582264?q=80&w=2070&auto=format&fit=crop", category: "Temples", title: "Review of History" },
    { id: 6, src: "https://images.unsplash.com/photo-1579979393188-751280387538?q=80&w=2076&auto=format&fit=crop", category: "Offerings", title: "Fresh Flowers" },
];

const CATEGORIES = ["All", "Temples", "Rituals", "Deities", "Offerings"];

export default function Gallery() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [selectedImage, setSelectedImage] = useState(null);

    const filteredImages = activeCategory === "All"
        ? DUMMY_IMAGES
        : DUMMY_IMAGES.filter(img => img.category === activeCategory);

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4 font-serif">Spiritual Moments</h1>
                    <p className="text-gray-600 max-w-xl mx-auto">
                        Glimpses of divine rituals, majestic temples, and moments of pure devotion.
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300
                ${activeCategory === cat
                                    ? "bg-orange-600 text-white shadow-lg scale-105"
                                    : "bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Masonry-like Grid */}
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {filteredImages.map((img) => (
                        <div
                            key={img.id}
                            className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-pointer"
                            onClick={() => setSelectedImage(img)}
                        >
                            <img
                                src={img.src}
                                alt={img.title}
                                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <p className="text-white font-bold text-lg">{img.title}</p>
                                    <p className="text-orange-200 text-sm italic">{img.category}</p>
                                    <FiZoomIn className="text-white text-2xl mx-auto mt-2" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredImages.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500">No images found in this category.</p>
                    </div>
                )}

            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-5xl w-full max-h-[90vh]">
                        <img
                            src={selectedImage.src}
                            alt={selectedImage.title}
                            className="w-full h-full object-contain rounded-lg shadow-2xl"
                        />
                        <button
                            className="absolute top-4 right-4 text-white hover:text-orange-400 p-2"
                            onClick={() => setSelectedImage(null)}
                        >
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        <div className="absolute bottom-4 left-0 right-0 text-center text-white pb-4">
                            <h3 className="text-2xl font-serif font-bold">{selectedImage.title}</h3>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
