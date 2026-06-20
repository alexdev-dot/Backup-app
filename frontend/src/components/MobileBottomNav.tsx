import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface MobileBottomNavProps {
  items: NavItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ items, activeTab, onTabChange }) => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 px-2 pb-safe">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center gap-1 py-3 px-4 rounded-2xl transition-all duration-200 min-w-0 ${
                isActive 
                  ? 'text-green-600 bg-green-50 scale-105 shadow-md' 
                  : 'text-slate-600 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              <Icon className={`w-6 h-6 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
              <span className="text-xs font-medium truncate">{item.label}</span>
              {isActive && <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-0.5" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
