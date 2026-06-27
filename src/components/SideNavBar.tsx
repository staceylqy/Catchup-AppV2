import React from 'react';

interface SideNavBarProps {
  activeTab: 'inbox' | 'tasks' | 'settings';
  setActiveTab: (tab: 'inbox' | 'tasks' | 'settings') => void;
  unreadChatsCount: number;
  incompleteTasksCount: number;
  onNewMessageClick: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export default function SideNavBar({
  activeTab,
  setActiveTab,
  unreadChatsCount,
  incompleteTasksCount,
  onNewMessageClick,
  isMobileOpen,
  onMobileClose
}: SideNavBarProps) {
  
  const navItems = [
    { id: 'inbox' as const, label: 'Inbox', icon: 'inbox', badge: unreadChatsCount },
    { id: 'tasks' as const, label: 'Task List', icon: 'checklist', badge: incompleteTasksCount },
    { id: 'settings' as const, label: 'Settings', icon: 'settings', badge: 0 }
  ];

  const handleTabClick = (tab: 'inbox' | 'tasks' | 'settings') => {
    setActiveTab(tab);
    onMobileClose();
  };

  const sidebarContent = (
    <div className="h-full flex flex-col bg-surface-container-lowest border-r border-outline-variant/20 py-6">
      {/* Brand Header */}
      <div className="px-6 mb-8 flex justify-between items-center">
        <div>
          <h1 className="font-display font-extrabold text-lg text-primary tracking-tight">CatchUp</h1>
          <p className="font-sans text-[11px] font-semibold text-on-surface-variant/70 uppercase tracking-widest mt-0.5">Message Intelligence</p>
        </div>
        {/* Mobile close button inside the drawer */}
        <button 
          onClick={onMobileClose}
          className="md:hidden p-1 rounded-full hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-[calc(100%-16px)] mx-2 flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                isActive
                  ? 'bg-primary-container text-on-primary-container font-medium scale-[0.99] shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
                  {item.icon}
                </span>
                <span className="text-xs font-display font-semibold tracking-wide">{item.label}</span>
              </div>
              
              {item.badge > 0 && (
                <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${
                  isActive 
                    ? 'bg-primary text-on-primary' 
                    : 'bg-primary-container/40 text-primary'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop Sidenav */}
      <aside className="h-screen w-64 fixed left-0 top-0 hidden md:flex flex-col z-50">
        {sidebarContent}
      </aside>

      {/* Mobile drawer backdrop */}
      {isMobileOpen && (
        <div 
          onClick={onMobileClose}
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-xs z-50 transition-opacity duration-300"
        />
      )}

      {/* Mobile drawer panel */}
      <aside 
        className={`md:hidden fixed top-0 bottom-0 left-0 w-64 bg-surface-container-lowest z-50 shadow-2xl transition-transform duration-300 transform ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
