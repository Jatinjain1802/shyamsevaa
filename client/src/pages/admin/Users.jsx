import { useState, useEffect } from "react";
import api from "../../utils/axios";
import { FiUsers, FiSearch, FiMail, FiPhone } from "react-icons/fi";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/admin/users");
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.mobile && u.mobile.includes(searchQuery))
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <FiUsers className="text-(--color-primary)" />
            Devotees
          </h1>
          <p className="text-gray-500 mt-1">View and manage registered users.</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="relative max-w-xl">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search devotees by name, email or mobile..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--color-primary)"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-gray-500">
            <FiUsers className="w-16 h-16 text-gray-200 mb-4" />
            <h3 className="text-lg font-bold text-gray-700">No Devotees Found</h3>
            <p className="text-sm mt-1">Try changing your search filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto min-w-[1024px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="py-4 px-6 text-sm font-semibold text-gray-600">ID</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-600">User Details</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-600">Contact</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-600">Role</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-600">Joined On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-orange-50/50 transition-colors">
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">
                      #{user.id}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-(--color-primary)/10 flex items-center justify-center text-(--color-primary) font-bold text-sm shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800">{user.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FiMail className="text-gray-400" />
                          {user.email}
                        </div>
                        {user.mobile && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FiPhone className="text-gray-400" />
                            {user.mobile}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${user.role === "admin"
                            ? "bg-purple-50 text-purple-700 border-purple-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {formatDate(user.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
