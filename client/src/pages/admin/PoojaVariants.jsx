import { useEffect, useState } from "react";
import api from "../../utils/axios";

export default function PoojaVariants({ poojaId }) {
    const [variants, setVariants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        persons: "",
        description: "",
        price: "",
    });

    const fetchVariants = async () => {
        try {
            const res = await api.get(
                `/admin/poojas/${poojaId}/variants`
            );
            setVariants(res.data.data || []);
        } catch (err) {
            console.error("Failed to load variants", err);
            setVariants([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (poojaId) fetchVariants();
    }, [poojaId]);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const openCreate = () => {
        setEditingId(null);
        setForm({ persons: "", description: "", price: "" });
        setShowForm(true);
    };

    const openEdit = (v) => {
        setEditingId(v.id);
        setForm({
            persons: v.persons,
            description: v.description || "",
            price: v.price,
        });
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingId) {
                await api.put(
                    `/admin/variants/${editingId}`,
                    form
                );
            } else {
                await api.post(
                    `/admin/poojas/${poojaId}/variants`,
                    form
                );
            }

            setShowForm(false);
            fetchVariants();
        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Failed to save variant"
            );
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this variant?")) return;

        try {
            await api.delete(`/admin/variants/${id}`);
            fetchVariants();
        } catch {
            alert("Failed to delete variant");
        }
    };

    return (
        <div className="mt-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">
                        Pooja Variants
                    </h2>
                    <p className="text-sm text-gray-500">Manage pricing and options</p>
                </div>
                {!showForm && (
                    <button
                        onClick={openCreate}
                        className="bg-orange-100 text-orange-700 hover:bg-orange-200 px-4 py-2 rounded-lg font-medium transition-colors border border-orange-200 flex items-center gap-2"
                    >
                        <span>+</span> Add Variant
                    </button>
                )}
            </div>

            {/* Content Area: Toggle between List and Form */}
            {showForm ? (
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                        <h3 className="text-lg font-bold text-gray-800">
                            {editingId ? "Edit Variant" : "Add New Variant"}
                        </h3>
                        <button
                            onClick={() => setShowForm(false)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            &times;
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Persons</label>
                                <input
                                    name="persons"
                                    type="number"
                                    min="1"
                                    placeholder="e.g. 1"
                                    value={form.persons}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Price (₹)</label>
                                <input
                                    name="price"
                                    type="number"
                                    min="1"
                                    placeholder="e.g. 500"
                                    value={form.price}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Description</label>
                            <textarea
                                name="description"
                                placeholder="Variant details (e.g. Includes Prasad)..."
                                value={form.description}
                                onChange={handleChange}
                                className="w-full bg-white border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-y"
                                rows="3"
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-all shadow-md active:scale-95"
                            >
                                {editingId ? "Update Variant" : "Save Variant"}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <>
                    {/* List */}
                    {loading ? (
                        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">Loading variants...</div>
                    ) : (
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left px-6 py-4 font-semibold text-gray-600 uppercase tracking-wider text-xs">Persons</th>
                                        <th className="text-left px-6 py-4 font-semibold text-gray-600 uppercase tracking-wider text-xs">Description</th>
                                        <th className="text-left px-6 py-4 font-semibold text-gray-600 uppercase tracking-wider text-xs">Price</th>
                                        <th className="text-right px-6 py-4 font-semibold text-gray-600 uppercase tracking-wider text-xs">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {variants.map((v) => (
                                        <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-gray-900 font-medium">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                                                        {v.persons}
                                                    </span>
                                                    <span>Person{v.persons > 1 ? 's' : ''}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {v.description || <span className="text-gray-400 italic">No description</span>}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-gray-900">
                                                ₹{Number(v.price).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button
                                                    onClick={() => openEdit(v)}
                                                    className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(v.id)}
                                                    className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}

                                    {variants.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="px-6 py-12 text-center text-gray-400"
                                            >
                                                <div className="flex flex-col items-center gap-2">
                                                    <span className="text-3xl opacity-50">✨</span>
                                                    <p>No variants added yet</p>
                                                    <p className="text-xs text-gray-300">Click '+ Add Variant' to start</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
