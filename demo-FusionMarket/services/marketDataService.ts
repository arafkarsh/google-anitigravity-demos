import { Stock, SearchResult, TimeRange } from '../types';

// A list of popular stocks for simulation
// Data updated as of Nov 2025
const STOCK_DB = [
  {
    symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology', price: 271.49,
    marketCap: '3.4T', peRatio: 36.34, dividendYield: '0.39%', eps: 7.49, high52: 277.32, low52: 169.21, avgVol: '54M'
  },
  {
    symbol: 'MSFT', name: 'Microsoft Corp.', sector: 'Technology', price: 472.12,
    marketCap: '3.51T', peRatio: 33.90, dividendYield: '0.75%', eps: 14.04, high52: 555.45, low52: 344.79, avgVol: '21M'
  },
  {
    symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology', price: 299.65,
    marketCap: '3.47T', peRatio: 28.35, dividendYield: '0.30%', eps: 10.14, high52: 306.42, low52: 140.53, avgVol: '21M'
  },
  {
    symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Discretionary', price: 220.69,
    marketCap: '2.32T', peRatio: 30.67, dividendYield: '0.00%', eps: 7.08, high52: 258.60, low52: 161.38, avgVol: '45M'
  },
  {
    symbol: 'NVDA', name: 'NVIDIA Corp.', sector: 'Technology', price: 178.88,
    marketCap: '4.4T', peRatio: 44.06, dividendYield: '0.02%', eps: 2.95, high52: 212.19, low52: 86.62, avgVol: '192M'
  },
  {
    symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Automotive', price: 385.23,
    marketCap: '1.05T', peRatio: 198.13, dividendYield: '0.00%', eps: 1.45, high52: 488.50, low52: 214.25, avgVol: '83M'
  },
  {
    symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Technology', price: 594.25,
    marketCap: '1.49T', peRatio: 26.03, dividendYield: '0.28%', eps: 22.59, high52: 796.25, low52: 442.65, avgVol: '13M'
  },
  {
    symbol: 'BRK.B', name: 'Berkshire Hathaway', sector: 'Financials', price: 504.14,
    marketCap: '1.09T', peRatio: 16.02, dividendYield: '0.00%', eps: 31.28, high52: 542.07, low52: 440.10, avgVol: '6M'
  },
  {
    symbol: 'LLY', name: 'Eli Lilly and Co', sector: 'Healthcare', price: 1059.70,
    marketCap: '1.00T', peRatio: 51.60, dividendYield: '0.56%', eps: 23.68, high52: 1066.65, low52: 623.78, avgVol: '4M'
  },
  {
    symbol: 'V', name: 'Visa Inc.', sector: 'Financials', price: 327.98,
    marketCap: '632B', peRatio: 32.05, dividendYield: '0.83%', eps: 10.22, high52: 375.51, low52: 299.00, avgVol: '9M'
  },
  {
    symbol: 'JPM', name: 'JPMorgan Chase', sector: 'Financials', price: 298.02,
    marketCap: '826B', peRatio: 14.75, dividendYield: '2.00%', eps: 20.19, high52: 322.25, low52: 202.16, avgVol: '9.5M'
  },
  {
    symbol: 'WMT', name: 'Walmart Inc.', sector: 'Retail', price: 105.32,
    marketCap: '839B', peRatio: 36.83, dividendYield: '0.89%', eps: 2.86, high52: 109.58, low52: 79.81, avgVol: '29M'
  },
  {
    symbol: 'MA', name: 'Mastercard Inc.', sector: 'Financials', price: 540.40,
    marketCap: '499B', peRatio: 34.85, dividendYield: '0.55%', eps: 15.66, high52: 600.98, low52: 463.61, avgVol: '2.3M'
  },
  {
    symbol: 'PG', name: 'Procter & Gamble', sector: 'Consumer Staples', price: 150.92,
    marketCap: '364B', peRatio: 23.92, dividendYield: '2.74%', eps: 6.53, high52: 180.43, low52: 149.91, avgVol: '8.2M'
  },
  {
    symbol: 'ORCL', name: 'Oracle Corp.', sector: 'Technology', price: 198.76,
    marketCap: '643B', peRatio: 44.77, dividendYield: '0.86%', eps: 4.33, high52: 345.72, low52: 117.98, avgVol: '14M'
  },
  {
    symbol: 'ADBE', name: 'Adobe Inc.', sector: 'Technology', price: 324.51,
    marketCap: '130B', peRatio: 19.50, dividendYield: '0.00%', eps: 16.05, high52: 557.90, low52: 311.58, avgVol: '3.6M'
  },
  {
    symbol: 'KO', name: 'Coca-Cola Co', sector: 'Consumer Staples', price: 72.87,
    marketCap: '305B', peRatio: 24.16, dividendYield: '2.80%', eps: 3.03, high52: 74.38, low52: 60.62, avgVol: '13M'
  },
  {
    symbol: 'PEP', name: 'PepsiCo Inc.', sector: 'Consumer Staples', price: 147.14,
    marketCap: '255B', peRatio: 27.84, dividendYield: '2.51%', eps: 5.27, high52: 196.88, low52: 127.60, avgVol: '4.2M'
  },
  {
    symbol: 'COST', name: 'Costco Wholesale', sector: 'Retail', price: 899.01,
    marketCap: '395B', peRatio: 49.05, dividendYield: '0.50%', eps: 18.21, high52: 1078.24, low52: 793.00, avgVol: '2M'
  },
  {
    symbol: 'MCD', name: 'McDonald\'s Corp.', sector: 'Consumer Discretionary', price: 309.35,
    marketCap: '213B', peRatio: 25.92, dividendYield: '2.10%', eps: 11.72, high52: 326.32, low52: 230.58, avgVol: '2.5M'
  },
  {
    symbol: 'CSCO', name: 'Cisco Systems', sector: 'Technology', price: 57.85,
    marketCap: '297B', peRatio: 19.57, dividendYield: '2.10%', eps: 1.00, high52: 80.06, low52: 52.11, avgVol: '20M'
  },
  {
    symbol: 'CRM', name: 'Salesforce Inc.', sector: 'Technology', price: 227.88,
    marketCap: '214B', peRatio: 32.78, dividendYield: '0.68%', eps: 6.87, high52: 369.00, low52: 221.96, avgVol: '7M'
  },
  {
    symbol: 'AMD', name: 'Adv. Micro Devices', sector: 'Technology', price: 203.78,
    marketCap: '331B', peRatio: 101.82, dividendYield: '0.00%', eps: 2.04, high52: 267.08, low52: 76.48, avgVol: '30M'
  },
  {
    symbol: 'INTC', name: 'Intel Corp.', sector: 'Technology', price: 34.50,
    marketCap: '149B', peRatio: 585.17, dividendYield: '0.00%', eps: 0.06, high52: 42.48, low52: 17.67, avgVol: '89M'
  },
  {
    symbol: 'NFLX', name: 'Netflix Inc.', sector: 'Communication', price: 104.31,
    marketCap: '448B', peRatio: 43.13, dividendYield: '0.00%', eps: 23.46, high52: 448.65, low52: 82.11, avgVol: '7M'
  },
  // Exchanges / Indices - Using placeholders for fundamentals as they are indices
  {
    symbol: '^NYSE', name: 'NYSE Composite', sector: 'Index', price: 21176.98,
    marketCap: '-', peRatio: 0, dividendYield: '-', eps: 0, high52: 0, low52: 0, avgVol: '-'
  },
  {
    symbol: '^DJI', name: 'Dow Jones Industrial', sector: 'Index', price: 46245.41,
    marketCap: '-', peRatio: 0, dividendYield: '-', eps: 0, high52: 0, low52: 0, avgVol: '-'
  },
  {
    symbol: '000001.SS', name: 'Shanghai Composite', sector: 'Index', price: 3834.89,
    marketCap: '-', peRatio: 0, dividendYield: '-', eps: 0, high52: 0, low52: 0, avgVol: '-'
  },
  {
    symbol: '^N225', name: 'Nikkei 225', sector: 'Index', price: 48625.88,
    marketCap: '-', peRatio: 0, dividendYield: '-', eps: 0, high52: 0, low52: 0, avgVol: '-'
  },
  {
    symbol: '^BSESN', name: 'BSE SENSEX', sector: 'Index', price: 85232.00,
    marketCap: '-', peRatio: 0, dividendYield: '-', eps: 0, high52: 0, low52: 0, avgVol: '-'
  },
];

// Accurate historical data points for fallback (approximate for demo)
const HISTORICAL_TRENDS: Record<string, { [key: string]: number[] }> = {
  'AAPL': {
    '1D': [270.5, 271.2, 270.8, 271.5, 272.1, 271.8, 271.49],
    '1Y': [190, 185, 170, 175, 180, 200, 210, 220, 230, 250, 260, 271.49],
    '5Y': [130, 145, 150, 170, 190, 271.49]
  },
  'NVDA': {
    '1D': [175.2, 176.5, 177.8, 178.1, 179.5, 178.88],
    '1Y': [50, 60, 75, 90, 120, 135, 150, 160, 170, 178.88],
    '5Y': [15, 30, 60, 120, 150, 178.88]
  },
  // Default trend for others
  'DEFAULT': {
    '1D': [100, 100.5, 100.2, 101.0, 100.8, 101.2],
    '1Y': [80, 85, 90, 88, 92, 95, 98, 100, 102, 105],
    '5Y': [50, 60, 70, 80, 90, 105]
  }
};

export const getRealStockHistory = async (symbol: string, range: TimeRange = '1D'): Promise<{ time: string; value: number }[]> => {
  try {
    // Attempt to fetch from Yahoo Finance (unofficial public endpoint)
    // Note: This is prone to CORS/Rate Limiting, so we have a robust fallback.
    const intervalMap: Record<string, string> = {
      '1D': '5m', '1W': '15m', '1M': '1d', '3M': '1d', '6M': '1d', '1Y': '1wk', '5Y': '1mo'
    };
    const rangeMap: Record<string, string> = {
      '1D': '1d', '1W': '5d', '1M': '1mo', '3M': '3mo', '6M': '6mo', '1Y': '1y', '5Y': '5y'
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout

    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=${rangeMap[range]}&interval=${intervalMap[range]}`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const result = data.chart.result[0];
      const timestamps = result.timestamp;
      const quotes = result.indicators.quote[0].close;

      // Validate data length - if we get too few points, it's likely a default/error response
      if (!timestamps || timestamps.length < 5) {
        throw new Error("Insufficient data points from API");
      }

      // Validate time span for long ranges
      const startTime = timestamps[0];
      const endTime = timestamps[timestamps.length - 1];
      const durationDays = (endTime - startTime) / (24 * 60 * 60);

      if (range === '5Y' && durationDays < 365 * 2) {
        throw new Error("API returned insufficient history for 5Y range");
      }
      if (range === '1Y' && durationDays < 180) {
        throw new Error("API returned insufficient history for 1Y range");
      }

      return timestamps.map((t: number, i: number) => ({
        time: new Date(t * 1000).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: range === '1D' ? '2-digit' : undefined,
          minute: range === '1D' ? '2-digit' : undefined
        }),
        value: parseFloat((quotes[i] || 0).toFixed(2))
      })).filter((p: { value: number; }) => p.value > 0); // Filter nulls
    } else {
      throw new Error(`API returned status ${response.status}`);
    }
  } catch (err) {
    // console.warn(`Failed to fetch real history for ${symbol}, using fallback.`, err);
  }

  // Fallback: Generate realistic looking data based on the stock's current price and defined trends
  const stock = STOCK_DB.find(s => s.symbol === symbol);
  const currentPrice = stock ? stock.price : 100;
  const trendKey = HISTORICAL_TRENDS[symbol] ? symbol : 'DEFAULT';
  const baseTrend = HISTORICAL_TRENDS[trendKey][range] || HISTORICAL_TRENDS[trendKey]['1Y']; // Default to 1Y if range missing

  // Scale the trend to match current price
  const lastVal = baseTrend[baseTrend.length - 1];
  const scale = currentPrice / lastVal;

  // Interpolate to get more points for smoother chart
  const points = range === '1D' ? 20 : 50;
  const history = [];
  const now = new Date();

  for (let i = 0; i < points; i++) {
    // Map i to index in baseTrend
    const trendIndex = (i / (points - 1)) * (baseTrend.length - 1);
    const idxLow = Math.floor(trendIndex);
    const idxHigh = Math.ceil(trendIndex);
    const ratio = trendIndex - idxLow;

    const valLow = baseTrend[idxLow];
    const valHigh = baseTrend[idxHigh] || valLow;
    const interpolated = valLow + (valHigh - valLow) * ratio;

    // Add some random noise
    const noise = (Math.random() - 0.5) * (currentPrice * 0.02);

    let timeLabel = '';
    const date = new Date(now.getTime());

    // Calculate offset: 0 for the last point (i = points - 1), increasing for earlier points
    const offset = points - 1 - i;

    if (range === '1D') {
      date.setMinutes(date.getMinutes() - offset * 15);
      timeLabel = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else {
      // Calculate interval based on range
      let daysToSubtract = 1;
      if (range === '1W') daysToSubtract = 1; // ~50 days total
      if (range === '1M') daysToSubtract = 1; // ~50 days total
      if (range === '3M') daysToSubtract = 2; // ~100 days total
      if (range === '6M') daysToSubtract = 4; // ~200 days total
      if (range === '1Y') daysToSubtract = 7; // ~1 year total
      if (range === '5Y') daysToSubtract = 35; // ~5 years total

      date.setDate(date.getDate() - offset * daysToSubtract);
      timeLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    history.push({
      time: timeLabel,
      value: parseFloat((interpolated * scale + noise).toFixed(2))
    });
  }

  return history;
};

export const searchStocks = async (query: string): Promise<SearchResult[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  if (!query) return [];

  const lowerQuery = query.toLowerCase();
  return STOCK_DB.filter(s =>
    s.symbol.toLowerCase().includes(lowerQuery) ||
    s.name.toLowerCase().includes(lowerQuery)
  ).map(s => {
    const change = (Math.random() - 0.5);
    return {
      symbol: s.symbol,
      name: s.name,
      price: s.price,
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
    };
  });
};

export const getStockDetails = async (symbol: string): Promise<Stock> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const stock = STOCK_DB.find(s => s.symbol === symbol);
  if (!stock) throw new Error('Stock not found');

  const changePercent = (Math.random() * 4) - 1.5; // Random daily movement
  const change = stock.price * (changePercent / 100);

  // Get 1D history by default
  const history = await getRealStockHistory(symbol, '1D');

  return {
    symbol: stock.symbol,
    name: stock.name,
    price: stock.price,
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2)),
    previousClose: parseFloat((stock.price - change).toFixed(2)),
    marketCap: stock.marketCap,
    volume: stock.avgVol, // Using avgVol as a proxy for current volume for consistency
    peRatio: stock.peRatio,
    sector: stock.sector,
    description: `${stock.name} is a leading global company in the ${stock.sector} sector, known for its innovation and strong market presence.`,
    history: history,
  };
};

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  summary: string;
  url: string;
}

export interface Fundamentals {
  marketCap: string;
  peRatio: number;
  dividendYield: string;
  eps: number;
  high52Week: number;
  low52Week: number;
  volume: string;
  avgVolume: string;
}

export const getCompanyNews = async (symbol: string): Promise<NewsItem[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));

  const stock = STOCK_DB.find(s => s.symbol === symbol);
  const name = stock ? stock.name : symbol;

  return [
    {
      id: '1',
      title: `${name} Reports Strong Quarterly Earnings`,
      source: 'Financial Times',
      time: '2h ago',
      summary: `${name} exceeded analyst expectations with a 15% increase in revenue year-over-year, driven by strong demand in key sectors.`,
      url: `https://finance.yahoo.com/quote/${symbol}`
    },
    {
      id: '2',
      title: `Analyst Upgrades ${symbol} to Buy`,
      source: 'MarketWatch',
      time: '5h ago',
      summary: `Leading analysts have upgraded their price target for ${name}, citing improved operational efficiency and market share gains.`,
      url: `https://www.marketwatch.com/investing/stock/${symbol}`
    },
    {
      id: '3',
      title: `${name} Announces New Strategic Partnership`,
      source: 'Reuters',
      time: '1d ago',
      summary: `In a move to expand its global footprint, ${name} has partnered with a major tech firm to develop next-gen solutions.`,
      url: `https://www.reuters.com/search/news?blob=${symbol}`
    },
    {
      id: '4',
      title: `Market Volatility Impacts ${symbol} Stock Price`,
      source: 'Bloomberg',
      time: '2d ago',
      summary: `Shares of ${name} saw a slight dip amidst broader market volatility, though fundamentals remain strong according to experts.`,
      url: `https://www.bloomberg.com/quote/${symbol}:US`
    }
  ];
};

export const getFundamentals = async (symbol: string): Promise<Fundamentals> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const stock = STOCK_DB.find(s => s.symbol === symbol);
  if (!stock) throw new Error('Stock not found');

  return {
    marketCap: stock.marketCap,
    peRatio: stock.peRatio,
    dividendYield: stock.dividendYield,
    eps: stock.eps,
    high52Week: stock.high52,
    low52Week: stock.low52,
    volume: stock.avgVol,
    avgVolume: stock.avgVol,
  };
};
