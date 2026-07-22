export const GROUPS = ["A", "B", "C"];
export const PAIRS = [[0, 1], [0, 2], [1, 2]];

export const GAME_META = {
  pong: { label: "Beer Pong", icon: "🍺", marginLabel: "Cups left standing (winner)", marginMax: 10 },
  cornhole: { label: "Cornhole", icon: "🕳️", marginLabel: "Point margin (21 − loser score)", marginMax: 21 },
};

export const LS_KEY = "vegascup2026_v1";

export const DEFAULT_STATE = {
  teams: [],
  groups: { A: [], B: [], C: [] },
  locked: false,
  results: {},
  manualTiebreaks: {},
  playinWinner: null,
  ko: { QF1: null, QF2: null, QF3: null, QF4: null, SF1: null, SF2: null, TP: null, F: [] },
  pin: "",
};

export const uid = () => Math.random().toString(36).slice(2, 9);
export const deep = (o) => JSON.parse(JSON.stringify(o));
