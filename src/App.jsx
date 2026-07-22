import { useState, useEffect, useRef, useMemo } from "react";
import { GROUPS, DEFAULT_STATE, uid, deep, winsNeeded } from "./lib/constants";
import { flagOf } from "./lib/flags";
import { buildSchedule } from "./lib/schedule";
import { teamStats } from "./lib/stats";
import { sortGroup } from "./lib/standings";
import { seedBracket, rankThirdPlace } from "./lib/bracket";
import { loadState, saveState } from "./lib/storage";
import { applyTheme, loadTheme, saveTheme } from "./lib/theme";
import Confetti from "./components/Confetti";
import Modal from "./components/Modal";
import ScoreModal from "./components/ScoreModal";
import KOModal from "./components/KOModal";
import VegasLogo from "./components/VegasLogo";
import SchedulePage from "./pages/SchedulePage";
import GroupsPage from "./pages/GroupsPage";
import BracketPage from "./pages/BracketPage";
import StatsPage from "./pages/StatsPage";
import RulesPage from "./pages/RulesPage";
import SetupPage from "./pages/SetupPage";

export default function App() {
  const [state, setState] = useState(loadState);
  const [theme, setTheme] = useState(loadTheme);
  const [tab, setTab] = useState("schedule");
  const [unlocked, setUnlocked] = useState(false);
  const [pinPrompt, setPinPrompt] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [scoreModal, setScoreModal] = useState(null);
  const [koModal, setKoModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [celebrate, setCelebrate] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const historyRef = useRef([]);
  const fileRef = useRef(null);

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    applyTheme(theme);
    saveTheme(theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const canEdit = !state.pin || unlocked;
  const requireEdit = (fn) => {
    if (canEdit) fn();
    else setPinPrompt(true);
  };
  const pushHistory = () => {
    historyRef.current = [...historyRef.current.slice(-24), deep(state)];
  };
  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };
  const undo = () => {
    const prev = historyRef.current.pop();
    if (prev) {
      setState(prev);
      flash("Undone ↩️");
    } else flash("Nothing to undo");
  };

  const teamById = (id) => state.teams.find((t) => t.id === id);
  const matches = useMemo(
    () => (state.locked ? buildSchedule(state.groups) : []),
    [state.locked, state.groups],
  );

  const groupData = useMemo(() => {
    const data = {};
    for (const g of GROUPS) {
      const ids = state.groups[g];
      if (!ids || ids.length < 3) {
        data[g] = null;
        continue;
      }
      const gm = matches.filter((m) => m.group === g);
      data[g] = {
        ...sortGroup(ids, gm, state.results, state.teams, state.manualTiebreaks, `g${g}_`),
        matches: gm,
      };
    }
    return data;
  }, [state, matches]);

  const groupsComplete =
    state.locked && matches.every((m) => m.games.every((g) => state.results[g.id]?.winner));

  const thirdPlace = useMemo(
    () => rankThirdPlace(groupsComplete, groupData, state.teams, state.playinWinner),
    [groupsComplete, groupData, state.playinWinner, state.teams],
  );

  const bracket = useMemo(
    () => (state.locked ? seedBracket(groupData, thirdPlace, groupsComplete) : null),
    [state.locked, thirdPlace, groupData, groupsComplete],
  );

  const bracketReady = Boolean(bracket?.ready);
  const koWinner = (slot) => (bracketReady ? state.ko[slot]?.winner || null : null);
  const sf1 =
    bracketReady && state.ko.QF1?.winner && state.ko.QF2?.winner
      ? { a: state.ko.QF1.winner, b: state.ko.QF2.winner, scorable: true }
      : { a: null, b: null, aLabel: "Winner QF1", bLabel: "Winner QF2", scorable: false };
  const sf2 =
    bracketReady && state.ko.QF3?.winner && state.ko.QF4?.winner
      ? { a: state.ko.QF3.winner, b: state.ko.QF4.winner, scorable: true }
      : { a: null, b: null, aLabel: "Winner QF3", bLabel: "Winner QF4", scorable: false };
  const finalists =
    bracketReady && koWinner("SF1") && koWinner("SF2")
      ? { a: koWinner("SF1"), b: koWinner("SF2") }
      : null;
  const finalPreview = finalists || {
    a: null,
    b: null,
    aLabel: "Winner SF1",
    bLabel: "Winner SF2",
  };
  const tpTeams =
    bracketReady && state.ko.SF1?.winner && state.ko.SF2?.winner
      ? {
          a: [state.ko.SF1.a, state.ko.SF1.b].find((x) => x !== state.ko.SF1.winner),
          b: [state.ko.SF2.a, state.ko.SF2.b].find((x) => x !== state.ko.SF2.winner),
        }
      : null;
  const finalGames = bracketReady ? state.ko.F || [] : [];
  const finalBestOf = state.finalBestOf || 3;
  const finalWinsNeeded = winsNeeded(finalBestOf);
  const finalTally = finalists
    ? {
        a: finalGames.filter((w) => w === finalists.a).length,
        b: finalGames.filter((w) => w === finalists.b).length,
      }
    : null;
  const champion =
    finalTally &&
    (finalTally.a >= finalWinsNeeded
      ? finalists.a
      : finalTally.b >= finalWinsNeeded
        ? finalists.b
        : null);
  const thirdPlaceWinner = bracketReady ? state.ko.TP?.winner : null;

  // If group stage (or play-in) is no longer complete, wipe knockout leftovers
  useEffect(() => {
    if (!state.locked) return;
    const hasKo =
      (state.ko.F || []).length > 0 ||
      ["QF1", "QF2", "QF3", "QF4", "SF1", "SF2", "TP"].some((k) => state.ko[k]);
    const clearedKo = {
      QF1: null,
      QF2: null,
      QF3: null,
      QF4: null,
      SF1: null,
      SF2: null,
      TP: null,
      F: [],
    };
    if (!groupsComplete) {
      if (hasKo || state.playinWinner) {
        setState((s) => ({ ...s, playinWinner: null, ko: clearedKo }));
      }
      return;
    }
    if (thirdPlace?.playinNeeded && hasKo) {
      setState((s) => ({ ...s, ko: clearedKo }));
    }
  }, [state.locked, groupsComplete, thirdPlace?.playinNeeded, state.ko, state.playinWinner]);

  const leaderboards = useMemo(() => {
    if (!state.locked) return null;
    const rows = state.teams.map((t) => {
      const s = teamStats(t.id, matches, state.results);
      let koWins = 0;
      ["QF1", "QF2", "QF3", "QF4", "SF1", "SF2", "TP"].forEach((k) => {
        if (state.ko[k]?.winner === t.id) koWins++;
      });
      koWins += finalGames.filter((w) => w === t.id).length;
      return { team: t, ...s, koWins, totalWins: s.W + koWins };
    });
    return {
      goldenCup: [...rows].sort((a, b) => b.cupsSunk - a.cupsSunk),
      cornCannon: [...rows].sort((a, b) => b.cornPts - a.cornPts),
      diffKings: [...rows].sort((a, b) => b.diff - a.diff),
      winMachine: [...rows].sort((a, b) => b.totalWins - a.totalWins),
    };
  }, [state, matches, finalGames]);

  const groupTieAlerts = useMemo(() => {
    const alerts = [];
    for (const g of GROUPS) {
      const d = groupData[g];
      if (d?.unresolved?.length) {
        d.unresolved.forEach((cluster) => alerts.push({ group: g, cluster }));
      }
    }
    return alerts;
  }, [groupData]);

  const saveScore = (gameId, winner, margin) => {
    pushHistory();
    setState((s) => ({ ...s, results: { ...s.results, [gameId]: { winner, margin: Number(margin) } } }));
    setScoreModal(null);
    const t = teamById(winner);
    flash(`✅ ${flagOf(t?.name)} ${t?.name} wins!`);
  };
  const clearScore = (gameId) => {
    pushHistory();
    setState((s) => {
      const r = { ...s.results };
      delete r[gameId];
      return { ...s, results: r };
    });
    setScoreModal(null);
  };
  const saveKO = (slot, payload) => {
    pushHistory();
    setState((s) => ({ ...s, ko: { ...s.ko, [slot]: payload } }));
    setKoModal(null);
    setCelebrate(payload.winner);
    setTimeout(() => setCelebrate(null), 2500);
    flash(`🚀 ${flagOf(teamById(payload.winner)?.name)} advances!`);
  };
  const addFinalGame = (winnerId) => {
    pushHistory();
    setState((s) => ({ ...s, ko: { ...s.ko, F: [...(s.ko.F || []), winnerId] } }));
  };
  const resetFinal = () => {
    pushHistory();
    setState((s) => ({ ...s, ko: { ...s.ko, F: [] } }));
  };

  const addTeam = () => {
    if (state.teams.length >= 9) return flash("Max 9 teams");
    pushHistory();
    setState((s) => ({ ...s, teams: [...s.teams, { id: uid(), name: "", players: ["", ""] }] }));
  };
  const updateTeam = (id, patch) =>
    setState((s) => ({ ...s, teams: s.teams.map((t) => (t.id === id ? { ...t, ...patch } : t)) }));
  const removeTeam = (id) => {
    pushHistory();
    setState((s) => ({
      ...s,
      teams: s.teams.filter((t) => t.id !== id),
      groups: {
        A: s.groups.A.filter((x) => x !== id),
        B: s.groups.B.filter((x) => x !== id),
        C: s.groups.C.filter((x) => x !== id),
      },
    }));
  };
  const randomDraw = () => {
    pushHistory();
    const shuffled = [...state.teams.map((t) => t.id)];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setState((s) => ({
      ...s,
      groups: { A: shuffled.slice(0, 3), B: shuffled.slice(3, 6), C: shuffled.slice(6, 9) },
    }));
    flash("🎲 Groups drawn!");
  };
  const lockTournament = () => {
    if (state.teams.length !== 9) return flash("Need exactly 9 teams");
    if (state.teams.some((t) => !t.name.trim())) return flash("Every team needs a country name");
    if (GROUPS.some((g) => state.groups[g].length !== 3)) return flash("Draw the groups first");
    pushHistory();
    setState((s) => ({ ...s, locked: true }));
    setTab("schedule");
    flash("🏆 Tournament started!");
  };
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `vegas-cup-backup-${new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-")}.json`;
    a.click();
    flash("⬇️ Backup downloaded");
  };
  const importJSON = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        pushHistory();
        setState({ ...deep(DEFAULT_STATE), ...JSON.parse(e.target.result) });
        flash("📥 Tournament restored");
      } catch {
        flash("Invalid backup file");
      }
    };
    reader.readAsText(file);
  };
  const fullReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 4000);
      return;
    }
    pushHistory();
    setState(deep(DEFAULT_STATE));
    setConfirmReset(false);
    setTab("setup");
    flash("🗑️ Tournament wiped");
  };

  const tabs = [
    ["schedule", "📋 Schedule"],
    ["groups", "🏟️ Groups"],
    ["bracket", "🏆 Bracket"],
    ["stats", "📊 Stats"],
    ["rules", "📖 Rules"],
    ["setup", "⚙️ Setup"],
  ];

  return (
    <div
      className="min-h-screen text-slate-100 vegas-strip"
      style={{ background: "var(--vc-page)" }}
    >
      {champion && <Confetti />}

      <header
        className="sticky top-0 z-40 backdrop-blur-md border-b border-[#ffd700]/25"
        style={{ background: "var(--vc-header)" }}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-3">
          <VegasLogo />
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="theme-toggle"
            >
              {theme === "dark" ? "☀ Light" : "☾ Dark"}
            </button>
            {state.pin && (
              <button
                type="button"
                onClick={() => (unlocked ? setUnlocked(false) : setPinPrompt(true))}
                className={`min-h-[44px] text-sm px-3 py-2 rounded-xl border font-bold ${
                  unlocked
                    ? "border-emerald-500/50 text-emerald-300"
                    : "border-slate-600 text-slate-400"
                }`}
              >
                {unlocked ? "🔓 Ref" : "🔒"}
              </button>
            )}
            <button type="button" onClick={undo} className="header-undo text-sm">
              ↩ Undo
            </button>
          </div>
        </div>
        <nav className="max-w-6xl mx-auto px-3 flex overflow-x-auto gap-2 pb-3">
          {tabs.map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`whitespace-nowrap min-h-[44px] px-5 py-2.5 rounded-full text-sm sm:text-base font-bold tracking-wide transition-all ${
                tab === k
                  ? "neon-tab-active"
                  : "text-slate-400 hover:text-[#ffd700] hover:bg-[#ffd700]/5 border border-transparent hover:border-[#ffd700]/25"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8 pb-28">
        {!state.locked && tab !== "setup" && tab !== "rules" && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-8 text-center">
            <p className="text-4xl mb-3">🎲</p>
            <p className="font-bold text-amber-300 text-2xl">Tournament not started yet</p>
            <p className="text-base text-slate-400 mt-2">Add your 9 teams and draw the groups in Setup.</p>
            <button
              onClick={() => setTab("setup")}
              className="mt-5 min-h-[48px] px-6 py-3 rounded-xl bg-amber-400 text-slate-900 font-bold text-base"
            >
              Go to Setup →
            </button>
          </div>
        )}

        {tab === "schedule" && state.locked && (
          <SchedulePage
            matches={matches}
            results={state.results}
            groupsComplete={groupsComplete}
            teamById={teamById}
            requireEdit={requireEdit}
            setScoreModal={setScoreModal}
          />
        )}

        {tab === "groups" && state.locked && (
          <GroupsPage
            state={state}
            matches={matches}
            groupData={groupData}
            groupsComplete={groupsComplete}
            thirdPlace={thirdPlace}
            groupTieAlerts={groupTieAlerts}
            celebrate={celebrate}
            teamById={teamById}
            requireEdit={requireEdit}
            pushHistory={pushHistory}
            setState={setState}
            setCelebrate={setCelebrate}
          />
        )}

        {tab === "bracket" && state.locked && (
          <BracketPage
            bracket={bracket}
            thirdPlace={thirdPlace}
            state={state}
            celebrate={celebrate}
            teamById={teamById}
            requireEdit={requireEdit}
            setKoModal={setKoModal}
            sf1={sf1}
            sf2={sf2}
            finalists={finalists}
            finalPreview={finalPreview}
            tpTeams={tpTeams}
            finalGames={finalGames}
            finalTally={finalTally}
            champion={champion}
            thirdPlaceWinner={thirdPlaceWinner}
            addFinalGame={addFinalGame}
            resetFinal={resetFinal}
            finalBestOf={finalBestOf}
            finalWinsNeeded={finalWinsNeeded}
            bracketReady={bracketReady}
          />
        )}

        {tab === "stats" && state.locked && (
          <StatsPage leaderboards={leaderboards} teamById={teamById} />
        )}

        {tab === "rules" && <RulesPage />}

        {tab === "setup" && (
          <SetupPage
            state={state}
            canEdit={canEdit}
            requireEdit={requireEdit}
            teamById={teamById}
            addTeam={addTeam}
            updateTeam={updateTeam}
            removeTeam={removeTeam}
            randomDraw={randomDraw}
            lockTournament={lockTournament}
            setState={setState}
            exportJSON={exportJSON}
            importJSON={importJSON}
            fileRef={fileRef}
            fullReset={fullReset}
            confirmReset={confirmReset}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        )}
      </main>

      {scoreModal && (
        <ScoreModal
          data={scoreModal}
          teamById={teamById}
          existing={state.results[scoreModal.game.id]}
          onSave={saveScore}
          onClear={clearScore}
          onClose={() => setScoreModal(null)}
        />
      )}

      {koModal && (
        <KOModal data={koModal} teamById={teamById} onSave={saveKO} onClose={() => setKoModal(null)} />
      )}

      {pinPrompt && (
        <Modal onClose={() => setPinPrompt(false)}>
          <p className="font-black text-xl mb-4">🔒 Enter Ref PIN</p>
          <input
            type="password"
            autoFocus
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              (pinInput === state.pin
                ? (setUnlocked(true), setPinPrompt(false), setPinInput(""))
                : flash("Wrong PIN"))
            }
            className="w-full bg-slate-800 border border-slate-600 rounded-xl px-3 py-3 text-2xl text-center tracking-[0.5em] min-h-[52px]"
          />
          <button
            onClick={() =>
              pinInput === state.pin
                ? (setUnlocked(true), setPinPrompt(false), setPinInput(""))
                : flash("Wrong PIN")
            }
            className="mt-4 w-full min-h-[48px] py-3 rounded-xl bg-amber-400 text-slate-900 font-black text-base"
          >
            Unlock
          </button>
        </Modal>
      )}

      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full bg-slate-800 border border-amber-500/40 text-base font-bold shadow-xl text-slate-100">
          {toast}
        </div>
      )}
    </div>
  );
}
