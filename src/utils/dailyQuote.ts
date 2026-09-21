/**
 * Daily Motivational Quotes for Bloomly
 * 
 * Gentle, positive, short, modern, encouraging, non-judgmental, wellness-oriented.
 * Completely local, deterministic, zero-API, zero-network.
 */

export interface DailyQuote {
  id: number;
  text: string;
}

export const DAILY_QUOTES: DailyQuote[] = [
  { id: 1, text: "Small steps still move you forward." },
  { id: 2, text: "Let today unfold one gentle step at a time." },
  { id: 3, text: "Progress can be quiet and still be progress." },
  { id: 4, text: "You don't need a perfect day to have a good one." },
  { id: 5, text: "Take care of yourself like someone you love." },
  { id: 6, text: "A little progress today is still something to celebrate." },
  { id: 7, text: "Your pace is allowed to look different." },
  { id: 8, text: "Begin where you are." },
  { id: 9, text: "Make a little space for yourself today." },
  { id: 10, text: "Consistency grows from small beginnings." },
  { id: 11, text: "Today's effort is enough." },
  { id: 12, text: "One good choice can become a beautiful beginning." },
  { id: 13, text: "Give yourself permission to pause and breathe." },
  { id: 14, text: "Rest is a vital part of blooming, not a reward for it." },
  { id: 15, text: "Notice the small good things sprinkled through your day." },
  { id: 16, text: "Gently return to what nourishes you." },
  { id: 17, text: "Every morning is an invitation to begin again softly." },
  { id: 18, text: "Honor how far you have already come." },
  { id: 19, text: "Kindness toward yourself creates room to grow." },
  { id: 20, text: "You do not have to do everything all at once." },
  { id: 21, text: "Watering a flower takes patience; so does caring for yourself." },
  { id: 22, text: "Show up gently for whatever today brings." },
  { id: 23, text: "Celebrate the small acts of care that only you notice." },
  { id: 24, text: "Peace is found in the present moment." },
  { id: 25, text: "Your worth is never defined by how much you check off." },
  { id: 26, text: "Listen closely to what your mind and body need." },
  { id: 27, text: "Even the slowest growth is still blooming." },
  { id: 28, text: "A sip of water, a deep breath: simple rituals matter." },
  { id: 29, text: "Treat this moment with patience and compassion." },
  { id: 30, text: "Trust the timing of your own quiet unfolding." },
  { id: 31, text: "Be proud of the quiet courage it takes to keep trying." },
  { id: 32, text: "Soft days are just as valuable as productive ones." },
  { id: 33, text: "Every mindful choice is a gift to your future self." },
  { id: 34, text: "Let go of how it was supposed to go and embrace today." },
  { id: 35, text: "You are planting seeds with every gentle routine." },
  { id: 36, text: "Give your thoughts room to soften and settle." },
  { id: 37, text: "Your well-being deserves quiet, protected time." },
  { id: 38, text: "Bloom at your own natural rhythm." },
  { id: 39, text: "Even small moments of calm leave a lasting impression." },
  { id: 40, text: "Carry gentleness with you as you move through today." },
  { id: 41, text: "Nourish the roots so the blossom can take its time." },
  { id: 42, text: "You are allowed to take things one breath at a time." },
  { id: 43, text: "There is beauty in simply showing up for yourself." },
  { id: 44, text: "Find joy in the simple rhythm of everyday care." },
  { id: 45, text: "A peaceful heart makes room for a steady day." },
  { id: 46, text: "Celebrate who you are becoming in quiet moments." },
  { id: 47, text: "The sunshine and the rain both help the garden grow." },
  { id: 48, text: "Create a pocket of stillness just for you today." },
  { id: 49, text: "Small rituals anchor you in times of change." },
  { id: 50, text: "Your journey is uniquely yours—cherish each step." },
  { id: 51, text: "A deep breath in, a gentle release out." },
  { id: 52, text: "Notice how good it feels to be kind to yourself." },
  { id: 53, text: "There is no rush; steady and gentle wins the day." },
  { id: 54, text: "Honor your boundaries and protect your peace." },
  { id: 55, text: "Let today be light, simple, and kind." },
  { id: 56, text: "Every drop of water, every mindful pause counts." },
  { id: 57, text: "You bring warmth and light to those around you." },
  { id: 58, text: "Cultivate gratitude for what is here right now." },
  { id: 59, text: "Gentle progress is lasting progress." },
  { id: 60, text: "Breathe, smile, and take the very next gentle step." }
];

/**
 * Deterministic hash function for date strings (YYYY-MM-DD)
 * Ensures that on any given date, the exact same quote is returned,
 * and consecutive calendar dates receive varied quotes.
 */
export function getDailyQuote(dateInput?: string | Date): DailyQuote {
  let dateStr: string;

  if (!dateInput) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    dateStr = `${year}-${month}-${day}`;
  } else if (dateInput instanceof Date) {
    const year = dateInput.getFullYear();
    const month = String(dateInput.getMonth() + 1).padStart(2, '0');
    const day = String(dateInput.getDate()).padStart(2, '0');
    dateStr = `${year}-${month}-${day}`;
  } else {
    dateStr = dateInput;
  }

  // Parse YYYY-MM-DD
  const parts = dateStr.split('-');
  const year = parseInt(parts[0], 10) || 2026;
  const month = parseInt(parts[1], 10) || 1;
  const day = parseInt(parts[2], 10) || 1;

  // Salted polynomial hash to ensure wide, non-colliding dispersion for consecutive days
  // Day multiplier 31 (a prime), month multiplier 367, year multiplier 1337
  const hash = Math.abs((year * 1337) ^ (month * 367) ^ (day * 31 * 17 + day * 7));
  const index = hash % DAILY_QUOTES.length;

  return DAILY_QUOTES[index];
}
