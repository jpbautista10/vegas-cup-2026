import { useState } from "react";
import { GAME_META } from "../lib/constants";
import Flag from "./Flag";
import Modal from "./Modal";

export default function ScoreModal({ data, teamById, existing, onSave, onClear, onClose }) {
  const { match, game } = data;
  const meta = GAME_META[game.type];
  const [winner, setWinner] = useState(existing?.winner || null);
  const [margin, setMargin] = useState(existing?.margin || "");
  const valid = winner && Number(margin) >= 1 && Number(margin) <= meta.marginMax;

  return (
    <Modal onClose={onClose}>
      <p className="text-xs font-black tracking-[0.2em] text-slate-500 uppercase">
        Game {game.num} · Group {match.group}
      </p>
      <p className="font-black text-2xl mb-4">
        {meta.icon} {meta.label}
      </p>
      <p className="text-sm text-slate-400 mb-2 font-bold uppercase tracking-wider">Winner</p>
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[match.home, match.away].map((id) => {
          const t = teamById(id);
          return (
            <button
              key={id}
              onClick={() => setWinner(id)}
              className={`min-h-[72px] py-4 rounded-2xl border-2 font-bold text-base transition-all flex flex-col items-center gap-2 ${
                winner === id ? "border-amber-400 bg-amber-400/15 scale-[1.02]" : "border-slate-700 bg-slate-800/50"
              }`}
            >
              <Flag name={t?.name} size="xl" />
              {t?.name}
            </button>
          );
        })}
      </div>
      <p className="text-sm text-slate-400 mb-2 font-bold">{meta.marginLabel}</p>
      <div className="flex gap-2 flex-wrap mb-5">
        {Array.from({ length: Math.min(meta.marginMax, 21) }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => setMargin(n)}
            className={`min-w-[44px] min-h-[44px] rounded-xl border text-base font-bold ${
              Number(margin) === n ? "border-amber-400 bg-amber-400/20 text-amber-300" : "border-slate-700 text-slate-400"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <button
          disabled={!valid}
          onClick={() => onSave(game.id, winner, margin)}
          className="flex-1 min-h-[48px] rounded-xl bg-amber-400 text-slate-900 font-black text-base disabled:opacity-40"
        >
          ✅ {existing ? "Update result" : "Save result"}
        </button>
        {existing && (
          <button
            onClick={() => onClear(game.id)}
            className="min-h-[48px] px-5 rounded-xl border border-rose-500/50 text-rose-300 text-sm font-bold"
          >
            Clear
          </button>
        )}
      </div>
    </Modal>
  );
}
