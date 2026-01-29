import { Link } from "react-router-dom";
import { FiArrowRight, FiImage } from "react-icons/fi";

export default function UnifiedCard({
    image,
    title,
    description,
    link,
    price,
    tag,
    buttonText = "View Details",
    className = "",
}) {
    return (
        <Link
            to={link}
            className={`group bg-white rounded-t-[40px] rounded-b-xl overflow-hidden shadow-xl border-b-4 border-sindoor hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full ${className}`}
        >
            {/* Image Container */}
            <div className="relative h-64 overflow-hidden bg-gray-100">
                {image ? (
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4">
                        <span className="material-symbols-outlined text-4xl mb-2 opacity-50">image</span>
                        <span className="text-sm">No Image Available</span>
                    </div>
                )}

                {/* Overlay (Visible on Hover) */}
                <div className="absolute inset-0 bg-transparent flex items-end">
                </div>

                {/* Price Tag (if provided) */}
                {price && (
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-sindoor shadow-sm">
                        ₹{price.toLocaleString()}
                    </div>
                )}

                {/* Optional Tag/Category */}
                {tag && (
                    <div className="absolute top-4 left-4 bg-sindoor text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                        {tag}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-serif text-sindoor group-hover:text-marigold transition-colors mb-2 line-clamp-1">
                    {title}
                </h3>

                <p className="text-stone-500 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed font-sans italic">
                    {description || "No description available."}
                </p>

                {/* Footer Line / Button */}
                <div className="w-full bg-marigold text-white font-bold py-3 rounded-xl group-hover:bg-sindoor transition-colors shadow-lg text-center mt-auto flex items-center justify-center gap-2">
                    {buttonText.toUpperCase()}
                </div>
            </div>
        </Link>
    );
}
