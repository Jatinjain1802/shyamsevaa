
import { FiBriefcase, FiUserPlus } from "react-icons/fi";

export default function Pandits() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <FiBriefcase className="text-(--color-primary)" />
            Pandit Management
          </h1>
          <p className="text-gray-500 mt-1">Onboard and manage your priests (Purohits).</p>
        </div>
        <button className="px-4 py-2 bg-(--color-primary) text-white rounded-xl hover:bg-(--color-primary-dark) flex items-center gap-2">
            <FiUserPlus /> Add Pandit
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                    <th className="px-6 py-4 font-semibold text-gray-600">Name</th>
                    <th className="px-6 py-4 font-semibold text-gray-600">Specialization</th>
                    <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
                    <th className="px-6 py-4 font-semibold text-gray-600">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4">Shri Ram Sharma</td>
                    <td className="px-6 py-4">Vedic Rituals</td>
                    <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Available</span></td>
                    <td className="px-6 py-4 text-gray-400">Edit</td>
                </tr>
            </tbody>
        </table>
      </div>
    </div>
  );
}
