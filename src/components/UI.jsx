import Flag from "./Flag";
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
            className="min-h-[48px] px-5 py-3 rounded-xl border-2 border-amber-500/50 bg-slate-900 font-bold text-base hover:bg-amber-500/20 transition-colors inline-flex items-center gap-2"
          >
            <Flag name={teamById(id)?.name} size="md" /> {teamById(id)?.name} won
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

export function PairConnector({ flip }) {
  const line = "var(--vc-connector)";
  return (
    <div className="relative self-stretch">
      <div
        className="absolute inset-x-0 top-[25%] bottom-[25%]"
        style={{
          borderTop: `2px solid ${line}`,
          borderBottom: `2px solid ${line}`,
          [flip ? "borderLeft" : "borderRight"]: `2px solid ${line}`,
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
      <div className="absolute inset-x-0 top-1/2" style={{ borderTop: "2px solid var(--vc-connector)" }} />
    </div>
  );
}

export function BMatch({ slot, pair, result, teamById, onClick, celebrate, gameLabel }) {
  const winner = result?.winner;
  const rows = pair
    ? [
        { id: pair.a, label: pair.aLabel },
        { id: pair.b, label: pair.bLabel },
      ]
    : [
        { id: null, label: null },
        { id: null, label: null },
      ];
  const bothSet = Boolean(pair?.a && pair?.b);
  const scorable = bothSet && pair?.scorable !== false && typeof onClick === "function";

  return (
    <button
      type="button"
      onClick={scorable ? onClick : undefined}
      disabled={!scorable}
      className={`w-full rounded-2xl overflow-hidden border text-left shadow-lg transition-all duration-200 ${
        winner
          ? "border-teal-400/50 bg-slate-900/90"
          : scorable
            ? "border-slate-600 bg-slate-900/80 hover:border-teal-300/60 hover:scale-[1.02]"
            : "border-slate-600 bg-slate-900/80"
      }`}
    >
      <div
        className={`px-3 py-1.5 flex items-center justify-between text-[10px] font-black tracking-[0.2em] uppercase ${
          winner ? "bg-teal-400/15 text-teal-300" : "bg-slate-800/50 text-slate-400"
        }`}
      >
        <span className="inline-flex items-center gap-1.5">
          {gameLabel && <span className="text-amber-400 tracking-widest">{gameLabel}</span>}
          <span>{slot}</span>
        </span>
        {winner ? (
          <span className="text-amber-400/90">Edit</span>
        ) : scorable ? (
          <span className="text-amber-400/90">Tap to score</span>
        ) : bothSet ? (
          <span>Preview</span>
        ) : pair?.a || pair?.b ? (
          <span className="text-sky-300">Filling</span>
        ) : (
          <span>Preview</span>
        )}
      </div>
      {rows.map((row, i) => {
        const t = row.id ? teamById(row.id) : null;
        const won = winner && winner === row.id;
        const lost = winner && row.id && winner !== row.id;
        return (
          <div
            key={i}
            className={`px-3 py-2.5 flex items-center justify-between border-t border-slate-800/60 ${
              won ? "bg-teal-400/10" : ""
            } ${celebrate === row.id ? "animate-pulse bg-emerald-500/25" : ""}`}
          >
            {t ? (
              <Chip team={t} size="sm" dim={lost} />
            ) : (
              <span className="text-sm font-semibold text-slate-300 tracking-wide">
                {row.label || (slot.startsWith("SF") ? "QF winner" : "Qualifier")}
              </span>
            )}
            <span className={`text-sm font-black ${won ? "text-teal-300" : "text-slate-500"}`}>
              {won ? `${result.score || "W"} ✓` : ""}
            </span>
          </div>
        );
      })}
    </button>
  );
}

export function Board({ title, subtitle, rows, value, unit, teamById }) {
  return (
    <div className="rounded-2xl border border-slate-700/60 bg-slate-900/40 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-800 bg-amber-500/10">
        <p className="text-base sm:text-lg font-black tracking-wider text-amber-300">{title}</p>
        {subtitle && <p className="text-xs text-slate-500 font-semibold mt-1 leading-snug">{subtitle}</p>}
      </div>
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
