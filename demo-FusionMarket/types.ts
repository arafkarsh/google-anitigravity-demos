export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  previousClose: number;
  marketCap: string;
  volume: string;
  peRatio: number;
  sector: string;
  description: string;
  history: { time: string; value: number }[];
}

export interface SearchResult {
  symbol: string;
  name: string;
  price: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export type TimeRange = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | '5Y';
