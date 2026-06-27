import React from 'react';
import { ME_AVATAR } from '../data/mockData';

interface TopAppBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onMobileMenuToggle: () => void;
  unreadCount: number;
}

export default function TopAppBar({ searchQuery, setSearchQuery, onMobileMenuToggle, unreadCount }: TopAppBarProps) {
  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 h-16 z-40 bg-surface-bright/80 backdrop-blur-md shadow-sm border-b border-outline-variant/15 flex justify-between items-center px-6">
      
      {/* Left side: Mobile menu toggle + Search */}
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 rounded-lg hover:bg-surface-container-high/50 text-on-surface-variant hover:text-on-surface transition-colors"
          id="mobile-menu-btn"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>
        
        {/* Search Input */}
        <div className="relative group w-full max-w-md">
          <span className="absolute inset-y-0 left-3.5 flex items-center text-outline">
            <span className="material-symbols-outlined text-[20px] transition-colors group-focus-within:text-primary">search</span>
          </span>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-low border border-transparent hover:border-outline-variant/40 rounded-full pl-10 pr-4 py-1.5 text-xs text-on-surface placeholder-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 focus:bg-surface-container-lowest transition-all"
            placeholder="Search conversations by name, role, summaries..."
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-3.5 flex items-center text-outline hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Right side: Alerts, FAQ & User profile */}
      <div className="flex items-center gap-4">
        {/* Alerts Button */}
        <div className="relative">
          <button className="p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50 transition-all cursor-pointer relative">
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full ring-2 ring-surface-bright animate-pulse"></span>
            )}
          </button>
        </div>

        {/* Info Guide */}
        <button className="p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50 transition-all cursor-pointer hidden sm:block">
          <span className="material-symbols-outlined text-[22px]">help_outline</span>
        </button>

        {/* Vertical divider */}
        <span className="h-6 w-[1px] bg-outline-variant/30 hidden sm:block"></span>

        {/* User avatar and active status */}
        <div className="flex items-center gap-2">
          <div className="h-8.5 w-8.5 rounded-full bg-primary-fixed overflow-hidden border border-primary/20 shadow-inner">
            <img 
              className="w-full h-full object-cover" 
              src={ME_AVATAR} 
              alt="User headshot"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-semibold text-on-surface">You</span>
            <span className="text-[10px] text-outline flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Online
            </span>
          </div>
        </div>
      </div>

    </header>
  );
}
