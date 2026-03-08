import { useEffect, useState } from "react";
import api from "../../utils/axios";
import {
    FiShoppingBag,
    FiFilter,
    FiSearch,
    FiCheckCircle,
    FiClock,
    FiAlertCircle,
    FiUser,
    FiMail,
    FiDollarSign,
    FiDatabase,
    FiEye,
    FiX,
    FiMapPin,
    FiTag,
    FiDownload
} from "react-icons/fi";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { getAssetUrl } from "../../utils/assets";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal state
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await api.get("/admin/orders");
            if (res.data.success) {
                setOrders(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch admin orders", error);
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const fetchOrderDetails = async (orderId) => {
        try {
            setModalLoading(true);
            setIsModalOpen(true);
            const res = await api.get(`/admin/orders/${orderId}`);
            if (res.data.success) {
                setSelectedOrder(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch order details", error);
            toast.error("Failed to load order details");
            setIsModalOpen(false);
        } finally {
            setModalLoading(false);
        }
    };


    const StatusBadge = ({ status }) => {
        const styles = {
            paid: "bg-green-50 text-green-600 border-green-100",
            pending: "bg-yellow-50 text-yellow-600 border-yellow-100",
            failed: "bg-red-50 text-red-600 border-red-100",
            unpaid: "bg-gray-50 text-gray-600 border-gray-100"
        };
        const Icons = {
            paid: FiCheckCircle,
            pending: FiClock,
            failed: FiAlertCircle,
            unpaid: FiClock
        };
        const Icon = Icons[status?.toLowerCase()] || FiClock;

        return (
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 w-fit ${styles[status?.toLowerCase()] || styles.pending}`}>
                <Icon className="w-3 h-3" />
                {status?.toUpperCase()}
            </span>
        );
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const filteredOrders = orders.filter(o =>
        o.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-sindoor animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 relative">
            {/* Header Section */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-heritage-dark flex items-center gap-3 font-serif">
                        <FiShoppingBag className="text-sindoor" />
                        Order Management
                    </h1>
                    <p className="text-stone-500 mt-1 text-sm italic">View and manage all financial transactions and orders.</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                            type="text"
                            placeholder="Search order or email..."
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

            {/* Orders Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-stone-50 border-b border-stone-100">
                                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Order Info</th>
                                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Transaction</th>
                                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Payment Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-50">
                            {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-linear-to-r hover:from-white hover:to-haldi/5 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="text-sm font-bold text-heritage-dark tracking-wide">{order.order_number}</div>
                                        <div className="text-xs text-stone-400 mt-1 flex items-center gap-1">
                                            <FiClock className="w-3 h-3" />
                                            {new Date(order.created_at).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-linear-to-br from-indigo-500/10 to-blue-500/10 flex items-center justify-center text-blue-600 font-bold text-xs border border-blue-500/10">
                                                {order.user_name?.[0]?.toUpperCase() || "U"}
                                            </div>
                                            <div className="min-w-0 max-w-[150px]">
                                                <div className="text-sm font-bold text-heritage-dark truncate">{order.user_name || "Guest"}</div>
                                                <div className="text-xs text-stone-400 font-medium italic truncate">{order.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="text-sm font-bold text-sindoor">
                                            {formatCurrency(order.total_amount)}
                                        </div>
                                        <div className="text-[10px] text-stone-400 mt-1 font-mono">
                                            {order.payment_id ? `${order.payment_id.substring(0, 15)}...` : "N/A"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <StatusBadge status={order.payment_status} />
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center justify-center gap-3">
                                            {order.invoice_path && (
                                                <a
                                                    href={getAssetUrl(order.invoice_path)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-stone-500 hover:text-marigold hover:bg-marigold/10 rounded-xl transition-all"
                                                    title="Download Invoice"
                                                >
                                                    <FiDownload className="w-5 h-5" />
                                                </a>
                                            )}
                                            <button
                                                onClick={() => fetchOrderDetails(order.id)}
                                                className="p-2 text-stone-500 hover:text-sindoor hover:bg-sindoor/10 rounded-xl transition-all"
                                                title="View Details"
                                            >
                                                <FiEye className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center text-stone-400 italic">
                                        No orders found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Details Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-2xl max-h-[90vh] rounded-4xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                            <div>
                                <h2 className="text-xl font-bold text-heritage-dark font-serif">Order Details</h2>
                                {selectedOrder && <p className="text-sm text-stone-500 font-mono mt-1">{selectedOrder.order.order_number}</p>}
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-stone-200 rounded-full transition-colors">
                                <FiX className="w-6 h-6 text-stone-500" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8 overflow-y-auto max-h-[calc(90vh-140px)] scrollbar-hide">
                            {modalLoading ? (
                                <div className="py-20 flex flex-col items-center justify-center space-y-4">
                                    <Loader2 className="w-10 h-10 text-marigold animate-spin" />
                                    <p className="text-stone-400 italic">Fetching sacred records...</p>
                                </div>
                            ) : selectedOrder ? (
                                <div className="space-y-8">
                                    {/* User & General Info Section */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                                            <p className="text-[10px] uppercase tracking-wider text-stone-400 font-bold mb-4">Customer Info</p>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-600 font-bold">
                                                    {selectedOrder.order.user_name?.[0]?.toUpperCase() || "U"}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-heritage-dark">{selectedOrder.order.user_name || "Guest"}</p>
                                                    <p className="text-xs text-stone-500">{selectedOrder.order.email}</p>
                                                </div>
                                            </div>
                                            <div className="pt-4 border-t border-stone-200">
                                                <p className="text-[10px] uppercase tracking-wider text-stone-400 font-bold mb-2">Payment Status</p>
                                                <StatusBadge status={selectedOrder.order.payment_status} />
                                            </div>
                                        </div>

                                        {(selectedOrder.order.shipping_address || selectedOrder.order.communication_mobile) && (
                                            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                                                <p className="text-[10px] uppercase tracking-wider text-stone-400 font-bold mb-4">Delivery & Contact Details</p>
                                                <div className="space-y-3">
                                                    {selectedOrder.order.customer_name && (
                                                        <div className="flex items-start gap-2">
                                                            <FiUser className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                                                            <p className="text-xs font-medium text-stone-600">{selectedOrder.order.customer_name}</p>
                                                        </div>
                                                    )}
                                                    {selectedOrder.order.communication_mobile && (
                                                        <div className="flex items-start gap-2">
                                                            <FiMapPin className="w-4 h-4 text-stone-400 mt-0.5 shrink-0 bg-transparent rotate-90" style={{ visibility: 'hidden' }} />
                                                            {/* Hidden icon just for alignment, let's use a real one */}
                                                            <FiUser className="w-4 h-4 text-stone-400 mt-0.5 shrink-0 opacity-0" />
                                                            <p className="text-xs font-medium text-stone-600 -ml-6 border border-stone-200 rounded px-2 bg-white">📱 +91 {selectedOrder.order.communication_mobile}</p>
                                                        </div>
                                                    )}
                                                    {selectedOrder.order.shipping_address && (
                                                        <div className="flex items-start gap-2 pt-2 border-t border-stone-200">
                                                            <FiMapPin className="w-4 h-4 text-sindoor mt-0.5 shrink-0" />
                                                            <p className="text-xs font-medium text-stone-600 leading-relaxed">{selectedOrder.order.shipping_address}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Order Items */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-heritage-dark flex items-center gap-2">
                                            <FiTag className="text-marigold" /> Line Items
                                        </h3>
                                        <div className="space-y-3">
                                            {selectedOrder.items.map((item, idx) => (
                                                <div key={idx} className="p-4 border border-stone-100 rounded-2xl bg-white shadow-sm hover:border-haldi transition-all">
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
                                                                <div className="flex items-center gap-2 text-xs text-stone-500">
                                                                    <FiMapPin className="text-marigold w-3 h-3" />
                                                                    {item.temple_title}
                                                                </div>
                                                            ) : item.product_type === 'product' && (
                                                                <div className="flex items-center gap-2 text-xs text-stone-500">
                                                                    <FiMapPin className="text-marigold w-3 h-3" />
                                                                    Physical Delivery
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm font-bold text-heritage-dark">{formatCurrency(item.price)}</p>
                                                            <p className="text-[10px] text-stone-400">Qty: {item.quantity}</p>
                                                        </div>
                                                    </div>

                                                    {/* Addons for this item */}
                                                    {item.addons && item.addons.length > 0 && (
                                                        <div className="mt-3 pt-3 border-t border-stone-50 space-y-2">
                                                            <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Selected Addons</p>
                                                            {item.addons.map((addon, aIdx) => (
                                                                <div key={aIdx} className="flex justify-between items-center text-[11px] bg-stone-50/50 p-2 rounded-lg">
                                                                    <span className="text-stone-600 font-medium">{addon.addon_title || `Addon #${addon.addon_id}`}</span>
                                                                    <span className="font-bold text-heritage-dark">{formatCurrency(addon.price)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Final Summary */}
                                    <div className="pt-6 border-t border-stone-100">
                                        <div className="flex justify-between items-center bg-heritage-dark p-6 rounded-2xl text-white shadow-lg">
                                            <div>
                                                <p className="text-xs text-white/60">Total Order Value</p>
                                                <p className="text-2xl font-bold">{formatCurrency(selectedOrder.order.total_amount)}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-white/60">Transaction ID</p>
                                                <p className="text-xs font-mono">{selectedOrder.order.payment_id || "NOT GENERATED"}</p>
                                            </div>
                                        </div>

                                        {selectedOrder.order.invoice_path && (
                                            <a
                                                href={getAssetUrl(selectedOrder.order.invoice_path)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold transition-colors"
                                            >
                                                <FiDownload className="w-5 h-5" /> Download User Invoice
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
