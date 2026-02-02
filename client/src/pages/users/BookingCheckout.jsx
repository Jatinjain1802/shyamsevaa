import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../utils/axios";

export default function BookingCheckout() {
    const location = useLocation();
    const navigate = useNavigate();

    // Get booking data from navigation state
    const bookingData = location.state;

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState("09:30 AM");
    const [sankalpDetails, setSankalpDetails] = useState([{
        name: "",
        name: "",
        gotra: ""
    }]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Redirect if no booking data
        if (!bookingData || !bookingData.pooja || !bookingData.selectedVariant) {
            navigate('/poojas');
            return;
        }

        // Initialize sankalp details based on variant persons
        const count = Number(bookingData.selectedVariant.persons) || 1;
        const initialDetails = [];
        for (let i = 0; i < count; i++) {
            initialDetails.push({ name: "", gotra: "" });
        }
        setSankalpDetails(initialDetails);
    }, [bookingData, navigate]);

    if (!bookingData) {
        return null;
    }

    const { pooja, selectedVariant, selectedAddons, totalPrice } = bookingData;

    const updateSankalpDetail = (index, field, value) => {
        const newDetails = [...sankalpDetails];
        newDetails[index] = { ...newDetails[index], [field]: value };
        setSankalpDetails(newDetails);
    };

    const handleSubmitBooking = async (e) => {
        e.preventDefault();

        // Validation
        for (let i = 0; i < sankalpDetails.length; i++) {
            if (!sankalpDetails[i].name.trim()) {
                alert(`Please enter the name for Devotee ${i + 1}`);
                return;
            }
            if (!sankalpDetails[i].gotra.trim()) {
                alert(`Please enter the gotra for Devotee ${i + 1}`);
                return;
            }
        }

        setIsSubmitting(true);

        const payload = {
            poojaId: pooja.id,
            variantId: selectedVariant.id,
            addons: selectedAddons.map((a) => a.id),
            date: selectedDate,
            time: selectedTimeSlot,
            sankalp: sankalpDetails,
            totalAmount: totalPrice,
        };

        try {
            // Call your booking API here
            const response = await api.post('/bookings', payload);
            console.log("Booking successful:", response.data);

            // Navigate to success page or payment gateway
            alert(`Booking confirmed! Total: ₹${totalPrice.toLocaleString()}\n\nBooking ID: ${response.data.data?.id || 'GENERATED'}`);
            navigate('/my-bookings');
        } catch (error) {
            console.error("Booking failed:", error);
            alert("Failed to create booking. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-paper-bg pb-8">
            {/* Header */}
            <div className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-stone-600 hover:text-sindoor transition-colors"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                            <span className="font-bold text-sm">Back</span>
                        </button>
                        <div className="h-6 w-px bg-stone-200"></div>
                        <h1 className="text-2xl font-serif text-sindoor">Complete Your Booking</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-marigold">verified_user</span>
                        <span className="text-xs text-stone-500 italic">Secure Checkout</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[1400px] mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* LEFT SIDE - Order Summary */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl p-8 shadow-lg border border-stone-200 sticky top-24">
                            <h2 className="text-2xl font-serif text-sindoor mb-6 flex items-center gap-3">
                                <span className="material-symbols-outlined text-3xl">shopping_bag</span>
                                Order Summary
                            </h2>

                            {/* Pooja Details */}
                            <div className="mb-6 pb-6 border-b border-stone-100">
                                <div className="flex gap-4">
                                    <img
                                        src={pooja.image || "https://via.placeholder.com/100"}
                                        alt={pooja.title}
                                        className="w-20 h-20 rounded-xl object-cover"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-bold text-heritage-dark mb-1">{pooja.title}</h3>
                                        <p className="text-xs text-stone-500 line-clamp-2">{pooja.description}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Selected Variant */}
                            <div className="mb-6 pb-6 border-b border-stone-100">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold text-marigold uppercase tracking-wider">Selected Participation</span>
                                </div>
                                <div className="bg-sindoor/5 p-4 rounded-2xl border border-sindoor/10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-2xl text-sindoor">
                                                {selectedVariant.persons > 2 ? 'groups' : (selectedVariant.persons === 2 ? 'favorite' : 'person')}
                                            </span>
                                            <div>
                                                <p className="font-bold text-heritage-dark">{selectedVariant.title}</p>
                                                <p className="text-xs text-stone-500">{selectedVariant.persons} {selectedVariant.persons === 1 ? 'Person' : 'Persons'}</p>
                                            </div>
                                        </div>
                                        <p className="text-lg font-black text-sindoor">₹{Number(selectedVariant.price).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Selected Add-ons */}
                            {selectedAddons && selectedAddons.length > 0 && (
                                <div className="mb-6 pb-6 border-b border-stone-100">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-bold text-marigold uppercase tracking-wider">Sacred Offerings</span>
                                        <span className="text-xs text-stone-400">{selectedAddons.length} items</span>
                                    </div>
                                    <div className="space-y-3">
                                        {selectedAddons.map((addon) => (
                                            <div key={addon.id} className="flex items-center justify-between bg-haldi/5 p-3 rounded-xl">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-marigold text-sm">local_florist</span>
                                                    </div>
                                                    <p className="text-sm font-medium text-heritage-dark">{addon.title}</p>
                                                </div>
                                                <p className="text-sm font-bold text-sindoor">₹{Number(addon.price).toLocaleString()}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Total */}
                            <div className="bg-gradient-to-br from-sindoor to-sindoor/90 p-6 rounded-2xl text-white">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm uppercase tracking-wider opacity-90">Total Dakshina</span>
                                    <span className="material-symbols-outlined">payments</span>
                                </div>
                                <p className="text-4xl font-black">₹{totalPrice.toLocaleString()}</p>
                                <p className="text-xs opacity-75 mt-2">Inclusive of all offerings</p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE - Booking Form */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-stone-200">
                            <h2 className="text-2xl font-serif text-sindoor mb-8 flex items-center gap-3">
                                <span className="material-symbols-outlined text-3xl">edit_calendar</span>
                                Booking Details
                            </h2>

                            <form onSubmit={handleSubmitBooking} className="space-y-10">
                                {/* Date & Time Selection */}
                                {/* <div className="space-y-6">
                                    <h3 className="text-lg font-bold text-heritage-dark flex items-center gap-2">
                                        <span className="material-symbols-outlined text-marigold">schedule</span>
                                        Select Date & Muhurat
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="block text-xs font-bold text-sindoor uppercase tracking-widest">Ritual Date</label>
                                            <input
                                                required
                                                className="w-full bg-paper-bg border-2 border-stone-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-marigold transition-all text-heritage-dark font-medium"
                                                type="date"
                                                value={selectedDate}
                                                onChange={(e) => setSelectedDate(e.target.value)}
                                                min={new Date().toISOString().split('T')[0]}
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="block text-xs font-bold text-sindoor uppercase tracking-widest">Preferred Time</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {["06:00 AM", "09:30 AM", "11:00 AM", "04:30 PM"].map(time => (
                                                    <button
                                                        key={time}
                                                        type="button"
                                                        onClick={() => setSelectedTimeSlot(time)}
                                                        className={`py-3 rounded-xl text-xs font-bold border-2 transition-all ${selectedTimeSlot === time
                                                                ? 'border-marigold bg-marigold text-white shadow-lg'
                                                                : 'border-stone-200 text-stone-600 hover:border-marigold bg-white'
                                                            }`}
                                                    >
                                                        {time}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div> */}

                                {/* Devotee Details */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-bold text-heritage-dark flex items-center gap-2">
                                        <span className="material-symbols-outlined text-marigold">edit_note</span>
                                        Devotee Details for Sankalp
                                    </h3>

                                    <div className="space-y-6">
                                        {sankalpDetails.map((detail, index) => (
                                            <div key={index} className="bg-gradient-to-br from-haldi/5 to-marigold/5 p-6 rounded-3xl border-2 border-haldi/20">
                                                <div className="flex items-center justify-between mb-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-marigold text-white flex items-center justify-center font-bold">
                                                            {index + 1}
                                                        </div>
                                                        <span className="text-sm font-bold text-sindoor uppercase tracking-wider">Devotee {index + 1}</span>
                                                    </div>
                                                    <span className="material-symbols-outlined text-marigold">person</span>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-stone-600 uppercase tracking-wide">Full Name *</label>
                                                        <input
                                                            required
                                                            className="w-full bg-white border-2 border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-marigold transition-all"
                                                            placeholder="Enter full name"
                                                            value={detail.name}
                                                            onChange={(e) => updateSankalpDetail(index, 'name', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-stone-600 uppercase tracking-wide">Gotra *</label>
                                                        <input
                                                            required
                                                            className="w-full bg-white border-2 border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-marigold transition-all"
                                                            placeholder="Enter gotra"
                                                            value={detail.gotra}
                                                            onChange={(e) => updateSankalpDetail(index, 'gotra', e.target.value)}
                                                        />
                                                    </div>
                                                    {/* <div className="space-y-2">
                                                        <label className="text-xs font-bold text-stone-600 uppercase tracking-wide">Rashi *</label>
                                                        <select
                                                            required
                                                            className="w-full bg-white border-2 border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-marigold transition-all"
                                                            value={detail.rashi}
                                                            onChange={(e) => updateSankalpDetail(index, 'rashi', e.target.value)}
                                                        >
                                                            <option disabled>Select Rashi</option>
                                                            {["Mesh", "Vrishabha", "Mithun", "Kark", "Simha", "Kanya", "Tula", "Vrishchik", "Dhanu", "Makar", "Kumbh", "Meen"].map(r => (
                                                                <option key={r} value={r}>{r}</option>
                                                            ))}
                                                        </select>
                                                    </div> */}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="pt-6 border-t border-stone-200">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-gradient-to-r from-sindoor to-sindoor/90 text-white py-5 rounded-2xl font-black text-lg tracking-widest shadow-2xl shadow-sindoor/30 hover:shadow-sindoor/50 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                                                PROCESSING...
                                            </>
                                        ) : (
                                            <>
                                                CONFIRM & PROCEED TO PAYMENT
                                                <span className="material-symbols-outlined">arrow_forward</span>
                                            </>
                                        )}
                                    </button>
                                    <p className="text-center text-xs text-stone-400 mt-4 italic">
                                        By proceeding, you agree to our Terms & Conditions
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
