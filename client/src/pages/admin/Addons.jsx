import { useEffect, useState } from "react";
import api from "../../utils/axios";
import { getAssetUrl } from "../../utils/assets";

export default function Addons() {
    const [addons, setAddons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        title: "",
        image: "",
        description: "",
        price: "",
        is_common: false,
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    /* =====================
       FETCH
    ===================== */

    const fetchAddons = async () => {
        try {
            const res = await api.get("/admin/addons");
            setAddons(res.data.data || []);
        } catch {
            setAddons([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddons();
    }, []);

    /* =====================
       FORM HANDLERS
    ===================== */

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const openCreate = () => {
        setEditingId(null);
        setForm({
            title: "",
            image: "",
            description: "",
            price: "",
            is_common: false,
        });
        setImageFile(null);
        setImagePreview("");
        setShowForm(true);
    };

    const openEdit = (addon) => {
        setEditingId(addon.id);
        setForm({
            title: addon.title,
            image: addon.image || "",
            description: addon.description || "",
            price: addon.price,
            is_common: addon.is_common === 1,
        });
        setImageFile(null);
        setImagePreview(addon.image ? getAssetUrl(addon.image) : "");
        setShowForm(true);
    };

    /* =====================
       SUBMIT
    ===================== */

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("description", form.description);
        formData.append("price", form.price);
        formData.append("is_common", form.is_common ? 1 : 0);
        if (imageFile) {
            formData.append("addon_image", imageFile);
        } else {
            formData.append("image", form.image);
        }

        try {
            if (editingId) {
                await api.put(`/admin/addons/${editingId}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } else {
                await api.post("/admin/addons", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            setShowForm(false);
            fetchAddons();
        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Failed to save addon"
            );
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this addon?")) return;

        try {
            await api.delete(`/admin/addons/${id}`);
            fetchAddons();
        } catch {
            alert("Failed to delete addon");
        }
    };

    /* =====================
       UI
    ===================== */

    return (
        <div>
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                    Add-on Master
                </h1>
                <button
                    onClick={openCreate}
                    className="bg-orange-600 text-white px-4 py-2 rounded"
                >
                    + Add Add-on
                </button>
            </div>

            {/* TABLE */}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="bg-white rounded shadow overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left">Title</th>
                                <th className="p-3 text-left">Price</th>
                                <th className="p-3 text-left">Common</th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {addons.map((a) => (
                                <tr key={a.id} className="border-t">
                                    <td className="p-3">{a.title}</td>
                                    <td className="p-3">₹{a.price}</td>
                                    <td className="p-3">
                                        {a.is_common ? "Yes" : "No"}
                                    </td>
                                    <td className="p-3 text-right space-x-2">
                                        <button
                                            onClick={() => openEdit(a)}
                                            className="px-3 py-1 bg-blue-500 text-white rounded"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(a.id)}
                                            className="px-3 py-1 bg-red-500 text-white rounded"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {addons.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="p-4 text-center text-gray-500"
                                    >
                                        No add-ons found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* MODAL */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-8 duration-300">
                        <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {editingId ? "Edit Add-on" : "Add New Add-on"}
                            </h2>
                            <button
                                onClick={() => setShowForm(false)}
                                className="text-gray-500 hover:text-red-500 transition-colors text-2xl"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Title
                                    </label>
                                    <input
                                        name="title"
                                        placeholder="Add-on Title"
                                        value={form.title}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Price (₹)
                                    </label>
                                    <input
                                        name="price"
                                        type="number"
                                        placeholder="0.00"
                                        value={form.price}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Upload Image
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="w-full border border-gray-300 px-4 py-2 rounded-lg outline-none cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 transition-all"
                                    />
                                    <div className="text-[10px] text-gray-400 font-medium">Or provide URL below</div>
                                    <input
                                        name="image"
                                        placeholder="https://..."
                                        value={form.image}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>

                                {imagePreview && (
                                    <div className="h-40 w-full bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        placeholder="Brief description of the add-on..."
                                        value={form.description}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-y"
                                        rows="3"
                                    />
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <input
                                        type="checkbox"
                                        name="is_common"
                                        id="is_common"
                                        checked={form.is_common}
                                        onChange={handleChange}
                                        className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                                    />
                                    <label
                                        htmlFor="is_common"
                                        className="text-sm font-medium text-gray-700 cursor-pointer select-none"
                                    >
                                        Mark as Common Add-on
                                    </label>
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2.5 bg-linear-to-r from-orange-600 to-orange-700 text-white font-medium rounded-lg hover:shadow-lg transition-all transform active:scale-95"
                                    >
                                        {editingId ? "Update Add-on" : "Create Add-on"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
