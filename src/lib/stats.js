export function teamStats(teamId, matches, results) {
  let P = 0;
  let W = 0;
  let L = 0;
  let pts = 0;
  let diff = 0;
  let pongDiff = 0;
  let cupsSunk = 0;
  let cornPts = 0;
  for (const match of matches) {
    if (match.home !== teamId && match.away !== teamId) continue;
    for (const g of match.games) {
      const r = results[g.id];
      if (!r || !r.winner) continue;
      P++;
      const won = r.winner === teamId;
      const margin = Number(r.margin);
      const hasMargin = Number.isFinite(margin) && margin >= 0;
      const m = hasMargin ? margin : 0;
      if (won) {
        W++;
        pts++;
        diff += m;
      } else {
        L++;
        diff -= m;
      }
      if (g.type === "pong") {
        if (won) {
          pongDiff += m;
          cupsSunk += 10;
        } else {
          pongDiff -= m;
          // Cups sunk by loser = how many they cleared before the winner's leftover cups
          cupsSunk += hasMargin ? Math.max(0, 10 - m) : 0;
        }
      } else if (g.type === "cornhole") {
        if (won) {
          cornPts += 21;
        } else if (hasMargin) {
          cornPts += Math.max(0, 21 - m);
        }
      }
    }
  }
  return { P, W, L, pts, diff, pongDiff, cupsSunk, cornPts };
}

/** Normalize final/bronze series entries: legacy plain id, single object, or array. */
export function seriesGames(series) {
  if (!series) return [];
  if (Array.isArray(series)) return series;
  if (typeof series === "string") return [series];
  if (series.winner) return [series];
  return [];
}

export function finalGameWinner(entry) {
  if (entry == null) return null;
  return typeof entry === "string" ? entry : entry.winner;
}

export function finalGameMargin(entry) {
  if (entry == null || typeof entry === "string") return null;
  const m = Number(entry.margin);
  return Number.isFinite(m) && m >= 1 ? m : null;
}

/**
 * Add KO-stage beer pong (Final) + cornhole (SF) scoring into top-scorer stats.
 * Battle Raft QFs and Flip Cup bronze are excluded.
 *
 * Cornhole Cannon max = 63 (2 group wins × 21 + 1 SF win × 21).
 * SF margin only changes the loser's points (21 − margin), not the winner's 21.
 */
export function koScoringStats(teamId, ko) {
  let cupsSunk = 0;
  let cornPts = 0;
  let diff = 0;
  let pongDiff = 0;

  for (const slot of ["SF1", "SF2"]) {
    const r = ko?.[slot];
    if (!r?.winner) continue;

    const a = r.a ?? null;
    const b = r.b ?? null;
    const isWinner = r.winner === teamId;
    const isSide = teamId === a || teamId === b;
    // Always credit the recorded winner; credit loser only if they're a listed side
    // (or sides missing — then only winner gets points)
    if (!isWinner && !isSide) continue;
    if (!isWinner && a == null && b == null) continue;

    const margin = Number(r.margin);
    const hasMargin = Number.isFinite(margin) && margin >= 1;

    if (isWinner) {
      cornPts += 21;
      if (hasMargin) diff += margin;
    } else if (hasMargin) {
      cornPts += Math.max(0, 21 - margin);
      diff -= margin;
    }
  }

  for (const entry of seriesGames(ko?.F)) {
    const winner = finalGameWinner(entry);
    const margin = finalGameMargin(entry);
    const a = typeof entry === "object" ? entry.a : null;
    const b = typeof entry === "object" ? entry.b : null;

    if (a && b) {
      if (teamId !== a && teamId !== b) continue;
      const won = winner === teamId;
      if (won) {
        cupsSunk += 10;
        if (margin != null) {
          pongDiff += margin;
          diff += margin;
        }
      } else if (margin != null) {
        cupsSunk += Math.max(0, 10 - margin);
        pongDiff -= margin;
        diff -= margin;
      }
    } else if (winner === teamId) {
      cupsSunk += 10;
    }
  }

  return { cupsSunk, cornPts, diff, pongDiff };
}

/** Loser of a KO result; falls back to the live pair if a/b weren't stored. */
export function koLoser(result, fallbackPair = null) {
  if (!result?.winner) return null;
  const a = result.a ?? fallbackPair?.a ?? null;
  const b = result.b ?? fallbackPair?.b ?? null;
  if (!a || !b) return null;
  if (result.winner === a) return b;
  if (result.winner === b) return a;
  return null;
}

/** Merge group + KO scoring stats for leaderboards. */
export function fullTeamStats(teamId, matches, results, ko) {
  const base = teamStats(teamId, matches, results);
  const koAdd = koScoringStats(teamId, ko);
  return {
    ...base,
    cupsSunk: base.cupsSunk + koAdd.cupsSunk,
    cornPts: base.cornPts + koAdd.cornPts,
    diff: base.diff + koAdd.diff,
    pongDiff: base.pongDiff + koAdd.pongDiff,
    cornGroup: base.cornPts,
    cornSf: koAdd.cornPts,
  };
}

export function h2hPts(aId, bId, matches, results) {
  let a = 0;
  for (const match of matches) {
    const pair = [match.home, match.away];
    if (!pair.includes(aId) || !pair.includes(bId)) continue;
    for (const g of match.games) {
      const r = results[g.id];
      if (r?.winner === aId) a++;
    }
  }
  return a;
}
