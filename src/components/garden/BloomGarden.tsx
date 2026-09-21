import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BloomFlower } from '../common/BloomFlower';
import { FlowerType } from '../../types';
import { calculateBloomScore, getBloomStageName } from '../../utils/bloomCalculator';
import { Calendar, Sparkles, ChevronLeft, ChevronRight, Lock, Check } from 'lucide-react';

export const BloomGarden: React.FC = () => {
  const {
    preferences,
    updatePreferences,
    selectedDate,
    setSelectedDate,
    routines,
    water,
    exercise,
    meals,
    sleep,
    habits,
    mood
  } = useApp();

  const [currentMonthDate, setCurrentMonthDate] = useState(() => new Date());
  const [selectedDayDetails, setSelectedDayDetails] = useState<string | null>(selectedDate);

  // Month navigation
  const prevMonth = () => {
    setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Calendar generation for currentMonthDate
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Flower Varieties Collection
  const flowerVarieties: {
    id: FlowerType;
    name: string;
    description: string;
    requirementText: string;
    emoji: string;
    isUnlocked: boolean;
  }[] = [
    {
      id: 'tulip',
      name: 'Classic Tulip',
      description: 'Soft, gentle curves symbolizing fresh beginnings.',
      requirementText: 'Available to everyone',
      emoji: '🌷',
      isUnlocked: true,
    },
    {
      id: 'sunflower',
      name: 'Golden Sunflower',
      description: 'Radiant petals turning always toward warmth and gratitude.',
      requirementText: 'Unlocked at 7-day streak or 80%+ Bloom',
      emoji: '🌻',
      isUnlocked: true, // Unlocked for portfolio enjoyment
    },
    {
      id: 'rose',
      name: 'English Rose',
      description: 'Velvet elegance honoring patience and self-worth.',
      requirementText: 'Unlocked at 14-day streak or 85%+ Bloom',
      emoji: '🌹',
      isUnlocked: true,
    },
    {
      id: 'daisy',
      name: 'Wild Daisy',
      description: 'Pure, cheerful simplicity that thrives anywhere.',
      requirementText: 'Unlocked with consistent routine habits',
      emoji: '🌼',
      isUnlocked: true,
    },
    {
      id: 'lavender',
      name: 'Provence Lavender',
      description: 'Calming aroma reminding you to breathe deeply and rest.',
      requirementText: 'Unlocked with restful sleep practices',
      emoji: '🪻',
      isUnlocked: true,
    },
  ];

  // Selected Day Details calculation
  const inspectedDate = selectedDayDetails || selectedDate;
  const inspectedBloom = calculateBloomScore(
    inspectedDate,
    routines,
    water,
    exercise,
    meals,
    sleep,
    habits,
    mood,
    preferences
  );

  const inspectedWater = water.filter(w => w.date === inspectedDate).reduce((s, w) => s + w.amountMl, 0);
  const inspectedSteps = exercise.filter(e => e.date === inspectedDate).reduce((s, e) => s + (e.steps || 0), 0);
  const inspectedSleep = sleep.find(s => s.date === inspectedDate);
  const inspectedMood = mood.find(m => m.date === inspectedDate);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#2D2A26] dark:text-[#F3EDE2] tracking-tight">
            Bloom Garden 🌸
          </h1>
          <p className="text-sm text-[#7C7268] dark:text-[#A89E94]">
            Every day you nurture yourself leaves a flower in your garden.
          </p>
        </div>
      </div>

      {/* Flower Variety Selector Shelf */}
      <div className="rounded-3xl bg-white dark:bg-[#25201C] border border-[#EFE8DD] dark:border-[#38322B] p-6 shadow-xs">
        <h2 className="font-display font-bold text-base text-[#2D2A26] dark:text-[#F3EDE2] mb-1 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-rose-500" />
          Choose Your Daily Bloom Flower
        </h2>
        <p className="text-xs text-[#8C827A] dark:text-[#A89E94] mb-4">
          Select which flower blossoms on your dashboard and reflects your daily progress
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {flowerVarieties.map((fl) => {
            const isSelected = preferences.selectedFlower === fl.id;
            return (
              <button
                key={fl.id}
                onClick={() => updatePreferences({ selectedFlower: fl.id })}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden cursor-pointer ${
                  isSelected
                    ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 shadow-2xs scale-[1.02]'
                    : 'bg-[#FAF7F2]/60 dark:bg-[#201C18] border-[#EFE8DD] dark:border-[#38322B] hover:border-rose-200'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px]">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
                <span className="text-3xl mb-2 block">{fl.emoji}</span>
                <div className="font-display font-bold text-sm text-[#2D2A26] dark:text-[#F3EDE2]">
                  {fl.name}
                </div>
                <p className="text-[11px] text-[#8C827A] dark:text-[#9E948A] mt-1 leading-snug">
                  {fl.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Monthly Garden Calendar & Day Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Monthly Garden Calendar */}
        <div className="lg:col-span-8 rounded-3xl bg-white dark:bg-[#25201C] border border-[#EFE8DD] dark:border-[#38322B] p-6 shadow-xs">
          {/* Month Header Navigation */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-lg text-[#2D2A26] dark:text-[#F3EDE2]">
              {currentMonthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>

            <div className="flex items-center gap-1">
              <button
                onClick={prevMonth}
                className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-[#7C7268] transition-colors"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-[#7C7268] transition-colors"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-semibold text-[#8C827A] dark:text-[#A89E94] mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <span key={day} className="py-1">{day}</span>
            ))}
          </div>

          {/* Calendar Day Tiles */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Empty offset days */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-16 sm:h-20 rounded-2xl bg-transparent" />
            ))}

            {/* Actual Days of the Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const dayBloom = calculateBloomScore(
                dateStr,
                routines,
                water,
                exercise,
                meals,
                sleep,
                habits,
                mood,
                preferences
              );

              const isSelected = inspectedDate === dateStr;
              const isTodayTile = dateStr === new Date().toISOString().split('T')[0];

              return (
                <button
                  key={dateStr}
                  onClick={() => {
                    setSelectedDayDetails(dateStr);
                    setSelectedDate(dateStr);
                  }}
                  className={`h-16 sm:h-20 p-1 rounded-2xl border transition-all flex flex-col items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'border-rose-400 bg-rose-50/70 dark:bg-rose-950/40 shadow-xs scale-105 z-10'
                      : 'bg-[#FAF7F2]/50 dark:bg-[#201C18] border-[#EFE8DD] dark:border-[#38322B] hover:border-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between w-full px-1">
                    <span className={`text-[10px] font-bold ${isTodayTile ? 'text-rose-500' : 'text-[#7C7268] dark:text-[#9E948A]'}`}>
                      {dayNum}
                    </span>
                    {dayBloom.score > 0 && (
                      <span className="text-[9px] font-semibold text-rose-600 dark:text-rose-400">
                        {dayBloom.score}%
                      </span>
                    )}
                  </div>

                  {/* Micro Flower visualization */}
                  <div className="flex items-center justify-center my-auto">
                    {dayBloom.score > 0 ? (
                      <BloomFlower
                        score={dayBloom.score}
                        stage={dayBloom.stage}
                        flowerType={preferences.selectedFlower}
                        size={36}
                      />
                    ) : (
                      <span className="text-xs opacity-20">🌱</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Day Inspector & Memory Note */}
        <div className="lg:col-span-4 rounded-3xl bg-white dark:bg-[#25201C] border border-[#EFE8DD] dark:border-[#38322B] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-bold tracking-wider text-rose-500">
                Garden Memory
              </span>
              <span className="text-xs font-semibold text-[#8C827A]">
                {inspectedDate}
              </span>
            </div>

            <div className="text-center py-4 border-b border-[#EFE8DD] dark:border-[#38322B]">
              <div className="flex justify-center mb-2">
                <BloomFlower
                  score={inspectedBloom.score}
                  stage={inspectedBloom.stage}
                  flowerType={preferences.selectedFlower}
                  size={120}
                />
              </div>
              <div className="font-display font-extrabold text-2xl text-[#2D2A26] dark:text-[#F3EDE2]">
                {inspectedBloom.score}% Bloom
              </div>
              <div className="text-xs font-medium text-rose-600 dark:text-rose-400 mt-0.5">
                {getBloomStageName(inspectedBloom.stage)}
              </div>
            </div>

            {/* Quick Metrics Breakdown for inspected day */}
            <div className="space-y-2.5 mt-4 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#FAF7F2] dark:bg-[#201C18]">
                <span className="text-[#7C7268] dark:text-[#A89E94]">💧 Water</span>
                <span className="font-bold text-[#2D2A26] dark:text-[#F3EDE2]">{inspectedWater} ml</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#FAF7F2] dark:bg-[#201C18]">
                <span className="text-[#7C7268] dark:text-[#A89E94]">🚶 Steps</span>
                <span className="font-bold text-[#2D2A26] dark:text-[#F3EDE2]">{inspectedSteps.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#FAF7F2] dark:bg-[#201C18]">
                <span className="text-[#7C7268] dark:text-[#A89E94]">🌙 Sleep</span>
                <span className="font-bold text-[#2D2A26] dark:text-[#F3EDE2]">
                  {inspectedSleep ? `${Math.floor(inspectedSleep.durationMinutes / 60)}h ${inspectedSleep.durationMinutes % 60}m` : 'None logged'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#FAF7F2] dark:bg-[#201C18]">
                <span className="text-[#7C7268] dark:text-[#A89E94]">🌸 Mood</span>
                <span className="font-bold text-[#2D2A26] dark:text-[#F3EDE2] capitalize">
                  {inspectedMood ? `${inspectedMood.mood}` : 'None logged'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#EFE8DD] dark:border-[#38322B] text-center">
            <p className="text-[11px] text-[#8C827A] italic">
              "A garden doesn't grow in a day; it blooms one patient morning at a time."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
