import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../utils/axios";
import UnifiedCard from "../../components/common/UnifiedCard";

export default function TempleDetail() {
  const { id } = useParams();
  const [temple, setTemple] = useState(null);
  const [poojas, setPoojas] = useState([]);
  const [chadawas, setChadawas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("poojas");

  useEffect(() => {
    const fetchTemple = async () => {
      try {
        const res = await api.get(`/temples/public/${id}`);
        setTemple(res.data.data);
      } catch (err) {
        console.error("Failed to load temple", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchPoojas = async () => {
      try {
        const res = await api.get(`/poojas/temple/${id}`);
        setPoojas(res.data.data || []);
      } catch (err) {
        console.error("Failed to load poojas", err);
      }
    };

    const fetchChadawas = async () => {
      try {
        const res = await api.get(`/chadawas/temple/${id}`);
        setChadawas(res.data.data || []);
      } catch (err) {
        console.error("Failed to load chadawas", err);
      }
    }

    fetchTemple();
    fetchPoojas();
    fetchChadawas();
  }, [id]);


  if (loading) {
    return <div className="pt-32 text-center">Loading temple...</div>;
  }

  if (!temple) {
    return <div className="pt-32 text-center">Temple not found</div>;
  }

  return (
    <div className="pt-24 max-w-5xl mx-auto px-4 pb-12">
      {/* Image */}
      <div className="w-full h-80 rounded-2xl overflow-hidden mb-8 bg-gray-100 shadow-md">
        {temple.image ? (
          <img
            src={temple.image}
            alt={temple.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* Content */}
      <h1 className="text-4xl font-bold mb-4 text-gray-900">{temple.title}</h1>
      <p className="text-gray-700 leading-relaxed text-lg">{temple.description}</p>

      {/* OFFERINGS SECTION */}
      <div className="mt-12 mb-12">
        <div className="flex justify-center gap-8 border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('poojas')}
            className={`pb-4 text-lg font-medium transition-all ${activeTab === 'poojas' ? 'text-orange-600 border-b-2 border-orange-600 translate-y-px' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Poojas
          </button>
          <button
            onClick={() => setActiveTab('chadawas')}
            className={`pb-4 text-lg font-medium transition-all ${activeTab === 'chadawas' ? 'text-orange-600 border-b-2 border-orange-600 translate-y-px' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Chadawas (Offerings)
          </button>
        </div>

        {activeTab === 'poojas' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {poojas.map((p) => (
              <UnifiedCard
                key={p.id}
                image={p.image}
                title={p.title}
                description={p.description || "Join this sacred pooja."}
                link={`/poojas/${p.id}`}
                buttonText="View Details"
                className="h-full"
              />
            ))}

            {poojas.length === 0 && (
              <div className="col-span-full py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500">No poojas available for this temple currently.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {chadawas.map((c) => (
              <UnifiedCard
                key={c.id}
                image={c.image}
                title={c.title}
                description={c.description || "Make a sacred offering."}
                link={`/chadawas/${c.id}`}
                buttonText="Make Offering"
                className="h-full"
              />
            ))}

            {chadawas.length === 0 && (
              <div className="col-span-full py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500">No chadawas available for this temple currently.</p>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
