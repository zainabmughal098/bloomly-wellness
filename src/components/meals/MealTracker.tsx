import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MealCategory } from '../../types';
import { Utensils, Plus, Trash2, CheckCircle2, Sparkles, Clock, Heart } from 'lucide-react';
import { getDatesInRange } from '../../utils/analytics';

export const MealTracker: React.FC = () => {
  const { meals, addMeal, deleteMeal, selectedDate } = useApp();

  const [activeCategory, setActiveCategory] = useState<MealCategory>('breakfast');
  const [mealName, setMealName] = useState('');
  const [mealNotes, setMealNotes] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const categories: { id: MealCategory; label: string; icon: string; desc: string }[] = [
    { id: 'breakfast', label: 'Breakfast', icon: '🌅', desc: 'Gentle morning nourishment' },
    { id: 'lunch', label: 'Lunch', icon: '☀️', desc: 'Midday energy & focus' },
    { id: 'dinner', label: 'Dinner', icon: '🌙', desc: 'Evening restful plate' },
    { id: 'snack', label: 'Snacks & Treats', icon: '🍓', desc: 'Mindful wholesome bites' },
  ];

  const foodGroups = [
    { id: 'veggies', label: 'Vegetables', icon: '🥦' },
    { id: 'fruit', label: 'Fruit', icon: '🍎' },
    { id: 'protein', label: 'Protein', icon: '🥚' },
    { id: 'grains', label: 'Grains', icon: '🌾' },
    { id: 'dairy', label: 'Dairy / Alt', icon: '🥛' },
    { id: 'treat', label: 'Mindful Treat', icon: '🍫' },
  ];

  const dayMeals = meals.filter(m => m.date === selectedDate);

  // Weekly consistency calculation
  const weekDates = getDatesInRange(7);
  const breakfastCount = meals.filter(m => weekDates.includes(m.date) && m.category === 'breakfast').length;
  const totalWeekMeals = meals.filter(m => weekDates.includes(m.date)).length;

  const toggleGroup = (id: string) => {
    setSelectedGroups(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const handleSaveMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealName.trim()) return;

    await addMeal({
      category: activeCategory,
      name: mealName.trim(),
      notes: mealNotes.trim() || undefined,
      foodGroups: selectedGroups,
      date: selectedDate
    });

    setMealName('');
    setMealNotes('');
    setSelectedGroups([]);
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#2D2A26] dark:text-[#F3EDE2] tracking-tight">
            Nourishing Meals 🥗
          </h1>
          <p className="text-sm text-[#7C7268] dark:text-[#A89E94]">
            Mindful food tracking celebrating color, energy, and joy.
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(true)}
          className="self-start sm:self-auto flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-98 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Log a Meal
        </button>
      </div>

      {/* Encouraging Consistency Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-50 via-rose-50 to-amber-50 dark:from-amber-950/30 dark:via-rose-950/20 dark:to-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-xl shrink-0">
            🥑
          </div>
          <div>
            <h2 className="font-display font-bold text-sm text-[#3E2E20] dark:text-[#F0E6DC]">
              Weekly Rhythm: {totalWeekMeals} meals lovingly logged
            </h2>
            <p className="text-xs text-[#7A6451] dark:text-[#C5B3A2]">
              You logged breakfast on {breakfastCount} out of the past 7 days. Consistency without restriction!
            </p>
          </div>
        </div>
      </div>

      {/* Meal Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {categories.map((cat) => {
          const categoryMeals = dayMeals.filter(m => m.category === cat.id);
          const isLogged = categoryMeals.length > 0;

          return (
            <div
              key={cat.id}
              className={`rounded-3xl border p-5 shadow-xs transition-all ${
                isLogged
                  ? 'bg-white dark:bg-[#25201C] border-amber-200/80 dark:border-amber-900/40'
                  : 'bg-white/60 dark:bg-[#221E1A] border-[#EFE8DD] dark:border-[#38322B]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{cat.icon}</span>
                  <div>
                    <h2 className="font-display font-bold text-base text-[#2D2A26] dark:text-[#F3EDE2]">
                      {cat.label}
                    </h2>
                    <p className="text-[11px] text-[#8C827A] dark:text-[#A89E94]">
                      {cat.desc}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setIsFormOpen(true);
                  }}
                  className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-800 dark:text-amber-300 transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>

              {/* Meals in this category */}
              {categoryMeals.length === 0 ? (
                <div className="py-4 text-center text-xs text-[#8C827A] italic border-t border-dashed border-[#EFE8DD] dark:border-[#38322B] mt-2">
                  Not logged yet for today
                </div>
              ) : (
                <div className="space-y-2 mt-3 pt-3 border-t border-[#EFE8DD] dark:border-[#38322B]">
                  {categoryMeals.map((m) => (
                    <div
                      key={m.id}
                      className="p-3 rounded-2xl bg-[#FAF7F2] dark:bg-[#201C18] border border-[#EFE8DD] dark:border-[#38322B] flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="text-xs sm:text-sm font-semibold text-[#2D2A26] dark:text-[#F3EDE2]">
                          {m.name}
                        </div>
                        {m.notes && (
                          <p className="text-[11px] text-[#8C827A] dark:text-[#9E948A] italic">
                            "{m.notes}"
                          </p>
                        )}
                        {m.foodGroups && m.foodGroups.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {m.foodGroups.map((g) => {
                              const fg = foodGroups.find(x => x.id === g);
                              return (
                                <span
                                  key={g}
                                  className="text-[10px] font-medium bg-white dark:bg-[#2A2520] border border-[#EFE8DD] dark:border-[#38322B] text-[#5C5248] dark:text-[#C5BCB2] px-2 py-0.5 rounded-full"
                                >
                                  {fg ? `${fg.icon} ${fg.label}` : g}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => deleteMeal(m.id)}
                        className="p-1.5 text-[#A3998F] hover:text-rose-500 rounded-lg transition-colors"
                        title="Delete meal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Log Meal Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-[#FAF7F2] dark:bg-[#1E1B18] rounded-3xl border border-[#EFE8DD] dark:border-[#38322B] shadow-2xl p-6">
            <h2 className="font-display font-bold text-lg text-[#2D2A26] dark:text-[#F3EDE2] mb-4">
              Log Meal / Nourishment
            </h2>
            <form onSubmit={handleSaveMeal} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-[#7C7268] dark:text-[#A89E94] block mb-1">
                  Category
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {categories.map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setActiveCategory(c.id)}
                      className={`text-xs font-medium py-2 rounded-xl border text-center transition-all ${
                        activeCategory === c.id
                          ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-300 text-amber-900 dark:text-amber-200'
                          : 'bg-white dark:bg-[#282420] border-[#EFE8DD] dark:border-[#38322B] text-[#7C7268]'
                      }`}
                    >
                      {c.icon} {c.label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#7C7268] dark:text-[#A89E94] block mb-1">
                  What did you eat?
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sourdough toast, poached egg & arugula"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  className="w-full bg-white dark:bg-[#282420] border border-[#EFE8DD] dark:border-[#38322B] rounded-xl px-3 py-2 text-sm text-[#2D2A26] dark:text-[#F3EDE2] focus:outline-amber-400"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#7C7268] dark:text-[#A89E94] block mb-1.5">
                  Food Groups (Nourishment tags)
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {foodGroups.map((grp) => {
                    const isSelected = selectedGroups.includes(grp.id);
                    return (
                      <button
                        type="button"
                        key={grp.id}
                        onClick={() => toggleGroup(grp.id)}
                        className={`text-xs font-medium py-1.5 px-2 rounded-xl border transition-all text-center ${
                          isSelected
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 text-emerald-800 dark:text-emerald-200'
                            : 'bg-white dark:bg-[#282420] border-[#EFE8DD] dark:border-[#38322B] text-[#7C7268]'
                        }`}
                      >
                        {grp.icon} {grp.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#7C7268] dark:text-[#A89E94] block mb-1">
                  Optional notes or feelings
                </label>
                <input
                  type="text"
                  placeholder="e.g. Felt revitalized, ate peacefully outdoors"
                  value={mealNotes}
                  onChange={(e) => setMealNotes(e.target.value)}
                  className="w-full bg-white dark:bg-[#282420] border border-[#EFE8DD] dark:border-[#38322B] rounded-xl px-3 py-2 text-xs text-[#2D2A26] dark:text-[#F3EDE2]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#EFE8DD] dark:border-[#38322B] text-xs font-medium text-[#7C7268] hover:bg-black/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold"
                >
                  Save Meal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
