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
      <div className="flex items-center justify-center min-h-screen pt-16 bg-paper-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sindoor"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-bg pt-8 pb-12">
      <div className="hidden md:block toran-border mb-8"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16">
          <span className="material-symbols-outlined text-marigold text-5xl mb-2">temple_hindu</span>
          <h1 className="text-4xl md:text-5xl text-sindoor mb-4 font-serif">Sacred Temples</h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto font-sans italic">
            Discover the divine architecture and spiritual sanctity of ancient temples.
          </p>
          <div className="w-24 h-1 bg-marigold mx-auto mt-6 rounded-full"></div>
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
          <p className="col-span-full text-center text-stone-500 font-serif text-xl">
            No temples found
          </p>
        )}
      </div>
    </div>
  );
}
