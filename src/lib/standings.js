import { h2hPts, teamStats } from "./stats";

export function sortGroup(teamIds, matches, results, teams, manual, manualKeyPrefix) {
  const stats = {};
  teamIds.forEach((id) => {
    stats[id] = teamStats(id, matches, results);
  });
  const roster = (id) => teams.find((t) => t.id === id)?.players?.filter(Boolean).length || 99;
  // Only ask for flip-cup once every group game is scored — not while standings are still in flux
  const groupComplete =
    matches.length > 0 && matches.every((m) => m.games.every((g) => results[g.id]?.winner));

  const arr = [...teamIds];
  arr.sort((a, b) => stats[b].pts - stats[a].pts);
  const out = [];
  let i = 0;
  const unresolved = [];
  const seen = new Set();
  while (i < arr.length) {
    let j = i;
    while (j < arr.length && stats[arr[j]].pts === stats[arr[i]].pts) j++;
    const cluster = arr.slice(i, j);
    if (cluster.length === 1) {
      out.push(cluster[0]);
    } else {
      let needsManual = false;
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
        needsManual = true;
        return 0;
      });
      if (groupComplete && needsManual) {
        const key = [...cluster].sort().join("_");
        if (!seen.has(key)) {
          seen.add(key);
          unresolved.push(cluster);
        }
      }
      out.push(...sorted);
    }
    i = j;
  }
  return { order: out, stats, unresolved };
}

export function groupMatchesFor(teamIds, matches) {
  return matches.filter((m) => teamIds.includes(m.home) && teamIds.includes(m.away));
}

export function isGroupFullyScored(teamIds, matches, results) {
  const gm = groupMatchesFor(teamIds, matches);
  return gm.length > 0 && gm.every((m) => m.games.every((g) => results[g.id]?.winner));
}

/**
 * Best/worst finishing rank across all outcomes of remaining group games.
 * When the group is fully scored, uses standingsOrder if provided.
 */
export function clinchInfo(teamId, teamIds, matches, results, standingsOrder = null) {
  if (standingsOrder && isGroupFullyScored(teamIds, matches, results)) {
    const idx = standingsOrder.indexOf(teamId);
    const rank = idx < 0 ? 3 : idx + 1;
    return {
      bestRank: rank,
      worstRank: rank,
      clinchedFirst: rank === 1,
      clinchedSecond: rank === 2,
      clinchedTop2: rank <= 2,
      eliminatedFromTop2: rank > 2,
    };
  }

  const gMatches = groupMatchesFor(teamIds, matches);
  const remaining = [];
  const basePts = {};
  teamIds.forEach((id) => {
    basePts[id] = 0;
  });
  for (const match of gMatches) {
    for (const g of match.games) {
      const r = results[g.id];
      if (r?.winner) basePts[r.winner] += 1;
      else remaining.push({ home: match.home, away: match.away });
    }
  }

  // No games played yet — everyone still in contention
  if (Object.values(basePts).every((p) => p === 0) && remaining.length > 0) {
    return {
      bestRank: 1,
      worstRank: 3,
      clinchedFirst: false,
      clinchedSecond: false,
      clinchedTop2: false,
      eliminatedFromTop2: false,
    };
  }

  // Cap enumeration (3 teams × 2 sports ≤ 6 remaining games)
  if (remaining.length > 10) {
    return {
      bestRank: 1,
      worstRank: 3,
      clinchedFirst: false,
      clinchedSecond: false,
      clinchedTop2: false,
      eliminatedFromTop2: false,
    };
  }

  let bestRank = 3;
  let worstRank = 1;
  const n = remaining.length;
  if (n === 0) {
    const ranked = [...teamIds].sort((a, b) => basePts[b] - basePts[a]);
    const rank = ranked.indexOf(teamId) + 1 || 3;
    bestRank = worstRank = rank;
  } else {
    for (let mask = 0; mask < 1 << n; mask++) {
      const pts = { ...basePts };
      for (let k = 0; k < n; k++) {
        pts[(mask >> k) & 1 ? remaining[k].home : remaining[k].away] += 1;
      }
      const better = teamIds.filter((id) => id !== teamId && pts[id] > pts[teamId]).length;
      const betterOrEq = teamIds.filter((id) => id !== teamId && pts[id] >= pts[teamId]).length;
      bestRank = Math.min(bestRank, better + 1);
      worstRank = Math.max(worstRank, betterOrEq + 1);
    }
  }

  return {
    bestRank,
    worstRank,
    clinchedFirst: worstRank === 1,
    clinchedSecond: bestRank === 2 && worstRank === 2,
    clinchedTop2: worstRank <= 2,
    eliminatedFromTop2: bestRank > 2,
  };
}

export function scenarioBadge(teamId, groupTeamIds, matches, results, standingsOrder = null) {
  const info = clinchInfo(teamId, groupTeamIds, matches, results, standingsOrder);
  const gMatches = groupMatchesFor(groupTeamIds, matches);
  const anyPlayed = gMatches.some((m) => m.games.some((g) => results[g.id]?.winner));
  if (!anyPlayed) return null;
  if (info.clinchedTop2) {
    return {
      text: info.clinchedFirst ? "1st clinched" : "Top-2 clinched",
      cls: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    };
  }
  if (info.eliminatedFromTop2) {
    return { text: "Wildcard route only", cls: "bg-amber-500/20 text-amber-300 border-amber-500/40" };
  }
  return { text: "In contention", cls: "bg-sky-500/20 text-sky-300 border-sky-500/40" };
}
