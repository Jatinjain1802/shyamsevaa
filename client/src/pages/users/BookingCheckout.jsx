import { useEffect, useState, useContext, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../utils/axios";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import { getAssetUrl } from "../../utils/assets";
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
    Phone,
    MapPin,
    Package
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
    const { user } = useContext(AuthContext);

    const bookingData = location.state;

    const [sankalpDetails, setSankalpDetails] = useState([{
        name: "",
        gotra: ""
    }]);
    const [checkoutType, setCheckoutType] = useState(bookingData?.type || 'cart');
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);

    // Form fields
    const [customerName, setCustomerName] = useState("");
    const [shippingAddress, setShippingAddress] = useState("");
    const [contactMobile, setContactMobile] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState("09:30 AM");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // LEARNING: useRef persists a value across renders WITHOUT causing a re-render.
    // We use it here as a flag to prevent adding the same item to cart twice in one session.
    // This is a client-side guard complementing the server-side upsert logic.
    const hasAddedToCart = useRef(false);

    // Initial pre-fill from user profile
    useEffect(() => {
        if (user) {
            setCustomerName(user.name || "");
            setContactMobile(user.mobile || "");
            if (user.address) {
                setShippingAddress(`${user.address}, ${user.city}, ${user.state}`);
            }
        }
    }, [user]);

    useEffect(() => {
        const prepareCheckout = async () => {
            if (bookingData) {
                // Direct checkout from a detail page
                if (bookingData.type === 'product') {
                    setCheckoutType('product');
                } else if (bookingData.pooja) {
                    setCheckoutType('pooja');
                    const count = Number(bookingData.selectedVariant?.persons) || 1;
                    setSankalpDetails(Array(count).fill({ name: "", gotra: "" }));
                } else if (bookingData.type === 'chadawa') {
                    setCheckoutType('chadawa');
                }
            } else {
                // Wishlist/Cart checkout
                setLoading(true);
                try {
                    const res = await api.get('/cart');
                    const items = res.data.data || [];
                    setCartItems(items);
                    setCheckoutType('cart');

                    // If cart has poojas, init sankalp for the first one found maybe?
                    // Actually, for cart we might need a different UI, but let's assume we handle it.
                } catch (err) {
                    toast.error("Failed to load cart");
                    navigate('/wishlist');
                } finally {
                    setLoading(false);
                }
            }
        };

        prepareCheckout();
    }, [bookingData, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-paper-bg">
                <div className="animate-spin h-12 w-12 border-4 border-marigold border-t-sindoor rounded-full"></div>
            </div>
        );
    }

    const { pooja, selectedVariant, selectedAddons, totalPrice, product, chadawa, selectedItems } = bookingData || {};

    // Calculate totals for cart if needed
    const finalTotalPrice = bookingData ? totalPrice : cartItems.reduce((acc, item) => {
        let itemSum = item.base_price * item.quantity;
        item.addons?.forEach(a => itemSum += a.price * a.quantity);
        return acc + itemSum;
    }, 0);

    const updateSankalpDetail = (index, field, value) => {
        const newDetails = [...sankalpDetails];
        newDetails[index] = { ...newDetails[index], [field]: value };
        setSankalpDetails(newDetails);
    };

    const handleSubmitBooking = async (e) => {
        e.preventDefault();

        // 1. Validation
        if (!contactMobile || contactMobile.length < 10) {
            toast.error("Please enter a valid 10-digit mobile number.");
            return;
        }

        if (checkoutType === 'product' || (checkoutType === 'cart' && cartItems.some(i => i.product_type === 'product'))) {
            if (!shippingAddress.trim()) {
                toast.error("Please enter your shipping address.");
                return;
            }
            if (!customerName.trim()) {
                toast.error("Please enter your name.");
                return;
            }
        }

        if (checkoutType === 'pooja') {
            for (let i = 0; i < sankalpDetails.length; i++) {
                if (!sankalpDetails[i].name.trim()) {
                    toast.error(`Please enter the name for Devotee ${i + 1}`);
                    return;
                }
            }
        }

        if (checkoutType === 'cart' && cartItems.length === 0 && !bookingData) {
            toast.error("Your cart is empty.");
            return;
        }

        setIsSubmitting(true);

        try {
            // 2. If Direct action, add to cart first (only once per session)
            if (bookingData && !hasAddedToCart.current) {
                // LEARNING: hasAddedToCart.current acts as a flag without causing re-renders.
                // If the user goes back and comes again, the component is new so this resets.
                
                // CRITICAL FIX: Clear the existing cart first to prevent accumulating previous "Buy Now" attempts
                await api.delete('/cart/clear');

                if (checkoutType === 'product') {
                    await api.post('/cart/add-product', { product_id: product.id, quantity: bookingData.quantity });
                } else if (checkoutType === 'pooja') {
                    await api.post('/cart/pooja', {
                        pooja_variant_id: selectedVariant.id,
                        temple_id: bookingData.temple_id || null,
                        addons: selectedAddons?.map(a => ({ addon_id: a.id, quantity: 1 }))
                    });
                } else if (checkoutType === 'chadawa') {
                    // Add each selected chadawa item to cart
                    for (const item of selectedItems) {
                        await api.post('/cart/chadawa', {
                            chadawa_item_id: item.id,
                            temple_id: bookingData.temple_id || null,
                            quantity: 1
                        });
                    }
                }
                hasAddedToCart.current = true; // Mark as added so we don't do it again
            }

            // 3. Load Razorpay Script
            const res = await loadRazorpayScript();
            if (!res) {
                toast.error("Razorpay SDK failed to load.");
                setIsSubmitting(false);
                return;
            }

            // 4. Create Order on Backend
            const checkoutRes = await api.post('/checkout', {
                customer_name: customerName || sankalpDetails[0]?.name,
                communication_mobile: contactMobile,
                shipping_address: shippingAddress
            });

            if (!checkoutRes.data.success) {
                toast.error("Order creation failed.");
                setIsSubmitting(false);
                return;
            }

            const { order_id } = checkoutRes.data;

            // 5. Create Razorpay Order
            const paymentOrderRes = await api.post('/payments/create', { order_id });
            const { razorpay_order_id, amount, currency, key_id } = paymentOrderRes.data;

            // 6. Initialize Razorpay Options
            const options = {
                key: key_id,
                amount: amount,
                currency: currency,
                name: "Shyampuja",
                description: checkoutType === 'product' ? `Product: ${product?.name}` : (checkoutType === 'chadawa' ? `Chadawa: ${chadawa?.title}` : "Spiritual Services"),
                image: "https://shyampuja.com/logo.png",
                order_id: razorpay_order_id,
                handler: async function (response) {
                    try {
                        const verifyRes = await api.post('/payments/verify', {
                            order_id: order_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            pooja_date: selectedDate,
                            devotee_name: customerName || sankalpDetails[0]?.name,
                            gotra: sankalpDetails[0]?.gotra || "N/A",
                            mobile: contactMobile,
                            sankalp: sankalpDetails
                        });

                        if (verifyRes.data.success) {
                            toast.success("Order Placed Successfully!");

                            if (verifyRes.data.invoice_path) {
                                const link = document.createElement('a');
                                link.href = getAssetUrl(verifyRes.data.invoice_path);
                                link.target = '_blank';
                                link.download = 'Invoice.pdf';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }

                            navigate('/dashboard');
                        } else {
                            toast.error("Payment verification failed.");
                        }
                    } catch (err) {
                        toast.error("Error during payment verification.");
                    }
                },
                prefill: {
                    name: customerName || sankalpDetails[0]?.name,
                    contact: contactMobile,
                },
                theme: {
                    color: "#800000",
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error(error);
            toast.error("Checkout failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-paper-bg pb-8">
            <div className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center justify-center w-10 h-10 rounded-xl bg-stone-50 text-stone-600 hover:text-sindoor hover:bg-sindoor/10 transition-all shadow-sm"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div className="h-8 w-px bg-stone-200 hidden md:block"></div>
                            <h1 className="text-xl md:text-2xl font-serif text-sindoor font-bold">Complete Your Booking</h1>
                        </div>

                        {/* Step Indicator - Premium UI Addition */}
                        <div className="flex items-center gap-2 md:gap-8 w-full md:w-auto justify-center md:justify-end">
                            <div className="flex items-center gap-2 group">
                                <div className="w-8 h-8 rounded-full bg-sindoor text-white flex items-center justify-center font-bold text-xs ring-4 ring-sindoor/10">1</div>
                                <span className="text-xs font-bold text-sindoor hidden sm:inline uppercase tracking-widest">Details</span>
                            </div>
                            <div className="w-8 md:w-16 h-0.5 bg-stone-200"></div>
                            <div className="flex items-center gap-2 opacity-40">
                                <div className="w-8 h-8 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center font-bold text-xs">2</div>
                                <span className="text-xs font-bold text-stone-500 hidden sm:inline uppercase tracking-widest">Payment</span>
                            </div>
                            <div className="w-8 md:w-16 h-0.5 bg-stone-200"></div>
                            <div className="flex items-center gap-2 opacity-40">
                                <div className="w-8 h-8 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center font-bold text-xs">3</div>
                                <span className="text-xs font-bold text-stone-500 hidden sm:inline uppercase tracking-widest">Success</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl p-8 shadow-lg border border-stone-200 sticky top-24">
                            <h2 className="text-2xl font-serif text-sindoor mb-6 flex items-center gap-3">
                                <ShoppingBag className="w-6 h-6" />
                                Order Summary
                            </h2>

                            {bookingData ? (
                                <>
                                    <div className="mb-6 pb-6 border-b border-stone-100">
                                        <div className="flex gap-4">
                                            <img
                                                src={getAssetUrl(product?.image_url || product?.image || pooja?.image || "https://via.placeholder.com/100")}
                                                alt={product?.name || pooja?.title}
                                                className="w-20 h-20 rounded-xl object-cover"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-bold text-heritage-dark mb-1">{product?.name || pooja?.title || chadawa?.title}</h3>
                                                <p className="text-xs text-stone-500 line-clamp-2">{product?.description || pooja?.description || chadawa?.description}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {checkoutType === 'chadawa' && selectedItems && (
                                        <div className="mb-6 pb-6 border-b border-stone-100">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-xs font-bold text-marigold uppercase tracking-wider">Offering Items</span>
                                            </div>
                                            <div className="space-y-2">
                                                {selectedItems.map((item, idx) => (
                                                    <div key={idx} className="bg-sindoor/5 p-3 rounded-xl border border-sindoor/10 flex justify-between items-center text-sm">
                                                        <span className="font-bold text-heritage-dark">{item.title}</span>
                                                        <span className="font-black text-sindoor">₹{Number(item.price).toLocaleString()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {selectedVariant && (
                                        <div className="mb-6 pb-6 border-b border-stone-100">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-xs font-bold text-marigold uppercase tracking-wider">Participation</span>
                                            </div>
                                            <div className="bg-sindoor/5 p-4 rounded-2xl border border-sindoor/10">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <Users className="text-sindoor w-6 h-6" />
                                                        <div>
                                                            <p className="font-bold text-heritage-dark">{selectedVariant.title}</p>
                                                            <p className="text-xs text-stone-500">{selectedVariant.persons} Person(s)</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-lg font-black text-sindoor">₹{Number(selectedVariant.price).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {checkoutType === 'product' && (
                                        <div className="mb-6 pb-6 border-b border-stone-100">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-marigold uppercase tracking-wider">Quantity</span>
                                                <span className="font-bold text-heritage-dark">{bookingData.quantity}</span>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="space-y-4 mb-6">
                                    {cartItems.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3 bg-stone-50 p-3 rounded-xl border border-stone-100">
                                            <div className="w-10 h-10 bg-marigold/10 rounded-lg flex items-center justify-center shrink-0">
                                                <Package className="w-5 h-5 text-marigold" />
                                            </div>
                                            <div className="grow">
                                                <p className="text-sm font-bold text-heritage-dark truncate">{item.name || 'Item'}</p>
                                                <p className="text-[10px] text-stone-400">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="text-sm font-black text-sindoor">₹{Number(item.base_price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="bg-linear-to-br from-sindoor to-sindoor/90 p-6 rounded-2xl text-white">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm uppercase tracking-wider opacity-90">Total Amount</span>
                                    <Banknote className="w-6 h-6" />
                                </div>
                                <p className="text-4xl font-black">₹{finalTotalPrice.toLocaleString()}</p>
                                <p className="text-xs opacity-75 mt-2">Final Payable Amount</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-stone-200">
                            <h2 className="text-2xl font-serif text-sindoor mb-8 flex items-center gap-3">
                                <PenLine className="w-8 h-8" />
                                Checkout Details
                            </h2>

                            <form onSubmit={handleSubmitBooking} className="space-y-10">
                                <div className="space-y-6">
                                    {/* Personal Info */}
                                    <div className="bg-linear-to-br from-haldi/5 to-marigold/5 p-8 rounded-3xl border-2 border-haldi/20">
                                        <h3 className="text-lg font-bold text-heritage-dark flex items-center gap-2 mb-6">
                                            <User className="text-marigold w-5 h-5" />
                                            Contact Information
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-stone-400 uppercase tracking-widest">Full Name *</label>
                                                <input
                                                    required
                                                    className="w-full bg-white border-2 border-stone-100 rounded-xl px-4 py-4 focus:border-marigold outline-none transition-all shadow-sm"
                                                    placeholder="Enter your name"
                                                    value={customerName}
                                                    onChange={(e) => setCustomerName(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-stone-400 uppercase tracking-widest">Mobile Number *</label>
                                                <div className="flex shadow-sm">
                                                    <span className="flex items-center px-4 bg-stone-50 border-2 border-r-0 border-stone-100 rounded-l-xl text-stone-400 font-bold">+91</span>
                                                    <input
                                                        required
                                                        type="tel"
                                                        className="w-full bg-white border-2 border-stone-100 rounded-r-xl px-4 py-4 focus:border-marigold outline-none transition-all"
                                                        placeholder="10 digit number"
                                                        value={contactMobile}
                                                        onChange={(e) => setContactMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Shipping for Products */}
                                    {(checkoutType === 'product' || cartItems.some(i => i.product_type === 'product')) && (
                                        <div className="bg-linear-to-br from-haldi/5 to-marigold/5 p-8 rounded-3xl border-2 border-haldi/20">
                                            <h3 className="text-lg font-bold text-heritage-dark flex items-center gap-2 mb-6">
                                                <MapPin className="text-marigold w-5 h-5" />
                                                Shipping Address
                                            </h3>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-stone-400 uppercase tracking-widest">Delivery Address *</label>
                                                <textarea
                                                    required
                                                    rows="3"
                                                    className="w-full bg-white border-2 border-stone-100 rounded-xl px-4 py-4 focus:border-marigold outline-none transition-all shadow-sm"
                                                    placeholder="Enter your full address with PIN code"
                                                    value={shippingAddress}
                                                    onChange={(e) => setShippingAddress(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Sankalp for Poojas */}
                                    {(checkoutType === 'pooja') && (
                                        <div className="space-y-6">
                                            <h3 className="text-lg font-bold text-heritage-dark flex items-center gap-2 px-2">
                                                <PenLine className="text-marigold w-5 h-5" />
                                                Sankalp & Devotee Details
                                            </h3>
                                            {sankalpDetails.map((detail, index) => (
                                                <div key={index} className="bg-linear-to-br from-haldi/5 to-marigold/5 p-8 rounded-3xl border-2 border-haldi/20 relative">
                                                    <div className="absolute top-6 right-8 text-6xl font-black text-marigold/5">0{index + 1}</div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-black text-stone-400 uppercase tracking-widest">Devotee {index + 1} Name *</label>
                                                            <input
                                                                required
                                                                className="w-full bg-white border-2 border-stone-100 rounded-xl px-4 py-4 focus:border-marigold outline-none transition-all shadow-sm"
                                                                placeholder="Full name for sankalp"
                                                                value={detail.name}
                                                                onChange={(e) => updateSankalpDetail(index, 'name', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-black text-stone-400 uppercase tracking-widest">Gotra *</label>
                                                            <input
                                                                required
                                                                className="w-full bg-white border-2 border-stone-100 rounded-xl px-4 py-4 focus:border-marigold outline-none transition-all shadow-sm"
                                                                placeholder="Enter gotra"
                                                                value={detail.gotra}
                                                                onChange={(e) => updateSankalpDetail(index, 'gotra', e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
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
