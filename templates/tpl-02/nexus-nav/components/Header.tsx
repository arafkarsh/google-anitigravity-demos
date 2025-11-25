import React from 'react';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import UserProfile from './UserProfile';
import Navigation from './Navigation';
import { MENU_ITEMS } from '../constants';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className="h-16 px-4 md:px-6 flex items-center justify-between max-w-[1920px] mx-auto">
        
        {/* Left Section: Logo */}
        <div className="flex-shrink-0 z-20">
          <Logo />
        </div>

        {/* Middle Section: Dynamic Navigation */}
        {/* Navigation handles its own width and overflow logic */}
        <Navigation items={MENU_ITEMS} />

        {/* Right Section: Actions */}
        <div className="flex items-center gap-2 flex-shrink-0 z-20 pl-4 border-l border-slate-200 dark:border-slate-800">
          <ThemeToggle />
          <UserProfile />
        </div>

      </div>
    </header>
  );
};

export default Header;
