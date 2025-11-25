import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Users, DollarSign, Activity, ShoppingBag } from 'lucide-react';
import { SalesData } from '../../types';

const data: SalesData[] = [
  { name: 'Mon', revenue: 4000, profit: 2400, visitors: 2400 },
  { name: 'Tue', revenue: 3000, profit: 1398, visitors: 2210 },
  { name: 'Wed', revenue: 2000, profit: 9800, visitors: 2290 },
  { name: 'Thu', revenue: 2780, profit: 3908, visitors: 2000 },
  { name: 'Fri', revenue: 1890, profit: 4800, visitors: 2181 },
  { name: 'Sat', revenue: 2390, profit: 3800, visitors: 2500 },
  { name: 'Sun', revenue: 3490, profit: 4300, visitors: 2100 },
];

const StatCard = ({ title, value, change, isPositive, icon: Icon, colorClass }: any) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{value}</h3>
      </div>
      <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10`}>
        <Icon size={20} className={colorClass.replace('bg-', 'text-')} />
      </div>
    </div>
    <div className="mt-4 flex items-center">
      {isPositive ? (
        <ArrowUpRight size={16} className="text-emerald-500 mr-1" />
      ) : (
        <ArrowDownRight size={16} className="text-red-500 mr-1" />
      )}
      <span className={`text-sm font-medium ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
        {change}
      </span>
      <span className="text-sm text-gray-400 ml-2">vs last month</span>
    </div>
  </div>
);

const MainContent: React.FC = () => {
  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-[#0b1120] p-4 md:p-8 pt-20">
      
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Revenue" 
          value="$54,239" 
          change="+12.5%" 
          isPositive={true} 
          icon={DollarSign}
          colorClass="bg-blue-500 text-blue-500"
        />
        <StatCard 
          title="Active Users" 
          value="8,549" 
          change="+5.2%" 
          isPositive={true} 
          icon={Users}
          colorClass="bg-purple-500 text-purple-500"
        />
        <StatCard 
          title="Bounce Rate" 
          value="42.3%" 
          change="-2.1%" 
          isPositive={true} 
          icon={Activity}
          colorClass="bg-orange-500 text-orange-500"
        />
        <StatCard 
          title="Total Sales" 
          value="1,245" 
          change="-0.5%" 
          isPositive={false} 
          icon={ShoppingBag}
          colorClass="bg-pink-500 text-pink-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Area Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-border shadow-sm">
          <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Revenue Analytics</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} className="dark:stroke-gray-700" />
                <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ color: '#1e293b' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-border shadow-sm">
          <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Traffic Source</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} className="dark:stroke-gray-700" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Legend />
                <Bar dataKey="profit" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Direct" />
                <Bar dataKey="visitors" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Social" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Recent Activity Table */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                        <th className="px-6 py-4 font-medium">Order ID</th>
                        <th className="px-6 py-4 font-medium">Customer</th>
                        <th className="px-6 py-4 font-medium">Product</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                        <th className="px-6 py-4 font-medium text-right">Amount</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">#SK254{i}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <img src={`https://picsum.photos/32/32?random=${i}`} alt="" className="w-8 h-8 rounded-full" />
                                    <span className="text-gray-700 dark:text-gray-300">Alex Morgan</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">Pro License</td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                                    Completed
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right font-medium text-gray-900 dark:text-white">$129.00</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </main>
  );
};

export default MainContent;