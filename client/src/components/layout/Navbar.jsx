import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiMenu, FiX, FiPhone, FiUser } from "react-icons/fi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    {name : "Temples",path:"/temples"},
    { name: "Services", path: "/services" },
    { name: "Bookings", path: "/bookings" },
    { name: "Gallery", path: "/gallery" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-linear-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              S
            </div>
            <span className={`text-2xl font-bold font-serif ${
              scrolled ? "text-[var(--color-text-dark)]" : "text-[var(--color-primary-dark)]"
            } transition-colors`}>
              ShyamSeva
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `font-medium text-base transition-all duration-300 relative group ${
                    isActive
                      ? "text-[var(--color-primary)]"
                      : scrolled ? "text-gray-700 hover:text-[var(--color-primary)]" : "text-gray-800 hover:text-[var(--color-primary)]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-[var(--color-primary)] transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}></span>
                  </>
                )}
              </NavLink>
            ))}

            {/* CTA Buttons */}
            <div className="flex items-center gap-4 ml-4">
              <Link
                to="/login"
                className="hidden lg:flex items-center gap-2 text-[var(--color-primary)] font-semibold hover:text-[var(--color-primary-dark)] transition-colors"
              >
                <FiUser className="w-5 h-5" />
                Login
              </Link>
              <Link
                to="/donate"
                className="btn-primary-custom !px-5 !py-2 !text-sm"
              >
                Donate
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[var(--color-text-dark)] p-2 focus:outline-none"
            >
              {isOpen ? <FiX className="w-7 h-7" /> : <FiMenu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <span className="text-xl font-bold text-[var(--color-primary)]">Menu</span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-500 hover:text-[var(--color-primary)] transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl font-medium transition-all ${
                    isActive
                      ? "bg-orange-50 text-[var(--color-primary)]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-[var(--color-primary)]"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            
            <div className="my-6 border-t border-gray-100 pt-6 space-y-4">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-[var(--color-primary)] transition-all"
              >
                <FiUser className="w-5 h-5" />
                Login / Register
              </Link>
              <Link
                to="/donate"
                onClick={() => setIsOpen(false)}
                className="w-full btn-primary-custom justify-center"
              >
                Donate Now
              </Link>
            </div>
            
             <div className="px-4 pt-4">
               <div className="bg-[var(--color-secondary)] p-4 rounded-xl">
                 <p className="text-sm text-gray-500 mb-2">Need assistance?</p>
                 <a href="tel:+919876543210" className="flex items-center gap-2 text-[var(--color-primary-dark)] font-semibold hover:underline">
                   <FiPhone className="w-4 h-4" />
                   +91 98765 43210
                 </a>
               </div>
             </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
