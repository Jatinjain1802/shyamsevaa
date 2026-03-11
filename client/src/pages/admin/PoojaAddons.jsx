import { useEffect, useState } from "react";
import api from "../../utils/axios";

export default function PoojaAddons({ poojaId }) {
  const [linkedAddons, setLinkedAddons] = useState([]);
  const [allAddons, setAllAddons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(null); // Track which addon ID is being added

  /* =====================
     FETCH DATA
  ===================== */

  const fetchAllAddons = async () => {
    const res = await api.get("/admin/addons");
    setAllAddons(res.data.data || []);
  };

  const fetchPoojaAddons = async () => {
    const res = await api.get(
      `/admin/poojas/${poojaId}/addons`
    );
    setLinkedAddons(res.data.data || []);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchAllAddons(),
        fetchPoojaAddons(),
      ]);
    } catch (err) {
      console.error("Addon load failed", err);
      alert("Failed to load addons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (poojaId) loadData();
  }, [poojaId]);

  /* =====================
     ACTIONS
  ===================== */

  const handleAddAddon = async (addonId) => {
    try {
      setAdding(addonId);
      await api.post(
        `/admin/poojas/${poojaId}/addons`,
        { 
          addon_id: addonId,
          is_common: false // Removed feature as per request
        }
      );

      setSearchTerm(""); // Clear search after adding
      fetchPoojaAddons();
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Failed to add addon"
      );
    } finally {
      setAdding(null);
    }
  };

  const handleRemoveAddon = async (mapId) => {
    if (!confirm("Remove this addon from pooja?")) return;

    try {
      await api.delete(
        `/admin/poojas/addons/${mapId}`
      );
      fetchPoojaAddons();
    } catch {
      alert("Failed to remove addon");
    }
  };

  /* =====================
     FILTER LOGIC (Search)
  ===================== */
  
  // 1. Filter out addons that are already linked
  const availableAddons = allAddons.filter(a => 
    !linkedAddons.some(l => l.id === a.id)
  );

  // 2. Filter by search term
  const filteredAddons = searchTerm.trim() 
    ? availableAddons.filter(a => 
        a.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  /* =====================
     UI
  ===================== */

  if (loading) return <p>Loading add-ons...</p>;

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Pooja Add-ons
        </h2>
      </div>

      {/* INSTANT SEARCH SECTION */}
      <div className="relative mb-8 group">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg 
              className={`w-5 h-5 transition-colors ${searchTerm ? 'text-orange-500' : 'text-gray-400'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search and click to add an add-on..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-2xl shadow-sm hover:shadow focus:shadow-md focus:border-orange-200 outline-none transition-all text-base font-medium"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-red-500 transition-colors"
            >
              <span className="material-symbols-outlined text-xl">cancel</span>
            </button>
          )}
        </div>

        {/* RESULTS DROP PANEL */}
        {searchTerm && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[100] animate-in slide-in-from-top-2 duration-200">
            <div className="p-3 border-b bg-gray-50/50 flex justify-between items-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Search Results ({filteredAddons.length})</span>
            </div>
            
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
              {filteredAddons.map((a) => (
                <button
                  key={a.id}
                  disabled={adding === a.id}
                  onClick={() => handleAddAddon(a.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-orange-50 transition-colors text-left group/item border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 font-bold shrink-0">
                      ₹
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 group-hover/item:text-orange-700">{a.title}</p>
                      <p className="text-xs text-gray-500 font-medium">Extra Add-on • Master DB</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-full group-hover/item:bg-white transition-colors">₹{a.price}</span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${adding === a.id ? 'bg-orange-100' : 'bg-gray-50 group-hover/item:bg-orange-600 group-hover/item:text-white'}`}>
                      {adding === a.id ? (
                        <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent animate-spin rounded-full"></div>
                      ) : (
                        <span className="material-symbols-outlined text-lg">add</span>
                      )}
                    </div>
                  </div>
                </button>
              ))}

              {filteredAddons.length === 0 && (
                <div className="p-12 text-center">
                  <span className="material-symbols-outlined text-4xl text-gray-200 mb-2">search_off</span>
                  <p className="text-gray-500 font-medium">No addons match your search</p>
                  <p className="text-xs text-gray-400">Try a different name or create a new addon</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* LINKED ADDONS LIST */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3">Addon</th>
              <th className="text-left p-3">Price</th>
              <th className="text-right p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {linkedAddons.map((a) => (
              <tr key={a.mapId} className="border-t">
                <td className="p-3">{a.title}</td>
                <td className="p-3">₹{a.price}</td>
                <td className="p-3 text-right">
                  <button
                    onClick={() =>
                      handleRemoveAddon(a.mapId)
                    }
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}

            {linkedAddons.length === 0 && (
              <tr>
                <td
                  colSpan="3"
                  className="p-4 text-center text-gray-500"
                >
                  No add-ons linked to this pooja
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
