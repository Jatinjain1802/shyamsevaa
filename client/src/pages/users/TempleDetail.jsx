import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../utils/axios";
import UnifiedCard from "../../components/common/UnifiedCard";
import { extractIdFromSlug, generateSlug } from "../../utils/slugify";
import {
  Share2,
  Home,
  ChevronRight,
  ArrowRight,
  RefreshCw,
  Search,
  MapPin,
  ArrowLeft,
  Sparkles,
  Heart,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info
} from "lucide-react";
import { MdTempleHindu } from "react-icons/md";

// LEARNING: Custom hook for toast notifications (Reused)
const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  return { toasts, showToast };
};

// Hero Slideshow Component
const HeroSlideshow = ({ gallery, mainImage, title, onShare }) => {
  const hasGallery = gallery && gallery.length > 0;
  const images = hasGallery
    ? gallery
    : [{ id: 'main', image_url: mainImage }];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [images.length]);

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) setCurrentIndex(prev => (prev + 1) % images.length);
    if (isRightSwipe) setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
  };

  return (
    <div
      className="relative w-full h-full rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white group transform transition-all duration-500 hover:shadow-marigold/20 bg-stone-900"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors duration-500 z-20 pointer-events-none"></div>

      {images.map((img, idx) => (
        <div
          key={img.id || idx}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-out ${idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          <img
            src={img.image_url || img.image}
            alt={img.description || title}
            className={`w-full h-full object-cover transform transition-transform duration-2000 ease-out ${idx === currentIndex ? 'scale-110' : 'scale-100'}`}
          />
        </div>
      ))}

      <button
        onClick={onShare}
        className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all group z-30"
        aria-label="Share this temple"
      >
        <Share2 className="w-5 h-5 text-sindoor group-hover:scale-110 transition-transform" />
      </button>

      {images.length > 1 && (
        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30 bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
          {images.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 md:h-1.5 rounded-full transition-all duration-500 cursor-pointer ${idx === currentIndex ? 'w-5 md:w-6 bg-marigold' : 'w-1 md:w-1.5 bg-white/70'}`}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function TempleDetail() {
  const { slug } = useParams();
  const id = extractIdFromSlug(slug);
  const navigate = useNavigate();
  const { toasts, showToast } = useToast();

  const [temple, setTemple] = useState(null);
  const [poojas, setPoojas] = useState([]);
  const [chadawas, setChadawas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("poojas");

  useEffect(() => {
    if (!id) {
      setError("Invalid temple URL");
      setLoading(false);
      return;
    }
    fetchAllData();
  }, [id]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
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

  const handleShare = async () => {
    const shareData = {
      title: temple?.title,
      text: `Check out this divine temple: ${temple?.title}`,
      url: window.location.href
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        showToast('Shared successfully!', 'success');
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Link copied to clipboard!', 'success');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error sharing:', err);
        showToast('Failed to share', 'error');
      }
    }
  };

  // Skeleton Loader
  const SkeletonLoader = () => (
    <div className="min-h-screen bg-paper-bg pt-8 pb-12">
      <div className="hidden md:block toran-border mb-8"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-4 bg-stone-200 rounded w-48 mb-8 animate-pulse"></div>
        <div className="bg-white rounded-[3rem] overflow-hidden shadow-xl mb-12 animate-pulse">
          <div className="h-96 bg-stone-200"></div>
          <div className="p-8 md:p-12">
            <div className="h-10 bg-stone-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-stone-200 rounded mb-2"></div>
            <div className="h-4 bg-stone-200 rounded w-5/6"></div>
          </div>
        </div>
        <div className="flex gap-4 mb-8">
          <div className="h-12 bg-stone-200 rounded-xl w-32 animate-pulse"></div>
          <div className="h-12 bg-stone-200 rounded-xl w-32 animate-pulse"></div>
        </div>
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

  if (loading) return <SkeletonLoader />;

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
              <ArrowLeft className="w-5 h-5" />
              Browse Temples
            </button>
            {error && (
              <button
                onClick={fetchAllData}
                className="bg-sindoor text-white px-6 py-3 rounded-xl font-bold hover:bg-sindoor/90 transition-all shadow-lg flex items-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Toast Notifications */}
      <div className="fixed top-20 right-4 z-70 space-y-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`px-6 py-3 rounded-xl shadow-lg backdrop-blur-sm animate-slide-in-right flex items-center gap-3 ${toast.type === 'success' ? 'bg-green-500 text-white' :
              toast.type === 'error' ? 'bg-red-500 text-white' :
                toast.type === 'warning' ? 'bg-yellow-500 text-white' :
                  'bg-blue-500 text-white'
              }`}
          >
            {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> :
              toast.type === 'error' ? <AlertCircle className="w-5 h-5" /> :
                toast.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
            {toast.message}
          </div>
        ))}
      </div>

      <main className="grow">
        {/* Breadcrumb Navigation */}
        <div className="bg-paper-bg border-b border-marigold/10 py-4">
          <div className="max-w-[1280px] mx-auto px-6">
            <nav className="flex items-center gap-2 text-sm text-stone-500 font-medium" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-sindoor transition-colors flex items-center gap-1">
                <Home className="w-4 h-4" />
                Home
              </Link>
              <ChevronRight className="w-3 h-3" />
              <Link to="/temples" className="hover:text-sindoor transition-colors">
                Temples
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-sindoor font-bold truncate max-w-xs">{temple.title}</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px] border-b border-marigold/10">
          <div className="relative p-4 lg:p-8 bg-paper-bg h-[400px] sm:h-[500px] lg:h-auto flex items-center justify-center">
            <HeroSlideshow
              gallery={temple.gallery}
              mainImage={temple.image}
              title={temple.title}
              onShare={handleShare}
            />
          </div>

          <div className="p-6 md:p-12 lg:p-20 flex flex-col justify-center bg-white relative">
            <div className="absolute inset-0 mandala-bg opacity-5 pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-marigold mb-4 font-bold text-sm tracking-widest uppercase">
                <MdTempleHindu className="text-xl" />
                Sacred Destination
              </div>
              <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl text-sindoor mb-4 leading-tight">
                {temple.title}
              </h1>
              {(temple.city || temple.state) && (
                <div className="flex items-center gap-3 text-stone-500 mb-8 border-l-2 border-marigold pl-4">
                  <MapPin className="text-marigold w-5 h-5" />
                  <span className="text-xl font-medium">
                    {temple.city && temple.state ? `${temple.city}, ${temple.state}` : temple.city || temple.state}
                  </span>
                </div>
              )}
              <p className="text-lg text-stone-600 leading-relaxed max-w-lg mb-10 italic">
                {temple.description || "A divine place of worship and spiritual solace."}
              </p>
            </div>
          </div>
        </section>

        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl text-sindoor mb-8 font-serif text-center">
              Sacred Offerings
            </h2>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
              <button
                onClick={() => setActiveTab('poojas')}
                className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'poojas'
                  ? 'bg-sindoor text-white shadow-xl scale-105'
                  : 'bg-white/60 text-stone-600 hover:bg-white hover:shadow-lg border-2 border-stone-200'
                  }`}
              >
                <Sparkles className="w-5 h-5" />
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
                <Heart className="w-5 h-5" />
                Chadawas
                {chadawas.length > 0 && (
                  <span className={`px-2 py-1 rounded-full text-xs ${activeTab === 'chadawas' ? 'bg-white/20' : 'bg-sindoor/10 text-sindoor'
                    }`}>
                    {chadawas.length}
                  </span>
                )}
              </button>
            </div>

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
                {poojas.length === 0 && (
                  <div className="col-span-full py-16 text-center bg-white/60 rounded-[3rem] shadow-sm border border-marigold/30 backdrop-blur-sm">
                    <div className="w-16 h-16 bg-paper-bg rounded-full flex items-center justify-center mx-auto mb-4 text-sindoor text-2xl border border-marigold/20">
                      <Sparkles className="w-8 h-8" />
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
                {chadawas.length === 0 && (
                  <div className="col-span-full py-16 text-center bg-white/60 rounded-[3rem] shadow-sm border border-marigold/30 backdrop-blur-sm">
                    <div className="w-16 h-16 bg-paper-bg rounded-full flex items-center justify-center mx-auto mb-4 text-sindoor text-2xl border border-marigold/20">
                      <Heart className="w-8 h-8" />
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
      </main>
    </div>
  );
}
