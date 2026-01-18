import { useState, useContext } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { 
  FiHome, 
  FiUsers, 
  FiSettings, 
  FiLogOut, 
  FiMenu, 
  FiX,
  FiUser,
  FiBook,
  FiBriefcase,
  FiCalendar
} from "react-icons/fi";

export default function AdminLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

const navItems = [
  { name: "Dashboard", path: "/admin", icon: FiHome, end: true },

  { name: "Poojas", path: "/admin/poojas", icon: FiBook },
  { name: "Pooja Addons", path: "/admin/pooja-addons", icon: FiSettings },

  { name: "Temples", path: "/admin/temples", icon: FiHome },

  { name: "Chadawas", path: "/admin/chadawas", icon: FiCalendar },
  { name: "Chadawa Items", path: "/admin/chadawa-items", icon: FiSettings },

  { name: "Pandits", path: "/admin/pandits", icon: FiBriefcase },
  { name: "Bookings", path: "/admin/bookings", icon: FiCalendar },

  { name: "Users", path: "/admin/users", icon: FiUsers },
];


  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-64" : "w-20"
        } lg:relative`}
      >
        <div className="h-full flex flex-col">
          {/* Logo Area */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
            {isSidebarOpen ? (
              <h1 className="text-xl font-bold bg-linear-to-r from-(--color-primary) to-(--color-primary-dark) bg-clip-text text-transparent">
                Admin Panel
              </h1>
            ) : (
              <span className="text-xl font-bold text-(--color-primary) mx-auto">AP</span>
            )}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 lg:hidden"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? "bg-orange-50 text-(--color-primary) shadow-sm" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className={`font-medium transition-opacity duration-200 ${
                  isSidebarOpen ? "opacity-100" : "opacity-0 hidden lg:block lg:w-0 lg:overflow-hidden"
                }`}>
                  {isSidebarOpen && item.name}
                </span>
              </NavLink>
            ))}
          </nav>

          {/* User Profile & Logout */}
          <div className="p-4 border-t border-gray-100">
            <div className={`flex items-center gap-3 ${!isSidebarOpen && "justify-center"}`}>
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-(--color-primary) shrink-0">
                <FiUser className="w-5 h-5" />
              </div>
              
              {isSidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user?.name || "Admin"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email || "admin@example.com"}
                  </p>
                </div>
              )}
            </div>
            
            <button
              onClick={handleLogout}
              className={`mt-4 w-full flex items-center gap-3 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 ${
                !isSidebarOpen && "justify-center"
              }`}
            >
              <FiLogOut className="w-5 h-5" />
              {isSidebarOpen && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:px-8">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hidden lg:block"
          >
            <FiMenu className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 lg:hidden"
          >
            <FiMenu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-4">
           {/* Top header actions if needed */}
          </div>
        </header>
        
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
