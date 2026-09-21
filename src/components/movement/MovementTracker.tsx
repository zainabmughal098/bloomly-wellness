import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Activity, Footprints, Plus, Trash2, Flame, Clock, Calendar, Sparkles } from 'lucide-react';
import { getDatesInRange } from '../../utils/analytics';

export const MovementTracker: React.FC = () => {
  const {
    preferences,
    exercise,
    addExercise,
    deleteExercise,
    steps,
    todayStepsTotal,
    addSteps,
    setSteps,
    selectedDate
  } = useApp();

  const [isLogOpen, setIsLogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState('Walking');
  const [duration, setDuration] = useState('30');
  const [exerciseSteps, setExerciseSteps] = useState('');
  const [exerciseNote, setExerciseNote] = useState('');
  const [time, setTime] = useState('17:00');

  const [customStepInput, setCustomStepInput] = useState('');

  const activities = [
    { name: 'Walking', icon: '🚶' },
    { name: 'Running', icon: '🏃' },
    { name: 'Yoga', icon: '🧘' },
    { name: 'Pilates', icon: '🤸' },
    { name: 'Gym', icon: '🏋️' },
    { name: 'Cycling', icon: '🚴' },
    { name: 'Stretching', icon: '🤸' },
    { name: 'Sports', icon: '⚽' },
    { name: 'Other', icon: '✨' },
  ];

  const dayExercise = exercise.filter(e => e.date === selectedDate);
  const todayDuration = dayExercise.reduce((acc, e) => acc + e.durationMinutes, 0);
  const targetDuration = preferences.movementTargetMinutes || 30;

  // Weekly stats
  const weekDates = getDatesInRange(7);
  const weekExercise = exercise.filter(e => weekDates.includes(e.date));
  const weekTotalMinutes = weekExercise.reduce((acc, e) => acc + e.durationMinutes, 0);

  // Steps calculations
  const stepGoal = preferences.stepGoal || 8000;
  const stepPercentage = Math.min(100, Math.round((todayStepsTotal / stepGoal) * 100));

  // Circular progress SVG calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (stepPercentage / 100) * circumference;

  const handleSaveMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    const dur = parseInt(duration, 10) || 20;
    const st = exerciseSteps ? parseInt(exerciseSteps, 10) : undefined;

    await addExercise({
      activityType: selectedActivity,
      durationMinutes: dur,
      steps: st,
      note: exerciseNote.trim() || undefined,
      time,
      date: selectedDate
    });

    setExerciseNote('');
    setExerciseSteps('');
    setIsLogOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#2D2A26] dark:text-[#F3EDE2] tracking-tight">
            Movement & Steps 🏃
          </h1>
          <p className="text-sm text-[#7C7268] dark:text-[#A89E94]">
            Gentle, joyful movement that feels good for your body.
          </p>
        </div>

        <button
          onClick={() => setIsLogOpen(true)}
          className="self-start sm:self-auto flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-98 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Log Movement
        </button>
      </div>

      {/* Hero Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Step Progress Circle */}
        <div className="rounded-3xl bg-white dark:bg-[#25201C] border border-[#EFE8DD] dark:border-[#38322B] p-6 shadow-xs flex items-center gap-5">
          <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r={radius}
                className="stroke-emerald-100 dark:stroke-emerald-950/50"
                strokeWidth="9"
                fill="none"
              />
              <circle
                cx="56"
                cy="56"
                r={radius}
                className="stroke-emerald-500 transition-all duration-1000 ease-out"
                strokeWidth="9"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <Footprints className="w-4 h-4 text-emerald-500 mb-0.5" />
              <span className="font-display font-bold text-base text-[#2D2A26] dark:text-[#F3EDE2]">
                {stepPercentage}%
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
              Daily Steps
            </span>
            <div className="text-xl font-display font-bold text-[#2D2A26] dark:text-[#F3EDE2]">
              {todayStepsTotal.toLocaleString()}
            </div>
            <p className="text-xs text-[#8C827A] dark:text-[#A89E94]">
              Goal: {stepGoal.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Today's Movement Minutes */}
        <div className="rounded-3xl bg-white dark:bg-[#25201C] border border-[#EFE8DD] dark:border-[#38322B] p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8C827A] flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-orange-500" />
              TODAY'S ACTIVE TIME
            </span>
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
              {todayDuration} / {targetDuration} min
            </span>
          </div>

          <div className="my-2">
            <div className="text-3xl font-display font-extrabold text-[#2D2A26] dark:text-[#F3EDE2]">
              {todayDuration} <span className="text-sm font-normal text-[#8C827A]">min</span>
            </div>
            <p className="text-xs text-[#8C827A] mt-1">
              {todayDuration >= targetDuration ? 'Target achieved beautifully! 🌿' : 'Every step of movement energizes you'}
            </p>
          </div>

          <div className="w-full bg-orange-100 dark:bg-orange-950/40 h-2 rounded-full overflow-hidden">
            <div
              className="bg-orange-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, (todayDuration / targetDuration) * 100)}%` }}
            />
          </div>
        </div>

        {/* Weekly Total Minutes */}
        <div className="rounded-3xl bg-white dark:bg-[#25201C] border border-[#EFE8DD] dark:border-[#38322B] p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8C827A] flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500" />
              WEEKLY TOTAL
            </span>
            <span className="text-xs text-amber-600 font-semibold">Last 7 Days</span>
          </div>

          <div className="my-2">
            <div className="text-3xl font-display font-extrabold text-[#2D2A26] dark:text-[#F3EDE2]">
              {weekTotalMinutes} <span className="text-sm font-normal text-[#8C827A]">active min</span>
            </div>
            <p className="text-xs text-[#8C827A] mt-1">
              Across {weekExercise.length} movement sessions
            </p>
          </div>

          <div className="text-xs text-[#8C827A] italic">
            Consistency is quiet — give yourself praise.
          </div>
        </div>
      </div>

      {/* QUICK STEP LOG BUTTONS */}
      <div className="rounded-3xl bg-white dark:bg-[#25201C] border border-[#EFE8DD] dark:border-[#38322B] p-5 shadow-xs">
        <h2 className="font-display font-bold text-sm sm:text-base text-[#2D2A26] dark:text-[#F3EDE2] mb-3 flex items-center gap-2">
          <Footprints className="w-4 h-4 text-emerald-500" />
          Quick Step Tracker
        </h2>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => addSteps(500)}
            className="py-2 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold cursor-pointer transition-all"
          >
            +500 Steps
          </button>
          <button
            onClick={() => addSteps(1000)}
            className="py-2 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold cursor-pointer transition-all"
          >
            +1,000 Steps
          </button>
          <button
            onClick={() => addSteps(2500)}
            className="py-2 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold cursor-pointer transition-all"
          >
            +2,500 Steps
          </button>

          <div className="flex items-center gap-2 ml-auto w-full sm:w-auto mt-2 sm:mt-0">
            <input
              type="number"
              placeholder="Set total steps..."
              value={customStepInput}
              onChange={(e) => setCustomStepInput(e.target.value)}
              className="w-36 bg-[#FAF7F2] dark:bg-[#1E1B18] border border-[#EFE8DD] dark:border-[#38322B] rounded-xl px-3 py-1.5 text-xs text-[#2D2A26] dark:text-[#F3EDE2]"
            />
            <button
              onClick={() => {
                const val = parseInt(customStepInput, 10);
                if (val >= 0) {
                  setSteps(val);
                  setCustomStepInput('');
                }
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              Set Total
            </button>
          </div>
        </div>
      </div>

      {/* TODAY'S MOVEMENT LOGS */}
      <div className="rounded-3xl bg-white dark:bg-[#25201C] border border-[#EFE8DD] dark:border-[#38322B] p-6 shadow-xs">
        <h2 className="font-display font-bold text-base text-[#2D2A26] dark:text-[#F3EDE2] mb-4">
          Today's Movement Log
        </h2>

        {dayExercise.length === 0 ? (
          <div className="text-center py-10 text-[#8C827A] italic">
            Ready for a little movement? 🌱
          </div>
        ) : (
          <div className="space-y-2.5">
            {dayExercise.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#201C18] border border-[#EFE8DD] dark:border-[#38322B] flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {activities.find(a => a.name === item.activityType)?.icon || '🏃'}
                  </span>
                  <div>
                    <div className="text-sm font-bold text-[#2D2A26] dark:text-[#F3EDE2]">
                      {item.activityType}
                    </div>
                    <div className="text-xs text-[#8C827A] flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.durationMinutes} minutes
                      </span>
                      {item.steps && (
                        <span>• {item.steps.toLocaleString()} steps</span>
                      )}
                      {item.time && <span>• {item.time}</span>}
                    </div>
                    {item.note && (
                      <p className="text-xs text-[#7C7268] italic mt-1">"{item.note}"</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => deleteExercise(item.id)}
                  className="p-2 text-[#A3998F] hover:text-rose-500 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Log Movement Modal */}
      {isLogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-[#FAF7F2] dark:bg-[#1E1B18] rounded-3xl border border-[#EFE8DD] dark:border-[#38322B] shadow-2xl p-6">
            <h2 className="font-display font-bold text-lg text-[#2D2A26] dark:text-[#F3EDE2] mb-4">
              Log Movement
            </h2>
            <form onSubmit={handleSaveMovement} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-[#7C7268] dark:text-[#A89E94] block mb-1.5">
                  Select Activity
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {activities.map((act) => (
                    <button
                      type="button"
                      key={act.name}
                      onClick={() => setSelectedActivity(act.name)}
                      className={`text-xs font-medium py-2 rounded-xl border text-center transition-all ${
                        selectedActivity === act.name
                          ? 'bg-orange-100 dark:bg-orange-950/60 border-orange-300 text-orange-900 dark:text-orange-200'
                          : 'bg-white dark:bg-[#282420] border-[#EFE8DD] dark:border-[#38322B] text-[#7C7268]'
                      }`}
                    >
                      <span className="text-base mr-1">{act.icon}</span>
                      {act.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#7C7268] dark:text-[#A89E94] block mb-1">
                    Duration (min)
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
                  <label className="text-xs font-medium text-[#7C7268] dark:text-[#A89E94] block mb-1">
                    Steps (optional)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 2800"
                    value={exerciseSteps}
                    onChange={(e) => setExerciseSteps(e.target.value)}
                    className="w-full bg-white dark:bg-[#282420] border border-[#EFE8DD] dark:border-[#38322B] rounded-xl px-3 py-2 text-sm text-[#2D2A26] dark:text-[#F3EDE2]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#7C7268] dark:text-[#A89E94] block mb-1">
                  Gentle Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Enjoyed sunset breeze & felt grounded"
                  value={exerciseNote}
                  onChange={(e) => setExerciseNote(e.target.value)}
                  className="w-full bg-white dark:bg-[#282420] border border-[#EFE8DD] dark:border-[#38322B] rounded-xl px-3 py-2 text-xs text-[#2D2A26] dark:text-[#F3EDE2]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLogOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#EFE8DD] dark:border-[#38322B] text-xs font-medium text-[#7C7268] hover:bg-black/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold"
                >
                  Save Movement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
