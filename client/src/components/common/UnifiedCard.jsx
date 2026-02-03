import { Link } from "react-router-dom";
import { ArrowRight, Image as ImageIcon, MapPin } from "lucide-react";

export default function UnifiedCard({
    image,
    title,
    description,
    link,
    price,
    tag,
    location,
    buttonText = "View Details",
    className = "",
}) {
    return (
        <Link
            to={link}
            className={`group bg-white rounded-t-[40px] rounded-b-xl overflow-hidden shadow-xl border-b-4 border-sindoor hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full ${className}`}
        >
            <div className="relative h-64 overflow-hidden bg-gray-100">
                {image ? (
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4">
                        <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                        <span className="text-sm">No Image Available</span>
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none">
                </div>

                {location && (
                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md text-sindoor px-3 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5 border border-sindoor/20">
                        <MapPin className="w-4 h-4" />
                        <span className="max-w-[200px] truncate">{location}</span>
                    </div>
                )}

                {price && (
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-bold text-sindoor shadow-lg border border-sindoor/20">
                        ₹{price.toLocaleString()}
                    </div>
                )}

                {tag && (
                    <div className="absolute top-4 left-4 bg-sindoor text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                        {tag}
                    </div>
                )}
            </div>

            <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-serif text-sindoor group-hover:text-marigold transition-colors mb-2 line-clamp-1">
                    {title}
                </h3>

                <p className="text-stone-500 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed font-sans italic">
                    {description || "No description available."}
                </p>

                <div className="w-full bg-marigold text-white font-bold py-3 rounded-xl group-hover:bg-sindoor transition-colors shadow-lg text-center mt-auto flex items-center justify-center gap-2">
                    {buttonText.toUpperCase()}
                </div>
            </div>
        </Link>
    );
}
