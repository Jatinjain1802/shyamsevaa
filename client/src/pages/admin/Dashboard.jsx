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
  FiXCircle,
  FiAlertCircle
} from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_orders: 0,
    total_revenue: 0,
    pending_bookings: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes, bookingsRes] = await Promise.all([
          api.get("/admin/dashboard/stats"),
          api.get("/admin/orders"),
          api.get("/admin/bookings")
        ]);

        setStats(statsRes.data.data);
        // Take only first 5 for recent activity
        setRecentOrders(ordersRes.data.data.slice(0, 5));
        setRecentBookings(bookingsRes.data.data.slice(0, 5));
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
        return 'text-red-600 bg-red-50 border-red-100';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  const statCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats.total_revenue),
      subValue: "Lifetime earnings",
      icon: FiDollarSign,
      color: "from-green-500 to-emerald-600",
      bgLight: "bg-emerald-50",
      textLight: "text-emerald-600"
    },
    {
      title: "Total Orders",
      value: stats.total_orders,
      subValue: "All time orders",
      icon: FiShoppingBag,
      color: "from-sky-500 to-blue-600",
      bgLight: "bg-blue-50",
      textLight: "text-blue-600"
    },
    {
      title: "Pending Bookings",
      value: stats.pending_bookings,
      subValue: "Requires attention",
      icon: FiClock,
      color: "from-orange-500 to-red-500",
      bgLight: "bg-orange-50",
      textLight: "text-orange-600"
    },
    {
      title: "Total Temples",
      value: stats.total_temples || 0,
      subValue: "Active temples",
      icon: FiDatabase,
      color: "from-purple-500 to-violet-600",
      bgLight: "bg-purple-50",
      textLight: "text-purple-600"
    },
    {
      title: "Total Poojas",
      value: stats.total_poojas || 0,
      subValue: "Services offered",
      icon: FiActivity,
      color: "from-pink-500 to-rose-600",
      bgLight: "bg-pink-50",
      textLight: "text-pink-600"
    },
    {
      title: "Total Chadawas",
      value: stats.total_chadawas || 0,
      subValue: "Offerings listed",
      icon: FiShoppingBag,
      color: "from-yellow-500 to-amber-600",
      bgLight: "bg-yellow-50",
      textLight: "text-yellow-600"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-gray-900 to-gray-800 p-8 text-white shadow-xl">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold">
            Welcome back, <span className="text-orange-400">{user?.name || "Admin"}</span>!
          </h1>
          <p className="mt-2 text-gray-300 max-w-xl">
            Here's an overview of your platform's performance today. You have <span className="font-semibold text-white">{stats.pending_bookings} pending bookings</span> requiring your attention.
          </p>
        </div>
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="group relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-lg hover:-translate-y-1"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</h3>
                <p className="text-xs text-gray-400 mt-1">{stat.subValue}</p>
              </div>
              <div className={`p-4 rounded-xl bg-linear-to-br ${stat.color} shadow-lg group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FiShoppingBag className="text-blue-500" /> Recent Orders
            </h3>
            <Link to="/admin/poojas" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">
                      {order.user_name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{order.order_number}</p>
                      <p className="text-xs text-gray-500">{order.user_name || order.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{formatCurrency(order.total_amount)}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${getStatusColor(order.payment_status)}`}>
                      {order.payment_status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400">
                No recent orders found
              </div>
            )}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FiCalendar className="text-orange-500" /> Recent Bookings
            </h3>
            <Link to="/admin/bookings" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
              View All
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <div key={booking.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{booking.devotee_name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <FiCalendar className="w-3 h-3 text-gray-400" />
                      <p className="text-xs text-gray-500">{formatDate(booking.pooja_date)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-medium border ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400">
                No pending bookings
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
