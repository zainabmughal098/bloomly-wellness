import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { FlowerType, GenderType } from '../../types';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  Droplet, 
  Footprints, 
  Heart,
  Calendar,
  Utensils,
  Moon,
  Smile
} from 'lucide-react';

interface GoalOption {
  id: string;
  label: string;
  icon: string;
  desc: string;
}

const GOAL_OPTIONS: GoalOption[] = [
  { id: 'water', label: 'Drink more water', icon: '💧', desc: 'Stay gently hydrated throughout the day' },
  { id: 'movement', label: 'Move more', icon: '🏃', desc: 'Celebrate any kind of daily movement' },
  { id: 'nutrition', label: 'Eat regularly', icon: '🥗', desc: 'Nourish your body with balanced meals' },
  { id: 'sleep', label: 'Build a better sleep routine', icon: '😴', desc: 'Rest peacefully and recharge your mind' },
  { id: 'habits', label: 'Build healthy habits', icon: '🌱', desc: 'Cultivate small, sustainable daily rituals' },
  { id: 'selfcare', label: 'Make time for myself', icon: '🧘', desc: 'Carve out soft moments of pause and care' },
  { id: 'routine', label: 'Organize my day', icon: '📋', desc: 'Morning, afternoon, and evening structure' },
];

const GENDER_OPTIONS: { id: GenderType; label: string; symbol: string; desc: string }[] = [
  { id: 'female', label: 'Female', symbol: '♀', desc: 'Identifies as female' },
  { id: 'male', label: 'Male', symbol: '♂', desc: 'Identifies as male' },
  { id: 'non-binary', label: 'Non-binary', symbol: '⚧', desc: 'Identifies as non-binary or gender-expansive' },
  { id: 'prefer-not-to-say', label: 'Prefer not to say', symbol: '♡', desc: 'Keep private or undecided' },
];

const FLOWER_OPTIONS: { id: FlowerType; name: string; emoji: string; meaning: string }[] = [
  { id: 'tulip', name: 'Tulip', emoji: '🌷', meaning: 'Fresh starts & gentle grace' },
  { id: 'sunflower', name: 'Sunflower', emoji: '🌻', meaning: 'Warmth, joy & optimism' },
  { id: 'rose', name: 'Rose', emoji: '🌹', meaning: 'Self-love & intentional care' },
  { id: 'daisy', name: 'Daisy', emoji: '🌼', meaning: 'Simplicity & cheerfulness' },
  { id: 'lavender', name: 'Lavender', emoji: '🪻', meaning: 'Peace, calm & restoration' },
];

export const OnboardingModal: React.FC = () => {
  const { 
    isOnboardingOpen, 
    setIsOnboardingOpen, 
    userProfile, 
    updateUserProfile, 
    preferences, 
    updatePreferences,
    triggerFirstDayWelcome 
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [name, setName] = useState(userProfile.name || preferences.name || '');
  const [gender, setGender] = useState<GenderType | undefined>(userProfile.gender || preferences.gender);
  const [nameError, setNameError] = useState<string | null>(null);

  const [selectedGoals, setSelectedGoals] = useState<string[]>(
    preferences.focusAreas && preferences.focusAreas.length > 0 
      ? preferences.focusAreas 
      : ['water', 'movement', 'routine', 'sleep', 'habits']
  );
  
  const [waterTarget, setWaterTarget] = useState(String(preferences.waterTargetMl || 2000));
  const [stepGoal, setStepGoal] = useState(String(preferences.stepGoal || 8000));
  const [flower, setFlower] = useState<FlowerType>(preferences.selectedFlower || 'tulip');

  // Sync state if modal reopens (e.g. from Restart Onboarding)
  useEffect(() => {
    if (isOnboardingOpen) {
      setStep(1);
      setName(userProfile.name || preferences.name || '');
      setGender(userProfile.gender || preferences.gender);
      setNameError(null);
    }
  }, [isOnboardingOpen]);

  if (!isOnboardingOpen) return null;

  const handleNameSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setNameError('Please enter your name or nickname to continue 🌷');
      return;
    }
    // Allow normal names containing spaces, hyphens, and apostrophes
    if (!/^[a-zA-Z\u00C0-\u024F\u0400-\u04FF\u0600-\u06FF\u4E00-\u9FFF\s'-]{1,50}$/.test(trimmed)) {
      setNameError('Please enter a valid name using letters, spaces, hyphens or apostrophes.');
      return;
    }
    setNameError(null);
    setName(trimmed);
    setStep(3);
  };

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(g => g !== goalId)
        : [...prev, goalId]
    );
  };

  const handleFinish = async () => {
    const trimmedName = name.trim() || 'Friend';
    const parsedWater = parseInt(waterTarget, 10) || 2000;
    const parsedSteps = parseInt(stepGoal, 10) || 8000;

    // 1. Save user profile locally
    await updateUserProfile({
      name: trimmedName,
      gender: gender || undefined,
      onboardingCompleted: true,
    });

    // 2. Save user preferences
    await updatePreferences({
      name: trimmedName,
      gender: gender || undefined,
      waterTargetMl: parsedWater,
      stepGoal: parsedSteps,
      selectedFlower: flower,
      focusAreas: selectedGoals,
      hasOnboarded: true
    });

    // 3. Trigger first-day welcome message on dashboard
    triggerFirstDayWelcome(trimmedName);

    // 4. Close modal
    setIsOnboardingOpen(false);
  };

  return (
    <div 
      id="onboarding_modal_overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <div 
        id="onboarding_modal_container"
        className="w-full max-w-lg bg-[#FAF7F2] dark:bg-[#1E1B18] rounded-3xl border border-[#EFE8DD] dark:border-[#38322B] shadow-2xl overflow-hidden my-auto p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Step Progress Indicators */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  step === s
                    ? 'w-8 bg-rose-500'
                    : step > s
                    ? 'w-3 bg-rose-300 dark:bg-rose-900/80'
                    : 'w-3 bg-[#EFE8DD] dark:bg-[#38322B]'
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] font-medium text-[#7C7268] dark:text-[#A89E94]">
            Step {step} of 5
          </span>
        </div>

        {/* SCREEN 1 — WELCOME */}
        {step === 1 && (
          <div id="onboarding_screen_1" className="text-center space-y-6">
            {/* Subtle flower-growing animation */}
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-rose-200/50 dark:bg-rose-950/40 animate-ping opacity-30" />
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-rose-100 to-rose-50 dark:from-rose-950/80 dark:to-[#26201B] border border-rose-200 dark:border-rose-900/60 flex items-center justify-center text-5xl shadow-sm transition-transform duration-700 hover:scale-105">
                <span className="animate-pulse inline-block select-none">🌷</span>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#2D2A26] dark:text-[#F3EDE2] tracking-tight">
                Welcome to Bloomly
              </h2>
              <p className="text-sm sm:text-base text-[#7C7268] dark:text-[#A89E94] leading-relaxed max-w-md mx-auto">
                Your little space for routines, movement, nourishment and everyday progress.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#25201C]/70 border border-[#EFE8DD] dark:border-[#38322B] text-xs text-[#7C7268] dark:text-[#A89E94] text-left space-y-1.5">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Zero guilt, zero judgment</span>
              </div>
              <p className="leading-relaxed">
                Everything stays 100% private in your browser. No accounts, no subscriptions, and zero external trackers.
              </p>
            </div>

            <button
              id="onboarding_btn_begin"
              onClick={() => setStep(2)}
              className="w-full py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-98 cursor-pointer"
            >
              Let's Begin
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* SCREEN 2 — NAME SCREEN */}
        {step === 2 && (
          <form id="onboarding_screen_2" onSubmit={handleNameSubmit} className="space-y-6">
            <div className="text-center space-y-1.5">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-100 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 flex items-center justify-center text-2xl mb-3">
                🌷
              </div>
              <h2 className="font-display font-bold text-2xl text-[#2D2A26] dark:text-[#F3EDE2]">
                What should we call you? 🌷
              </h2>
              <p className="text-xs sm:text-sm text-[#7C7268] dark:text-[#A89E94]">
                Let's make Bloomly feel a little more like yours.
              </p>
            </div>

            <div className="space-y-2">
              <label 
                htmlFor="onboarding_name_input"
                className="text-xs font-semibold text-[#7C7268] dark:text-[#A89E94] block text-left"
              >
                Your name
              </label>
              <input
                id="onboarding_name_input"
                type="text"
                autoFocus
                placeholder="Enter your name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (nameError) setNameError(null);
                }}
                className={`w-full bg-white dark:bg-[#25201C] border ${
                  nameError 
                    ? 'border-rose-500 focus:ring-rose-500' 
                    : 'border-[#EFE8DD] dark:border-[#38322B] focus:border-rose-400'
                } rounded-2xl px-4 py-3.5 text-base text-[#2D2A26] dark:text-[#F3EDE2] placeholder-[#A89E94] dark:placeholder-[#6C635B] outline-hidden focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-900/40 transition-all`}
              />
              {nameError && (
                <p className="text-xs text-rose-600 dark:text-rose-400 text-left font-medium">
                  {nameError}
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-3 px-5 rounded-2xl border border-[#EFE8DD] dark:border-[#38322B] text-xs font-semibold text-[#7C7268] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
              <button
                type="submit"
                id="onboarding_btn_name_continue"
                className="flex-1 py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-98 cursor-pointer"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* SCREEN 3 — GENDER SCREEN */}
        {step === 3 && (
          <div id="onboarding_screen_3" className="space-y-6">
            <div className="text-center space-y-1.5">
              <h2 className="font-display font-bold text-2xl text-[#2D2A26] dark:text-[#F3EDE2]">
                How do you identify?
              </h2>
              <p className="text-xs sm:text-sm text-[#7C7268] dark:text-[#A89E94]">
                This is optional and only helps personalize your Bloomly experience.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {GENDER_OPTIONS.map((opt) => {
                const isSelected = gender === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setGender(opt.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-400 ring-2 ring-rose-200 dark:ring-rose-900/60 shadow-xs'
                        : 'bg-white dark:bg-[#25201C] border-[#EFE8DD] dark:border-[#38322B] hover:border-rose-200'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 font-medium ${
                      isSelected 
                        ? 'bg-rose-500 text-white' 
                        : 'bg-stone-100 dark:bg-[#322C26] text-[#7C7268] dark:text-[#A89E94]'
                    }`}>
                      {opt.symbol}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-[#2D2A26] dark:text-[#F3EDE2]">
                          {opt.label}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-rose-500" />}
                      </div>
                      <span className="text-[11px] text-[#7C7268] dark:text-[#A89E94] break-words line-clamp-2 leading-tight block">
                        {opt.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="text-[11px] text-[#8C827A] dark:text-[#887F76] text-center leading-relaxed">
              Gender does not alter health targets, calculations, or recommendations.
            </p>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="py-3 px-4 rounded-2xl border border-[#EFE8DD] dark:border-[#38322B] text-xs font-semibold text-[#7C7268] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>

              <button
                type="button"
                onClick={() => {
                  setGender('prefer-not-to-say');
                  setStep(4);
                }}
                className="py-3 px-4 text-xs font-medium text-[#7C7268] hover:text-[#2D2A26] dark:text-[#A89E94] dark:hover:text-[#F3EDE2] underline cursor-pointer"
              >
                Skip
              </button>

              <button
                type="button"
                id="onboarding_btn_gender_continue"
                onClick={() => setStep(4)}
                className="py-3.5 px-6 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-98 cursor-pointer"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 4 — PERSONAL GOALS */}
        {step === 4 && (
          <div id="onboarding_screen_4" className="space-y-5">
            <div className="text-center space-y-1">
              <h2 className="font-display font-bold text-2xl text-[#2D2A26] dark:text-[#F3EDE2]">
                What would you like to focus on?
              </h2>
              <p className="text-xs sm:text-sm text-[#7C7268] dark:text-[#A89E94]">
                Choose any areas you want to gently nurture (multi-select).
              </p>
            </div>

            <div className="space-y-2 max-h-[46vh] overflow-y-auto pr-1">
              {GOAL_OPTIONS.map((g) => {
                const isSelected = selectedGoals.includes(g.id);
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => toggleGoal(g.id)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-rose-50/80 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 shadow-2xs'
                        : 'bg-white dark:bg-[#25201C] border-[#EFE8DD] dark:border-[#38322B] hover:border-rose-200'
                    }`}
                  >
                    <span className="text-2xl shrink-0">{g.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-[#2D2A26] dark:text-[#F3EDE2]">
                        {g.label}
                      </p>
                      <p className="text-[11px] text-[#7C7268] dark:text-[#A89E94]">
                        {g.desc}
                      </p>
                    </div>
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs shrink-0 ${
                      isSelected 
                        ? 'bg-rose-500 text-white' 
                        : 'border border-[#DCD3C7] dark:border-[#4A423B]'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="py-3 px-4 rounded-2xl border border-[#EFE8DD] dark:border-[#38322B] text-xs font-semibold text-[#7C7268] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
              <button
                type="button"
                id="onboarding_btn_goals_continue"
                onClick={() => setStep(5)}
                className="flex-1 py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-98 cursor-pointer"
              >
                Next: Daily Rhythms
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 5 — DAILY TARGETS & STARTER FLOWER */}
        {step === 5 && (
          <div id="onboarding_screen_5" className="space-y-5">
            <div className="text-center space-y-1">
              <h2 className="font-display font-bold text-xl sm:text-2xl text-[#2D2A26] dark:text-[#F3EDE2]">
                Daily Targets & Starter Flower 🌸
              </h2>
              <p className="text-xs text-[#7C7268] dark:text-[#A89E94]">
                You can easily refine or adjust any of these later in Settings.
              </p>
            </div>

            {/* Target inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white dark:bg-[#25201C] rounded-2xl border border-[#EFE8DD] dark:border-[#38322B]">
                <label className="text-[11px] font-semibold text-[#7C7268] dark:text-[#A89E94] flex items-center gap-1 mb-1.5">
                  <Droplet className="w-3.5 h-3.5 text-sky-500" />
                  Daily Water (ml)
                </label>
                <input
                  type="number"
                  step="100"
                  value={waterTarget}
                  onChange={(e) => setWaterTarget(e.target.value)}
                  className="w-full text-base font-bold text-[#2D2A26] dark:text-[#F3EDE2] bg-transparent outline-hidden"
                />
                <span className="text-[10px] text-[#8C827A]">Default: 2,000 ml</span>
              </div>

              <div className="p-3 bg-white dark:bg-[#25201C] rounded-2xl border border-[#EFE8DD] dark:border-[#38322B]">
                <label className="text-[11px] font-semibold text-[#7C7268] dark:text-[#A89E94] flex items-center gap-1 mb-1.5">
                  <Footprints className="w-3.5 h-3.5 text-emerald-500" />
                  Daily Steps
                </label>
                <input
                  type="number"
                  step="500"
                  value={stepGoal}
                  onChange={(e) => setStepGoal(e.target.value)}
                  className="w-full text-base font-bold text-[#2D2A26] dark:text-[#F3EDE2] bg-transparent outline-hidden"
                />
                <span className="text-[10px] text-[#8C827A]">Default: 8,000 steps</span>
              </div>
            </div>

            {/* Starter Flower Selection */}
            <div>
              <label className="text-xs font-semibold text-[#7C7268] dark:text-[#A89E94] block mb-2 text-center">
                Choose your companion flower for your garden:
              </label>
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                {FLOWER_OPTIONS.map((fl) => {
                  const isSelected = flower === fl.id;
                  return (
                    <button
                      key={fl.id}
                      type="button"
                      onClick={() => setFlower(fl.id)}
                      className={`p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-rose-100 dark:bg-rose-950/70 border-rose-400 scale-105 shadow-xs'
                          : 'bg-white dark:bg-[#25201C] border-[#EFE8DD] dark:border-[#38322B] hover:border-rose-200'
                      }`}
                    >
                      <span className="text-xl sm:text-2xl block mb-0.5">{fl.emoji}</span>
                      <span className="text-[9px] sm:text-[10px] font-semibold text-[#2D2A26] dark:text-[#F3EDE2] block leading-tight break-words line-clamp-1">
                        {fl.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="py-3 px-4 rounded-2xl border border-[#EFE8DD] dark:border-[#38322B] text-xs font-semibold text-[#7C7268] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
              <button
                type="button"
                id="onboarding_btn_finish"
                onClick={handleFinish}
                className="flex-1 py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer"
              >
                Start Blooming 🌷
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
