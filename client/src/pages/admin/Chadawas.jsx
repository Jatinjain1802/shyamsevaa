import { useEffect, useState } from "react";
import api from "../../utils/axios";
import { getAssetUrl } from "../../utils/assets";
import { useNavigate } from "react-router-dom";
import ChadawaItems from "./ChadawaItems";
import ChadawaBenefits from "./ChadawaBenefits";
import ChadawaTemples from "./ChadawaTemples";
import { FiEdit, FiTrash2, FiMapPin, FiLayers, FiList, FiCheckCircle, FiImage, FiCalendar } from "react-icons/fi";

export default function Chadawas() {
  const navigate = useNavigate();
  const [chadawas, setChadawas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    image: "",
    file: null,
    description: "",
    benefits: "",
    chadawa_date: "",
    gallery: [],
    status: 1
  });

  const [galleryFiles, setGalleryFiles] = useState([]);

  const fetchChadawas = async () => {
    try {
      const res = await api.get("/admin/chadawas");
      setChadawas(res.data.data || []);
    } catch {
      setChadawas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChadawas();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({
        ...form,
        file: file,
        image: URL.createObjectURL(file),
      });
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ title: "", image: "", file: null, description: "", benefits: "", chadawa_date: "", gallery: [], status: 1 });
    setGalleryFiles([]);
    setShowForm(true);
  };

  const openEdit = async (c) => {
    setEditingId(c.id);
    try {
      const res = await api.get(`/chadawas/${c.id}`);
      const details = res.data.data;
      setForm({
        ...details.chadawa,
        file: null,
        gallery: details.gallery || []
      });
      setGalleryFiles([]);
      setShowForm(true);
    } catch (err) {
      alert("Failed to load details");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this chadawa?")) return;
    try {
      await api.delete(`/admin/chadawas/${id}`);
      fetchChadawas();
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
    formData.append("status", form.status);
    if (form.chadawa_date) formData.append("chadawa_date", form.chadawa_date);

    if (form.file) formData.append("chadawa_image", form.file);

    try {
      if (editingId) {
        await api.put(`/admin/chadawas/${editingId}`, formData);
      } else {
        await api.post("/admin/chadawas", formData);
      }
      setShowForm(false);
      fetchChadawas();
    } catch (err) {
      alert("Failed to save");
    }
  };

  const toggleStatus = async (c) => {
    const newStatus = c.status === 1 ? 0 : 1;
    try {
      await api.put(`/admin/chadawas/${c.id}`, { status: newStatus });
      fetchChadawas();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="p-4 lg:p-6 bg-heritage-light min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-heritage-dark flex items-center gap-3">
             Chadawa Management
          </h1>
          <p className="text-heritage-muted text-sm mt-1">Manage all offerings and ritual items</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-sindoor text-white px-6 py-2.5 rounded-xl shadow-lg hover:shadow-sindoor/20 hover:scale-105 transition-all font-bold flex items-center gap-2"
        >
          <span>Create New Chadawa</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 border-4 border-sindoor border-t-transparent rounded-full animate-spin"></div>
          <p className="text-heritage-muted font-medium">Fetching divine offerings...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {chadawas.map((c) => (
            <div
              key={c.id}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-heritage-muted/10 flex flex-col h-full"
            >
              {/* Image Container */}
              <div className="relative h-48 sm:h-52 overflow-hidden">
                {c.image ? (
                  <img
                    src={getAssetUrl(c.image)}
                    alt={c.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-heritage-light flex items-center justify-center text-heritage-muted">
                    <FiImage size={40} />
                  </div>
                )}
                
                {/* Status Badge */}
                <button 
                  onClick={() => toggleStatus(c)}
                  className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg backdrop-blur-md transition-all ${
                    c.status === 1 
                      ? "bg-green-500/90 text-white" 
                      : "bg-red-500/90 text-white"
                  }`}
                >
                  {c.status === 1 ? "● Active" : "○ Inactive"}
                </button>

                {/* Quick Actions Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                   <button 
                    onClick={() => openEdit(c)}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-heritage-dark hover:bg-sindoor hover:text-white transition-all shadow-lg"
                    title="Edit"
                   >
                     <FiEdit size={18} />
                   </button>
                   <button 
                    onClick={() => handleDelete(c.id)}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg"
                    title="Delete"
                   >
                     <FiTrash2 size={18} />
                   </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col grow">
                <h3 className="text-lg font-bold text-heritage-dark line-clamp-1 mb-1">{c.title}</h3>
                <div className="flex items-center gap-2 text-heritage-muted text-xs mb-3">
                  <FiCalendar className="text-sindoor" />
                  <span>{c.chadawa_date || "Continuous"}</span>
                </div>
                
                <p className="text-xs text-heritage-muted line-clamp-2 mb-6 h-8">
                  {c.description}
                </p>

                {/* Management Buttons - The components the user loves */}
                <div className="mt-auto grid grid-cols-3 gap-2 pt-4 border-t border-heritage-muted/5">
                  <button
                    onClick={() => openEdit(c)}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-heritage-light hover:bg-sindoor/5 text-heritage-dark transition-all border border-heritage-muted/10 group/btn"
                  >
                    <FiMapPin className="text-orange-500 mb-1" />
                    <span className="text-[10px] font-bold uppercase">Temples</span>
                  </button>
                  <button
                    onClick={() => openEdit(c)}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-heritage-light hover:bg-sindoor/5 text-heritage-dark transition-all border border-heritage-muted/10 group/btn"
                  >
                    <FiLayers className="text-purple-500 mb-1" />
                    <span className="text-[10px] font-bold uppercase">Items</span>
                  </button>
                  <button
                    onClick={() => openEdit(c)}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-heritage-light hover:bg-sindoor/5 text-heritage-dark transition-all border border-heritage-muted/10 group/btn"
                  >
                    <FiCheckCircle className="text-green-500 mb-1" />
                    <span className="text-[10px] font-bold uppercase">Benefits</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {chadawas.length === 0 && (
            <div className="col-span-full py-20 text-center">
               <p className="text-heritage-muted text-lg italic">The temple is waiting for its first Chadawa...</p>
            </div>
          )}
        </div>
      )}

      {/* Modern Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl max-h-[90vh] overflow-y-auto border border-white/20 animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b sticky top-0 bg-white/80 backdrop-blur-md z-10 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-black text-heritage-dark uppercase tracking-tight">
                  {editingId ? "Modify Chadawa" : "Add Divine Offering"}
                </h2>
                <p className="text-heritage-muted text-sm tracking-wide">Enter the details of the ritual offering below</p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="w-12 h-12 bg-heritage-light text-heritage-dark rounded-2xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center text-2xl font-light shadow-sm"
              >
                &times;
              </button>
            </div>

            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Basic Fields */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-heritage-dark uppercase tracking-wider">Title</label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="e.g. Mahadev Special Chadawa"
                      className="w-full bg-heritage-light border-none px-5 py-4 rounded-2xl focus:ring-2 focus:ring-sindoor/50 transition-all outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-heritage-dark uppercase tracking-wider">Ritual Date</label>
                    <input
                      type="date"
                      name="chadawa_date"
                      value={form.chadawa_date ? form.chadawa_date.split('T')[0] : ""}
                      onChange={handleChange}
                      className="w-full bg-heritage-light border-none px-5 py-4 rounded-2xl transition-all outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-heritage-dark uppercase tracking-wider">Main Cover Image</label>
                    <div className="relative group/upload">
                       <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                      />
                      <div className="w-full bg-heritage-light border-2 border-dashed border-heritage-muted/20 px-5 py-4 rounded-2xl flex items-center gap-3 text-heritage-muted group-hover/upload:border-sindoor/50 transition-all">
                        <FiImage />
                        <span className="text-sm truncate">{form.file ? form.file.name : "Select ritual image"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {form.image && (
                  <div className="relative h-64 w-full rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                    <img
                      src={getAssetUrl(form.image)}
                      alt="Preview"
                      className="w-full h-full object-cover shadow-inner"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none"></div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-heritage-dark uppercase tracking-wider">Description</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Devotional details and ritual significance..."
                      className="w-full bg-heritage-light border-none px-5 py-4 rounded-2xl transition-all outline-none resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-heritage-dark uppercase tracking-wider">Brief Benefits Summary</label>
                    <textarea
                      name="benefits"
                      value={form.benefits}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Spiritual outcomes of this offering..."
                      className="w-full bg-heritage-light border-none px-5 py-4 rounded-2xl transition-all outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pb-8 pt-4 border-b border-heritage-muted/10">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-8 py-4 text-heritage-muted font-bold hover:text-heritage-dark transition-colors"
                  >
                    Discard Changes
                  </button>
                  <button
                    type="submit"
                    className="px-10 py-4 bg-sindoor text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-sindoor/30 hover:shadow-sindoor/50 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    {editingId ? "Save All Changes" : "Create Offering"}
                  </button>
                </div>
              </form>

              {editingId && (
                <div className="mt-12 space-y-16 animate-in slide-in-from-bottom-12 duration-500">
                  <div className="bg-heritage-light/30 p-8 rounded-4xl border border-heritage-muted/5">
                    <ChadawaTemples chadawaId={editingId} />
                  </div>
                  
                  <div className="space-y-12">
                    <ChadawaItems chadawaId={editingId} />
                    <ChadawaBenefits chadawaId={editingId} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
