import React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { MenuItemType } from '../types';

interface MenuItemProps {
  item: MenuItemType;
  depth?: number;
  isMobile?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, depth = 0, isMobile = false }) => {
  const hasChildren = item.children && item.children.length > 0;

  // Render logic for Mobile (Vertical Stack) vs Desktop (Horizontal/Dropdown)
  if (isMobile) {
    return (
      <div className="w-full">
        <div className={`
          flex items-center justify-between px-4 py-3 
          text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800
          cursor-pointer transition-colors border-l-4 border-transparent hover:border-primary
          ${depth > 0 ? 'pl-8 text-sm' : 'font-medium'}
        `}>
          <div className="flex items-center gap-3">
            {item.icon && <span className="text-slate-400">{item.icon}</span>}
            <span>{item.label}</span>
          </div>
          {hasChildren && <ChevronDown size={14} />}
        </div>
        {/* For mobile, we just render children flat below for simplicity in this specific "stack" request */}
        {hasChildren && (
          <div className="bg-slate-50 dark:bg-slate-900/50">
            {item.children?.map(child => (
              <MenuItem key={child.id} item={child} depth={depth + 1} isMobile={true} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Desktop View
  return (
    <div className="group relative">
      <a
        href={item.href || '#'}
        className={`
          flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
          ${depth === 0 
            ? 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800' 
            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 w-full justify-between'
          }
        `}
      >
        <div className="flex items-center gap-2">
          {depth === 0 && item.icon}
          <span>{item.label}</span>
        </div>
        {hasChildren && (
          depth === 0 ? <ChevronDown size={14} className="opacity-70" /> : <ChevronRight size={14} className="opacity-70" />
        )}
      </a>

      {/* Submenu Dropdown */}
      {hasChildren && (
        <div className={`
          absolute z-50 invisible opacity-0 translate-y-2 group-hover:translate-y-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 ease-out
          min-w-[200px] bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-100 dark:border-slate-700 p-1
          ${depth === 0 ? 'top-full left-0 mt-1' : 'top-0 left-full ml-1'}
        `}>
          {item.children?.map(child => (
            <MenuItem key={child.id} item={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuItem;
