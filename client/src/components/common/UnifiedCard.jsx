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
            className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full ${className}`}
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
                        <FiImage className="w-8 h-8 mb-2 opacity-50" />
                        <span className="text-sm">No Image Available</span>
                    </div>
                )}

                {/* Overlay (Visible on Hover) */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <span className="p-6 text-white font-medium flex items-center gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        {buttonText} <FiArrowRight />
                    </span>
                </div>

                {/* Price Tag (if provided) */}
                {price && (
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-900 shadow-sm">
                        ₹{price.toLocaleString()}
                    </div>
                )}

                {/* Optional Tag/Category */}
                {tag && (
                    <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm">
                        {tag}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors mb-2 line-clamp-1">
                    {title}
                </h3>

                <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-1 leading-relaxed">
                    {description || "No description available."}
                </p>

                {/* Footer Line */}
                {/* <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500 mt-auto">
                    <span className="group-hover:text-orange-600 font-medium transition-colors">
                        {buttonText}
                    </span>
                    <FiArrowRight className="transform group-hover:translate-x-1 transition-transform duration-300 text-gray-300 group-hover:text-orange-600" />
                </div> */}
            </div>
        </Link>
    );
}
