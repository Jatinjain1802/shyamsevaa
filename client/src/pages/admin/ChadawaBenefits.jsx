import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/axios";

export default function ChadawaBenefits() {
    const { chadawaId } = useParams();
    const navigate = useNavigate();

    const [benefits, setBenefits] = useState([]);
    const [chadawas, setChadawas] = useState([]); // List of all chadawas for header context
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState({
        title: "",
        description: "",
    });

    /* ================= FETCH ================= */

    const fetchBenefits = async () => {
        try {
            const res = await api.get(`/chadawas/${chadawaId}`);
            setBenefits(res.data.data.benefits || []);
        } catch (err) {
            console.error(err);
            alert("Failed to load benefits");
        } finally {
            setLoading(false);
        }
    };

    const fetchAllChadawas = async () => {
        try {
            const res = await api.get("/admin/chadawas");
            setChadawas(res.data.data || []);
        } catch (err) {
            console.error("Failed to load chadawa list", err);
        }
    };

    useEffect(() => {
        fetchBenefits();
        fetchAllChadawas();
    }, [chadawaId]);

    /* ================= FORM ================= */

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const openCreate = () => {
        setForm({ title: "", description: "" });
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Add Benefit
            await api.post(
                `/admin/chadawas/${chadawaId}/benefits`,
                form
            );

            setShowForm(false);
            fetchBenefits();
        } catch (err) {
            console.error(err);
            alert("Failed to save benefit");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this benefit?")) return;

        try {
            await api.delete(`/admin/chadawas/benefits/${id}`);
            fetchBenefits();
        } catch {
            alert("Failed to delete benefit");
        }
    };

    /* ================= UI ================= */

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <button onClick={() => navigate("/admin/chadawas")} className="text-sm text-gray-500 hover:underline mb-1">
                        &larr; Back to Chadawas
                    </button>
                    <h1 className="text-2xl font-bold">
                        Benefits for {chadawas.find(c => c.id == chadawaId)?.title || "Chadawa"}
                    </h1>
                </div>
                <button
                    onClick={openCreate}
                    className="bg-orange-600 text-white px-4 py-2 rounded"
                >
                    + Add Benefit
                </button>
            </div>

            {/* Table */}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="bg-white rounded shadow overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left p-3">Title</th>
                                <th className="text-left p-3">Description</th>
                                <th className="text-right p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {benefits.map((b) => (
                                <tr key={b.id} className="border-t">
                                    <td className="p-3 font-medium">{b.title}</td>
                                    <td className="p-3 text-gray-600">
                                        {b.description || "-"}
                                    </td>
                                    <td className="p-3 text-right space-x-2">
                                        <button
                                            onClick={() => handleDelete(b.id)}
                                            className="px-3 py-1 bg-red-500 text-white rounded"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {benefits.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="3"
                                        className="p-4 text-center text-gray-500"
                                    >
                                        No benefits found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
                    <div className="bg-white/95 w-full max-w-lg rounded-2xl p-8 shadow-2xl border border-white/20">
                        <h2 className="text-2xl font-bold bg-linear-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-6">
                            Add Benefit
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                name="title"
                                placeholder="Benefit Title"
                                value={form.title}
                                onChange={handleChange}
                                className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow bg-gray-50/50"
                                required
                            />

                            <textarea
                                name="description"
                                placeholder="Description"
                                value={form.description}
                                onChange={handleChange}
                                className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow bg-gray-50/50"
                                rows="3"
                            />

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button className="px-5 py-2.5 bg-linear-to-r from-orange-600 to-red-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all font-medium">
                                    Add Benefit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
