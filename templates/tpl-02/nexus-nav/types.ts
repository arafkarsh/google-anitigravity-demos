import { ReactNode } from 'react';

export interface MenuItemType {
  id: string;
  label: string;
  icon?: ReactNode; // Optional icon for the menu item
  children?: MenuItemType[];
  href?: string;
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}
