import { h2hPts, teamStats } from "./stats";

export function sortGroup(teamIds, matches, results, teams, manual, manualKeyPrefix) {
  const stats = {};
  teamIds.forEach((id) => {
    stats[id] = teamStats(id, matches, results);
  });
  const roster = (id) => teams.find((t) => t.id === id)?.players?.filter(Boolean).length || 99;

  const arr = [...teamIds];
  arr.sort((a, b) => stats[b].pts - stats[a].pts);
  const out = [];
  let i = 0;
  const unresolved = [];
  while (i < arr.length) {
    let j = i;
    while (j < arr.length && stats[arr[j]].pts === stats[arr[i]].pts) j++;
    const cluster = arr.slice(i, j);
    if (cluster.length === 1) {
      out.push(cluster[0]);
    } else {
      const sorted = [...cluster].sort((a, b) => {
        if (cluster.length === 2) {
          const h = h2hPts(b, a, matches, results) - h2hPts(a, b, matches, results);
          if (h !== 0) return h;
        }
        if (stats[b].diff !== stats[a].diff) return stats[b].diff - stats[a].diff;
        if (roster(a) !== roster(b)) return roster(a) - roster(b);
        const key = manualKeyPrefix + [...cluster].sort().join("_");
        const order = manual[key];
        if (order) return order.indexOf(a) - order.indexOf(b);
        unresolved.push(cluster);
        return 0;
      });
      out.push(...sorted);
    }
    i = j;
  }
  return { order: out, stats, unresolved };
}

export function scenarioBadge(teamId, groupTeamIds, matches, results) {
  const gMatches = matches.filter((m) => groupTeamIds.includes(m.home));
  const remaining = [];
  const basePts = {};
  groupTeamIds.forEach((id) => {
    basePts[id] = 0;
  });
  for (const match of gMatches) {
    for (const g of match.games) {
      const r = results[g.id];
      if (r?.winner) basePts[r.winner] += 1;
      else remaining.push({ home: match.home, away: match.away });
    }
  }
  if (remaining.length === 0 || remaining.length > 8) return null;
  let bestRank = 3;
  let worstRank = 1;
  const n = remaining.length;
  for (let mask = 0; mask < 1 << n; mask++) {
    const pts = { ...basePts };
    for (let k = 0; k < n; k++) {
      pts[(mask >> k) & 1 ? remaining[k].home : remaining[k].away] += 1;
    }
    const better = groupTeamIds.filter((id) => id !== teamId && pts[id] > pts[teamId]).length;
    const betterOrEq = groupTeamIds.filter((id) => id !== teamId && pts[id] >= pts[teamId]).length;
    bestRank = Math.min(bestRank, better + 1);
    worstRank = Math.max(worstRank, betterOrEq + 1);
  }
  if (worstRank <= 2) {
    return { text: "Top-2 clinched", cls: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" };
  }
  if (bestRank > 2) {
    return { text: "Wildcard route only", cls: "bg-amber-500/20 text-amber-300 border-amber-500/40" };
  }
  return { text: "In contention", cls: "bg-sky-500/20 text-sky-300 border-sky-500/40" };
}
