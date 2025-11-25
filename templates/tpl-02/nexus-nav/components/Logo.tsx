import React from 'react';
import { Hexagon } from 'lucide-react';
import { APP_NAME } from '../constants';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2 cursor-pointer select-none">
      <div className="relative flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary to-secondary rounded-lg shadow-lg text-white">
        <Hexagon size={20} className="animate-pulse" strokeWidth={2.5} />
      </div>
      <span className="hidden sm:block text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary dark:from-indigo-400 dark:to-purple-400">
        {APP_NAME}
      </span>
    </div>
  );
};

export default Logo;
