import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <>
      <footer className="bg-sindoor text-white py-20 relative overflow-hidden mt-auto">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 20px 20px, white 2px, transparent 0)", backgroundSize: "40px 40px" }}
        >
        </div>
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 border-b border-white/10 pb-16">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-4xl text-haldi">temple_hindu</span>
                <h2 className="text-3xl tracking-widest font-serif">ShyamPoja</h2>
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-8">
                Preserving the soul of Vedic traditions. We bridge the distance between you and the divine
                through authentic heritage services.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-haldi hover:text-sindoor transition-all"><span className="material-symbols-outlined text-xl">share</span></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-haldi hover:text-sindoor transition-all"><span className="material-symbols-outlined text-xl">mail</span></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-haldi hover:text-sindoor transition-all"><span className="material-symbols-outlined text-xl">call</span></a>
              </div>
            </div>
            <div>
              <h4 className="text-haldi font-black tracking-widest mb-8 font-serif">SERVICES</h4>
              <ul className="space-y-4 text-sm text-white/70">
                <li><Link className="hover:text-haldi transition-colors" to="/pandit">Online Pandit Booking</Link></li>
                <li><Link className="hover:text-haldi transition-colors" to="/poojas">Temple E-Puja</Link></li>
                <li><Link className="hover:text-haldi transition-colors" to="/services">Festival Special Seva</Link></li>
                <li><Link className="hover:text-haldi transition-colors" to="/vastu">Vastu & Astrology</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-haldi font-black tracking-widest mb-8 font-serif">KNOWLEDGE</h4>
              <ul className="space-y-4 text-sm text-white/70">
                <li><Link className="hover:text-haldi transition-colors" to="/panchang">Panchang {new Date().getFullYear()}</Link></li>
                <li><Link className="hover:text-haldi transition-colors" to="/blog">Heritage Blog</Link></li>
                <li><Link className="hover:text-haldi transition-colors" to="/mantras">Vedic Mantras</Link></li>
                <li><Link className="hover:text-haldi transition-colors" to="/yatras">Spiritual Yatras</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-haldi font-black tracking-widest mb-8 font-serif">HELPLINE</h4>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <p className="text-xs text-white/40 mb-2 uppercase tracking-widest">24/7 Spiritual Desk</p>
                <p className="text-2xl font-black text-haldi mb-4">1800-SANATAN</p>
                <p className="text-xs text-white/50 italic leading-relaxed">"Dharmo Rakshati Rakshitah"</p>
              </div>
            </div>
          </div>
          <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-white/40 text-xs">© {new Date().getFullYear()} ShyamPoja. Designed with Devotion in Bharat.</p>
            <div className="flex gap-8 text-[10px] font-bold text-white/30 tracking-[0.2em] uppercase">
              <Link className="hover:text-white transition-colors" to="/privacy">Privacy</Link>
              <Link className="hover:text-white transition-colors" to="/terms">Terms</Link>
              <Link className="hover:text-white transition-colors" to="/refunds">Refunds</Link>
            </div>
          </div>
        </div>
      </footer>
      <div className="flex justify-center gap-1 py-1 bg-sindoor overflow-hidden">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="garland-decoration"></div>
        ))}
      </div>
    </>
  );
}
