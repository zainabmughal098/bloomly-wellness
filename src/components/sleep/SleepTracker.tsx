import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Moon, Sun, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import { getDatesInRange } from '../../utils/analytics';
import { SleepQuality } from '../../types';

export const SleepTracker: React.FC = () => {
  const { preferences, sleep, logSleep, selectedDate } = useApp();

  const daySleep = sleep.find(s => s.date === selectedDate);

  const [bedtime, setBedtime] = useState(daySleep?.bedtime || '23:00');
  const [wakeTime, setWakeTime] = useState(daySleep?.wakeTime || '07:15');
  const [quality, setQuality] = useState<SleepQuality>(daySleep?.quality || 'restful');
  const [savedNotice, setSavedNotice] = useState(false);

  // Sleep hygiene routines
  const [hygieneList, setHygieneList] = useState([
    { id: 'screen', text: 'Screen-free 30 min before bed', done: false },
    { id: 'room', text: 'Cool, quiet & dimmed sanctuary', done: true },
    { id: 'tea', text: 'Warm chamomile tea or quiet reading', done: false },
    { id: 'breath', text: 'Gentle 4-7-8 calming breaths', done: true },
  ]);

  const toggleHygiene = (id: string) => {
    setHygieneList(prev => prev.map(h => h.id === id ? { ...h, done: !h.done } : h));
  };

  // 7-day sleep chart calculation
  const weekDates = getDatesInRange(7).reverse();
  const weekSleeps = weekDates.map(d => {
    const s = sleep.find(item => item.date === d);
    return {
      date: d,
      hours: s ? +(s.durationMinutes / 60).toFixed(1) : 0,
      quality: s?.quality || 'normal'
    };
  });

  const validDays = weekSleeps.filter(w => w.hours > 0);
  const avgHours = validDays.length > 0 
    ? (validDays.reduce((sum, w) => sum + w.hours, 0) / validDays.length).toFixed(1)
    : '0';

  const handleSaveSleep = async (e: React.FormEvent) => {
    e.preventDefault();
    await logSleep(bedtime, wakeTime, quality);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#2D2A26] dark:text-[#F3EDE2] tracking-tight">
            Rest & Sleep 🌙
          </h1>
          <p className="text-sm text-[#7C7268] dark:text-[#A89E94]">
            Rest is where your body heals and your mind blooms.
          </p>
        </div>
      </div>

      {/* Hero Sleep Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Today's Duration */}
        <div className="rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-[#241F2B] dark:to-[#1B1925] border border-indigo-200 dark:border-indigo-900/40 p-6 shadow-xs">
          <div className="flex items-center justify-between text-indigo-700 dark:text-indigo-300 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Moon className="w-4 h-4" />
              Sleep Recorded
            </span>
            <span className="text-xs capitalize font-medium">{daySleep?.quality || 'Good'}</span>
          </div>
          <div className="text-3xl font-display font-extrabold text-[#2D2A26] dark:text-[#F3EDE2] my-2">
            {daySleep ? (
              <>
                {Math.floor(daySleep.durationMinutes / 60)}h {daySleep.durationMinutes % 60}m
              </>
            ) : (
              '7h 30m'
            )}
          </div>
          <p className="text-xs text-[#6B5E80] dark:text-[#B6ABC9]">
            Goal: {preferences.sleepGoalHours} hours nightly
          </p>
        </div>

        {/* Weekly Average */}
        <div className="rounded-3xl bg-white dark:bg-[#25201C] border border-[#EFE8DD] dark:border-[#38322B] p-6 shadow-xs flex flex-col justify-between">
          <div className="text-xs font-semibold text-[#8C827A] flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-indigo-500" />
            WEEKLY AVERAGE
          </div>
          <div className="text-3xl font-display font-extrabold text-[#2D2A26] dark:text-[#F3EDE2] my-2">
            {avgHours} <span className="text-sm font-normal text-[#8C827A]">hours / night</span>
          </div>
          <p className="text-xs text-[#8C827A]">
            Based on {validDays.length} logged nights this week
          </p>
        </div>

        {/* Sleep Quality Insight */}
        <div className="rounded-3xl bg-white dark:bg-[#25201C] border border-[#EFE8DD] dark:border-[#38322B] p-6 shadow-xs flex flex-col justify-between">
          <div className="text-xs font-semibold text-[#8C827A] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-400" />
            RESTORATIVE REST
          </div>
          <p className="text-xs font-medium text-[#4A423B] dark:text-[#D4C9BC] my-2 leading-relaxed">
            "Your body completes memory synthesis and muscle renewal in slow-wave sleep. Give yourself permission to rest fully."
          </p>
          <div className="text-[11px] text-[#8C827A]">
            Gentle bedtime reminder: 22:30
          </div>
        </div>
      </div>

      {/* Main Sleep Input Form & 7-Day Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Form */}
        <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-[#25201C] border border-[#EFE8DD] dark:border-[#38322B] p-6 shadow-xs">
          <h2 className="font-display font-bold text-base text-[#2D2A26] dark:text-[#F3EDE2] mb-4">
            Log Sleep Times
          </h2>

          {savedNotice && (
            <div className="mb-4 p-3 bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-300 text-emerald-800 dark:text-emerald-200 rounded-xl text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Sleep recorded for {selectedDate} ✨
            </div>
          )}

          <form onSubmit={handleSaveSleep} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[#7C7268] dark:text-[#A89E94] flex items-center gap-1.5 mb-1.5">
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  Bedtime
                </label>
                <input
                  type="time"
                  value={bedtime}
                  onChange={(e) => setBedtime(e.target.value)}
                  className="w-full bg-[#FAF7F2] dark:bg-[#201C18] border border-[#EFE8DD] dark:border-[#38322B] rounded-xl px-3 py-2 text-sm text-[#2D2A26] dark:text-[#F3EDE2]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#7C7268] dark:text-[#A89E94] flex items-center gap-1.5 mb-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  Wake-up Time
                </label>
                <input
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="w-full bg-[#FAF7F2] dark:bg-[#201C18] border border-[#EFE8DD] dark:border-[#38322B] rounded-xl px-3 py-2 text-sm text-[#2D2A26] dark:text-[#F3EDE2]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-[#7C7268] dark:text-[#A89E94] block mb-1.5">
                How rested do you feel?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'restful', label: 'Restful 🌟' },
                  { id: 'normal', label: 'Normal 😴' },
                  { id: 'interrupted', label: 'Restless 🥱' },
                ].map((q) => (
                  <button
                    type="button"
                    key={q.id}
                    onClick={() => setQuality(q.id as SleepQuality)}
                    className={`py-2 text-xs font-medium rounded-xl border text-center transition-all ${
                      quality === q.id
                        ? 'bg-indigo-100 dark:bg-indigo-950/60 border-indigo-300 text-indigo-900 dark:text-indigo-200 font-semibold'
                        : 'bg-white dark:bg-[#282420] border-[#EFE8DD] dark:border-[#38322B] text-[#7C7268]'
                    }`}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              Save Sleep Hours
            </button>
          </form>
        </div>

        {/* Right: 7-Day Sleep Duration Bar Chart */}
        <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-[#25201C] border border-[#EFE8DD] dark:border-[#38322B] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="font-display font-bold text-base text-[#2D2A26] dark:text-[#F3EDE2] mb-1">
              Last 7 Nights of Sleep
            </h2>
            <p className="text-xs text-[#8C827A] dark:text-[#A89E94]">
              Dashed line represents your {preferences.sleepGoalHours}h target
            </p>
          </div>

          {/* Bar Chart */}
          <div className="h-44 w-full flex items-end justify-between gap-3 pt-6 pb-2 border-b border-[#EFE8DD] dark:border-[#38322B] relative">
            {/* Goal Line */}
            <div 
              className="absolute left-0 right-0 border-b-2 border-dashed border-indigo-300 dark:border-indigo-800 z-10 pointer-events-none"
              style={{ bottom: `${(preferences.sleepGoalHours / 10) * 100}%` }}
            >
              <span className="absolute right-0 -top-4 text-[10px] font-bold text-indigo-500 bg-white dark:bg-[#25201C] px-1 rounded">
                Target {preferences.sleepGoalHours}h
              </span>
            </div>

            {weekSleeps.map((d) => {
              const heightPct = Math.min(100, (d.hours / 10) * 100);
              const dateObj = new Date(d.date + 'T00:00:00');
              const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

              return (
                <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end z-20">
                  <span className="text-[10px] font-semibold text-[#8C827A]">
                    {d.hours > 0 ? `${d.hours}h` : '-'}
                  </span>
                  <div className="w-full max-w-[28px] bg-indigo-100 dark:bg-indigo-950/40 rounded-t-lg overflow-hidden h-full flex items-end">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-700 ${
                        d.hours >= preferences.sleepGoalHours
                          ? 'bg-indigo-500 dark:bg-indigo-400'
                          : 'bg-indigo-300 dark:bg-indigo-600'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-[#7C7268] dark:text-[#A89E94]">
                    {dayName}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Sleep Hygiene Checklist */}
          <div className="mt-4 pt-2">
            <span className="text-xs font-bold text-[#2D2A26] dark:text-[#F3EDE2] block mb-2">
              Gentle Bedtime Hygiene
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {hygieneList.map((h) => (
                <div
                  key={h.id}
                  onClick={() => toggleHygiene(h.id)}
                  className="flex items-center gap-2 p-2 rounded-xl bg-[#FAF7F2] dark:bg-[#201C18] border border-[#EFE8DD] dark:border-[#38322B] text-xs cursor-pointer hover:border-indigo-300"
                >
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 ${
                      h.done ? 'text-indigo-500 fill-indigo-100' : 'text-[#8C827A]/40'
                    }`}
                  />
                  <span className={`${h.done ? 'line-through opacity-70' : ''}`}>
                    {h.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
