import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, CheckSquare, Plus, BarChart3, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    setIsQuickAddOpen, 
    isSettingsOpen, 
    setIsSettingsOpen 
  } = useApp();

  const handleTabClick = (tab: 'today' | 'routine' | 'insights') => {
    if (isSettingsOpen) {
      setIsSettingsOpen(false);
    }
    setActiveTab(tab);
  };

  const handleProfileClick = () => {
    setIsSettingsOpen(true);
  };

  const isTodayActive = activeTab === 'today' && !isSettingsOpen;
  const isRoutineActive = activeTab === 'routine' && !isSettingsOpen;
  const isInsightsActive = activeTab === 'insights' && !isSettingsOpen;
  const isProfileActive = isSettingsOpen || activeTab === 'profile';

  return (
    <nav 
      id="mobile_bottom_nav"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 dark:bg-[#1E1B18]/95 backdrop-blur-xl border-t border-[#EFE8DD] dark:border-[#2D2823] px-2 pt-1 shadow-lg transition-colors select-none"
      style={{ paddingBottom: 'max(0.6rem, env(safe-area-inset-bottom))' }}
      aria-label="Mobile Bottom Navigation"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* 1. Today */}
        <button
          id="mobile_nav_today"
          onClick={() => handleTabClick('today')}
          className={`flex flex-col items-center justify-center min-w-[48px] sm:min-w-[56px] py-1 px-1 sm:px-1.5 rounded-xl transition-all cursor-pointer ${
            isTodayActive
              ? 'text-rose-600 dark:text-rose-400 font-semibold scale-105'
              : 'text-[#8C827A] dark:text-[#9E948A] hover:text-[#5A5047] dark:hover:text-[#D9D0C5]'
          }`}
          aria-current={isTodayActive ? 'page' : undefined}
        >
          <div className="relative">
            <Home className="w-5 h-5" />
            {isTodayActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-rose-500 rounded-full" />
            )}
          </div>
          <span className="text-[10px] sm:text-[11px] leading-tight mt-0.5 tracking-tight whitespace-nowrap">Today</span>
        </button>

        {/* 2. Routine */}
        <button
          id="mobile_nav_routine"
          onClick={() => handleTabClick('routine')}
          className={`flex flex-col items-center justify-center min-w-[48px] sm:min-w-[56px] py-1 px-1 sm:px-1.5 rounded-xl transition-all cursor-pointer ${
            isRoutineActive
              ? 'text-rose-600 dark:text-rose-400 font-semibold scale-105'
              : 'text-[#8C827A] dark:text-[#9E948A] hover:text-[#5A5047] dark:hover:text-[#D9D0C5]'
          }`}
          aria-current={isRoutineActive ? 'page' : undefined}
        >
          <div className="relative">
            <CheckSquare className="w-5 h-5" />
            {isRoutineActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-rose-500 rounded-full" />
            )}
          </div>
          <span className="text-[10px] sm:text-[11px] leading-tight mt-0.5 tracking-tight whitespace-nowrap">Routine</span>
        </button>

        {/* 3. Center Quick Log Action (Visually Emphasized) */}
        <div className="flex flex-col items-center justify-center relative -top-3 px-0.5 sm:px-1">
          <button
            id="mobile_nav_quick_log"
            onClick={() => setIsQuickAddOpen(true)}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-rose-500 to-rose-400 text-white flex items-center justify-center shadow-lg shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 dark:focus:ring-offset-[#1E1B18]"
            aria-label="Quick Log Activity"
          >
            <Plus className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
          </button>
          <span className="text-[9px] sm:text-[10px] font-semibold text-[#7C7268] dark:text-[#A89E94] mt-0.5 tracking-tight whitespace-nowrap">
            Quick Log
          </span>
        </div>

        {/* 4. Insights */}
        <button
          id="mobile_nav_insights"
          onClick={() => handleTabClick('insights')}
          className={`flex flex-col items-center justify-center min-w-[48px] sm:min-w-[56px] py-1 px-1 sm:px-1.5 rounded-xl transition-all cursor-pointer ${
            isInsightsActive
              ? 'text-rose-600 dark:text-rose-400 font-semibold scale-105'
              : 'text-[#8C827A] dark:text-[#9E948A] hover:text-[#5A5047] dark:hover:text-[#D9D0C5]'
          }`}
          aria-current={isInsightsActive ? 'page' : undefined}
        >
          <div className="relative">
            <BarChart3 className="w-5 h-5" />
            {isInsightsActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-rose-500 rounded-full" />
            )}
          </div>
          <span className="text-[10px] sm:text-[11px] leading-tight mt-0.5 tracking-tight whitespace-nowrap">Insights</span>
        </button>

        {/* 5. Profile & Settings */}
        <button
          id="mobile_nav_profile"
          onClick={handleProfileClick}
          className={`flex flex-col items-center justify-center min-w-[48px] sm:min-w-[56px] py-1 px-1 sm:px-1.5 rounded-xl transition-all cursor-pointer ${
            isProfileActive
              ? 'text-rose-600 dark:text-rose-400 font-semibold scale-105'
              : 'text-[#8C827A] dark:text-[#9E948A] hover:text-[#5A5047] dark:hover:text-[#D9D0C5]'
          }`}
          aria-current={isProfileActive ? 'page' : undefined}
        >
          <div className="relative">
            <User className="w-5 h-5" />
            {isProfileActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-rose-500 rounded-full" />
            )}
          </div>
          <span className="text-[10px] sm:text-[11px] leading-tight mt-0.5 tracking-tight whitespace-nowrap">Profile</span>
        </button>
      </div>
    </nav>
  );
};
