import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full transition-all duration-300 hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-600 dark:text-slate-300"
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <Sun size={20} className="hover:text-yellow-400 transition-colors" />
      ) : (
        <Moon size={20} className="hover:text-primary transition-colors" />
      )}
    </button>
  );
};

export default ThemeToggle;
