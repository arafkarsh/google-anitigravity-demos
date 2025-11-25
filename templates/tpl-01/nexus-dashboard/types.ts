import { LucideIcon } from "lucide-react";

// Navigation Types
export interface MenuItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  children?: MenuItem[];
  path?: string;
}

// Chat Types
export enum Sender {
  USER = 'user',
  BOT = 'bot',
  SYSTEM = 'system'
}

export interface ChatMessage {
  id: string;
  sender: Sender;
  text: string;
  timestamp: Date;
  isError?: boolean;
}

// Theme Types
export type Theme = 'light' | 'dark';

// Chart Data Types
export interface SalesData {
  name: string;
  revenue: number;
  profit: number;
  visitors: number;
}