import { useEffect, useState } from "react";
import api from "../../utils/axios";
import { Link } from "react-router-dom";

import UnifiedCard from "../../components/common/UnifiedCard";

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
    return (
      <div className="flex items-center justify-center min-h-screen pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-4 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-serif">Sacred Temples</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the divine architecture and spiritual sanctity of ancient temples.
          </p>
          <div className="w-24 h-1 bg-orange-500 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {temples.map((t) => (
            <UnifiedCard
              key={t.id}
              image={t.image}
              title={t.title}
              description={t.description}
              link={`/temples/${t.id}`}
              buttonText="View Temple"
            />
          ))}
        </div>

        {temples.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            No temples found
          </p>
        )}
      </div>
    </div>
  );
}
