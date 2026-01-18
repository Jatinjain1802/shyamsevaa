import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { FiUsers, FiActivity, FiDatabase } from "react-icons/fi";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  const stats = [
    { title: "Total Users", value: "1,234", icon: FiUsers, color: "bg-blue-100 text-blue-600" },
    { title: "Active Now", value: "45", icon: FiActivity, color: "bg-green-100 text-green-600" },
    { title: "Database Size", value: "4.2 GB", icon: FiDatabase, color: "bg-purple-100 text-purple-600" }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back, <span className="text-(--color-primary)">{user?.name || "Admin"}</span>!
        </h1>
        <p className="text-gray-500 mt-1">Here's what's happening with your project today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
