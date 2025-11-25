import React, { useEffect, useState } from 'react';
import { Stock } from '../types';
import { getFundamentals, Fundamentals } from '../services/marketDataService';
import { TrendingUp, TrendingDown, DollarSign, Activity, BarChart3 } from 'lucide-react';

interface FundamentalsPanelProps {
    stock?: Stock;
}

const FundamentalsPanel: React.FC<FundamentalsPanelProps> = ({ stock }) => {
    const [data, setData] = useState<Fundamentals | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (stock) {
                setLoading(true);
                try {
                    const result = await getFundamentals(stock.symbol);
                    setData(result);
                } catch (error) {
                    console.error("Failed to fetch fundamentals", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [stock]);

    if (!stock) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center text-slate-500 dark:text-slate-400">
                <p>Select a stock to view fundamentals.</p>
            </div>
        );
    }

    if (loading || !data) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const metrics = [
        { label: 'Market Cap', value: data.marketCap, icon: DollarSign },
        { label: 'P/E Ratio', value: data.peRatio, icon: Activity },
        { label: 'Div Yield', value: data.dividendYield, icon: BarChart3 },
        { label: 'EPS', value: data.eps, icon: TrendingUp },
        { label: '52W High', value: data.high52Week, icon: TrendingUp, color: 'text-green-500' },
        { label: '52W Low', value: data.low52Week, icon: TrendingDown, color: 'text-red-500' },
        { label: 'Volume', value: data.volume, icon: Activity },
        { label: 'Avg Vol', value: data.avgVolume, icon: Activity },
    ];

    return (
        <div className="h-full overflow-y-auto p-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Fundamentals for {stock.symbol}</h3>

            <div className="grid grid-cols-2 gap-4">
                {metrics.map((metric, index) => (
                    <div key={index} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
                            <metric.icon size={16} />
                            <span className="text-xs font-medium uppercase">{metric.label}</span>
                        </div>
                        <div className={`text-lg font-bold ${metric.color || 'text-slate-900 dark:text-white'}`}>
                            {metric.value}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Analyst Rating</h4>
                <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-2/3"></div>
                    </div>
                    <span className="font-bold text-green-600 dark:text-green-400">Buy</span>
                </div>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                    Based on 12 analyst ratings in the last 3 months.
                </p>
            </div>
        </div>
    );
};

export default FundamentalsPanel;
