/**
 * Day 2 knockout order. QF and SF run as parallel pairs (G1|G2, G3|G4, G5|G6).
 */
export const KO_META = {
  QF1: { num: 1, label: "G1", wave: 1, sport: "Battle Raft", icon: "🛟", round: "QF" },
  QF2: { num: 2, label: "G2", wave: 1, sport: "Battle Raft", icon: "🛟", round: "QF" },
  QF3: { num: 3, label: "G3", wave: 2, sport: "Battle Raft", icon: "🛟", round: "QF" },
  QF4: { num: 4, label: "G4", wave: 2, sport: "Battle Raft", icon: "🛟", round: "QF" },
  SF1: { num: 5, label: "G5", wave: 3, sport: "Cornhole", icon: "🕳️", round: "SF" },
  SF2: { num: 6, label: "G6", wave: 3, sport: "Cornhole", icon: "🕳️", round: "SF" },
  TP: { num: 7, label: "G7", wave: 4, sport: "Flip Cup", icon: "🥉", round: "Bronze" },
  F: { num: 8, label: "G8", wave: 5, sport: "Beer Pong", icon: "🍺", round: "Final" },
};

export const KO_WAVES = [
  { wave: 1, title: "Quarterfinals · Battle Raft", slots: ["QF1", "QF2"], note: "Run G1 + G2 together" },
  { wave: 2, title: "Quarterfinals · Battle Raft", slots: ["QF3", "QF4"], note: "Run G3 + G4 together" },
  { wave: 3, title: "Semifinals · Cornhole", slots: ["SF1", "SF2"], note: "Run G5 + G6 together" },
  { wave: 4, title: "Bronze · Flip Cup", slots: ["TP"], note: "Best-of series · Loser SF1 vs Loser SF2" },
  { wave: 5, title: "The Final · Beer Pong", slots: ["F"], note: "Best-of series under the lights" },
];

export function koResultDone(slot, state) {
  if (slot === "F") {
    // Final "done" is handled by champion outside; series in progress still counts as live
    return (state.ko.F || []).length > 0 && false;
  }
  return Boolean(state.ko[slot]?.winner);
}

/** Next parallel pair (or single) that still needs a result. */
export function nextKoGames(state, bracketReady, champion, bronzeWinner = null) {
  if (!bracketReady) return { a: null, b: null, wave: null };
  if (champion && bronzeWinner) return { a: null, b: null, wave: null };

  for (const w of KO_WAVES) {
    if (w.wave === 5) {
      if (!champion && state.ko.SF1?.winner && state.ko.SF2?.winner) {
        return { a: "F", b: null, wave: w };
      }
      continue;
    }
    if (w.wave === 4) {
      if (!bronzeWinner && state.ko.SF1?.winner && state.ko.SF2?.winner) {
        return { a: "TP", b: null, wave: w };
      }
      continue;
    }
    if (w.wave === 3) {
      const needSf1 = state.ko.QF1?.winner && state.ko.QF2?.winner && !state.ko.SF1?.winner;
      const needSf2 = state.ko.QF3?.winner && state.ko.QF4?.winner && !state.ko.SF2?.winner;
      if (needSf1 || needSf2) {
        return {
          a: needSf1 ? "SF1" : null,
          b: needSf2 ? "SF2" : null,
          wave: w,
        };
      }
      continue;
    }
    // QF waves
    const pending = w.slots.filter((s) => !state.ko[s]?.winner);
    if (pending.length) {
      return { a: pending[0] || null, b: pending[1] || null, wave: w };
    }
  }
  return { a: null, b: null, wave: null };
}

export function waveStatus(slots, state, champion, bronzeWinner = null) {
  if (slots.includes("F")) {
    if (champion) return "done";
    if ((state.ko.F || []).length > 0) return "live";
    if (state.ko.SF1?.winner && state.ko.SF2?.winner) return "next";
    if (state.ko.SF1?.winner || state.ko.SF2?.winner) return "filling";
    return "wait";
  }
  if (slots.includes("TP")) {
    if (bronzeWinner) return "done";
    const tpLen = Array.isArray(state.ko.TP) ? state.ko.TP.length : state.ko.TP?.winner ? 1 : 0;
    if (tpLen > 0) return "live";
    if (state.ko.SF1?.winner && state.ko.SF2?.winner) return "next";
    if (state.ko.SF1?.winner || state.ko.SF2?.winner) return "filling";
    return "wait";
  }
  if (slots.includes("SF1")) {
    const done = slots.every((s) => state.ko[s]?.winner);
    if (done) return "done";
    const sf1Ready = state.ko.QF1?.winner && state.ko.QF2?.winner && !state.ko.SF1?.winner;
    const sf2Ready = state.ko.QF3?.winner && state.ko.QF4?.winner && !state.ko.SF2?.winner;
    if (sf1Ready || sf2Ready) return "live";
    // QF winners already locking into SF slots (progress before both sides are set)
    const filling =
      state.ko.QF1?.winner ||
      state.ko.QF2?.winner ||
      state.ko.QF3?.winner ||
      state.ko.QF4?.winner;
    if (filling && (!state.ko.SF1?.winner || !state.ko.SF2?.winner)) return "filling";
    return "wait";
  }
  // QF
  const done = slots.every((s) => state.ko[s]?.winner);
  if (done) return "done";
  const anyPending = slots.some((s) => !state.ko[s]?.winner);
  const priorWavesDone = KO_WAVES.filter((w) => w.wave < KO_META[slots[0]].wave).every((w) =>
    w.slots.every((s) => (s === "F" ? false : state.ko[s]?.winner)),
  );
  if (anyPending && priorWavesDone) {
    const partial = slots.some((s) => state.ko[s]?.winner) && slots.some((s) => !state.ko[s]?.winner);
    return partial ? "live" : "next";
  }
  if (anyPending) return "wait";
  return "done";
}
