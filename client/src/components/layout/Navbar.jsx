import { useState, useEffect, useRef, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Search, Bell, Heart, User, Loader2, LogOut, Languages } from "lucide-react";
import { useWishlist } from "../../context/WishlistContext";
import { AuthContext } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import api from "../../utils/axios";
import { generateSlug } from "../../utils/slugify";
import LanguageSwitcher from "../LanguageSwitcher";

export default function Navbar() {
  const { t, changeLanguage, language: currentLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { wishlistCount } = useWishlist();
  const { user, logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const langMenuRef = useRef(null);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e && e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsOpen(false);
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setShowLangDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        setIsSearching(true);
        setShowDropdown(true);
        try {
          const res = await api.get(`/search?q=${encodeURIComponent(searchQuery)}`);
          if (res.data.success) {
            setSearchResults(res.data.data);
          } else {
            setSearchResults([]);
          }
        } catch (error) {
          console.error("Search error", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav.temples'), path: "/temples" },
    { name: t('nav.poojas'), path: "/poojas" },
    { name: t('nav.chadawas'), path: "/chadawas" },
    { name: t('nav.products'), path: "/products" },
  ];

  return (
    <>
      <header className={`w-full sticky top-0 z-50 transition-all duration-500 ${scrolled
        ? "glass-card shadow-xl py-3 border-b-2 border-marigold/50"
        : "bg-white/95 backdrop-blur-sm py-5 border-b-2 border-marigold/30"
        }`}>

        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center gap-2 sm:gap-4 group shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-sindoor/10 rounded-full blur-xl group-hover:bg-sindoor/20 transition-all"></div>
                <div className="relative flex flex-col items-center">
                  <img
                    src="/logo.png"
                    alt="Shyampuja Logo"
                    className="w-10 h-10 sx:w-12 sx:h-12 md:w-20 md:h-20 object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-lg"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl sx:text-2xl md:text-4xl leading-tight tracking-tight font-serif font-bold bg-linear-to-r from-sindoor via-marigold to-sindoor bg-size-[200%_auto] bg-clip-text text-transparent animate-shimmer">
                  Shyampuja
                </h1>
                <span className="text-[8px] sx:text-[10px] md:text-[11px] uppercase tracking-widest sx:tracking-[0.25em] font-bold text-marigold -mt-0.5 font-sans animate-fade-in">
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
                      <span className={`absolute bottom-0 left-0 h-0.5 bg-linear-to-r from-sindoor to-marigold transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"
                        }`}></span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-1.5 sx:gap-3 md:gap-5">
            <div className="relative hidden lg:block" ref={searchRef}>
              <form
                onSubmit={handleSearch}
                className="flex items-center glass-card rounded-full px-5 py-2.5 border border-marigold/20 hover:border-marigold/40 transition-all font-sans"
              >
                <button type="submit">
                  <Search className="text-marigold w-5 h-5" />
                </button>
                <input
                  className="bg-transparent border-none focus:ring-0 text-sm w-40 xl:w-56 focus:outline-none ml-3 text-text-primary placeholder-text-muted font-medium"
                  placeholder={t('search.placeholder')}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value.length > 1) setShowDropdown(true);
                  }}
                  onFocus={() => {
                    if (searchQuery.length > 1) setShowDropdown(true);
                  }}
                />
              </form>

              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-marigold/20 overflow-hidden max-h-[400px] overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {isSearching ? (
                    <div className="p-6 text-center text-stone-500 flex flex-col items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-marigold mb-2" />
                      <span className="text-xs font-bold uppercase tracking-wider text-marigold">Searching...</span>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.slice(0, 5).map((item) => (
                        <Link
                          key={`${item.type}-${item.id}`}
                          to={item.type === 'temple' ? `/temples/${generateSlug(item.title, item.id)}` : `/poojas/${generateSlug(item.title, item.id)}`}
                          onClick={() => {
                            setShowDropdown(false);
                            setSearchQuery("");
                          }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50/50 transition-colors border-b border-stone-100 last:border-0 group"
                        >
                          <img src={item.image} alt={item.title} className="w-12 h-12 rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform" />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-sindoor truncate group-hover:text-marigold transition-colors">{item.title}</h4>
                            <p className="text-[10px] uppercase tracking-wide text-stone-500 truncate flex items-center gap-1">
                              {item.type}
                              {item.city && <span className="w-1 h-1 bg-marigold rounded-full"></span>}
                              {item.city}
                            </p>
                          </div>
                        </Link>
                      ))}
                      <button
                        onClick={handleSearch}
                        className="w-full text-center py-3 text-xs text-marigold font-bold hover:bg-orange-50 transition-colors uppercase tracking-widest"
                      >
                        View all {searchResults.length} results
                      </button>
                    </div>
                  ) : (
                    <div className="p-6 text-center text-stone-500 text-sm font-medium">
                      No results found
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 sx:gap-2 md:gap-3">
              <div className="relative hidden sm:block" ref={langMenuRef}>
                <button
                  onClick={() => setShowLangDropdown(!showLangDropdown)}
                  className="p-2.5 text-sindoor hover:bg-sindoor/10 rounded-full transition-all duration-300 relative group"
                  title="Change Language"
                >
                  <Languages className="w-5 h-5" />
                </button>

                {showLangDropdown && (
                  <div className="absolute top-full right-0 mt-3 w-40 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-marigold/20 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="py-1">
                      <button
                        onClick={() => { changeLanguage("en"); setShowLangDropdown(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-left ${currentLang === 'en' ? 'text-sindoor bg-orange-50' : 'text-stone-600 hover:text-sindoor hover:bg-orange-50'}`}
                      >
                        <span className="text-xs font-bold">EN</span> English
                      </button>
                      <button
                        onClick={() => { changeLanguage("hi"); setShowLangDropdown(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-left ${currentLang === 'hi' ? 'text-sindoor bg-orange-50' : 'text-stone-600 hover:text-sindoor hover:bg-orange-50'}`}
                      >
                        <span className="text-xs font-bold">HI</span> हिन्दी
                      </button>

                    </div>
                  </div>
                )}
              </div>

              <button className="p-2.5 text-sindoor hover:bg-sindoor/10 rounded-full transition-all duration-300 hidden sm:block relative group">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-marigold rounded-full animate-pulse"></span>
              </button>

              <Link
                to="/wishlist"
                className="p-2.5 text-sindoor hover:bg-sindoor/10 rounded-full transition-all duration-300 relative group"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 gold-gradient text-heritage-dark text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="w-10 h-10 flex items-center justify-center text-sindoor hover:text-marigold transition-colors duration-300 focus:outline-none"
                    title="Account Menu"
                  >
                    {user.name ? (
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-sindoor to-marigold text-white flex items-center justify-center font-bold text-sm shadow-md border border-white">
                        {user.name[0].toUpperCase()}
                      </div>
                    ) : (
                      <User className="w-8 h-8" />
                    )}
                  </button>

                  {showUserDropdown && (
                    <div className="absolute top-full right-0 mt-3 w-48 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-marigold/20 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-4 border-b border-stone-100 bg-orange-50/30">
                        <p className="text-sm font-bold text-sindoor truncate">{user.name || "Devotee"}</p>
                        <p className="text-[10px] text-stone-500 truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          onClick={() => setShowUserDropdown(false)}
                          className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-stone-600 hover:text-sindoor hover:bg-orange-50 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          My Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            setShowUserDropdown(false);
                            setShowLogoutConfirm(true);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="btn-primary-custom shadow-lg hover:shadow-xl px-6 py-2.5"
                >
                  <User className="w-5 h-5 mr-2" />
                  <span className="hidden sm:inline">{t('auth.login')}</span>
                </Link>
              )}

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

      {isOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-md" onClick={() => setIsOpen(false)} />
      )}

      <div className={`fixed top-0 right-0 z-70 h-full w-80 glass-card shadow-2xl transform transition-all duration-500 ease-out border-l-4 border-marigold ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col h-full">
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

            <div className="mt-8 pt-8 border-t border-marigold/20">
              <form onSubmit={handleSearch} className="flex items-center glass-card rounded-full px-5 py-3 border border-marigold/30">
                <button type="submit">
                  <Search className="text-marigold w-5 h-5" />
                </button>
                <input
                  className="bg-transparent border-none focus:ring-0 text-sm w-full focus:outline-none ml-3 text-text-primary placeholder-text-muted font-medium"
                  placeholder={t('search.placeholder')}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>

              {searchQuery.length > 1 && (
                <div className="mt-3 bg-white rounded-2xl shadow-inner overflow-hidden border border-marigold/10">
                  {isSearching ? (
                    <div className="p-4 text-center">
                      <Loader2 className="w-5 h-5 animate-spin mx-auto text-marigold" />
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                      {searchResults.map((item) => (
                        <Link
                          key={`${item.type}-${item.id}`}
                          to={item.type === 'temple' ? `/temples/${generateSlug(item.title, item.id)}` : `/poojas/${generateSlug(item.title, item.id)}`}
                          onClick={() => {
                            setIsOpen(false);
                            setSearchQuery("");
                          }}
                          className="flex items-center gap-3 p-3 border-b border-marigold/10 last:border-0 hover:bg-orange-50 transition-colors"
                        >
                          <img src={item.image} alt={item.title} className="w-10 h-10 rounded-lg object-cover" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-sindoor truncate">{item.title}</div>
                            <div className="text-[10px] text-stone-500 uppercase flex items-center gap-1">
                              {item.type}
                              {item.city && <span className="w-1 h-1 bg-marigold rounded-full"></span>}
                              {item.city}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 text-center text-sm text-stone-500 font-medium">
                      No results found
                    </div>
                  )}
                </div>
              )}

              <div className="mt-8 pt-8 border-t border-marigold/20">
                <h3 className="text-[10px] uppercase tracking-widest text-marigold font-bold mb-4">Choose Language</h3>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => changeLanguage("en")}
                    className={`py-3 rounded-xl text-xs font-bold transition-all ${currentLang === 'en' ? 'sunset-gradient text-white shadow-md' : 'bg-white text-stone-600 border border-marigold/20'}`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => changeLanguage("hi")}
                    className={`py-3 rounded-xl text-xs font-bold transition-all ${currentLang === 'hi' ? 'sunset-gradient text-white shadow-md' : 'bg-white text-stone-600 border border-marigold/20'}`}
                  >
                    हिन्दी
                  </button>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-80 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 transform transition-all scale-100 animate-in zoom-in-95 duration-200 border border-marigold/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-sindoor to-marigold"></div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500 animate-pulse">
                <LogOut className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif font-bold text-heritage-dark mb-2">Confirm Logout</h3>
              <p className="text-stone-500 text-sm">Are you sure you want to end your spiritual session?</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-stone-200 font-bold text-stone-600 hover:bg-stone-50 transition-colors"
                autoFocus
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  logout();
                  setShowLogoutConfirm(false);
                  navigate('/');
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 shadow-lg hover:shadow-red-500/30 transition-all"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
