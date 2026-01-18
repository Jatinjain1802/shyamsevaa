
import { FiUsers, FiSearch } from "react-icons/fi";

export default function Users() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <FiUsers className="text-(--color-primary)" />
          Devotees
        </h1>
        <p className="text-gray-500 mt-1">View and manage registered users.</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
                type="text" 
                placeholder="Search devotees by name or email..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
            />
        </div>
      </div>
    </div>
  );
}
