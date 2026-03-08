import { useEffect, useState } from "react";
import api from "../../utils/axios";
import { getAssetUrl } from "../../utils/assets";
import { Plus, Edit2, Trash2, X, Package, Tag, IndianRupee, Image as ImageIcon, FileText } from "lucide-react";
import toast from "react-hot-toast";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        stock_quantity: "",
        category: "",
        image: "", // for preview
        file: null, // for upload
    });

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await api.get("/products");
            setProducts(res.data.data || []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm((prev) => ({
                ...prev,
                file: file,
                image: URL.createObjectURL(file),
            }));
        }
    };

    const openCreate = () => {
        setEditingId(null);
        setForm({
            name: "",
            description: "",
            price: "",
            stock_quantity: "",
            category: "",
            image: "",
            file: null,
        });
        setShowForm(true);
    };

    const openEdit = (product) => {
        setEditingId(product.id);
        setForm({
            name: product.name,
            description: product.description || "",
            price: product.price,
            stock_quantity: product.stock_quantity || 0,
            category: product.category || "",
            image: product.image_url || "",
            file: null,
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            await api.delete(`/products/${id}`);
            toast.success("Product deleted successfully");
            fetchProducts();
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete product");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("description", form.description);
        formData.append("price", form.price);
        formData.append("stock_quantity", form.stock_quantity);
        formData.append("category", form.category);

        if (form.file) {
            formData.append("product_image", form.file);
        }

        try {
            if (editingId) {
                await api.put(`/products/${editingId}`, formData);
                toast.success("Product updated successfully");
            } else {
                await api.post("/products", formData);
                toast.success("Product created successfully");
            }
            setShowForm(false);
            fetchProducts();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to save product");
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6 lg:mb-8 flex-wrap gap-3">
                <div>
                    <h1 className="text-xl lg:text-3xl font-bold text-gray-900">Product Management</h1>
                    <p className="text-gray-500 mt-1 text-sm lg:text-base">Manage your shop items and inventory</p>
                </div>
                <button
                    onClick={openCreate}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-200 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Add Product
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
                        >
                            <div className="h-48 bg-gray-50 relative">
                                {product.image_url ? (
                                    <img
                                        src={getAssetUrl(product.image_url)}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <ImageIcon className="w-12 h-12" />
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openEdit(product)}
                                        className="p-2 bg-white/90 backdrop-blur-sm text-blue-600 rounded-lg shadow hover:bg-white transition-all"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="p-2 bg-white/90 backdrop-blur-sm text-red-600 rounded-lg shadow hover:bg-white transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                {product.category && (
                                    <span className="absolute top-3 left-3 px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full shadow-sm">
                                        {product.category}
                                    </span>
                                )}
                            </div>

                            <div className="p-5">
                                <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{product.name}</h3>
                                <p className="text-sm text-gray-500 mb-4 line-clamp-2 h-10">{product.description}</p>

                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Price</span>
                                        <span className="text-xl font-black text-indigo-600">₹{parseFloat(product.price).toLocaleString()}</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Stock</span>
                                        <span className={`text-sm font-bold ${product.stock_quantity > 10 ? 'text-green-600' : 'text-orange-600'}`}>
                                            {product.stock_quantity} units
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {products.length === 0 && (
                        <div className="col-span-full bg-gray-50 rounded-3xl p-12 flex flex-col items-center justify-center border-2 border-dashed border-gray-200">
                            <Package className="w-16 h-16 text-gray-300 mb-4" />
                            <p className="text-xl font-semibold text-gray-500">No products found</p>
                            <p className="text-gray-400 mt-1">Start by adding your first product to the shop</p>
                        </div>
                    )}
                </div>
            )}

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">
                                {editingId ? "Edit Product" : "Add New Product"}
                            </h2>
                            <button
                                onClick={() => setShowForm(false)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                        <Package className="w-4 h-4 text-indigo-500" />
                                        Product Name*
                                    </label>
                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="e.g. Copper Lota"
                                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                        <Tag className="w-4 h-4 text-indigo-500" />
                                        Category
                                    </label>
                                    <input
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                        placeholder="e.g. Puja Items"
                                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                        <IndianRupee className="w-4 h-4 text-indigo-500" />
                                        Price (₹)*
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={form.price}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                        <Package className="w-4 h-4 text-indigo-500" />
                                        Stock Quantity
                                    </label>
                                    <input
                                        type="number"
                                        name="stock_quantity"
                                        value={form.stock_quantity}
                                        onChange={handleChange}
                                        placeholder="0"
                                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-indigo-500" />
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Detailed product information..."
                                    className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4 text-indigo-500" />
                                    Product Image
                                </label>
                                <div className="flex items-center gap-4">
                                    <div className="w-24 h-24 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                                        {form.image ? (
                                            <img src={getAssetUrl(form.image)} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <ImageIcon className="w-8 h-8 text-gray-300" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="product-image"
                                            name="product_image"
                                        />
                                        <label
                                            htmlFor="product-image"
                                            className="cursor-pointer inline-flex px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                                        >
                                            Choose Image
                                        </label>
                                        <p className="text-xs text-gray-400 mt-2">Recommended: Square image, max 2MB</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
                                >
                                    {editingId ? "Update Product" : "Create Product"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
