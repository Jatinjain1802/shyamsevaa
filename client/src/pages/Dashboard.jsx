import React from 'react';

const Dashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-orange-100">
          <h2 className="text-xl font-semibold mb-2 text-orange-600">Total Devotees</h2>
          <p className="text-4xl font-bold text-gray-800">1,234</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-orange-100">
          <h2 className="text-xl font-semibold mb-2 text-orange-600">Today's Collections</h2>
          <p className="text-4xl font-bold text-gray-800">₹ 25,000</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-orange-100">
          <h2 className="text-xl font-semibold mb-2 text-orange-600">Upcoming Events</h2>
          <p className="text-4xl font-bold text-gray-800">3</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
