import { useEffect, useState } from "react";
import api from "../../utils/axios";

export default function Poojas() {
  const [poojas, setPoojas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    image: "",
    description: "",
    benefits: "",
  });

  const fetchPoojas = async () => {
    try {
      const res = await api.get("/admin/poojas");
      setPoojas(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch poojas", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoojas();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openCreateForm = () => {
    setEditingId(null);
    setForm({ title: "", image: "", description: "", benefits: "" });
    setShowForm(true);
  };

  const openEditForm = (pooja) => {
    setEditingId(pooja.id);
    setForm({
      title: pooja.title,
      image: pooja.image || "",
      description: pooja.description,
      benefits: pooja.benefits || "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/admin/poojas/${editingId}`, form);
      } else {
        await api.post("/admin/poojas", form);
      }

      setShowForm(false);
      fetchPoojas();
    } catch (err) {
      alert("Something went wrong while saving pooja");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this pooja?")) return;

    try {
      await api.delete(`/admin/poojas/${id}`);
      fetchPoojas();
    } catch (err) {
      alert("Failed to delete pooja");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pooja Management</h1>
        <button
          onClick={openCreateForm}
          className="bg-orange-600 text-white px-4 py-2 rounded"
        >
          + Add Pooja
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
              {poojas.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="p-3 font-medium">{p.title}</td>
                  <td className="p-3 text-gray-600">
                    {p.description.slice(0, 80)}...
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => openEditForm(p)}
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {poojas.length === 0 && (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-gray-500">
                    No poojas found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-xl rounded p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? "Edit Pooja" : "Add Pooja"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="title"
                placeholder="Pooja Title"
                value={form.title}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />

              <input
                name="image"
                placeholder="Image URL"
                value={form.image}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                rows="3"
                required
              />

              <textarea
                name="benefits"
                placeholder="Benefits"
                value={form.benefits}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                rows="2"
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded">
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
