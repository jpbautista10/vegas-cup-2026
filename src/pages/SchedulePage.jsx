import { GAME_META } from "../lib/constants";
import { buildParallelSlots, nextParallelGames, slotProgress } from "../lib/schedule";
import Flag from "../components/Flag";
import Chip from "../components/Chip";

function NowPlayingCard({ title, accent, item, teamById, requireEdit, setScoreModal }) {
  if (!item) {
    return (
      <div className={`rounded-2xl border-2 ${accent.border} ${accent.bg} p-5 opacity-60`}>
        <p className={`text-xs sm:text-sm font-black tracking-[0.2em] uppercase mb-2 ${accent.label}`}>
          {title}
        </p>
        <p className="text-base text-slate-500 font-bold">Table clear ✓</p>
      </div>
    );
  }
  const meta = GAME_META[item.type];
  return (
    <button
      type="button"
      onClick={() => requireEdit(() => setScoreModal({ match: item.match, game: item }))}
      className={`rounded-2xl border-2 ${accent.border} ${accent.bg} p-5 text-left w-full transition-all hover:scale-[1.01] shadow-lg ${accent.shadow}`}
    >
      <p className={`text-xs sm:text-sm font-black tracking-[0.2em] uppercase mb-2 animate-pulse ${accent.label}`}>
        ▶ {title} — Game {item.num}
      </p>
      <div className="flex items-center gap-3 flex-wrap mb-2">
        <Chip team={teamById(item.match.home)} size="lg" />
        <span className="text-slate-500 font-black text-lg">VS</span>
        <Chip team={teamById(item.match.away)} size="lg" />
      </div>
      <p className="text-base font-bold text-slate-300">
        {meta.icon} {meta.label} · Group {item.match.group}
      </p>
      <p className={`mt-3 text-sm font-black ${accent.label}`}>TAP TO SCORE →</p>
    </button>
  );
}

function TeamCell({ team, won, margin }) {
  if (!team) return <span className="text-slate-500 italic text-sm">TBD</span>;
  return (
    <span
      className={`inline-flex items-center gap-1.5 min-w-0 ${
        won ? "text-emerald-400" : margin != null ? "opacity-45" : ""
      }`}
    >
      <Flag name={team.name} size="sm" />
      {won && margin != null && (
        <span className="font-black text-sm tabular-nums shrink-0">+{margin}</span>
      )}
      <span className={`tracking-wide truncate ${won ? "font-black" : "font-semibold"}`}>
        {team.name}
      </span>
    </span>
  );
}

/**
 * Single sport table — groups-style card with large gradient header.
 */
function SportTable({
  title,
  icon,
  headerFrom,
  headerText,
  slots,
  sport,
  results,
  teamById,
  requireEdit,
  setScoreModal,
}) {
  if (!slots.length) return null;

  return (
    <div className="rounded-2xl border border-slate-700/60 bg-slate-900/40 overflow-hidden w-full min-w-0">
      <div className={`px-4 py-3 bg-gradient-to-r ${headerFrom} to-transparent border-b border-slate-800`}>
        <span className={`font-black tracking-widest text-xl sm:text-2xl ${headerText}`}>
          {icon} {title}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-base">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-slate-500 border-b border-slate-800">
              <th className="text-left px-4 py-2 w-16">Slot</th>
              <th className="text-left px-2 py-2">Matchup</th>
              <th className="text-center px-3 py-2 w-20">Status</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((s) => {
              const game = sport === "pong" ? s.pong : s.cornhole;
              const done = sport === "pong" ? s.pongDone : s.cornDone;
              const result = results[game.id];
              const home = teamById(game.match.home);
              const away = teamById(game.match.away);
              const homeWon = done && result?.winner === game.match.home;
              const awayWon = done && result?.winner === game.match.away;

              return (
                <tr
                  key={`${sport}-${s.slot}`}
                  onClick={() => requireEdit(() => setScoreModal({ match: game.match, game }))}
                  className={`border-b border-slate-800/40 last:border-0 cursor-pointer hover:bg-white/5 transition-colors ${
                    done ? "opacity-80" : ""
                  }`}
                >
                  <td className="px-4 py-3.5 align-middle">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-black text-amber-400 tabular-nums">S{s.slot}</span>
                      <span className="text-[10px] font-bold text-slate-500 tracking-wider">
                        G{game.num}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-3.5 align-middle">
                    <div className="flex flex-col gap-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <TeamCell team={home} won={homeWon} margin={done ? result.margin : null} />
                        <span className="text-slate-600 text-xs font-bold">vs</span>
                        <TeamCell team={away} won={awayWon} margin={done ? result.margin : null} />
                      </div>
                      <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                        Group {game.match.group}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 text-center align-middle">
                    {done ? (
                      <span className="text-[11px] font-black text-emerald-400 tracking-wide">DONE</span>
                    ) : s.partial ? (
                      <span className="text-[11px] font-black text-amber-400 tracking-wide">LIVE</span>
                    ) : (
                      <span className="text-[11px] font-black text-amber-400/80 tracking-wide">SCORE →</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function WaveSection({ label, slots, results, teamById, requireEdit, setScoreModal }) {
  return (
    <div className="space-y-3 w-full">
      <p className="text-xs font-black tracking-[0.2em] text-slate-500 uppercase text-center">{label}</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 w-full">
        <SportTable
          title="Beer Pong"
          icon="🍺"
          headerFrom="from-amber-500/15"
          headerText="text-amber-400"
          slots={slots}
          sport="pong"
          results={results}
          teamById={teamById}
          requireEdit={requireEdit}
          setScoreModal={setScoreModal}
        />
        <SportTable
          title="Cornhole"
          icon="🕳️"
          headerFrom="from-teal-500/15"
          headerText="text-teal-300"
          slots={slots}
          sport="cornhole"
          results={results}
          teamById={teamById}
          requireEdit={requireEdit}
          setScoreModal={setScoreModal}
        />
      </div>
    </div>
  );
}

export default function SchedulePage({
  matches,
  results,
  groupsComplete,
  teamById,
  requireEdit,
  setScoreModal,
}) {
  const slots = buildParallelSlots(matches);
  const progress = slotProgress(slots, results);
  const { pong, cornhole } = nextParallelGames(matches, results);
  const anyPlaying = pong || cornhole;
  const slotsDone = progress.filter((s) => s.done).length;
  const firstWave = progress.filter((s) => s.slot <= 5);
  const secondWave = progress.filter((s) => s.slot > 5);

  return (
    <div className="w-full space-y-6">
      {anyPlaying && (
        <div className="space-y-3 w-full">
          <p className="text-sm text-slate-500 uppercase tracking-widest font-bold">
            ▶ Now Playing — two tables live
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 w-full">
            <NowPlayingCard
              title="Beer Pong table"
              item={pong}
              teamById={teamById}
              requireEdit={requireEdit}
              setScoreModal={setScoreModal}
              accent={{
                border: "border-amber-400/70",
                bg: "bg-amber-500/10",
                label: "text-amber-400",
                shadow: "shadow-amber-500/10",
              }}
            />
            <NowPlayingCard
              title="Cornhole table"
              item={cornhole}
              teamById={teamById}
              requireEdit={requireEdit}
              setScoreModal={setScoreModal}
              accent={{
                border: "border-teal-400/60",
                bg: "bg-teal-500/10",
                label: "text-teal-300",
                shadow: "shadow-teal-500/10",
              }}
            />
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            Run both tables at once. Pairings are offset by group so the same players are never needed on both
            tables.
          </p>
        </div>
      )}

      {groupsComplete && (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-center text-base font-bold text-emerald-300 w-full">
          ✅ Group stage complete! Head to the Bracket tab for the knockout rounds.
        </div>
      )}

      <div className="w-full space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <p className="text-sm text-slate-500 uppercase tracking-widest font-bold">
            Day 1 — Parallel slots · 🍺 + 🕳️ together
          </p>
          <p className="text-sm font-bold text-slate-400">{slotsDone}/9 slots complete</p>
        </div>

        <WaveSection
          label="First station · Slots 1–5"
          slots={firstWave}
          results={results}
          teamById={teamById}
          requireEdit={requireEdit}
          setScoreModal={setScoreModal}
        />

        <div className="rounded-2xl border-2 border-amber-400/40 bg-amber-500/10 px-4 py-5 text-center w-full">
          <p className="text-base sm:text-lg font-black text-amber-300 tracking-wide">
            🔄 SWITCH STATIONS
          </p>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl mx-auto leading-relaxed">
            Teams that started on beer pong head to cornhole (and vice versa) for their second game.
          </p>
        </div>

        <WaveSection
          label="Second station · Slots 6–9"
          slots={secondWave}
          results={results}
          teamById={teamById}
          requireEdit={requireEdit}
          setScoreModal={setScoreModal}
        />
      </div>
    </div>
  );
}
