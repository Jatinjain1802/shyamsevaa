import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../utils/axios";
import toast from "react-hot-toast";
import {
    ArrowLeft,
    ShieldCheck,
    ShoppingBag,
    Users,
    User,
    Heart,
    Flower,
    Banknote,
    Calendar,
    PenLine,
    Clock,
    ArrowRight,
    Phone
} from "lucide-react";

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export default function BookingCheckout() {
    const location = useLocation();
    const navigate = useNavigate();

    const bookingData = location.state;

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState("09:30 AM");
    const [sankalpDetails, setSankalpDetails] = useState([{
        name: "",
        gotra: ""
    }]);
    const [contactMobile, setContactMobile] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!bookingData || !bookingData.pooja || !bookingData.selectedVariant) {
            navigate('/poojas');
            return;
        }

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

        // 1. Validation
        if (!contactMobile || contactMobile.length < 10) {
            alert("Please enter a valid 10-digit mobile number for communication.");
            return;
        }

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

        try {
            // 2. Load Razorpay Script
            const res = await loadRazorpayScript();
            if (!res) {
                alert("Razorpay SDK failed to load. Are you online?");
                setIsSubmitting(false);
                return;
            }

            // 3. Create Local Order (Checkout)
            // This adds items to orders and order_items tables
            const checkoutRes = await api.post('/checkout', {
                // Backend might handle cart from session/user_id, 
                // but let's assume we need to ensure the order is created.
                // Looking at checkout.controller.js, it uses cart items.
            });

            if (!checkoutRes.data.success) {
                alert("Order creation failed.");
                setIsSubmitting(false);
                return;
            }

            const { order_id, total_amount } = checkoutRes.data;

            // 4. Create Razorpay Order
            const paymentOrderRes = await api.post('/payments/create', { order_id });
            if (!paymentOrderRes.data.success) {
                alert("Failed to initiate payment. Please try again.");
                setIsSubmitting(false);
                return;
            }

            const { razorpay_order_id, amount, currency, key_id } = paymentOrderRes.data;

            // 5. Initialize Razorpay Options
            const options = {
                key: key_id,
                amount: amount,
                currency: currency,
                name: "Shyam Sevaa",
                description: `Pooja Booking: ${pooja.title}`,
                image: "https://shyamsevaa.com/logo.png", // Replace with your logo
                order_id: razorpay_order_id,
                handler: async function (response) {
                    try {
                        // 6. Verify Payment on Backend
                        const verifyRes = await api.post('/payments/verify', {
                            order_id: order_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            pooja_date: selectedDate,
                            devotee_name: sankalpDetails[0].name, // Fallback for single field columns
                            gotra: sankalpDetails[0].gotra,      // Fallback
                            mobile: contactMobile,
                            sankalp: sankalpDetails
                        });

                        if (verifyRes.data.success) {
                            toast.success("Payment Successful! Your pooja has been booked.");
                            navigate('/dashboard');
                        } else {
                            toast.error("Payment verification failed. Please contact support.");
                        }
                    } catch (err) {
                        console.error("Verification error:", err);
                        toast.error("An error occurred during payment verification.");
                    }
                },
                prefill: {
                    name: sankalpDetails[0].name,
                    contact: contactMobile,
                },
                theme: {
                    color: "#800000", // Sindoor color
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error("Booking workflow failed:", error);
            alert("Checkout process failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-paper-bg pb-8">
            <div className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-stone-600 hover:text-sindoor transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-bold text-sm">Back</span>
                        </button>
                        <div className="h-6 w-px bg-stone-200"></div>
                        <h1 className="text-2xl font-serif text-sindoor">Complete Your Booking</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="text-marigold w-5 h-5" />
                        <span className="text-xs text-stone-500 italic">Secure Checkout</span>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl p-8 shadow-lg border border-stone-200 sticky top-24">
                            <h2 className="text-2xl font-serif text-sindoor mb-6 flex items-center gap-3">
                                <ShoppingBag className="w-6 h-6" />
                                Booking Summary
                            </h2>

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

                            <div className="mb-6 pb-6 border-b border-stone-100">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold text-marigold uppercase tracking-wider">Selected Participation</span>
                                </div>
                                <div className="bg-sindoor/5 p-4 rounded-2xl border border-sindoor/10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {selectedVariant.persons > 2 ? <Users className="text-sindoor w-6 h-6" /> :
                                                selectedVariant.persons === 2 ? <Heart className="text-sindoor w-6 h-6" /> :
                                                    <User className="text-sindoor w-6 h-6" />}
                                            <div>
                                                <p className="font-bold text-heritage-dark">{selectedVariant.title}</p>
                                                <p className="text-xs text-stone-500">{selectedVariant.persons} {selectedVariant.persons === 1 ? 'Person' : 'Persons'}</p>
                                            </div>
                                        </div>
                                        <p className="text-lg font-black text-sindoor">₹{Number(selectedVariant.price).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

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
                                                        <Flower className="text-marigold w-5 h-5" />
                                                    </div>
                                                    <p className="text-sm font-medium text-heritage-dark">{addon.title}</p>
                                                </div>
                                                <p className="text-sm font-bold text-sindoor">₹{Number(addon.price).toLocaleString()}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="bg-linear-to-br from-sindoor to-sindoor/90 p-6 rounded-2xl text-white">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm uppercase tracking-wider opacity-90">Total Dakshina</span>
                                    <Banknote className="w-6 h-6" />
                                </div>
                                <p className="text-4xl font-black">₹{totalPrice.toLocaleString()}</p>
                                <p className="text-xs opacity-75 mt-2">Inclusive of all offerings</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-stone-200">
                            <h2 className="text-2xl font-serif text-sindoor mb-8 flex items-center gap-3">
                                <Calendar className="w-8 h-8" />
                                Booking Details
                            </h2>

                            <form onSubmit={handleSubmitBooking} className="space-y-10">
                                {/* Date & Time Selection Code (Commented out in original) */}

                                <div className="space-y-6">
                                    <h3 className="text-lg font-bold text-heritage-dark flex items-center gap-2">
                                        <PenLine className="text-marigold w-5 h-5" />
                                        Contact & Devotee Details
                                    </h3>

                                    <div className="bg-linear-to-br from-haldi/5 to-marigold/5 p-6 rounded-3xl border-2 border-haldi/20 mb-8">
                                        <div className="flex items-center gap-3 mb-5">
                                            <Phone className="text-marigold w-6 h-6" />
                                            <span className="text-sm font-bold text-sindoor uppercase tracking-wider">Contact Number (WhatsApp Updates)</span>
                                        </div>
                                        <div className="max-w-md">
                                            <label className="text-xs font-bold text-stone-600 uppercase tracking-wide">Mobile Number *</label>
                                            <div className="flex gap-2">
                                                <span className="flex items-center px-4 bg-white border-2 border-stone-200 rounded-xl text-stone-500 font-bold">+91</span>
                                                <input
                                                    required
                                                    type="tel"
                                                    pattern="[0-9]{10}"
                                                    className="w-full bg-white border-2 border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-marigold transition-all"
                                                    placeholder="Enter 10 digit number"
                                                    value={contactMobile}
                                                    onChange={(e) => setContactMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {sankalpDetails.map((detail, index) => (
                                            <div key={index} className="bg-linear-to-br from-haldi/5 to-marigold/5 p-6 rounded-3xl border-2 border-haldi/20">
                                                <div className="flex items-center justify-between mb-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-marigold text-white flex items-center justify-center font-bold">
                                                            {index + 1}
                                                        </div>
                                                        <span className="text-sm font-bold text-sindoor uppercase tracking-wider">Devotee {index + 1}</span>
                                                    </div>
                                                    <User className="text-marigold w-6 h-6" />
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
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-stone-200">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-linear-to-r from-sindoor to-sindoor/90 text-white py-5 rounded-2xl font-black text-lg tracking-widest shadow-2xl shadow-sindoor/30 hover:shadow-sindoor/50 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                                                PROCESSING...
                                            </>
                                        ) : (
                                            <>
                                                CONFIRM & PROCEED TO PAYMENT
                                                <ArrowRight className="w-6 h-6" />
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
