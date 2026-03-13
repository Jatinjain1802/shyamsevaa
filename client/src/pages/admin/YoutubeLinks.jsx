import { useState, useEffect } from "react";
import api from "../../utils/axios";
import { 
  FiPlus, 
  FiTrash2, 
  FiEdit2, 
  FiExternalLink, 
  FiVideo, 
  FiCheck, 
  FiX, 
  FiSave 
} from "react-icons/fi";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function YoutubeLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    video_url: "",
    status: 1,
    sort_order: 0
  });

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/youtube-links");
      setLinks(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch YouTube links");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLink) {
        await api.put(`/youtube-links/${editingLink.id}`, formData);
        toast.success("Link updated successfully");
      } else {
        await api.post("/youtube-links", formData);
        toast.success("Link added successfully");
      }
      setIsModalOpen(false);
      setEditingLink(null);
      setFormData({ title: "", video_url: "", status: 1, sort_order: 0 });
      fetchLinks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this link?")) return;
    try {
      await api.delete(`/youtube-links/${id}`);
      toast.success("Link deleted successfully");
      fetchLinks();
    } catch (err) {
      toast.error("Failed to delete link");
    }
  };

  const handleUrlChange = async (url) => {
    setFormData({ ...formData, video_url: url });
    
    // Auto fetch metadata if it looks like a youtube link
    if (url.includes('youtube.com/') || url.includes('youtu.be/')) {
      try {
        const res = await api.get(`/youtube-links/fetch-metadata?url=${encodeURIComponent(url)}`);
        if (res.data.success) {
          setFormData(prev => ({
            ...prev,
            video_url: url,
            title: res.data.data.title
          }));
          toast.success("Video info fetched!");
        }
      } catch (err) {
        // Silently fail or log, don't annoy user if URL is partial
        console.error("Meta fetch error:", err);
      }
    }
  };

  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleEdit = (link) => {
    setEditingLink(link);
    setFormData({
      title: link.title,
      video_url: link.video_url,
      status: link.status,
      sort_order: link.sort_order
    });
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-sindoor animate-spin" />
        <p className="mt-4 text-stone-500 font-serif italic">Loading YouTube connections...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-heritage-dark font-serif flex items-center gap-3">
            <FiVideo className="text-sindoor" /> YouTube Video Links
          </h1>
          <p className="text-sm text-stone-500 font-medium">Manage videos to display on the home screen footer section</p>
        </div>
        <button
          onClick={() => {
            setEditingLink(null);
            setFormData({ title: "", video_url: "", status: 1, sort_order: 0 });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-sindoor transition-all shadow-lg active:scale-95"
        >
          <FiPlus /> Add New Video
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {links.map((link) => (
          <div key={link.id} className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden flex flex-col sm:flex-row group hover:shadow-xl transition-all duration-500">
            {/* Thumbnail Preview */}
            <div className="sm:w-48 h-32 bg-stone-100 relative shrink-0">
              {getYouTubeId(link.video_url) ? (
                <img 
                  src={`https://img.youtube.com/vi/${getYouTubeId(link.video_url)}/mqdefault.jpg`}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-300">
                  <FiVideo className="w-8 h-8" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <a href={link.video_url} target="_blank" rel="noreferrer" className="text-white bg-white/20 p-2 rounded-full backdrop-blur-md">
                  <FiExternalLink />
                </a>
              </div>
            </div>

            <div className="p-5 grow flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-heritage-dark truncate pr-2" title={link.title}>
                    {link.title}
                  </h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${
                    link.status === 1 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {link.status === 1 ? 'Active' : 'Hidden'}
                  </span>
                </div>
                <p className="text-[10px] text-stone-400 font-medium truncate mb-2">{link.video_url}</p>
                <p className="text-[10px] font-bold text-stone-500 uppercase">Order: {link.sort_order}</p>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(link)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-stone-50 text-stone-600 hover:bg-marigold/10 hover:text-marigold transition-all font-bold text-xs"
                >
                  <FiEdit2 className="w-3 h-3" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(link.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-stone-50 text-stone-400 hover:bg-red-50 hover:text-red-500 transition-all font-bold text-xs"
                >
                  <FiTrash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {links.length === 0 && (
          <div className="col-span-full bg-white h-48 rounded-3xl border-2 border-dashed border-stone-100 flex flex-col items-center justify-center text-stone-300 italic">
            <FiVideo className="w-10 h-10 mb-3 opacity-20" />
            <p>No videos added yet. Add your first YouTube link!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20">
            <div className="p-8 border-b border-stone-50 bg-stone-50/50 flex justify-between items-center">
              <h2 className="text-xl font-black font-serif text-heritage-dark">
                {editingLink ? 'Update Video' : 'Add New Video'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-stone-100 rounded-full transition-all">
                <FiX />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-widest text-stone-400 ml-1">Video Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mahakal Daily Aarti"
                  className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-marigold/20 focus:border-marigold outline-none transition-all font-bold text-heritage-dark"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-widest text-stone-400 ml-1">YouTube URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-marigold/20 focus:border-marigold outline-none transition-all font-bold text-heritage-dark"
                  value={formData.video_url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-widest text-stone-400 ml-1">Sort Order</label>
                  <input
                    type="number"
                    className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-marigold/20 focus:border-marigold outline-none transition-all font-bold text-heritage-dark"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-widest text-stone-400 ml-1">Visibility</label>
                  <select
                    className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-marigold/20 focus:border-marigold outline-none transition-all font-bold text-heritage-dark"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })}
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Hidden</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 px-6 rounded-2xl border border-stone-100 font-bold text-stone-400 hover:bg-stone-50 transition-all uppercase tracking-widest text-[10px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-sindoor text-white font-black hover:bg-sindoor/90 shadow-xl shadow-sindoor/20 transition-all uppercase tracking-widest text-[10px] active:scale-95"
                >
                  <FiSave /> {editingLink ? 'Update' : 'Save'} Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
