import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { BloomFlower } from '../common/BloomFlower';
import { DAILY_TIPS } from '../../data/initialData';
import { getDailyQuote } from '../../utils/dailyQuote';
import { 
  Droplet, 
  Utensils, 
  Activity, 
  Footprints, 
  Moon, 
  CheckSquare, 
  Smile, 
  Plus, 
  Info, 
  Sparkles,
  ChevronRight,
  Heart,
  CheckCircle2,
  Circle,
  HelpCircle
} from 'lucide-react';
import { getBloomMessage, getBloomStageName } from '../../utils/bloomCalculator';

export const TodayDashboard: React.FC = () => {
  const {
    userProfile,
    preferences,
    firstDayWelcome,
    dismissFirstDayWelcome,
    todayBloom,
    water,
    todayWaterTotal,
    addWater,
    meals,
    exercise,
    todayStepsTotal,
    addSteps,
    sleep,
    routines,
    toggleRoutineTask,
    mood,
    selfCare,
    toggleSelfCare,
    setActiveTab,
    setIsQuickAddOpen,
    selectedDate,
    isToday
  } = useApp();

  const [isScoreInfoOpen, setIsScoreInfoOpen] = useState(false);
  const [tipIndex, setTipIndex] = useState(() => Math.floor(Math.random() * DAILY_TIPS.length));

  // Auto-dismiss first-day welcome banner naturally after 18 seconds
  useEffect(() => {
    if (firstDayWelcome) {
      const timer = setTimeout(() => {
        dismissFirstDayWelcome();
      }, 18000);
      return () => clearTimeout(timer);
    }
  }, [firstDayWelcome, dismissFirstDayWelcome]);

  // Dynamic greeting prefix based on current local hour:
  // Before 12 PM: Good morning 🌷
  // 12 PM - 5 PM: Good afternoon 🌷
  // After 5 PM: Good evening 🌷
  const getGreetingPrefix = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning 🌷';
    if (hour < 17) return 'Good afternoon 🌷';
    return 'Good evening 🌷';
  };

  const displayName = userProfile.name || preferences.name || 'Friend';
  const dailyQuote = getDailyQuote(selectedDate);

  // Metrics calculation for the selected date
  const dayMeals = meals.filter(m => m.date === selectedDate);
  const dayExercise = exercise.filter(e => e.date === selectedDate);
  const totalMovementMin = dayExercise.reduce((sum, e) => sum + e.durationMinutes, 0);
  const daySleep = sleep.find(s => s.date === selectedDate);
  const sleepDurationHours = daySleep ? (daySleep.durationMinutes / 60) : null;
  const dayMood = mood.find(m => m.date === selectedDate);

  // Today routine items
  const completedRoutinesCount = routines.filter(
    r => r.completedDates?.includes(selectedDate) || (r.completed && isToday)
  ).length;

  const currentTip = DAILY_TIPS[tipIndex % DAILY_TIPS.length];

  const cycleTip = () => {
    setTipIndex((prev) => (prev + 1) % DAILY_TIPS.length);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* First-Day Experience Welcome Message */}
      {firstDayWelcome && (
        <div 
          id="first_day_welcome_banner"
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-100/90 via-rose-50 to-amber-50/70 dark:from-rose-950/50 dark:via-[#26201B] dark:to-amber-950/30 border border-rose-200/80 dark:border-rose-900/40 p-4 shadow-xs flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-300"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white/90 dark:bg-rose-900/40 flex items-center justify-center text-xl shrink-0 shadow-2xs">
              🌷
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display font-bold text-sm text-[#2D2A26] dark:text-[#F3EDE2] break-words line-clamp-2">
                Welcome to your garden, {firstDayWelcome.name || displayName} 🌷
              </p>
              <p className="text-xs text-[#7C7268] dark:text-[#A89E94] break-words line-clamp-2">
                Every little thing you log helps your day bloom.
              </p>
            </div>
          </div>
          <button
            id="dismiss_first_day_welcome_btn"
            onClick={dismissFirstDayWelcome}
            className="text-xs font-semibold text-[#7C7268] hover:text-[#2D2A26] dark:text-[#A89E94] dark:hover:text-[#F3EDE2] px-3 py-1.5 rounded-xl bg-white/70 dark:bg-[#322B24] border border-[#EFE8DD] dark:border-[#3E362E] hover:border-rose-300 transition-colors shrink-0 cursor-pointer"
          >
            Got it
          </button>
        </div>
      )}

      {/* Header Greeting & Daily Motivational Quote */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#2D2A26] dark:text-[#F3EDE2] tracking-tight break-words">
            {getGreetingPrefix()}, {displayName}
          </h1>
          {/* Daily motivational quote */}
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#7C7268] dark:text-[#A89E94] italic font-serif mt-1 max-w-2xl">
            <span className="text-amber-500/90 dark:text-amber-400 not-italic shrink-0 text-xs">✨</span>
            <span className="leading-snug">"{dailyQuote.text}"</span>
          </div>
        </div>

        {/* Quick Log Button */}
        <button
          onClick={() => setIsQuickAddOpen(true)}
          className="self-start sm:self-auto flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs hover:shadow-md transition-all active:scale-98 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Quick Log Activity
        </button>
      </div>

      {/* TODAY'S BLOOM HERO CARD */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-50 via-white to-amber-50/40 dark:from-[#26201B] dark:via-[#1F1B17] dark:to-[#2A231C] border border-rose-100 dark:border-[#383028] p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Flower Visual Graphic */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <div className="relative">
              <BloomFlower
                score={todayBloom.score}
                stage={todayBloom.stage}
                flowerType={preferences.selectedFlower}
                size={200}
                interactive={true}
              />
              <span className="absolute -bottom-2 px-3 py-1 rounded-full bg-white/90 dark:bg-[#282420]/90 backdrop-blur-xs border border-rose-200 dark:border-rose-900/60 text-[11px] font-semibold text-rose-700 dark:text-rose-300 shadow-2xs">
                {getBloomStageName(todayBloom.stage)}
              </span>
            </div>
          </div>

          {/* Bloom Progress & Explanations */}
          <div className="md:col-span-7 flex flex-col justify-center space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-widest text-rose-500 dark:text-rose-400">
                  Today's Bloom
                </span>
                <button
                  onClick={() => setIsScoreInfoOpen(!isScoreInfoOpen)}
                  className="text-[#9C8F85] hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                  title="How is Today's Bloom calculated?"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              </div>

              <span className="text-3xl sm:text-4xl font-display font-extrabold text-[#2D2A26] dark:text-[#F3EDE2]">
                {todayBloom.score}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-black/5 dark:bg-white/10 h-3 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-rose-400 via-rose-500 to-amber-400 h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${todayBloom.score}%` }}
              />
            </div>

            <p className="text-sm font-medium text-[#4A423B] dark:text-[#D4C9BC]">
              "{getBloomMessage(todayBloom.score)}"
            </p>

            {/* Micro Breakdown Badges */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
              <div className="p-2 rounded-xl bg-white/80 dark:bg-[#282420]/80 border border-[#EFE8DD] dark:border-[#38322B] text-center">
                <span className="text-[10px] text-[#8C827A] dark:text-[#9E948A] block">Routine</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {todayBloom.breakdown.routine}/25
                </span>
              </div>
              <div className="p-2 rounded-xl bg-white/80 dark:bg-[#282420]/80 border border-[#EFE8DD] dark:border-[#38322B] text-center">
                <span className="text-[10px] text-[#8C827A] dark:text-[#9E948A] block">Water</span>
                <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
                  {todayBloom.breakdown.water}/15
                </span>
              </div>
              <div className="p-2 rounded-xl bg-white/80 dark:bg-[#282420]/80 border border-[#EFE8DD] dark:border-[#38322B] text-center">
                <span className="text-[10px] text-[#8C827A] dark:text-[#9E948A] block">Movement</span>
                <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                  {todayBloom.breakdown.movement}/20
                </span>
              </div>
              <div className="p-2 rounded-xl bg-white/80 dark:bg-[#282420]/80 border border-[#EFE8DD] dark:border-[#38322B] text-center">
                <span className="text-[10px] text-[#8C827A] dark:text-[#9E948A] block">Meals</span>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  {todayBloom.breakdown.meals}/15
                </span>
              </div>
            </div>

            {/* Score Explanation Accordion */}
            {isScoreInfoOpen && (
              <div className="mt-3 p-4 rounded-2xl bg-white/95 dark:bg-[#2A2520] border border-rose-200 dark:border-rose-900/50 text-xs text-[#5C5248] dark:text-[#C5BCB2] space-y-2 animate-in fade-in duration-200">
                <div className="font-semibold text-[#2D2A26] dark:text-[#F3EDE2] flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-rose-500" />
                  About Your Today's Bloom Score
                </div>
                <p>
                  Today's Bloom is a gentle reflection of your daily consistency, not a clinical health score. It brings all your self-care practices into a single harmonious number:
                </p>
                <div className="grid grid-cols-2 gap-1 text-[11px] pt-1">
                  <span>• Routines: 25%</span>
                  <span>• Movement: 20%</span>
                  <span>• Water Target: 15%</span>
                  <span>• Nourishing Meals: 15%</span>
                  <span>• Sleep Rest: 10%</span>
                  <span>• Habits Check-in: 10%</span>
                  <span className="col-span-2">• Mood Check-in: 5%</span>
                </div>
                <p className="text-[11px] italic text-[#8C827A] pt-1">
                  Bloomly never punishes missed goals — every small step nurtures your flower.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QUICK METRIC CARDS (ALL CLICKABLE TO THEIR RESPECTIVE TABS) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* WATER CARD */}
        <div 
          onClick={() => setActiveTab('water')}
          className="group relative p-4 rounded-2xl bg-white dark:bg-[#25201C] border border-[#EFE8DD] dark:border-[#38322B] hover:border-sky-300 dark:hover:border-sky-800/80 transition-all hover:shadow-xs cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#8C827A] dark:text-[#A89E94] flex items-center gap-1.5">
              <Droplet className="w-3.5 h-3.5 text-sky-500" />
              WATER
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                addWater(250);
              }}
              className="text-[10px] font-bold bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-300 px-2 py-0.5 rounded-full hover:bg-sky-100 transition-colors"
              title="Quick add 250ml"
            >
              +250ml
            </button>
          </div>
          <div className="text-lg sm:text-xl font-display font-bold text-[#2D2A26] dark:text-[#F3EDE2]">
            {todayWaterTotal} <span className="text-xs font-normal text-[#8C827A]">/ {preferences.waterTargetMl} ml</span>
          </div>
          <div className="w-full bg-sky-100/60 dark:bg-sky-950/40 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-sky-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (todayWaterTotal / preferences.waterTargetMl) * 100)}%` }}
            />
          </div>
        </div>

        {/* MEALS CARD */}
        <div 
          onClick={() => setActiveTab('meals')}
          className="group p-4 rounded-2xl bg-white dark:bg-[#25201C] border border-[#EFE8DD] dark:border-[#38322B] hover:border-amber-300 dark:hover:border-amber-800/80 transition-all hover:shadow-xs cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#8C827A] dark:text-[#A89E94] flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-amber-500" />
              MEALS
            </span>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
              {dayMeals.length >= 3 ? 'Complete' : `${dayMeals.length} logged`}
            </span>
          </div>
          <div className="text-lg sm:text-xl font-display font-bold text-[#2D2A26] dark:text-[#F3EDE2]">
            {dayMeals.length} <span className="text-xs font-normal text-[#8C827A]">/ 3 meals</span>
          </div>
          <div className="w-full bg-amber-100/60 dark:bg-amber-950/40 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-amber-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (dayMeals.length / 3) * 100)}%` }}
            />
          </div>
        </div>

        {/* STEPS CARD */}
        <div 
          onClick={() => setActiveTab('movement')}
          className="group p-4 rounded-2xl bg-white dark:bg-[#25201C] border border-[#EFE8DD] dark:border-[#38322B] hover:border-emerald-300 dark:hover:border-emerald-800/80 transition-all hover:shadow-xs cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#8C827A] dark:text-[#A89E94] flex items-center gap-1.5">
              <Footprints className="w-3.5 h-3.5 text-emerald-500" />
              STEPS
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                addSteps(500);
              }}
              className="text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 px-2 py-0.5 rounded-full hover:bg-emerald-100 transition-colors"
              title="Quick add 500 steps"
            >
              +500
            </button>
          </div>
          <div className="text-lg sm:text-xl font-display font-bold text-[#2D2A26] dark:text-[#F3EDE2]">
            {todayStepsTotal.toLocaleString()} <span className="text-xs font-normal text-[#8C827A]">/ {preferences.stepGoal.toLocaleString()}</span>
          </div>
          <div className="w-full bg-emerald-100/60 dark:bg-emerald-950/40 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (todayStepsTotal / preferences.stepGoal) * 100)}%` }}
            />
          </div>
        </div>

        {/* MOVEMENT CARD */}
        <div 
          onClick={() => setActiveTab('movement')}
          className="group p-4 rounded-2xl bg-white dark:bg-[#25201C] border border-[#EFE8DD] dark:border-[#38322B] hover:border-orange-300 dark:hover:border-orange-800/80 transition-all hover:shadow-xs cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#8C827A] dark:text-[#A89E94] flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-orange-500" />
              MOVEMENT
            </span>
            <span className="text-[11px] text-orange-600 dark:text-orange-400 font-medium">
              {totalMovementMin >= preferences.movementTargetMinutes ? 'Achieved' : 'Active'}
            </span>
          </div>
          <div className="text-lg sm:text-xl font-display font-bold text-[#2D2A26] dark:text-[#F3EDE2]">
            {totalMovementMin} <span className="text-xs font-normal text-[#8C827A]">/ {preferences.movementTargetMinutes} min</span>
          </div>
          <div className="w-full bg-orange-100/60 dark:bg-orange-950/40 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-orange-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (totalMovementMin / preferences.movementTargetMinutes) * 100)}%` }}
            />
          </div>
        </div>

        {/* SLEEP CARD */}
        <div 
          onClick={() => setActiveTab('sleep')}
          className="group p-4 rounded-2xl bg-white dark:bg-[#25201C] border border-[#EFE8DD] dark:border-[#38322B] hover:border-indigo-300 dark:hover:border-indigo-800/80 transition-all hover:shadow-xs cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#8C827A] dark:text-[#A89E94] flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              SLEEP
            </span>
            <span className="text-[11px] text-indigo-500 dark:text-indigo-400 font-medium">
              {daySleep ? 'Recorded' : 'Log tonight'}
            </span>
          </div>
          <div className="text-lg sm:text-xl font-display font-bold text-[#2D2A26] dark:text-[#F3EDE2]">
            {daySleep ? (
              <>
                {Math.floor(daySleep.durationMinutes / 60)}h {daySleep.durationMinutes % 60}m
              </>
            ) : (
              <span className="text-sm font-sans font-normal text-[#8C827A]">Not logged</span>
            )}
          </div>
          <div className="w-full bg-indigo-100/60 dark:bg-indigo-950/40 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-indigo-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${daySleep ? Math.min(100, (daySleep.durationMinutes / (preferences.sleepGoalHours * 60)) * 100) : 0}%` }}
            />
          </div>
        </div>

        {/* ROUTINE CARD */}
        <div 
          onClick={() => setActiveTab('routine')}
          className="group p-4 rounded-2xl bg-white dark:bg-[#25201C] border border-[#EFE8DD] dark:border-[#38322B] hover:border-emerald-300 dark:hover:border-emerald-800/80 transition-all hover:shadow-xs cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#8C827A] dark:text-[#A89E94] flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
              ROUTINE
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              {completedRoutinesCount} of {routines.length}
            </span>
          </div>
          <div className="text-lg sm:text-xl font-display font-bold text-[#2D2A26] dark:text-[#F3EDE2]">
            {completedRoutinesCount} <span className="text-xs font-normal text-[#8C827A]">/ {routines.length} done</span>
          </div>
          <div className="w-full bg-emerald-100/60 dark:bg-emerald-950/40 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${routines.length ? (completedRoutinesCount / routines.length) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* MOOD CARD */}
        <div 
          onClick={() => setActiveTab('mood')}
          className="group p-4 rounded-2xl bg-white dark:bg-[#25201C] border border-[#EFE8DD] dark:border-[#38322B] hover:border-violet-300 dark:hover:border-violet-800/80 transition-all hover:shadow-xs cursor-pointer col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#8C827A] dark:text-[#A89E94] flex items-center gap-1.5">
              <Smile className="w-3.5 h-3.5 text-violet-400" />
              MOOD
            </span>
            <span className="text-[11px] text-violet-500 font-medium">
              {dayMood ? 'Checked in' : 'Tap to log'}
            </span>
          </div>
          <div className="text-lg sm:text-xl font-display font-bold text-[#2D2A26] dark:text-[#F3EDE2] capitalize flex items-center gap-2">
            {dayMood ? (
              <>
                <span>
                  {dayMood.mood === 'great' ? '😄' : dayMood.mood === 'good' ? '🙂' : dayMood.mood === 'okay' ? '😐' : dayMood.mood === 'low' ? '😔' : '😫'}
                </span>
                <span>{dayMood.mood}</span>
              </>
            ) : (
              <span className="text-sm font-sans font-normal text-[#8C827A]">Check in today</span>
            )}
          </div>
          <p className="text-[11px] text-[#8C827A] mt-2 italic line-clamp-1">
            {dayMood?.note || 'Take a breath and check in'}
          </p>
        </div>
      </div>

      {/* TWO COLUMN SECTION: Today's Routine Preview + Daily Tip & Self Care */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Today's Routine Checklist Preview */}
        <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-[#25201C] border border-[#EFE8DD] dark:border-[#38322B] p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-bold text-base sm:text-lg text-[#2D2A26] dark:text-[#F3EDE2]">
                Today's Gentle Routine
              </h2>
              <p className="text-xs text-[#8C827A] dark:text-[#A89E94]">
                {completedRoutinesCount} of {routines.length} steps complete
              </p>
            </div>
            <button
              onClick={() => setActiveTab('routine')}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
            >
              View all
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {routines.slice(0, 5).map((task) => {
              const isDone = task.completedDates?.includes(selectedDate) || (task.completed && isToday);
              return (
                <div
                  key={task.id}
                  onClick={() => toggleRoutineTask(task.id)}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                    isDone
                      ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/40 text-[#8C827A]'
                      : 'bg-[#FAF7F2]/60 dark:bg-[#201C18] border-[#EFE8DD] dark:border-[#38322B] text-[#2D2A26] dark:text-[#F3EDE2] hover:border-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                    <button className="focus:outline-none shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-rose-500 fill-rose-100 dark:fill-rose-950" />
                      ) : (
                        <Circle className="w-5 h-5 text-[#8C827A]/50 hover:text-rose-400" />
                      )}
                    </button>
                    <span className="text-base shrink-0">{task.icon || '🌸'}</span>
                    <span className={`text-xs sm:text-sm font-medium break-words line-clamp-2 ${isDone ? 'line-through opacity-70' : ''}`}>
                      {task.title}
                    </span>
                  </div>

                  <span className="text-[11px] text-[#8C827A] dark:text-[#9E948A] capitalize shrink-0">
                    {task.time || task.period}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Daily Tip + Self-Care Rituals */}
        <div className="lg:col-span-5 space-y-6">
          {/* Daily Tip (Local list, zero external API) */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-50 to-rose-50 dark:from-[#28221D] dark:to-[#241D1A] border border-amber-200/60 dark:border-amber-900/40 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Daily Gentle Tip
              </span>
              <button
                onClick={cycleTip}
                className="text-[11px] text-amber-800 dark:text-amber-300/80 hover:underline cursor-pointer"
              >
                Next Tip ↻
              </button>
            </div>
            <p className="text-sm font-medium text-[#4D382C] dark:text-[#E8DCD0] italic leading-relaxed">
              "{currentTip.text}"
            </p>
            <div className="mt-3 flex items-center justify-between text-[11px] text-[#8C7A6D] dark:text-[#A8988B]">
              <span className="capitalize">Category: {currentTip.category}</span>
              <span>{currentTip.author}</span>
            </div>
          </div>

          {/* Self-Care Mini Grid */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#25201C] border border-[#EFE8DD] dark:border-[#38322B] shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-bold text-sm sm:text-base text-[#2D2A26] dark:text-[#F3EDE2] flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-400 fill-rose-100" />
                Self-Care Check-ins
              </h2>
              <span className="text-[11px] text-[#8C827A]">
                {selfCare.filter(sc => sc.completedDates?.includes(selectedDate)).length} checked
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {selfCare.slice(0, 6).map((sc) => {
                const isChecked = sc.completedDates?.includes(selectedDate);
                return (
                  <button
                    key={sc.id}
                    onClick={() => toggleSelfCare(sc.id)}
                    className={`flex items-center gap-2 p-2 sm:p-2.5 rounded-xl border text-left transition-all min-h-[50px] sm:min-h-[52px] ${
                      isChecked
                        ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 font-semibold'
                        : 'bg-[#FAF7F2]/50 dark:bg-[#201C18] border-[#EFE8DD] dark:border-[#38322B] text-[#5C534B] dark:text-[#C5BCB2] hover:border-rose-200'
                    }`}
                  >
                    <span className="text-base shrink-0">{sc.icon}</span>
                    <span className="text-[11px] sm:text-xs leading-tight break-words line-clamp-2 min-w-0 flex-1">
                      {sc.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
