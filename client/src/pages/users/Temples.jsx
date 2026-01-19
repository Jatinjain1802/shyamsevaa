import { useEffect, useState } from "react";
import api from "../../utils/axios";
import { Link } from "react-router-dom";

export default function Temples() {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemples = async () => {
      try {
        const res = await api.get("/temples/public");
        setTemples(res.data.data || []);
      } catch (err) {
        console.error("Failed to load temples", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTemples();
  }, []);

  if (loading) {
    return <div className="pt-32 text-center">Loading temples...</div>;
  }

  return (
    <div className="pt-16 max-w-7xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Sacred Temples</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {temples.map((t) => (
          <Link
            to={`/temples/${t.id}`}
            key={t.id}
            className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden block"
          >
            <div className="h-56 bg-gray-100">
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

            <div className="p-5">
              <h2 className="text-xl font-semibold mb-2">{t.title}</h2>
              <p className="text-gray-600 text-sm line-clamp-3">
                {t.description || "No description available"}
              </p>
            </div>
          </Link>
        ))}

        {temples.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            No temples found
          </p>
        )}
      </div>
    </div>
  );
}
