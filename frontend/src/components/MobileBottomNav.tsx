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
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-colors min-w-0 ${
                isActive ? 'text-green-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-green-600' : ''}`} />
              <span className="text-xs font-medium truncate">{item.label}</span>
              {isActive && <span className="w-1 h-1 bg-green-600 rounded-full" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
