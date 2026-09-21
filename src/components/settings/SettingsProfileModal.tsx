import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  User, 
  Target, 
  Download, 
  Upload, 
  Trash2, 
  ShieldCheck, 
  Check, 
  Sliders,
  RotateCcw,
  AlertTriangle,
  Sun,
  Moon,
  Laptop,
  Heart,
  Info,
  Sparkles
} from 'lucide-react';
import { FlowerType, GenderType, ThemeMode } from '../../types';

export const SettingsProfileModal: React.FC = () => {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    activeTab,
    setActiveTab,
    userProfile,
    updateUserProfile,
    preferences,
    updatePreferences,
    restartOnboarding,
    exportDataJson,
    importDataJson,
    clearAllData,
    theme,
    setTheme
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(userProfile.name || preferences.name || '');
  const [gender, setGender] = useState<GenderType>(userProfile.gender || preferences.gender || 'prefer-not-to-say');
  const [waterTarget, setWaterTarget] = useState(String(preferences.waterTargetMl || 2000));
  const [stepGoal, setStepGoal] = useState(String(preferences.stepGoal || 8000));
  const [movementMinutes, setMovementMinutes] = useState(String(preferences.movementTargetMinutes || 30));
  const [sleepHours, setSleepHours] = useState(String(preferences.sleepGoalHours || 8));
  const [selectedFlower, setSelectedFlower] = useState<FlowerType>(preferences.selectedFlower || 'tulip');
  const [routineFocus, setRoutineFocus] = useState<'gentle' | 'balanced' | 'mindful'>('gentle');

  const [saveToast, setSaveToast] = useState(false);
  const [importNotice, setImportNotice] = useState<string | null>(null);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Sync state whenever modal is opened
  useEffect(() => {
    if (isSettingsOpen) {
      setName(userProfile.name || preferences.name || '');
      setGender(userProfile.gender || preferences.gender || 'prefer-not-to-say');
      setWaterTarget(String(preferences.waterTargetMl || 2000));
      setStepGoal(String(preferences.stepGoal || 8000));
      setMovementMinutes(String(preferences.movementTargetMinutes || 30));
      setSleepHours(String(preferences.sleepGoalHours || 8));
      setSelectedFlower(preferences.selectedFlower || 'tulip');
      setShowRestartConfirm(false);
      setShowClearConfirm(false);
    }
  }, [isSettingsOpen, userProfile, preferences]);

  // Handle ESC key to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSettingsOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSettingsOpen, activeTab]);

  if (!isSettingsOpen) return null;

  const handleClose = () => {
    setIsSettingsOpen(false);
    if (activeTab === 'profile') {
      setActiveTab('today');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim() || 'Friend';

    await updateUserProfile({
      name: trimmedName,
      gender: gender || undefined,
    });

    await updatePreferences({
      name: trimmedName,
      gender: gender || undefined,
      waterTargetMl: parseInt(waterTarget, 10) || 2000,
      stepGoal: parseInt(stepGoal, 10) || 8000,
      movementTargetMinutes: parseInt(movementMinutes, 10) || 30,
      sleepGoalHours: parseFloat(sleepHours) || 8,
      selectedFlower
    });

    setSaveToast(true);
    setTimeout(() => {
      setSaveToast(false);
    }, 2500);
  };

  const handleConfirmRestart = async () => {
    setShowRestartConfirm(false);
    setIsSettingsOpen(false);
    await restartOnboarding();
  };

  const handleExport = async () => {
    const jsonStr = await exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bloomly-Backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const ok = await importDataJson(text);
      if (ok) {
        setImportNotice('Data imported successfully! ✨');
        setTimeout(() => setImportNotice(null), 3000);
      } else {
        setImportNotice('Failed to import: Invalid format.');
      }
    } catch {
      setImportNotice('Error reading backup file.');
    }
  };

  const handleConfirmClearAll = async () => {
    setShowClearConfirm(false);
    await clearAllData();
    setIsSettingsOpen(false);
  };

  return (
    <div 
      id="settings_modal_overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div 
        id="settings_modal_container"
        className="w-full max-w-xl bg-[#FAF7F2] dark:bg-[#1E1B18] rounded-3xl border border-[#EFE8DD] dark:border-[#38322B] shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#EFE8DD] dark:border-[#2D2823] shrink-0 bg-[#FAF7F2]/90 dark:bg-[#1E1B18]/90 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 border border-rose-200/60 dark:border-rose-800/40 flex items-center justify-center text-rose-500">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base sm:text-lg text-[#2D2A26] dark:text-[#F3EDE2] leading-tight">
                Profile & Settings
              </h2>
              <p className="text-[11px] text-[#8C827A] dark:text-[#A89E94]">
                Manage your identity, targets, and privacy
              </p>
            </div>
          </div>
          <button
            id="close_settings_btn"
            onClick={handleClose}
            className="p-2 rounded-full text-[#8C827A] hover:text-[#2D2A26] dark:hover:text-[#F3EDE2] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto overscroll-contain flex-1">
          {saveToast && (
            <div className="p-3 bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Profile and goals updated successfully! ✨</span>
            </div>
          )}

          {importNotice && (
            <div className="p-3 bg-sky-100 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-800 text-sky-800 dark:text-sky-200 rounded-xl text-xs font-semibold">
              {importNotice}
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* ============================================================ */}
            {/* 1. MY PROFILE */}
            {/* ============================================================ */}
            <section id="settings_section_profile" className="space-y-3.5 p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#25201C]/80 border border-[#EFE8DD] dark:border-[#38322B] shadow-2xs">
              <div className="flex items-center justify-between border-b border-[#EFE8DD] dark:border-[#38322B]/60 pb-2.5">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-rose-500" />
                  <h3 className="text-xs font-bold text-[#2D2A26] dark:text-[#F3EDE2] uppercase tracking-wider">
                    My Profile
                  </h3>
                </div>
                <span className="text-[11px] text-[#8C827A] dark:text-[#A89E94]">
                  Personal identity
                </span>
              </div>

              {/* Name input */}
              <div>
                <label 
                  htmlFor="settings_name_input"
                  className="text-xs font-semibold text-[#6A6056] dark:text-[#BDB1A4] block mb-1.5"
                >
                  Name
                </label>
                <input
                  id="settings_name_input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-white dark:bg-[#1E1B18] border border-[#EFE8DD] dark:border-[#38322B] rounded-xl px-3.5 py-2.5 text-sm text-[#2D2A26] dark:text-[#F3EDE2] focus:outline-rose-400 shadow-2xs"
                />
              </div>

              {/* Gender (optional) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#6A6056] dark:text-[#BDB1A4]">
                    Gender <span className="text-[#8C827A] font-normal">(optional)</span>
                  </label>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'female', label: 'Female', symbol: '♀' },
                    { id: 'male', label: 'Male', symbol: '♂' },
                    { id: 'non-binary', label: 'Non-binary', symbol: '⚧' },
                    { id: 'prefer-not-to-say', label: 'Prefer not to say', symbol: '♡' },
                  ].map((g) => {
                    const isSelected = gender === g.id;
                    return (
                      <button
                        type="button"
                        key={g.id}
                        onClick={() => setGender(g.id as GenderType)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-400 text-rose-600 dark:text-rose-300 font-semibold ring-1 ring-rose-300 shadow-2xs'
                            : 'bg-white dark:bg-[#1E1B18] border-[#EFE8DD] dark:border-[#38322B] text-[#7C7268] dark:text-[#A89E94] hover:border-rose-200'
                        }`}
                      >
                        <span className="text-sm block">{g.symbol}</span>
                        <span className="text-[10px] leading-tight block break-words line-clamp-2 mt-0.5">{g.label}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-[#8C827A] dark:text-[#887F76] mt-2 leading-relaxed">
                  Gender is optional and only personalizes your companion. It does not alter health targets or Bloom calculations.
                </p>
              </div>

              {/* Edit Profile action button */}
              <div className="pt-1 flex justify-end">
                <button
                  type="submit"
                  id="save_profile_btn"
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs rounded-xl shadow-2xs transition-all active:scale-98 cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save Profile
                </button>
              </div>
            </section>

            {/* ============================================================ */}
            {/* 2. MY GOALS */}
            {/* ============================================================ */}
            <section id="settings_section_goals" className="space-y-3.5 p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#25201C]/80 border border-[#EFE8DD] dark:border-[#38322B] shadow-2xs">
              <div className="flex items-center justify-between border-b border-[#EFE8DD] dark:border-[#38322B]/60 pb-2.5">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-xs font-bold text-[#2D2A26] dark:text-[#F3EDE2] uppercase tracking-wider">
                    My Goals
                  </h3>
                </div>
                <span className="text-[11px] text-[#8C827A] dark:text-[#A89E94]">
                  Daily wellness milestones
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Water target */}
                <div>
                  <label className="text-[11px] text-[#6A6056] dark:text-[#BDB1A4] block mb-1 font-semibold">
                    Water target (ml)
                  </label>
                  <input
                    type="number"
                    step="100"
                    value={waterTarget}
                    onChange={(e) => setWaterTarget(e.target.value)}
                    className="w-full bg-white dark:bg-[#1E1B18] border border-[#EFE8DD] dark:border-[#38322B] rounded-xl px-3 py-2 text-xs text-[#2D2A26] dark:text-[#F3EDE2] focus:outline-rose-400"
                  />
                </div>

                {/* Step target */}
                <div>
                  <label className="text-[11px] text-[#6A6056] dark:text-[#BDB1A4] block mb-1 font-semibold">
                    Step target
                  </label>
                  <input
                    type="number"
                    step="500"
                    value={stepGoal}
                    onChange={(e) => setStepGoal(e.target.value)}
                    className="w-full bg-white dark:bg-[#1E1B18] border border-[#EFE8DD] dark:border-[#38322B] rounded-xl px-3 py-2 text-xs text-[#2D2A26] dark:text-[#F3EDE2] focus:outline-rose-400"
                  />
                </div>

                {/* Movement target */}
                <div>
                  <label className="text-[11px] text-[#6A6056] dark:text-[#BDB1A4] block mb-1 font-semibold">
                    Movement target (min)
                  </label>
                  <input
                    type="number"
                    value={movementMinutes}
                    onChange={(e) => setMovementMinutes(e.target.value)}
                    className="w-full bg-white dark:bg-[#1E1B18] border border-[#EFE8DD] dark:border-[#38322B] rounded-xl px-3 py-2 text-xs text-[#2D2A26] dark:text-[#F3EDE2] focus:outline-rose-400"
                  />
                </div>

                {/* Sleep target */}
                <div>
                  <label className="text-[11px] text-[#6A6056] dark:text-[#BDB1A4] block mb-1 font-semibold">
                    Sleep target (hours)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(e.target.value)}
                    className="w-full bg-white dark:bg-[#1E1B18] border border-[#EFE8DD] dark:border-[#38322B] rounded-xl px-3 py-2 text-xs text-[#2D2A26] dark:text-[#F3EDE2] focus:outline-rose-400"
                  />
                </div>
              </div>

              {/* Routine Preferences */}
              <div className="pt-2 border-t border-[#EFE8DD] dark:border-[#38322B]/60 space-y-2">
                <label className="text-xs font-semibold text-[#6A6056] dark:text-[#BDB1A4] block">
                  Routine Preferences
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'gentle', label: 'Gentle Flow', icon: '🌿', desc: 'Relaxed rhythm' },
                    { id: 'balanced', label: 'Balanced', icon: '⚖️', desc: 'Steady focus' },
                    { id: 'mindful', label: 'Mindful', icon: '🧘', desc: 'Deliberate care' },
                  ].map((rf) => (
                    <button
                      type="button"
                      key={rf.id}
                      onClick={() => setRoutineFocus(rf.id as 'gentle' | 'balanced' | 'mindful')}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        routineFocus === rf.id
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-400 text-emerald-700 dark:text-emerald-300 font-semibold ring-1 ring-emerald-300 shadow-2xs'
                          : 'bg-white dark:bg-[#1E1B18] border-[#EFE8DD] dark:border-[#38322B] text-[#7C7268]'
                      }`}
                    >
                      <span className="text-base block">{rf.icon}</span>
                      <span className="text-[11px] block font-medium mt-0.5">{rf.label}</span>
                      <span className="text-[9px] text-[#8C827A] dark:text-[#887F76] block break-words line-clamp-2 leading-tight">{rf.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Bloom Flower */}
              <div className="pt-1 space-y-1.5">
                <span className="text-xs font-semibold text-[#6A6056] dark:text-[#BDB1A4] block">
                  Companion Garden Flower
                </span>
                <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                  {[
                    { id: 'tulip', icon: '🌷', name: 'Tulip' },
                    { id: 'sunflower', icon: '🌻', name: 'Sunflower' },
                    { id: 'rose', icon: '🌹', name: 'Rose' },
                    { id: 'daisy', icon: '🌼', name: 'Daisy' },
                    { id: 'lavender', icon: '🪻', name: 'Lavender' },
                  ].map((fl) => (
                    <button
                      type="button"
                      key={fl.id}
                      onClick={() => setSelectedFlower(fl.id as FlowerType)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedFlower === fl.id
                          ? 'bg-rose-100 dark:bg-rose-950/60 border-rose-400 scale-102 font-bold shadow-2xs'
                          : 'bg-white dark:bg-[#1E1B18] border-[#EFE8DD] dark:border-[#38322B] text-[#7C7268]'
                      }`}
                    >
                      <span className="text-xl sm:text-2xl block mb-0.5">{fl.icon}</span>
                      <span className="text-[10px] leading-tight break-words line-clamp-1 block">{fl.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-1 flex justify-end">
                <button
                  type="submit"
                  id="save_goals_btn"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-2xs transition-all active:scale-98 cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save Goals & Routine
                </button>
              </div>
            </section>
          </form>

          {/* ============================================================ */}
          {/* 3. APPEARANCE */}
          {/* ============================================================ */}
          <section id="settings_section_appearance" className="space-y-3.5 p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#25201C]/80 border border-[#EFE8DD] dark:border-[#38322B] shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#EFE8DD] dark:border-[#38322B]/60 pb-2.5">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold text-[#2D2A26] dark:text-[#F3EDE2] uppercase tracking-wider">
                  Appearance
                </h3>
              </div>
              <span className="text-[11px] text-[#8C827A] dark:text-[#A89E94]">
                Display theme
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {/* Light Mode */}
              <button
                type="button"
                id="theme_light_btn"
                onClick={() => setTheme('light')}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  theme === 'light'
                    ? 'bg-amber-50/90 border-amber-400 text-amber-900 font-semibold ring-2 ring-amber-300/60 shadow-xs'
                    : 'bg-white dark:bg-[#1E1B18] border-[#EFE8DD] dark:border-[#38322B] text-[#7C7268] hover:border-amber-300'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                  <Sun className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold">Light Mode</span>
                <span className="text-[10px] text-[#8C827A] dark:text-[#9E948A] leading-tight">
                  Warm botanical paper
                </span>
                {theme === 'light' && (
                  <span className="mt-1 w-1.5 h-1.5 bg-amber-500 rounded-full" />
                )}
              </button>

              {/* Dark Mode */}
              <button
                type="button"
                id="theme_dark_btn"
                onClick={() => setTheme('dark')}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  theme === 'dark'
                    ? 'bg-indigo-950/70 border-indigo-400 text-indigo-200 font-semibold ring-2 ring-indigo-400/60 shadow-xs'
                    : 'bg-white dark:bg-[#1E1B18] border-[#EFE8DD] dark:border-[#38322B] text-[#7C7268] hover:border-indigo-300'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-indigo-950 flex items-center justify-center text-indigo-300">
                  <Moon className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold">Dark Mode</span>
                <span className="text-[10px] text-[#8C827A] dark:text-[#9E948A] leading-tight">
                  Soothing twilight tone
                </span>
                {theme === 'dark' && (
                  <span className="mt-1 w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                )}
              </button>

              {/* System Theme */}
              <button
                type="button"
                id="theme_system_btn"
                onClick={() => setTheme('system')}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  theme === 'system'
                    ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-400 text-rose-700 dark:text-rose-200 font-semibold ring-2 ring-rose-300/60 shadow-xs'
                    : 'bg-white dark:bg-[#1E1B18] border-[#EFE8DD] dark:border-[#38322B] text-[#7C7268] hover:border-rose-300'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                  <Laptop className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold">System Theme</span>
                <span className="text-[10px] text-[#8C827A] dark:text-[#9E948A] leading-tight">
                  Match device schedule
                </span>
                {theme === 'system' && (
                  <span className="mt-1 w-1.5 h-1.5 bg-rose-500 rounded-full" />
                )}
              </button>
            </div>
          </section>

          {/* ============================================================ */}
          {/* 4. DATA & PRIVACY */}
          {/* ============================================================ */}
          <section id="settings_section_data" className="space-y-3.5 p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#25201C]/80 border border-[#EFE8DD] dark:border-[#38322B] shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#EFE8DD] dark:border-[#38322B]/60 pb-2.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-500" />
                <h3 className="text-xs font-bold text-[#2D2A26] dark:text-[#F3EDE2] uppercase tracking-wider">
                  Data & Privacy
                </h3>
              </div>
              <span className="text-[11px] text-[#8C827A] dark:text-[#A89E94]">
                Local backups & controls
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
              {/* Export My Data */}
              <button
                type="button"
                id="export_data_btn"
                onClick={handleExport}
                className="p-2.5 sm:p-3 rounded-xl bg-white dark:bg-[#25201C] border border-[#EFE8DD] dark:border-[#38322B] text-[11px] sm:text-xs font-semibold text-[#2D2A26] dark:text-[#F3EDE2] flex items-center justify-center gap-1.5 sm:gap-2 hover:border-rose-300 hover:shadow-2xs transition-all cursor-pointer leading-tight text-center"
              >
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-500 shrink-0" />
                <span className="break-words">Export My Data</span>
              </button>

              {/* Import Data */}
              <button
                type="button"
                id="import_data_btn"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 sm:p-3 rounded-xl bg-white dark:bg-[#25201C] border border-[#EFE8DD] dark:border-[#38322B] text-[11px] sm:text-xs font-semibold text-[#2D2A26] dark:text-[#F3EDE2] flex items-center justify-center gap-1.5 sm:gap-2 hover:border-rose-300 hover:shadow-2xs transition-all cursor-pointer leading-tight text-center"
              >
                <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 shrink-0" />
                <span className="break-words">Import Data</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-2.5 pt-1">
              {/* Restart Onboarding */}
              <button
                type="button"
                id="restart_onboarding_btn"
                onClick={() => setShowRestartConfirm(true)}
                className="p-2.5 sm:p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-[11px] sm:text-xs font-semibold text-amber-900 dark:text-amber-200 flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-amber-100 transition-colors cursor-pointer leading-tight text-center"
              >
                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
                <span className="break-words">Restart Onboarding</span>
              </button>

              {/* Delete All Data */}
              <button
                type="button"
                id="delete_all_data_btn"
                onClick={() => setShowClearConfirm(true)}
                className="p-2.5 sm:p-3 rounded-xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-[11px] sm:text-xs font-semibold text-rose-800 dark:text-rose-200 flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-rose-100 transition-colors cursor-pointer leading-tight text-center"
              >
                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-600 shrink-0" />
                <span className="break-words">Delete All Data</span>
              </button>
            </div>
          </section>

          {/* ============================================================ */}
          {/* 5. ABOUT */}
          {/* ============================================================ */}
          <section id="settings_section_about" className="space-y-3 p-4 sm:p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40">
            <div className="flex items-center justify-between border-b border-emerald-200/60 dark:border-emerald-900/40 pb-2">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-xs font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider">
                  About
                </h3>
              </div>
              <span className="text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                Bloomly v1.2.0
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">🌷</span>
                <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                  Bloomly — Your Daily Wellness Companion
                </span>
              </div>
              <p className="text-[11px] text-emerald-900/80 dark:text-emerald-300 leading-relaxed">
                Bloomly is 100% private and offline-capable. All your routines, habits, hydration records, meals, sleep, and flower bloom progress reside safely in your browser's IndexedDB database (<code className="font-mono bg-emerald-100/80 dark:bg-emerald-900/60 px-1 py-0.5 rounded text-[10px]">bloomly_db</code>).
              </p>
              <div className="flex flex-wrap gap-2 pt-1 text-[10px] text-emerald-800 dark:text-emerald-400">
                <span className="flex items-center gap-1 bg-white/70 dark:bg-[#1E1B18]/70 px-2 py-1 rounded-md border border-emerald-200/60 dark:border-emerald-900/60">
                  <Check className="w-3 h-3 text-emerald-500" /> Zero cloud tracking
                </span>
                <span className="flex items-center gap-1 bg-white/70 dark:bg-[#1E1B18]/70 px-2 py-1 rounded-md border border-emerald-200/60 dark:border-emerald-900/60">
                  <Check className="w-3 h-3 text-emerald-500" /> Zero external APIs
                </span>
                <span className="flex items-center gap-1 bg-white/70 dark:bg-[#1E1B18]/70 px-2 py-1 rounded-md border border-emerald-200/60 dark:border-emerald-900/60">
                  <Check className="w-3 h-3 text-emerald-500" /> Zero advertisements
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-3 border-t border-[#EFE8DD] dark:border-[#2D2823] bg-[#FAF7F2] dark:bg-[#1E1B18] flex items-center justify-between shrink-0">
          <span className="text-[11px] text-[#8C827A] dark:text-[#9E948A] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Bloom gently every day
          </span>
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 rounded-xl bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 text-xs font-semibold text-[#5A5047] dark:text-[#D9D0C5] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>

      {/* CONFIRMATION DIALOG: RESTART ONBOARDING */}
      {showRestartConfirm && (
        <div 
          id="restart_onboarding_dialog"
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
        >
          <div className="w-full max-w-md bg-[#FAF7F2] dark:bg-[#1E1B18] rounded-3xl border border-[#EFE8DD] dark:border-[#38322B] p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-2xl text-amber-600">
              🌷
            </div>
            <div className="space-y-1.5">
              <h3 className="font-display font-bold text-lg text-[#2D2A26] dark:text-[#F3EDE2]">
                Restart Bloomly setup?
              </h3>
              <p className="text-xs text-[#7C7268] dark:text-[#A89E94] leading-relaxed">
                This will reset your profile configuration and guide you through the setup steps again. All your historical wellness entries (routines, water, meals, sleep, mood, and bloom progress) will remain safely preserved in your garden.
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowRestartConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#EFE8DD] dark:border-[#38322B] text-xs font-semibold text-[#7C7268] hover:bg-black/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                id="confirm_restart_onboarding_btn"
                onClick={handleConfirmRestart}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Yes, Restart Setup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION DIALOG: CLEAR ALL DATA */}
      {showClearConfirm && (
        <div 
          id="clear_data_dialog"
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
        >
          <div className="w-full max-w-md bg-[#FAF7F2] dark:bg-[#1E1B18] rounded-3xl border border-rose-200 dark:border-rose-900/60 p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-display font-bold text-lg text-rose-900 dark:text-rose-200">
                Delete all local wellness data?
              </h3>
              <p className="text-xs text-[#7C7268] dark:text-[#A89E94] leading-relaxed">
                This will permanently delete all your routines, habits, hydration records, meals, sleep history, and garden blooms from your browser. This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#EFE8DD] dark:border-[#38322B] text-xs font-semibold text-[#7C7268] hover:bg-black/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                id="confirm_clear_data_btn"
                onClick={handleConfirmClearAll}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Yes, Delete Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
