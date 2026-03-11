import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/axios";

export default function ChadawaItems({ chadawaId: propId }) {
  const { chadawaId: paramId } = useParams();
  const navigate = useNavigate();
  const cid = propId || paramId;
  const isComponent = !!propId;

  const [items, setItems] = useState([]);
  const [chadawas, setChadawas] = useState([]); // List of all chadawas for dropdown
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    chadawaId: "",
  });

  /* ================= FETCH ================= */

  const fetchItems = async () => {
    try {
      const res = await api.get(`/chadawas/${cid}`);
      setItems(res.data.data.items || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load items");
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
    fetchItems();
    fetchAllChadawas();
  }, [cid]);

  /* ================= FORM ================= */

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const openCreate = () => {
    setEditingId(null);
    setForm({ title: "", description: "", price: "", chadawaId: cid });
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description || "",
      price: item.price,
      chadawaId: cid, // Default to current
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        // Includes chadawaId in body -> allows moving item
        await api.put(`/admin/chadawas/items/${editingId}`, {
          ...form,
          chadawa_id: form.chadawaId
        });
      } else {
        // Create in the SELECTED chadawa
        await api.post(
          `/admin/chadawas/${form.chadawaId}/items`,
          form
        );
      }

      setShowForm(false);
      fetchItems();
    } catch (err) {
      console.error(err);
      alert("Failed to save item");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this item?")) return;

    try {
      await api.delete(`/admin/chadawas/items/${id}`);
      fetchItems();
    } catch {
      alert("Failed to delete item");
    }
  };

  /* ================= UI ================= */

  return (
    <div>
      {/* Header */}
      {!isComponent && (
        <div className="flex justify-between items-center mb-6">
          <div>
            <button onClick={() => navigate("/admin/chadawas")} className="text-sm text-gray-500 hover:underline mb-1">
              &larr; Back to Chadawas
            </button>
            <h1 className="text-2xl font-bold">
              Items for {chadawas.find(c => c.id == cid)?.title || "Chadawa"}
            </h1>
          </div>
          <button
            onClick={openCreate}
            className="bg-orange-600 text-white px-4 py-2 rounded"
          >
            + Add Item
          </button>
        </div>
      )}

      {isComponent && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-heritage-dark">Chadawa Items</h3>
          <button
            onClick={openCreate}
            className="bg-sindoor text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm"
          >
            + Add New Item
          </button>
        </div>
      )}

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
                <th className="text-left p-3">Price</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.id} className="border-t">
                  <td className="p-3 font-medium">{i.title}</td>
                  <td className="p-3 text-gray-600">
                    {i.description || "-"}
                  </td>
                  <td className="p-3">₹{i.price}</td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => openEdit(i)}
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(i.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="p-4 text-center text-gray-500"
                  >
                    No items found
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
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              {editingId ? "Edit Item" : "Add Item"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="title"
                placeholder="Item title"
                value={form.title}
                onChange={handleChange}
                className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow bg-gray-50/50"
                required
              />

              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow bg-gray-50/50"
                rows="3"
              />

              <input
                name="price"
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow bg-gray-50/50"
                required
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all font-medium">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
