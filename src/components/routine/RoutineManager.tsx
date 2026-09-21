import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RoutinePeriod, RoutineTask } from '../../types';
import { Plus, Trash2, CheckCircle2, Circle, Clock, Sparkles } from 'lucide-react';

export const RoutineManager: React.FC = () => {
  const {
    routines,
    toggleRoutineTask,
    addRoutineTask,
    deleteRoutineTask,
    selectedDate,
    isToday
  } = useApp();

  const [activePeriod, setActivePeriod] = useState<RoutinePeriod>('morning');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newIcon, setNewIcon] = useState('🌸');
  const [newPeriod, setNewPeriod] = useState<RoutinePeriod>('morning');

  const periodConfig: Record<RoutinePeriod, { label: string; icon: string; bg: string; border: string }> = {
    morning: { label: 'Morning Routine', icon: '☀️', bg: 'from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20', border: 'border-amber-200 dark:border-amber-900/40' },
    day: { label: 'Day Routine', icon: '🌤️', bg: 'from-sky-50 to-blue-50 dark:from-sky-950/20 dark:to-blue-950/20', border: 'border-sky-200 dark:border-sky-900/40' },
    night: { label: 'Night Routine', icon: '🌙', bg: 'from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20', border: 'border-indigo-200 dark:border-indigo-900/40' }
  };

  const currentTasks = routines.filter(r => r.period === activePeriod);
  const completedCount = currentTasks.filter(r => r.completedDates?.includes(selectedDate) || (r.completed && isToday)).length;
  const totalCount = currentTasks.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    await addRoutineTask({
      title: newTitle.trim(),
      period: newPeriod,
      time: newTime || undefined,
      icon: newIcon || '🌸'
    });

    setNewTitle('');
    setNewTime('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#2D2A26] dark:text-[#F3EDE2] tracking-tight">
            Routine Manager 📋
          </h1>
          <p className="text-sm text-[#7C7268] dark:text-[#A89E94]">
            Build rhythms that comfort and inspire you every day.
          </p>
        </div>

        <button
          onClick={() => {
            setNewPeriod(activePeriod);
            setIsAddModalOpen(true);
          }}
          className="self-start sm:self-auto flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-98 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Routine Step
        </button>
      </div>

      {/* Routine Period Switcher Cards */}
      <div className="grid grid-cols-3 gap-3">
        {(['morning', 'day', 'night'] as RoutinePeriod[]).map((p) => {
          const cfg = periodConfig[p];
          const count = routines.filter(r => r.period === p).length;
          const done = routines.filter(r => r.period === p && (r.completedDates?.includes(selectedDate) || (r.completed && isToday))).length;
          const isSelected = activePeriod === p;

          return (
            <button
              key={p}
              onClick={() => setActivePeriod(p)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isSelected
                  ? `bg-gradient-to-br ${cfg.bg} ${cfg.border} shadow-2xs scale-[1.01]`
                  : 'bg-white dark:bg-[#25201C] border-[#EFE8DD] dark:border-[#38322B] opacity-80 hover:opacity-100'
              }`}
            >
              <div className="text-2xl mb-1">{cfg.icon}</div>
              <div className="font-display font-bold text-sm sm:text-base text-[#2D2A26] dark:text-[#F3EDE2]">
                {cfg.label.split(' ')[0]}
              </div>
              <div className="text-xs text-[#8C827A] dark:text-[#A89E94] mt-1">
                {done} / {count} completed
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Routine Card */}
      <div className="rounded-3xl bg-white dark:bg-[#25201C] border border-[#EFE8DD] dark:border-[#38322B] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#EFE8DD] dark:border-[#2D2823]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{periodConfig[activePeriod].icon}</span>
              <h2 className="font-display font-bold text-lg text-[#2D2A26] dark:text-[#F3EDE2]">
                {periodConfig[activePeriod].label}
              </h2>
            </div>
            <p className="text-xs text-[#8C827A] dark:text-[#A89E94] mt-0.5">
              {progressPct === 100 ? 'Full cycle completed! 🌸' : `${completedCount} of ${totalCount} steps completed today`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-rose-600 dark:text-rose-400">
              {progressPct}%
            </span>
            <div className="w-32 bg-[#FAF7F2] dark:bg-[#1E1B18] h-2.5 rounded-full overflow-hidden border border-[#EFE8DD] dark:border-[#38322B]">
              <div
                className="bg-gradient-to-r from-rose-400 to-rose-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Task Checklist */}
        <div className="space-y-2.5 mt-5">
          {currentTasks.length === 0 ? (
            <div className="text-center py-12 text-[#8C827A] dark:text-[#A89E94]">
              <Sparkles className="w-8 h-8 text-rose-300 mx-auto mb-2 opacity-60" />
              <p className="text-sm font-medium">Build a routine that feels like you 🌷</p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-3 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
              >
                + Add your first step
              </button>
            </div>
          ) : (
            currentTasks.map((task) => {
              const isDone = task.completedDates?.includes(selectedDate) || (task.completed && isToday);
              return (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                    isDone
                      ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/40'
                      : 'bg-[#FAF7F2]/50 dark:bg-[#201C18] border-[#EFE8DD] dark:border-[#38322B] hover:border-rose-200'
                  }`}
                >
                  <div
                    onClick={() => toggleRoutineTask(task.id)}
                    className="flex items-center gap-3.5 flex-1 cursor-pointer"
                  >
                    <button className="focus:outline-none shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-rose-500 fill-rose-100 dark:fill-rose-950" />
                      ) : (
                        <Circle className="w-5 h-5 text-[#8C827A]/60 hover:text-rose-400" />
                      )}
                    </button>
                    <span className="text-lg">{task.icon || '🌸'}</span>
                    <span
                      className={`text-sm font-medium text-[#2D2A26] dark:text-[#F3EDE2] ${
                        isDone ? 'line-through text-[#8C827A] dark:text-[#9E948A]' : ''
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {task.time && (
                      <span className="text-xs text-[#8C827A] dark:text-[#9E948A] flex items-center gap-1 bg-white dark:bg-[#282420] px-2 py-1 rounded-lg border border-[#EFE8DD] dark:border-[#38322B]">
                        <Clock className="w-3 h-3" />
                        {task.time}
                      </span>
                    )}
                    <button
                      onClick={() => deleteRoutineTask(task.id)}
                      className="p-1.5 text-[#A3998F] hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Delete routine step"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add Step Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-[#FAF7F2] dark:bg-[#1E1B18] rounded-3xl border border-[#EFE8DD] dark:border-[#38322B] shadow-2xl p-6">
            <h2 className="font-display font-bold text-lg text-[#2D2A26] dark:text-[#F3EDE2] mb-4">
              Add Routine Step
            </h2>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-[#7C7268] dark:text-[#A89E94] block mb-1">
                  Step Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. 5-minute gratitude journal"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-white dark:bg-[#282420] border border-[#EFE8DD] dark:border-[#38322B] rounded-xl px-3 py-2 text-sm text-[#2D2A26] dark:text-[#F3EDE2] focus:outline-rose-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#7C7268] dark:text-[#A89E94] block mb-1">
                    Period
                  </label>
                  <select
                    value={newPeriod}
                    onChange={(e) => setNewPeriod(e.target.value as RoutinePeriod)}
                    className="w-full bg-white dark:bg-[#282420] border border-[#EFE8DD] dark:border-[#38322B] rounded-xl px-3 py-2 text-xs text-[#2D2A26] dark:text-[#F3EDE2]"
                  >
                    <option value="morning">☀️ Morning</option>
                    <option value="day">🌤️ Day</option>
                    <option value="night">🌙 Night</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#7C7268] dark:text-[#A89E94] block mb-1">
                    Target Time (optional)
                  </label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full bg-white dark:bg-[#282420] border border-[#EFE8DD] dark:border-[#38322B] rounded-xl px-3 py-2 text-xs text-[#2D2A26] dark:text-[#F3EDE2]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#7C7268] dark:text-[#A89E94] block mb-1.5">
                  Choose Icon
                </label>
                <div className="flex gap-2 flex-wrap">
                  {['☀️', '🛏️', '🍋', '🧴', '🥑', '🌿', '💧', '🧘', '🕯️', '📵', '🫖', '📖', '✍️', '🎵'].map((ic) => (
                    <button
                      type="button"
                      key={ic}
                      onClick={() => setNewIcon(ic)}
                      className={`text-lg p-2 rounded-xl border transition-all ${
                        newIcon === ic
                          ? 'bg-rose-100 border-rose-400 scale-110'
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
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#EFE8DD] dark:border-[#38322B] text-xs font-medium text-[#7C7268] hover:bg-black/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold"
                >
                  Save Step
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
