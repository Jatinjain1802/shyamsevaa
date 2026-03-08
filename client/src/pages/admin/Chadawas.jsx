import { useEffect, useState } from "react";
import api from "../../utils/axios";
import { getAssetUrl } from "../../utils/assets";
import { useNavigate } from "react-router-dom";

export default function Chadawas() {
  const navigate = useNavigate();
  const [chadawas, setChadawas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Temple Mapping State
  const [showTempleModal, setShowTempleModal] = useState(false);
  const [selectedChadawaForTemple, setSelectedChadawaForTemple] = useState(null);
  const [linkedTemples, setLinkedTemples] = useState([]);
  const [allTemples, setAllTemples] = useState([]);
  const [selectedTempleId, setSelectedTempleId] = useState("");


  const [form, setForm] = useState({
    title: "",
    image: "",
    file: null, // For file upload
    description: "",
    benefits: "",
    chadawa_date: "",
    gallery: [], // Existing gallery images
  });

  const [galleryFiles, setGalleryFiles] = useState([]); // [{ file: File, description: '', preview: string }]

  /* ================= FETCH ================= */

  const fetchChadawas = async () => {
    try {
      const res = await api.get("/admin/chadawas");
      setChadawas(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load chadawas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChadawas();
  }, []);

  /* ================= FORM ================= */

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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

  const handleGalleryFilesChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file: file,
        description: '',
        preview: URL.createObjectURL(file)
      }));
      setGalleryFiles(prev => [...prev, ...newFiles]);
    }
  };

  const updateGalleryFileDescription = (index, value) => {
    setGalleryFiles(prev => prev.map((item, i) => i === index ? { ...item, description: value } : item));
  };

  const removeGalleryFile = (index) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({
      title: "",
      image: "",
      file: null,
      description: "",
      benefits: "",
      chadawa_date: "",
      gallery: [],
    });
    setGalleryFiles([]);
    setShowForm(true);
  };

  const openEdit = async (c) => {
    setEditingId(c.id);
    setForm({
      title: c.title || "",
      image: c.image || "",
      file: null, // Reset file input when editing
      description: c.description || "",
      benefits: c.benefits || "",
      chadawa_date: c.chadawa_date?.slice(0, 10) || "",
      gallery: [],
    });
    setGalleryFiles([]);
    setShowForm(true);

    // Fetch full details including gallery using public API
    try {
      const res = await api.get(`/chadawas/${c.id}`);
      if (res.data.success) {
        // The structure is success:true, data: { chadawa: {}, gallery: [], ... }
        setForm(prev => ({ ...prev, gallery: res.data.data.gallery || [] }));
      }
    } catch (err) {
      console.error("Failed to fetch chadawa details", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Use FormData to send file along with other data
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("benefits", form.benefits);
    formData.append("chadawa_date", form.chadawa_date);

    // Append image file if selected
    if (form.file) {
      formData.append("chadawa_image", form.file);
    }

    // Append gallery files and descriptions
    if (galleryFiles.length > 0) {
      galleryFiles.forEach((item) => {
        formData.append("chadawa_gallery", item.file);
        formData.append("gallery_description", item.description);
      });
    }

    try {
      if (editingId) {
        await api.put(`/admin/chadawas/${editingId}`, formData);
      } else {
        await api.post("/admin/chadawas", formData);
      }

      setShowForm(false);
      fetchChadawas();
    } catch (err) {
      console.error("Error saving chadawa:", err);
      alert("Failed to save chadawa");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this chadawa?")) return;

    try {
      await api.delete(`/admin/chadawas/${id}`);
      fetchChadawas();
    } catch {
      alert("Failed to delete chadawa");
    }
  };

  const handleDeleteGalleryImage = async (imageId) => {
    if (!confirm("Delete this image?")) return;
    try {
      await api.delete(`/admin/chadawas/gallery/${imageId}`);
      setForm(prev => ({
        ...prev,
        gallery: prev.gallery.filter(img => img.id !== imageId)
      }));
    } catch (err) {
      console.error("Failed to delete image", err);
      alert("Failed to delete image");
    }
  };

  /* ================= TEMPLE MAPPING ================= */

  const openTempleModal = async (chadawa) => {
    setSelectedChadawaForTemple(chadawa);
    setShowTempleModal(true);
    // Fetch linked temples
    try {
      const res = await api.get(`/admin/chadawas/${chadawa.id}/temples`);
      setLinkedTemples(res.data.data || []);
    } catch (err) {
      console.error("Failed to load linked temples", err);
    }
    // Fetch all temples if not already
    if (allTemples.length === 0) {
      try {
        const res = await api.get("/temples");
        setAllTemples(res.data.data || []);
      } catch (err) {
        console.error("Failed to load all temples", err);
      }
    }
  };

  const handleLinkTemple = async () => {
    if (!selectedTempleId) return;
    try {
      await api.post(`/admin/chadawas/${selectedChadawaForTemple.id}/temples`, {
        temple_id: selectedTempleId
      });
      // Refresh linked list
      const res = await api.get(`/admin/chadawas/${selectedChadawaForTemple.id}/temples`);
      setLinkedTemples(res.data.data || []);
      setSelectedTempleId("");
    } catch (err) {
      console.error(err);
      alert("Failed to link temple");
    }
  };

  const handleUnlinkTemple = async (templeId) => {
    if (!confirm("Unlink this temple?")) return;
    try {
      await api.delete(`/admin/chadawas/${selectedChadawaForTemple.id}/temples/${templeId}`);
      setLinkedTemples(linkedTemples.filter(t => t.id !== templeId));
    } catch (err) {
      console.error(err);
      alert("Failed to unlink temple");
    }
  };

  /* ================= UI ================= */

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="text-xl lg:text-2xl font-bold">Chadawa Management</h1>
        <button
          onClick={openCreate}
          className="bg-orange-600 text-white px-4 py-2 rounded text-sm lg:text-base"
        >
          + Add Chadawa
        </button>
      </div>

      {/* List */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6">
          {chadawas.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <div className="h-40 bg-gray-100">
                {c.image ? (
                  <img
                    src={getAssetUrl(c.image)}
                    alt={c.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold">{c.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {c.description}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Date: {c.chadawa_date}
                </p>

                <div className="flex flex-wrap justify-end gap-2 mt-4">
                  <button
                    onClick={() => openTempleModal(c)}
                    className="px-3 py-1 text-sm bg-yellow-500 text-white rounded"
                  >
                    Temples
                  </button>
                  <button
                    onClick={() => navigate(`/admin/chadawas/${c.id}/items`)}
                    className="px-3 py-1 text-sm bg-purple-500 text-white rounded"
                  >
                    Items
                  </button>
                  <button
                    onClick={() => navigate(`/admin/chadawas/${c.id}/benefits`)}
                    className="px-3 py-1 text-sm bg-green-500 text-white rounded"
                  >
                    Benefits
                  </button>
                  <button
                    onClick={() => openEdit(c)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {chadawas.length === 0 && (
            <p className="col-span-full text-center text-gray-500">
              No chadawas found
            </p>
          )}
        </div>
      )}

      {/* Modal */}
      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white/95 w-full max-w-xl rounded-2xl shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold bg-linear-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-6 p-8 pb-0">
              {editingId ? "Edit Chadawa" : "Add Chadawa"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 p-8 pt-6">
              <input
                name="title"
                placeholder="Title"
                value={form.title}
                onChange={handleChange}
                className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow bg-gray-50/50"
                required
              />

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Chadawa Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow bg-gray-50/50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                />
              </div>

              {/* Image Preview */}
              {form.image && (
                <div className="h-40 w-full bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={getAssetUrl(form.image)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
              )}

              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow bg-gray-50/50"
                rows="3"
                required
              />

              <textarea
                name="benefits"
                placeholder="Benefits"
                value={form.benefits}
                onChange={handleChange}
                className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow bg-gray-50/50"
                rows="2"
              />

              <input
                type="date"
                name="chadawa_date"
                value={form.chadawa_date}
                onChange={handleChange}
                className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow bg-gray-50/50"
                required
              />

              {/* GALLERY SECTION */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <label className="text-sm font-semibold text-gray-700">
                  Gallery Images
                </label>

                {/* Upload Button */}
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryFilesChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-full border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
                    <span className="material-symbols-outlined text-3xl mb-2">add_photo_alternate</span>
                    <span className="text-sm font-medium">Click to upload images</span>
                  </div>
                </div>

                {/* Existing Gallery */}
                {form.gallery && form.gallery.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Existing Images</p>
                    <div className="grid grid-cols-1 gap-4">
                      {form.gallery.map(img => (
                        <div key={img.id} className="flex gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <img src={getAssetUrl(img.image_url)} alt="Gallery" className="w-20 h-20 object-cover rounded-md" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-600 mb-1 line-clamp-2">{img.description || "No description"}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteGalleryImage(img.id)}
                            className="text-red-500 hover:bg-red-50 p-2 rounded-full h-10 w-10 flex items-center justify-center hover:shadow-sm transition-all"
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pending Uploads */}
                {galleryFiles.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-green-600 uppercase tracking-wider">New Uploads ({galleryFiles.length})</p>
                    <div className="space-y-3">
                      {galleryFiles.map((item, index) => (
                        <div key={index} className="flex gap-4 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                          <div className="w-20 h-20 relative shrink-0">
                            <img src={item.preview} alt="Preview" className="w-full h-full object-cover rounded-md" />
                            <button
                              type="button"
                              onClick={() => removeGalleryFile(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-sm hover:scale-110 transition-transform"
                            >
                              <span className="material-symbols-outlined text-xs">close</span>
                            </button>
                          </div>
                          <div className="flex-1">
                            <input
                              type="text"
                              placeholder="Enter image description..."
                              value={item.description}
                              onChange={(e) => updateGalleryFileDescription(index, e.target.value)}
                              className="w-full h-full bg-white border border-gray-200 rounded px-3 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button className="px-5 py-2.5 bg-linear-to-r from-orange-600 to-red-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all font-medium">
                  {editingId ? "Update Chadawa" : "Create Chadawa"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Temple Mapping Modal */}
      {showTempleModal && selectedChadawaForTemple && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white/95 w-full max-w-lg rounded-2xl p-8 shadow-2xl border border-white/20">
            <h2 className="text-xl font-bold bg-linear-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent mb-6">
              Manage Temples for "{selectedChadawaForTemple.title}"
            </h2>

            {/* Add New */}
            <div className="flex gap-3 mb-6 bg-gray-50/80 p-4 rounded-xl border border-gray-100/50">
              <select
                className="flex-1 border border-gray-200 p-2.5 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={selectedTempleId}
                onChange={(e) => setSelectedTempleId(e.target.value)}
              >
                <option value="">-- Select Temple to Link --</option>
                {allTemples.filter(t => !linkedTemples.find(lt => lt.id === t.id)).map(t => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
              <button
                onClick={handleLinkTemple}
                className="bg-linear-to-r from-yellow-500 to-yellow-600 text-white px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                disabled={!selectedTempleId}
              >
                Link
              </button>
            </div>

            {/* List Linked */}
            <div className="mb-2 flex justify-between items-center">
              <h3 className="font-semibold text-gray-700">Linked Temples</h3>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{linkedTemples.length} linked</span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {linkedTemples.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <p className="text-gray-400 italic">No temples linked yet</p>
                  <p className="text-xs text-gray-300 mt-1">Select a temple above to link it</p>
                </div>
              ) : (
                linkedTemples.map(t => (
                  <div key={t.id} className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 p-3 rounded-lg border border-gray-100 transition-colors group">
                    <span className="font-medium text-gray-700">{t.title}</span>
                    <button
                      onClick={() => handleUnlinkTemple(t.id)}
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-all opacity-0 group-hover:opacity-100"
                      title="Unlink Temple"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end mt-8 border-t border-gray-100 pt-4">
              <button
                onClick={() => setShowTempleModal(false)}
                className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
