import React from 'react';
import Header from './components/Header';
import { ThemeProvider } from './hooks/useTheme';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Mock data for the dashboard demo
const data = [
  { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Jul', uv: 3490, pv: 4300, amt: 2100 },
];

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">
          
          {/* Hero / Welcome Section */}
          <section className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Welcome back, John
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
              Here is what's happening with your projects and reports today. 
              Resize the browser window to see the <strong>Dynamic Navigation</strong> overflow logic in action.
            </p>
          </section>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Revenue</h3>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">$45,231.89</p>
              <div className="text-sm text-green-500 mt-1 flex items-center">
                +20.1% <span className="text-slate-400 dark:text-slate-500 ml-1">from last month</span>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Projects</h3>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">12</p>
              <div className="text-sm text-slate-500 mt-1">
                2 pending approval
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Team Members</h3>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">24</p>
              <div className="flex -space-x-2 mt-2">
                 {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700 border-2 border-white dark:border-slate-900 flex items-center justify-center text-xs font-bold text-slate-500">
                        {i}
                    </div>
                 ))}
                 <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-900 flex items-center justify-center text-xs text-slate-500">+20</div>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 h-96">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Performance Overview</h3>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ color: '#0f172a' }}
                />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <Area type="monotone" dataKey="uv" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorUv)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
