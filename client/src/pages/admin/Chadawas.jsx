import { useEffect, useState } from "react";
import api from "../../utils/axios";
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
    description: "",
    benefits: "",
    chadawa_date: "",
  });

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

  const openCreate = () => {
    setEditingId(null);
    setForm({
      title: "",
      image: "",
      description: "",
      benefits: "",
      chadawa_date: "",
    });
    setShowForm(true);
  };

  const openEdit = (c) => {
    setEditingId(c.id);
    setForm({
      title: c.title || "",
      image: c.image || "",
      description: c.description || "",
      benefits: c.benefits || "",
      chadawa_date: c.chadawa_date?.slice(0, 10) || "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/admin/chadawas/${editingId}`, form);
      } else {
        await api.post("/admin/chadawas", form);
      }

      setShowForm(false);
      fetchChadawas();
    } catch (err) {
      console.error(err);
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Chadawa Management</h1>
        <button
          onClick={openCreate}
          className="bg-orange-600 text-white px-4 py-2 rounded"
        >
          + Add Chadawa
        </button>
      </div>

      {/* List */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chadawas.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <div className="h-40 bg-gray-100">
                {c.image ? (
                  <img
                    src={c.image}
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

                <div className="flex justify-end gap-2 mt-4">
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
          <div className="bg-white/95 w-full max-w-xl rounded-2xl p-8 shadow-2xl border border-white/20">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-6">
              {editingId ? "Edit Chadawa" : "Add Chadawa"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="title"
                placeholder="Title"
                value={form.title}
                onChange={handleChange}
                className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow bg-gray-50/50"
                required
              />

              <input
                name="image"
                placeholder="Image URL"
                value={form.image}
                onChange={handleChange}
                className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow bg-gray-50/50"
              />

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

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all font-medium">
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
            <h2 className="text-xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent mb-6">
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
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
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
