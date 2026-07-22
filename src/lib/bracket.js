import { GROUPS } from "./constants";

export const BRACKET_SLOTS = {
  QF1: {
    aLabel: "Winner Group A",
    bLabel: "Wildcard 1 (best 3rd)",
    tag: "Winner A vs Wildcard 1",
  },
  QF2: {
    aLabel: "Winner Group B",
    bLabel: "Wildcard 2 (2nd-best 3rd)",
    tag: "Winner B vs Wildcard 2",
  },
  QF3: {
    aLabel: "Winner Group C",
    bLabel: "Runner-up Group A",
    tag: "Winner C vs Runner-up A",
  },
  QF4: {
    aLabel: "Runner-up Group B",
    bLabel: "Runner-up Group C",
    tag: "Runner-up B vs Runner-up C",
  },
};

function slot(key, a = null, b = null, extra = {}) {
  const meta = BRACKET_SLOTS[key];
  return {
    a,
    b,
    aLabel: meta.aLabel,
    bLabel: meta.bLabel,
    tag: meta.tag,
    scorable: false,
    ...extra,
  };
}

/** Always returns a QF bracket view — placeholders until groups (+ play-in) resolve. */
export function seedBracket(groupData, thirdPlace, groupsComplete) {
  // Empty / in-progress group stage: show structure only
  if (!groupsComplete || !thirdPlace) {
    return {
      QF1: slot("QF1"),
      QF2: slot("QF2"),
      QF3: slot("QF3"),
      QF4: slot("QF4"),
      ready: false,
      status: "groups",
    };
  }

  const W = {};
  const RU = {};
  GROUPS.forEach((g) => {
    W[g] = groupData[g].order[0];
    RU[g] = groupData[g].order[1];
  });

  // Play-in pending: known winners/RUs, wildcards TBD
  if (thirdPlace.playinNeeded) {
    return {
      QF1: slot("QF1", W.A, null, { bLabel: "Wildcard 1 (flip-cup play-in)" }),
      QF2: slot("QF2", W.B, null, { bLabel: "Wildcard 2 (flip-cup play-in)" }),
      QF3: slot("QF3", W.C, RU.A),
      QF4: slot("QF4", RU.B, RU.C),
      ready: false,
      status: "playin",
    };
  }

  let wc1 = thirdPlace.ranked[0];
  let wc2 = thirdPlace.ranked[1];
  if (wc1.group === "A" || wc2.group === "B") {
    if (wc1.group === "A" || (wc2.group === "B" && wc1.group !== "B")) {
      [wc1, wc2] = [wc2, wc1];
    }
  }

  return {
    QF1: slot("QF1", W.A, wc1.id, { scorable: true }),
    QF2: slot("QF2", W.B, wc2.id, { scorable: true }),
    QF3: slot("QF3", W.C, RU.A, { scorable: true }),
    QF4: slot("QF4", RU.B, RU.C, { scorable: true }),
    ready: true,
    status: "live",
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
