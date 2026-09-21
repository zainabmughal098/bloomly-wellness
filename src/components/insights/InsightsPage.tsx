import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getDatesInRange, calculateWeeklyStats, generateSmartInsights } from '../../utils/analytics';
import { calculateBloomScore } from '../../utils/bloomCalculator';
import { 
  BarChart3, 
  Sparkles, 
  TrendingUp, 
  Droplet, 
  Footprints, 
  Moon, 
  CheckSquare, 
  Gift, 
  Calendar,
  Award
} from 'lucide-react';

export const InsightsPage: React.FC = () => {
  const {
    routines,
    water,
    exercise,
    meals,
    sleep,
    habits,
    mood,
    preferences,
    setIsWeeklyWrappedOpen
  } = useApp();

  const [timeRange, setTimeRange] = useState<7 | 30 | 90>(7);

  // Range dates
  const dates = getDatesInRange(timeRange).reverse(); // oldest to newest

  // Daily scores
  const dailyData = dates.map(d => {
    const b = calculateBloomScore(d, routines, water, exercise, meals, sleep, habits, mood, preferences);
    const dayWater = water.filter(w => w.date === d).reduce((s, w) => s + w.amountMl, 0);
    const daySteps = exercise.filter(e => e.date === d).reduce((s, e) => s + (e.steps || 0), 0);
    const daySleep = sleep.find(s => s.date === d);
    return {
      date: d,
      score: b.score,
      water: dayWater,
      steps: daySteps,
      sleepHours: daySleep ? +(daySleep.durationMinutes / 60).toFixed(1) : 0
    };
  });

  const validScores = dailyData.map(d => d.score).filter(s => s > 0);
  const avgBloom = validScores.length > 0 
    ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length)
    : 0;

  const totalSteps = dailyData.reduce((sum, d) => sum + d.steps, 0);
  const totalWater = dailyData.reduce((sum, d) => sum + d.water, 0);
  const avgSleep = dailyData.filter(d => d.sleepHours > 0).length > 0
    ? (dailyData.filter(d => d.sleepHours > 0).reduce((s, d) => s + d.sleepHours, 0) / dailyData.filter(d => d.sleepHours > 0).length).toFixed(1)
    : '0';

  // Smart local generated insights
  const insights = generateSmartInsights(
    routines,
    water,
    exercise,
    meals,
    sleep,
    habits,
    mood,
    preferences
  );

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header & Range Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#2D2A26] dark:text-[#F3EDE2] tracking-tight">
            Wellness Insights 📊
          </h1>
          <p className="text-sm text-[#7C7268] dark:text-[#A89E94]">
            Reflecting on your journey with zero pressure and pure clarity.
          </p>
        </div>

        {/* Time Filter Pills */}
        <div className="flex items-center bg-white dark:bg-[#25201C] border border-[#EFE8DD] dark:border-[#38322B] p-1 rounded-2xl shadow-2xs self-start sm:self-auto">
          {[
            { label: '7 Days', val: 7 },
            { label: '30 Days', val: 30 },
            { label: '3 Months', val: 90 },
          ].map(opt => (
            <button
              key={opt.val}
              onClick={() => setTimeRange(opt.val as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                timeRange === opt.val
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-[#7C7268] dark:text-[#A89E94] hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* WEEKLY WRAPPED HERO PROMO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-500 via-rose-400 to-amber-400 p-6 sm:p-7 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 max-w-lg z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-[11px] font-bold tracking-wide uppercase">
            <Gift className="w-3.5 h-3.5" />
            Weekly Celebration
          </div>
          <h2 className="font-display font-bold text-xl sm:text-2xl tracking-tight">
            Your Bloomly Weekly Wrapped 🎁
          </h2>
          <p className="text-xs sm:text-sm text-rose-50 opacity-95">
            See your personalized 7-day highlight reel, milestone achievements, and shareable aesthetic celebration story card!
          </p>
        </div>

        <button
          onClick={() => setIsWeeklyWrappedOpen(true)}
          className="self-start sm:self-auto px-5 py-3 rounded-2xl bg-white text-rose-600 hover:bg-rose-50 font-display font-bold text-xs shadow-md transition-all active:scale-95 z-10 cursor-pointer"
        >
          Open Weekly Wrapped ✨
        </button>

        {/* Decorative background flowers */}
        <div className="absolute right-2 -bottom-6 text-7xl opacity-20 pointer-events-none select-none">
          🌸🌷🌼
        </div>
      </div>

      {/* High-Level Overview Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#25201C] border border-[#EFE8DD] dark:border-[#38322B] shadow-xs">
          <span className="text-xs font-semibold text-[#8C827A] block mb-1">
            Average Bloom
          </span>
          <div className="text-2xl sm:text-3xl font-display font-bold text-rose-600 dark:text-rose-400">
            {avgBloom}%
          </div>
          <span className="text-[11px] text-[#8C827A] mt-1 block">
            Over past {timeRange} days
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#25201C] border border-[#EFE8DD] dark:border-[#38322B] shadow-xs">
          <span className="text-xs font-semibold text-[#8C827A] block mb-1 flex items-center gap-1">
            <Footprints className="w-3.5 h-3.5 text-emerald-500" />
            Total Steps
          </span>
          <div className="text-2xl sm:text-3xl font-display font-bold text-emerald-600 dark:text-emerald-400">
            {totalSteps.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#8C827A] mt-1 block">
            ~{(totalSteps * 0.00075).toFixed(1)} km walked
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#25201C] border border-[#EFE8DD] dark:border-[#38322B] shadow-xs">
          <span className="text-xs font-semibold text-[#8C827A] block mb-1 flex items-center gap-1">
            <Droplet className="w-3.5 h-3.5 text-sky-500" />
            Total Hydration
          </span>
          <div className="text-2xl sm:text-3xl font-display font-bold text-sky-600 dark:text-sky-400">
            {(totalWater / 1000).toFixed(1)} <span className="text-sm font-normal">L</span>
          </div>
          <span className="text-[11px] text-[#8C827A] mt-1 block">
            {totalWater.toLocaleString()} ml consumed
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#25201C] border border-[#EFE8DD] dark:border-[#38322B] shadow-xs">
          <span className="text-xs font-semibold text-[#8C827A] block mb-1 flex items-center gap-1">
            <Moon className="w-3.5 h-3.5 text-indigo-400" />
            Avg Rest / Night
          </span>
          <div className="text-2xl sm:text-3xl font-display font-bold text-indigo-600 dark:text-indigo-400">
            {avgSleep} <span className="text-sm font-normal">hrs</span>
          </div>
          <span className="text-[11px] text-[#8C827A] mt-1 block">
            Goal: {preferences.sleepGoalHours}h
          </span>
        </div>
      </div>

      {/* BLOOM SCORE TREND SVG CHART */}
      <div className="rounded-3xl bg-white dark:bg-[#25201C] border border-[#EFE8DD] dark:border-[#38322B] p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-bold text-base text-[#2D2A26] dark:text-[#F3EDE2]">
              Daily Bloom Score Trajectory
            </h2>
            <p className="text-xs text-[#8C827A] dark:text-[#A89E94]">
              Gentle visual rhythm across the selected {timeRange} days
            </p>
          </div>
          <span className="text-xs font-semibold text-rose-500 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            {avgBloom >= 70 ? 'Flourishing' : 'Growing steadily'}
          </span>
        </div>

        {/* SVG Area Line Chart */}
        <div className="w-full h-56 relative pt-4">
          <svg viewBox="0 0 700 180" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="bloomAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Background Guideline at 80% */}
            <line
              x1="0"
              y1={180 - (80 * 1.6)}
              x2="700"
              y2={180 - (80 * 1.6)}
              stroke="#E2DCD5"
              strokeDasharray="4 4"
              strokeWidth="1"
            />
            <text x="690" y={175 - (80 * 1.6)} textAnchor="end" fontSize="10" fill="#A89E94">
              80% Goal
            </text>

            {/* Sparkline Points Calculation */}
            {(() => {
              const count = dailyData.length;
              const step = count > 1 ? 700 / (count - 1) : 700;
              const points = dailyData.map((d, idx) => {
                const x = idx * step;
                const y = 170 - (d.score * 1.5);
                return `${x},${y}`;
              });

              const polyPoints = `0,180 ${points.join(' ')} 700,180`;

              return (
                <>
                  <polygon points={polyPoints} fill="url(#bloomAreaGrad)" />
                  <polyline
                    points={points.join(' ')}
                    fill="none"
                    stroke="#F43F5E"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {dailyData.map((d, idx) => {
                    const x = idx * step;
                    const y = 170 - (d.score * 1.5);
                    return (
                      <g key={d.date} className="group">
                        <circle
                          cx={x}
                          cy={y}
                          r="4"
                          fill="#FFFFFF"
                          stroke="#F43F5E"
                          strokeWidth="2.5"
                          className="hover:r-6 transition-all"
                        />
                      </g>
                    );
                  })}
                </>
              );
            })()}
          </svg>
        </div>

        {/* Date Labels below chart */}
        <div className="flex items-center justify-between text-[11px] text-[#8C827A] pt-2 border-t border-[#EFE8DD] dark:border-[#38322B]">
          <span>{dailyData[0]?.date}</span>
          <span>{dailyData[Math.floor(dailyData.length / 2)]?.date}</span>
          <span>{dailyData[dailyData.length - 1]?.date}</span>
        </div>
      </div>

      {/* FACTUAL ENCOURAGING INSIGHTS GRID */}
      <div className="rounded-3xl bg-white dark:bg-[#25201C] border border-[#EFE8DD] dark:border-[#38322B] p-6 shadow-xs">
        <h2 className="font-display font-bold text-base text-[#2D2A26] dark:text-[#F3EDE2] mb-1 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Factual Discoveries About Your Routine
        </h2>
        <p className="text-xs text-[#8C827A] dark:text-[#A89E94] mb-4">
          Derived completely offline from your local data patterns:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {insights.map((item: { icon: string; title: string; text: string }, idx: number) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#201C18] border border-[#EFE8DD] dark:border-[#38322B] flex items-start gap-3.5"
            >
              <div className="text-2xl p-2 rounded-xl bg-white dark:bg-[#2A2520] border border-[#EFE8DD] dark:border-[#38322B] shrink-0">
                {item.icon}
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#2D2A26] dark:text-[#F3EDE2]">
                  {item.title}
                </h3>
                <p className="text-xs text-[#7C7268] dark:text-[#A89E94] mt-0.5 leading-relaxed">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
