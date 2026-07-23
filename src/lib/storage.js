import { DEFAULT_STATE, LS_KEY, deep } from "./constants";

function migrateKo(ko) {
  const next = { ...DEFAULT_STATE.ko, ...ko };
  // Legacy bronze was a single { winner } object — promote to a 1-game series
  if (next.TP && !Array.isArray(next.TP)) {
    next.TP = next.TP.winner ? [next.TP] : [];
  }
  if (!Array.isArray(next.F)) next.F = [];
  return next;
}

export function loadState() {
  try {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...deep(DEFAULT_STATE),
        ...parsed,
        ko: migrateKo(parsed.ko),
        bronzeBestOf: parsed.bronzeBestOf ?? DEFAULT_STATE.bronzeBestOf,
        finalBestOf: parsed.finalBestOf ?? DEFAULT_STATE.finalBestOf,
      };
    }
  } catch {
    /* ignore corrupt storage */
  }
  return deep(DEFAULT_STATE);
}

export function saveState(state) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {
    /* quota / private mode */
  }
}

export { LS_KEY, DEFAULT_STATE, deep };
