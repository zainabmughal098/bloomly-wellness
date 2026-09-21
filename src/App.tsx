import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { BottomNav } from './components/common/BottomNav';
import { Confetti } from './components/common/Confetti';
import { QuickAddModal } from './components/common/QuickAddModal';
import { WeeklyWrappedModal } from './components/wrapped/WeeklyWrappedModal';
import { SettingsProfileModal } from './components/settings/SettingsProfileModal';
import { OnboardingModal } from './components/onboarding/OnboardingModal';

// Feature Pages
import { TodayDashboard } from './components/dashboard/TodayDashboard';
import { RoutineManager } from './components/routine/RoutineManager';
import { HabitTracker } from './components/habits/HabitTracker';
import { WaterTracker } from './components/water/WaterTracker';
import { MealTracker } from './components/meals/MealTracker';
import { MovementTracker } from './components/movement/MovementTracker';
import { SleepTracker } from './components/sleep/SleepTracker';
import { MoodTracker } from './components/mood/MoodTracker';
import { BloomGarden } from './components/garden/BloomGarden';
import { InsightsPage } from './components/insights/InsightsPage';

const AppContent: React.FC = () => {
  const { activeTab, showConfetti, isLoading, isSettingsOpen, setIsSettingsOpen } = useApp();

  // If activeTab is set to profile from anywhere, open the Profile & Settings modal
  useEffect(() => {
    if (activeTab === 'profile' && !isSettingsOpen) {
      setIsSettingsOpen(true);
    }
  }, [activeTab, isSettingsOpen, setIsSettingsOpen]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#1E1B18] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="text-4xl animate-bounce">🌷</div>
          <p className="font-display font-bold text-sm text-[#2D2A26] dark:text-[#F3EDE2]">
            Bloomly is awakening...
          </p>
        </div>
      </div>
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'today':
        return <TodayDashboard />;
      case 'routine':
        return <RoutineManager />;
      case 'habits':
        return <HabitTracker />;
      case 'water':
        return <WaterTracker />;
      case 'meals':
        return <MealTracker />;
      case 'movement':
        return <MovementTracker />;
      case 'sleep':
        return <SleepTracker />;
      case 'mood':
        return <MoodTracker />;
      case 'garden':
        return <BloomGarden />;
      case 'insights':
        return <InsightsPage />;
      default:
        return <TodayDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#1E1B18] text-[#2D2A26] dark:text-[#F3EDE2] flex flex-col font-sans transition-colors duration-200">
      {/* 100% Bloom Celebration Confetti */}
      <Confetti active={showConfetti} />

      {/* Global Header */}
      <Header />

      {/* Main Layout: Sidebar on Desktop + Content Area */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 gap-6">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Dynamic Main Workspace */}
        <main className="flex-1 min-w-0 max-w-4xl mx-auto pb-24 lg:pb-8">
          {renderActiveTab()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Modals & Overlays */}
      <QuickAddModal />
      <WeeklyWrappedModal />
      <SettingsProfileModal />
      <OnboardingModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
