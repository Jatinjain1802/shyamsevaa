import { useEffect, useState } from "react";
import api from "../../utils/axios";
import {
  FiCalendar,
  FiFilter,
  FiSearch,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiMoreVertical,
  FiUser,
  FiMapPin
} from "react-icons/fi";
import { Loader2 } from "lucide-react";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/bookings");
      if (res.data.success) {
        setBookings(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch admin bookings", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (bookingId, newStatus) => {
    try {
      const res = await api.put(`/admin/bookings/${bookingId}/status`, { status: newStatus });
      if (res.data.success) {
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
      }
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      pending: "bg-yellow-50 text-yellow-600 border-yellow-100",
      confirmed: "bg-green-50 text-green-600 border-green-100",
      completed: "bg-blue-50 text-blue-600 border-blue-100",
      cancelled: "bg-red-50 text-red-600 border-red-100"
    };
    const Icons = {
      pending: FiClock,
      confirmed: FiCheckCircle,
      completed: FiCheckCircle,
      cancelled: FiAlertCircle
    };
    const Icon = Icons[status.toLowerCase()] || FiClock;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 w-fit ${styles[status.toLowerCase()] || styles.pending}`}>
        <Icon className="w-3 h-3" />
        {status.toUpperCase()}
      </span>
    );
  };

  const filteredBookings = bookings.filter(b =>
    b.pooja_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.devotee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.order_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-sindoor animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-heritage-dark flex items-center gap-3 font-serif">
            <FiCalendar className="text-sindoor" />
            Ritual Bookings
          </h1>
          <p className="text-stone-500 mt-1 text-sm italic">Monitor and manage sacred bookings across all temples.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search devotee or ritual..."
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-marigold transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2.5 bg-white border border-stone-200 rounded-xl text-stone-600 hover:bg-stone-50 transition-colors">
            <FiFilter />
          </button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100">
                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Order & Date</th>
                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Ritual Detail</th>
                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Devotee</th>
                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filteredBookings.length > 0 ? filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-linear-to-r hover:from-white hover:to-haldi/5 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="text-sm font-bold text-heritage-dark">{booking.order_number}</div>
                    <div className="text-xs text-stone-400 mt-1 flex items-center gap-1">
                      <FiCalendar className="w-3 h-3" />
                      {new Date(booking.pooja_date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm font-bold text-sindoor">{booking.pooja_title}</div>
                    <div className="text-xs text-stone-500 mt-1 flex items-center gap-1 font-medium">
                      <FiMapPin className="text-marigold w-3 h-3" />
                      {booking.temple_title}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-haldi/20 to-marigold/20 flex items-center justify-center text-sindoor font-bold text-xs border border-marigold/10">
                        {booking.devotee_name?.[0]}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-heritage-dark">{booking.devotee_name}</div>
                        <div className="text-xs text-stone-400 font-medium italic">Gotra: {booking.gotra || "N/A"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="px-6 py-5">
                    <select
                      className="text-xs bg-stone-100 border-none rounded-lg px-2 py-1.5 focus:ring-1 focus:ring-marigold cursor-pointer hover:bg-stone-200 transition-colors"
                      value={booking.status}
                      onChange={(e) => updateStatus(booking.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center text-stone-400 italic">
                    <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-stone-100">
                      <FiCalendar className="w-8 h-8 opacity-20" />
                    </div>
                    No bookings found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
