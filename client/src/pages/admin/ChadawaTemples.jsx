import { useEffect, useState } from "react";
import api from "../../utils/axios";

export default function ChadawaTemples({ chadawaId }) {
  const [temples, setTemples] = useState([]);
  const [allTemples, setAllTemples] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [linkedRes, allRes] = await Promise.all([
        api.get(`/admin/chadawas/${chadawaId}/temples`),
        api.get("/temples")
      ]);
      setTemples(linkedRes.data.data || []);
      setAllTemples(allRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chadawaId) fetchData();
  }, [chadawaId]);

  const handleMap = async (templeId) => {
    try {
      await api.post(`/admin/chadawas/${chadawaId}/temples`, { temple_id: templeId });
      fetchData();
    } catch (err) {
      alert("Failed to link temple");
    }
  };

  const handleUnmap = async (templeId) => {
    try {
      await api.delete(`/admin/chadawas/${chadawaId}/temples/${templeId}`);
      fetchData();
    } catch (err) {
      alert("Failed to unlink temple");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-heritage-dark">Linked Temples</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Available Temples */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <p className="text-xs font-bold text-gray-500 uppercase mb-3">Available Temples</p>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {allTemples
              .filter(t => !temples.find(linked => linked.id === t.id))
              .map(t => (
                <div key={t.id} className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                  <span className="text-sm font-medium">{t.title}</span>
                  <button
                    onClick={() => handleMap(t.id)}
                    className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md hover:bg-blue-600 hover:text-white transition-all"
                  >
                    Link
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Linked Temples */}
        <div className="bg-orange-50/30 p-4 rounded-xl border border-orange-100">
          <p className="text-xs font-bold text-orange-600 uppercase mb-3">Linked Temples</p>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {temples.map(t => (
              <div key={t.id} className="flex items-center justify-between bg-white p-2 rounded-lg border border-orange-100 shadow-sm">
                <span className="text-sm font-medium">{t.title}</span>
                <button
                  onClick={() => handleUnmap(t.id)}
                  className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-md hover:bg-red-600 hover:text-white transition-all"
                >
                  Unlink
                </button>
              </div>
            ))}
            {temples.length === 0 && <p className="text-xs text-center py-4 text-gray-400">No temples linked yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
