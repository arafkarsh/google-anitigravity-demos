import React from 'react';
import { Menu, Moon, Sun, Bell, User, Search, MessageSquare } from 'lucide-react';

interface TopBarProps {
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  isRightOpen: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ 
  toggleLeftSidebar, 
  toggleRightSidebar, 
  isRightOpen, 
  theme, 
  toggleTheme 
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-border z-50 px-4 flex items-center justify-between transition-colors duration-300">
      
      {/* Left Section: Logo & Toggle */}
      <div className="flex items-center gap-4">
        <button 
            onClick={toggleLeftSidebar}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
            <Menu size={24} />
        </button>
        
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-primary to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/30">
                N
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 hidden sm:block">
                Nexus<span className="font-light">UI</span>
            </span>
        </div>
      </div>

      {/* Middle: Search (Hidden on mobile) */}
      <div className="hidden md:flex flex-1 max-w-md mx-4">
        <div className="relative w-full group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
            <input 
                type="text" 
                placeholder="Search resources, metrics, users..." 
                className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
            />
        </div>
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Theme Toggle */}
        <button 
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors relative overflow-hidden"
            title="Toggle Theme"
        >
            <div className={`transition-transform duration-500 rotate-0 ${theme === 'dark' ? 'rotate-90 scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
               <Sun size={20} />
            </div>
            <div className={`absolute inset-0 flex items-center justify-center transition-transform duration-500 ${theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`}>
               <Moon size={20} />
            </div>
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
        </button>

        {/* Chat Toggle */}
         <button 
            onClick={toggleRightSidebar}
            className={`
                p-2 rounded-full transition-all duration-300 relative
                ${isRightOpen 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'}
            `}
            title="Toggle Assistant"
        >
            <MessageSquare size={20} />
            {!isRightOpen && <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
            </span>}
        </button>

        {/* User Profile */}
        <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 p-[2px] cursor-pointer ring-offset-2 hover:ring-2 ring-primary/50 transition-all">
            <div className="h-full w-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                <img 
                    src="https://picsum.photos/200/200" 
                    alt="User" 
                    className="h-full w-full object-cover"
                />
            </div>
        </div>

      </div>
    </header>
  );
};

export default TopBar;