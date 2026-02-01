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
    file: null, // For file upload
    description: "",
    city: "",
    state: "",
  });

  const fetchTemples = async () => {
    try {
      const res = await api.get("/temples");
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

  // Handle file selection for image upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({
        ...form,
        file: file,
        image: URL.createObjectURL(file), // Preview URL
      });
    }
  };

  const openCreateForm = () => {
    setEditingId(null);
    setForm({ title: "", image: "", file: null, description: "", city: "", state: "" });
    setShowForm(true);
  };

  const openEditForm = (temple) => {
    setEditingId(temple.id);
    setForm({
      title: temple.title,
      image: temple.image || "",
      file: null, // Reset file input when editing
      description: temple.description || "",
      city: temple.city || "",
      state: temple.state || "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Use FormData to send file along with other data
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("city", form.city);
    formData.append("state", form.state);

    // Append image file if selected
    if (form.file) {
      formData.append("temple_image", form.file);
    }

    try {
      if (editingId) {
        await api.put(`/temples/${editingId}`, formData);
      } else {
        await api.post("/temples", formData);
      }

      setShowForm(false);
      fetchTemples();
    } catch (err) {
      console.error("Error saving temple:", err);
      alert("Error saving temple");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this temple?")) return;

    try {
      await api.delete(`/temples/${id}`);
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-8 duration-300">
            {/* Modal Header */}
            <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingId ? "Edit Temple" : "Add New Temple"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-red-500 transition-colors text-2xl"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Temple Name
                  </label>
                  <input
                    name="title"
                    placeholder="e.g. Shree Siddhivinayak Temple"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Temple Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                  />
                </div>

                {/* Image Preview */}
                {form.image && (
                  <div className="h-48 w-full bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={form.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="Brief description of the temple..."
                    value={form.description}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-y"
                    rows="3"
                  />
                </div>

                {/* City and State Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      City
                    </label>
                    <input
                      name="city"
                      placeholder="e.g. Mumbai"
                      value={form.city}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      State
                    </label>
                    <input
                      name="state"
                      placeholder="e.g. Maharashtra"
                      value={form.state}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
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
                    {editingId ? "Update Temple" : "Create Temple"}
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
