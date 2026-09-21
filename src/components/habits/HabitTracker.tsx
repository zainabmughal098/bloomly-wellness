import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Flame, Award, Trash2, Check, Sparkles } from 'lucide-react';
import { getDatesInRange } from '../../utils/analytics';

export const HabitTracker: React.FC = () => {
  const { habits, toggleHabitDay, addHabit, deleteHabit } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [habitName, setHabitName] = useState('');
  const [habitIcon, setHabitIcon] = useState('🌱');
  const [frequency, setFrequency] = useState<'daily' | 'weekdays' | 'weekends'>('daily');

  // Last 7 days for the weekly calendar row (Monday to Sunday)
  const weekDates = getDatesInRange(7).reverse(); // from 6 days ago to today

  const handleAddHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!habitName.trim()) return;
    await addHabit(habitName.trim(), habitIcon, frequency);
    setHabitName('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#2D2A26] dark:text-[#F3EDE2] tracking-tight">
            Habit Consistency 🌱
          </h1>
          <p className="text-sm text-[#7C7268] dark:text-[#A89E94]">
            Small daily practices bloom into lasting wellbeing.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="self-start sm:self-auto flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-98 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create New Habit
        </button>
      </div>

      {/* Habits List */}
      <div className="space-y-4">
        {habits.map((habit) => {
          return (
            <div
              key={habit.id}
              className="rounded-3xl bg-white dark:bg-[#25201C] border border-[#EFE8DD] dark:border-[#38322B] p-5 shadow-xs transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left: Info & Streak */}
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center text-2xl">
                    {habit.icon || '🌱'}
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-base text-[#2D2A26] dark:text-[#F3EDE2]">
                      {habit.name}
                    </h2>
                    <div className="flex items-center gap-3 text-xs text-[#8C827A] dark:text-[#9E948A] mt-0.5">
                      <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                        <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        {habit.currentStreak} day streak
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-rose-400" />
                        Best: {habit.longestStreak} days
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: 7-day M T W T F S S check-in row */}
                <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-2.5 overflow-x-auto py-1">
                  {weekDates.map((dateStr) => {
                    const d = new Date(dateStr + 'T00:00:00');
                    const dayLetter = d.toLocaleDateString('en-US', { weekday: 'narrow' });
                    const dayNum = d.getDate();
                    const isChecked = habit.completedDates?.includes(dateStr);
                    const isCurrentDate = dateStr === new Date().toISOString().split('T')[0];

                    return (
                      <div key={dateStr} className="flex flex-col items-center gap-1">
                        <span className="text-[10px] font-semibold text-[#8C827A] dark:text-[#A89E94]">
                          {dayLetter}
                        </span>
                        <button
                          onClick={() => toggleHabitDay(habit.id, dateStr)}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-semibold border transition-all ${
                            isChecked
                              ? 'bg-emerald-500 border-emerald-600 text-white shadow-xs scale-105'
                              : isCurrentDate
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-800 dark:text-emerald-200'
                              : 'bg-[#FAF7F2] dark:bg-[#201C18] border-[#EFE8DD] dark:border-[#38322B] text-[#8C827A] hover:border-emerald-300'
                          }`}
                          title={`${d.toLocaleDateString()}: ${isChecked ? 'Completed' : 'Not completed'}`}
                        >
                          {isChecked ? (
                            <span className="text-sm">🌸</span>
                          ) : (
                            <span>{dayNum}</span>
                          )}
                        </button>
                      </div>
                    );
                  })}

                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="ml-2 p-2 text-[#A3998F] hover:text-rose-500 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Delete habit"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Habit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-[#FAF7F2] dark:bg-[#1E1B18] rounded-3xl border border-[#EFE8DD] dark:border-[#38322B] shadow-2xl p-6">
            <h2 className="font-display font-bold text-lg text-[#2D2A26] dark:text-[#F3EDE2] mb-4">
              Create New Habit
            </h2>
            <form onSubmit={handleAddHabit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-[#7C7268] dark:text-[#A89E94] block mb-1">
                  Habit Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. 10 pages mindful reading"
                  value={habitName}
                  onChange={(e) => setHabitName(e.target.value)}
                  className="w-full bg-white dark:bg-[#282420] border border-[#EFE8DD] dark:border-[#38322B] rounded-xl px-3 py-2 text-sm text-[#2D2A26] dark:text-[#F3EDE2] focus:outline-rose-400"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#7C7268] dark:text-[#A89E94] block mb-1">
                  Frequency
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'daily', label: 'Every Day' },
                    { id: 'weekdays', label: 'Weekdays' },
                    { id: 'weekends', label: 'Weekends' }
                  ].map((f) => (
                    <button
                      type="button"
                      key={f.id}
                      onClick={() => setFrequency(f.id as any)}
                      className={`py-2 text-xs font-medium rounded-xl border text-center transition-all ${
                        frequency === f.id
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 text-emerald-900 dark:text-emerald-200'
                          : 'bg-white dark:bg-[#282420] border-[#EFE8DD] dark:border-[#38322B] text-[#7C7268]'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#7C7268] dark:text-[#A89E94] block mb-1.5">
                  Choose Icon
                </label>
                <div className="flex gap-2 flex-wrap">
                  {['🌱', '💧', '📖', '🧘', '🌿', '🚶', '🧴', '🍵', '✍️', '🍎', '💤', '🕯️'].map((ic) => (
                    <button
                      type="button"
                      key={ic}
                      onClick={() => setHabitIcon(ic)}
                      className={`text-lg p-2 rounded-xl border transition-all ${
                        habitIcon === ic
                          ? 'bg-emerald-100 border-emerald-400 scale-110'
                          : 'bg-white dark:bg-[#282420] border-[#EFE8DD] dark:border-[#38322B]'
                      }`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#EFE8DD] dark:border-[#38322B] text-xs font-medium text-[#7C7268] hover:bg-black/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                >
                  Save Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
