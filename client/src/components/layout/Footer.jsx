import { Link } from "react-router-dom";
import { Share2, Mail, Phone, MapPin, Clock } from "lucide-react";
import { MdTempleHindu } from "react-icons/md";

export default function Footer() {
  return (
    <>
      <footer className="relative bg-gradient-to-br from-heritage-dark via-sindoor-dark to-heritage-dark text-white py-24 overflow-hidden mt-auto">
        {/* Decorative Background Pattern */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 25px 25px, white 2px, transparent 0)", backgroundSize: "50px 50px" }}
        >
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-marigold/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-haldi/10 rounded-full blur-3xl"></div>

        <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16 border-b border-white/10 pb-16">
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-4 mb-6 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-haldi/20 rounded-full blur-xl group-hover:bg-haldi/30 transition-all"></div>
                  <MdTempleHindu className="text-5xl text-haldi relative z-10" />
                </div>
                <h2 className="text-4xl tracking-wide font-serif font-bold">Shyampuja</h2>
              </div>
              <p className="text-white/70 text-sm leading-relaxed mb-8 font-medium">
                Preserving the soul of Vedic traditions. We bridge the distance between you and the divine
                through authentic heritage services.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-haldi hover:text-heritage-dark transition-all duration-300 hover:scale-110">
                  <Share2 className="w-5 h-5" />
                </a>
                <a href="#" className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-haldi hover:text-heritage-dark transition-all duration-300 hover:scale-110">
                  <Mail className="w-5 h-5" />
                </a>
                <a href="#" className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-haldi hover:text-heritage-dark transition-all duration-300 hover:scale-110">
                  <Phone className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-haldi font-black tracking-widest mb-8 font-sans text-sm">SERVICES</h4>
              <ul className="space-y-4 text-sm text-white/70 font-medium">
                <li><Link className="hover:text-haldi transition-colors hover:translate-x-1 inline-block" to="/pandit">Online Pandit Booking</Link></li>
                <li><Link className="hover:text-haldi transition-colors hover:translate-x-1 inline-block" to="/poojas">Temple E-Puja</Link></li>
                <li><Link className="hover:text-haldi transition-colors hover:translate-x-1 inline-block" to="/services">Festival Special Seva</Link></li>
                <li><Link className="hover:text-haldi transition-colors hover:translate-x-1 inline-block" to="/vastu">Vastu & Astrology</Link></li>
              </ul>
            </div>

            {/* Knowledge */}
            <div>
              <h4 className="text-haldi font-black tracking-widest mb-8 font-sans text-sm">KNOWLEDGE</h4>
              <ul className="space-y-4 text-sm text-white/70 font-medium">
                <li><Link className="hover:text-haldi transition-colors hover:translate-x-1 inline-block" to="/panchang">Panchang {new Date().getFullYear()}</Link></li>
                <li><Link className="hover:text-haldi transition-colors hover:translate-x-1 inline-block" to="/blog">Heritage Blog</Link></li>
                <li><Link className="hover:text-haldi transition-colors hover:translate-x-1 inline-block" to="/mantras">Vedic Mantras</Link></li>
                <li><Link className="hover:text-haldi transition-colors hover:translate-x-1 inline-block" to="/yatras">Spiritual Yatras</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-haldi font-black tracking-widest mb-8 font-sans text-sm">CONTACT US</h4>
              <div className="glass-card-dark p-6 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-haldi mt-0.5" />
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wider mb-1">24/7 Helpline</p>
                    <p className="text-lg font-black text-haldi">1800-SANATAN</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-haldi mt-0.5" />
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Email</p>
                    <p className="text-sm font-semibold">support@Shyampuja.com</p>
                  </div>
                </div>
                <p className="text-xs text-white/40 italic leading-relaxed pt-3 border-t border-white/10">
                  "Dharmo Rakshati Rakshitah"
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-white/50 text-xs font-medium">
              © {new Date().getFullYear()} Shyampuja. Designed with Devotion in Bharat 🇮🇳
            </p>
            <div className="flex gap-8 text-[10px] font-bold text-white/40 tracking-[0.2em] uppercase">
              <Link className="hover:text-haldi transition-colors" to="/privacy">Privacy</Link>
              <Link className="hover:text-haldi transition-colors" to="/terms">Terms</Link>
              <Link className="hover:text-haldi transition-colors" to="/refunds">Refunds</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom Garland Border */}
      <div className="flex justify-center gap-1 py-1.5 sunset-gradient overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} className="garland-decoration"></div>
        ))}
      </div>
    </>
  );
}
