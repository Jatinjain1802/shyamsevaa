import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../utils/axios";
import {
    LayoutDashboard,
    Calendar,
    ShoppingBag,
    User,
    LogOut,
    Menu,
    X,
    Bell,
    Settings,
    Loader2,
    ArrowRight
} from "lucide-react";
import { MdTempleHindu, MdVolunteerActivism } from "react-icons/md";

export default function UserDashboard() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("bookings");
    const [bookings, setBookings] = useState([]);
    const [chadawas, setChadawas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        const fetchUserData = async () => {
            try {
                // Fetch Bookings
                // Assuming standard endpoint, might need adjustment based on backend
                const bookingsRes = await api.get("/bookings/my-bookings").catch(() => ({ data: { data: [] } }));
                setBookings(bookingsRes.data.data || []);

                // Fetch Chadawas (using same assumed pattern or generic orders endpoint)
                const chadawasRes = await api.get("/chadawas/my-orders").catch(() => ({ data: { data: [] } }));
                setChadawas(chadawasRes.data.data || []);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user, navigate]);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-paper-bg flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-marigold animate-spin" />
            </div>
        );
    }

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color === 'sindoor' ? 'bg-sindoor/10 text-sindoor' : 'bg-marigold/10 text-marigold'}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-xs text-stone-500 uppercase tracking-wider font-bold">{title}</p>
                <h3 className="text-2xl font-serif font-bold text-heritage-dark">{value}</h3>
            </div>
        </div>
    );

    const SidebarLink = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => {
                setActiveTab(id);
                setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === id
                ? "bg-sindoor/10 text-sindoor font-bold"
                : "text-stone-600 hover:bg-stone-50 hover:text-heritage-dark"
                }`}
        >
            <Icon className="w-5 h-5" />
            {label}
        </button>
    );

    return (
        <div className="min-h-screen bg-stone-50 flex">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-stone-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="h-full flex flex-col">
                    <div className="p-6 border-b border-stone-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-linear-to-br from-sindoor to-marigold rounded-lg flex items-center justify-center text-white font-bold font-serif">
                                S
                            </div>
                            <span className="font-serif font-bold text-heritage-dark text-lg">My Dashboard</span>
                        </div>
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-stone-400">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="p-4 space-y-1 overflow-y-auto flex-1">
                        <SidebarLink id="bookings" label="My Poojas" icon={MdTempleHindu} />
                        <SidebarLink id="chadawas" label="My Chadawas" icon={MdVolunteerActivism} />
                        <SidebarLink id="profile" label="Profile Settings" icon={User} />
                    </div>

                    <div className="p-4 border-t border-stone-100">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors font-medium text-sm"
                        >
                            <LogOut className="w-5 h-5" />
                            Log Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="bg-white border-b border-stone-200 py-4 px-6 md:px-8 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-stone-500">
                            <Menu className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-heritage-dark font-serif">
                                Welcome, <span className="text-sindoor">{user?.name || "Devotee"}</span>
                            </h1>
                            <p className="text-xs text-stone-500">Manage your spiritual journey</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/" className="text-sm font-bold text-sindoor hover:text-marigold hidden md:block">
                            Back to Home
                        </Link>
                        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 font-bold border border-stone-200">
                            {user?.name?.[0] || "U"}
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8">

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <StatCard title="Total Poojas" value={bookings.length} icon={MdTempleHindu} color="sindoor" />
                        <StatCard title="Total Chadawas" value={chadawas.length} icon={MdVolunteerActivism} color="marigold" />
                        {/* Placeholder generic stat */}
                        <StatCard title="Days Active" value="12" icon={Calendar} color="stone" />
                    </div>

                    {/* Tab Content: Bookings */}
                    {activeTab === "bookings" && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-heritage-dark font-serif mb-4 flex items-center gap-2">
                                <MdTempleHindu className="text-sindoor" /> My Pooja Bookings
                            </h2>

                            {bookings.length > 0 ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {bookings.map((booking) => (
                                        <div key={booking.id} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="bg-sindoor/10 text-sindoor px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                                    {booking.status || "Confirmed"}
                                                </div>
                                                <span className="text-xs text-stone-400 font-medium">
                                                    {new Date(booking.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-lg text-heritage-dark mb-1">{booking.poojaTitle || "Special Pooja"}</h3>
                                            <p className="text-sm text-stone-500 mb-4 flex items-center gap-1">
                                                <MdTempleHindu className="w-4 h-4 text-marigold" />
                                                {booking.templeName || "Temple Name"}
                                            </p>
                                            <div className="pt-4 border-t border-stone-100 flex justify-between items-center">
                                                <span className="font-bold text-sindoor">₹{booking.amount}</span>
                                                <button className="text-xs font-bold text-stone-600 hover:text-sindoor flex items-center gap-1">
                                                    View Details <ArrowRight className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-2xl p-12 text-center border-dashed border-2 border-stone-200">
                                    <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-400">
                                        <MdTempleHindu className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-lg font-bold text-stone-600 mb-2">No Poojas Booked Yet</h3>
                                    <p className="text-stone-500 text-sm mb-6 max-w-md mx-auto">
                                        Start your spiritual journey by booking a pooja at one of our sacred temples.
                                    </p>
                                    <Link to="/poojas" className="inline-flex items-center px-6 py-3 bg-sindoor text-white rounded-xl font-bold text-sm hover:bg-marigold transition-colors">
                                        Browse Poojas
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab Content: Chadawas */}
                    {activeTab === "chadawas" && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-heritage-dark font-serif mb-4 flex items-center gap-2">
                                <MdVolunteerActivism className="text-marigold" /> My Chadawas
                            </h2>

                            {chadawas.length > 0 ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {chadawas.map((item) => (
                                        <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="bg-marigold/10 text-marigold px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                                    {item.status || "Delivered"}
                                                </div>
                                                <span className="text-xs text-stone-400 font-medium">
                                                    {new Date(item.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-lg text-heritage-dark mb-1">{item.chadawaName || "Sacred Offering"}</h3>
                                            <p className="text-sm text-stone-500 mb-4">{item.templeName || "Temple Name"}</p>
                                            <div className="pt-4 border-t border-stone-100 flex justify-between items-center">
                                                <span className="font-bold text-sindoor">₹{item.amount}</span>
                                                <button className="text-xs font-bold text-stone-600 hover:text-sindoor flex items-center gap-1">
                                                    View Details <ArrowRight className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-2xl p-12 text-center border-dashed border-2 border-stone-200">
                                    <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-400">
                                        <MdVolunteerActivism className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-lg font-bold text-stone-600 mb-2">No Chadawas Offered Yet</h3>
                                    <p className="text-stone-500 text-sm mb-6 max-w-md mx-auto">
                                        Send your offerings and prayers to your beloved deities.
                                    </p>
                                    <Link to="/chadawas" className="inline-flex items-center px-6 py-3 bg-marigold text-white rounded-xl font-bold text-sm hover:bg-sindoor transition-colors">
                                        Send Chadawa
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab Content: Profile (Placeholder) */}
                    {activeTab === "profile" && (
                        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-stone-200 shadow-sm">
                            <h2 className="text-2xl font-serif font-bold text-heritage-dark mb-6 text-center">Profile Settings</h2>
                            <div className="space-y-6">
                                <div className="flex justify-center mb-6">
                                    <div className="w-24 h-24 rounded-full bg-stone-100 flex items-center justify-center text-4xl text-stone-400 relative">
                                        {user?.name?.[0] || <User />}
                                        <button className="absolute bottom-0 right-0 bg-marigold text-white p-2 rounded-full shadow-lg hover:bg-sindoor transition-colors">
                                            <Settings className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-stone-500 uppercase">Full Name</label>
                                        <input type="text" value={user?.name} disabled className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-600" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-stone-500 uppercase">Email Address</label>
                                        <input type="email" value={user?.email} disabled className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-600" />
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-stone-100">
                                    <button className="w-full py-3 border-2 border-stone-200 rounded-xl font-bold text-stone-500 hover:border-marigold hover:text-marigold transition-all">
                                        Edit Profile (Coming Soon)
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
