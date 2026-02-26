
import { FiBook, FiPlus } from "react-icons/fi";

export default function Services() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <FiBook className="text-(--color-primary)" />
            Pooja Services
          </h1>
          <p className="text-gray-500 mt-1">Manage your service catalog (Anushthan).</p>
        </div>
        <button className="px-4 py-2 bg-(--color-primary) text-white rounded-xl hover:bg-(--color-primary-dark) flex items-center gap-2">
          <FiPlus /> Add New Service
        </button>
      </div>

      <div className="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {/* Placeholder Service Card */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group">
          <div className="h-40 bg-gray-100 rounded-xl mb-4 flex items-center justify-center text-gray-400 group-hover:bg-orange-50 transition-colors">
            <FiBook className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-gray-900">Satyanarayan Katha</h3>
          <p className="text-sm text-gray-500 mt-1">Generic description for the service.</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="font-semibold text-(--color-primary)">₹ 1,100</span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
