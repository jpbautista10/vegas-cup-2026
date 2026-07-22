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
