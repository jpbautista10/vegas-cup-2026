import { GROUPS } from "./constants";

/** Seed QFs from group winners / runners-up / wildcards, applying same-group swap rule. */
export function seedBracket(groupData, thirdPlace) {
  if (!thirdPlace || thirdPlace.playinNeeded) return null;
  const W = {};
  const RU = {};
  GROUPS.forEach((g) => {
    W[g] = groupData[g].order[0];
    RU[g] = groupData[g].order[1];
  });
  let wc1 = thirdPlace.ranked[0];
  let wc2 = thirdPlace.ranked[1];
  if (wc1.group === "A" || wc2.group === "B") {
    if (wc1.group === "A" || (wc2.group === "B" && wc1.group !== "B")) {
      [wc1, wc2] = [wc2, wc1];
    }
  }
  return {
    QF1: { a: W.A, b: wc1.id, tag: "Winner A vs Wildcard 1" },
    QF2: { a: W.B, b: wc2.id, tag: "Winner B vs Wildcard 2" },
    QF3: { a: W.C, b: RU.A, tag: "Winner C vs Runner-up A" },
    QF4: { a: RU.B, b: RU.C, tag: "Runner-up B vs Runner-up C" },
  };
}

export function rankThirdPlace(groupsComplete, groupData, teams, playinWinner) {
  if (!groupsComplete) return null;
  const thirds = GROUPS.map((g) => ({
    group: g,
    id: groupData[g].order[2],
    stats: groupData[g].stats[groupData[g].order[2]],
  }));
  const roster = (id) => teams.find((t) => t.id === id)?.players?.filter(Boolean).length || 99;
  const cmp = (a, b) => {
    if (b.stats.pts !== a.stats.pts) return b.stats.pts - a.stats.pts;
    if (b.stats.diff !== a.stats.diff) return b.stats.diff - a.stats.diff;
    if (roster(a.id) !== roster(b.id)) return roster(a.id) - roster(b.id);
    return 0;
  };
  const sorted = [...thirds].sort(cmp);
  const tie23 = cmp(sorted[1], sorted[2]) === 0 && cmp(sorted[2], sorted[1]) === 0;
  let final = sorted;
  if (tie23 && playinWinner) {
    const w = sorted.slice(1).find((t) => t.id === playinWinner);
    const l = sorted.slice(1).find((t) => t.id !== playinWinner);
    final = [sorted[0], w, l];
  }
  return {
    ranked: final,
    playinNeeded: tie23 && !playinWinner,
    playinTeams: tie23 ? [sorted[1], sorted[2]] : null,
  };
}
