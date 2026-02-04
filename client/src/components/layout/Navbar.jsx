import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Search, Bell, ShoppingBag, User } from "lucide-react";
import { MdTempleHindu } from "react-icons/md";
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
      <div className="flex justify-center gap-1 py-1 bg-sindoor/10 overflow-hidden">
        {/* Javascript loop for garland decoration not ideal in React, using array map */}
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="garland-decoration"></div>
        ))}
      </div>
      <header className={`relative w-full sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 shadow-md py-2 border-b-4 border-marigold" : "bg-white/90 border-b-4 border-marigold py-4"
        }`}>
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="text-sindoor flex flex-col items-center">
                <MdTempleHindu className="text-4xl leading-none group-hover:scale-110 transition-transform" />
                <div className="h-1 w-full bg-haldi mt-1"></div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl md:text-3xl text-sindoor leading-tight tracking-wide font-serif">ShyamPuja</h1>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-marigold -mt-1">Heritage Home</span>
              </div>
            </Link>
            <nav className="hidden xl:flex items-center gap-6 font-bold text-sm">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `hover:text-sindoor transition-colors border-b-2 ${isActive ? "text-sindoor border-marigold" : "border-transparent text-heritage-dark hover:border-marigold"}`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden lg:flex items-center bg-stone-100 rounded-full px-4 py-1.5 border border-marigold/30">
              <Search className="text-marigold w-5 h-5" />
              <input
                className="bg-transparent border-none focus:ring-0 text-sm w-32 xl:w-48 focus:outline-none ml-2 text-stone-600 placeholder-stone-400"
                placeholder="Search rituals..."
                type="text"
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 text-sindoor hover:bg-sindoor/5 rounded-full transition-colors hidden sm:block">
                <Bell className="w-5 h-5" />
              </button>
              {/* Cart Icon with Badge */}
              <Link
                to="/cart"
                className="p-2 text-sindoor hover:bg-sindoor/5 rounded-full transition-colors relative"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-marigold text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>
              <Link
                to="/login"
                className="bg-sindoor text-white px-4 md:px-6 py-2 rounded-full font-bold text-sm shadow-md flex items-center gap-2 hover:bg-sindoor/90 transition-all whitespace-nowrap"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">MY ACCOUNT</span>
              </Link>
              <button
                className="xl:hidden p-2 text-sindoor hover:bg-sindoor/10 rounded-full"
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
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      )}

      {/* Mobile Menu Drawer */}
      <div className={`fixed top-0 right-0 z-[70] h-full w-80 bg-paper-bg shadow-2xl transform transition-transform duration-300 ease-in-out border-l-4 border-marigold ${isOpen ? "translate-x-0" : "translate-x-full"
        }`}>
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-6 border-b border-marigold/20 bg-white">
            <div className="flex items-center gap-2">
              <MdTempleHindu className="text-3xl text-sindoor" />
              <span className="text-xl font-bold text-sindoor font-serif">ShyamPoja</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-sindoor hover:bg-sindoor/10 p-2 rounded-full">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl font-bold transition-all ${isActive
                    ? "bg-sindoor/10 text-sindoor"
                    : "text-heritage-dark hover:bg-marigold/10 hover:text-sindoor"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            <div className="mt-6 pt-6 border-t border-marigold/20">
              <div className="flex items-center bg-white rounded-full px-4 py-2 border border-marigold/30 mb-6">
                <Search className="text-marigold w-5 h-5" />
                <input
                  className="bg-transparent border-none focus:ring-0 text-sm w-full focus:outline-none ml-2 text-stone-600 placeholder-stone-400"
                  placeholder="Search rituals..."
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
