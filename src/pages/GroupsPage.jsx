import { GROUPS } from "../lib/constants";
import { scenarioBadge } from "../lib/standings";
import Chip from "../components/Chip";
import Flag from "../components/Flag";
import TieResolver from "../components/UI";

export default function GroupsPage({
  state,
  matches,
  groupData,
  groupsComplete,
  thirdPlace,
  groupTieAlerts,
  celebrate,
  teamById,
  requireEdit,
  pushHistory,
  setState,
  setCelebrate,
}) {
  return (
    <div className="space-y-6">
      {groupTieAlerts.map((a, i) => (
        <TieResolver
          key={i}
          alert={a}
          teamById={teamById}
          onResolve={(order) =>
            requireEdit(() => {
              pushHistory();
              const key = `g${a.group}_` + [...a.cluster].sort().join("_");
              setState((s) => ({ ...s, manualTiebreaks: { ...s.manualTiebreaks, [key]: order } }));
            })
          }
        />
      ))}
      {GROUPS.map((g) => {
        const d = groupData[g];
        if (!d) return null;
        return (
          <div key={g} className="rounded-2xl border border-slate-700/60 bg-slate-900/40 overflow-hidden">
            <div className="px-4 py-3 bg-gradient-to-r from-amber-500/15 to-transparent border-b border-slate-800">
              <span className="font-black tracking-widest text-amber-400 text-xl sm:text-2xl">GROUP {g}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-base min-w-[520px]">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-slate-500 border-b border-slate-800">
                    <th className="text-left px-4 py-2">#</th>
                    <th className="text-left">Team</th>
                    <th className="text-center">P</th>
                    <th className="text-center">W</th>
                    <th className="text-center">L</th>
                    <th className="text-center font-bold text-slate-200">Diff</th>
                    <th className="text-center">🍺Diff</th>
                    <th className="text-center font-bold text-amber-400">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {d.order.map((id, idx) => {
                    const s = d.stats[id];
                    const badge = scenarioBadge(id, state.groups[g], matches, state.results);
                    const qualified = groupsComplete && idx < 2;
                    const isThird = groupsComplete && idx === 2;
                    return (
                      <tr
                        key={id}
                        className={`border-b border-slate-800/40 last:border-0 transition-all ${
                          qualified ? "bg-emerald-500/10" : ""
                        } ${celebrate === id ? "animate-pulse bg-emerald-500/25" : ""}`}
                      >
                        <td className="px-4 py-3 text-slate-500 font-mono text-sm">{idx + 1}</td>
                        <td>
                          <div className="flex items-center gap-2 flex-wrap py-1">
                            <Chip team={teamById(id)} size="sm" />
                            {qualified && (
                              <span className="text-[10px] font-black px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 q-glow">
                                Q
                              </span>
                            )}
                            {isThird && (
                              <span className="text-[10px] font-black px-2 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                3RD→WC?
                              </span>
                            )}
                            {!groupsComplete && badge && (
                              <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${badge.cls}`}>
                                {badge.text}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="text-center text-slate-400">{s.P}</td>
                        <td className="text-center text-slate-400">{s.W}</td>
                        <td className="text-center text-slate-400">{s.L}</td>
                        <td
                          className={`text-center font-black text-lg ${
                            s.diff > 0 ? "text-emerald-400" : s.diff < 0 ? "text-rose-400" : "text-slate-400"
                          }`}
                        >
                          {s.diff > 0 ? "+" : ""}
                          {s.diff}
                        </td>
                        <td className="text-center text-slate-500 text-sm">
                          {s.pongDiff > 0 ? "+" : ""}
                          {s.pongDiff}
                        </td>
                        <td className="text-center font-black text-amber-400 text-xl">{s.pts}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      {groupsComplete && thirdPlace && (
        <div className="rounded-2xl border-2 border-amber-500/40 bg-slate-900/60 overflow-hidden">
          <div className="px-4 py-3 bg-amber-500/15 border-b border-amber-500/30">
            <span className="font-black tracking-widest text-amber-300 text-lg sm:text-xl">
              🃏 THIRD-PLACE RANKING — Best 2 advance as wildcards
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-base min-w-[480px]">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-slate-500 border-b border-slate-800">
                  <th className="text-left px-4 py-2">#</th>
                  <th className="text-left">Team</th>
                  <th className="text-center">Grp</th>
                  <th className="text-center">Pts</th>
                  <th className="text-center">Diff</th>
                  <th className="text-center">Roster</th>
                  <th className="text-center">Fate</th>
                </tr>
              </thead>
              <tbody>
                {thirdPlace.ranked.map((t, idx) => (
                  <tr
                    key={t.id}
                    className={`border-b border-slate-800/40 last:border-0 ${
                      idx < 2 ? "bg-emerald-500/10" : "bg-rose-500/10"
                    }`}
                  >
                    <td className="px-4 py-3 text-slate-500 font-mono text-sm">{idx + 1}</td>
                    <td>
                      <Chip team={teamById(t.id)} size="sm" />
                    </td>
                    <td className="text-center text-slate-400">{t.group}</td>
                    <td className="text-center font-black text-amber-400 text-lg">{t.stats.pts}</td>
                    <td className="text-center font-bold text-lg">
                      {t.stats.diff > 0 ? "+" : ""}
                      {t.stats.diff}
                    </td>
                    <td className="text-center text-slate-400">
                      {teamById(t.id)?.players?.filter(Boolean).length}
                    </td>
                    <td className="text-center text-sm font-black">
                      {idx < 2 ? (
                        <span className="text-emerald-400">WILDCARD ✅</span>
                      ) : (
                        <span className="text-rose-400">ELIMINATED ❌</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {thirdPlace.playinNeeded && (
            <div className="p-5 border-t-2 border-rose-500/40 bg-rose-500/10">
              <p className="font-black text-rose-300 text-xl mb-2">
                ⚡ DEAD TIE — FLIP CUP WILDCARD PLAY-IN REQUIRED!
              </p>
              <p className="text-base text-slate-400 mb-4">
                {teamById(thirdPlace.playinTeams[0].id)?.name} and{" "}
                {teamById(thirdPlace.playinTeams[1].id)?.name} are identical on every tiebreaker. One flip
                cup relay, winner takes the last wildcard spot.
              </p>
              <div className="flex gap-3 flex-wrap">
                {thirdPlace.playinTeams.map((t) => (
                  <button
                    key={t.id}
                    onClick={() =>
                      requireEdit(() => {
                        pushHistory();
                        setState((s) => ({ ...s, playinWinner: t.id }));
                        setCelebrate(t.id);
                        setTimeout(() => setCelebrate(null), 2500);
                      })
                    }
                    className="flex-1 min-h-[52px] py-3 rounded-xl border-2 border-amber-500/50 bg-slate-900 font-bold text-base hover:bg-amber-500/20 transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <Flag name={teamById(t.id)?.name} size="md" /> {teamById(t.id)?.name} won
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
