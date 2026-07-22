import { GAME_META } from "../lib/constants";
import { flatGames } from "../lib/schedule";
import { flagOf } from "../lib/flags";
import Chip from "../components/Chip";

export default function SchedulePage({
  matches,
  results,
  nextGame,
  groupsComplete,
  teamById,
  requireEdit,
  setScoreModal,
}) {
  return (
    <div className="space-y-5">
      {nextGame && (
        <div
          className="rounded-2xl border-2 border-amber-400/70 p-5 sm:p-6 relative overflow-hidden shadow-lg shadow-amber-500/10"
          style={{ background: "linear-gradient(90deg,rgba(245,200,66,0.15),rgba(255,90,95,0.1))" }}
        >
          <p className="text-xs sm:text-sm font-black tracking-[0.25em] text-amber-400 uppercase mb-2 animate-pulse">
            ▶ Now Playing — Game {nextGame.game.num}
          </p>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-4 flex-wrap">
              <Chip team={teamById(nextGame.match.home)} size="lg" />
              <span className="text-slate-500 font-black text-lg">VS</span>
              <Chip team={teamById(nextGame.match.away)} size="lg" />
            </div>
            <span className="text-base font-bold text-slate-300">
              {GAME_META[nextGame.game.type].icon} {GAME_META[nextGame.game.type].label} · Group{" "}
              {nextGame.match.group}
            </span>
          </div>
        </div>
      )}
      {groupsComplete && (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-center text-base font-bold text-emerald-300">
          ✅ Group stage complete! Head to the Bracket tab for the knockout rounds.
        </div>
      )}
      <p className="text-sm text-slate-500 uppercase tracking-widest font-bold">
        Day 1 — Group Stage · 18 games in 2 rounds
      </p>
      {[
        { round: 1, title: "ROUND 1 — 🍺 BEER PONG", range: [1, 9] },
        { round: 2, title: "ROUND 2 — 🕳️ CORNHOLE", range: [10, 18] },
      ].map((rd) => {
        const games = flatGames(matches).filter((g) => g.num >= rd.range[0] && g.num <= rd.range[1]);
        const done = games.filter((g) => results[g.id]?.winner).length;
        return (
          <div key={rd.round} className="rounded-2xl border border-slate-700/60 bg-slate-900/40 overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between border-b border-slate-800 bg-gradient-to-r from-amber-500/10 to-transparent">
              <span className="text-base sm:text-lg font-black tracking-widest text-amber-300">{rd.title}</span>
              <span className="text-sm font-bold text-slate-500">{done}/9 played</span>
            </div>
            {games.map((g) => {
              const r = results[g.id];
              const m = g.match;
              return (
                <button
                  key={g.id}
                  onClick={() => requireEdit(() => setScoreModal({ match: m, game: g }))}
                  className="w-full px-4 py-4 flex items-center justify-between gap-3 hover:bg-white/5 transition-all border-b border-slate-800/50 last:border-0 min-h-[56px] hover:scale-[1.01]"
                >
                  <span className="flex items-center gap-3 min-w-0">
                    <span className="text-slate-600 text-sm font-mono w-10 shrink-0">G{g.num}</span>
                    <span className="text-xs font-black text-slate-500 w-7 shrink-0">{m.group}</span>
                    <span className="flex items-center gap-2 flex-wrap">
                      <Chip team={teamById(m.home)} size="sm" />
                      <span className="text-slate-600 text-sm">vs</span>
                      <Chip team={teamById(m.away)} size="sm" />
                    </span>
                  </span>
                  {r?.winner ? (
                    <span className="text-base font-bold text-emerald-400 flex items-center gap-2 shrink-0">
                      {flagOf(teamById(r.winner)?.name)} +{r.margin}
                    </span>
                  ) : (
                    <span className="text-sm text-amber-400/80 font-bold shrink-0">SCORE →</span>
                  )}
                </button>
              );
            })}
            {rd.round === 1 && done === 9 && (
              <div className="px-4 py-4 bg-amber-500/10 text-center text-sm sm:text-base font-black text-amber-300 tracking-widest">
                🎤 HALFTIME — check the tables, talk trash, hydrate. Round 2 awaits.
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
