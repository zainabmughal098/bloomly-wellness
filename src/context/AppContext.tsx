import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import {
  UserProfile,
  UserPreferences,
  RoutineTask,
  Habit,
  WaterEntry,
  MealEntry,
  ExerciseEntry,
  StepEntry,
  SleepEntry,
  MoodEntry,
  SelfCareActivity,
  DailyBloom,
  Achievement,
  MealCategory,
  MoodType,
  FlowerType,
  ThemeMode
} from '../types';
import {
  STORES,
  getAllFromStore,
  putInStore,
  putBatchInStore,
  deleteFromStore,
  clearAllStores,
  exportCompleteDatabase,
  importCompleteDatabase,
  ExportDataPayload
} from '../services/db';
import {
  DEFAULT_USER_PROFILE,
  DEFAULT_PREFERENCES,
  DEFAULT_ROUTINES,
  DEFAULT_HABITS,
  DEFAULT_SELF_CARE,
  DEFAULT_ACHIEVEMENTS,
  generateDemoData,
  getTodayDateString
} from '../data/initialData';
import { calculateDailyBloom } from '../utils/bloomCalculator';

export type NavigationTab = 
  | 'today' 
  | 'routine' 
  | 'habits'
  | 'water' 
  | 'meals' 
  | 'movement' 
  | 'sleep' 
  | 'mood' 
  | 'garden' 
  | 'insights' 
  | 'profile';

interface AppContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  isToday: boolean;
  isLoading: boolean;
  showConfetti: boolean;
  
  // Profile & Preferences State
  userProfile: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  restartOnboarding: () => Promise<void>;
  firstDayWelcome: { show: boolean; name: string } | null;
  triggerFirstDayWelcome: (name: string) => void;
  dismissFirstDayWelcome: () => void;
  preferences: UserPreferences;
  updatePreferences: (partial: Partial<UserPreferences>) => Promise<void>;
  
  routines: RoutineTask[];
  toggleRoutineTask: (id: string, date?: string) => Promise<void>;
  addRoutineTask: (task: Omit<RoutineTask, 'id' | 'completed' | 'completedDates' | 'order'>) => Promise<void>;
  editRoutineTask: (id: string, updates: Partial<RoutineTask>) => Promise<void>;
  deleteRoutineTask: (id: string) => Promise<void>;
  
  habits: Habit[];
  toggleHabitDay: (id: string, date: string) => Promise<void>;
  addHabit: (name: string, icon: string, frequency: 'daily' | 'weekdays' | 'weekends') => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  
  water: WaterEntry[];
  todayWaterTotal: number;
  addWater: (amountMl: number, date?: string) => Promise<void>;
  undoLatestWater: (date?: string) => Promise<void>;
  
  meals: MealEntry[];
  addMeal: (entry: { category: MealCategory; name: string; foodGroups: string[]; notes?: string; photoUrl?: string; date?: string }) => Promise<void>;
  deleteMeal: (id: string) => Promise<void>;
  
  exercise: ExerciseEntry[];
  addExercise: (entry: { activityType: string; durationMinutes: number; steps?: number; note?: string; time?: string; date?: string }) => Promise<void>;
  deleteExercise: (id: string) => Promise<void>;
  
  steps: StepEntry[];
  todayStepsTotal: number;
  addSteps: (count: number, date?: string) => Promise<void>;
  setSteps: (count: number, date?: string) => Promise<void>;
  
  sleep: SleepEntry[];
  logSleep: (bedtime: string, wakeTime: string, notes?: string, quality?: any, date?: string) => Promise<void>;
  
  mood: MoodEntry[];
  logMood: (mood: MoodType, note?: string, tags?: any, date?: string) => Promise<void>;
  
  selfCare: SelfCareActivity[];
  toggleSelfCare: (id: string, date?: string) => Promise<void>;
  
  blooms: DailyBloom[];
  todayBloom: DailyBloom;
  
  achievements: Achievement[];
  
  // Modals & UI
  isQuickAddOpen: boolean;
  setIsQuickAddOpen: (open: boolean) => void;
  isWeeklyWrappedOpen: boolean;
  setIsWeeklyWrappedOpen: (open: boolean) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  showCelebration: boolean;
  setShowCelebration: (val: boolean) => void;
  
  // Data management
  isDemoMode: boolean;
  loadDemoMode: () => Promise<void>;
  loadDemoData: () => Promise<void>;
  resetToFresh: () => Promise<void>;
  clearAllData: () => Promise<void>;
  exportDataJson: () => Promise<string>;
  importDataJson: (jsonString: string) => Promise<boolean>;
  
  // Theme
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('today');
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Profile & First Day State
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [firstDayWelcome, setFirstDayWelcome] = useState<{ show: boolean; name: string } | null>(null);

  // Core Data States
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [routines, setRoutines] = useState<RoutineTask[]>(DEFAULT_ROUTINES);
  const [habits, setHabits] = useState<Habit[]>(DEFAULT_HABITS);
  const [water, setWater] = useState<WaterEntry[]>([]);
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [exercise, setExercise] = useState<ExerciseEntry[]>([]);
  const [steps, setStepsList] = useState<StepEntry[]>([]);
  const [sleep, setSleep] = useState<SleepEntry[]>([]);
  const [mood, setMood] = useState<MoodEntry[]>([]);
  const [selfCare, setSelfCare] = useState<SelfCareActivity[]>(DEFAULT_SELF_CARE);
  const [blooms, setBlooms] = useState<DailyBloom[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>(DEFAULT_ACHIEVEMENTS);

  // Modals
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isWeeklyWrappedOpen, setIsWeeklyWrappedOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const isToday = selectedDate === getTodayDateString();

  // Load from IndexedDB on startup
  useEffect(() => {
    async function initData() {
      try {
        const storedProfiles = await getAllFromStore<UserProfile>(STORES.PROFILE);
        let currentProfile: UserProfile | null = null;
        if (storedProfiles && storedProfiles.length > 0) {
          currentProfile = storedProfiles[0];
          setUserProfile(currentProfile);
        } else {
          currentProfile = DEFAULT_USER_PROFILE;
          setUserProfile(DEFAULT_USER_PROFILE);
        }

        const storedPrefs = await getAllFromStore<UserPreferences>(STORES.PREFERENCES);
        if (storedPrefs && storedPrefs.length > 0) {
          const pref = { ...storedPrefs[0] };
          if (currentProfile && currentProfile.onboardingCompleted) {
            pref.name = currentProfile.name;
            if (currentProfile.gender) pref.gender = currentProfile.gender;
            pref.hasOnboarded = true;
          } else if (pref.name === 'Camille') {
            pref.name = '';
            pref.hasOnboarded = false;
          }
          setPreferences(pref);
        } else {
          // First time user: seed defaults
          await putInStore(STORES.PREFERENCES, DEFAULT_PREFERENCES);
          await putBatchInStore(STORES.ROUTINES, DEFAULT_ROUTINES);
          await putBatchInStore(STORES.HABITS, DEFAULT_HABITS);
          await putBatchInStore(STORES.SELF_CARE, DEFAULT_SELF_CARE);
          await putBatchInStore(STORES.ACHIEVEMENTS, DEFAULT_ACHIEVEMENTS);
        }

        // On application startup:
        // IF onboardingCompleted === false or no profile exists: Show onboarding.
        // IF onboardingCompleted === true: Go directly to the dashboard.
        if (!currentProfile || !currentProfile.onboardingCompleted) {
          setIsOnboardingOpen(true);
        } else {
          setIsOnboardingOpen(false);
        }

        const [
          rList,
          hList,
          wList,
          mList,
          eList,
          sList,
          slList,
          moList,
          scList,
          bList,
          achList
        ] = await Promise.all([
          getAllFromStore<RoutineTask>(STORES.ROUTINES),
          getAllFromStore<Habit>(STORES.HABITS),
          getAllFromStore<WaterEntry>(STORES.WATER),
          getAllFromStore<MealEntry>(STORES.MEALS),
          getAllFromStore<ExerciseEntry>(STORES.EXERCISE),
          getAllFromStore<StepEntry>(STORES.STEPS),
          getAllFromStore<SleepEntry>(STORES.SLEEP),
          getAllFromStore<MoodEntry>(STORES.MOOD),
          getAllFromStore<SelfCareActivity>(STORES.SELF_CARE),
          getAllFromStore<DailyBloom>(STORES.BLOOMS),
          getAllFromStore<Achievement>(STORES.ACHIEVEMENTS)
        ]);

        if (rList.length) setRoutines(rList);
        if (hList.length) setHabits(hList);
        if (wList.length) setWater(wList);
        if (mList.length) setMeals(mList);
        if (eList.length) setExercise(eList);
        if (sList.length) setStepsList(sList);
        if (slList.length) setSleep(slList);
        if (moList.length) setMood(moList);
        if (scList.length) setSelfCare(scList);
        if (bList.length) setBlooms(bList);
        if (achList.length) setAchievements(achList);
      } catch (err) {
        console.error('Error initializing Bloomly DB:', err);
      } finally {
        setIsLoading(false);
      }
    }

    initData();
  }, []);

  // Sync theme class to document (supporting light, dark, and system preferences)
  useEffect(() => {
    const applyTheme = () => {
      let isDark = false;
      if (preferences.theme === 'dark') {
        isDark = true;
      } else if (preferences.theme === 'system') {
        isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      } else {
        isDark = false;
      }

      if (isDark) {
        document.documentElement.classList.add('dark');
        document.body.classList.remove('bg-[#FAF7F2]', 'text-[#2D2A26]');
        document.body.classList.add('bg-[#1E1B18]', 'text-[#F3EDE2]');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('bg-[#1E1B18]', 'text-[#F3EDE2]');
        document.body.classList.add('bg-[#FAF7F2]', 'text-[#2D2A26]');
      }
    };

    applyTheme();

    if (preferences.theme === 'system' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [preferences.theme]);

  // Today Bloom Calculation (re-evaluates whenever wellness data changes)
  const todayBloom = useMemo(() => {
    const today = selectedDate;
    return calculateDailyBloom(
      today,
      routines,
      habits,
      water,
      meals,
      exercise,
      sleep,
      mood,
      preferences
    );
  }, [selectedDate, routines, habits, water, meals, exercise, sleep, mood, preferences]);

  // Save bloom update to state & DB when score changes
  useEffect(() => {
    if (isLoading) return;
    putInStore(STORES.BLOOMS, todayBloom).catch(console.error);
    setBlooms(prev => {
      const idx = prev.findIndex(b => b.date === todayBloom.date);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = todayBloom;
        return next;
      }
      return [...prev, todayBloom];
    });

    if (todayBloom.score === 100 && isToday) {
      setShowCelebration(true);
    }
  }, [todayBloom, isLoading, isToday]);

  // Totals for selected date
  const todayWaterTotal = useMemo(() => {
    return water
      .filter(w => w.date === selectedDate)
      .reduce((sum, w) => sum + w.amountMl, 0);
  }, [water, selectedDate]);

  const todayStepsTotal = useMemo(() => {
    const entries = steps.filter(s => s.date === selectedDate);
    if (!entries.length) return 0;
    return entries.reduce((acc, s) => acc + s.count, 0);
  }, [steps, selectedDate]);

  // Actions
  const updateUserProfile = useCallback(async (updates: Partial<UserProfile>) => {
    const updated: UserProfile = {
      ...userProfile,
      ...updates,
      id: userProfile.id || 'user_profile_main'
    };
    setUserProfile(updated);
    await putInStore(STORES.PROFILE, updated);

    // Keep preferences in sync for name and gender
    const prefUpdates: Partial<UserPreferences> = {};
    if (updates.name !== undefined) prefUpdates.name = updates.name;
    if (updates.gender !== undefined) prefUpdates.gender = updates.gender;
    if (updates.onboardingCompleted !== undefined) prefUpdates.hasOnboarded = updates.onboardingCompleted;

    if (Object.keys(prefUpdates).length > 0) {
      const updatedPrefs = { ...preferences, ...prefUpdates };
      setPreferences(updatedPrefs);
      await putInStore(STORES.PREFERENCES, updatedPrefs);
    }
  }, [userProfile, preferences]);

  const restartOnboarding = useCallback(async () => {
    const updatedProfile: UserProfile = {
      ...userProfile,
      onboardingCompleted: false
    };
    setUserProfile(updatedProfile);
    await putInStore(STORES.PROFILE, updatedProfile);

    const updatedPrefs: UserPreferences = {
      ...preferences,
      hasOnboarded: false
    };
    setPreferences(updatedPrefs);
    await putInStore(STORES.PREFERENCES, updatedPrefs);

    setIsSettingsOpen(false);
    setIsOnboardingOpen(true);
  }, [userProfile, preferences]);

  const triggerFirstDayWelcome = useCallback((name: string) => {
    setFirstDayWelcome({ show: true, name });
  }, []);

  const dismissFirstDayWelcome = useCallback(() => {
    setFirstDayWelcome(null);
  }, []);

  const updatePreferences = useCallback(async (partial: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...partial };
    setPreferences(updated);
    await putInStore(STORES.PREFERENCES, updated);

    // If name or gender or hasOnboarded changed in preferences, keep userProfile in sync
    if (partial.name !== undefined || partial.gender !== undefined || partial.hasOnboarded !== undefined) {
      const profileUpdates: Partial<UserProfile> = {};
      if (partial.name !== undefined) profileUpdates.name = partial.name;
      if (partial.gender !== undefined) profileUpdates.gender = partial.gender;
      if (partial.hasOnboarded !== undefined) profileUpdates.onboardingCompleted = partial.hasOnboarded;

      const updatedProfile: UserProfile = {
        ...userProfile,
        ...profileUpdates,
        id: userProfile.id || 'user_profile_main'
      };
      setUserProfile(updatedProfile);
      await putInStore(STORES.PROFILE, updatedProfile);
    }
  }, [preferences, userProfile]);

  const setTheme = useCallback((newTheme: ThemeMode) => {
    updatePreferences({ theme: newTheme });
  }, [updatePreferences]);

  const toggleTheme = useCallback(() => {
    const newTheme = preferences.theme === 'light' ? 'dark' : 'light';
    updatePreferences({ theme: newTheme });
  }, [preferences.theme, updatePreferences]);

  const toggleRoutineTask = useCallback(async (id: string, targetDate = selectedDate) => {
    const updated = routines.map(task => {
      if (task.id === id) {
        const completedDates = task.completedDates ? [...task.completedDates] : [];
        const isDone = completedDates.includes(targetDate);
        const newDates = isDone ? completedDates.filter(d => d !== targetDate) : [...completedDates, targetDate];
        return {
          ...task,
          completed: newDates.includes(getTodayDateString()),
          completedDates: newDates
        };
      }
      return task;
    });

    setRoutines(updated);
    const targetTask = updated.find(t => t.id === id);
    if (targetTask) {
      await putInStore(STORES.ROUTINES, targetTask);
    }
  }, [routines, selectedDate]);

  const addRoutineTask = useCallback(async (taskData: Omit<RoutineTask, 'id' | 'completed' | 'completedDates' | 'order'>) => {
    const newTask: RoutineTask = {
      ...taskData,
      id: `rt_${Date.now()}`,
      completed: false,
      completedDates: [],
      order: routines.length + 1
    };
    const updated = [...routines, newTask];
    setRoutines(updated);
    await putInStore(STORES.ROUTINES, newTask);
  }, [routines]);

  const editRoutineTask = useCallback(async (id: string, updates: Partial<RoutineTask>) => {
    const updated = routines.map(r => r.id === id ? { ...r, ...updates } : r);
    setRoutines(updated);
    const task = updated.find(r => r.id === id);
    if (task) {
      await putInStore(STORES.ROUTINES, task);
    }
  }, [routines]);

  const deleteRoutineTask = useCallback(async (id: string) => {
    const updated = routines.filter(r => r.id !== id);
    setRoutines(updated);
    await deleteFromStore(STORES.ROUTINES, id);
  }, [routines]);

  // Habit Actions
  const toggleHabitDay = useCallback(async (id: string, date: string) => {
    const updated = habits.map(habit => {
      if (habit.id === id) {
        const completed = habit.completedDates ? [...habit.completedDates] : [];
        const exists = completed.includes(date);
        const newDates = exists ? completed.filter(d => d !== date) : [...completed, date];
        
        // Calculate new streak
        const sorted = [...newDates].sort();
        let curStreak = 0;
        let checkD = new Date();
        for (let i = 0; i < 30; i++) {
          const ds = checkD.toISOString().split('T')[0];
          if (newDates.includes(ds)) {
            curStreak++;
            checkD.setDate(checkD.getDate() - 1);
          } else {
            break;
          }
        }

        return {
          ...habit,
          completedDates: newDates,
          currentStreak: curStreak,
          longestStreak: Math.max(habit.longestStreak || 0, curStreak)
        };
      }
      return habit;
    });

    setHabits(updated);
    const target = updated.find(h => h.id === id);
    if (target) {
      await putInStore(STORES.HABITS, target);
    }
  }, [habits]);

  const addHabit = useCallback(async (name: string, icon: string, frequency: 'daily' | 'weekdays' | 'weekends') => {
    const newHabit: Habit = {
      id: `hb_${Date.now()}`,
      name,
      icon,
      frequency,
      selectedDays: frequency === 'weekdays' ? [1, 2, 3, 4, 5] : frequency === 'weekends' ? [0, 6] : [0, 1, 2, 3, 4, 5, 6],
      currentStreak: 0,
      longestStreak: 0,
      completedDates: [],
      createdAt: new Date().toISOString()
    };
    const updated = [...habits, newHabit];
    setHabits(updated);
    await putInStore(STORES.HABITS, newHabit);
  }, [habits]);

  const deleteHabit = useCallback(async (id: string) => {
    const updated = habits.filter(h => h.id !== id);
    setHabits(updated);
    await deleteFromStore(STORES.HABITS, id);
  }, [habits]);

  // Water Actions
  const addWater = useCallback(async (amountMl: number, targetDate = selectedDate) => {
    const entry: WaterEntry = {
      id: `w_${Date.now()}`,
      date: targetDate,
      amountMl,
      timestamp: Date.now()
    };
    const updated = [...water, entry];
    setWater(updated);
    await putInStore(STORES.WATER, entry);
  }, [water, selectedDate]);

  const undoLatestWater = useCallback(async (targetDate = selectedDate) => {
    const dayEntries = water.filter(w => w.date === targetDate);
    if (!dayEntries.length) return;
    const latest = dayEntries[dayEntries.length - 1];
    const updated = water.filter(w => w.id !== latest.id);
    setWater(updated);
    await deleteFromStore(STORES.WATER, latest.id);
  }, [water, selectedDate]);

  // Meal Actions
  const addMeal = useCallback(async (entryData: { category: MealCategory; name: string; foodGroups: string[]; notes?: string; photoUrl?: string; date?: string }) => {
    const entry: MealEntry = {
      id: `m_${Date.now()}`,
      date: entryData.date || selectedDate,
      category: entryData.category,
      name: entryData.name,
      foodGroups: entryData.foodGroups,
      notes: entryData.notes,
      photoUrl: entryData.photoUrl,
      timestamp: Date.now()
    };
    const updated = [...meals, entry];
    setMeals(updated);
    await putInStore(STORES.MEALS, entry);
  }, [meals, selectedDate]);

  const deleteMeal = useCallback(async (id: string) => {
    const updated = meals.filter(m => m.id !== id);
    setMeals(updated);
    await deleteFromStore(STORES.MEALS, id);
  }, [meals]);

  // Exercise Actions
  const addExercise = useCallback(async (entryData: { activityType: string; durationMinutes: number; steps?: number; note?: string; time?: string; date?: string }) => {
    const entry: ExerciseEntry = {
      id: `ex_${Date.now()}`,
      date: entryData.date || selectedDate,
      activityType: entryData.activityType,
      durationMinutes: entryData.durationMinutes,
      steps: entryData.steps,
      note: entryData.note,
      time: entryData.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now()
    };
    const updated = [...exercise, entry];
    setExercise(updated);
    await putInStore(STORES.EXERCISE, entry);

    // If steps were attached to this exercise, also add to steps
    if (entryData.steps && entryData.steps > 0) {
      await addSteps(entryData.steps, entryData.date || selectedDate);
    }
  }, [exercise, selectedDate]);

  const deleteExercise = useCallback(async (id: string) => {
    const updated = exercise.filter(e => e.id !== id);
    setExercise(updated);
    await deleteFromStore(STORES.EXERCISE, id);
  }, [exercise]);

  // Steps Actions
  const addSteps = useCallback(async (count: number, targetDate = selectedDate) => {
    const entry: StepEntry = {
      id: `step_${Date.now()}`,
      date: targetDate,
      count,
      timestamp: Date.now()
    };
    const updated = [...steps, entry];
    setStepsList(updated);
    await putInStore(STORES.STEPS, entry);
  }, [steps, selectedDate]);

  const setSteps = useCallback(async (count: number, targetDate = selectedDate) => {
    // Delete existing steps for this date and set a single entry
    const existing = steps.filter(s => s.date === targetDate);
    for (const item of existing) {
      await deleteFromStore(STORES.STEPS, item.id);
    }
    const entry: StepEntry = {
      id: `step_${Date.now()}`,
      date: targetDate,
      count,
      timestamp: Date.now()
    };
    const updated = [...steps.filter(s => s.date !== targetDate), entry];
    setStepsList(updated);
    await putInStore(STORES.STEPS, entry);
  }, [steps, selectedDate]);

  // Sleep Actions
  const logSleep = useCallback(async (bedtime: string, wakeTime: string, notes?: string, quality?: any, targetDate = selectedDate) => {
    // calculate minutes between bedtime and wake time
    const [bH, bM] = bedtime.split(':').map(Number);
    const [wH, wM] = wakeTime.split(':').map(Number);
    let bedMins = bH * 60 + bM;
    let wakeMins = wH * 60 + wM;
    if (wakeMins < bedMins) {
      wakeMins += 24 * 60; // crossed midnight
    }
    const durationMinutes = Math.max(0, wakeMins - bedMins);

    const entry: SleepEntry = {
      id: `sl_${Date.now()}`,
      date: targetDate,
      bedtime,
      wakeTime,
      durationMinutes,
      quality: typeof quality === 'string' && ['restful', 'normal', 'interrupted'].includes(quality) ? quality as any : undefined,
      notes,
      timestamp: Date.now()
    };

    // Replace if already logged for this date
    const updated = [...sleep.filter(s => s.date !== targetDate), entry];
    setSleep(updated);
    await putInStore(STORES.SLEEP, entry);
  }, [sleep, selectedDate]);

  // Mood Actions
  const logMood = useCallback(async (moodVal: MoodType, note?: string, tags?: any, targetDate = selectedDate) => {
    const finalTags = Array.isArray(tags) ? tags : undefined;
    const finalDate = typeof tags === 'string' ? tags : targetDate;

    const entry: MoodEntry = {
      id: `mood_${Date.now()}`,
      date: finalDate,
      mood: moodVal,
      note,
      tags: finalTags,
      timestamp: Date.now()
    };
    const updated = [...mood.filter(m => m.date !== finalDate), entry];
    setMood(updated);
    await putInStore(STORES.MOOD, entry);
  }, [mood, selectedDate]);

  // Self Care Actions
  const toggleSelfCare = useCallback(async (id: string, targetDate = selectedDate) => {
    const updated = selfCare.map(sc => {
      if (sc.id === id) {
        const completed = sc.completedDates ? [...sc.completedDates] : [];
        const exists = completed.includes(targetDate);
        const newDates = exists ? completed.filter(d => d !== targetDate) : [...completed, targetDate];
        return { ...sc, completedDates: newDates };
      }
      return sc;
    });
    setSelfCare(updated);
    const item = updated.find(sc => sc.id === id);
    if (item) {
      await putInStore(STORES.SELF_CARE, item);
    }
  }, [selfCare, selectedDate]);

  // Demo Mode
  const loadDemoMode = useCallback(async () => {
    const demo = generateDemoData(userProfile, preferences);
    setIsDemoMode(true);
    setUserProfile(demo.profile);
    setPreferences(demo.preferences);
    setRoutines(demo.routines);
    setHabits(demo.habits);
    setWater(demo.water);
    setMeals(demo.meals);
    setExercise(demo.exercise);
    setStepsList(demo.steps);
    setSleep(demo.sleep);
    setMood(demo.mood);
    setSelfCare(demo.selfCare);
    setBlooms(demo.blooms);
    setAchievements(demo.achievements);

    await importCompleteDatabase({
      version: 2,
      exportedAt: new Date().toISOString(),
      profile: demo.profile,
      preferences: demo.preferences,
      routines: demo.routines,
      habits: demo.habits,
      water: demo.water,
      meals: demo.meals,
      exercise: demo.exercise,
      steps: demo.steps,
      sleep: demo.sleep,
      mood: demo.mood,
      selfCare: demo.selfCare,
      blooms: demo.blooms,
      achievements: demo.achievements
    });
  }, [userProfile, preferences]);

  const resetToFresh = useCallback(async () => {
    setIsDemoMode(false);
    await clearAllStores();
    
    setPreferences(DEFAULT_PREFERENCES);
    setUserProfile(DEFAULT_USER_PROFILE);
    setRoutines(DEFAULT_ROUTINES);
    setHabits(DEFAULT_HABITS);
    setWater([]);
    setMeals([]);
    setExercise([]);
    setStepsList([]);
    setSleep([]);
    setMood([]);
    setSelfCare(DEFAULT_SELF_CARE);
    setBlooms([]);
    setAchievements(DEFAULT_ACHIEVEMENTS);

    await putInStore(STORES.PROFILE, DEFAULT_USER_PROFILE);
    await putInStore(STORES.PREFERENCES, DEFAULT_PREFERENCES);
    await putBatchInStore(STORES.ROUTINES, DEFAULT_ROUTINES);
    await putBatchInStore(STORES.HABITS, DEFAULT_HABITS);
    await putBatchInStore(STORES.SELF_CARE, DEFAULT_SELF_CARE);
    await putBatchInStore(STORES.ACHIEVEMENTS, DEFAULT_ACHIEVEMENTS);

    setIsOnboardingOpen(true);
  }, []);

  const exportDataJson = useCallback(async () => {
    const payload = await exportCompleteDatabase();
    return JSON.stringify(payload, null, 2);
  }, []);

  const importDataJson = useCallback(async (jsonString: string) => {
    try {
      const payload: ExportDataPayload = JSON.parse(jsonString);
      if (!payload || typeof payload !== 'object') return false;
      await importCompleteDatabase(payload);
      
      if (payload.profile) setUserProfile(payload.profile);
      if (payload.preferences) setPreferences(payload.preferences);
      if (payload.routines) setRoutines(payload.routines);
      if (payload.habits) setHabits(payload.habits);
      if (payload.water) setWater(payload.water);
      if (payload.meals) setMeals(payload.meals);
      if (payload.exercise) setExercise(payload.exercise);
      if (payload.steps) setStepsList(payload.steps);
      if (payload.sleep) setSleep(payload.sleep);
      if (payload.mood) setMood(payload.mood);
      if (payload.selfCare) setSelfCare(payload.selfCare);
      if (payload.blooms) setBlooms(payload.blooms);
      if (payload.achievements) setAchievements(payload.achievements);
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedDate,
        setSelectedDate,
        isToday,
        userProfile,
        updateUserProfile,
        restartOnboarding,
        firstDayWelcome,
        triggerFirstDayWelcome,
        dismissFirstDayWelcome,
        preferences,
        updatePreferences,
        routines,
        toggleRoutineTask,
        addRoutineTask,
        editRoutineTask,
        deleteRoutineTask,
        habits,
        toggleHabitDay,
        addHabit,
        deleteHabit,
        water,
        todayWaterTotal,
        addWater,
        undoLatestWater,
        meals,
        addMeal,
        deleteMeal,
        exercise,
        addExercise,
        deleteExercise,
        steps,
        todayStepsTotal,
        addSteps,
        setSteps,
        sleep,
        logSleep,
        mood,
        logMood,
        selfCare,
        toggleSelfCare,
        blooms,
        todayBloom,
        achievements,
        isLoading,
        showConfetti: showCelebration,
        isQuickAddOpen,
        setIsQuickAddOpen,
        isWeeklyWrappedOpen,
        setIsWeeklyWrappedOpen,
        isOnboardingOpen,
        setIsOnboardingOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        showCelebration,
        setShowCelebration,
        isDemoMode,
        loadDemoMode,
        loadDemoData: loadDemoMode,
        resetToFresh,
        clearAllData: resetToFresh,
        exportDataJson,
        importDataJson,
        theme: preferences.theme,
        toggleTheme,
        setTheme
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
