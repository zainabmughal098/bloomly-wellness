import {
  DailyBloom,
  FlowerType,
  RoutineTask,
  Habit,
  WaterEntry,
  MealEntry,
  ExerciseEntry,
  SleepEntry,
  MoodEntry,
  UserPreferences
} from '../types';

export function calculateDailyBloom(
  date: string,
  routines: RoutineTask[],
  habits: Habit[],
  waterEntries: WaterEntry[],
  mealEntries: MealEntry[],
  exerciseEntries: ExerciseEntry[],
  sleepEntries: SleepEntry[],
  moodEntries: MoodEntry[],
  preferences: UserPreferences
): DailyBloom {
  // 1. Routine: 25%
  const todayRoutines = routines;
  const completedRoutines = todayRoutines.filter(r => r.completedDates?.includes(date) || (r.completed && date === new Date().toISOString().split('T')[0]));
  const routinePct = todayRoutines.length > 0 ? (completedRoutines.length / todayRoutines.length) : 1;
  const routineScore = Math.min(25, Math.round(routinePct * 25));

  // 2. Water: 15%
  const dayWater = waterEntries.filter(w => w.date === date).reduce((sum, w) => sum + w.amountMl, 0);
  const waterTarget = preferences.waterTargetMl || 2000;
  const waterPct = Math.min(1, dayWater / waterTarget);
  const waterScore = Math.round(waterPct * 15);

  // 3. Movement: 20%
  const dayMovement = exerciseEntries.filter(e => e.date === date).reduce((sum, e) => sum + e.durationMinutes, 0);
  const movementTarget = preferences.movementTargetMinutes || 30;
  const movementPct = Math.min(1, dayMovement / movementTarget);
  const movementScore = Math.round(movementPct * 20);

  // 4. Meals: 15% (3 meals targeted: breakfast, lunch, dinner)
  const dayMeals = mealEntries.filter(m => m.date === date);
  const mealCount = Math.min(3, dayMeals.length);
  const mealScore = Math.round((mealCount / 3) * 15);

  // 5. Sleep: 10%
  const daySleep = sleepEntries.find(s => s.date === date);
  const sleepHours = daySleep ? (daySleep.durationMinutes / 60) : 0;
  const sleepTarget = preferences.sleepGoalHours || 8;
  const sleepScore = sleepHours >= (sleepTarget * 0.75) ? 10 : sleepHours > 0 ? 6 : 0;

  // 6. Habits: 10%
  const completedHabits = habits.filter(h => h.completedDates?.includes(date));
  const habitPct = habits.length > 0 ? (completedHabits.length / habits.length) : 1;
  const habitScore = Math.round(habitPct * 10);

  // 7. Mood: 5% (Just logging your mood awards the 5%)
  const hasMood = moodEntries.some(m => m.date === date);
  const moodScore = hasMood ? 5 : 0;

  const totalScore = Math.min(100, routineScore + waterScore + movementScore + mealScore + sleepScore + habitScore + moodScore);

  let stage: 'seed' | 'sprout' | 'plant' | 'bud' | 'blooming' | 'full' = 'seed';
  if (totalScore >= 100) {
    stage = 'full';
  } else if (totalScore >= 81) {
    stage = 'blooming';
  } else if (totalScore >= 61) {
    stage = 'bud';
  } else if (totalScore >= 41) {
    stage = 'plant';
  } else if (totalScore >= 21) {
    stage = 'sprout';
  } else {
    stage = 'seed';
  }

  return {
    date,
    score: totalScore,
    flowerType: preferences.selectedFlower || 'tulip',
    stage,
    breakdown: {
      routine: routineScore,
      water: waterScore,
      movement: movementScore,
      meals: mealScore,
      sleep: sleepScore,
      habits: habitScore,
      mood: moodScore
    }
  };
}

export const calculateBloomScore = (
  date: string,
  routines: RoutineTask[],
  waterEntries: WaterEntry[],
  exerciseEntries: ExerciseEntry[],
  mealEntries: MealEntry[],
  sleepEntries: SleepEntry[],
  habits: Habit[],
  moodEntries: MoodEntry[],
  preferences: UserPreferences
): DailyBloom => {
  return calculateDailyBloom(
    date,
    routines,
    habits,
    waterEntries,
    mealEntries,
    exerciseEntries,
    sleepEntries,
    moodEntries,
    preferences
  );
};

export function getBloomStageName(stage: string): string {
  switch (stage) {
    case 'seed': return 'Dormant Seed 🌱';
    case 'sprout': return 'Tender Sprout 🌿';
    case 'plant': return 'Growing Stem 🪴';
    case 'bud': return 'Flower Bud 🌸';
    case 'blooming': return 'Blooming Petals 🌷';
    case 'full': return 'Full Vibrant Bloom ✨';
    default: return 'Blooming 🌷';
  }
}

export function getBloomMessage(score: number): string {
  if (score >= 100) return 'Your garden has blossomed completely today! ✨';
  if (score >= 80) return 'Your day is blooming beautifully 🌷';
  if (score >= 50) return 'Wonderful momentum! Every little step counts 🌱';
  if (score >= 20) return 'A lovely start to your day. Give yourself grace 🌿';
  return 'A fresh morning ahead — plant your gentle intentions ☀️';
}

export function calculateConsecutiveStreak(datesWithActivity: string[]): number {
  if (!datesWithActivity.length) return 0;
  
  const sorted = Array.from(new Set(datesWithActivity)).sort().reverse();
  const today = new Date().toISOString().split('T')[0];
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.toISOString().split('T')[0];

  let streak = 0;
  let checkDate = sorted[0] === today ? new Date(today) : sorted[0] === yesterday ? new Date(yesterday) : null;

  if (!checkDate) return 0;

  for (let i = 0; i < 365; i++) {
    const checkStr = checkDate.toISOString().split('T')[0];
    if (sorted.includes(checkStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}
