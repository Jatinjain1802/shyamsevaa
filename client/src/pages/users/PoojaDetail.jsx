import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowRight, FiCheckCircle, FiStar, FiMapPin, FiCalendar, FiClock, FiUser, FiShare2, FiPhone, FiMail } from "react-icons/fi";
import { MdTempleHindu, MdMenuBook, MdSelfImprovement, MdShoppingBasket, MdRestaurant, MdEditNote, MdCalendarMonth } from "react-icons/md";
import api from "../../utils/axios";

export default function PoojaDetail() {
    const { poojaId } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedAddons, setSelectedAddons] = useState([]);
    const [similarPoojas, setSimilarPoojas] = useState([]);

    // Form States
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState("09:30 AM");
    const [sankalpDetails, setSankalpDetails] = useState([{
        name: "",
        gotra: "",
        rashi: "Select Rashi"
    }]);

    useEffect(() => {
        window.scrollTo(0, 0);
        api.get(`/poojas/${poojaId}`).then((res) => {
            setData(res.data.data);
            if (res.data.data.variants && res.data.data.variants.length > 0) {
                setSelectedVariant(res.data.data.variants[0]);
            }
        });

        // Fetch similar poojas (all poojas excluding current)
        api.get("/poojas").then((res) => {
            if (res.data.data) {
                const others = res.data.data.filter(p => p.id !== poojaId).slice(0, 4);
                setSimilarPoojas(others);
            }
        }).catch(err => console.error("Failed to load similar poojas", err));
    }, [poojaId]);

    // Update sankalp fields when variant changes (number of persons)
    useEffect(() => {
        if (selectedVariant) {
            const count = Number(selectedVariant.persons) || 1;
            setSankalpDetails(prev => {
                const newDetails = [...prev];
                if (newDetails.length < count) {
                    // Add more fields if count increased
                    for (let i = newDetails.length; i < count; i++) {
                        newDetails.push({ name: "", gotra: "", rashi: "Select Rashi" });
                    }
                } else if (newDetails.length > count) {
                    // Reduce fields if count decreased
                    newDetails.length = count;
                }
                return newDetails;
            });
        }
    }, [selectedVariant]);

    if (!data)
        return (
            <div className="min-h-screen flex items-center justify-center bg-paper-bg">
                <div className="animate-spin h-12 w-12 border-4 border-marigold border-t-sindoor rounded-full"></div>
            </div>
        );

    const { pooja, variants, addons, temples } = data;

    const toggleAddon = (addon) => {
        const exists = selectedAddons.find((a) => a.id === addon.id);
        if (exists) {
            setSelectedAddons(selectedAddons.filter((a) => a.id !== addon.id));
        } else {
            setSelectedAddons([...selectedAddons, addon]);
        }
    };

    const updateSankalpDetail = (index, field, value) => {
        const newDetails = [...sankalpDetails];
        newDetails[index] = { ...newDetails[index], [field]: value };
        setSankalpDetails(newDetails);
    };

    const totalPrice = () => {
        let total = selectedVariant ? Number(selectedVariant.price) : 0;
        selectedAddons.forEach((a) => {
            total += Number(a.price);
        });
        return total;
    };

    const handleBookNow = (e) => {
        e.preventDefault();
        if (!selectedVariant) {
            alert("Please select a Sankalp option to proceed.");
            return;
        }

        // Basic validation
        for (let i = 0; i < sankalpDetails.length; i++) {
            if (!sankalpDetails[i].name) {
                alert(`Please enter the name for Devotee ${i + 1}`);
                return;
            }
        }

        const payload = {
            poojaId: pooja.id,
            variantId: selectedVariant.id,
            addons: selectedAddons.map((a) => a.id),
            date: selectedDate,
            time: selectedTimeSlot,
            sankalp: sankalpDetails,
            totalAmount: totalPrice(),
        };

        console.log("BOOKING PAYLOAD", payload);
        alert(`Proceeding to book for ₹${totalPrice()}! 🚀\n(This would navigate to Checkout)`);
    };

    return (
        <div className="bg-paper-bg min-h-screen font-sans text-heritage-dark selection:bg-marigold/30">
            {/* Top Garland */}
            <div className="flex justify-center gap-1 py-1 bg-sindoor/10 overflow-hidden">
                {[...Array(40)].map((_, i) => (
                    <div key={i} className="garland-decoration shrink-0"></div>
                ))}
            </div>

            {/* HERO SECTION */}
            <section className="relative h-[450px] w-full overflow-hidden">
                <img
                    alt={pooja.title}
                    className="w-full h-full object-cover"
                    src={pooja.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sindoor/90 via-sindoor/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-7xl mx-auto text-white">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                        <span className="px-4 py-1 bg-haldi text-sindoor font-bold rounded-full text-xs tracking-widest uppercase">
                            Special Pooja
                        </span>
                        <div className="flex items-center text-haldi">
                            {[1, 2, 3, 4].map(star => <FiStar key={star} className="fill-current text-sm" />)}
                            <FiStar className="text-sm" />
                            <span className="ml-2 text-xs text-white/80">(1,240 Reviews)</span>
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-7xl mb-4 font-serif font-bold">{pooja.title}</h1>
                    <p className="text-lg md:text-xl text-haldi/90 max-w-2xl italic">
                        {temples && temples.length > 0 ? `Perform Seva at ${temples[0].title}` : "Invoke divine blessings for prosperity and peace."}
                    </p>
                </div>
            </section>

            {/* TORAN DIVIDER */}
            <div className="toran-border"></div>

            {/* MAIN CONTENT */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* Significance & Benefits */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <MdMenuBook className="text-4xl text-marigold" />
                                <h3 className="text-3xl font-serif font-bold text-sindoor m-0">Significance & Benefits</h3>
                            </div>
                            <p className="text-lg leading-relaxed text-gray-700">
                                {pooja.description || "Performing this pooja with devotion is believed to bring peace, prosperity, and success to the devotee's household."}
                            </p>

                            {/* Benefits List - Extracting from paragraph or showing generic if not structured */}
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                <li className="flex items-start gap-3 bg-white p-4 rounded-xl border-l-4 border-marigold shadow-sm">
                                    <FiCheckCircle className="text-marigold shrink-0 mt-1" />
                                    <span>Removal of obstacles and hurdles.</span>
                                </li>
                                <li className="flex items-start gap-3 bg-white p-4 rounded-xl border-l-4 border-marigold shadow-sm">
                                    <FiCheckCircle className="text-marigold shrink-0 mt-1" />
                                    <span>Brings wisdom and intellectual growth.</span>
                                </li>
                                <li className="flex items-start gap-3 bg-white p-4 rounded-xl border-l-4 border-marigold shadow-sm">
                                    <FiCheckCircle className="text-marigold shrink-0 mt-1" />
                                    <span>Attracts financial prosperity.</span>
                                </li>
                                <li className="flex items-start gap-3 bg-white p-4 rounded-xl border-l-4 border-marigold shadow-sm">
                                    <FiCheckCircle className="text-marigold shrink-0 mt-1" />
                                    <span>Purifies negative energy.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Variants / Packages Selection (Integrated into Left Col) */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <FiUser className="text-3xl text-marigold" />
                                <h3 className="text-3xl font-serif font-bold text-sindoor m-0">Select Sankalp (Package)</h3>
                            </div>
                            <div className="grid md:grid-cols-2 gap-5">
                                {variants.map((v) => {
                                    const isSelected = selectedVariant?.id === v.id;
                                    return (
                                        <div
                                            key={v.id}
                                            onClick={() => setSelectedVariant(v)}
                                            className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300
                                                ${isSelected
                                                    ? 'border-sindoor bg-orange-50/50 shadow-md ring-1 ring-sindoor'
                                                    : 'border-gray-200 bg-white hover:border-marigold/50'}
                                            `}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-serif text-xl font-bold text-heritage-dark">
                                                    {v.persons} Person{v.persons > 1 ? "s" : ""}
                                                </h4>
                                                {isSelected && <FiCheckCircle className="text-sindoor" size={24} />}
                                            </div>
                                            <p className="text-sm text-gray-600 mb-4 h-10 line-clamp-2">
                                                {v.description || "Includes full rituals, mantra chanting, and prasad delivery."}
                                            </p>
                                            <div className="pt-3 border-t border-gray-100 flex justify-between items-end">
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Dakshina</span>
                                                <span className="text-2xl font-bold text-sindoor">₹{Number(v.price).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Pooja Vidhi */}
                        <div className="bg-sindoor/5 p-6 md:p-8 rounded-3xl border-2 border-sindoor/10">
                            <div className="flex items-center gap-3 mb-6">
                                <MdSelfImprovement className="text-4xl text-sindoor" />
                                <h3 className="text-3xl font-serif font-bold text-sindoor m-0">Pooja Vidhi (Procedure)</h3>
                            </div>
                            <div className="space-y-6">
                                {['Ganpati Sthapana & Invocation', 'Sankalp & Prana Pratishtha', 'Shodashopachara Rituals & Mantras', 'Aarti & Prasad Distribution'].map((step, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 bg-sindoor text-white rounded-full flex items-center justify-center font-bold">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <h4 className="text-xl text-sindoor font-bold mb-1">{step}</h4>
                                            <p className="text-gray-600">Vedic rituals performed by experienced Pandits strictly according to scriptures.</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Addons Section mapped to Samagri/Bhog visual style */}
                        {(addons && addons.length > 0) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-haldi">
                                    <h4 className="text-2xl font-serif text-sindoor mb-4 flex items-center gap-2">
                                        <MdShoppingBasket /> Add-on Samagri
                                    </h4>
                                    <ul className="space-y-3">
                                        {addons.slice(0, 3).map(addon => (
                                            <li key={addon.id} className="flex items-center justify-between gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer" onClick={() => toggleAddon(addon)}>
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedAddons.find(a => a.id === addon.id) ? 'border-marigold bg-marigold' : 'border-gray-300'}`}>
                                                        {selectedAddons.find(a => a.id === addon.id) && <div className="bg-white w-1.5 h-1.5 rounded-full"></div>}
                                                    </div>
                                                    <span className="text-gray-700 text-sm">{addon.title}</span>
                                                </div>
                                                <span className="font-bold text-sindoor text-sm">+ ₹{Number(addon.price).toLocaleString()}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-haldi">
                                    <h4 className="text-2xl font-serif text-sindoor mb-4 flex items-center gap-2">
                                        <MdRestaurant /> Special Bhog
                                    </h4>
                                    <p className="text-gray-600 text-sm mb-4">Included in Seva:</p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-lg bg-orange-100 flex items-center justify-center text-marigold">
                                            <MdRestaurant size={32} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sindoor">Panchamrit & Fruits</p>
                                            <p className="text-xs text-stone-500">Traditional prasadam offerings</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN - Sticky Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-white rounded-3xl shadow-2xl border-2 border-haldi p-6 md:p-8">
                            <div className="mb-6">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-gray-500 font-bold uppercase text-xs tracking-widest">Total Dakshina</span>
                                    <span className="text-4xl font-black text-sindoor">₹{totalPrice().toLocaleString()}</span>
                                </div>
                                <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-marigold w-full"></div>
                                </div>
                                {selectedVariant && (
                                    <p className="text-xs text-right text-gray-400 mt-1">
                                        {selectedVariant.persons} Person{selectedVariant.persons > 1 ? "s" : ""} • {selectedAddons.length} Addons
                                    </p>
                                )}
                            </div>

                            <form onSubmit={handleBookNow} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Select Date</label>
                                    <input
                                        className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:border-marigold transition-colors"
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Select Time Slot</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {["06:00 AM", "09:30 AM", "11:00 AM", "04:30 PM"].map(time => (
                                            <button
                                                key={time}
                                                type="button"
                                                onClick={() => setSelectedTimeSlot(time)}
                                                className={`py-2 rounded-xl text-sm font-medium border-2 transition-all
                                                    ${selectedTimeSlot === time
                                                        ? 'border-marigold bg-marigold/5 text-marigold font-bold'
                                                        : 'border-gray-100 text-gray-600 hover:border-marigold'}`}
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-dashed border-gray-200">
                                    <h4 className="text-lg font-serif text-sindoor mb-4 flex items-center gap-2">
                                        <MdEditNote /> Sankalp Details
                                    </h4>
                                    <div className="space-y-6 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                                        {sankalpDetails.map((detail, index) => (
                                            <div key={index} className="space-y-4">
                                                {sankalpDetails.length > 1 && (
                                                    <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
                                                        <span className="bg-marigold text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{index + 1}</span>
                                                        <span className="text-xs font-bold text-sindoor uppercase tracking-widest">
                                                            Devotee {index + 1}
                                                        </span>
                                                    </div>
                                                )}

                                                <input
                                                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:border-marigold text-sm"
                                                    placeholder={`Full Name ${sankalpDetails.length > 1 ? `of Devotee ${index + 1}` : "of Devotee"}`}
                                                    value={detail.name}
                                                    onChange={(e) => updateSankalpDetail(index, 'name', e.target.value)}
                                                    type="text"
                                                />
                                                <div className="grid grid-cols-2 gap-4">
                                                    <input
                                                        className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:border-marigold text-sm"
                                                        placeholder="Gotra"
                                                        value={detail.gotra}
                                                        onChange={(e) => updateSankalpDetail(index, 'gotra', e.target.value)}
                                                        type="text"
                                                    />
                                                    <select
                                                        className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:border-marigold text-sm bg-white"
                                                        value={detail.rashi}
                                                        onChange={(e) => updateSankalpDetail(index, 'rashi', e.target.value)}
                                                    >
                                                        <option>Select Rashi</option>
                                                        <option>Mesh (Aries)</option>
                                                        <option>Vrishabha (Taurus)</option>
                                                        <option>Mithun (Gemini)</option>
                                                        <option>Kark (Cancer)</option>
                                                        <option>Simha (Leo)</option>
                                                        <option>Kanya (Virgo)</option>
                                                        <option>Tula (Libra)</option>
                                                        <option>Vrishchik (Scorpio)</option>
                                                        <option>Dhanu (Sagittarius)</option>
                                                        <option>Makar (Capricorn)</option>
                                                        <option>Kumbh (Aquarius)</option>
                                                        <option>Meen (Pisces)</option>
                                                    </select>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-sindoor hover:bg-sindoor/90 text-white font-black py-4 rounded-2xl shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 text-lg"
                                >
                                    <MdCalendarMonth size={24} />
                                    BOOK POOJA NOW
                                </button>
                                <p className="text-center text-xs text-gray-400 italic">
                                    Confirmation and Pandit details will be sent via SMS/Email
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* DEVOTEE EXPERIENCES */}
            <section className="bg-heritage-dark py-20 mt-12 overflow-hidden relative">
                <div className="toran-border opacity-30 absolute top-0 w-full"></div>
                <div className="max-w-7xl mx-auto px-6">
                    <h3 className="text-4xl font-serif text-haldi text-center mb-16">Devotee Experiences</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: "Rajesh Khanna", loc: "Mumbai", text: "The Pandit ji was very knowledgeable and explained every mantra. It felt as if we were in a grand temple right at our home." },
                            { name: "Sneha Iyer", loc: "Bengaluru", text: "Booked for my parents' anniversary. The arrangements for Samagri were perfect. The modaks were fresh and delicious." },
                            { name: "Amit Sharma", loc: "Delhi", text: "Divine experience. Digital booking made it so easy. The live Sankalp through video call was very emotional and spiritual for us." }
                        ].map((rev, i) => (
                            <div key={i} className="bg-white/5 p-8 rounded-3xl border border-white/10 relative">
                                <span className="absolute -top-4 -left-2 text-6xl text-marigold/20 font-serif">"</span>
                                <p className="text-gray-300 italic mb-6 leading-relaxed relative z-10">"{rev.text}"</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-marigold/20 border border-marigold flex items-center justify-center text-marigold font-bold text-xl">
                                        {rev.name[0]}
                                    </div>
                                    <div>
                                        <p className="text-white font-bold">{rev.name}</p>
                                        <p className="text-xs text-gray-500">{rev.loc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="toran-border rotate-180 opacity-30 absolute bottom-0 w-full"></div>
            </section>

            {/* SIMILAR POOJAS (Footer Section in HTML) - Dynamic from DB */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h3 className="text-4xl font-serif text-sindoor">Similar Sacred Poojas</h3>
                        <div className="h-1 w-24 bg-marigold mt-2"></div>
                    </div>
                    <button className="text-marigold font-bold flex items-center gap-2 hover:gap-4 transition-all" onClick={() => navigate('/poojas')}>
                        VIEW ALL SEVAS <FiArrowRight />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {similarPoojas.map((item) => {
                        // Determine price to display (lowest or first variant)
                        const displayPrice = (item.variants && item.variants.length > 0)
                            ? `₹${Number(item.variants[0].price).toLocaleString()}`
                            : "View Details";

                        return (
                            <div
                                key={item.id}
                                onClick={() => {
                                    navigate(`/poojas/${item.id}`);
                                    window.scrollTo(0, 0);
                                }}
                                className="bg-white rounded-2xl overflow-hidden shadow-lg border-b-4 border-marigold group cursor-pointer hover:-translate-y-1 transition-all"
                            >
                                <div className="h-48 bg-gray-200 relative overflow-hidden">
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-100">
                                            <MdTempleHindu size={48} />
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h4 className="text-xl font-serif text-sindoor mb-2 line-clamp-1">{item.title}</h4>
                                    <div className="flex justify-between items-center mt-4">
                                        <span className={`font-black text-sindoor ${displayPrice.startsWith('₹') ? 'text-lg' : 'text-sm'}`}>
                                            {displayPrice}
                                        </span>
                                        <span className="text-marigold font-bold text-sm">EXPLORE</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {similarPoojas.length === 0 && (
                        <div className="col-span-full text-center text-gray-400 italic py-10">
                            No other similar poojas found at the moment.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
