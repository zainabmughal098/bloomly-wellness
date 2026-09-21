import {
  UserProfile,
  UserPreferences,
  RoutineTask,
  Habit,
  DailyTip,
  Achievement,
  SelfCareActivity,
  WaterEntry,
  MealEntry,
  ExerciseEntry,
  StepEntry,
  SleepEntry,
  MoodEntry,
  DailyBloom,
  FlowerType
} from '../types';

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'user_profile_main',
  name: '',
  gender: undefined,
  onboardingCompleted: false,
  createdAt: new Date().toISOString(),
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  id: 'user_default',
  name: '',
  waterTargetMl: 2000,
  movementTargetMinutes: 30,
  stepGoal: 8000,
  sleepGoalHours: 8,
  focusAreas: ['water', 'movement', 'routine', 'sleep', 'habits'],
  theme: 'light',
  hasOnboarded: false,
  selectedFlower: 'tulip',
  createdAt: new Date().toISOString(),
};

export const DEFAULT_ROUTINES: RoutineTask[] = [
  // Morning
  { id: 'm1', title: 'Gentle wake up & stretch', period: 'morning', completed: false, completedDates: [], icon: '☀️', time: '07:30', order: 1 },
  { id: 'm2', title: 'Make the bed', period: 'morning', completed: false, completedDates: [], icon: '🛏️', time: '07:45', order: 2 },
  { id: 'm3', title: 'Glass of warm lemon water', period: 'morning', completed: false, completedDates: [], icon: '🍋', time: '08:00', order: 3 },
  { id: 'm4', title: 'Morning skincare routine', period: 'morning', completed: false, completedDates: [], icon: '🧴', time: '08:15', order: 4 },
  { id: 'm5', title: 'Nourishing breakfast', period: 'morning', completed: false, completedDates: [], icon: '🥑', time: '08:45', order: 5 },

  // Day
  { id: 'd1', title: 'Midday sunlight walk', period: 'day', completed: false, completedDates: [], icon: '🌿', time: '12:30', order: 1 },
  { id: 'd2', title: 'Refill hydration bottle', period: 'day', completed: false, completedDates: [], icon: '💧', time: '14:00', order: 2 },
  { id: 'd3', title: '5-minute posture reset', period: 'day', completed: false, completedDates: [], icon: '🧘', time: '15:30', order: 3 },

  // Night
  { id: 'n1', title: 'Dim ambient lights', period: 'night', completed: false, completedDates: [], icon: '🕯️', time: '21:30', order: 1 },
  { id: 'n2', title: 'Put phone on Do Not Disturb', period: 'night', completed: false, completedDates: [], icon: '📵', time: '22:00', order: 2 },
  { id: 'n3', title: 'Night skincare & herbal tea', period: 'night', completed: false, completedDates: [], icon: '🫖', time: '22:15', order: 3 },
  { id: 'n4', title: 'Gratitude journal or light reading', period: 'night', completed: false, completedDates: [], icon: '📖', time: '22:30', order: 4 },
];

export const DEFAULT_HABITS: Habit[] = [
  {
    id: 'h1',
    name: 'Morning Hydration',
    icon: '💧',
    frequency: 'daily',
    selectedDays: [0, 1, 2, 3, 4, 5, 6],
    currentStreak: 3,
    longestStreak: 8,
    completedDates: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'h2',
    name: 'Mindful Reading (15m)',
    icon: '📖',
    frequency: 'daily',
    selectedDays: [0, 1, 2, 3, 4, 5, 6],
    currentStreak: 4,
    longestStreak: 6,
    completedDates: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'h3',
    name: 'Evening Stretch & Reset',
    icon: '🧘',
    frequency: 'daily',
    selectedDays: [0, 1, 2, 3, 4, 5, 6],
    currentStreak: 2,
    longestStreak: 5,
    completedDates: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'h4',
    name: 'Fresh Air / Outdoor Walk',
    icon: '🌿',
    frequency: 'weekdays',
    selectedDays: [1, 2, 3, 4, 5],
    currentStreak: 5,
    longestStreak: 9,
    completedDates: [],
    createdAt: new Date().toISOString()
  }
];

export const DEFAULT_SELF_CARE: SelfCareActivity[] = [
  { id: 'sc1', title: 'Skincare Ritual', icon: '🧴', completedDates: [] },
  { id: 'sc2', title: 'Quiet Reading', icon: '📖', completedDates: [] },
  { id: 'sc3', title: 'Breathing / Meditation', icon: '🧘', completedDates: [] },
  { id: 'sc4', title: 'Outside Sunlight', icon: '🌞', completedDates: [] },
  { id: 'sc5', title: 'Screen-free Break', icon: '📵', completedDates: [] },
  { id: 'sc6', title: 'Warm Bath or Shower', icon: '🛁', completedDates: [] },
  { id: 'sc7', title: 'Reflective Journaling', icon: '✍️', completedDates: [] },
  { id: 'sc8', title: 'Listening to Relaxing Music', icon: '🎵', completedDates: [] },
];

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_water_1',
    title: 'Little Raindrop',
    description: 'Logged water intake on 7 different days',
    icon: '💧',
    category: 'water',
    progress: 4,
    maxProgress: 7
  },
  {
    id: 'ach_routine_1',
    title: 'Routine Rookie',
    description: 'Completed your first full routine cycle',
    icon: '🌱',
    category: 'routine',
    unlockedAt: '2026-09-15',
    progress: 1,
    maxProgress: 1
  },
  {
    id: 'ach_bloom_week',
    title: 'Bloom Week',
    description: 'Reached over 70% Bloom on 5 days in a week',
    icon: '🌷',
    category: 'bloom',
    progress: 3,
    maxProgress: 5
  },
  {
    id: 'ach_steps_10k',
    title: 'Tiny Steps',
    description: 'Accumulate your first 10,000 recorded steps',
    icon: '🚶',
    category: 'steps',
    progress: 8400,
    maxProgress: 10000
  },
  {
    id: 'ach_movement_150',
    title: 'Moving & Grooving',
    description: 'Logged 150 minutes of intentional movement',
    icon: '🏃',
    category: 'movement',
    progress: 95,
    maxProgress: 150
  },
  {
    id: 'ach_sleep_7',
    title: 'Night Owl No More',
    description: 'Logged restful sleep across 7 days',
    icon: '🌙',
    category: 'sleep',
    progress: 5,
    maxProgress: 7
  },
  {
    id: 'ach_flower_power',
    title: 'Botanical Harmony',
    description: 'Unlocked your first alternate garden flower',
    icon: '🌻',
    category: 'bloom',
    progress: 1,
    maxProgress: 1,
    unlockedAt: '2026-09-18'
  }
];

export const DAILY_TIPS: DailyTip[] = [
  { id: 'tip_1', text: 'Hydration isn’t about perfection; even small sips throughout the morning wake up your cells.', category: 'hydration', author: 'Bloomly Care' },
  { id: 'tip_2', text: 'Movement can be as gentle as a morning shoulder roll or five slow breaths on the balcony.', category: 'movement', author: 'Bloomly Care' },
  { id: 'tip_3', text: 'Give yourself permission to pause between tasks today. Unclench your jaw and drop your shoulders.', category: 'mindfulness', author: 'Bloomly Care' },
  { id: 'tip_4', text: 'Warm herbal tea an hour before bed signals to your nervous system that it is safe to unwind.', category: 'rest', author: 'Bloomly Care' },
  { id: 'tip_5', text: 'Add color to your plate: a slice of berry, cucumber, or herbs brings simple joy to any meal.', category: 'nourish', author: 'Bloomly Care' },
  { id: 'tip_6', text: 'Progress is quiet. Consistency is simply deciding to return without guilt whenever you wander.', category: 'mindfulness', author: 'Bloomly Care' },
  { id: 'tip_7', text: 'Sunlight before noon naturally resets your circadian rhythm for deeper nighttime rest.', category: 'rest', author: 'Bloomly Care' },
  { id: 'tip_8', text: 'Every glass of water is a gift to tomorrow’s energy. Keep your favorite tumbler in sight.', category: 'hydration', author: 'Bloomly Care' },
  { id: 'tip_9', text: 'Ten minutes of walking clears mental fog faster than an extra cup of coffee.', category: 'movement', author: 'Bloomly Care' },
  { id: 'tip_10', text: 'Your worth is not measured by how many checkboxes you ticked today. You are blooming at your own pace.', category: 'mindfulness', author: 'Bloomly Care' },
  { id: 'tip_11', text: 'Try 3 minutes of gentle belly breathing when you transition from work to evening leisure.', category: 'rest', author: 'Bloomly Care' },
  { id: 'tip_12', text: 'Eating without scrolling lets your body truly register satiety and satisfaction.', category: 'nourish', author: 'Bloomly Care' }
];

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDateOffset(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Generates 14 days of realistic, aesthetic demo data for portfolio display
export function generateDemoData(currentProfile?: UserProfile, currentPrefs?: UserPreferences) {
  const today = getTodayDateString();
  const water: WaterEntry[] = [];
  const meals: MealEntry[] = [];
  const exercise: ExerciseEntry[] = [];
  const steps: StepEntry[] = [];
  const sleep: SleepEntry[] = [];
  const mood: MoodEntry[] = [];
  const blooms: DailyBloom[] = [];

  const flowerVarieties: FlowerType[] = ['tulip', 'sunflower', 'rose', 'daisy', 'lavender'];
  const moods: ('great' | 'good' | 'okay')[] = ['great', 'good', 'good', 'okay', 'great', 'good'];

  // Populate 14 days backward (from 13 days ago to today)
  for (let i = 13; i >= 0; i--) {
    const date = getDateOffset(i);
    const dayOfWeek = (new Date(date).getDay() + 6) % 7; // 0 = Mon, 6 = Sun
    const isWeekend = dayOfWeek >= 5;

    // Water
    const waterAmount = i === 0 ? 1500 : isWeekend ? 2250 : 1750 + ((i * 137) % 500);
    water.push({
      id: `demo_w_${date}_1`,
      date,
      amountMl: Math.round(waterAmount * 0.4),
      timestamp: new Date(`${date}T09:30:00`).getTime()
    });
    water.push({
      id: `demo_w_${date}_2`,
      date,
      amountMl: Math.round(waterAmount * 0.6),
      timestamp: new Date(`${date}T14:45:00`).getTime()
    });

    // Meals
    meals.push({
      id: `demo_m1_${date}`,
      date,
      category: 'breakfast',
      name: isWeekend ? 'Fluffy Oat Pancakes with Berries' : 'Greek Yogurt, Chia & Peaches',
      foodGroups: ['fruit', 'dairy', 'grains'],
      timestamp: new Date(`${date}T08:30:00`).getTime()
    });
    meals.push({
      id: `demo_m2_${date}`,
      date,
      category: 'lunch',
      name: isWeekend ? 'Mediterranean Quinoa Salad' : 'Avocado Sourdough & Soft Boiled Egg',
      foodGroups: ['veggies', 'protein', 'grains'],
      timestamp: new Date(`${date}T13:00:00`).getTime()
    });
    if (i !== 0 || new Date().getHours() >= 19) {
      meals.push({
        id: `demo_m3_${date}`,
        date,
        category: 'dinner',
        name: 'Roasted Salmon & Asparagus with Sweet Potato',
        foodGroups: ['protein', 'veggies'],
        timestamp: new Date(`${date}T19:30:00`).getTime()
      });
    }

    // Movement
    const movementTypes = ['Morning Yoga Flow', 'Neighborhood Sunset Walk', 'Pilates Core Sculpt', 'Brisk Park Stroll', 'Gentle Vinyasa'];
    const dur = isWeekend ? 40 : 25 + ((i * 7) % 20);
    exercise.push({
      id: `demo_ex_${date}`,
      date,
      activityType: movementTypes[i % movementTypes.length],
      durationMinutes: dur,
      steps: Math.round(dur * 95),
      note: 'Felt centered and refreshed afterwards 🌸',
      time: '17:45',
      timestamp: new Date(`${date}T17:45:00`).getTime()
    });

    // Steps
    const stepCount = isWeekend ? 9400 + (i * 120) % 1800 : 7200 + (i * 230) % 2200;
    steps.push({
      id: `demo_step_${date}`,
      date,
      count: i === 0 ? 5420 : stepCount,
      timestamp: new Date(`${date}T20:00:00`).getTime()
    });

    // Sleep
    const bedHour = isWeekend ? 23 : 22;
    const bedMin = 15 + ((i * 9) % 40);
    const wakeMin = 20 + ((i * 13) % 40);
    const durMin = 440 + ((i * 17) % 65); // ~7.3 to 8.4 hours
    sleep.push({
      id: `demo_sleep_${date}`,
      date,
      bedtime: `${bedHour}:${String(bedMin).padStart(2, '0')}`,
      wakeTime: `07:${String(wakeMin).padStart(2, '0')}`,
      durationMinutes: durMin,
      notes: 'Woke up naturally with morning light',
      timestamp: new Date(`${date}T07:30:00`).getTime()
    });

    // Mood
    mood.push({
      id: `demo_mood_${date}`,
      date,
      mood: moods[i % moods.length],
      note: i % 2 === 0 ? 'Peaceful afternoon, enjoyed a cup of lavender chamomile.' : 'Felt productive and gentle with myself.',
      timestamp: new Date(`${date}T20:30:00`).getTime()
    });

    // Daily Bloom
    const score = i === 0 ? 76 : Math.min(100, Math.max(68, 72 + ((i * 7) % 28)));
    const flowerType = flowerVarieties[i % flowerVarieties.length];
    const stage = score >= 95 ? 'full' : score >= 80 ? 'blooming' : score >= 60 ? 'bud' : 'plant';

    blooms.push({
      date,
      score,
      flowerType,
      stage,
      breakdown: {
        routine: 22,
        water: 14,
        movement: 18,
        meals: 13,
        sleep: 9,
        habits: 9,
        mood: 5
      }
    });
  }

  // Update routine task completed dates for the demo
  const updatedRoutines = DEFAULT_ROUTINES.map(r => {
    const dates: string[] = [];
    for (let i = 0; i < 7; i++) {
      if ((i + r.order) % 3 !== 0) {
        dates.push(getDateOffset(i));
      }
    }
    return {
      ...r,
      completed: dates.includes(today),
      completedDates: dates
    };
  });

  // Update habit completed dates for demo
  const updatedHabits = DEFAULT_HABITS.map((h, idx) => {
    const dates: string[] = [];
    for (let i = 0; i < 14; i++) {
      if ((i + idx) % 4 !== 3) {
        dates.push(getDateOffset(i));
      }
    }
    return {
      ...h,
      completedDates: dates,
      currentStreak: 4 + idx,
      longestStreak: 9 + idx
    };
  });

  const displayName = currentProfile?.name || currentPrefs?.name || 'Demo Explorer';

  return {
    profile: {
      id: currentProfile?.id || 'user_profile_main',
      name: displayName,
      gender: currentProfile?.gender,
      onboardingCompleted: true,
      createdAt: currentProfile?.createdAt || new Date().toISOString(),
    },
    preferences: {
      ...(currentPrefs || DEFAULT_PREFERENCES),
      name: displayName,
      hasOnboarded: true,
    },
    routines: updatedRoutines,
    habits: updatedHabits,
    water,
    meals,
    exercise,
    steps,
    sleep,
    mood,
    selfCare: DEFAULT_SELF_CARE.map(sc => ({
      ...sc,
      completedDates: [today, getDateOffset(1), getDateOffset(2)]
    })),
    blooms,
    achievements: DEFAULT_ACHIEVEMENTS.map(ach => ({
      ...ach,
      progress: Math.min(ach.maxProgress, ach.progress + 2)
    }))
  };
}
