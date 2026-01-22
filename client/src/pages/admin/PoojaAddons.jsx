import { useEffect, useState } from "react";
import api from "../../utils/axios";

export default function PoojaAddons({ poojaId }) {
  const [linkedAddons, setLinkedAddons] = useState([]);
  const [allAddons, setAllAddons] = useState([]);
  const [selectedAddon, setSelectedAddon] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

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

  const handleAddAddon = async () => {
    if (!selectedAddon) return;

    try {
      setAdding(true);
      await api.post(
        `/admin/poojas/${poojaId}/addons`,
        { addon_id: selectedAddon }
      );

      setSelectedAddon("");
      fetchPoojaAddons();
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Failed to add addon"
      );
    } finally {
      setAdding(false);
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
     UI
  ===================== */

  if (loading) return <p>Loading add-ons...</p>;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">
        Pooja Add-ons
      </h2>

      {/* ADD ADDON */}
      <div className="flex gap-3 mb-6">
        <select
          value={selectedAddon}
          onChange={(e) =>
            setSelectedAddon(e.target.value)
          }
          className="border p-2 rounded w-full"
        >
          <option value="">Select Add-on</option>
          {allAddons.map((a) => (
            <option key={a.id} value={a.id}>
              {a.title} — ₹{a.price}
            </option>
          ))}
        </select>

        <button
          disabled={adding}
          onClick={handleAddAddon}
          className={`px-4 py-2 rounded text-white ${adding
              ? "bg-gray-400"
              : "bg-orange-600 hover:bg-orange-700"
            }`}
        >
          {adding ? "Adding..." : "Add"}
        </button>
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
