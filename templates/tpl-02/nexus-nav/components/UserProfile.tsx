import React from 'react';
import { User } from 'lucide-react';

const UserProfile: React.FC = () => {
  return (
    <div className="relative group ml-2">
      <button className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 text-slate-600 dark:text-slate-300 ring-2 ring-transparent hover:ring-primary transition-all duration-300 overflow-hidden">
        <User size={20} />
      </button>
      
      {/* Simple Profile Dropdown */}
      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-100 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700">
          <p className="text-sm font-semibold text-slate-800 dark:text-white">John Doe</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">admin@nexus.com</p>
        </div>
        <div className="py-1">
          <a href="#" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">Profile</a>
          <a href="#" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">Settings</a>
          <a href="#" className="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">Sign out</a>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
