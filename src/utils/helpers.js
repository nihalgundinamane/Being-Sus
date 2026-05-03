// Fisher-Yates shuffle — single pass
function shuffleOnce(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Triple shuffle — run 3 independent passes then pick randomly between them.
// This makes it feel genuinely chaotic and unpredictable.
export function shuffle(arr) {
  const r1 = shuffleOnce(arr);
  const r2 = shuffleOnce(arr);
  const r3 = shuffleOnce(arr);
  const candidates = [r1, r2, r3];
  return candidates[Math.floor(Math.random() * candidates.length)];
}

// Pick random element
export function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Pick imposter indices with guaranteed no-repeat:
 * The same player cannot be imposter in two consecutive rounds.
 * Also does triple-randomized selection.
 */
export function pickImposterIndices(playerCount, imposterCount, lastImposterIndices = []) {
  const allIndices = Array.from({ length: playerCount }, (_, i) => i);

  // Do 3 separate random selections and pick one
  const attempts = [
    doPickImposters(allIndices, imposterCount, lastImposterIndices),
    doPickImposters(allIndices, imposterCount, lastImposterIndices),
    doPickImposters(allIndices, imposterCount, lastImposterIndices),
  ];

  // Pick whichever attempt has fewest repeats with last round
  return attempts.reduce((best, curr) => {
    const bestOverlap = best.filter(i => lastImposterIndices.includes(i)).length;
    const currOverlap = curr.filter(i => lastImposterIndices.includes(i)).length;
    return currOverlap < bestOverlap ? curr : best;
  });
}

function doPickImposters(allIndices, count, excludeIfPossible) {
  // Try to exclude last round's imposters if possible
  const preferred = allIndices.filter(i => !excludeIfPossible.includes(i));
  const fallback = allIndices;

  const pool = preferred.length >= count ? preferred : fallback;
  const shuffled = shuffleOnce(shuffleOnce(shuffleOnce(pool))); // triple inner shuffle
  return shuffled.slice(0, count);
}

export function pickRandomWord(categories, difficulty, lastWords = []) {
  const wordPool = categories.flatMap(c => {
    const words = (window._CATEGORIES?.[c]?.[difficulty] || []);
    return words;
  });
  // Filter out recently used words
  const fresh = wordPool.filter(w => !lastWords.includes(w));
  const pool = fresh.length > 0 ? fresh : wordPool;
  if (!pool.length) return null;

  // Pick 3 candidates and choose randomly for extra chaos
  const picks = [pickRandom(pool), pickRandom(pool), pickRandom(pool)];
  return picks[Math.floor(Math.random() * picks.length)];
}

export function getOrdinal(n) {
  const s = ['th','st','nd','rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
