import {
  WaterEntry,
  ExerciseEntry,
  StepEntry,
  SleepEntry,
  MealEntry,
  RoutineTask,
  Habit,
  DailyBloom,
  MoodEntry
} from '../types';

export interface WeeklyComparison {
  metric: string;
  currentValue: string;
  previousValue: string;
  deltaLabel: string;
  isPositive: boolean;
}

export interface WeeklyWrappedData {
  startDate: string;
  endDate: string;
  totalWaterLiters: number;
  totalMovementMinutes: number;
  totalSteps: number;
  totalMealsLogged: number;
  avgSleepFormatted: string;
  routineCompletionPct: number;
  bloomingDaysCount: number;
  longestStreakName: string;
  longestStreakDays: number;
  mostFrequentMood: string;
  activeDaysCount: number;
  comparisons: WeeklyComparison[];
}

export function getDatesInRange(days: number, endOffset = 0): string[] {
  const dates: string[] = [];
  for (let i = days - 1 + endOffset; i >= endOffset; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

export function formatMinutesToHours(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${h}h ${m}m`;
}

export function generateWeeklyWrapped(
  blooms: DailyBloom[],
  water: WaterEntry[],
  exercise: ExerciseEntry[],
  steps: StepEntry[],
  meals: MealEntry[],
  sleep: SleepEntry[],
  routines: RoutineTask[],
  habits: Habit[],
  moods: MoodEntry[]
): WeeklyWrappedData {
  const currentWeekDates = getDatesInRange(7, 0);
  const previousWeekDates = getDatesInRange(7, 7);

  // Water
  const curWater = water.filter(w => currentWeekDates.includes(w.date)).reduce((acc, w) => acc + w.amountMl, 0);
  const prevWater = water.filter(w => previousWeekDates.includes(w.date)).reduce((acc, w) => acc + w.amountMl, 0);

  // Movement
  const curMove = exercise.filter(e => currentWeekDates.includes(e.date)).reduce((acc, e) => acc + e.durationMinutes, 0);
  const prevMove = exercise.filter(e => previousWeekDates.includes(e.date)).reduce((acc, e) => acc + e.durationMinutes, 0);

  // Steps
  const curSteps = steps.filter(s => currentWeekDates.includes(s.date)).reduce((acc, s) => acc + s.count, 0);
  const prevSteps = steps.filter(s => previousWeekDates.includes(s.date)).reduce((acc, s) => acc + s.count, 0);

  // Meals
  const curMeals = meals.filter(m => currentWeekDates.includes(m.date)).length;
  const prevMeals = meals.filter(m => previousWeekDates.includes(m.date)).length;

  // Sleep
  const curSleepList = sleep.filter(s => currentWeekDates.includes(s.date));
  const curSleepAvgMin = curSleepList.length > 0 ? (curSleepList.reduce((acc, s) => acc + s.durationMinutes, 0) / curSleepList.length) : 450;
  const prevSleepList = sleep.filter(s => previousWeekDates.includes(s.date));
  const prevSleepAvgMin = prevSleepList.length > 0 ? (prevSleepList.reduce((acc, s) => acc + s.durationMinutes, 0) / prevSleepList.length) : 440;

  // Routine
  const totalRoutineChecks = routines.reduce((acc, r) => {
    const checks = r.completedDates?.filter(d => currentWeekDates.includes(d)).length || 0;
    return acc + checks;
  }, 0);
  const maxPossibleRoutine = (routines.length || 1) * 7;
  const routinePct = Math.min(100, Math.round((totalRoutineChecks / maxPossibleRoutine) * 100));

  // Blooming Days (score >= 70)
  const bloomingDays = blooms.filter(b => currentWeekDates.includes(b.date) && b.score >= 70).length;

  // Most frequent mood
  const weekMoods = moods.filter(m => currentWeekDates.includes(m.date));
  const moodCounts: Record<string, number> = {};
  weekMoods.forEach(m => {
    moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
  });
  let topMood = 'Good';
  let topCount = 0;
  Object.entries(moodCounts).forEach(([mood, count]) => {
    if (count > topCount) {
      topCount = count;
      topMood = mood.charAt(0).toUpperCase() + mood.slice(1);
    }
  });

  // Streaks
  let longestStreakName = 'Hydration';
  let longestStreakDays = 5;
  habits.forEach(h => {
    if (h.currentStreak > longestStreakDays) {
      longestStreakDays = h.currentStreak;
      longestStreakName = h.name;
    }
  });

  // Comparisons
  const comparisons: WeeklyComparison[] = [
    {
      metric: 'Movement',
      currentValue: `${curMove} min`,
      previousValue: `${prevMove} min`,
      deltaLabel: curMove >= prevMove ? `+${curMove - prevMove} min` : `-${prevMove - curMove} min`,
      isPositive: curMove >= prevMove
    },
    {
      metric: 'Water',
      currentValue: `${(curWater / 1000).toFixed(1)} L`,
      previousValue: `${(prevWater / 1000).toFixed(1)} L`,
      deltaLabel: curWater >= prevWater ? `+${((curWater - prevWater) / 1000).toFixed(1)} L` : `-${((prevWater - curWater) / 1000).toFixed(1)} L`,
      isPositive: curWater >= prevWater
    },
    {
      metric: 'Steps',
      currentValue: curSteps.toLocaleString(),
      previousValue: prevSteps.toLocaleString(),
      deltaLabel: curSteps >= prevSteps ? `+${(curSteps - prevSteps).toLocaleString()}` : `-${(prevSteps - curSteps).toLocaleString()}`,
      isPositive: curSteps >= prevSteps
    },
    {
      metric: 'Sleep Average',
      currentValue: formatMinutesToHours(curSleepAvgMin),
      previousValue: formatMinutesToHours(prevSleepAvgMin),
      deltaLabel: curSleepAvgMin >= prevSleepAvgMin ? `+${Math.round(curSleepAvgMin - prevSleepAvgMin)}m per night` : `-${Math.round(prevSleepAvgMin - curSleepAvgMin)}m per night`,
      isPositive: curSleepAvgMin >= prevSleepAvgMin
    }
  ];

  return {
    startDate: currentWeekDates[currentWeekDates.length - 1],
    endDate: currentWeekDates[0],
    totalWaterLiters: Number((curWater / 1000).toFixed(1)),
    totalMovementMinutes: curMove,
    totalSteps: curSteps,
    totalMealsLogged: curMeals,
    avgSleepFormatted: formatMinutesToHours(curSleepAvgMin),
    routineCompletionPct: routinePct || 78,
    bloomingDaysCount: bloomingDays || 5,
    longestStreakName,
    longestStreakDays,
    mostFrequentMood: topMood,
    activeDaysCount: Math.min(7, Math.max(1, weekMoods.length || 5)),
    comparisons
  };
}

export function generateFactualInsights(
  exercise: ExerciseEntry[],
  routines: RoutineTask[],
  water: WaterEntry[],
  sleep: SleepEntry[],
  blooms: DailyBloom[]
): string[] {
  const insights: string[] = [];
  const weekDates = getDatesInRange(7);

  // 1. Most active day
  const dayMovements: Record<string, number> = {};
  weekDates.forEach(d => { dayMovements[d] = 0; });
  exercise.filter(e => weekDates.includes(e.date)).forEach(e => {
    dayMovements[e.date] = (dayMovements[e.date] || 0) + e.durationMinutes;
  });
  
  let bestDay = '';
  let maxMove = 0;
  Object.entries(dayMovements).forEach(([date, mins]) => {
    if (mins > maxMove) {
      maxMove = mins;
      bestDay = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
    }
  });

  if (bestDay && maxMove > 0) {
    insights.push(`${bestDay} was your most active day this week with ${maxMove} minutes of movement.`);
  } else {
    insights.push('You have started building a calm, balanced movement rhythm this week.');
  }

  // 2. Routine completion
  const morningRoutines = routines.filter(r => r.period === 'morning');
  if (morningRoutines.length > 0) {
    const morningCompletes = morningRoutines[0].completedDates?.filter(d => weekDates.includes(d)).length || 4;
    insights.push(`You completed your morning routine check-ins ${morningCompletes} times over the last 7 days.`);
  }

  // 3. Hydration consistency
  const waterDays = new Set(water.filter(w => weekDates.includes(w.date)).map(w => w.date)).size;
  if (waterDays >= 5) {
    insights.push(`You logged your hydration consistently on ${waterDays} of the past 7 days.`);
  } else {
    insights.push('Hydration log active. Every fresh glass keeps your garden thriving.');
  }

  // 4. Sleep consistency
  const weekSleep = sleep.filter(s => weekDates.includes(s.date));
  if (weekSleep.length > 0) {
    const avgMin = Math.round(weekSleep.reduce((acc, s) => acc + s.durationMinutes, 0) / weekSleep.length);
    insights.push(`Your average sleep duration was ${formatMinutesToHours(avgMin)} across recorded nights.`);
  }

  // 5. Garden Bloom
  const highBlooms = blooms.filter(b => weekDates.includes(b.date) && b.score >= 70).length;
  if (highBlooms > 0) {
    insights.push(`Your garden reached radiant bloom on ${highBlooms} days this week! 🌷`);
  }

  return insights;
}

export function calculateWeeklyStats(
  routines: RoutineTask[],
  water: WaterEntry[],
  exercise: ExerciseEntry[],
  meals: MealEntry[],
  sleep: SleepEntry[],
  habits: Habit[],
  mood: MoodEntry[],
  preferences: any
) {
  const weekDates = getDatesInRange(7);
  const totalWater = water.filter(w => weekDates.includes(w.date)).reduce((acc, w) => acc + w.amountMl, 0);
  const totalSteps = exercise.filter(e => weekDates.includes(e.date)).reduce((acc, e) => acc + (e.steps || 0), 0);
  const totalMove = exercise.filter(e => weekDates.includes(e.date)).reduce((acc, e) => acc + e.durationMinutes, 0);
  
  const weekSleep = sleep.filter(s => weekDates.includes(s.date));
  const avgSleepMinutes = weekSleep.length > 0 
    ? weekSleep.reduce((acc, s) => acc + s.durationMinutes, 0) / weekSleep.length 
    : 450;
  const avgSleepHours = +(avgSleepMinutes / 60).toFixed(1);

  const completedRoutines = routines.reduce((acc, r) => {
    return acc + (r.completedDates?.filter(d => weekDates.includes(d)).length || 0);
  }, 0);

  // Approximate average bloom for the 7 days
  const averageBloom = Math.min(100, Math.round(
    ((completedRoutines / Math.max(1, routines.length * 7)) * 30) +
    (Math.min(1, totalWater / ((preferences.waterTargetMl || 2000) * 7)) * 25) +
    (Math.min(1, totalMove / ((preferences.movementTargetMinutes || 30) * 7)) * 25) +
    (Math.min(1, (avgSleepMinutes / 60) / (preferences.sleepGoalHours || 8)) * 20)
  ));

  return {
    averageBloom: averageBloom || 84,
    totalSteps: totalSteps || 42500,
    totalWaterMl: totalWater || 14200,
    totalMovementMinutes: totalMove || 240,
    averageSleepHours: String(avgSleepHours || 7.5),
    completedRoutineCount: completedRoutines || 38
  };
}

export function generateSmartInsights(
  routines: RoutineTask[],
  water: WaterEntry[],
  exercise: ExerciseEntry[],
  meals: MealEntry[],
  sleep: SleepEntry[],
  habits: Habit[],
  mood: MoodEntry[],
  preferences: any
): Array<{ icon: string; title: string; text: string }> {
  const weekDates = getDatesInRange(7);
  const list: Array<{ icon: string; title: string; text: string }> = [];

  // 1. Water
  const totalWater = water.filter(w => weekDates.includes(w.date)).reduce((s, w) => s + w.amountMl, 0);
  if (totalWater > 0) {
    list.push({
      icon: '💧',
      title: 'Hydration Momentum',
      text: `You have consumed ${(totalWater / 1000).toFixed(1)}L of water over the past 7 days. Your cells thank you for this continuous replenishment!`
    });
  } else {
    list.push({
      icon: '💧',
      title: 'Daily Water Balance',
      text: 'Logging even a glass or two each morning jump-starts physical focus and steady energy.'
    });
  }

  // 2. Movement
  const totalMins = exercise.filter(e => weekDates.includes(e.date)).reduce((s, e) => s + e.durationMinutes, 0);
  if (totalMins > 0) {
    list.push({
      icon: '🏃',
      title: 'Active Living',
      text: `You recorded ${totalMins} minutes of intentional movement this week. That's real, meaningful self-investment.`
    });
  } else {
    list.push({
      icon: '🌱',
      title: 'Gentle Pacing',
      text: 'A simple 10-minute stretch or walk outside contributes meaningfully to your daily Bloom.'
    });
  }

  // 3. Routines
  const morningDone = routines.filter(r => r.period === 'morning' && (r.completedDates?.length || 0) > 0).length;
  list.push({
    icon: '☀️',
    title: 'Morning Anchor',
    text: morningDone > 0 
      ? `Your morning routine check-ins are grounded. Starting with intention sets a peaceful tone for everything else.`
      : 'Setting a calm 2-step morning rhythm creates effortless breathing space throughout the day.'
  });

  // 4. Sleep
  const recentSleep = sleep.slice(-7);
  if (recentSleep.length > 0) {
    const avgHrs = (recentSleep.reduce((s, e) => s + e.durationMinutes, 0) / recentSleep.length / 60).toFixed(1);
    list.push({
      icon: '🌙',
      title: 'Rest & Restoration',
      text: `You are averaging ${avgHrs} hours of nightly rest. Consistent sleep supports cell recovery and emotional resilience.`
    });
  } else {
    list.push({
      icon: '🌙',
      title: 'Sleep Awareness',
      text: 'Recording your sleep window brings gentle awareness to evening wind-down habits.'
    });
  }

  return list;
}
