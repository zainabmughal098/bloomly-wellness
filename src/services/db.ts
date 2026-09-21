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
  Achievement
} from '../types';

const DB_NAME = 'bloomly_db';
const DB_VERSION = 2;

export const STORES = {
  PROFILE: 'profile',
  PREFERENCES: 'preferences',
  ROUTINES: 'routines',
  HABITS: 'habits',
  WATER: 'water',
  MEALS: 'meals',
  EXERCISE: 'exercise',
  STEPS: 'steps',
  SLEEP: 'sleep',
  MOOD: 'mood',
  SELF_CARE: 'self_care',
  BLOOMS: 'blooms',
  ACHIEVEMENTS: 'achievements',
} as const;

type StoreName = typeof STORES[keyof typeof STORES];

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported on this browser'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORES.PROFILE)) {
        db.createObjectStore(STORES.PROFILE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.PREFERENCES)) {
        db.createObjectStore(STORES.PREFERENCES, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.ROUTINES)) {
        const store = db.createObjectStore(STORES.ROUTINES, { keyPath: 'id' });
        store.createIndex('period', 'period', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORES.HABITS)) {
        db.createObjectStore(STORES.HABITS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.WATER)) {
        const store = db.createObjectStore(STORES.WATER, { keyPath: 'id' });
        store.createIndex('date', 'date', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORES.MEALS)) {
        const store = db.createObjectStore(STORES.MEALS, { keyPath: 'id' });
        store.createIndex('date', 'date', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORES.EXERCISE)) {
        const store = db.createObjectStore(STORES.EXERCISE, { keyPath: 'id' });
        store.createIndex('date', 'date', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORES.STEPS)) {
        const store = db.createObjectStore(STORES.STEPS, { keyPath: 'id' });
        store.createIndex('date', 'date', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORES.SLEEP)) {
        const store = db.createObjectStore(STORES.SLEEP, { keyPath: 'id' });
        store.createIndex('date', 'date', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORES.MOOD)) {
        const store = db.createObjectStore(STORES.MOOD, { keyPath: 'id' });
        store.createIndex('date', 'date', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORES.SELF_CARE)) {
        db.createObjectStore(STORES.SELF_CARE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.BLOOMS)) {
        db.createObjectStore(STORES.BLOOMS, { keyPath: 'date' });
      }
      if (!db.objectStoreNames.contains(STORES.ACHIEVEMENTS)) {
        db.createObjectStore(STORES.ACHIEVEMENTS, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Generic helper methods
export async function getAllFromStore<T>(storeName: StoreName): Promise<T[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export async function getFromStore<T>(storeName: StoreName, key: IDBValidKey): Promise<T | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function putInStore<T>(storeName: StoreName, value: T): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.put(value);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function putBatchInStore<T>(storeName: StoreName, items: T[]): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    for (const item of items) {
      store.put(item);
    }
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function deleteFromStore(storeName: StoreName, key: IDBValidKey): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.delete(key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function clearStore(storeName: StoreName): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.clear();
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function clearAllStores(): Promise<void> {
  const db = await openDB();
  const storeNames = Object.values(STORES);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeNames, 'readwrite');
    for (const name of storeNames) {
      tx.objectStore(name).clear();
    }
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export interface ExportDataPayload {
  version: number;
  exportedAt: string;
  profile?: UserProfile;
  preferences?: UserPreferences;
  routines: RoutineTask[];
  habits: Habit[];
  water: WaterEntry[];
  meals: MealEntry[];
  exercise: ExerciseEntry[];
  steps: StepEntry[];
  sleep: SleepEntry[];
  mood: MoodEntry[];
  selfCare: SelfCareActivity[];
  blooms: DailyBloom[];
  achievements: Achievement[];
}

export async function exportCompleteDatabase(): Promise<ExportDataPayload> {
  const [
    profiles,
    prefs,
    routines,
    habits,
    water,
    meals,
    exercise,
    steps,
    sleep,
    mood,
    selfCare,
    blooms,
    achievements
  ] = await Promise.all([
    getAllFromStore<UserProfile>(STORES.PROFILE),
    getAllFromStore<UserPreferences>(STORES.PREFERENCES),
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

  return {
    version: DB_VERSION,
    exportedAt: new Date().toISOString(),
    profile: profiles[0],
    preferences: prefs[0],
    routines,
    habits,
    water,
    meals,
    exercise,
    steps,
    sleep,
    mood,
    selfCare,
    blooms,
    achievements
  };
}

export async function importCompleteDatabase(payload: ExportDataPayload): Promise<void> {
  await clearAllStores();

  const promises: Promise<void>[] = [];

  if (payload.profile) {
    promises.push(putInStore(STORES.PROFILE, payload.profile));
  }
  if (payload.preferences) {
    promises.push(putInStore(STORES.PREFERENCES, payload.preferences));
  }
  if (payload.routines?.length) {
    promises.push(putBatchInStore(STORES.ROUTINES, payload.routines));
  }
  if (payload.habits?.length) {
    promises.push(putBatchInStore(STORES.HABITS, payload.habits));
  }
  if (payload.water?.length) {
    promises.push(putBatchInStore(STORES.WATER, payload.water));
  }
  if (payload.meals?.length) {
    promises.push(putBatchInStore(STORES.MEALS, payload.meals));
  }
  if (payload.exercise?.length) {
    promises.push(putBatchInStore(STORES.EXERCISE, payload.exercise));
  }
  if (payload.steps?.length) {
    promises.push(putBatchInStore(STORES.STEPS, payload.steps));
  }
  if (payload.sleep?.length) {
    promises.push(putBatchInStore(STORES.SLEEP, payload.sleep));
  }
  if (payload.mood?.length) {
    promises.push(putBatchInStore(STORES.MOOD, payload.mood));
  }
  if (payload.selfCare?.length) {
    promises.push(putBatchInStore(STORES.SELF_CARE, payload.selfCare));
  }
  if (payload.blooms?.length) {
    promises.push(putBatchInStore(STORES.BLOOMS, payload.blooms));
  }
  if (payload.achievements?.length) {
    promises.push(putBatchInStore(STORES.ACHIEVEMENTS, payload.achievements));
  }

  await Promise.all(promises);
}
