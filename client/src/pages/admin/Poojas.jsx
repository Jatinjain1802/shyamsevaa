import { useEffect, useState } from "react";
import api from "../../utils/axios";
import PoojaVariants from "./PoojaVariants";
import PoojaAddons from "./PoojaAddons";
import PoojaTemples from "./PoojaTemples";

export default function Poojas() {
  const [poojas, setPoojas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    image: "", // This will hold the URL for preview if needed
    file: null, // This will hold the File object
    description: "",
    benefits: "",
  });

  // Close modal handler
  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const fetchPoojas = async () => {
    try {
      const res = await api.get("/poojas"); // optional list API
      setPoojas(res.data.data || []);
    } catch {
      setPoojas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoojas();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({
        ...form,
        file: file,
        image: URL.createObjectURL(file), // Preview
      });
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ title: "", image: "", file: null, description: "", benefits: "" });
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({ ...p, file: null }); // Reset file input
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("benefits", form.benefits);

    // Append image file if selected
    if (form.file) {
      formData.append("pooja_image", form.file);
    }
    // If no new file, but there's an existing image URL, we might want to send it 
    // (though backend logic handles update only if file is present usually, 
    // or preserves old image if not updated. The current controller logic
    // only updates image if req.file exists, so we don't strictly need to send the old URL string 
    // unless we modified logic to accept string URLs too. 
    // For now, only new file triggers update in controller)

    try {
      if (editingId) {
        await api.put(`/poojas/${editingId}`, formData);
      } else {
        await api.post("/poojas", formData);
      }

      closeForm();
      fetchPoojas();
    } catch (err) {
      console.error(err);
      alert("Failed to save pooja");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this pooja?")) return;

    try {
      await api.delete(`/poojas/${id}`);
      fetchPoojas();
    } catch {
      alert("Failed to delete");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pooja Management</h1>
        <button
          onClick={openCreate}
          className="bg-orange-600 text-white px-4 py-2 rounded"
        >
          + Add Pooja
        </button>
      </div>

      {/* Cards */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {poojas.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <div className="h-40 bg-gray-100">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {p.description}
                </p>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => openEdit(p)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {poojas.length === 0 && (
            <p className="col-span-full text-center text-gray-500">
              No poojas found
            </p>
          )}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-8 duration-300">
            <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingId ? "Edit Pooja" : "Add New Pooja"}
              </h2>
              <button
                onClick={closeForm}
                className="text-gray-500 hover:text-red-500 transition-colors text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Title
                    </label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="e.g. Satyanarayan Pooja"
                      className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

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
                    value={form.description}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Brief description of the pooja..."
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-y"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Benefits
                  </label>
                  <textarea
                    name="benefits"
                    value={form.benefits}
                    onChange={handleChange}
                    rows="3"
                    placeholder="List the benefits of this pooja..."
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-y"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-linear-to-r from-orange-600 to-orange-700 text-white font-medium rounded-lg hover:shadow-lg transition-all transform active:scale-95"
                  >
                    {editingId ? "Update Pooja" : "Create Pooja"}
                  </button>
                </div>
              </form>

              {editingId && (
                <div className="mt-10 pt-8 border-t border-gray-100">
                  <PoojaVariants poojaId={editingId} />
                  <PoojaAddons poojaId={editingId} />
                  <PoojaTemples poojaId={editingId} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
