import React, { useState, useEffect } from 'react';
import TopBar from './components/Layout/TopBar';
import LeftSidebar from './components/Layout/LeftSidebar';
import RightSidebar from './components/Layout/RightSidebar';
import MainContent from './components/Layout/MainContent';
import { Theme } from './types';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('light');
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Initialize Theme
  useEffect(() => {
    // Check system preference on load
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
    }
  }, []);

  // Apply Theme to DOM
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Handle Resize for Responsive Behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsLeftSidebarOpen(false);
        setIsRightSidebarOpen(false);
      } else {
        setIsLeftSidebarOpen(true);
      }
    };

    handleResize(); // Init
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleLeftSidebar = () => setIsLeftSidebarOpen(prev => !prev);
  const toggleRightSidebar = () => setIsRightSidebarOpen(prev => !prev);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-[#0b1120] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      <TopBar 
        toggleLeftSidebar={toggleLeftSidebar}
        toggleRightSidebar={toggleRightSidebar}
        isRightOpen={isRightSidebarOpen}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <div className="flex flex-1 pt-16 h-full overflow-hidden relative">
        
        <LeftSidebar 
            isOpen={isLeftSidebarOpen} 
            onCloseMobile={() => setIsLeftSidebarOpen(false)}
            isMobile={isMobile}
        />

        {/* Main Content Wrapper */}
        <div 
            className={`
                flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out
                ${!isMobile && isLeftSidebarOpen ? 'ml-64' : 'ml-0'}
                ${!isMobile && isRightSidebarOpen ? 'mr-80 md:mr-96' : 'mr-0'}
            `}
        >
            <MainContent />
        </div>

        <RightSidebar 
            isOpen={isRightSidebarOpen}
            onClose={() => setIsRightSidebarOpen(false)}
            isMobile={isMobile}
        />
        
      </div>
    </div>
  );
};

export default App;