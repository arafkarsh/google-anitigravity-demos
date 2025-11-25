import React, { useState, useEffect } from 'react';
import { Stock } from '../types';
import ChatAssistant from './ChatAssistant';
import NewsPanel from './NewsPanel';
import FundamentalsPanel from './FundamentalsPanel';
import { MessageSquare, Newspaper, BarChart3, ChevronRight, ChevronLeft } from 'lucide-react';

interface RightPanelProps {
    selectedStock?: Stock;
    isOpen: boolean;
    onToggle: () => void;
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
    onWarning?: () => void;
    isChatMaximized: boolean;
    onToggleChatMaximize: () => void;
}

export type Tab = 'news' | 'fundamentals';

const RightPanel: React.FC<RightPanelProps> = ({
    selectedStock,
    isOpen,
    onToggle,
    activeTab,
    onTabChange,
    onWarning,
    isChatMaximized,
    onToggleChatMaximize
}) => {

    const shouldMaximize = isChatMaximized || !selectedStock;

    const tabs = [
        { id: 'fundamentals', label: 'Fundamentals', icon: BarChart3 },
        { id: 'news', label: 'News', icon: Newspaper },
    ];

    if (!isOpen) {
        return (
            <div className="h-full w-12 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col items-center py-4 gap-6 transition-all duration-300">
                <button
                    onClick={onToggle}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-4"
                    title="Expand Panel"
                >
                    <ChevronLeft size={20} />
                </button>

                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            onTabChange(tab.id as Tab);
                            onToggle();
                        }}
                        className="flex flex-col items-center gap-2 group w-full"
                        title={tab.label}
                    >
                        <div className={`p-2 rounded-lg transition-colors ${activeTab === tab.id
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                            : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                            }`}>
                            <tab.icon size={20} />
                        </div>
                    </button>
                ))}
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 transition-all duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-2 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id as Tab)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2 ${activeTab === tab.id
                                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                }`}
                        >
                            <tab.icon size={14} />
                            {tab.label}
                        </button>
                    ))}
                </div>
                <button
                    onClick={onToggle}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    title="Collapse Panel"
                >
                    <ChevronRight size={18} />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden relative min-h-0">
                <div className={activeTab === 'news' ? 'h-full' : 'hidden'}>
                    <NewsPanel stock={selectedStock} />
                </div>

                <div className={activeTab === 'fundamentals' ? 'h-full flex flex-col min-h-0' : 'hidden'}>
                    <div className={`flex-1 overflow-y-auto border-b border-slate-200 dark:border-slate-800 ${shouldMaximize ? 'hidden' : ''}`}>
                        <FundamentalsPanel stock={selectedStock} />
                    </div>
                    <div className={`${shouldMaximize ? 'flex-1 min-h-0' : 'h-[450px] shrink-0'} border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 transition-all duration-300`}>
                        <ChatAssistant
                            isMaximized={shouldMaximize}
                            onToggleMaximize={onToggleChatMaximize}
                            onWarning={onWarning}
                            selectedStock={selectedStock}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RightPanel;
