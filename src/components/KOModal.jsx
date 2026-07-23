import { useState } from "react";
import { GAME_META } from "../lib/constants";
import Flag from "./Flag";
import Modal from "./Modal";

/** Slots that feed Golden Cup / Cornhole Cannon — require a margin. */
const SCORING_MARGIN = {
  SF1: GAME_META.cornhole,
  SF2: GAME_META.cornhole,
  F: GAME_META.pong,
};

export default function KOModal({ data, teamById, existing, onSave, onClear, onClose }) {
  const { slot, pair, label } = data;
  const marginMeta = SCORING_MARGIN[slot] || null;
  const [winner, setWinner] = useState(existing?.winner || null);
  const [score, setScore] = useState(existing?.score || "");
  const [margin, setMargin] = useState(existing?.margin != null ? existing.margin : "");

  const valid = Boolean(winner) && (!marginMeta || (Number(margin) >= 1 && Number(margin) <= marginMeta.marginMax));
  const isEdit = Boolean(existing?.winner) && slot !== "F";

  return (
    <Modal onClose={onClose}>
      <p className="text-xs font-black tracking-[0.2em] text-slate-500 uppercase">{slot}</p>
      <p className="font-black text-2xl mb-4">{label}</p>
      {isEdit && (
        <p className="text-sm text-amber-400 font-bold mb-3">Editing saved result — save to update stats</p>
      )}
      <p className="text-sm text-slate-400 mb-2 font-bold uppercase tracking-wider">Winner</p>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[pair.a, pair.b].map((id) => {
          const t = teamById(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => setWinner(id)}
              className={`min-h-[72px] py-4 rounded-2xl border-2 font-bold text-base flex flex-col items-center gap-2 ${
                winner === id ? "border-amber-400 bg-amber-400/15" : "border-slate-700 bg-slate-800/50"
              }`}
            >
              <Flag name={t?.name} size="xl" />
              {t?.name}
            </button>
          );
        })}
      </div>

      {marginMeta && (
        <>
          <p className="text-sm text-slate-400 mb-2 font-bold">
            {marginMeta.icon} {marginMeta.marginLabel}
          </p>
          <div className="flex gap-2 flex-wrap mb-4">
            {Array.from({ length: Math.min(marginMeta.marginMax, 21) }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setMargin(n)}
                className={`min-w-[44px] min-h-[44px] rounded-xl border text-base font-bold ${
                  Number(margin) === n
                    ? "border-amber-400 bg-amber-400/20 text-amber-300"
                    : "border-slate-700 text-slate-400"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </>
      )}

      {!marginMeta && (
        <input
          value={score}
          onChange={(e) => setScore(e.target.value)}
          placeholder="Score (optional, e.g. 2-1)"
          className="w-full bg-slate-800 border border-slate-600 rounded-xl px-3 py-3 text-base mb-4 min-h-[48px]"
        />
      )}

      <div className="flex gap-3">
        <button
          type="button"
          disabled={!valid}
          onClick={() =>
            onSave(slot, {
              winner,
              a: pair.a,
              b: pair.b,
              score: marginMeta ? undefined : score,
              margin: marginMeta ? Number(margin) : undefined,
            })
          }
          className="flex-1 min-h-[48px] rounded-xl bg-amber-400 text-slate-900 font-black text-base disabled:opacity-40"
        >
          {slot === "F" ? "✅ Save final game" : slot === "TP" ? "✅ Save bronze game" : isEdit ? "✅ Update result" : "✅ Confirm — team advances!"}
        </button>
        {isEdit && onClear && (
          <button
            type="button"
            onClick={() => onClear(slot)}
            className="min-h-[48px] px-5 rounded-xl border border-rose-500/50 text-rose-300 text-sm font-bold"
          >
            Clear
          </button>
        )}
      </div>
    </Modal>
  );
}
