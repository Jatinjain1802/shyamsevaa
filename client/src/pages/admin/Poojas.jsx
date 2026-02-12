import { useEffect, useState } from "react";
import api from "../../utils/axios";
import PoojaVariants from "./PoojaVariants";
import PoojaAddons from "./PoojaAddons";
import PoojaTemples from "./PoojaTemples";
import PoojaFaqs from "./PoojaFaqs";

export default function Poojas() {
  const [poojas, setPoojas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    image: "", // Main image URL
    file: null, // Main image File
    description: "",
    benefits: "",
    pooja_date: "",
    gallery: [], // Existing gallery images (objects with id, image_url)
  });

  const [galleryFiles, setGalleryFiles] = useState([]); // [{ file: File, description: '', preview: string }]

  // Close modal handler
  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setGalleryFiles([]);
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
    setForm({ title: "", image: "", file: null, description: "", benefits: "", pooja_date: "", gallery: [] });
    setGalleryFiles([]);
    setShowForm(true);
  };

  const openEdit = async (p) => {
    setEditingId(p.id);
    // Fetch full details including gallery
    try {
      const res = await api.get(`/poojas/${p.id}`);
      // data structure: res.data.data.pooja, res.data.data.gallery ...
      const details = res.data.data;
      setForm({
        ...details.pooja,
        file: null,
        gallery: details.gallery || []
      });
      setGalleryFiles([]);
      setShowForm(true);
    } catch (err) {
      console.error(err);
      alert("Failed to load details");
    }
  };

  const deleteGalleryImage = async (imageId) => {
    if (!confirm("Delete this image?")) return;
    try {
      await api.delete(`/poojas/gallery/${imageId}`);
      // Remove from local state
      setForm(prev => ({
        ...prev,
        gallery: prev.gallery.filter(img => img.id !== imageId)
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to delete image");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("benefits", form.benefits);
    if (form.pooja_date) formData.append("pooja_date", form.pooja_date);

    // Append main image file if selected
    if (form.file) {
      formData.append("pooja_image", form.file);
    }

    // Append gallery files and descriptions
    if (galleryFiles.length > 0) {
      galleryFiles.forEach((item) => {
        formData.append("pooja_gallery", item.file);
        formData.append("gallery_description", item.description);
      });
    }

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
                      Pooja Date
                    </label>
                    <input
                      type="date"
                      name="pooja_date"
                      value={form.pooja_date ? form.pooja_date.split('T')[0] : ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Main Image
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

                {/* GALLERY SECTION */}
                <div className="space-y-4">
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
                    <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
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
                            <img src={img.image_url} alt="Gallery" className="w-20 h-20 object-cover rounded-md" />
                            <div className="flex-1">
                              <p className="text-sm text-gray-600 mb-1 line-clamp-2">{img.description || "No description"}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => deleteGalleryImage(img.id)}
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
                  <PoojaFaqs poojaId={editingId} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
