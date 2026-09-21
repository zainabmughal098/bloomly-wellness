export type ThemeMode = 'light' | 'dark' | 'system';

export type MoodType = 'great' | 'good' | 'okay' | 'low' | 'rough';

export type RoutinePeriod = 'morning' | 'day' | 'night';

export type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type FlowerType = 'tulip' | 'sunflower' | 'rose' | 'daisy' | 'lavender';

export type SleepQuality = 'restful' | 'normal' | 'interrupted';

export type GenderType = 'female' | 'male' | 'non-binary' | 'prefer-not-to-say';

export interface UserProfile {
  id: string;
  name: string;
  gender?: GenderType;
  onboardingCompleted: boolean;
  createdAt: string;
}

export interface UserPreferences {
  id: string;
  name: string;
  gender?: GenderType;
  waterTargetMl: number; // e.g. 2000
  movementTargetMinutes: number; // e.g. 30
  stepGoal: number; // e.g. 8000
  sleepGoalHours: number; // e.g. 8
  focusAreas: string[];
  theme: ThemeMode;
  hasOnboarded: boolean;
  hasSeenOnboarding?: boolean;
  selectedFlower: FlowerType;
  createdAt: string;
}

export interface RoutineTask {
  id: string;
  title: string;
  period: RoutinePeriod;
  completed: boolean;
  completedDates: string[]; // ['2026-09-21', ...]
  icon?: string;
  time?: string;
  order: number;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  frequency: 'daily' | 'weekdays' | 'weekends';
  selectedDays: number[]; // 0 for Sun, 1 for Mon, etc.
  currentStreak: number;
  longestStreak: number;
  completedDates: string[]; // ISO date string YYYY-MM-DD
  createdAt: string;
}

export interface WaterEntry {
  id: string;
  date: string; // YYYY-MM-DD
  amountMl: number;
  timestamp: number;
}

export interface MealEntry {
  id: string;
  date: string; // YYYY-MM-DD
  category: MealCategory;
  name: string;
  notes?: string;
  foodGroups: string[]; // e.g. ['veggies', 'protein', 'grains']
  photoUrl?: string;
  timestamp: number;
}

export interface ExerciseEntry {
  id: string;
  date: string; // YYYY-MM-DD
  activityType: string; // 'Walking' | 'Running' | 'Yoga' | etc.
  durationMinutes: number;
  steps?: number;
  note?: string;
  time?: string;
  timestamp: number;
}

export interface StepEntry {
  id: string;
  date: string; // YYYY-MM-DD
  count: number;
  timestamp: number;
}

export interface SleepEntry {
  id: string;
  date: string; // YYYY-MM-DD
  bedtime: string; // "23:15"
  wakeTime: string; // "07:30"
  durationMinutes: number;
  quality?: SleepQuality;
  notes?: string;
  timestamp: number;
}

export interface MoodEntry {
  id: string;
  date: string; // YYYY-MM-DD
  mood: MoodType;
  note?: string;
  tags?: string[];
  timestamp: number;
}

export interface SelfCareActivity {
  id: string;
  title: string;
  icon: string;
  completedDates: string[];
}

export interface DailyBloom {
  date: string; // YYYY-MM-DD
  score: number; // 0 - 100
  flowerType: FlowerType;
  stage: 'seed' | 'sprout' | 'plant' | 'bud' | 'blooming' | 'full';
  breakdown: {
    routine: number;
    water: number;
    movement: number;
    meals: number;
    sleep: number;
    habits: number;
    mood: number;
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'water' | 'routine' | 'bloom' | 'steps' | 'movement' | 'sleep' | 'consistency';
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface DailyTip {
  id: string;
  text: string;
  category: 'mindfulness' | 'hydration' | 'movement' | 'nourish' | 'rest';
  author: string;
}
