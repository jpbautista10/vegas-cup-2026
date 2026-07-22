import { useState } from "react";
import Flag from "./Flag";
import Modal from "./Modal";

export default function KOModal({ data, teamById, onSave, onClose }) {
  const { slot, pair, label } = data;
  const [winner, setWinner] = useState(null);
  const [score, setScore] = useState("");

  return (
    <Modal onClose={onClose}>
      <p className="text-xs font-black tracking-[0.2em] text-slate-500 uppercase">{slot}</p>
      <p className="font-black text-2xl mb-4">{label}</p>
      <p className="text-sm text-slate-400 mb-2 font-bold uppercase tracking-wider">Winner</p>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[pair.a, pair.b].map((id) => {
          const t = teamById(id);
          return (
            <button
              key={id}
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
      <input
        value={score}
        onChange={(e) => setScore(e.target.value)}
        placeholder="Score (optional, e.g. 2-1 or 21-17)"
        className="w-full bg-slate-800 border border-slate-600 rounded-xl px-3 py-3 text-base mb-4 min-h-[48px]"
      />
      <button
        disabled={!winner}
        onClick={() => onSave(slot, { winner, a: pair.a, b: pair.b, score })}
        className="w-full min-h-[48px] rounded-xl bg-amber-400 text-slate-900 font-black text-base disabled:opacity-40"
      >
        ✅ Confirm — team advances!
      </button>
    </Modal>
  );
}
