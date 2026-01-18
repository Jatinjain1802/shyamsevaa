
import { FiCalendar, FiFilter } from "react-icons/fi";

export default function Bookings() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <FiCalendar className="text-(--color-primary)" />
            Pooja Bookings
          </h1>
          <p className="text-gray-500 mt-1">Manage and track all scheduled poojas.</p>
        </div>
        <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 flex items-center gap-2">
            <FiFilter /> Filter
        </button>
      </div>

      <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
        <h3 className="text-lg font-semibold text-gray-900">No Bookings Yet</h3>
        <p className="text-gray-500 mt-2">New bookings will appear here.</p>
      </div>
    </div>
  );
}
