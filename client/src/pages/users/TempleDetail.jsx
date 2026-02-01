import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../utils/axios";
import UnifiedCard from "../../components/common/UnifiedCard";
import { extractIdFromSlug, generateSlug } from "../../utils/slugify"; // LEARNING: Import slug utilities

export default function TempleDetail() {
  // LEARNING: Get slug from URL and extract ID from it
  const { slug } = useParams();  // Changed from 'id' to 'slug'
  const id = extractIdFromSlug(slug);  // Extract numeric ID from slug
  const navigate = useNavigate(); // For back navigation

  // LEARNING: State management for different data and UI states
  const [temple, setTemple] = useState(null);
  const [poojas, setPoojas] = useState([]);
  const [chadawas, setChadawas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("poojas");

  useEffect(() => {
    // LEARNING: Only fetch if we have a valid ID
    if (!id) {
      setError("Invalid temple URL");
      setLoading(false);
      return;
    }

    fetchAllData();
  }, [id]);

  // LEARNING: Consolidated fetch function for better error handling and retry capability
  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // LEARNING: Fetch all data in parallel for better performance
      const [templeRes, poojasRes, chadawasRes] = await Promise.all([
        api.get(`/temples/public/${id}`),
        api.get(`/poojas/temple/${id}`),
        api.get(`/chadawas/temple/${id}`)
      ]);

      setTemple(templeRes.data.data);
      setPoojas(poojasRes.data.data || []);
      setChadawas(chadawasRes.data.data || []);
    } catch (err) {
      console.error("Failed to load temple details", err);
      setError(err.response?.data?.message || "Failed to load temple details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // LEARNING: Skeleton Loading Component for better UX
  const SkeletonLoader = () => (
    <div className="min-h-screen bg-paper-bg pt-8 pb-12">
      <div className="hidden md:block toran-border mb-8"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb skeleton */}
        <div className="h-4 bg-stone-200 rounded w-48 mb-8 animate-pulse"></div>

        {/* Hero skeleton */}
        <div className="bg-white rounded-[3rem] overflow-hidden shadow-xl mb-12 animate-pulse">
          <div className="h-96 bg-stone-200"></div>
          <div className="p-8 md:p-12">
            <div className="h-10 bg-stone-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-stone-200 rounded mb-2"></div>
            <div className="h-4 bg-stone-200 rounded w-5/6"></div>
          </div>
        </div>

        {/* Tabs skeleton */}
        <div className="flex gap-4 mb-8">
          <div className="h-12 bg-stone-200 rounded-xl w-32 animate-pulse"></div>
          <div className="h-12 bg-stone-200 rounded-xl w-32 animate-pulse"></div>
        </div>

        {/* Cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-t-[40px] rounded-b-xl overflow-hidden shadow-xl animate-pulse">
              <div className="h-48 bg-stone-200"></div>
              <div className="p-6">
                <div className="h-6 bg-stone-200 rounded mb-3"></div>
                <div className="h-4 bg-stone-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // LOADING STATE
  if (loading) {
    return <SkeletonLoader />;
  }

  // ERROR STATE with retry functionality
  if (error || !temple) {
    return (
      <div className="min-h-screen bg-paper-bg pt-8 pb-12 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-red-500 text-4xl">error</span>
          </div>
          <h3 className="text-2xl font-bold text-sindoor mb-3 font-serif">
            {!temple ? "Temple Not Found" : "Oops! Something went wrong"}
          </h3>
          <p className="text-stone-600 mb-6 italic">
            {error || "The temple you're looking for doesn't exist or has been removed."}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/temples")}
              className="bg-marigold text-white px-6 py-3 rounded-xl font-bold hover:bg-marigold/90 transition-all shadow-lg flex items-center gap-2"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Browse Temples
            </button>
            {error && (
              <button
                onClick={fetchAllData}
                className="bg-sindoor text-white px-6 py-3 rounded-xl font-bold hover:bg-sindoor/90 transition-all shadow-lg flex items-center gap-2"
              >
                <span className="material-symbols-outlined">refresh</span>
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-bg pt-8 pb-12">
      {/* Decorative Toran Border */}
      <div className="hidden md:block toran-border mb-8"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* LEARNING: Breadcrumb Navigation for better UX */}
        <div className="py-4 text-sm text-stone-500 font-bold tracking-widest uppercase mb-6 flex items-center gap-2">
          <Link to="/" className="hover:text-sindoor transition-colors">Home</Link>
          <span className="text-marigold">/</span>
          <Link to="/temples" className="hover:text-sindoor transition-colors">Temples</Link>
          <span className="text-marigold">/</span>
          <span className="text-sindoor truncate max-w-xs">{temple.title}</span>
        </div>

        {/* Back Button - Mobile Friendly */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sindoor hover:text-marigold transition-colors font-bold group"
        >
          <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
          Back
        </button>

        {/* LEARNING: Hero Section with Image and Details */}
        <div className="bg-white/80 backdrop-blur-sm rounded-[3rem] overflow-hidden shadow-2xl border-b-4 border-marigold mb-12">
          {/* Temple Image */}
          <div className="relative w-full h-64 md:h-96 bg-linear-to-br from-stone-100 to-stone-200">
            {temple.image ? (
              <img
                src={temple.image}
                alt={temple.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-stone-400">
                <span className="material-symbols-outlined text-6xl mb-2">temple_hindu</span>
                <p className="text-sm">No Image Available</p>
              </div>
            )}
            {/* Overlay gradient for better text readability */}
            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent"></div>
          </div>

          {/* Temple Information */}
          <div className="p-6 md:p-12">
            {/* Title */}
            <h1 className="text-3xl md:text-5xl text-sindoor mb-4 font-serif flex items-center gap-3">
              <span className="material-symbols-outlined text-marigold text-4xl md:text-5xl">temple_hindu</span>
              {temple.title}
            </h1>

            {/* Location Info - if available */}
            {(temple.city || temple.state) && (
              <div className="flex items-center gap-2 text-stone-600 mb-4 text-lg">
                <span className="material-symbols-outlined text-marigold">location_on</span>
                <span className="font-medium">
                  {temple.city && temple.state ? `${temple.city}, ${temple.state}` : temple.city || temple.state}
                </span>
              </div>
            )}

            {/* Description */}
            <p className="text-stone-700 leading-relaxed text-base md:text-lg font-sans">
              {temple.description}
            </p>

            {/* Decorative Divider */}
            <div className="flex items-center gap-3 mt-6">
              <div className="garland-decoration"></div>
              <div className="garland-decoration"></div>
              <div className="garland-decoration"></div>
            </div>
          </div>
        </div>

        {/* LEARNING: Offerings Section with Enhanced Tabs */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl text-sindoor mb-8 font-serif text-center">
            Sacred Offerings
          </h2>

          {/* LEARNING: Tab Navigation with better styling */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
            <button
              onClick={() => setActiveTab('poojas')}
              className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'poojas'
                ? 'bg-sindoor text-white shadow-xl scale-105'
                : 'bg-white/60 text-stone-600 hover:bg-white hover:shadow-lg border-2 border-stone-200'
                }`}
            >
              <span className="material-symbols-outlined">auto_awesome</span>
              Poojas
              {poojas.length > 0 && (
                <span className={`px-2 py-1 rounded-full text-xs ${activeTab === 'poojas' ? 'bg-white/20' : 'bg-sindoor/10 text-sindoor'
                  }`}>
                  {poojas.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('chadawas')}
              className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'chadawas'
                ? 'bg-sindoor text-white shadow-xl scale-105'
                : 'bg-white/60 text-stone-600 hover:bg-white hover:shadow-lg border-2 border-stone-200'
                }`}
            >
              <span className="material-symbols-outlined">volunteer_activism</span>
              Chadawas
              {chadawas.length > 0 && (
                <span className={`px-2 py-1 rounded-full text-xs ${activeTab === 'chadawas' ? 'bg-white/20' : 'bg-sindoor/10 text-sindoor'
                  }`}>
                  {chadawas.length}
                </span>
              )}
            </button>
          </div>

          {/* LEARNING: Tab Content with Responsive Grid */}
          {activeTab === 'poojas' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 animate-fadeIn">
              {poojas.map((p) => (
                <UnifiedCard
                  key={p.id}
                  image={p.image}
                  title={p.title}
                  description={p.description || "Join this sacred pooja."}
                  link={`/poojas/${generateSlug(p.title, p.id)}`}
                  buttonText="View Details"
                  className="h-full"
                />
              ))}

              {/* LEARNING: Empty State with better design */}
              {poojas.length === 0 && (
                <div className="col-span-full py-16 text-center bg-white/60 rounded-[3rem] shadow-sm border border-marigold/30 backdrop-blur-sm">
                  <div className="w-16 h-16 bg-paper-bg rounded-full flex items-center justify-center mx-auto mb-4 text-sindoor text-2xl border border-marigold/20">
                    <span className="material-symbols-outlined">auto_awesome</span>
                  </div>
                  <h3 className="text-xl font-bold text-sindoor mb-2 font-serif">No Poojas Available</h3>
                  <p className="text-stone-500 font-sans italic">
                    There are currently no poojas available for this temple.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 animate-fadeIn">
              {chadawas.map((c) => (
                <UnifiedCard
                  key={c.id}
                  image={c.image}
                  title={c.title}
                  description={c.description || "Make a sacred offering."}
                  link={`/chadawas/${generateSlug(c.title, c.id)}`}
                  buttonText="Make Offering"
                  className="h-full"
                />
              ))}

              {/* LEARNING: Empty State for Chadawas */}
              {chadawas.length === 0 && (
                <div className="col-span-full py-16 text-center bg-white/60 rounded-[3rem] shadow-sm border border-marigold/30 backdrop-blur-sm">
                  <div className="w-16 h-16 bg-paper-bg rounded-full flex items-center justify-center mx-auto mb-4 text-sindoor text-2xl border border-marigold/20">
                    <span className="material-symbols-outlined">volunteer_activism</span>
                  </div>
                  <h3 className="text-xl font-bold text-sindoor mb-2 font-serif">No Chadawas Available</h3>
                  <p className="text-stone-500 font-sans italic">
                    There are currently no chadawas available for this temple.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
