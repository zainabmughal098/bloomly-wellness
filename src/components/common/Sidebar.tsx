import React from 'react';
import { useApp, NavigationTab } from '../../context/AppContext';
import { 
  Home, 
  CheckSquare, 
  Droplet, 
  Utensils, 
  Activity, 
  Moon, 
  Smile, 
  Flower2, 
  BarChart3, 
  User, 
  Plus,
  Heart
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, todayBloom, setIsQuickAddOpen, isSettingsOpen, setIsSettingsOpen } = useApp();

  const navItems: { id: NavigationTab; label: string; icon: React.ComponentType<{ className?: string }>; colorClass: string }[] = [
    { id: 'today', label: 'Today', icon: Home, colorClass: 'text-rose-500' },
    { id: 'routine', label: 'Routines', icon: CheckSquare, colorClass: 'text-emerald-500' },
    { id: 'water', label: 'Water', icon: Droplet, colorClass: 'text-sky-500' },
    { id: 'meals', label: 'Meals', icon: Utensils, colorClass: 'text-amber-500' },
    { id: 'movement', label: 'Movement', icon: Activity, colorClass: 'text-orange-500' },
    { id: 'sleep', label: 'Sleep', icon: Moon, colorClass: 'text-indigo-400' },
    { id: 'mood', label: 'Mood', icon: Smile, colorClass: 'text-violet-400' },
    { id: 'garden', label: 'Bloom Garden', icon: Flower2, colorClass: 'text-rose-400' },
    { id: 'insights', label: 'Insights', icon: BarChart3, colorClass: 'text-teal-500' },
    { id: 'profile', label: 'Profile & Settings', icon: User, colorClass: 'text-slate-500' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-[#FAF7F2] dark:bg-[#1E1B18] border-r border-[#EFE8DD] dark:border-[#2D2823] p-4 min-h-[calc(100vh-61px)] sticky top-[61px] transition-colors">
      {/* Quick Add CTA Button */}
      <button
        onClick={() => setIsQuickAddOpen(true)}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-semibold py-2.5 px-4 rounded-xl shadow-xs hover:shadow-md transition-all active:scale-98 cursor-pointer mb-5 text-sm"
      >
        <Plus className="w-4 h-4" />
        Quick Log
      </button>

      {/* Navigation list */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === 'profile' ? isSettingsOpen : (activeTab === item.id && !isSettingsOpen);
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'profile') {
                  setIsSettingsOpen(true);
                } else {
                  setActiveTab(item.id);
                  if (isSettingsOpen) setIsSettingsOpen(false);
                }
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-white dark:bg-[#2A2520] text-[#2D2A26] dark:text-[#F3EDE2] shadow-2xs font-semibold border border-[#EFE8DD] dark:border-[#38322B]'
                  : 'text-[#6B6158] dark:text-[#A89E94] hover:bg-white/60 dark:hover:bg-[#25201C] hover:text-[#2D2A26] dark:hover:text-[#F3EDE2]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? item.colorClass : 'text-[#8C827A] dark:text-[#948A80]'}`} />
              <span>{item.label}</span>
              {item.id === 'garden' && (
                <span className="ml-auto text-[10px] bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 font-semibold px-2 py-0.5 rounded-full">
                  Garden
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Mini Bloom Score Card in Sidebar footer */}
      <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-br from-rose-50/80 to-amber-50/50 dark:from-[#26201B] dark:to-[#221D19] border border-rose-100 dark:border-rose-950/60">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-[#5A5047] dark:text-[#C5BDB3] flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            Today's Bloom
          </span>
          <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
            {todayBloom.score}%
          </span>
        </div>
        <div className="w-full bg-rose-100/70 dark:bg-rose-950/50 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-rose-400 to-rose-500 h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${todayBloom.score}%` }}
          />
        </div>
        <p className="text-[11px] text-[#8C827A] dark:text-[#9E948A] mt-2 italic line-clamp-1">
          {todayBloom.score >= 80 ? 'Bloomed gorgeously 🌷' : 'Growing step by step 🌱'}
        </p>
      </div>
    </aside>
  );
};
