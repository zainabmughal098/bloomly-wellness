import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Sun, Moon, Calendar, RefreshCw, Layers, User } from 'lucide-react';
import { getTodayDateString } from '../../data/initialData';

export const Header: React.FC = () => {
  const {
    selectedDate,
    setSelectedDate,
    isToday,
    preferences,
    theme,
    toggleTheme,
    setIsWeeklyWrappedOpen,
    isDemoMode,
    loadDemoMode,
    resetToFresh,
    setActiveTab,
    setIsSettingsOpen
  } = useApp();

  const formattedDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F2]/90 dark:bg-[#1E1B18]/90 backdrop-blur-md border-b border-[#EFE8DD] dark:border-[#2D2823] px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Brand / Title */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('today')}
            className="flex items-center gap-2 group text-left focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-200 to-rose-100 dark:from-rose-950 dark:to-rose-900/60 border border-rose-200/60 dark:border-rose-800/40 flex items-center justify-center text-xl shadow-xs group-hover:scale-105 transition-transform">
              🌷
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-lg sm:text-xl text-[#2D2A26] dark:text-[#F3EDE2] tracking-tight">
                  Bloomly
                </span>
                {isDemoMode && (
                  <span className="text-[10px] uppercase font-semibold tracking-wider bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded-md border border-amber-200 dark:border-amber-800/50">
                    Demo Mode
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#8C827A] dark:text-[#A89E94] hidden sm:block">
                Daily Wellness Companion
              </p>
            </div>
          </button>
        </div>

        {/* Center: Date Selector / Current Day */}
        <div className="flex items-center gap-1.5 bg-white/70 dark:bg-[#282420]/80 border border-[#EFE8DD] dark:border-[#38322B] px-3 py-1.5 rounded-full shadow-2xs">
          <Calendar className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
            className="bg-transparent text-xs font-medium text-[#4A443F] dark:text-[#D9D0C5] focus:outline-none cursor-pointer"
            title="Change selected day"
          />
          {!isToday && (
            <button
              onClick={() => setSelectedDate(getTodayDateString())}
              className="ml-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:underline bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full"
            >
              Back to Today
            </button>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Demo Toggle (Essential for portfolio reviewers) */}
          <div className="hidden md:flex items-center gap-1">
            {isDemoMode ? (
              <button
                onClick={resetToFresh}
                className="text-xs font-medium text-[#7C7268] dark:text-[#A89E94] hover:text-rose-600 dark:hover:text-rose-400 bg-white/80 dark:bg-[#282420] border border-[#EFE8DD] dark:border-[#38322B] px-2.5 py-1.5 rounded-lg hover:border-rose-300 transition-all flex items-center gap-1.5"
                title="Clear demo data and start fresh"
              >
                <RefreshCw className="w-3 h-3" />
                Start Fresh
              </button>
            ) : (
              <button
                onClick={loadDemoMode}
                className="text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-1.5 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all flex items-center gap-1.5"
                title="Populate with 14 days of realistic wellness data"
              >
                <Layers className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                Try Demo Data
              </button>
            )}
          </div>

          {/* Weekly Wrapped Button */}
          <button
            onClick={() => setIsWeeklyWrappedOpen(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-rose-100 to-amber-100 dark:from-rose-950/60 dark:to-amber-950/60 border border-rose-200/80 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 px-3 py-1.5 rounded-full text-xs font-semibold hover:shadow-xs transition-all cursor-pointer"
            title="Open Weekly Wrapped celebration"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span className="hidden sm:inline">Weekly Wrapped</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-[#6E645B] dark:text-[#BDB1A4] hover:bg-white/80 dark:hover:bg-[#2A2520] border border-[#EFE8DD] dark:border-[#38322B] transition-colors focus:outline-none cursor-pointer"
            aria-label="Toggle light/dark theme"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-slate-700" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Profile & Settings Button */}
          <button
            id="header_profile_btn"
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-full text-[#6E645B] dark:text-[#BDB1A4] hover:bg-white/80 dark:hover:bg-[#2A2520] border border-[#EFE8DD] dark:border-[#38322B] transition-colors focus:outline-none cursor-pointer"
            aria-label="Open Profile & Settings"
            title="Profile & Settings"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
