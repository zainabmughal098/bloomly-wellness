import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MoodType } from '../../types';
import { Smile, Heart, Sparkles, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { getDatesInRange } from '../../utils/analytics';

export const MoodTracker: React.FC = () => {
  const { mood, logMood, selectedDate } = useApp();

  const currentMood = mood.find(m => m.date === selectedDate);

  const [selectedMood, setSelectedMood] = useState<MoodType>(currentMood?.mood || 'good');
  const [note, setNote] = useState(currentMood?.note || '');
  const [tags, setTags] = useState<string[]>(currentMood?.tags || []);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const moodOptions: { id: MoodType; emoji: string; label: string; desc: string; color: string }[] = [
    { id: 'great', emoji: '😄', label: 'Great', desc: 'Radiant, energized & fulfilled', color: 'border-emerald-400 bg-emerald-50 text-emerald-800' },
    { id: 'good', emoji: '🙂', label: 'Good', desc: 'Calm, steady & content', color: 'border-sky-400 bg-sky-50 text-sky-800' },
    { id: 'okay', emoji: '😐', label: 'Okay', desc: 'Present, taking things step-by-step', color: 'border-amber-400 bg-amber-50 text-amber-800' },
    { id: 'low', emoji: '😔', label: 'Low', desc: 'A bit heavy or drained; needing tenderness', color: 'border-rose-400 bg-rose-50 text-rose-800' },
    { id: 'rough', emoji: '😫', label: 'Rough', desc: 'Challenging day; honoring my feelings', color: 'border-purple-400 bg-purple-50 text-purple-800' },
  ];

  const moodTagsList = [
    '🍃 Nature Walk', '☕ Warm Drink', '💬 Meaningful Talk', '💤 Good Sleep', 
    '🧘 Meditation', '💻 Deep Work', '🌧️ Heavy Thoughts', '💪 Workout', '🎨 Creative Time'
  ];

  const toggleTag = (t: string) => {
    setTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await logMood(selectedMood, note.trim() || undefined, tags);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2000);
  };

  // Weekly mood history
  const weekDates = getDatesInRange(7).reverse();
  const weekMoods = weekDates.map(d => {
    const m = mood.find(item => item.date === d);
    return { date: d, moodItem: m };
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#2D2A26] dark:text-[#F3EDE2] tracking-tight">
            Emotional Check-In 🌸
          </h1>
          <p className="text-sm text-[#7C7268] dark:text-[#A89E94]">
            All feelings are welcome here. Listen to what your heart needs.
          </p>
        </div>
      </div>

      {/* Mood Selector Section */}
      <div className="rounded-3xl bg-white dark:bg-[#25201C] border border-[#EFE8DD] dark:border-[#38322B] p-6 sm:p-8 shadow-xs">
        <h2 className="font-display font-bold text-base sm:text-lg text-[#2D2A26] dark:text-[#F3EDE2] mb-1">
          How are you feeling right now?
        </h2>
        <p className="text-xs text-[#8C827A] dark:text-[#A89E94] mb-5">
          Checking in on {selectedDate}
        </p>

        {isSavedNotice && (
          <div className="mb-4 p-3 bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-300 text-emerald-800 dark:text-emerald-200 rounded-xl text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Your check-in has been gently saved ✨
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          {moodOptions.map((opt) => {
            const isSelected = selectedMood === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setSelectedMood(opt.id)}
                className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                  isSelected
                    ? `${opt.color} dark:bg-black/30 scale-105 shadow-xs font-semibold`
                    : 'bg-[#FAF7F2]/60 dark:bg-[#201C18] border-[#EFE8DD] dark:border-[#38322B] text-[#7C7268] hover:border-violet-300'
                }`}
              >
                <span className="text-3xl mb-1.5">{opt.emoji}</span>
                <span className="text-sm font-display font-bold text-[#2D2A26] dark:text-[#F3EDE2]">
                  {opt.label}
                </span>
                <span className="text-[10px] text-[#8C827A] dark:text-[#A89E94] mt-1 leading-tight line-clamp-2">
                  {opt.desc}
                </span>
              </button>
            );
          })}
        </div>

        {/* Form Details */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-[#7C7268] dark:text-[#A89E94] block mb-2">
              What contributed to this feeling? (Helpful tags)
            </label>
            <div className="flex flex-wrap gap-2">
              {moodTagsList.map((tag) => {
                const isSelected = tags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                      isSelected
                        ? 'bg-violet-100 dark:bg-violet-950/60 border-violet-300 text-violet-800 dark:text-violet-200 font-semibold'
                        : 'bg-[#FAF7F2] dark:bg-[#201C18] border-[#EFE8DD] dark:border-[#38322B] text-[#7C7268]'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[#7C7268] dark:text-[#A89E94] block mb-1.5">
              Personal reflection or gentle note
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Taking time to drink tea peacefully made today feel much softer..."
              className="w-full bg-[#FAF7F2] dark:bg-[#201C18] border border-[#EFE8DD] dark:border-[#38322B] rounded-2xl p-3.5 text-xs text-[#2D2A26] dark:text-[#F3EDE2] focus:outline-violet-400"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-white font-medium text-xs px-6 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Save Check-in
          </button>
        </form>
      </div>

      {/* Weekly Mood Landscape */}
      <div className="rounded-3xl bg-white dark:bg-[#25201C] border border-[#EFE8DD] dark:border-[#38322B] p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-bold text-base text-[#2D2A26] dark:text-[#F3EDE2]">
              Weekly Mood Landscape
            </h2>
            <p className="text-xs text-[#8C827A] dark:text-[#A89E94]">
              A snapshot of your emotional weather over the last 7 days
            </p>
          </div>
          <span className="text-xs font-semibold text-violet-600 dark:text-violet-400">
            {mood.filter(m => weekDates.includes(m.date)).length} / 7 checked in
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekMoods.map(({ date, moodItem }) => {
            const d = new Date(date + 'T00:00:00');
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
            const emoji = moodItem ? (
              moodItem.mood === 'great' ? '😄' :
              moodItem.mood === 'good' ? '🙂' :
              moodItem.mood === 'okay' ? '😐' :
              moodItem.mood === 'low' ? '😔' : '😫'
            ) : '—';

            return (
              <div
                key={date}
                className="p-3 rounded-2xl bg-[#FAF7F2] dark:bg-[#201C18] border border-[#EFE8DD] dark:border-[#38322B] text-center flex flex-col items-center justify-center gap-1"
              >
                <span className="text-[11px] font-semibold text-[#8C827A] dark:text-[#9E948A]">
                  {dayName}
                </span>
                <span className="text-2xl my-1">{emoji}</span>
                <span className="text-[10px] text-[#A3998F] capitalize truncate max-w-full">
                  {moodItem ? moodItem.mood : 'No log'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
