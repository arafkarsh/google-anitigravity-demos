import React, { useState, useEffect } from 'react';
// UI Update: Merged Chat and Fundamentals + Maximize Toggle + Fixed Scrolling + Focus Mode + Refined Scrollbar + Crash Fix + Auto-Maximize Chat + Focus Mode Fix + Chat Guardrails + Penalty Box + Import Fix + Constants Refactor + Auto-Minimize Chat + Maximize Button Fix + Chat Scrollbar Fix
import { Stock, SearchResult } from './types';
import { getStockDetails, searchStocks } from './services/marketDataService';
import StockWidget from './components/StockWidget';
import StockDetailPanel from './components/StockDetailPanel';
import RightPanel, { Tab } from './components/RightPanel';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './context/ThemeContext';
import { Search, Plus, X, Layout, MessageSquare, Github, BarChart2, Maximize, Minimize, Disc, RotateCcw, Clock, LayoutDashboard, Settings, Sun, Moon, RefreshCw, Maximize2, Minimize2, Check } from 'lucide-react';
import { MAX_STOCKS, MAX_COMPARISON, PENALTY_DURATION_SECONDS, MAX_WARNINGS_BEFORE_PENALTY, DEFAULT_STOCKS } from './constants';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

const AppContent: React.FC = () => {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [watchlist, setWatchlist] = useState<Stock[]>([]);
  const [selectedStocks, setSelectedStocks] = useState<Stock[]>([]);
  const [isGridCollapsed, setIsGridCollapsed] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMarketWatchMaximized, setIsMarketWatchMaximized] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('fundamentals');
  const [activeAnalysisStock, setActiveAnalysisStock] = useState<Stock | null>(null);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(60);
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(false);
  const [isChatMaximized, setIsChatMaximized] = useState(false);

  // Penalty Box State
  const [warningCount, setWarningCount] = useState(0);
  const [isPenaltyActive, setIsPenaltyActive] = useState(false);
  const [penaltyTimeLeft, setPenaltyTimeLeft] = useState(0);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('fusion_watchlist');
    let loadedFromStorage = false;

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Even if we have saved data, we want to refresh prices and check for new defaults
          loadedFromStorage = true;

          const refreshData = async () => {
            const savedSymbols = parsed.map((s: Stock) => s.symbol);
            const newDefaults = ['NFLX', 'AMD', 'INTC'];
            // Merge saved symbols with new defaults, removing duplicates
            const allSymbols = Array.from(new Set([...savedSymbols, ...newDefaults]));

            try {
              const promises = allSymbols.map(sym => getStockDetails(sym));
              const results = await Promise.all(promises);
              setWatchlist(results);
              setIsInitialized(true);
            } catch (err) {
              console.error("Failed to refresh stock data", err);
              // Fallback to saved data if fetch fails
              setWatchlist(parsed);
              setIsInitialized(true);
            }
          };

          refreshData();
        }
      } catch (e) {
        console.error("Failed to parse watchlist", e);
      }
    }

    if (!loadedFromStorage) {
      // Default initialization for fresh users
      const loadDefaults = async () => {
        const promises = DEFAULT_STOCKS.map(sym => getStockDetails(sym));
        try {
          const results = await Promise.all(promises);
          setWatchlist(results);
          setIsInitialized(true);

          // Randomly select a stock for analysis if none selected
          if (results.length > 0) {
            const randomStock = results[Math.floor(Math.random() * results.length)];
            setSelectedStocks([randomStock]);
            // Ensure grid is NOT collapsed to show "3 rows" (dashboard view)
            setIsGridCollapsed(false);
          }
        } catch (err) {
          console.error("Failed to load default stocks", err);
        }
      };

      loadDefaults();
    } else {
      // If loaded from storage but no selection, pick random
      if (selectedStocks.length === 0 && watchlist.length > 0) {
        const randomStock = watchlist[Math.floor(Math.random() * watchlist.length)];
        setSelectedStocks([randomStock]);
        setIsGridCollapsed(false);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('fusion_watchlist', JSON.stringify(watchlist));
    }
  }, [watchlist, isInitialized]);

  // Auto Refresh Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoRefreshEnabled) {
      interval = setInterval(() => {
        handleRefreshData();
      }, autoRefreshInterval * 1000);
    }
    return () => clearInterval(interval);
  }, [isAutoRefreshEnabled, autoRefreshInterval, watchlist]);

  const handleRefreshData = async () => {
    if (watchlist.length === 0) return;

    try {
      // Refresh all stocks in watchlist
      const promises = watchlist.map(s => getStockDetails(s.symbol));
      const updatedStocks = await Promise.all(promises);
      setWatchlist(updatedStocks);

      // Also update selected stocks with new data
      setSelectedStocks(prev => {
        return prev.map(s => {
          const updated = updatedStocks.find(u => u.symbol === s.symbol);
          return updated || s;
        });
      });
    } catch (err) {
      console.error("Failed to refresh data", err);
    }
  };

  // Search Logic
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        const results = await searchStocks(searchQuery);
        // Don't filter out stocks already in watchlist, let the UI handle it
        setSearchResults(results);
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, watchlist]);

  const addToWatchlist = async (symbol: string) => {
    setIsSearching(true);
    try {
      const stock = await getStockDetails(symbol);
      setWatchlist(prev => {
        if (prev.some(s => s.symbol === stock.symbol)) return prev; // Prevent duplicates
        if (prev.length >= MAX_STOCKS) return prev; // Max stocks limit
        const updated = [...prev, stock];
        localStorage.setItem('fusion_watchlist', JSON.stringify(updated)); // Update local storage immediately
        return updated;
      });
      setSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      console.error("Failed to add stock", error);
    } finally {
      setIsSearching(false);
    }
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(prev => prev.filter(s => s.symbol !== symbol));
    // Also remove from selection if present
    setSelectedStocks(prev => prev.filter(s => s.symbol !== symbol));
  };

  const handleZoom = (stock: Stock) => {
    // If already selected, do nothing
    if (selectedStocks.some(s => s.symbol === stock.symbol)) return;

    // Add to selection, removing oldest if > MAX_COMPARISON
    setSelectedStocks(prev => {
      const newSelection = [...prev, stock];
      if (newSelection.length > MAX_COMPARISON) {
        return newSelection.slice(1);
      }
      return newSelection;
    });

    // Auto collapse grid if we have selections to show details better
    // REMOVED: User requested "Dashboard in 3 rows" as default mode, so we don't auto-collapse
    // if (!isGridCollapsed) setIsGridCollapsed(true);
  };

  // Auto-collapse grid when 3 stocks are selected (Max Comparison)
  // Auto-collapse grid when 3 stocks are selected (Max Comparison)
  // REMOVED: User requested manual control only
  // useEffect(() => {
  //   if (selectedStocks.length === MAX_COMPARISON) {
  //     setIsGridCollapsed(true);
  //   }
  // }, [selectedStocks.length]);

  const removeSelection = (symbol: string) => {
    setSelectedStocks(prev => prev.filter(s => s.symbol !== symbol));
    // If we removed the active analysis stock, reset it
    if (activeAnalysisStock?.symbol === symbol) {
      setActiveAnalysisStock(null);
    }
  };

  const toggleMarketWatchMaximize = () => {
    setIsMarketWatchMaximized(!isMarketWatchMaximized);
  };

  const handleOpenTab = (tab: Tab, symbol: string) => {
    const stock = selectedStocks.find(s => s.symbol === symbol);
    if (stock) {
      setActiveAnalysisStock(stock);
      setActiveTab(tab);
      setIsChatOpen(true);
      setIsChatMaximized(false); // Auto-minimize chat to show fundamentals
      // Ensure market watch is not maximized so we can see the right panel
      if (isMarketWatchMaximized) setIsMarketWatchMaximized(false);
    }
  };

  // Auto-collapse chat when multiple stocks are selected
  // Auto-collapse chat when multiple stocks are selected
  // REMOVED: User requested manual control only
  // useEffect(() => {
  //   if (selectedStocks.length > 1) {
  //     setIsChatOpen(false);
  //   }
  // }, [selectedStocks.length]);

  const handleAnalysisLayoutChange = (mode: 'vertical' | 'horizontal') => {
    if (mode === 'horizontal') {
      // Focus Mode: Collapse Grid and Close Chat
      setIsGridCollapsed(true);
      setIsChatOpen(false);
    }
  };

  const handleWarning = () => {
    const newCount = warningCount + 1;
    setWarningCount(newCount);

    if (newCount >= MAX_WARNINGS_BEFORE_PENALTY) {
      setIsPenaltyActive(true);
      setWarningCount(0); // Reset count
      setPenaltyTimeLeft(PENALTY_DURATION_SECONDS);

      const timer = setInterval(() => {
        setPenaltyTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsPenaltyActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 overflow-hidden transition-colors duration-300 relative">

      {/* Penalty Overlay */}
      {isPenaltyActive && (
        <div className="absolute inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl max-w-md w-full border border-red-500/50">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Account Temporarily Suspended</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              You have triggered multiple warnings for violating our content policy.
              Access will be restored in:
            </p>
            <div className="text-5xl font-mono font-bold text-slate-900 dark:text-white mb-2">
              {penaltyTimeLeft}s
            </div>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center px-6 justify-between z-20 shrink-0 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-1.5 rounded text-white">
            <Disc size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Fusion<span className="text-blue-600 dark:text-blue-500">Market</span></h1>
        </div>

        {/* Search Area */}
        <div className="relative max-w-3xl w-full mx-4 group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search stocks (e.g. AAPL, Microsoft)..."
            className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-10 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm text-slate-900 dark:text-white placeholder-slate-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); setSearchResults([]); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-white"
            >
              <X size={14} />
            </button>
          )}

          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden max-h-80 overflow-y-auto">
              {searchResults.map(result => (
                <div key={result.symbol} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between transition-colors group/item">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{result.symbol}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{result.name}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-slate-600 dark:text-slate-300">${result.price.toFixed(2)}</span>
                    {watchlist.some(w => w.symbol === result.symbol) ? (
                      <div className="p-1.5 text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                        <Check size={16} />
                      </div>
                    ) : (
                      <button
                        onClick={() => addToWatchlist(result.symbol)}
                        className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsGridCollapsed(!isGridCollapsed)}
            className={`p-2 rounded-lg transition-colors ${isGridCollapsed ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
            title="Toggle Comparison Mode"
          >
            <Layout size={20} />
          </button>
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`p-2 rounded-lg transition-colors ${isChatOpen ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
            title="Toggle Right Panel"
          >
            <Layout size={20} className="rotate-180" />
          </button>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden relative">

        {/* Left: Stock Grid */}
        <div className={`transition-all duration-500 ease-in-out flex flex-col overflow-hidden ${isMarketWatchMaximized ? 'w-full' :
          isGridCollapsed ? 'w-1/4' : 'flex-1'
          } ${selectedStocks.length > 0 && !isGridCollapsed && !isMarketWatchMaximized ? 'w-2/3' : ''}`}>

          <div className="p-6 pb-0 shrink-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white whitespace-nowrap">Market Watch</h2>
              <div className="flex items-center gap-3">
                {!isGridCollapsed && (
                  <div className="text-sm text-slate-500">
                    {watchlist.length} / {MAX_STOCKS}
                  </div>
                )}
                <div className="flex items-center gap-2 mr-2 border-r border-slate-200 dark:border-slate-700 pr-2">
                  <button
                    onClick={handleRefreshData}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                    title="Refresh Data"
                  >
                    <RotateCcw size={18} />
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setIsAutoRefreshEnabled(!isAutoRefreshEnabled)}
                      className={`p-1.5 rounded-lg transition-colors ${isAutoRefreshEnabled ? 'text-green-500 bg-green-500/10' : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'}`}
                      title={isAutoRefreshEnabled ? "Auto-Refresh On" : "Auto-Refresh Off"}
                    >
                      <Clock size={18} />
                    </button>

                    {isAutoRefreshEnabled && (
                      <select
                        value={autoRefreshInterval}
                        onChange={(e) => setAutoRefreshInterval(Number(e.target.value))}
                        className="bg-transparent text-xs font-medium text-slate-600 dark:text-slate-300 border-none focus:ring-0 cursor-pointer"
                      >
                        <option value={15}>15s</option>
                        <option value={30}>30s</option>
                        <option value={45}>45s</option>
                        <option value={60}>60s</option>
                        <option value={120}>120s</option>
                        <option value={180}>180s</option>
                        <option value={240}>240s</option>
                        <option value={300}>300s</option>
                        <option value={600}>600s</option>
                      </select>
                    )}
                  </div>
                </div>
                <button
                  onClick={toggleMarketWatchMaximize}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                  title={isMarketWatchMaximized ? "Minimize Dashboard" : "Maximize Dashboard"}
                >
                  {isMarketWatchMaximized ? <Minimize size={18} /> : <Maximize size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-6 min-h-0">
            {watchlist.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl text-slate-400 dark:text-slate-500">
                <BarChart2 size={48} className="mb-4 opacity-50" />
                <p className="text-lg font-medium">Your watchlist is empty</p>
                <p className="text-sm">Use the search bar to add stocks.</p>
              </div>
            ) : (
              <div className={`grid gap-4 ${isGridCollapsed
                ? 'grid-cols-1' // Single column when collapsed
                : isChatOpen
                  ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' // Conservative when chat is open
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' // Standard when chat is closed
                }`}>
                {watchlist.map(stock => (
                  <StockWidget
                    key={stock.symbol}
                    stock={stock}
                    onRemove={removeFromWatchlist}
                    onZoom={handleZoom}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Middle/Right: Detail Panel (Comparison) */}
        {selectedStocks.length > 0 && (
          <div className={`border-l border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 transition-all duration-500 ease-in-out ${isMarketWatchMaximized
            ? 'w-0 border-none overflow-hidden'
            : isGridCollapsed ? 'flex-1' : 'w-1/3'
            }`}>
            <StockDetailPanel
              stocks={selectedStocks}
              onClose={removeSelection}
              onOpenTab={handleOpenTab}
              onLayoutChange={handleAnalysisLayoutChange}
            />
          </div>
        )}

        {/* Far Right: Right Panel (Chat/News/Fundamentals) */}
        <div className={`border-l border-slate-200 dark:border-slate-800 transition-all duration-500 ease-in-out ${isMarketWatchMaximized
          ? 'w-0 border-none overflow-hidden'
          : isChatOpen ? 'w-[450px]' : 'w-12'
          } h-full`}>
          <RightPanel
            selectedStock={activeAnalysisStock || selectedStocks[0]}
            isOpen={isChatOpen}
            onToggle={() => setIsChatOpen(!isChatOpen)}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onWarning={handleWarning}
            isChatMaximized={isChatMaximized}
            onToggleChatMaximize={() => setIsChatMaximized(!isChatMaximized)}
          />
        </div>

      </main>
    </div>
  );
};

export default App;
