import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Search, Bell, ShoppingBag, User } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cartCount } = useCart();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "TEMPLES", path: "/temples" },
    { name: "POOJAS", path: "/poojas" },
    { name: "CHADAWA", path: "/chadawas" },
  ];

  return (
    <>
      {/* Premium Navbar */}
      <header className={`relative w-full sticky top-0 z-50 transition-all duration-500 ${scrolled
        ? "glass-card shadow-xl py-3 border-b-2 border-marigold/50"
        : "bg-white/95 backdrop-blur-sm py-5 border-b-2 border-marigold/30"
        }`}>

        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center gap-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-sindoor/10 rounded-full blur-xl group-hover:bg-sindoor/20 transition-all"></div>
                <div className="relative flex flex-col items-center">
                  <img
                    src="/logo.png"
                    alt="Shyampuja Logo"
                    className="w-14 h-14 md:w-20 md:h-20 object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-lg"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-3xl md:text-4xl leading-tight tracking-tight font-serif font-bold bg-linear-to-r from-sindoor via-marigold to-sindoor bg-size-[200%_auto] bg-clip-text text-transparent animate-shimmer">
                  Shyampuja
                </h1>
                <span className="text-[11px] uppercase tracking-[0.25em] font-bold text-marigold -mt-0.5 font-sans animate-fade-in">
                  Divine Services
                </span>
              </div>
            </Link>

            <nav className="hidden xl:flex items-center gap-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `relative py-2 font-bold text-sm tracking-wide transition-all duration-300 group ${isActive ? "text-sindoor" : "text-text-secondary hover:text-sindoor"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.name}
                      <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-sindoor to-marigold transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"
                        }`}></span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 md:gap-5">
            {/* Search Bar */}
            <div className="hidden lg:flex items-center glass-card rounded-full px-5 py-2.5 border border-marigold/20 hover:border-marigold/40 transition-all">
              <Search className="text-marigold w-5 h-5" />
              <input
                className="bg-transparent border-none focus:ring-0 text-sm w-40 xl:w-56 focus:outline-none ml-3 text-text-primary placeholder-text-muted font-medium"
                placeholder="Search poojas, temples..."
                type="text"
              />
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              {/* Notifications */}
              <button className="p-2.5 text-sindoor hover:bg-sindoor/10 rounded-full transition-all duration-300 hidden sm:block relative group">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-marigold rounded-full animate-pulse"></span>
              </button>

              {/* Cart with Badge */}
              <Link
                to="/cart"
                className="p-2.5 text-sindoor hover:bg-sindoor/10 rounded-full transition-all duration-300 relative group"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 gold-gradient text-heritage-dark text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>

              {/* Account Button */}
              <Link
                to="/login"
                className="btn-primary-custom shadow-lg hover:shadow-xl"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">Account</span>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                className="xl:hidden p-2.5 text-sindoor hover:bg-sindoor/10 rounded-full transition-all"
                onClick={() => setIsOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md" onClick={() => setIsOpen(false)} />
      )}

      {/* Mobile Menu Drawer - Premium Design */}
      <div className={`fixed top-0 right-0 z-[70] h-full w-80 glass-card shadow-2xl transform transition-all duration-500 ease-out border-l-4 border-marigold ${isOpen ? "translate-x-0" : "translate-x-full"
        }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="relative flex justify-between items-center p-6 border-b border-marigold/20 bg-white/50">
            <div className="absolute top-0 left-0 right-0 h-1 sunset-gradient"></div>
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Shyampuja Logo" className="w-10 h-10 object-contain" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-sindoor font-serif">Shyampuja</span>
                <span className="text-[10px] uppercase tracking-widest text-marigold font-bold">Divine Services</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-sindoor hover:bg-sindoor/10 p-2.5 rounded-full transition-all">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-8 px-5 space-y-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-5 py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 ${isActive
                    ? "sunset-gradient text-white shadow-lg"
                    : "text-text-secondary hover:bg-sindoor/10 hover:text-sindoor"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            {/* Search in Mobile Menu */}
            <div className="mt-8 pt-8 border-t border-marigold/20">
              <div className="flex items-center glass-card rounded-full px-5 py-3 border border-marigold/30">
                <Search className="text-marigold w-5 h-5" />
                <input
                  className="bg-transparent border-none focus:ring-0 text-sm w-full focus:outline-none ml-3 text-text-primary placeholder-text-muted font-medium"
                  placeholder="Search poojas, temples..."
                  type="text"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
