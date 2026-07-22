import { flagOf } from "../lib/flags";
import Chip from "./Chip";

export default function TieResolver({ alert, teamById, onResolve }) {
  return (
    <div className="rounded-2xl border-2 border-rose-500/50 bg-rose-500/10 p-5">
      <p className="font-black text-rose-300 text-xl mb-2 tracking-wide">
        ⚡ GROUP {alert.group}: SUDDEN-DEATH FLIP CUP NEEDED
      </p>
      <p className="text-base text-slate-400 mb-4 leading-relaxed">
        These teams are dead even on points, head-to-head, diff AND roster size. One flip cup round decides
        the order — tap the winner:
      </p>
      <div className="flex gap-3 flex-wrap">
        {alert.cluster.map((id) => (
          <button
            key={id}
            onClick={() => onResolve([id, ...alert.cluster.filter((x) => x !== id)])}
            className="min-h-[48px] px-5 py-3 rounded-xl border-2 border-amber-500/50 bg-slate-900 font-bold text-base hover:bg-amber-500/20 transition-colors"
          >
            {flagOf(teamById(id)?.name)} {teamById(id)?.name} won
          </button>
        ))}
      </div>
    </div>
  );
}

export function Section({ title, children }) {
  return (
    <section>
      <h2 className="text-xl sm:text-2xl font-black tracking-[0.12em] text-slate-300 uppercase mb-3">{title}</h2>
      {children}
    </section>
  );
}

const LINE = "rgba(94,234,212,0.45)";

export function PairConnector({ flip }) {
  return (
    <div className="relative self-stretch">
      <div
        className="absolute inset-x-0 top-[25%] bottom-[25%]"
        style={{
          borderTop: `2px solid ${LINE}`,
          borderBottom: `2px solid ${LINE}`,
          [flip ? "borderLeft" : "borderRight"]: `2px solid ${LINE}`,
          [flip ? "borderTopLeftRadius" : "borderTopRightRadius"]: 12,
          [flip ? "borderBottomLeftRadius" : "borderBottomRightRadius"]: 12,
        }}
      />
    </div>
  );
}

export function MidConnector() {
  return (
    <div className="relative self-stretch">
      <div className="absolute inset-x-0 top-1/2" style={{ borderTop: `2px solid ${LINE}` }} />
    </div>
  );
}

export function BMatch({ slot, pair, result, teamById, onClick, celebrate }) {
  const winner = result?.winner;
  const rows = pair ? [pair.a, pair.b] : [null, null];
  return (
    <button
      onClick={onClick}
      disabled={!pair}
      className={`w-full rounded-2xl overflow-hidden border text-left shadow-lg transition-all duration-200 ${
        winner
          ? "border-teal-400/50 bg-slate-900/90"
          : pair
            ? "border-slate-600 bg-slate-900/80 hover:border-teal-300/60 hover:scale-[1.02]"
            : "border-slate-800 bg-slate-900/40"
      }`}
    >
      <div
        className={`px-3 py-1.5 flex items-center justify-between text-[10px] font-black tracking-[0.2em] uppercase ${
          winner ? "bg-teal-400/15 text-teal-300" : "bg-white/5 text-slate-500"
        }`}
      >
        <span>{slot}</span>
        {winner ? <span>FT</span> : pair ? <span className="text-amber-400/90">Tap to score</span> : <span>TBD</span>}
      </div>
      {rows.map((id, i) => {
        const t = id ? teamById(id) : null;
        const won = winner && winner === id;
        const lost = winner && winner !== id;
        return (
          <div
            key={i}
            className={`px-3 py-2.5 flex items-center justify-between border-t border-slate-800/60 ${
              won ? "bg-teal-400/10" : ""
            } ${celebrate === id ? "animate-pulse bg-emerald-500/25" : ""}`}
          >
            {t ? (
              <Chip team={t} size="sm" dim={lost} />
            ) : (
              <span className="text-sm italic text-slate-600">
                {slot.startsWith("SF") ? "QF winner" : "Qualifier"}
              </span>
            )}
            <span className={`text-sm font-black ${won ? "text-teal-300" : "text-slate-600"}`}>
              {won ? `${result.score || "W"} ✓` : ""}
            </span>
          </div>
        );
      })}
    </button>
  );
}

export function Board({ title, rows, value, unit, teamById }) {
  return (
    <div className="rounded-2xl border border-slate-700/60 bg-slate-900/40 overflow-hidden">
      <p className="px-4 py-3 text-base sm:text-lg font-black tracking-wider text-amber-300 border-b border-slate-800 bg-amber-500/10">
        {title}
      </p>
      {rows.slice(0, 5).map((r, i) => (
        <div
          key={r.team.id}
          className="flex items-center justify-between px-4 py-3 border-b border-slate-800/40 last:border-0"
        >
          <span className="flex items-center gap-3 text-base">
            <span className={`font-black text-sm w-6 ${i === 0 ? "text-amber-400" : "text-slate-600"}`}>
              {i + 1}
            </span>
            <Chip team={r.team} size="sm" />
          </span>
          <span className={`font-black text-lg ${i === 0 ? "text-amber-400" : "text-slate-300"}`}>
            {value(r)} <span className="text-xs text-slate-500 font-normal">{unit}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
