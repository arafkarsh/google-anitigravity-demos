import React, { useState, useEffect, useRef } from 'react';
import { Menu, MoreVertical } from 'lucide-react';
import { MenuItemType } from '../types';
import MenuItem from './MenuItem';

interface NavigationProps {
  items: MenuItemType[];
}

const Navigation: React.FC<NavigationProps> = ({ items }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState<number>(items.length);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVerySmallScreen, setIsVerySmallScreen] = useState(false);

  // Measure available width and determine how many items fit
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      // Estimate average item width + gap. 
      // In a real app, you might measure actual rendered widths via a hidden clone.
      // Here we assume ~130px per top-level item on average including padding/gap.
      const AVG_ITEM_WIDTH = 130; 
      const MORE_BUTTON_WIDTH = 50;
      
      const maxPossible = Math.floor((containerWidth - MORE_BUTTON_WIDTH) / AVG_ITEM_WIDTH);
      
      if (maxPossible <= 0) {
        setIsVerySmallScreen(true);
        setVisibleCount(0);
      } else {
        setIsVerySmallScreen(false);
        setVisibleCount(Math.min(maxPossible, items.length));
      }
    };

    // Initial check
    handleResize();

    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [items.length]);

  const visibleItems = items.slice(0, visibleCount);
  const overflowItems = items.slice(visibleCount);
  const showMoreButton = overflowItems.length > 0;

  return (
    <div className="flex-1 flex items-center h-full pl-8 pr-4" ref={containerRef}>
      
      {/* 1. Stack Icon (Hamburger) - Only if we can't render normal menu or it's very small */}
      {isVerySmallScreen && (
        <div className="relative">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu size={24} className="text-slate-700 dark:text-slate-300" />
          </button>
          
          {/* Mobile Dropdown Overlay */}
          {isMobileMenuOpen && (
            <>
              <div 
                className="fixed inset-0 bg-black/50 z-40" 
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-lg shadow-2xl z-50 max-h-[80vh] overflow-y-auto border border-slate-200 dark:border-slate-700">
                {items.map(item => (
                  <MenuItem key={item.id} item={item} isMobile={true} />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* 2. Normal Horizontal Menu */}
      {!isVerySmallScreen && (
        <div className="flex items-center gap-1 w-full">
          {visibleItems.map(item => (
            <MenuItem key={item.id} item={item} depth={0} />
          ))}

          {/* 3. Vertical Dots (Overflow) */}
          {showMoreButton && (
            <div className="group relative ml-2">
              <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                <MoreVertical size={20} />
              </button>
              
              {/* Overflow Dropdown */}
              <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-100 dark:border-slate-700 p-1 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 z-50">
                 {overflowItems.map(item => (
                    <MenuItem key={item.id} item={item} depth={1} /> // Treat as depth 1 so it renders as a dropdown item
                 ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navigation;
