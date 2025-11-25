import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  LayoutDashboard, 
  Settings, 
  Users, 
  BarChart3, 
  ShoppingCart, 
  FileText,
  Mail,
  Calendar,
  Layers,
  HelpCircle,
  LogOut,
  X
} from 'lucide-react';
import { MenuItem } from '../../types';

// Mock Data for the Tree Menu
const MENU_ITEMS: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    children: [
      { id: 'reports', label: 'Reports', path: '/analytics/reports' },
      { id: 'realtime', label: 'Real-time', path: '/analytics/realtime' },
      { id: 'attribution', label: 'Attribution', path: '/analytics/attribution' },
    ]
  },
  {
    id: 'ecommerce',
    label: 'E-Commerce',
    icon: ShoppingCart,
    children: [
      { id: 'products', label: 'Products', path: '/ecommerce/products' },
      { id: 'orders', label: 'Orders', path: '/ecommerce/orders' },
      { id: 'customers', label: 'Customers', path: '/ecommerce/customers' },
    ]
  },
  {
    id: 'users',
    label: 'User Management',
    icon: Users,
    children: [
        { id: 'admin', label: 'Admins', path: '/users/admin'},
        { id: 'roles', label: 'Roles & Permissions', path: '/users/roles'}
    ]
  },
  {
    id: 'content',
    label: 'Content',
    icon: FileText,
    children: [
      { id: 'posts', label: 'Blog Posts', path: '/content/posts' },
      { id: 'media', label: 'Media Library', path: '/content/media' },
    ]
  },
  {
    id: 'apps',
    label: 'Applications',
    icon: Layers,
    children: [
      { id: 'mail', label: 'Mail', icon: Mail, path: '/apps/mail' },
      { id: 'calendar', label: 'Calendar', icon: Calendar, path: '/apps/calendar' },
    ]
  }
];

const FOOTER_ITEMS: MenuItem[] = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
];

interface LeftSidebarProps {
  isOpen: boolean;
  onCloseMobile: () => void;
  isMobile: boolean;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ isOpen, onCloseMobile, isMobile }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({'analytics': true});
  const [activeItem, setActiveItem] = useState<string>('dashboard');

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.children) {
      toggleExpand(item.id);
    } else {
      setActiveItem(item.id);
      if (isMobile) onCloseMobile();
    }
  };

  // Recursive Menu Item Component
  const renderMenuItem = (item: MenuItem, depth: number = 0) => {
    const Icon = item.icon;
    const isExpanded = expanded[item.id];
    const isActive = activeItem === item.id;
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id} className="select-none">
        <div
          onClick={() => handleItemClick(item)}
          className={`
            flex items-center justify-between px-4 py-3 cursor-pointer
            transition-colors duration-200
            ${isActive ? 'bg-primary/10 text-primary border-r-4 border-primary' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}
          `}
          style={{ paddingLeft: `${depth * 1 + 1}rem` }}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            {Icon && <Icon size={18} className={isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400'} />}
            <span className="text-sm font-medium truncate">{item.label}</span>
          </div>
          {hasChildren && (
            <span className="text-gray-400">
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </span>
          )}
        </div>
        
        {/* Render Children */}
        <div 
            className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          {hasChildren && item.children?.map(child => renderMenuItem(child, depth + 1))}
        </div>
      </div>
    );
  };

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-40 bg-white dark:bg-gray-900 border-r border-border
    flex flex-col
    transition-transform duration-300 ease-in-out
    w-64
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    pt-16 md:pt-16
  `;

  return (
    <>
        {/* Mobile Overlay */}
        {isMobile && isOpen && (
            <div 
                className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onCloseMobile}
            />
        )}

        <aside className={sidebarClasses}>
            {isMobile && (
                <button onClick={onCloseMobile} className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400">
                    <X size={20} />
                </button>
            )}
            
            <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
                <div className="mb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Main Menu
                </div>
                {MENU_ITEMS.map(item => renderMenuItem(item))}
                
                <div className="mt-6 mb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    System
                </div>
                {FOOTER_ITEMS.map(item => renderMenuItem(item))}
            </div>

            <div className="p-4 border-t border-border">
                <button className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors">
                    <LogOut size={18} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    </>
  );
};

export default LeftSidebar;