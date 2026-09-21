import React, { useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateWeeklyStats } from '../../utils/analytics';
import { X, Download, Share2, Sparkles, Heart, Award, Droplet, Footprints, Moon, Check } from 'lucide-react';
import { BloomFlower } from '../common/BloomFlower';

export const WeeklyWrappedModal: React.FC = () => {
  const {
    isWeeklyWrappedOpen,
    setIsWeeklyWrappedOpen,
    routines,
    water,
    exercise,
    meals,
    sleep,
    habits,
    mood,
    preferences
  } = useApp();

  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isWeeklyWrappedOpen) return null;

  const stats = calculateWeeklyStats(
    routines,
    water,
    exercise,
    meals,
    sleep,
    habits,
    mood,
    preferences
  );

  // Client-side canvas export for the 9:16 story card
  const handleDownloadCard = () => {
    const cardEl = cardRef.current;
    if (!cardEl) return;

    // Create a high-resolution canvas to draw the card
    const canvas = document.createElement('canvas');
    const scale = 2;
    canvas.width = 360 * scale;
    canvas.height = 640 * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(scale, scale);

    // Draw background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 640);
    grad.addColorStop(0, '#FFF1F2'); // rose-50
    grad.addColorStop(0.5, '#FAF7F2'); // cream
    grad.addColorStop(1, '#FEF3C7'); // amber-100
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 360, 640);

    // Card border
    ctx.strokeStyle = '#F43F5E';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(16, 16, 328, 608);

    // Title & Header
    ctx.fillStyle = '#E11D48';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('BLOOMly 🌷 WEEKLY WRAPPED', 180, 48);

    ctx.fillStyle = '#1E1B18';
    ctx.font = 'bold 24px serif';
    ctx.fillText(`A week of gentle care`, 180, 80);

    ctx.fillStyle = '#7C7268';
    ctx.font = '13px sans-serif';
    ctx.fillText(`Prepared for ${preferences.name || 'Friend'}`, 180, 102);

    // Big score block
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(40, 125, 280, 85);
    ctx.strokeStyle = '#FFE4E6';
    ctx.strokeRect(40, 125, 280, 85);

    ctx.fillStyle = '#E11D48';
    ctx.font = 'bold 36px serif';
    ctx.fillText(`${stats.averageBloom}%`, 180, 165);

    ctx.fillStyle = '#881337';
    ctx.font = '12px sans-serif';
    ctx.fillText('Average Weekly Bloom', 180, 190);

    // Stats Rows
    const items = [
      { icon: '🚶 Steps Walked', val: `${stats.totalSteps.toLocaleString()} steps (~${(stats.totalSteps * 0.00075).toFixed(1)} km)` },
      { icon: '💧 Hydration Total', val: `${(stats.totalWaterMl / 1000).toFixed(1)} Liters` },
      { icon: '🏃 Movement Time', val: `${stats.totalMovementMinutes} active minutes` },
      { icon: '🌙 Rest & Sleep', val: `${stats.averageSleepHours} hours avg / night` },
      { icon: '🌱 Routine Tasks', val: `${stats.completedRoutineCount} mindful steps done` },
    ];

    let y = 240;
    items.forEach(it => {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(40, y, 280, 48);
      ctx.strokeStyle = '#F3EDE2';
      ctx.strokeRect(40, y, 280, 48);

      ctx.fillStyle = '#2D2A26';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(it.icon, 52, y + 20);

      ctx.fillStyle = '#E11D48';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(it.val, 52, y + 38);

      y += 58;
    });

    // Footer
    ctx.textAlign = 'center';
    ctx.fillStyle = '#8C827A';
    ctx.font = 'italic 11px sans-serif';
    ctx.fillText('"Every small step nurtures your flower."', 180, 580);
    ctx.fillText('Bloomly — Your Daily Wellness Companion', 180, 600);

    // Trigger download
    const link = document.createElement('a');
    link.download = `Bloomly-Weekly-Wrapped-${new Date().toISOString().split('T')[0]}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Bloomly Weekly Wrapped 🌷',
        text: `I bloomed at an average of ${stats.averageBloom}% this week with Bloomly! Loving this gentle local wellness companion.`
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(
        `🌷 My Bloomly Weekly Wrapped:\n✨ Average Bloom: ${stats.averageBloom}%\n🚶 Steps: ${stats.totalSteps.toLocaleString()}\n💧 Water: ${(stats.totalWaterMl / 1000).toFixed(1)}L\n🌸 Track your days offline with Bloomly!`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#FAF7F2] dark:bg-[#1E1B18] rounded-3xl border border-[#EFE8DD] dark:border-[#38322B] shadow-2xl overflow-hidden my-6">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EFE8DD] dark:border-[#2D2823]">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎁</span>
            <h2 className="font-display font-bold text-lg text-[#2D2A26] dark:text-[#F3EDE2]">
              Weekly Wrapped
            </h2>
          </div>
          <button
            onClick={() => setIsWeeklyWrappedOpen(false)}
            className="p-1.5 rounded-full text-[#8C827A] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Card Preview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left: 9:16 Visual Instagram Story Style Card */}
            <div className="md:col-span-6 flex justify-center">
              <div
                ref={cardRef}
                className="w-full max-w-[280px] aspect-[9/16] rounded-3xl bg-gradient-to-b from-rose-100/90 via-white to-amber-100/70 dark:from-[#2E2024] dark:via-[#221C18] dark:to-[#2B231A] border-2 border-rose-300 dark:border-rose-900/60 p-5 flex flex-col justify-between shadow-xl relative overflow-hidden"
              >
                {/* Header tag */}
                <div className="text-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">
                    BLOOMly 🌷 WRAPPED
                  </span>
                  <h3 className="font-display font-bold text-base text-[#2D2A26] dark:text-[#F3EDE2] mt-0.5">
                    A week of gentle care
                  </h3>
                  <span className="text-[10px] text-[#8C827A]">
                    {preferences.name || 'Friend'}
                  </span>
                </div>

                {/* Center Bloom Flower & Score */}
                <div className="text-center py-2">
                  <div className="flex justify-center mb-1">
                    <BloomFlower
                      score={stats.averageBloom}
                      stage="blooming"
                      flowerType={preferences.selectedFlower}
                      size={100}
                    />
                  </div>
                  <div className="font-display font-extrabold text-3xl text-rose-600 dark:text-rose-400">
                    {stats.averageBloom}%
                  </div>
                  <span className="text-[11px] font-medium text-[#4A423B] dark:text-[#D4C9BC]">
                    Weekly Average Bloom
                  </span>
                </div>

                {/* 4 Mini Stat Pills */}
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between p-1.5 rounded-xl bg-white/80 dark:bg-[#282420]/80 border border-[#EFE8DD] dark:border-[#38322B]">
                    <span className="text-[#7C7268] flex items-center gap-1">
                      <Footprints className="w-3 h-3 text-emerald-500" />
                      Steps
                    </span>
                    <span className="font-bold text-[#2D2A26] dark:text-[#F3EDE2]">
                      {stats.totalSteps.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-1.5 rounded-xl bg-white/80 dark:bg-[#282420]/80 border border-[#EFE8DD] dark:border-[#38322B]">
                    <span className="text-[#7C7268] flex items-center gap-1">
                      <Droplet className="w-3 h-3 text-sky-500" />
                      Hydration
                    </span>
                    <span className="font-bold text-[#2D2A26] dark:text-[#F3EDE2]">
                      {(stats.totalWaterMl / 1000).toFixed(1)} L
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-1.5 rounded-xl bg-white/80 dark:bg-[#282420]/80 border border-[#EFE8DD] dark:border-[#38322B]">
                    <span className="text-[#7C7268] flex items-center gap-1">
                      <Moon className="w-3 h-3 text-indigo-400" />
                      Sleep Avg
                    </span>
                    <span className="font-bold text-[#2D2A26] dark:text-[#F3EDE2]">
                      {stats.averageSleepHours}h
                    </span>
                  </div>
                </div>

                <div className="text-center pt-1 border-t border-rose-200/60 dark:border-rose-900/40">
                  <span className="text-[9px] text-[#8C827A] italic">
                    Bloomly — Your Daily Wellness Companion
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Highlights & Action Buttons */}
            <div className="md:col-span-6 space-y-4">
              <div>
                <h3 className="font-display font-bold text-lg text-[#2D2A26] dark:text-[#F3EDE2]">
                  Celebrate Your Progress 🌸
                </h3>
                <p className="text-xs text-[#7C7268] dark:text-[#A89E94] mt-1 leading-relaxed">
                  Look at everything you poured love into over the past 7 days. Consistency isn't about perfection; it's about returning with kindness.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-2xl bg-white dark:bg-[#25201C] border border-[#EFE8DD] dark:border-[#38322B]">
                  <span className="font-bold text-rose-600 dark:text-rose-400 block mb-0.5">
                    ✨ {(stats.totalSteps * 0.00075).toFixed(1)} km Walked
                  </span>
                  <span className="text-[#7C7268] dark:text-[#A89E94]">
                    Equivalent to taking a scenic journey through a blooming botanical garden!
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-white dark:bg-[#25201C] border border-[#EFE8DD] dark:border-[#38322B]">
                  <span className="font-bold text-sky-600 dark:text-sky-400 block mb-0.5">
                    💧 {(stats.totalWaterMl / 1000).toFixed(1)} Liters of Water
                  </span>
                  <span className="text-[#7C7268] dark:text-[#A89E94]">
                    You replenished your cells and nurtured your inner vitality.
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-white dark:bg-[#25201C] border border-[#EFE8DD] dark:border-[#38322B]">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-0.5">
                    🌱 {stats.completedRoutineCount} Mindful Steps Completed
                  </span>
                  <span className="text-[#7C7268] dark:text-[#A89E94]">
                    Morning, day, and evening moments made just for you.
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <button
                  onClick={handleDownloadCard}
                  className="flex-1 py-3 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Save Story Card PNG
                </button>

                <button
                  onClick={handleShare}
                  className="flex-1 py-3 px-4 rounded-xl bg-white dark:bg-[#25201C] border border-[#EFE8DD] dark:border-[#38322B] text-[#2D2A26] dark:text-[#F3EDE2] font-semibold text-xs flex items-center justify-center gap-2 hover:border-rose-300 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                  {copied ? 'Copied summary!' : 'Share Highlights'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
