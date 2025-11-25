import React, { useEffect, useState } from 'react';
import { Stock, TimeRange } from '../types';
import { generateStockSummary, AIStockAnalysis } from '../services/geminiService';
import { getRealStockHistory } from '../services/marketDataService';
import { X, Zap, Newspaper, Activity, Columns, Rows, Users, Building, DollarSign, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StockDetailPanelProps {
  stocks: Stock[];
  onClose: (symbol: string) => void;
  onOpenTab: (tab: 'news' | 'fundamentals', symbol: string) => void;
  onLayoutChange?: (mode: 'vertical' | 'horizontal') => void;
}

const StockCard: React.FC<{ stock: Stock; onClose: () => void; isHorizontal: boolean; onOpenTab: (tab: 'news' | 'fundamentals', symbol: string) => void }> = ({ stock, onClose, isHorizontal, onOpenTab }) => {
  const [aiData, setAiData] = useState<AIStockAnalysis | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('1D');
  const [chartData, setChartData] = useState<{ time: string; value: number }[]>(stock.history);
  const [isLoadingChart, setIsLoadingChart] = useState(false);

  useEffect(() => {
    let mounted = true;
    generateStockSummary(stock).then(res => {
      if (mounted) setAiData(res);
    });
    return () => { mounted = false; };
  }, [stock]);

  // Fetch chart data when range changes
  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoadingChart(true);
      try {
        const data = await getRealStockHistory(stock.symbol, timeRange);
        setChartData(data);
      } catch (error) {
        console.error("Failed to fetch history", error);
      } finally {
        setIsLoadingChart(false);
      }
    };

    fetchHistory();
  }, [timeRange, stock.symbol]);

  const isPositive = stock.change >= 0;
  const ranges: TimeRange[] = ['1D', '3M', '6M', '1Y', '5Y'];

  return (
    <div className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 mb-4 shadow-xl relative animate-in slide-in-from-right duration-300 ${isHorizontal ? 'min-w-[400px] w-[400px]' : 'w-full'}`}>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
      >
        <X size={20} />
      </button>

      <div className="flex items-baseline justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            {stock.name} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">({stock.symbol})</span>
          </h2>
          <div className="flex items-center gap-4 mt-1">
            <span className="text-3xl font-bold text-blue-400">${stock.price.toFixed(2)}</span>
            <span className={`px-2 py-1 rounded text-sm font-medium ${isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
              {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent}%)
            </span>
          </div>
        </div>
      </div>

      {/* Time Range Selectors */}
      <div className="flex gap-1 mb-4 bg-slate-100 dark:bg-slate-900/50 p-1 rounded-lg w-fit">
        {ranges.map(range => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${timeRange === range
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-48 w-full mb-6 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-2 border border-slate-200 dark:border-slate-700/50 relative">
        {isLoadingChart && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 z-10 backdrop-blur-sm rounded-lg">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`detail-${stock.symbol}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              interval="preserveStartEnd"
              minTickGap={30}
            />
            <YAxis domain={['auto', 'auto']} orientation="right" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }}
              itemStyle={{ color: '#3b82f6' }}
            />
            <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill={`url(#detail-${stock.symbol})`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
          <p className="text-xs text-slate-400 mb-1">Market Cap</p>
          <p className="font-semibold text-slate-900 dark:text-slate-200">{stock.marketCap}</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
          <p className="text-xs text-slate-400 mb-1">Volume</p>
          <p className="font-semibold text-slate-900 dark:text-slate-200">{stock.volume}</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
          <p className="text-xs text-slate-400 mb-1">P/E Ratio</p>
          <p className="font-semibold text-slate-900 dark:text-slate-200">{stock.peRatio}</p>
        </div>
      </div>

      {/* AI Summary */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3 text-blue-500 dark:text-blue-400">
          <Zap size={18} className="fill-blue-500/20" />
          <h4 className="text-sm font-bold uppercase tracking-wider">AI Insight</h4>
        </div>

        {aiData ? (
          <>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
              {aiData.summary}
            </p>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-blue-200 dark:border-blue-500/30">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <Users size={12} />
                  <span>CEO</span>
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate" title={aiData.ceo}>{aiData.ceo}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <Calendar size={12} />
                  <span>Founded</span>
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate" title={aiData.founded}>{aiData.founded}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <Building size={12} />
                  <span>Founders</span>
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate" title={aiData.founders}>{aiData.founders}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <DollarSign size={12} />
                  <span>Revenue</span>
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate" title={aiData.revenue}>{aiData.revenue}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <Users size={12} />
                  <span>Employees</span>
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate" title={aiData.employees}>{aiData.employees}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <Activity size={12} />
                  <span>Rev / Employee</span>
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate" title={aiData.revenuePerEmployee}>{aiData.revenuePerEmployee}</p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm animate-pulse">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            <span>Analyzing market data...</span>
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-4 border-t border-slate-200 dark:border-slate-700 pt-4">
        <button
          onClick={() => onOpenTab('news', stock.symbol)}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-blue-500 transition-colors"
        >
          <Newspaper size={14} />
          <span>Recent News</span>
        </button>
        <button
          onClick={() => onOpenTab('fundamentals', stock.symbol)}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-blue-500 transition-colors"
        >
          <Activity size={14} />
          <span>Fundamentals</span>
        </button>
      </div>
    </div >
  );
};

const StockDetailPanel: React.FC<StockDetailPanelProps> = ({ stocks, onClose, onOpenTab, onLayoutChange }) => {
  const [layoutMode, setLayoutMode] = useState<'vertical' | 'horizontal'>('vertical');

  const handleLayoutChange = (mode: 'vertical' | 'horizontal') => {
    setLayoutMode(mode);
    if (onLayoutChange) {
      onLayoutChange(mode);
    }
  };

  if (stocks.length === 0) return null;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between p-4 shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Analysis Deck</h2>
          <span className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-full">
            {stocks.length} / 3 Active
          </span>
        </div>

        <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => handleLayoutChange('vertical')}
            className={`p-1.5 rounded-md transition-all ${layoutMode === 'vertical' ? 'bg-white dark:bg-slate-600 shadow text-blue-600 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            title="Vertical View"
          >
            <Rows size={16} />
          </button>
          <button
            onClick={() => handleLayoutChange('horizontal')}
            className={`p-1.5 rounded-md transition-all ${layoutMode === 'horizontal' ? 'bg-white dark:bg-slate-600 shadow text-blue-600 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            title="Horizontal View"
          >
            <Columns size={16} />
          </button>
        </div>
      </div>

      <div className={`flex-1 p-4 pt-0 hover-scrollbar ${layoutMode === 'horizontal' ? 'overflow-x-auto overflow-y-hidden' : 'overflow-y-auto'}`}>
        <div className={`flex ${layoutMode === 'horizontal' ? 'flex-row space-x-4 h-full' : 'flex-col space-y-4'}`}>
          {stocks.map(stock => (
            <StockCard key={stock.symbol} stock={stock} onClose={() => onClose(stock.symbol)} isHorizontal={layoutMode === 'horizontal'} onOpenTab={onOpenTab} />
          ))}

          {stocks.length < 3 && (
            <div className={`border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 ${layoutMode === 'horizontal' ? 'min-w-[300px]' : 'h-32'}`}>
              <p className="text-sm">Select another stock to compare</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockDetailPanel;
