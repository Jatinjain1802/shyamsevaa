import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/axios";

export default function PoojaDetail() {
    const { poojaId } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedAddons, setSelectedAddons] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        api.get(`/poojas/${poojaId}`).then((res) => {
            setData(res.data.data);
        });
    }, [poojaId]);

    if (!data)
        return (
            <div className="min-h-screen flex items-center justify-center">
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
        alert(`Proceeding to book for ₹${totalPrice()}! 🚀`);
        // navigate("/checkout", { state: payload })
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Hero Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Image */}
                        <div className="w-full md:w-1/3 h-64 md:h-80 rounded-2xl overflow-hidden shadow-md">
                            <img
                                src={pooja.image}
                                alt={pooja.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            />
                        </div>

                        {/* Title & Description */}
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                                {pooja.title}
                            </h1>
                            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
                                {pooja.description}
                            </p>
                            {temples && temples.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                        Available at Temple{temples.length > 1 ? "s" : ""}
                                    </h3>
                                    <div className="flex flex-wrap gap-4">
                                        {temples.map((temple) => (
                                            <div
                                                key={temple.id}
                                                className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-2 pr-4 hover:bg-gray-100 transition duration-200 cursor-pointer"
                                                onClick={() => navigate(`/temples/${temple.id}`)}
                                            >
                                                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                                                    {temple.image ? (
                                                        <img
                                                            src={temple.image}
                                                            alt={temple.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold">
                                                            {temple.title[0]}
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="font-medium text-gray-800">
                                                    {temple.title}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {pooja.benefits && (
                                <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-100">
                                    <h3 className="text-orange-800 font-semibold mb-2">Key Benefits</h3>
                                    <p className="text-gray-700">{pooja.benefits}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* LEFT COLUMN - CONTENT */}
                    <div className="lg:col-span-2 space-y-10">

                        {/* 1. SELECT PACKAGE */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                <span className="bg-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">1</span>
                                Select Sankalp (Package)
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {variants.length > 0 ? (
                                    variants.map((v) => (
                                        <div
                                            key={v.id}
                                            onClick={() => setSelectedVariant(v)}
                                            className={`relative rounded-xl border-2 p-5 cursor-pointer transition-all duration-200 shadow-sm
                        ${selectedVariant?.id === v.id
                                                    ? "border-orange-500 bg-orange-50 ring-2 ring-orange-200"
                                                    : "border-gray-200 bg-white hover:border-orange-300"
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-bold text-lg text-gray-800">
                                                    {v.persons} Person{v.persons > 1 ? "s" : ""}
                                                </span>
                                                {selectedVariant?.id === v.id && (
                                                    <span className="text-orange-600">
                                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-500 text-sm mb-4 min-h-[40px]">
                                                {v.description || "Includes full rituals and prasadam delivery."}
                                            </p>
                                            <div className="font-bold text-xl text-gray-900">
                                                ₹{Number(v.price).toLocaleString()}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic">No packages available.</p>
                                )}
                            </div>
                        </section>

                        {/* 2. ADD-ONS */}
                        {addons.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                    <span className="bg-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">2</span>
                                    Add Extra Offerings (Optional)
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {addons.map((a) => {
                                        const isSelected = selectedAddons.find((x) => x.id === a.id);
                                        return (
                                            <div
                                                key={a.id}
                                                onClick={() => toggleAddon(a)}
                                                className={`group cursor-pointer rounded-xl border-2 overflow-hidden transition-all duration-200
                          ${isSelected
                                                        ? "border-orange-500 bg-orange-50 ring-2 ring-orange-200 shadow-md"
                                                        : "border-gray-200 bg-white hover:border-gray-300 shadow-sm"
                                                    }`}
                                            >
                                                <div className="flex">
                                                    {/* Addon Image */}
                                                    <div className="w-24 h-24 sm:w-32 sm:h-auto bg-gray-200 shrink-0">
                                                        {a.image ? (
                                                            <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center p-2">No Image</div>
                                                        )}
                                                    </div>

                                                    <div className="p-4 flex flex-col justify-center flex-1">
                                                        <h4 className="font-bold text-gray-900 mb-1">{a.title}</h4>
                                                        {a.description && (
                                                            <p className="text-xs text-gray-500 mb-2 line-clamp-2 leading-relaxed">
                                                                {a.description}
                                                            </p>
                                                        )}
                                                        <div className="flex justify-between items-center mt-auto">
                                                            <span className="text-orange-700 font-bold">₹{Number(a.price).toLocaleString()}</span>
                                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-orange-600 bg-orange-600' : 'border-gray-300'}`}>
                                                                {isSelected && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                    </div>

                    {/* RIGHT COLUMN - STICKY SUMMARY */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                            <div className="bg-gray-900 text-white p-4 text-center">
                                <h3 className="font-bold text-lg">Booking Summary</h3>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Selected Item Details */}
                                <div>
                                    <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-2">Package</p>
                                    {selectedVariant ? (
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-800 font-medium">{selectedVariant.persons} Person{selectedVariant.persons > 1 ? "s" : ""}</span>
                                            <span className="font-bold">₹{Number(selectedVariant.price).toLocaleString()}</span>
                                        </div>
                                    ) : (
                                        <div className="text-gray-400 italic text-sm">No package selected</div>
                                    )}
                                </div>

                                {/* Addons List */}
                                {selectedAddons.length > 0 && (
                                    <div className="pt-4 border-t border-gray-100">
                                        <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-2">Add-ons</p>
                                        <div className="space-y-2">
                                            {selectedAddons.map((addon, idx) => (
                                                <div key={idx} className="flex justify-between text-sm">
                                                    <span className="text-gray-600">{addon.title}</span>
                                                    <span className="font-medium">₹{Number(addon.price).toLocaleString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Total */}
                                <div className="pt-4 border-t-2 border-dashed border-gray-200 flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-900">Total Payable</span>
                                    <span className="text-2xl font-bold text-orange-600">₹{totalPrice().toLocaleString()}</span>
                                </div>

                                {/* Action */}
                                <button
                                    onClick={handleBookNow}
                                    disabled={!selectedVariant}
                                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform active:scale-95
                            ${selectedVariant
                                            ? "bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700"
                                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        }`}
                                >
                                    {selectedVariant ? "Proceed to Book" : "Select a Package"}
                                </button>

                                <p className="text-xs text-center text-gray-400 mt-2">
                                    Secure payment powered by Razorpay
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
