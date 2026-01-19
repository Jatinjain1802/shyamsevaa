import { useEffect, useState } from "react";
import api from "../../utils/axios";

export default function Temples() {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    image: "",
    description: "",
  });

  const fetchTemples = async () => {
    try {
      const res = await api.get("/admin/temples");
      setTemples(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch temples", err);
      alert("Failed to load temples");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemples();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openCreateForm = () => {
    setEditingId(null);
    setForm({ title: "", image: "", description: "" });
    setShowForm(true);
  };

  const openEditForm = (temple) => {
    setEditingId(temple.id);
    setForm({
      title: temple.title,
      image: temple.image || "",
      description: temple.description || "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/admin/temples/${editingId}`, form);
      } else {
        await api.post("/admin/temples", form);
      }

      setShowForm(false);
      fetchTemples();
    } catch (err) {
      alert("Error saving temple");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this temple?")) return;

    try {
      await api.delete(`/admin/temples/${id}`);
      fetchTemples();
    } catch (err) {
      alert("Failed to delete temple");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Temple Management</h1>
        <button
          onClick={openCreateForm}
          className="bg-orange-600 text-white px-4 py-2 rounded"
        >
          + Add Temple
        </button>
      </div>

     {/* Cards */}
{loading ? (
  <p>Loading...</p>
) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {temples.map((t) => (
      <div
        key={t.id}
        className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
      >
        {/* Image */}
        <div className="h-44 bg-gray-100">
          {t.image ? (
            <img
              src={t.image}
              alt={t.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-1">{t.title}</h3>

          <p className="text-sm text-gray-600 line-clamp-3">
            {t.description || "No description available"}
          </p>

          {/* Actions */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => openEditForm(t)}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(t.id)}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    ))}

    {temples.length === 0 && (
      <div className="col-span-full text-center text-gray-500">
        No temples found
      </div>
    )}
  </div>
)}


      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-xl rounded p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? "Edit Temple" : "Add Temple"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="title"
                placeholder="Temple Name"
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
