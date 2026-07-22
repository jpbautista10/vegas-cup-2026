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
      const margin = r.margin || 0;
      if (won) {
        W++;
        pts++;
        diff += margin;
      } else {
        L++;
        diff -= margin;
      }
      if (g.type === "pong") {
        if (won) {
          pongDiff += margin;
          cupsSunk += 10;
        } else {
          pongDiff -= margin;
          cupsSunk += Math.max(0, 10 - margin);
        }
      } else if (won) {
        cornPts += 21;
      } else {
        cornPts += Math.max(0, 21 - margin);
      }
    }
  }
  return { P, W, L, pts, diff, pongDiff, cupsSunk, cornPts };
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
