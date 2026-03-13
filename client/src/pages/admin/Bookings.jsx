import { useEffect, useState, useMemo } from "react";
import api from "../../utils/axios";
import {
  FiCalendar,
  FiFilter,
  FiSearch,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiMapPin,
  FiChevronDown,
  FiChevronUp,
  FiUsers,
  FiPackage,
  FiClock as FiTime,
  FiArrowRight,
  FiDownload,
  FiX
} from "react-icons/fi";
import { Loader2, User, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import * as XLSX from 'xlsx';
import toast from "react-hot-toast";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("pooja");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedDateKey, setSelectedDateKey] = useState(null);
  const [processingDate, setProcessingDate] = useState(null);

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

  const updateStatus = async (orderItemId, newStatus) => {
    // Note: Since multiple bookings share the same order_item_id, 
    // updating status on one should ideally update all in that group.
    // Our backend currently updates by booking ID. We'll iterate and update.
    try {
      // Find all booking IDs in this order_item group
      const targetBookings = bookings.filter(b => b.order_item_id === orderItemId);
      
      // Call update for each (Ideally, backend should have an updateByOrderItem endpoint)
      await Promise.all(targetBookings.map(b => 
        api.put(`/admin/bookings/${b.id}/status`, { status: newStatus })
      ));

      setBookings(prev => prev.map(b => 
        b.order_item_id === orderItemId ? { ...b, status: newStatus } : b
      ));
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const toggleExpand = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpandedItems(newExpanded);
  };

  const exportToExcel = (bookingsData, date) => {
    const data = bookingsData.map(b => ({
      'Order ID': b.order_number,
      'Pooja Name': b.pooja_title,
      'Devotee': b.devotee_name,
      'Gotra': b.gotra || 'N/A',
      'Mobile': b.mobile || 'N/A',
      'Variant': b.variant_title || 'N/A',
      'Add-ons': b.addon_details || 'None',
      'Temple': b.temple_title,
      'Status': 'Completed'
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bookings");
    XLSX.writeFile(wb, `Bookings_${date}.xlsx`);
  };

  const handleMarkAsCompleted = async () => {
    const dateKey = selectedDateKey;
    if (!dateKey) return;
    
    try {
      setProcessingDate(dateKey);
      const targetBookings = bookings.filter(b => {
        const isSameDate = b.pooja_date.split('T')[0] === dateKey;
        const matchesType = activeTab === "pooja" ? b.product_type === 'pooja_variant' : b.product_type === 'chadawa_item';
        const isNotCompleted = b.status.toLowerCase() !== 'completed';
        return isSameDate && matchesType && isNotCompleted;
      });

      if (targetBookings.length === 0) {
          setShowConfirm(false);
          return;
      }

      // 1. Export TO Excel before status update
      exportToExcel(targetBookings, dateKey);

      // 2. Update status on server
      await Promise.all(targetBookings.map(b => 
        api.put(`/admin/bookings/${b.id}/status`, { status: 'completed' })
      ));

      // 3. Update local state
      const updatedBookingIds = new Set(targetBookings.map(b => b.id));
      setBookings(prev => prev.map(b => 
        updatedBookingIds.has(b.id) ? { ...b, status: 'completed' } : b
      ));

      toast.success(`Bookings for ${dateKey} marked as completed & Excel downloaded`);
      setShowConfirm(false);
    } catch (error) {
      console.error("Failed to mark all as completed", error);
      toast.error("Operation failed. Please try again.");
    } finally {
      setProcessingDate(null);
    }
  };

  const markDateAsCompleted = (dateKey) => {
    setSelectedDateKey(dateKey);
    setShowConfirm(true);
  };

  // LEARNING: Grouping logic for clean UI - Bundling by Order Number
  const groupedBookings = useMemo(() => {
    const filtered = bookings.filter(b => {
      const matchesType = activeTab === "pooja" 
        ? b.product_type === 'pooja_variant' 
        : b.product_type === 'chadawa_item';
      
      const matchesStatus = statusFilter === "all" || b.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesSearch = 
        b.pooja_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.devotee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.order_number?.toLowerCase().includes(searchTerm.toLowerCase());
        
      return matchesType && matchesStatus && matchesSearch;
    });

    // Grouping by Date -> then by Order Number (Bundle)
    const days = {};
    filtered.forEach(b => {
      const dateKey = b.pooja_date.split('T')[0];
      if (!days[dateKey]) days[dateKey] = {};
      
      const orderKey = b.order_number; // Group by Order instead of item ID
      if (!days[dateKey][orderKey]) {
        days[dateKey][orderKey] = {
          order_number: b.order_number,
          order_item_id: b.order_item_id, // For status tracking
          pooja_date: b.pooja_date,
          status: b.status,
          temple_title: b.temple_title,
          pooja_title: b.pooja_title, // Representative title
          all_items: []
        };
      }
      days[dateKey][orderKey].all_items.push(b);
    });

    return Object.entries(days)
      .sort((a, b) => new Date(b[0]) - new Date(a[0]))
      .map(([date, orders]) => ({
        date,
        orders: Object.values(orders)
      }));
  }, [bookings, activeTab, statusFilter, searchTerm]);

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
      <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest border flex items-center gap-1.5 w-fit uppercase ${styles[status.toLowerCase()] || styles.pending}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-sindoor animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header Section */}
      <div className="p-6 sm:p-8 rounded-[2.5rem] shadow-xl shadow-stone-200/50 border border-stone-200/60 sticky top-0 z-20 backdrop-blur-md bg-white/90">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-sindoor font-bold text-xs uppercase tracking-[0.2em] mb-2">
               <FiTime /> Real-time Management
            </div>
            <h1 className="text-3xl font-black text-heritage-dark flex items-center gap-3 font-serif">
              Sacred Bookings
            </h1>
          </div>

          <div className="flex bg-stone-100 p-1.5 rounded-2xl border border-stone-200 w-full lg:w-auto self-stretch lg:self-auto">
            {[
              { id: 'pooja', label: 'POOJA', icon: FiUsers },
              { id: 'chadawa', label: 'CHADAWA', icon: FiPackage }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setExpandedItems(new Set()); // Reset on tab change
                }}
                className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-xs font-black tracking-widest transition-all duration-500 ${
                  activeTab === tab.id
                    ? "bg-white text-sindoor shadow-xl shadow-sindoor/10 border border-stone-100 scale-[1.02]"
                    : "text-stone-500 hover:text-stone-700 hover:bg-stone-50"
                }`}
              >
                <tab.icon className={activeTab === tab.id ? "text-sindoor" : "text-stone-400"} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-marigold transition-colors" />
            <input
              type="text"
              placeholder={`Search ${activeTab} devotees, orders...`}
              className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 rounded-2xl text-sm focus:outline-none focus:border-marigold focus:bg-white transition-all shadow-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              <select
                className="w-full pl-12 pr-10 py-4 bg-stone-50 border border-stone-200 rounded-2xl text-sm focus:outline-none focus:border-marigold focus:bg-white appearance-none cursor-pointer shadow-xs font-bold text-heritage-dark"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Grouped Content */}
      <div className="space-y-12 px-2">
        {groupedBookings.length > 0 ? (
          groupedBookings.map(({ date, orders }) => (
            <div key={date} className="relative">
              {/* Date Header - Sticky and Premium */}
              <div className="sticky top-[200px] z-10 flex items-center justify-between gap-4 mb-6 pt-2">
                <div className="flex items-center gap-4 flex-1">
                  <div className="bg-linear-to-r from-sindoor to-marigold text-white px-6 py-2.5 rounded-2xl shadow-lg shadow-sindoor/20 flex items-center gap-3 shrink-0">
                    <FiCalendar className="w-5 h-5" />
                    <span className="font-serif italic font-bold tracking-tight">
                      {new Date(date).toLocaleDateString('en-IN', { 
                        weekday: 'short', 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="h-px grow bg-stone-200 shadow-sm"></div>
                </div>
                
                {/* Bulk Completion Action */}
                {!orders.every(o => o.status.toLowerCase() === 'completed') && (
                  <button 
                    onClick={() => markDateAsCompleted(date)}
                    className="group flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-stone-200 text-stone-500 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50/50 transition-all shadow-sm active:scale-95"
                  >
                    <FiCheckCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-black uppercase tracking-widest">
                      Mark All Completed
                    </span>
                  </button>
                )}
              </div>

              {/* Items for this date */}
              <div className="grid grid-cols-1 gap-4">
                {orders.map((group) => {
                  const isExpanded = expandedItems.has(group.order_number);
                  const itemCount = group.all_items.length;
                  
                  // For Chadawa: If multiple items, show count. For Pooja: show devotee count.
                  const uniqueTitles = [...new Set(group.all_items.map(i => i.pooja_title))];
                  const displayTitle = uniqueTitles.length > 1 
                    ? `${uniqueTitles[0]} & ${uniqueTitles.length - 1} more`
                    : group.pooja_title;

                  return (
                    <div 
                      key={group.order_number}
                      className={`group bg-white rounded-3xl overflow-hidden border transition-all duration-500 ${
                        isExpanded 
                          ? 'border-sindoor/30 shadow-2xl shadow-sindoor/5 translate-x-2' 
                          : 'border-stone-100 shadow-sm hover:shadow-xl hover:border-marigold/20 hover:-translate-y-1'
                      }`}
                    >
                      {/* Main Group Header Row */}
                      <div 
                        className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 cursor-pointer"
                        onClick={() => toggleExpand(group.order_number)}
                      >
                        <div className="flex items-center gap-6 grow">
                          {/* Order Indicator */}
                          <div className="hidden sm:flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-stone-50 border border-stone-100 group-hover:bg-marigold/5 transition-colors">
                             <span className="text-[10px] font-black text-stone-400 uppercase">Order</span>
                             <span className="text-sm font-bold text-heritage-dark">#{group.order_number.slice(-4)}</span>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-black text-heritage-dark leading-tight group-hover:text-sindoor transition-colors">
                                {displayTitle}
                              </h3>
                              <FiArrowRight className={`text-stone-300 transition-transform duration-500 ${isExpanded ? 'rotate-90 text-sindoor' : ''}`} />
                            </div>
                            <div className="flex items-center gap-4 text-xs font-medium text-stone-400">
                              <span className="flex items-center gap-1">
                                <FiMapPin className="text-marigold" /> {group.temple_title}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-stone-200"></span>
                              <span className="flex items-center gap-1 font-bold text-stone-500 uppercase tracking-widest">
                                FULL ID: {group.order_number}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                          {/* Item/Devotee Count Bubble */}
                          <div className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 border ${
                            activeTab === 'pooja' 
                              ? 'bg-orange-50 text-orange-700 border-orange-100' 
                              : 'bg-purple-50 text-purple-700 border-purple-100'
                          }`}>
                            {activeTab === 'pooja' ? <FiUsers className="w-3.5 h-3.5" /> : <FiPackage className="w-3.5 h-3.5" />}
                            {itemCount} {activeTab === 'pooja' ? 'DEVOTEE' : 'ITEM'}{itemCount > 1 ? 'S' : ''}
                          </div>

                          <StatusBadge status={group.status} />

                          <div className="flex items-center gap-2 ml-auto" onClick={(e) => e.stopPropagation()}>
                            <select
                              className="text-xs font-bold bg-stone-100 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-marigold cursor-pointer hover:bg-stone-200 transition-all outline-none"
                              value={group.status}
                              onChange={(e) => updateStatus(group.all_items[0].order_item_id, e.target.value)} // Logic handles group update
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            
                            <button 
                              className={`p-2 rounded-full transition-colors ${isExpanded ? 'bg-sindoor/10 text-sindoor' : 'bg-stone-50 text-stone-400'}`}
                              onClick={() => toggleExpand(group.order_number)}
                            >
                              {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Expandable Content Area */}
                      {isExpanded && (
                        <div className="bg-stone-50/50 border-t border-stone-100 animate-in slide-in-from-top-4 duration-300">
                           <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                              {group.all_items.map((item, idx) => (
                                <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200/50 flex items-start gap-4 hover:border-marigold/30 transition-all">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 border shadow-inner ${
                                    activeTab === 'pooja'
                                      ? 'bg-linear-to-br from-haldi/20 to-marigold/20 text-sindoor border-marigold/10'
                                      : 'bg-purple-50 text-purple-600 border-purple-100'
                                  }`}>
                                    {activeTab === 'pooja' ? item.devotee_name?.[0] : idx + 1}
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                                      {activeTab === 'pooja' ? `Devotee ${idx + 1}` : 'Offering Item'}
                                    </p>
                                    <h4 className="text-sm font-bold text-heritage-dark line-clamp-1">
                                      {activeTab === 'pooja' ? item.devotee_name : item.pooja_title}
                                    </h4>
                                    {activeTab === 'pooja' && (
                                      <p className="text-[11px] text-marigold font-bold italic">Gotra: {item.gotra || 'N/A'}</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                           </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
           <div className="bg-white rounded-[3rem] py-32 text-center border-2 border-dashed border-stone-200">
             <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-stone-100">
               <FiCalendar className="w-10 h-10 text-stone-200" />
             </div>
             <h3 className="text-2xl font-serif text-heritage-dark mb-2">No {activeTab}s scheduled</h3>
             <p className="text-stone-400 max-w-sm mx-auto italic">Try adjusting your filters or search terms to find sacred bookings.</p>
           </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => !processingDate && setShowConfirm(false)}></div>
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-100">
                <FiDownload className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-2xl font-black text-heritage-dark text-center mb-2 font-serif">Confirm Completion</h3>
              <p className="text-stone-500 text-center text-sm leading-relaxed mb-8">
                This will mark all bookings for <span className="font-bold text-sindoor">{new Date(selectedDateKey).toLocaleDateString()}</span> as completed and download the Excel report automatically.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  disabled={!!processingDate}
                  onClick={handleMarkAsCompleted}
                  className="w-full bg-sindoor text-white py-4 rounded-2xl font-black tracking-widest text-xs shadow-xl shadow-sindoor/20 hover:bg-sindoor/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {processingDate ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      PROCESSING...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      YES, CONFIRM & DOWNLOAD
                    </>
                  )}
                </button>
                <button
                  disabled={!!processingDate}
                  onClick={() => setShowConfirm(false)}
                  className="w-full bg-stone-100 text-stone-500 py-4 rounded-2xl font-black tracking-widest text-xs hover:bg-stone-200 transition-all"
                >
                  CANCEL
                </button>
              </div>
            </div>
            
            {/* Modal Footer Tip */}
            <div className="bg-stone-50 py-4 px-8 border-t border-stone-100">
               <p className="flex items-center gap-2 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                 <FiAlertCircle className="text-marigold" />
                 Report contains devotee names, orders, and variants
               </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
