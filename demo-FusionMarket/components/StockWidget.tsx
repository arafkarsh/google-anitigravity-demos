import React from 'react';
import { Stock } from '../types';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { X, Maximize2, TrendingUp, TrendingDown } from 'lucide-react';

interface StockWidgetProps {
  stock: Stock;
  onRemove: (symbol: string) => void;
  onZoom: (stock: Stock) => void;
}

const StockWidget: React.FC<StockWidgetProps> = ({ stock, onRemove, onZoom }) => {
  const isPositive = stock.change >= 0;

  return (
    <div className="relative group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 flex flex-col h-48">
      {/* Actions - Hidden by default, shown on hover */}
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          onClick={(e) => { e.stopPropagation(); onZoom(stock); }}
          className="p-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-blue-600 hover:text-white text-slate-600 dark:text-white rounded-full transition-colors"
          title="Detailed View"
        >
          <Maximize2 size={14} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(stock.symbol); }}
          className="p-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-red-500 hover:text-white text-slate-600 dark:text-white rounded-full transition-colors"
          title="Remove from Grid"
        >
          <X size={14} />
        </button>
      </div>

      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">{stock.symbol}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[120px]">{stock.name}</p>
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{stock.changePercent}%</span>
        </div>
      </div>

      {/* Price */}
      <div className="mb-2">
        <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">${stock.price.toFixed(2)}</span>
      </div>

      {/* Mini Chart */}
      <div className="flex-1 w-full min-h-[60px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={stock.history}>
            <defs>
              <linearGradient id={`gradient-${stock.symbol}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isPositive ? '#34d399' : '#fb7185'} stopOpacity={0.3} />
                <stop offset="95%" stopColor={isPositive ? '#34d399' : '#fb7185'} stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis domain={['dataMin', 'dataMax']} hide />
            <Area
              type="monotone"
              dataKey="value"
              stroke={isPositive ? '#34d399' : '#fb7185'}
              fill={`url(#gradient-${stock.symbol})`}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Trend Label */}
      <div className="mt-2 text-xs text-slate-500 flex justify-between items-center">
        <span>YoY Trend</span>
        <span className={isPositive ? 'text-emerald-500' : 'text-rose-500'}>{isPositive ? 'Growth' : 'Decline'}</span>
      </div>
    </div>
  );
};

export default StockWidget;
