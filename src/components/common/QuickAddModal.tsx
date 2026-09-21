import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Droplet, Utensils, Activity, Footprints, Smile, Moon, Check } from 'lucide-react';
import { MealCategory, MoodType } from '../../types';

export const QuickAddModal: React.FC = () => {
  const {
    isQuickAddOpen,
    setIsQuickAddOpen,
    addWater,
    addMeal,
    addExercise,
    addSteps,
    logSleep,
    logMood,
    selectedDate
  } = useApp();

  const [activeTab, setActiveTab] = useState<'water' | 'meal' | 'movement' | 'steps' | 'mood' | 'sleep'>('water');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Water state
  const [customWater, setCustomWater] = useState('');

  // Meal state
  const [mealCategory, setMealCategory] = useState<MealCategory>('breakfast');
  const [mealName, setMealName] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const foodGroups = [
    { id: 'veggies', label: '🥦 Vegetables' },
    { id: 'fruit', label: '🍎 Fruit' },
    { id: 'protein', label: '🥚 Protein' },
    { id: 'grains', label: '🌾 Grains' },
    { id: 'dairy', label: '🥛 Dairy' },
    { id: 'treat', label: '🍫 Treat' },
  ];

  // Movement state
  const [activityType, setActivityType] = useState('Walking');
  const [duration, setDuration] = useState('25');
  const [moveSteps, setMoveSteps] = useState('');

  // Steps state
  const [stepsInput, setStepsInput] = useState('1000');

  // Mood state
  const [moodType, setMoodType] = useState<MoodType>('good');
  const [moodNote, setMoodNote] = useState('');

  // Sleep state
  const [bedtime, setBedtime] = useState('23:00');
  const [wakeTime, setWakeTime] = useState('07:30');

  if (!isQuickAddOpen) return null;

  const showNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => {
      setSuccessMessage(null);
      setIsQuickAddOpen(false);
    }, 1200);
  };

  const handleLogWater = async (amount: number) => {
    await addWater(amount);
    showNotification(`Added ${amount} ml water 💧`);
  };

  const handleSaveMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealName.trim()) return;
    await addMeal({
      category: mealCategory,
      name: mealName.trim(),
      foodGroups: selectedGroups
    });
    setMealName('');
    showNotification(`Logged ${mealCategory} 🥗`);
  };

  const handleSaveMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    const dur = parseInt(duration, 10) || 15;
    const st = moveSteps ? parseInt(moveSteps, 10) : undefined;
    await addExercise({
      activityType,
      durationMinutes: dur,
      steps: st
    });
    showNotification(`Logged ${dur}m of ${activityType} 🏃`);
  };

  const handleSaveSteps = async (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(stepsInput, 10) || 500;
    await addSteps(count);
    showNotification(`Added ${count.toLocaleString()} steps 🚶`);
  };

  const handleSaveMood = async () => {
    await logMood(moodType, moodNote.trim() || undefined);
    showNotification('Logged your mood check-in ✨');
  };

  const handleSaveSleep = async (e: React.FormEvent) => {
    e.preventDefault();
    await logSleep(bedtime, wakeTime);
    showNotification('Logged sleep hours 😴');
  };

  const toggleGroup = (id: string) => {
    setSelectedGroups((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-0 sm:p-4">
      <div 
        className="w-full sm:max-w-lg bg-[#FAF7F2] dark:bg-[#1E1B18] rounded-t-3xl sm:rounded-3xl border border-[#EFE8DD] dark:border-[#38322B] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#EFE8DD] dark:border-[#2D2823]">
          <div className="flex items-center gap-2">
            <span className="text-lg">✨</span>
            <h2 className="font-display font-bold text-lg text-[#2D2A26] dark:text-[#F3EDE2]">
              Quick Wellness Log
            </h2>
          </div>
          <button
            onClick={() => setIsQuickAddOpen(false)}
            className="p-1.5 rounded-full text-[#8C827A] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center justify-between gap-1 px-4 py-2 bg-white/60 dark:bg-[#25201C] border-b border-[#EFE8DD] dark:border-[#2D2823] overflow-x-auto text-xs font-semibold">
          {[
            { id: 'water', label: 'Water', icon: Droplet, color: 'text-sky-500' },
            { id: 'meal', label: 'Meal', icon: Utensils, color: 'text-amber-500' },
            { id: 'movement', label: 'Movement', icon: Activity, color: 'text-rose-500' },
            { id: 'steps', label: 'Steps', icon: Footprints, color: 'text-emerald-500' },
            { id: 'mood', label: 'Mood', icon: Smile, color: 'text-violet-500' },
            { id: 'sleep', label: 'Sleep', icon: Moon, color: 'text-indigo-400' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all shrink-0 ${
                  isActive
                    ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 shadow-2xs'
                    : 'text-[#7C7268] dark:text-[#A89E94] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${tab.color}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Success Toast */}
        {successMessage && (
          <div className="mx-4 my-3 p-3 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-xl text-xs font-medium flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            {successMessage}
          </div>
        )}

        {/* Tab Body */}
        <div className="p-5 max-h-[70vh] overflow-y-auto">
          {/* WATER TAB */}
          {activeTab === 'water' && (
            <div className="space-y-4">
              <p className="text-xs text-[#7C7268] dark:text-[#A89E94]">
                Choose a quick preset or enter custom milliliters:
              </p>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { ml: 250, label: 'Cup (250 ml)', emoji: '🥛' },
                  { ml: 500, label: 'Bottle (500 ml)', emoji: '💧' },
                  { ml: 750, label: 'Large (750 ml)', emoji: '🧊' }
                ].map((preset) => (
                  <button
                    key={preset.ml}
                    onClick={() => handleLogWater(preset.ml)}
                    className="p-3.5 rounded-2xl bg-white dark:bg-[#282420] border border-[#EFE8DD] dark:border-[#38322B] hover:border-sky-300 hover:bg-sky-50/50 dark:hover:bg-sky-950/20 text-center transition-all group"
                  >
                    <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                      {preset.emoji}
                    </div>
                    <div className="text-xs font-semibold text-[#2D2A26] dark:text-[#F3EDE2]">
                      +{preset.ml} ml
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <label className="text-xs font-medium text-[#7C7268] dark:text-[#A89E94] block mb-1.5">
                  Custom Milliliters
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="e.g. 350"
                    value={customWater}
                    onChange={(e) => setCustomWater(e.target.value)}
                    className="flex-1 bg-white dark:bg-[#282420] border border-[#EFE8DD] dark:border-[#38322B] rounded-xl px-3 py-2 text-sm text-[#2D2A26] dark:text-[#F3EDE2] focus:outline-rose-400"
                  />
                  <button
                    onClick={() => {
                      const val = parseInt(customWater, 10);
                      if (val > 0) {
                        handleLogWater(val);
                        setCustomWater('');
                      }
                    }}
                    className="bg-sky-500 hover:bg-sky-600 text-white font-medium text-xs px-4 py-2 rounded-xl transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MEAL TAB */}
          {activeTab === 'meal' && (
            <form onSubmit={handleSaveMeal} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-[#7C7268] dark:text-[#A89E94] block mb-1.5">
                  Meal Category
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'breakfast', label: '🌅 Breakfast' },
                    { id: 'lunch', label: '☀️ Lunch' },
                    { id: 'dinner', label: '🌙 Dinner' },
                    { id: 'snack', label: '🍓 Snack' }
                  ].map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setMealCategory(cat.id as MealCategory)}
                      className={`text-xs font-medium py-2 px-1 rounded-xl border text-center transition-all ${
                        mealCategory === cat.id
                          ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200'
                          : 'bg-white dark:bg-[#282420] border-[#EFE8DD] dark:border-[#38322B] text-[#7C7268] dark:text-[#A89E94]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#7C7268] dark:text-[#A89E94] block mb-1.5">
                  What did you enjoy?
                </label>
                <input
                  type="text"
                  placeholder="e.g. Avocado Toast + Soft Poached Egg"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  className="w-full bg-white dark:bg-[#282420] border border-[#EFE8DD] dark:border-[#38322B] rounded-xl px-3 py-2 text-sm text-[#2D2A26] dark:text-[#F3EDE2] focus:outline-rose-400"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#7C7268] dark:text-[#A89E94] block mb-1.5">
                  Food Groups (Positive nourishing tags)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {foodGroups.map((grp) => {
                    const isSelected = selectedGroups.includes(grp.id);
                    return (
                      <button
                        type="button"
                        key={grp.id}
                        onClick={() => toggleGroup(grp.id)}
                        className={`text-xs font-medium px-2.5 py-1.5 rounded-full border transition-all ${
                          isSelected
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200'
                            : 'bg-white dark:bg-[#282420] border-[#EFE8DD] dark:border-[#38322B] text-[#7C7268] dark:text-[#A89E94]'
                        }`}
                      >
                        {grp.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium text-xs py-2.5 rounded-xl transition-colors"
              >
                Log Nourishing Meal
              </button>
            </form>
          )}

          {/* MOVEMENT TAB */}
          {activeTab === 'movement' && (
            <form onSubmit={handleSaveMovement} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-[#7C7268] dark:text-[#A89E94] block mb-1.5">
                  Activity
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Walking', 'Running', 'Gym', 'Yoga', 'Pilates', 'Cycling', 'Stretching', 'Sports', 'Other'].map((act) => (
                    <button
                      type="button"
                      key={act}
                      onClick={() => setActivityType(act)}
                      className={`text-xs font-medium py-2 rounded-xl border text-center transition-all ${
                        activityType === act
                          ? 'bg-rose-100 dark:bg-rose-950/60 border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-200'
                          : 'bg-white dark:bg-[#282420] border-[#EFE8DD] dark:border-[#38322B] text-[#7C7268] dark:text-[#A89E94]'
                      }`}
                    >
                      {act}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#7C7268] dark:text-[#A89E94] block mb-1.5">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-white dark:bg-[#282420] border border-[#EFE8DD] dark:border-[#38322B] rounded-xl px-3 py-2 text-sm text-[#2D2A26] dark:text-[#F3EDE2]"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#7C7268] dark:text-[#A89E94] block mb-1.5">
                    Steps (optional)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 2400"
                    value={moveSteps}
                    onChange={(e) => setMoveSteps(e.target.value)}
                    className="w-full bg-white dark:bg-[#282420] border border-[#EFE8DD] dark:border-[#38322B] rounded-xl px-3 py-2 text-sm text-[#2D2A26] dark:text-[#F3EDE2]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-medium text-xs py-2.5 rounded-xl transition-colors"
              >
                Log Movement
              </button>
            </form>
          )}

          {/* STEPS TAB */}
          {activeTab === 'steps' && (
            <form onSubmit={handleSaveSteps} className="space-y-4">
              <p className="text-xs text-[#7C7268] dark:text-[#A89E94]">
                Quick step increment or total count:
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: '+500', count: 500 },
                  { label: '+1,000', count: 1000 },
                  { label: '+2,500', count: 2500 },
                ].map((p) => (
                  <button
                    type="button"
                    key={p.count}
                    onClick={() => {
                      addSteps(p.count);
                      showNotification(`Added ${p.label} steps 🚶`);
                    }}
                    className="p-3 bg-white dark:bg-[#282420] border border-[#EFE8DD] dark:border-[#38322B] rounded-xl text-center hover:border-emerald-300 font-semibold text-xs text-[#2D2A26] dark:text-[#F3EDE2]"
                  >
                    {p.label} steps
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs font-medium text-[#7C7268] dark:text-[#A89E94] block mb-1.5">
                  Custom Step Count to Add
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={stepsInput}
                    onChange={(e) => setStepsInput(e.target.value)}
                    className="flex-1 bg-white dark:bg-[#282420] border border-[#EFE8DD] dark:border-[#38322B] rounded-xl px-3 py-2 text-sm text-[#2D2A26] dark:text-[#F3EDE2]"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-xs px-4 py-2 rounded-xl transition-colors"
                  >
                    Add Steps
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* MOOD TAB */}
          {activeTab === 'mood' && (
            <div className="space-y-4">
              <p className="text-xs text-[#7C7268] dark:text-[#A89E94]">
                How are you feeling right now?
              </p>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { id: 'great', label: 'Great', emoji: '😄' },
                  { id: 'good', label: 'Good', emoji: '🙂' },
                  { id: 'okay', label: 'Okay', emoji: '😐' },
                  { id: 'low', label: 'Low', emoji: '😔' },
                  { id: 'rough', label: 'Rough', emoji: '😫' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMoodType(m.id as MoodType)}
                    className={`flex flex-col items-center p-3 rounded-2xl border transition-all ${
                      moodType === m.id
                        ? 'bg-violet-100 dark:bg-violet-950/60 border-violet-400 text-violet-900 dark:text-violet-200 scale-105 shadow-2xs'
                        : 'bg-white dark:bg-[#282420] border-[#EFE8DD] dark:border-[#38322B] text-[#7C7268] dark:text-[#A89E94]'
                    }`}
                  >
                    <span className="text-2xl mb-1">{m.emoji}</span>
                    <span className="text-[11px] font-medium">{m.label}</span>
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs font-medium text-[#7C7268] dark:text-[#A89E94] block mb-1.5">
                  Optional note: What made today feel this way?
                </label>
                <textarea
                  rows={2}
                  value={moodNote}
                  onChange={(e) => setMoodNote(e.target.value)}
                  placeholder="e.g. Felt peaceful after morning walk..."
                  className="w-full bg-white dark:bg-[#282420] border border-[#EFE8DD] dark:border-[#38322B] rounded-xl p-3 text-xs text-[#2D2A26] dark:text-[#F3EDE2] focus:outline-rose-400"
                />
              </div>

              <button
                onClick={handleSaveMood}
                className="w-full bg-violet-500 hover:bg-violet-600 text-white font-medium text-xs py-2.5 rounded-xl transition-colors"
              >
                Save Mood Check-in
              </button>
            </div>
          )}

          {/* SLEEP TAB */}
          {activeTab === 'sleep' && (
            <form onSubmit={handleSaveSleep} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#7C7268] dark:text-[#A89E94] block mb-1.5">
                    Bedtime
                  </label>
                  <input
                    type="time"
                    value={bedtime}
                    onChange={(e) => setBedtime(e.target.value)}
                    className="w-full bg-white dark:bg-[#282420] border border-[#EFE8DD] dark:border-[#38322B] rounded-xl px-3 py-2 text-sm text-[#2D2A26] dark:text-[#F3EDE2]"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#7C7268] dark:text-[#A89E94] block mb-1.5">
                    Wake-up Time
                  </label>
                  <input
                    type="time"
                    value={wakeTime}
                    onChange={(e) => setWakeTime(e.target.value)}
                    className="w-full bg-white dark:bg-[#282420] border border-[#EFE8DD] dark:border-[#38322B] rounded-xl px-3 py-2 text-sm text-[#2D2A26] dark:text-[#F3EDE2]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium text-xs py-2.5 rounded-xl transition-colors"
              >
                Save Sleep Hours
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
