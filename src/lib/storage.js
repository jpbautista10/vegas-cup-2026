import { DEFAULT_STATE, LS_KEY, deep } from "./constants";

export function loadState() {
  try {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) return { ...deep(DEFAULT_STATE), ...JSON.parse(saved) };
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
