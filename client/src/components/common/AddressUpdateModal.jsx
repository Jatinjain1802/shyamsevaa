import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, Loader2, Save, Home, Building, Navigation } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/axios';
import toast from 'react-hot-toast';

export default function AddressUpdateModal({ isOpen, onClose, forceUpdate = false }) {
    const { user, updateUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || "",
        mobile: user?.mobile || "",
        address: user?.address || "",
        city: user?.city || "",
        state: user?.state || ""
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                mobile: user.mobile || "",
                address: user.address || "",
                city: user.city || "",
                state: user.state || ""
            });
        }
    }, [user, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.address || !formData.city || !formData.state) {
            toast.error("Please fill in all address details");
            return;
        }

        try {
            setLoading(true);
            const response = await api.put('/auth/profile', formData);
            if (response.data.success) {
                updateUser(response.data.user);
                toast.success("Address updated successfully!");
                onClose();
            }
        } catch (error) {
            console.error("Update profile error:", error);
            toast.error(error.response?.data?.message || "Failed to update address");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-999 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={forceUpdate ? null : onClose}
                    className="absolute inset-0 bg-heritage-dark/60 backdrop-blur-sm"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-stone-100"
                >
                    {/* Header with Gradient Background */}
                    <div className="bg-linear-to-r from-sindoor to-marigold p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full -ml-12 -mb-12 blur-xl" />

                        <div className="relative flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                                    <MapPin className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white leading-tight">Delivery Address</h2>
                                    <p className="text-white/80 text-sm font-medium">Please update your shipping details</p>
                                </div>
                            </div>
                            {!forceUpdate && (
                                <button
                                    onClick={onClose}
                                    className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Form Body */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {(!user?.name || !user?.mobile) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {!user?.name && (
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-stone-400 uppercase tracking-widest ml-1">Your Name</label>
                                        <div className="relative group">
                                            <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-sindoor transition-colors" />
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-stone-50 border-2 border-transparent focus:border-sindoor/20 focus:bg-white rounded-2xl py-4 pl-12 pr-4 font-bold text-heritage-dark outline-none transition-all placeholder:text-stone-300"
                                                placeholder="Enter your name"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}
                                {!user?.mobile && (
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-stone-400 uppercase tracking-widest ml-1">Contact No.</label>
                                        <div className="relative group">
                                            <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-sindoor transition-colors" />
                                            <input
                                                type="tel"
                                                value={formData.mobile}
                                                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                                className="w-full bg-stone-50 border-2 border-transparent focus:border-sindoor/20 focus:bg-white rounded-2xl py-4 pl-12 pr-4 font-bold text-heritage-dark outline-none transition-all placeholder:text-stone-300"
                                                placeholder="Mobile number"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {user?.name && user?.mobile && (
                            <div className="flex items-center gap-3 p-4 bg-sindoor/5 rounded-2xl border border-sindoor/10 mb-2">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-sindoor font-black shadow-sm shrink-0">
                                    {user.name[0].toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-xs font-black text-stone-400 uppercase tracking-widest leading-none mb-1">Devotee</p>
                                    <p className="text-sm font-bold text-heritage-dark leading-none">{user.name} • {user.mobile}</p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-black text-stone-400 uppercase tracking-widest ml-1">Street Address</label>
                            <div className="relative group">
                                <Building className="absolute left-4 top-5 w-4 h-4 text-stone-400 group-focus-within:text-sindoor transition-colors" />
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full bg-stone-50 border-2 border-transparent focus:border-sindoor/20 focus:bg-white rounded-2xl py-4 pl-12 pr-4 font-bold text-heritage-dark outline-none transition-all placeholder:text-stone-300 min-h-[100px] resize-none"
                                    placeholder="Enter your full shipping address..."
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-stone-400 uppercase tracking-widest ml-1">City</label>
                                <input
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="w-full bg-stone-50 border-2 border-transparent focus:border-sindoor/20 focus:bg-white rounded-2xl py-4 px-6 font-bold text-heritage-dark outline-none transition-all placeholder:text-stone-300"
                                    placeholder="City"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-stone-400 uppercase tracking-widest ml-1">State</label>
                                <input
                                    type="text"
                                    value={formData.state}
                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                    className="w-full bg-stone-50 border-2 border-transparent focus:border-sindoor/20 focus:bg-white rounded-2xl py-4 px-6 font-bold text-heritage-dark outline-none transition-all placeholder:text-stone-300"
                                    placeholder="State"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-heritage-dark text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl hover:bg-sindoor transition-all active:scale-95 disabled:opacity-70"
                        >
                            {loading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    <Save className="w-6 h-6" />
                                    <span>Save & Continue</span>
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
