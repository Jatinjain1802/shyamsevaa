import { useState, useEffect } from "react";
import api from "../../utils/axios";
import { FiYoutube } from "react-icons/fi";

export default function YoutubeFeed() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveLinks = async () => {
      try {
        const res = await api.get("/youtube-links/active");
        setLinks(res.data.data);
      } catch (err) {
        console.error("Failed to fetch YouTube links:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchActiveLinks();
  }, []);

  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (loading || links.length === 0) return null;

  return (
    <section className="py-16 bg-stone-50 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sindoor font-bold tracking-widest text-xs uppercase">
              <span className="w-8 h-px bg-sindoor/30"></span>
              Video Gallery
            </div>
            <h2 className="text-3xl lg:text-4xl font-black font-serif text-heritage-dark tracking-tight">
              Watch Sacred <span className="text-sindoor italic">Moments</span>
            </h2>
          </div>
          <div className="flex items-center gap-3 text-stone-400 font-bold text-sm bg-white px-4 py-2 rounded-full border border-stone-100 shadow-sm">
            <FiYoutube className="text-red-600 w-5 h-5" />
            Join our spiritual community
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {links.map((link) => {
            const videoId = getYouTubeId(link.video_url);
            if (!videoId) return null;
            
            return (
              <div key={link.id} className="group relative">
                <div className="relative aspect-video rounded-4xl overflow-hidden shadow-2xl border border-stone-100 group-hover:scale-[1.02] transition-transform duration-500">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={link.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="mt-5 px-2">
                  <h3 className="font-bold text-lg text-heritage-dark font-serif group-hover:text-sindoor transition-colors">
                    {link.title}
                  </h3>
                  <div className="w-12 h-1 bg-marigold/30 mt-2 group-hover:w-20 transition-all duration-300"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
