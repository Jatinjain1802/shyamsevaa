import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiShare2, FiMapPin, FiCheckCircle, FiInfo, FiChevronRight, FiUsers, FiClock, FiCalendar } from "react-icons/fi";
import api from "../../utils/axios";

export default function PoojaDetail() {
    const { poojaId } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedAddons, setSelectedAddons] = useState([]);
    const [activeTab, setActiveTab] = useState("about"); // about, benefits, temples

    useEffect(() => {
        window.scrollTo(0, 0);
        api.get(`/poojas/${poojaId}`).then((res) => {
            setData(res.data.data);
            // Auto-select the first variant if available
            if (res.data.data.variants && res.data.data.variants.length > 0) {
                setSelectedVariant(res.data.data.variants[0]);
            }
        });
    }, [poojaId]);

    if (!data)
        return (
            <div className="min-h-screen flex items-center justify-center bg-orange-50/30">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        );

    const { pooja, variants, addons, temples } = data;

    /* ======================
         HANDLERS
      ====================== */

    const toggleAddon = (addon) => {
        const exists = selectedAddons.find((a) => a.id === addon.id);
        if (exists) {
            setSelectedAddons(selectedAddons.filter((a) => a.id !== addon.id));
        } else {
            setSelectedAddons([...selectedAddons, addon]);
        }
    };

    const totalPrice = () => {
        let total = selectedVariant ? Number(selectedVariant.price) : 0;
        selectedAddons.forEach((a) => {
            total += Number(a.price);
        });
        return total;
    };

    const handleBookNow = () => {
        if (!selectedVariant) {
            alert("Please select a Sankalp option to proceed.");
            return;
        }

        const payload = {
            poojaId: pooja.id,
            variantId: selectedVariant.id,
            addons: selectedAddons.map((a) => a.id),
            totalAmount: totalPrice(),
        };

        console.log("BOOKING PAYLOAD", payload);
        alert(`Proceeding to book for ₹${totalPrice()}! 🚀\n(This would navigate to Checkout)`);
        // navigate("/checkout", { state: payload })
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: pooja.title,
                text: pooja.description,
                url: window.location.href,
            });
        } else {
            alert("Share link copied to clipboard!");
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-32 lg:pb-10 font-sans">

            {/* MOBILE TOP BAR (Transparent on scroll could be added, straightforward for now) */}
            <div className="lg:hidden fixed top-0 w-full z-20 flex justify-between items-center p-4">
                <button
                    onClick={() => navigate(-1)}
                    className="bg-white/90 backdrop-blur-md p-2 rounded-full shadow-sm text-gray-800 hover:bg-white transition"
                >
                    <FiArrowLeft size={22} />
                </button>
                <button
                    onClick={handleShare}
                    className="bg-white/90 backdrop-blur-md p-2 rounded-full shadow-sm text-gray-800 hover:bg-white transition"
                >
                    <FiShare2 size={20} />
                </button>
            </div>

            {/* HERO SECTION */}
            <div className="relative w-full h-[40vh] lg:h-[50vh]">
                <div className="absolute inset-0 bg-gray-900">
                    <img
                        src={pooja.image}
                        alt={pooja.title}
                        className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-gray-50/90 lg:to-gray-50"></div>
                </div>
            </div>

            {/* MAIN CONTENT CONTAINER */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* LEFT COLUMN: DETAILS & PACKAGES */}
                    <div className="flex-1">

                        {/* Title Card */}
                        <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8 mb-6 border border-gray-100">
                            <div className="flex flex-col gap-2">
                                <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider w-fit">
                                    Special Puja
                                </span>
                                <h1 className="text-2xl lg:text-4xl font-serif font-bold text-gray-900 leading-tight">
                                    {pooja.title}
                                    {temples && temples.length > 0 && (
                                        <span className="text-gray-500 font-sans text-xl lg:text-2xl block lg:inline lg:ml-2 font-normal">
                                            | {temples[0].title}
                                        </span>
                                    )}
                                </h1>
                                <div className="flex items-center text-gray-500 text-sm mt-1 gap-4">
                                    <span className="flex items-center gap-1">
                                        <FiClock className="text-orange-500" /> 2-3 Hours
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FiCalendar className="text-orange-500" /> Daily
                                    </span>
                                </div>
                            </div>

                            {/* TABS */}
                            <div className="flex items-center gap-6 mt-8 border-b border-gray-100 pb-1 overflow-x-auto no-scrollbar">
                                <button
                                    onClick={() => setActiveTab("about")}
                                    className={`pb-3 text-sm font-semibold whitespace-nowrap transition-all ${activeTab === 'about' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    About Puja
                                </button>
                                <button
                                    onClick={() => setActiveTab("benefits")}
                                    className={`pb-3 text-sm font-semibold whitespace-nowrap transition-all ${activeTab === 'benefits' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Benefits
                                </button>
                                {temples && temples.length > 0 && (
                                    <button
                                        onClick={() => setActiveTab("temples")}
                                        className={`pb-3 text-sm font-semibold whitespace-nowrap transition-all ${activeTab === 'temples' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        Temples
                                    </button>
                                )}
                            </div>

                            {/* TAB CONTENT */}
                            <div className="mt-6 text-gray-600 leading-relaxed">
                                {activeTab === 'about' && (
                                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <p>{pooja.description}</p>
                                    </div>
                                )}
                                {activeTab === 'benefits' && (
                                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        {pooja.benefits ? (
                                            <div className="space-y-3">
                                                {/* Split benefits by sentence or comma if possible, or just display paragraph */}
                                                <p className="mb-4">Performing this puja brings approximately:</p>
                                                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                                                    <p className="text-orange-900 font-medium">{pooja.benefits}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="italic text-gray-400">No specific benefits listed.</p>
                                        )}
                                    </div>
                                )}
                                {activeTab === 'temples' && temples && temples.length > 0 && (
                                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 grid md:grid-cols-2 gap-4">
                                        {temples.map((temple) => (
                                            <div
                                                key={temple.id}
                                                onClick={() => navigate(`/temples/${temple.id}`)}
                                                className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-orange-200 cursor-pointer transition-all group"
                                            >
                                                <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                                                    {temple.image ? (
                                                        <img src={temple.image} alt={temple.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-orange-100 text-orange-600 font-bold">T</div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-gray-900 truncate group-hover:text-orange-700 transition-colors">{temple.title}</h4>
                                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                                        <FiMapPin size={10} /> View Temple
                                                    </p>
                                                </div>
                                                <FiChevronRight className="text-gray-300 group-hover:text-orange-500" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* PACKAGES SELECTION */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="bg-orange-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                                Select Sankalp
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {variants.map((v) => {
                                    const isSelected = selectedVariant?.id === v.id;
                                    return (
                                        <div
                                            key={v.id}
                                            onClick={() => setSelectedVariant(v)}
                                            className={`relative p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between
                                            ${isSelected
                                                    ? "border-orange-500 bg-orange-50/50 shadow-md ring-2 ring-orange-100"
                                                    : "border-gray-200 bg-white hover:border-orange-200 hover:shadow-sm"}`}
                                        >

                                            {isSelected && (
                                                <div className="absolute top-2 right-2 text-orange-600 bg-white rounded-full p-1 shadow-sm">
                                                    <FiCheckCircle size={20} fill="currentColor" className="text-orange-100 stroke-orange-600" />
                                                </div>
                                            )}

                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>
                                                        <FiUsers size={18} />
                                                    </div>
                                                    <span className={`font-bold text-lg ${isSelected ? 'text-orange-900' : 'text-gray-800'}`}>
                                                        {v.persons} Person{v.persons > 1 ? "s" : ""}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                                                    {v.description || "Includes rituals, mantra chanting, and prasadam delivery to your doorstep."}
                                                </p>
                                            </div>

                                            <div className="pt-4 border-t border-gray-100/50 flex justify-between items-end">
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-gray-400 font-medium uppercase">Contribution</span>
                                                    <span className="text-xl font-extrabold text-gray-900">
                                                        ₹{Number(v.price).toLocaleString()}
                                                    </span>
                                                </div>
                                                {/* <button className={`text-sm font-semibold underline ${isSelected ? 'text-orange-600' : 'text-gray-400'}`}>
                                                    Select
                                                </button> */}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ADDONS SELECTION */}
                        {addons && addons.length > 0 && (
                            <div className="mb-10">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <span className="bg-orange-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                                    Extra Offerings <span className="text-gray-400 text-sm font-normal">(Optional)</span>
                                </h3>
                                <div className="space-y-4">
                                    {addons.map((a) => {
                                        const isSelected = selectedAddons.find((x) => x.id === a.id);
                                        return (
                                            <div
                                                key={a.id}
                                                onClick={() => toggleAddon(a)}
                                                className={`flex items-center p-3 rounded-xl border border-gray-200 bg-white cursor-pointer transition-all hover:shadow-sm
                                                ${isSelected ? "border-orange-500 bg-orange-50/30" : ""}`}
                                            >
                                                <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0 mr-4">
                                                    {a.image ? (
                                                        <img src={a.image} alt={a.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <FiInfo />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-gray-900">{a.title}</h4>
                                                    <p className="text-xs text-gray-500 line-clamp-1">{a.description}</p>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <span className="font-bold text-gray-900">₹{Number(a.price).toLocaleString()}</span>
                                                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-orange-600 border-orange-600' : 'border-gray-300'}`}>
                                                        {isSelected && <FiCheckCircle className="text-white w-3 h-3" />}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* RIGHT COLUMN: BOOKING SUMMARY (Desktop Sticky) */}
                    <div className="lg:w-[380px] shrink-0 hidden lg:block">
                        <div className="sticky top-24 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                            <div className="bg-linear-to-r from-orange-600 to-red-600 p-6 text-white text-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
                                <h3 className="text-lg font-bold relative z-10">Booking Summary</h3>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Selected Package */}
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Package</p>
                                    {selectedVariant ? (
                                        <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center border border-gray-100">
                                            <div>
                                                <p className="font-bold text-gray-800">{selectedVariant.persons} Person{selectedVariant.persons > 1 ? "s" : ""}</p>
                                                <p className="text-xs text-gray-500">Sankalp Rituals</p>
                                            </div>
                                            <span className="font-bold text-lg text-gray-900">₹{Number(selectedVariant.price).toLocaleString()}</span>
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-400 italic text-center py-2 bg-gray-50 rounded-lg">Select a package</div>
                                    )}
                                </div>

                                {/* Selected Addons */}
                                {selectedAddons.length > 0 && (
                                    <div className="animate-in fade-in">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Add-ons</p>
                                        <div className="space-y-2">
                                            {selectedAddons.map((addon) => (
                                                <div key={addon.id} className="flex justify-between items-center text-sm p-2 hover:bg-gray-50 rounded-lg transition">
                                                    <span className="text-gray-600">{addon.title}</span>
                                                    <span className="font-semibold">₹{Number(addon.price).toLocaleString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Divider */}
                                <div className="border-t-2 border-dashed border-gray-100"></div>

                                {/* Total */}
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-900">Total Payable</span>
                                    <span className="text-3xl font-serif font-bold text-orange-600">₹{totalPrice().toLocaleString()}</span>
                                </div>

                                <button
                                    onClick={handleBookNow}
                                    disabled={!selectedVariant}
                                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-orange-200 hover:-translate-y-1 transition-all duration-300
                                    ${selectedVariant
                                            ? "bg-linear-to-r from-orange-500 to-red-600 text-white"
                                            : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                                >
                                    Proceed to Book
                                </button>

                                <p className="text-xs text-center text-gray-400 flex items-center justify-center gap-1">
                                    <FiCheckCircle /> 100% Secure Payment
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MOBILE FLOATING FOOTER (Sticky Bottom) */}
            <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)] p-4 px-6 z-50 pb-8 sm:pb-4">
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium uppercase mb-0.5">Total</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-gray-900">₹{totalPrice().toLocaleString()}</span>
                            {selectedVariant && <span className="text-xs text-gray-400">for {selectedVariant.persons} person(s)</span>}
                        </div>
                    </div>
                    <button
                        onClick={handleBookNow}
                        disabled={!selectedVariant}
                        className={`px-8 py-3 rounded-xl font-bold shadow-md transition-all
                        ${selectedVariant
                                ? "bg-linear-to-r from-orange-500 to-red-600 text-white"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                    >
                        Book Now
                    </button>
                </div>
            </div>

        </div>
    );
}
