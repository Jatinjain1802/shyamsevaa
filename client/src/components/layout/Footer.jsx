import { Link } from "react-router-dom";
import { Share2, Mail, Phone, MapPin, Clock } from "lucide-react";

export default function Footer() {
  return (
    <>
      <footer className="relative bg-paper-bg text-heritage-dark py-16 overflow-hidden mt-auto border-t border-marigold/20">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url("/images/simple2.jpg")',
            backgroundPosition: 'top center',
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-marigold/10 rounded-full blur-3xl z-10 pointer-events-none"></div>
        <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-sindoor/5 rounded-full blur-3xl z-10 pointer-events-none"></div>

        <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16 border-b border-marigold/20 pb-12">
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-1">
              <Link to="/" className="flex items-center gap-3 mb-6 group">
                <img src="/logo.png" alt="Shyampuja" className="w-14 h-14 object-contain drop-shadow-md group-hover:scale-105 transition-transform" />
                <div className="flex flex-col">
                  <h2 className="text-3xl font-serif font-bold text-sindoor bg-clip-text">Shyampuja</h2>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-marigold font-bold">Divine Services</span>
                </div>
              </Link>
              <p className="text-stone-600 text-sm leading-relaxed mb-8 font-medium max-w-xs">
                Preserving the soul of Vedic traditions. We bridge the distance between you and the divine through authentic heritage services. <Link to="/about" className="text-marigold hover:text-sindoor font-bold">Read More</Link>
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 rounded-full bg-white border border-marigold/20 flex items-center justify-center text-marigold hover:bg-marigold hover:text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <Share2 className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white border border-marigold/20 flex items-center justify-center text-marigold hover:bg-marigold hover:text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <Mail className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white border border-marigold/20 flex items-center justify-center text-marigold hover:bg-marigold hover:text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-sindoor font-bold tracking-widest mb-6 font-sans text-sm border-b-2 border-marigold/20 pb-2 inline-block">SERVICES</h4>
              <ul className="space-y-3 text-sm text-stone-600 font-medium">
                <li><Link className="hover:text-marigold transition-colors hover:translate-x-1 inline-block" to="/pandit">Online Pandit Booking</Link></li>
                <li><Link className="hover:text-marigold transition-colors hover:translate-x-1 inline-block" to="/poojas">Temple E-Puja</Link></li>
                <li><Link className="hover:text-marigold transition-colors hover:translate-x-1 inline-block" to="/about">About Us</Link></li>
                <li><Link className="hover:text-marigold transition-colors hover:translate-x-1 inline-block" to="/vastu">Vastu & Astrology</Link></li>
              </ul>
            </div>

            {/* Knowledge */}
            <div>
              <h4 className="text-sindoor font-bold tracking-widest mb-6 font-sans text-sm border-b-2 border-marigold/20 pb-2 inline-block">KNOWLEDGE</h4>
              <ul className="space-y-3 text-sm text-stone-600 font-medium">
                <li><Link className="hover:text-marigold transition-colors hover:translate-x-1 inline-block" to="/panchang">Panchang {new Date().getFullYear()}</Link></li>
                <li><Link className="hover:text-marigold transition-colors hover:translate-x-1 inline-block" to="/blog">Heritage Blog</Link></li>
                <li><Link className="hover:text-marigold transition-colors hover:translate-x-1 inline-block" to="/mantras">Vedic Mantras</Link></li>
                <li><Link className="hover:text-marigold transition-colors hover:translate-x-1 inline-block" to="/yatras">Spiritual Yatras</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sindoor font-bold tracking-widest mb-6 font-sans text-sm border-b-2 border-marigold/20 pb-2 inline-block">CONTACT US</h4>
              <div className="bg-white/60 p-5 rounded-2xl border border-marigold/20 space-y-4 hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-sindoor/5 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-sindoor" />
                  </div>
                  <div>
                    <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-1 font-bold">24/7 Helpline</p>
                    <p className="text-lg font-black text-heritage-dark">1800-SANATAN</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-sindoor/5 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-sindoor" />
                  </div>
                  <div>
                    <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-1 font-bold">Email Support</p>
                    <p className="text-sm font-bold text-heritage-dark">support@Shyampuja.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-stone-500 text-xs font-medium tracking-wide">
              © {new Date().getFullYear()} Shyampuja. Designed with Devotion in Bharat 🇮🇳
            </p>
            <div className="flex gap-8 text-[10px] font-bold text-stone-400 tracking-[0.2em] uppercase">
              <Link className="hover:text-sindoor transition-colors hover:scale-105 transform inline-block" to="/privacy">Privacy</Link>
              <Link className="hover:text-sindoor transition-colors hover:scale-105 transform inline-block" to="/terms">Terms</Link>
              <Link className="hover:text-sindoor transition-colors hover:scale-105 transform inline-block" to="/refunds">Refunds</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
