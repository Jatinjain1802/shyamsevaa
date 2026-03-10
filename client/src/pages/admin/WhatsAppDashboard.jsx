import { useState, useEffect } from "react";
import api from "../../utils/axios";
import { 
  FiMessageSquare, 
  FiSend, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiClock, 
  FiUsers, 
  FiFileText,
  FiActivity,
  FiZap,
  FiTrendingUp,
  FiPieChart
} from "react-icons/fi";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie
} from "recharts";

export default function WhatsAppDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get("/whatsapp/admin/stats");
      setStats(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching whatsapp stats:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 rounded-full border-4 border-marigold/20 border-t-marigold animate-spin"></div>
      </div>
    );
  }

  const readCount = stats?.statusBreakdown?.read || 0;
  const deliveredCount = (stats?.statusBreakdown?.delivered || 0) + readCount;
  const sentCount = (stats?.statusBreakdown?.sent || 0) + deliveredCount;
  const failedCount = stats?.statusBreakdown?.failed || 0;

  const statusData = stats ? [
    { name: 'Sent', value: sentCount, color: '#94a3b8' },
    { name: 'Delivered', value: deliveredCount, color: '#fbbf24' },
    { name: 'Read', value: readCount, color: '#34d399' },
    { name: 'Failed', value: failedCount, color: '#f87171' },
  ] : [];

  const campaignStats = stats?.campaignAggregates || {};

  return (
    <div className="p-6 md:p-10 bg-linear-to-br from-stone-50 to-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-heritage-dark tracking-tighter mb-2 uppercase">
            WhatsApp <span className="text-marigold">Business</span> Dashboard
          </h1>
          <p className="text-stone-500 font-bold flex items-center gap-2">
            <FiActivity className="text-marigold" /> Real-time campaign & messaging insights
          </p>
        </div>
        <div className="flex gap-4">
           <div className="px-6 py-3 bg-white rounded-2xl shadow-xl border border-stone-100 flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">AWS Cloud Connected</span>
           </div>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard 
          title="Total Messages" 
          value={stats?.totalOutbound || 0} 
          icon={<FiSend className="w-6 h-6" />} 
          color="bg-linear-to-br from-blue-500 to-blue-600"
          subtitle="All outbound traffic"
        />
        <StatCard 
          title="Active Campaigns" 
          value={stats?.totalCampaigns || 0} 
          icon={<FiZap className="w-6 h-6" />} 
          color="bg-linear-to-br from-marigold to-sindoor"
          subtitle="Broadcast instances"
        />
        <StatCard 
          title="Official Templates" 
          value={stats?.totalTemplates || 0} 
          icon={<FiFileText className="w-6 h-6" />} 
          color="bg-linear-to-br from-purple-500 to-purple-600"
          subtitle="Meta approved assets"
        />
        <StatCard 
          title="Total Contacts" 
          value={stats?.totalContacts || 0} 
          icon={<FiUsers className="w-6 h-6" />} 
          color="bg-linear-to-br from-emerald-500 to-emerald-600"
          subtitle="Reachability base"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Delivery Analytics */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-2xl border border-stone-100">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-heritage-dark uppercase tracking-tight">Delivery Performance</h3>
              <FiTrendingUp className="text-marigold w-6 h-6" />
           </div>
           
           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontWeight: 700, fontSize: 12}}
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold'}}
                  />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={60}>
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {statusData.map((s, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
                   <p className="text-[10px] font-black uppercase text-stone-400 mb-1">{s.name}</p>
                   <p className="text-2xl font-black text-heritage-dark">{s.value}</p>
                </div>
              ))}
           </div>
        </div>

        {/* Campaign Metrics */}
        <div className="bg-[#111B21] text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
           {/* Abstract Background Decor */}
           <div className="absolute -top-20 -right-20 w-64 h-64 bg-marigold opacity-20 blur-[80px] rounded-full"></div>
           <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-sindoor opacity-10 blur-[80px] rounded-full"></div>

           <div className="relative z-10">
              <h3 className="text-xl font-black uppercase tracking-tight mb-10 flex items-center gap-3">
                 <FiPieChart className="text-marigold" /> Campaign ROI
              </h3>
              
              <div className="space-y-8">
                 <MetricRow title="Recipients" value={campaignStats.total_recipients || 0} icon={<FiUsers className="text-blue-400" />} />
                 <MetricRow title="Successfully Sent" value={campaignStats.sent_count || 0} icon={<FiCheckCircle className="text-green-400" />} />
                 <MetricRow title="Delivered" value={campaignStats.delivered_count || 0} icon={<FiZap className="text-yellow-400" />} />
                 <MetricRow title="Read Rate" value={`${campaignStats.sent_count > 0 ? ((campaignStats.read_count / campaignStats.sent_count) * 100).toFixed(1) : 0}%`} icon={<FiActivity className="text-marigold" />} />
                 <MetricRow title="Failed" value={campaignStats.failed_count || 0} icon={<FiAlertCircle className="text-red-400" />} />
              </div>

              <div className="mt-12 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 mb-2">Platform Health</p>
                 <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-marigold">HEALTHY</span>
                    <div className="flex gap-1 ml-auto">
                       {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-4 rounded-full bg-green-500/40"></div>)}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, subtitle }) {
  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-stone-100 group hover:translate-y-[-5px] transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg`}>
          {icon}
        </div>
        <div className="text-right">
           <p className="text-3xl font-black text-heritage-dark tracking-tighter">{value}</p>
        </div>
      </div>
      <div>
        <h4 className="font-black text-heritage-dark uppercase tracking-tight text-sm">{title}</h4>
        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

function MetricRow({ title, value, icon }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-4">
      <div className="flex items-center gap-3">
         <div className="p-2 rounded-xl bg-white/5">{icon}</div>
         <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">{title}</span>
      </div>
      <span className="text-lg font-black">{value}</span>
    </div>
  );
}
