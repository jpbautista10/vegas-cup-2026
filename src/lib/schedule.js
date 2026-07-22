import { GROUPS, PAIRS } from "./constants";

export function buildSchedule(groups) {
  const matches = [];
  let m = 1;
  for (let r = 0; r < 3; r++) {
    for (const g of GROUPS) {
      const [i, j] = PAIRS[r];
      matches.push({
        id: `M${m}`,
        num: m,
        group: g,
        home: groups[g][i],
        away: groups[g][j],
        games: [
          { id: `M${m}-pong`, type: "pong", num: m },
          { id: `M${m}-cornhole`, type: "cornhole", num: m + 9 },
        ],
      });
      m++;
    }
  }
  return matches;
}

export function flatGames(matches) {
  return matches
    .flatMap((m) => m.games.map((g) => ({ ...g, match: m })))
    .sort((a, b) => a.num - b.num);
}

/**
 * 9 parallel time slots: beer pong (left) + cornhole (right).
 * Display numbers are sequential across the row: Slot 1 = G1|G2, Slot 2 = G3|G4, …
 * Offset of 4 keeps pairings in different groups (no shared players).
 */
export function buildParallelSlots(matches) {
  if (!matches?.length) return [];
  const byNum = Object.fromEntries(matches.map((m) => [m.num, m]));
  const slots = [];
  for (let i = 0; i < 9; i++) {
    const slot = i + 1;
    const pongMatch = byNum[i + 1];
    const cornMatch = byNum[((i + 4) % 9) + 1];
    const pongGame = pongMatch.games.find((g) => g.type === "pong");
    const cornGame = cornMatch.games.find((g) => g.type === "cornhole");
    slots.push({
      slot,
      pong: { ...pongGame, match: pongMatch, num: slot * 2 - 1, displayNum: slot * 2 - 1 },
      cornhole: { ...cornGame, match: cornMatch, num: slot * 2, displayNum: slot * 2 },
    });
  }
  return slots;
}

export function teamsOverlap(matchA, matchB) {
  if (!matchA || !matchB) return false;
  const a = new Set([matchA.home, matchA.away]);
  return a.has(matchB.home) || a.has(matchB.away);
}

/** Next concurrent pair from parallel slots (uses G1/G2-style display numbers). */
export function nextParallelGames(matches, results) {
  const slots = buildParallelSlots(matches);
  let pong = null;
  let cornhole = null;

  for (const s of slots) {
    if (!pong && !results[s.pong.id]?.winner) pong = s.pong;
    if (!cornhole && !results[s.cornhole.id]?.winner) {
      if (!pong || !teamsOverlap(pong.match, s.cornhole.match)) cornhole = s.cornhole;
    }
    if (pong && cornhole) break;
  }

  // Fallback if conflict skipped every corn in the loop
  if (!cornhole) {
    for (const s of slots) {
      if (!results[s.cornhole.id]?.winner) {
        cornhole = s.cornhole;
        break;
      }
    }
  }

  return { pong, cornhole };
}

export function slotProgress(slots, results) {
  return slots.map((s) => {
    const pongDone = Boolean(results[s.pong.id]?.winner);
    const cornDone = Boolean(results[s.cornhole.id]?.winner);
    return {
      ...s,
      pongDone,
      cornDone,
      done: pongDone && cornDone,
      partial: pongDone !== cornDone,
    };
  });
}
