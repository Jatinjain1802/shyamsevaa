import { useState, useContext } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  FiUsers,
  FiLogOut,
  FiMenu,
  FiX,
  FiBook,
  FiBriefcase,
  FiCalendar,
  FiShoppingBag,
  FiMapPin,
  FiGrid,
  FiZap,
  FiChevronRight,
  FiMessageSquare
} from "react-icons/fi";

export default function AdminLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navGroups = [
    {
      title: "Core",
      items: [
        { name: "Dashboard", path: "/admin", icon: FiGrid, end: true },
        { name: "Orders", path: "/admin/orders", icon: FiShoppingBag },
        { name: "Bookings", path: "/admin/bookings", icon: FiCalendar },
      ]
    },
    {
      title: "Offerings",
      items: [
        { name: "Poojas", path: "/admin/poojas", icon: FiBook },
        { name: "Pooja Addons", path: "/admin/addons", icon: FiZap },
        { name: "Chadawas", path: "/admin/chadawas", icon: FiShoppingBag },
        { name: "Products", path: "/admin/products", icon: FiGrid },
      ]
    },
    {
      title: "Directory",
      items: [
        { name: "Temples", path: "/admin/temples", icon: FiMapPin },
        { name: "Pandits", path: "/admin/pandits", icon: FiBriefcase },
        { name: "Users", path: "/admin/users", icon: FiUsers },
      ]
    },
    {
      title: "Communication",
      items: [
        { name: "WA Analytics", path: "/admin/whatsapp/dashboard", icon: FiGrid },
        { name: "WA Templates", path: "/admin/whatsapp/templates", icon: FiMessageSquare },
        { name: "WA Campaigns", path: "/admin/whatsapp/campaigns", icon: FiMessageSquare },
        { name: "WA Chats", path: "/admin/whatsapp/chats", icon: FiMessageSquare },
      ]
    }

  ];

  return (
    <div className="min-h-screen bg-stone-50 flex font-sans antialiased text-heritage-dark">
      {/* Sidebar */}
      <aside
        className={`sticky top-0 h-screen z-50 bg-[#1e1e1e] text-white shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,-0.1)] shrink-0 flex flex-col border-r border-white/5 ${isSidebarOpen ? "w-56 lg:w-64 xl:w-72" : "w-16 lg:w-20 xl:w-24"
          }`}
      >
        <div className="relative z-10 h-full flex flex-col">
          {/* Professional Logo Area */}
          <div className="h-20 lg:h-24 xl:h-28 flex items-center px-4 lg:px-5 xl:px-6 mb-2 border-b border-white/5">
            <div className={`flex items-center gap-4 transition-all duration-300 ${!isSidebarOpen && "mx-auto justify-center"}`}>
              <div className="w-12 h-12 bg-linear-to-br from-marigold to-sindoor rounded-xl flex items-center justify-center shadow-lg shrink-0">
                <span className="text-2xl font-black text-white font-serif">S</span>
              </div>
              {isSidebarOpen && (
                <div className="animate-in fade-in slide-in-from-left-4 duration-500 overflow-hidden">
                  <h1 className="text-xl font-black font-serif tracking-tight leading-none text-white uppercase italic">
                    Shyam Sevaa
                  </h1>
                  <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-marigold block mt-1 opacity-80">Professional Dashboard</span>
                </div>
              )}
            </div>
          </div>

          {/* Grouped Navigation */}
          <nav className="flex-1 px-2 lg:px-3 xl:px-4 py-4 lg:py-6 xl:py-8 overflow-y-auto custom-scrollbar-dark space-y-4 lg:space-y-6 xl:space-y-8">
            {navGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-2">
                {isSidebarOpen && (
                  <p className="px-5 text-[10px] uppercase tracking-[0.25em] font-black text-stone-500 mb-3 ml-1">
                    {group.title}
                  </p>
                )}
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.end}
                      className={({ isActive }) =>
                        `flex items-center gap-3 xl:gap-4 px-3 xl:px-5 py-3 xl:py-3.5 rounded-2xl transition-all duration-300 group relative ${isActive
                          ? "bg-white/10 text-white shadow-lg"
                          : "text-stone-400 hover:text-white hover:bg-white/3"
                        }`
                      }
                    >
                      <item.icon className={`w-5 h-5 shrink-0 transition-colors duration-300 group-hover:text-marigold ${isSidebarOpen ? "" : "mx-auto"}`} />
                      {isSidebarOpen && (
                        <>
                          <span className="font-bold text-[13px] tracking-wide flex-1">
                            {item.name}
                          </span>
                          <FiChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
                        </>
                      )}
                      {/* Tooltip for collapsed state */}
                      {!isSidebarOpen && (
                        <div className="absolute left-full ml-4 px-3 py-2 bg-stone-900 text-white text-[10px] font-black rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 border border-white/10 uppercase tracking-widest shadow-2xl">
                          {item.name}
                        </div>
                      )}

                      {/* Active Indicator Bar */}
                      <div className={`absolute left-0 w-1 h-5 bg-marigold rounded-full transition-all duration-300 ${isSidebarOpen ? "scale-y-100" : "scale-y-0"}`}
                        style={{ opacity: window.location.pathname === item.path || (item.end && window.location.pathname === '/admin') ? 1 : 0 }}></div>
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Refined User Section - Fixed overlap by removing absolute positioning and using flex-col flow */}
          <div className="p-3 lg:p-4 xl:p-6 border-t border-white/5 bg-white/2 backdrop-blur-md mt-auto">
            <div className={`flex items-center gap-3 p-3 rounded-2xl ${!isSidebarOpen && "justify-center"}`}>
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-stone-700 to-stone-800 border border-white/10 flex items-center justify-center text-marigold font-black text-sm">
                  {user?.name?.[0]?.toUpperCase() || "A"}
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-[#1e1e1e] rounded-full shadow-sm"></div>
              </div>

              {isSidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-black text-white truncate uppercase tracking-wider leading-tight">
                    {user?.name || "Administrator"}
                  </p>
                  <p className="text-[10px] text-stone-500 font-bold truncate mt-0.5">
                    {user?.email || "admin@ShyamSevaa.com"}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-5 py-3.5 mt-2 rounded-xl text-stone-400 hover:bg-sindoor/10 hover:text-sindoor transition-all duration-300 group ${!isSidebarOpen && "justify-center"
                }`}
            >
              <FiLogOut className="w-5 h-5 shrink-0" />
              {isSidebarOpen && <span className="font-black text-[11px] uppercase tracking-[0.2em] pt-0.5">Logout System</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 h-16 lg:h-18 xl:h-20 bg-white/80 backdrop-blur-md border-b border-stone-100 z-40 flex items-center justify-between px-4 lg:px-6 xl:px-10 shadow-sm shadow-stone-100/50">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-stone-50 text-stone-400 hover:text-marigold hover:bg-white transition-all border border-stone-100/50"
          >
            {isSidebarOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-8">
            <div className="hidden md:flex flex-col text-right">
              <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest leading-none">Global Server</p>
              <p className="text-[11px] font-bold text-green-600 flex items-center gap-1.5 justify-end mt-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Secure Connection
              </p>
            </div>
            <div className="h-10 w-px bg-stone-100"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-[11px] font-black text-heritage-dark uppercase tracking-tight">{user?.name || "Admin"}</p>
                <p className="text-[10px] font-bold text-stone-400">Master Level</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-stone-50 border border-stone-100 p-1">
                <div className="w-full h-full rounded-lg bg-linear-to-br from-stone-200 to-stone-300"></div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 xl:p-10 overflow-x-hidden custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
