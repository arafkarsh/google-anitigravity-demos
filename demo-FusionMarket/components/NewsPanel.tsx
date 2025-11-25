import React, { useEffect, useState } from 'react';
import { Stock } from '../types';
import { getCompanyNews, NewsItem } from '../services/marketDataService';
import { ExternalLink, Clock } from 'lucide-react';

interface NewsPanelProps {
    stock?: Stock;
}

const NewsPanel: React.FC<NewsPanelProps> = ({ stock }) => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchNews = async () => {
            if (stock) {
                setLoading(true);
                try {
                    const data = await getCompanyNews(stock.symbol);
                    setNews(data);
                } catch (error) {
                    console.error("Failed to fetch news", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchNews();
    }, [stock]);

    if (!stock) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center text-slate-500 dark:text-slate-400">
                <p>Select a stock to view recent news.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto p-4 space-y-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Recent News for {stock.symbol}</h3>
            {news.map(item => (
                <div key={item.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-medium px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                            {item.source}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock size={12} /> {item.time}
                        </span>
                    </div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2 leading-tight">{item.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 line-clamp-3">
                        {item.summary}
                    </p>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                        Read full story <ExternalLink size={12} />
                    </a>
                </div>
            ))}
        </div>
    );
};

export default NewsPanel;
