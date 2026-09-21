import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Droplet, RotateCcw, Edit2, Plus, Sparkles, Clock } from 'lucide-react';

export const WaterTracker: React.FC = () => {
  const {
    preferences,
    updatePreferences,
    water,
    todayWaterTotal,
    addWater,
    undoLatestWater,
    selectedDate
  } = useApp();

  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [newTarget, setNewTarget] = useState(String(preferences.waterTargetMl || 2000));
  const [customAmount, setCustomAmount] = useState('');

  const target = preferences.waterTargetMl || 2000;
  const percentage = Math.min(100, Math.round((todayWaterTotal / target) * 100));

  const dayEntries = water.filter(w => w.date === selectedDate).sort((a, b) => b.timestamp - a.timestamp);

  const getEncouragingMessage = () => {
    if (percentage >= 100) return 'Your flower loved that! Goal reached for today 🌸';
    if (percentage >= 75) return 'Almost to full hydration! Keep sipping gently 💧';
    if (percentage >= 50) return 'Halfway there 💧 Your body thanks you!';
    if (percentage >= 25) return 'Great start to your daily hydration rhythm 🌱';
    return 'Your first sip starts here 💧';
  };

  const handleSaveTarget = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(newTarget, 10);
    if (val >= 500 && val <= 6000) {
      await updatePreferences({ waterTargetMl: val });
      setIsEditingTarget(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#2D2A26] dark:text-[#F3EDE2] tracking-tight">
            Hydration Tracker 💧
          </h1>
          <p className="text-sm text-[#7C7268] dark:text-[#A89E94]">
            Track daily water intake at your own calm pace.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {dayEntries.length > 0 && (
            <button
              onClick={() => undoLatestWater()}
              className="flex items-center gap-1.5 bg-white dark:bg-[#25201C] border border-[#EFE8DD] dark:border-[#38322B] text-[#7C7268] dark:text-[#A89E94] hover:text-rose-500 text-xs font-semibold px-3 py-2 rounded-xl transition-all shadow-2xs"
              title="Undo last logged glass"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Undo Last
            </button>
          )}
          <button
            onClick={() => setIsEditingTarget(!isEditingTarget)}
            className="flex items-center gap-1.5 bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800/60 text-sky-700 dark:text-sky-300 text-xs font-semibold px-3 py-2 rounded-xl transition-all"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit Target
          </button>
        </div>
      </div>

      {/* Target Edit Form */}
      {isEditingTarget && (
        <form onSubmit={handleSaveTarget} className="p-4 rounded-2xl bg-white dark:bg-[#25201C] border border-sky-200 dark:border-sky-900/40 flex items-center gap-3">
          <label className="text-xs font-semibold text-[#7C7268]">Daily Target (ml):</label>
          <input
            type="number"
            step="100"
            value={newTarget}
            onChange={(e) => setNewTarget(e.target.value)}
            className="w-32 bg-[#FAF7F2] dark:bg-[#1E1B18] border border-[#EFE8DD] dark:border-[#38322B] rounded-lg px-3 py-1.5 text-xs text-[#2D2A26] dark:text-[#F3EDE2]"
          />
          <button
            type="submit"
            className="bg-sky-500 hover:bg-sky-600 text-white font-medium text-xs px-3 py-1.5 rounded-lg"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setIsEditingTarget(false)}
            className="text-xs text-[#8C827A] hover:underline"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Hero Visualizer & Quick Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Interactive Bottle / Glass SVG Visualizer */}
        <div className="md:col-span-6 rounded-3xl bg-white dark:bg-[#25201C] border border-[#EFE8DD] dark:border-[#38322B] p-6 shadow-xs flex flex-col items-center justify-center text-center">
          <div className="relative w-48 h-64 flex items-center justify-center my-2">
            {/* SVG Glass / Tumbler Container */}
            <svg viewBox="0 0 160 220" className="w-full h-full drop-shadow-sm">
              <defs>
                <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#7DD3FC" />
                  <stop offset="100%" stopColor="#0284C7" />
                </linearGradient>
                <clipPath id="tumblerClip">
                  <path d="M40 30 L45 190 Q46 200 60 200 L100 200 Q114 200 115 190 L120 30 Z" />
                </clipPath>
              </defs>

              {/* Water Fill Level (Calculated dynamically) */}
              <g clipPath="url(#tumblerClip)">
                <rect
                  x="30"
                  y={200 - (percentage * 1.7)}
                  width="100"
                  height="200"
                  fill="url(#waterGrad)"
                  className="transition-all duration-1000 ease-out"
                />
                {/* Surface Wave Bubble */}
                <ellipse
                  cx="80"
                  cy={200 - (percentage * 1.7)}
                  rx="40"
                  ry="5"
                  fill="#BAE6FD"
                  opacity="0.8"
                />
              </g>

              {/* Glass Contour & Highlights */}
              <path
                d="M40 30 L45 190 Q46 200 60 200 L100 200 Q114 200 115 190 L120 30 Z"
                fill="none"
                stroke="#BAE6FD"
                strokeWidth="4"
                strokeLinejoin="round"
                className="dark:stroke-sky-900/60"
              />
              <path
                d="M42 30 Q80 36 118 30"
                stroke="#93C5FD"
                strokeWidth="3"
                fill="none"
              />
              {/* Glass Reflection glare */}
              <path
                d="M50 45 L54 180"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.6"
              />
            </svg>

            {/* Centered Percentage Badge */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="font-display font-extrabold text-3xl sm:text-4xl text-[#1E293B] dark:text-white drop-shadow-xs">
                {percentage}%
              </span>
              <span className="text-xs font-semibold text-sky-900 dark:text-sky-200 mt-0.5">
                {todayWaterTotal} ml
              </span>
            </div>
          </div>

          <p className="text-sm font-medium text-[#4A423B] dark:text-[#D4C9BC] mt-2">
            "{getEncouragingMessage()}"
          </p>
          <span className="text-xs text-[#8C827A] dark:text-[#9E948A] mt-1">
            Target: {target} ml
          </span>
        </div>

        {/* Right: Quick Add Actions & Recent Entries */}
        <div className="md:col-span-6 space-y-6">
          {/* Quick Buttons */}
          <div className="rounded-3xl bg-white dark:bg-[#25201C] border border-[#EFE8DD] dark:border-[#38322B] p-6 shadow-xs">
            <h2 className="font-display font-bold text-base text-[#2D2A26] dark:text-[#F3EDE2] mb-3">
              Add Water
            </h2>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { ml: 250, label: 'Cup', icon: '🥛' },
                { ml: 500, label: 'Bottle', icon: '💧' },
                { ml: 750, label: 'Large Bottle', icon: '🧊' }
              ].map((btn) => (
                <button
                  key={btn.ml}
                  onClick={() => addWater(btn.ml)}
                  className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#201C18] border border-[#EFE8DD] dark:border-[#38322B] hover:border-sky-300 hover:bg-sky-50/50 dark:hover:bg-sky-950/20 text-center transition-all group cursor-pointer"
                >
                  <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                    {btn.icon}
                  </div>
                  <div className="text-xs font-bold text-[#2D2A26] dark:text-[#F3EDE2]">
                    +{btn.ml} ml
                  </div>
                  <span className="text-[10px] text-[#8C827A]">{btn.label}</span>
                </button>
              ))}
            </div>

            {/* Custom Log Input */}
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Custom amount in ml..."
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="flex-1 bg-[#FAF7F2] dark:bg-[#201C18] border border-[#EFE8DD] dark:border-[#38322B] rounded-xl px-3 py-2 text-xs text-[#2D2A26] dark:text-[#F3EDE2]"
              />
              <button
                onClick={() => {
                  const val = parseInt(customAmount, 10);
                  if (val > 0) {
                    addWater(val);
                    setCustomAmount('');
                  }
                }}
                className="bg-sky-500 hover:bg-sky-600 text-white font-medium text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Log Water
              </button>
            </div>
          </div>

          {/* Today's Logged History */}
          <div className="rounded-3xl bg-white dark:bg-[#25201C] border border-[#EFE8DD] dark:border-[#38322B] p-6 shadow-xs">
            <h2 className="font-display font-bold text-base text-[#2D2A26] dark:text-[#F3EDE2] mb-3">
              Today's Water Entries
            </h2>

            {dayEntries.length === 0 ? (
              <p className="text-xs text-[#8C827A] py-6 text-center italic">
                No water logged yet today. Your first sip starts here 💧
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {dayEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#201C18] border border-[#EFE8DD] dark:border-[#38322B] text-xs"
                  >
                    <span className="flex items-center gap-2 font-semibold text-[#2D2A26] dark:text-[#F3EDE2]">
                      <Droplet className="w-3.5 h-3.5 text-sky-500" />
                      +{entry.amountMl} ml
                    </span>
                    <span className="text-[11px] text-[#8C827A] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
