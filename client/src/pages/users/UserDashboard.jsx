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
    ArrowRight,
    MapPin,
    Download
} from "lucide-react";
import { MdTempleHindu, MdVolunteerActivism } from "react-icons/md";
import AddressUpdateModal from "../../components/common/AddressUpdateModal";
import { getAssetUrl } from "../../utils/assets";

export default function UserDashboard() {
    const { user, logout, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("bookings");
    const [bookings, setBookings] = useState([]);
    const [chadawas, setChadawas] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);

    // Order Details Modal State
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [orderModalLoading, setOrderModalLoading] = useState(false);

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

    const fetchOrderDetails = async (orderId) => {
        try {
            setOrderModalLoading(true);
            setIsOrderModalOpen(true);
            const res = await api.get(`/orders/${orderId}`);
            if (res.data.success) {
                setSelectedOrder(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch order details", error);
            toast.error("Failed to load order details");
            setIsOrderModalOpen(false);
        } finally {
            setOrderModalLoading(false);
        }
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
                                                    {booking.invoice_path ? (
                                                        <a
                                                            href={getAssetUrl(booking.invoice_path)}
                                                            download
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs font-bold text-marigold hover:text-sindoor flex items-center gap-1 group"
                                                        >
                                                            Download Invoice <Download className="w-3 h-3 group-hover:scale-125 transition-transform" />
                                                        </a>
                                                    ) : (
                                                        <button className="text-xs font-bold text-stone-400 cursor-not-allowed flex items-center gap-1">
                                                            Processing <Loader2 className="w-3 h-3 animate-spin" />
                                                        </button>
                                                    )}
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
                                                    {item.invoice_path ? (
                                                        <a
                                                            href={getAssetUrl(item.invoice_path)}
                                                            download
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs font-bold text-marigold hover:text-sindoor flex items-center gap-1 group"
                                                        >
                                                            Download Invoice <Download className="w-3 h-3 group-hover:scale-125 transition-transform" />
                                                        </a>
                                                    ) : (
                                                        <button className="text-xs font-bold text-stone-400 cursor-not-allowed flex items-center gap-1">
                                                            Processing <Loader2 className="w-3 h-3 animate-spin" />
                                                        </button>
                                                    )}
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
                                                    <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase">Type</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase">Date</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase">Amount</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-stone-50">
                                                {orders.map((order) => (
                                                    <tr key={order.id} className="hover:bg-stone-50/50 transition-colors">
                                                        <td className="px-6 py-4 font-bold text-heritage-dark text-sm">{order.order_number}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider ${
                                                                order.order_type === 'pooja_variant' ? 'bg-sindoor/10 text-sindoor' : 
                                                                order.order_type === 'chadawa_item' ? 'bg-marigold/10 text-marigold' : 
                                                                'bg-stone-100 text-stone-600'
                                                            }`}>
                                                                {order.order_type === 'pooja_variant' ? 'Pooja' : 
                                                                 order.order_type === 'chadawa_item' ? 'Chadawa' : 
                                                                 order.order_type === 'product' ? 'Product' : 'Other'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-stone-500 text-sm">{new Date(order.created_at).toLocaleDateString()}</td>
                                                        <td className="px-6 py-4 font-bold text-sindoor text-sm">₹{Number(order.total_amount).toLocaleString()}</td>
                                                        <td className="px-6 py-4 flex items-center justify-between">
                                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${order.payment_status === 'paid' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                                                {order.payment_status}
                                                            </span>
                                                            {order.invoice_path && (
                                                                <a
                                                                    href={getAssetUrl(order.invoice_path)}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-xs font-bold text-marigold hover:text-sindoor ml-4 flex items-center gap-1"
                                                                    title="Download Invoice"
                                                                >
                                                                    <Download className="w-4 h-4" />
                                                                </a>
                                                            )}
                                                            <button
                                                                onClick={() => fetchOrderDetails(order.id)}
                                                                className="text-xs font-bold text-stone-600 hover:text-sindoor ml-4"
                                                            >
                                                                View
                                                            </button>
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
                            <div className="max-w-3xl mx-auto space-y-8">
                                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-stone-200 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-marigold/5 rounded-full -mr-32 -mt-32 blur-3xl" />

                                    <div className="relative flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left">
                                        <div className="relative group">
                                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-linear-to-br from-sindoor to-marigold p-1 shadow-2xl">
                                                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-5xl md:text-6xl font-black text-heritage-dark overflow-hidden">
                                                    {user?.name?.[0]?.toUpperCase() || <User className="w-16 h-16" />}
                                                </div>
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 p-3 bg-white rounded-full shadow-lg border border-stone-100 text-sindoor">
                                                <Settings className="w-5 h-5 animate-spin-slow" />
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-6">
                                            <div>
                                                <h2 className="text-3xl font-black text-heritage-dark">{user?.name}</h2>
                                                <p className="text-stone-500 font-medium">{user?.email}</p>
                                                <div className="mt-2 inline-flex items-center px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-black uppercase tracking-widest border border-green-100">
                                                    Verified Devotee
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3 text-stone-400 group">
                                                        <div className="p-2 bg-stone-50 rounded-lg group-hover:bg-sindoor/10 group-hover:text-sindoor transition-colors">
                                                            <Calendar className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase tracking-widest">Phone Number</p>
                                                            <p className="text-sm font-bold text-heritage-dark">{user?.mobile || 'Not Linked'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-stone-400 group">
                                                        <div className="p-2 bg-stone-50 rounded-lg group-hover:bg-sindoor/10 group-hover:text-sindoor transition-colors">
                                                            <LayoutDashboard className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase tracking-widest">Active Since</p>
                                                            <p className="text-sm font-bold text-heritage-dark">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Dec 2023'}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-4 bg-stone-50/50 p-6 rounded-3xl border border-stone-100">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <p className="text-xs font-black text-stone-400 uppercase tracking-widest">Delivery Address</p>
                                                        <button
                                                            onClick={() => setShowAddressModal(true)}
                                                            className="text-xs font-black text-sindoor hover:text-marigold transition-colors"
                                                        >
                                                            Update
                                                        </button>
                                                    </div>

                                                    {user?.address ? (
                                                        <div className="space-y-1">
                                                            <p className="text-sm font-bold text-heritage-dark flex items-start gap-2">
                                                                <MapPin className="w-4 h-4 text-sindoor mt-0.5 shrink-0" />
                                                                {user.address}
                                                            </p>
                                                            <p className="text-sm font-bold text-heritage-dark pl-6">
                                                                {user.city}, {user.state}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-2">
                                                            <p className="text-xs text-stone-400 italic mb-3">No shipping address found</p>
                                                            <button
                                                                onClick={() => setShowAddressModal(true)}
                                                                className="px-4 py-2 bg-white border border-stone-200 rounded-xl text-xs font-bold text-heritage-dark hover:border-sindoor hover:text-sindoor transition-all"
                                                            >
                                                                Add Address
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm group hover:border-sindoor/30 transition-all">
                                        <div className="w-12 h-12 bg-sindoor/10 text-sindoor rounded-2xl flex items-center justify-center mb-6">
                                            <Settings className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-lg font-black text-heritage-dark mb-2">Account Privacy</h3>
                                        <p className="text-sm text-stone-500 mb-6">Manage your security settings and notification preferences for a better spiritual experience.</p>
                                        <button className="text-sm font-black text-heritage-dark/40 cursor-not-allowed italic">Security settings coming soon...</button>
                                    </div>
                                    <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm group hover:border-marigold/30 transition-all">
                                        <div className="w-12 h-12 bg-marigold/10 text-marigold rounded-2xl flex items-center justify-center mb-6">
                                            <Bell className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-lg font-black text-heritage-dark mb-2">Support Center</h3>
                                        <p className="text-sm text-stone-500 mb-6">Need help with a booking? Our dedicated support team is available 24/7 for your divine assistance.</p>
                                        <Link to="/contact" className="text-sm font-black text-marigold hover:text-sindoor transition-colors inline-flex items-center gap-2">
                                            Contact Support <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            <AddressUpdateModal
                isOpen={showAddressModal}
                onClose={() => setShowAddressModal(false)}
            />

            {/* Order Details Modal */}
            {isOrderModalOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setIsOrderModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-2xl max-h-[90vh] rounded-4xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col">
                        <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                            <div>
                                <h2 className="text-xl font-bold text-heritage-dark font-serif">Order Details</h2>
                                {selectedOrder && <p className="text-sm text-stone-500 font-mono mt-1">{selectedOrder.order.order_number}</p>}
                            </div>
                            <button onClick={() => setIsOrderModalOpen(false)} className="p-2 hover:bg-stone-200 rounded-full transition-colors">
                                <X className="w-6 h-6 text-stone-500" />
                            </button>
                        </div>

                        <div className="p-6 md:p-8 overflow-y-auto flex-1 scrollbar-hide">
                            {orderModalLoading ? (
                                <div className="py-20 flex flex-col items-center justify-center space-y-4">
                                    <Loader2 className="w-10 h-10 text-marigold animate-spin" />
                                    <p className="text-stone-400 italic">Fetching sacred records...</p>
                                </div>
                            ) : selectedOrder ? (
                                <div className="space-y-8">
                                    {(selectedOrder.order.shipping_address || selectedOrder.order.communication_mobile) && (
                                        <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                                            <p className="text-[10px] uppercase tracking-wider text-stone-400 font-bold mb-4">Delivery & Contact Details</p>
                                            <div className="space-y-3">
                                                {selectedOrder.order.customer_name && (
                                                    <div className="flex items-start gap-2">
                                                        <User className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                                                        <p className="text-sm font-bold text-heritage-dark">{selectedOrder.order.customer_name}</p>
                                                    </div>
                                                )}
                                                {selectedOrder.order.communication_mobile && (
                                                    <div className="flex items-start gap-2">
                                                        <User className="w-4 h-4 text-stone-400 mt-0.5 shrink-0 opacity-0 hidden sm:block" />
                                                        <p className="text-xs font-bold text-stone-600 bg-white border border-stone-200 rounded px-2 py-0.5">📱 +91 {selectedOrder.order.communication_mobile}</p>
                                                    </div>
                                                )}
                                                {selectedOrder.order.shipping_address && (
                                                    <div className="flex items-start gap-2 pt-3 border-t border-stone-200">
                                                        <MapPin className="w-4 h-4 text-sindoor mt-0.5 shrink-0" />
                                                        <p className="text-sm font-medium text-stone-600 leading-relaxed">{selectedOrder.order.shipping_address}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-heritage-dark flex items-center gap-2">
                                            <ShoppingBag className="text-marigold w-4 h-4" /> Ordered Items
                                        </h3>
                                        <div className="space-y-3">
                                            {selectedOrder.items.map((item, idx) => (
                                                <div key={idx} className="p-4 border border-stone-100 rounded-2xl bg-white shadow-sm">
                                                    <div className="flex justify-between items-start">
                                                        <div className="space-y-1">
                                                            <p className="text-sm font-bold text-sindoor">
                                                                {item.product_type === 'pooja_variant'
                                                                    ? `${item.pooja_title} (${item.pooja_persons} Persons)`
                                                                    : item.product_type === 'product'
                                                                        ? item.product_name || 'Product Order'
                                                                        : item.chadawa_item_title || 'Chadawa Offering'}
                                                            </p>
                                                            {item.temple_title ? (
                                                                <div className="flex items-center gap-1.5 text-xs text-stone-500">
                                                                    <MapPin className="text-marigold w-3 h-3" />
                                                                    {item.temple_title}
                                                                </div>
                                                            ) : item.product_type === 'product' && (
                                                                <div className="flex items-center gap-1.5 text-xs text-stone-500">
                                                                    <MapPin className="text-marigold w-3 h-3" />
                                                                    Physical Delivery
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm font-bold text-heritage-dark">₹{Number(item.price).toLocaleString()}</p>
                                                            <p className="text-[10px] text-stone-400">Qty: {item.quantity}</p>
                                                        </div>
                                                    </div>

                                                    {/* Devotee Details */}
                                                    {item.bookings && item.bookings.length > 0 && (
                                                        <div className="mt-3 pt-3 border-t border-stone-50 space-y-2">
                                                            <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Devotees</p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {item.bookings.map((booking, bIdx) => (
                                                                    <div key={bIdx} className="text-[11px] bg-sindoor/5 text-sindoor px-2 py-1 rounded-lg border border-sindoor/10">
                                                                        <span className="font-bold">{booking.devotee_name}</span>
                                                                        {booking.gotra && <span className="text-stone-500 ml-1">({booking.gotra})</span>}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {item.addons && item.addons.length > 0 && (
                                                        <div className="mt-3 pt-3 border-t border-stone-50 space-y-2">
                                                            <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Addons</p>
                                                            {item.addons.map((addon, aIdx) => (
                                                                <div key={aIdx} className="flex justify-between items-center text-[11px] bg-stone-50/50 p-2 rounded-lg">
                                                                    <span className="text-stone-600 font-medium">{addon.addon_title}</span>
                                                                    <span className="font-bold text-heritage-dark">₹{Number(addon.price).toLocaleString()}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-stone-100">
                                        <div className="flex justify-between items-center bg-heritage-dark p-6 rounded-2xl text-white shadow-lg">
                                            <div>
                                                <p className="text-xs text-white/60">Total Order Value</p>
                                                <p className="text-2xl font-bold">₹{Number(selectedOrder.order.total_amount).toLocaleString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-white/60">Payment Status</p>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase inline-block mt-1 ${selectedOrder.order.payment_status === 'paid' ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'}`}>
                                                    {selectedOrder.order.payment_status}
                                                </span>
                                            </div>
                                        </div>

                                        {selectedOrder.order.invoice_path && (
                                            <a
                                                href={getAssetUrl(selectedOrder.order.invoice_path)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-6 flex items-center justify-center gap-2 w-full py-4 border-2 border-stone-200 hover:border-marigold hover:text-marigold text-stone-600 rounded-xl font-bold transition-all"
                                            >
                                                <Download className="w-5 h-5" /> Download Tax Invoice
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
