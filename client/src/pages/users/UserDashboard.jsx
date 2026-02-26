import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/layout/Navbar";
import api from "../../utils/axios";
import socket from "../../utils/socket";
import toast from "react-hot-toast";
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
    const { user, logout, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("bookings");
    const [bookings, setBookings] = useState([]);
    const [chadawas, setChadawas] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const fetchUserData = async () => {
        try {
            // Fetch Bookings
            const bookingsRes = await api.get("/bookings/my-bookings").catch(() => ({ data: { data: [] } }));
            setBookings(bookingsRes.data.data || []);

            // Fetch Chadawas
            const chadawasRes = await api.get("/orders/my-chadawas").catch(() => ({ data: { data: [] } }));
            setChadawas(chadawasRes.data.data || []);

            // Fetch Orders
            const ordersRes = await api.get("/orders").catch(() => ({ data: { data: [] } }));
            setOrders(ordersRes.data.data || []);
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Wait for Auth check to complete before making decisions
        if (authLoading) return;

        if (!user) {
            navigate("/login");
            return;
        }

        fetchUserData();

        // Socket integration
        socket.connect();

        socket.on("connect", () => {
            if (user?.id) {
                socket.emit("join-user-room", user.id);
            }
        });

        socket.on("status-updated", (data) => {
            let message = `Update: Your ${data.type} status is now ${data.status}!`;
            let icon = '🕉️';

            if (data.status === 'confirmed') {
                message = `Divine blessings! Your ritual has been confirmed.`;
                icon = '✅';
            } else if (data.status === 'completed') {
                message = `Pooja Successful! The sacred ritual is complete.`;
                icon = '🙏';
            }

            toast.success(message, {
                icon,
                duration: 6000,
                position: 'top-right',
                style: {
                    borderRadius: '16px',
                    background: '#fff',
                    color: '#800000',
                    border: '1px solid #FFD700'
                }
            });

            fetchUserData(); // Refresh data live
        });

        return () => {
            socket.off("status-updated");
            socket.disconnect();
        };
    }, [user, navigate, authLoading]);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-stone-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 text-marigold animate-spin mx-auto mb-4" />
                        <p className="text-stone-500 font-serif italic">Gathering your divine records...</p>
                    </div>
                </div>
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
        <div className="h-screen bg-stone-50 flex flex-col overflow-hidden">
            {/* Global Navbar */}
            <Navbar />

            <div className="flex flex-1 overflow-hidden relative">
                {/* Sidebar Overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                )}

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
                            <SidebarLink id="orders" label="My Orders" icon={ShoppingBag} />
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

                {/* Main Content */}
                <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-stone-50">
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
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                        {/* Stats Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <StatCard title="Total Poojas" value={bookings.length} icon={MdTempleHindu} color="sindoor" />
                            <StatCard title="Total Chadawas" value={chadawas.length} icon={MdVolunteerActivism} color="marigold" />
                            <StatCard title="Total Orders" value={orders.length} icon={ShoppingBag} color="sindoor" />
                            <StatCard title="Active Days" value="12" icon={Calendar} color="stone" />
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
                                                        {new Date(booking.pooja_date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-lg text-heritage-dark mb-1">{booking.pooja_title || "Special Pooja"}</h3>
                                                <p className="text-sm text-stone-500 mb-4 flex items-center gap-1">
                                                    <MdTempleHindu className="w-4 h-4 text-marigold" />
                                                    {booking.temple_title || "Temple Name"}
                                                </p>
                                                <div className="pt-4 border-t border-stone-100 flex justify-between items-center">
                                                    <span className="font-bold text-sindoor">₹{Number(booking.base_price).toLocaleString()}</span>
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
                                                        {item.payment_status || "Delivered"}
                                                    </div>
                                                    <span className="text-xs text-stone-400 font-medium">
                                                        {new Date(item.order_date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-lg text-heritage-dark mb-1">{item.chadawa_name || "Sacred Offering"}</h3>
                                                <p className="text-sm text-stone-500 mb-4">{item.temple_name || "Temple Name"}</p>
                                                <div className="pt-4 border-t border-stone-100 flex justify-between items-center">
                                                    <span className="font-bold text-sindoor">₹{Number(item.price).toLocaleString()}</span>
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

                        {/* Tab Content: Orders */}
                        {activeTab === "orders" && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-heritage-dark font-serif mb-4 flex items-center gap-2">
                                    <ShoppingBag className="text-sindoor" /> My Transaction History
                                </h2>

                                {orders.length > 0 ? (
                                    <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-stone-50 border-b border-stone-100">
                                                <tr>
                                                    <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase">Order ID</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase">Date</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase">Amount</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-stone-50">
                                                {orders.map((order) => (
                                                    <tr key={order.id} className="hover:bg-stone-50/50 transition-colors">
                                                        <td className="px-6 py-4 font-bold text-heritage-dark text-sm">{order.order_number}</td>
                                                        <td className="px-6 py-4 text-stone-500 text-sm">{new Date(order.created_at).toLocaleDateString()}</td>
                                                        <td className="px-6 py-4 font-bold text-sindoor text-sm">₹{Number(order.total_amount).toLocaleString()}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${order.payment_status === 'paid' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                                                {order.payment_status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-2xl p-12 text-center border-dashed border-2 border-stone-200">
                                        <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-bold text-stone-600 mb-2">No Orders Found</h3>
                                        <p className="text-stone-500 text-sm">You haven't made any transactions yet.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tab Content: Profile */}
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
        </div>
    );
}
