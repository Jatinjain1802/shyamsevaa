import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../utils/axios";
import {
  FiUsers,
  FiActivity,
  FiDatabase,
  FiShoppingBag,
  FiDollarSign,
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiTrendingUp,
  FiArrowRight,
  FiZap
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { Loader2, IndianRupee } from "lucide-react";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_orders: 0,
    total_revenue: 0,
    pending_bookings: 0,
    total_users: 0,
    total_temples: 0,
    total_poojas: 0,
    total_chadawas: 0,
    total_products: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes, bookingsRes, usersRes] = await Promise.all([
          api.get("/admin/dashboard/stats"),
          api.get("/admin/orders"),
          api.get("/admin/bookings"),
          api.get("/admin/users")
        ]);

        setStats(statsRes.data.data);
        setRecentOrders(ordersRes.data.data.slice(0, 5));
        setRecentBookings(bookingsRes.data.data.slice(0, 5));
        setRecentUsers(usersRes.data.data.slice(0, 5));
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'confirmed':
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-100';
      case 'pending':
        return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'failed':
      case 'cancelled':
      case 'rejected':
        return 'text-red-500 bg-red-50 border-red-100';
      default:
        return 'text-stone-600 bg-stone-50 border-stone-100';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-12 h-12 text-sindoor animate-spin" />
        <p className="text-stone-400 font-serif italic">Preparing the sanctum...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      {/* Premium Welcome Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-stone-900 p-10 text-white shadow-2xl border border-white/5">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-marigold font-bold tracking-widest text-[10px] uppercase bg-marigold/10 w-fit px-3 py-1 rounded-full border border-marigold/20">
              <FiZap className="w-3 h-3 fill-marigold" /> Admin Sanctum
            </div>
            <h1 className="text-2xl lg:text-3xl xl:text-4xl font-black font-serif tracking-tight">
              Auspicious Day, <span className="bg-linear-to-r from-haldi to-marigold bg-clip-text text-transparent">{user?.name || "Admin"}</span>!
            </h1>
            <p className="text-stone-400 text-sm max-w-lg font-medium">
              The platform is flourishing. You have <span className="text-white font-bold underline decoration-marigold decoration-2 underline-offset-4">{stats.pending_bookings} ritual bookings</span> awaiting confirmation in the sacred queue.
            </p>
          </div>
          <div className="flex gap-4">
            <Link to="/admin/bookings" className="px-6 py-3 bg-white text-stone-900 font-bold rounded-2xl hover:bg-marigold transition-all flex items-center gap-2 shadow-lg shadow-white/5 group">
              Review Bookings <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-80 w-80 rounded-full bg-sindoor/10 blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-80 w-80 rounded-full bg-marigold/10 blur-[100px]"></div>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
      </div>

      {/* Main Stats Hub */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-6">
        {/* Revenue Card (Double Span) */}
        <div className="md:col-span-2 relative overflow-hidden bg-white p-6 xl:p-8 rounded-4xl border border-stone-100 shadow-sm group hover:shadow-xl hover:border-marigold/20 transition-all duration-500">
          <div className="flex justify-between items-start relative z-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-stone-400 font-bold text-[10px] uppercase tracking-widest">
                <IndianRupee className="w-3 h-3 text-green-500" /> Revenue Growth
              </div>
              <h3 className="text-3xl xl:text-5xl font-black text-heritage-dark tracking-tighter">
                {formatCurrency(stats.total_revenue)}
              </h3>
              <p className="text-xs text-stone-400 font-medium italic">Lifetime platform earnings across rituals & offerings</p>
            </div>
            <div className="h-16 w-16 bg-stone-50 rounded-2.5xl flex items-center justify-center border border-stone-100 group-hover:bg-marigold transform group-hover:rotate-12 transition-all duration-500">
              <IndianRupee className="w-8 h-8 text-marigold group-hover:text-white" />
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 h-32 w-32 bg-marigold/5 rounded-full blur-3xl group-hover:bg-marigold/10 transition-colors"></div>
        </div>

        {/* Regular Stats Grid */}
        <div className="bg-white p-6 rounded-4xl border border-stone-100 shadow-sm flex flex-col justify-between hover:shadow-lg hover:border-sindoor/10 transition-all group">
          <div className="flex justify-between items-center">
            <div className="h-12 w-12 bg-sindoor/5 rounded-2xl flex items-center justify-center text-sindoor group-hover:bg-sindoor group-hover:text-white transition-all">
              <FiShoppingBag className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-stone-400 bg-stone-50 px-2.5 py-1 rounded-full uppercase tracking-tighter">Orders</span>
          </div>
          <div className="mt-6">
            <h4 className="text-3xl font-black text-heritage-dark">{stats.total_orders}</h4>
            <p className="text-xs text-stone-400 font-semibold mt-1">Sacred Transactions</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-4xl border border-stone-100 shadow-sm flex flex-col justify-between hover:shadow-lg hover:border-indigo-100 transition-all group">
          <div className="flex justify-between items-center">
            <div className="h-12 w-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all">
              <FiUsers className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-stone-400 bg-stone-50 px-2.5 py-1 rounded-full uppercase tracking-tighter">Sangha</span>
          </div>
          <div className="mt-6">
            <h4 className="text-3xl font-black text-heritage-dark">{stats.total_users}</h4>
            <p className="text-xs text-stone-400 font-semibold mt-1">Devout Seekers</p>
          </div>
        </div>
      </div>

      {/* Secondary Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 xl:gap-4">
        {[
          { label: "Temples", val: stats.total_temples, icon: FiDatabase, color: "text-amber-600 bg-amber-50" },
          { label: "Poojas", val: stats.total_poojas, icon: FiActivity, color: "text-rose-600 bg-rose-50" },
          { label: "Chadawas", val: stats.total_chadawas, icon: FiShoppingBag, color: "text-emerald-600 bg-emerald-50" },
          { label: "Products", val: stats.total_products, icon: FiZap, color: "text-indigo-600 bg-indigo-50" }
        ].map((item, i) => (
          <div key={i} className="bg-white px-5 py-4 rounded-2xl border border-stone-50 flex items-center gap-4 hover:border-stone-200 transition-colors">
            <div className={`h-10 w-10 ${item.color} rounded-xl flex items-center justify-center shrink-0`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg font-black text-heritage-dark">{item.val || 0}</p>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 xl:gap-8">

        {/* Recent Orders - 5 Columns */}
        <div className="lg:col-span-5 bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-stone-50 flex justify-between items-center bg-stone-50/30">
            <div>
              <h3 className="text-lg font-bold text-heritage-dark font-serif">Auspicious Transactions</h3>
              <p className="text-xs text-stone-400 italic">Latest flow of devotion</p>
            </div>
            <Link to="/admin/orders" className="text-xs font-bold text-sindoor hover:underline decoration-2 underline-offset-4">
              See All
            </Link>
          </div>
          <div className="divide-y divide-stone-50 flex-1">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-stone-50/50 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="h-11 w-11 rounded-2xl bg-linear-to-br from-stone-100 to-stone-50 flex items-center justify-center text-stone-600 font-black text-sm border border-stone-100 group-hover:border-marigold transition-colors">
                      {order.user_name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-heritage-dark truncate group-hover:text-sindoor transition-colors">{order.order_number}</p>
                      <p className="text-xs text-stone-400 font-medium truncate">{order.user_name || "Guest Seeker"}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-black text-heritage-dark">{formatCurrency(order.total_amount)}</p>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border mt-1 inline-block ${getStatusColor(order.payment_status)}`}>
                      {order.payment_status?.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-stone-300">
                <FiShoppingBag className="w-12 h-12 opacity-10 mb-2" />
                <p className="text-sm italic">The treasury is quiet...</p>
              </div>
            )}
          </div>
        </div>

        {/* Bookings & Users - 7 Columns */}
        <div className="lg:col-span-7 space-y-8">
          {/* Recent Bookings */}
          <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-stone-50 flex justify-between items-center">
              <h3 className="text-md font-bold text-heritage-dark flex items-center gap-2">
                <FiCalendar className="text-marigold" /> Scheduled Rituals
              </h3>
              <Link to="/admin/bookings" className="text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-marigold transition-colors">
                Queue View
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-50">
              {recentBookings.slice(0, 4).map((booking) => (
                <div key={booking.id} className="p-6 hover:bg-stone-50/50 transition-all flex items-center justify-between group">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-heritage-dark truncate">{booking.devotee_name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <FiClock className="w-3 h-3 text-marigold" />
                      <p className="text-[11px] text-stone-500 font-medium">{formatDate(booking.pooja_date)}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-black border-l-4 pl-3 py-1 ${getStatusColor(booking.status)} border-current`}>
                    {booking.status?.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-md font-bold text-heritage-dark flex items-center gap-2 font-serif">
                <FiUsers className="text-indigo-500" /> New Sangha Members
              </h3>
              <Link to="/admin/users" className="text-xs font-bold text-indigo-500 hover:underline decoration-2 underline-offset-4">
                Manage All
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {recentUsers.map((u) => (
                <div key={u.id} className="flex-1 min-w-[200px] p-4 bg-stone-50 rounded-2xl border border-transparent hover:border-indigo-100 hover:bg-white transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-indigo-600 font-black text-xs border border-stone-100 shadow-xs group-hover:scale-110 transition-transform">
                      {u.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-heritage-dark truncate">{u.name}</p>
                      <p className="text-[11px] text-stone-400 font-medium truncate">{u.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
