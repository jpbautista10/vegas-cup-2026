import { useState, useEffect } from "react";
import { GROUPS, FINAL_BEST_OF_OPTIONS, winsNeeded } from "../lib/constants";
import Flag from "../components/Flag";
import { Section } from "../components/UI";

export default function SetupPage({
  state,
  canEdit,
  requireEdit,
  teamById,
  addTeam,
  updateTeam,
  removeTeam,
  randomDraw,
  lockTournament,
  setState,
  exportJSON,
  importJSON,
  fileRef,
  fullReset,
  confirmReset,
  theme,
  toggleTheme,
}) {
  const [revealed, setRevealed] = useState({ A: 3, B: 3, C: 3 });
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    if (!drawing) return undefined;
    setRevealed({ A: 0, B: 0, C: 0 });
    const timers = [];
    let step = 0;
    for (const g of GROUPS) {
      for (let i = 1; i <= 3; i++) {
        const delay = step * 180;
        timers.push(
          setTimeout(() => {
            setRevealed((r) => ({ ...r, [g]: i }));
          }, delay),
        );
        step++;
      }
    }
    timers.push(
      setTimeout(() => {
        setDrawing(false);
        setRevealed({ A: 3, B: 3, C: 3 });
      }, step * 180 + 100),
    );
    return () => timers.forEach(clearTimeout);
  }, [drawing, state.groups]);

  const handleDraw = () => {
    requireEdit(() => {
      randomDraw();
      setDrawing(true);
    });
  };

  return (
    <div className="space-y-6">
      {!canEdit && (
        <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-base text-rose-300 font-bold">
          🔒 Ref PIN required to edit. Tap the lock in the header.
        </div>
      )}
      <Section title="🌍 Teams (exactly 9)">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {state.teams.map((t, i) => (
            <div key={t.id} className="rounded-2xl border border-slate-700 bg-slate-900/40 p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <Flag name={t.name} size="lg" className="shrink-0" />
                <input
                  disabled={!canEdit || state.locked}
                  value={t.name}
                  placeholder={`Country ${i + 1} (e.g. Mexico)`}
                  onChange={(e) => updateTeam(t.id, { name: e.target.value })}
                  className="flex-1 min-w-0 bg-slate-800 border border-slate-600 rounded-xl px-2 sm:px-3 py-2 sm:py-3 text-sm sm:text-base font-bold min-h-[44px]"
                />
                {!state.locked && (
                  <button
                    disabled={!canEdit}
                    onClick={() => removeTeam(t.id)}
                    className="text-rose-400 text-base px-2 min-h-[44px] shrink-0"
                  >
                    ✕
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                {t.players.map((p, pi) => (
                  <input
                    key={pi}
                    disabled={!canEdit}
                    value={p}
                    placeholder={`P${pi + 1}`}
                    onChange={(e) =>
                      updateTeam(t.id, {
                        players: t.players.map((x, xi) => (xi === pi ? e.target.value : x)),
                      })
                    }
                    className="bg-slate-800 border border-slate-700 rounded-xl px-2 py-1.5 text-sm w-[5.5rem] min-h-[40px]"
                  />
                ))}
                <button
                  disabled={!canEdit}
                  onClick={() => updateTeam(t.id, { players: [...t.players, ""] })}
                  className="text-sm text-amber-400 font-bold min-h-[40px] px-1"
                >
                  +
                </button>
                {t.players.length > 1 && (
                  <button
                    disabled={!canEdit}
                    onClick={() => updateTeam(t.id, { players: t.players.slice(0, -1) })}
                    className="text-sm text-slate-500 min-h-[40px] px-1"
                  >
                    −
                  </button>
                )}
              </div>
              <p className="text-[10px] text-slate-500 mt-2">roster = tiebreaker #4 (smaller wins)</p>
            </div>
          ))}
          {!state.locked && state.teams.length < 9 && (
            <button
              disabled={!canEdit}
              onClick={() => requireEdit(addTeam)}
              className="w-full min-h-[52px] py-3 rounded-2xl border-2 border-dashed border-slate-600 text-base text-slate-400 hover:border-amber-500/50 hover:text-amber-300 transition-colors sm:col-span-2 lg:col-span-3"
            >
              + Add team ({state.teams.length}/9)
            </button>
          )}
        </div>
      </Section>

      <Section title="🎲 Group Draw">
        {state.locked ? (
          <p className="text-base text-emerald-400 font-bold">Tournament locked & running. Groups are final.</p>
        ) : (
          <>
            <button
              disabled={!canEdit || state.teams.length !== 9 || drawing}
              onClick={handleDraw}
              className="min-h-[52px] px-6 py-3 rounded-xl bg-amber-400 text-slate-900 font-black text-base disabled:opacity-40 mb-4 hover:scale-[1.02] transition-transform"
            >
              🎩 DRAW FROM THE SOMBRERO (random)
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {GROUPS.map((g) => (
                <div key={g} className="rounded-2xl border border-slate-700 bg-slate-900/40 p-4 min-h-[120px]">
                  <p className="text-sm font-black text-amber-400 tracking-widest mb-2">GROUP {g}</p>
                  {state.groups[g].slice(0, revealed[g] ?? 3).map((id, idx) => (
                    <p
                      key={id}
                      className="text-base py-1 animate-[fadeIn_0.3s_ease] inline-flex items-center gap-2 w-full"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <Flag name={teamById(id)?.name} size="sm" /> {teamById(id)?.name}
                    </p>
                  ))}
                  {state.groups[g].length === 0 && <p className="text-sm text-slate-600 italic">—</p>}
                </div>
              ))}
            </div>
            <button
              disabled={!canEdit || GROUPS.some((g) => state.groups[g].length !== 3) || drawing}
              onClick={() => requireEdit(lockTournament)}
              className="mt-4 w-full min-h-[56px] py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-900 font-black text-lg tracking-wide disabled:opacity-40 hover:scale-[1.01] transition-transform"
            >
              🚀 START TOURNAMENT (locks teams & groups)
            </button>
          </>
        )}
      </Section>

      <Section title="🎨 Appearance">
        <p className="text-base text-slate-400 mb-3">Switch between stadium night (dark) and daytime (light).</p>
        <button type="button" onClick={toggleTheme} className="theme-toggle !min-h-[52px] !px-6 !text-base">
          {theme === "dark" ? "☀ Switch to Light Mode" : "☾ Switch to Dark Mode"}
        </button>
      </Section>

      <Section title="🏆 Final format">
        <p className="text-base text-slate-400 mb-3 leading-relaxed">
          Override how many beer pong games make the Final. First team to{" "}
          <b className="text-amber-400">{winsNeeded(state.finalBestOf || 3)}</b> wins is champion.
          Editable until the first Final game is recorded
          {state.locked ? " (even after the tournament has started)" : ""}.
        </p>
        <div className="flex flex-wrap gap-2">
          {FINAL_BEST_OF_OPTIONS.map((n) => {
            const active = (state.finalBestOf || 3) === n;
            const finalStarted = (state.ko?.F || []).length > 0;
            return (
              <button
                key={n}
                type="button"
                disabled={finalStarted}
                onClick={() =>
                  requireEdit(() => setState((s) => ({ ...s, finalBestOf: n })))
                }
                className={`min-h-[48px] px-5 py-3 rounded-xl border-2 font-black text-base transition-all disabled:opacity-40 ${
                  active
                    ? "border-amber-400 bg-amber-400 text-slate-900"
                    : "border-slate-600 text-slate-300 hover:border-amber-400/50"
                }`}
              >
                Best of {n}
              </button>
            );
          })}
        </div>
        {(state.ko?.F || []).length > 0 && (
          <p className="text-sm text-rose-400 font-bold mt-3">
            Final already underway — use Reset final on the Bracket tab to change length.
          </p>
        )}
      </Section>

      <Section title="🥉 Bronze format">
        <p className="text-base text-slate-400 mb-3 leading-relaxed">
          Flip Cup bronze medal series. First team to{" "}
          <b className="text-amber-400">{winsNeeded(state.bronzeBestOf || 5)}</b> wins takes 3rd place.
          Editable until the first bronze game is recorded
          {state.locked ? " (even after the tournament has started)" : ""}.
        </p>
        <div className="flex flex-wrap gap-2">
          {FINAL_BEST_OF_OPTIONS.map((n) => {
            const active = (state.bronzeBestOf || 5) === n;
            const bronzeStarted = Array.isArray(state.ko?.TP)
              ? state.ko.TP.length > 0
              : Boolean(state.ko?.TP?.winner);
            return (
              <button
                key={n}
                type="button"
                disabled={bronzeStarted}
                onClick={() =>
                  requireEdit(() => setState((s) => ({ ...s, bronzeBestOf: n })))
                }
                className={`min-h-[48px] px-5 py-3 rounded-xl border-2 font-black text-base transition-all disabled:opacity-40 ${
                  active
                    ? "border-amber-400 bg-amber-400 text-slate-900"
                    : "border-slate-600 text-slate-300 hover:border-amber-400/50"
                }`}
              >
                Best of {n}
              </button>
            );
          })}
        </div>
        {(Array.isArray(state.ko?.TP) ? state.ko.TP.length > 0 : Boolean(state.ko?.TP?.winner)) && (
          <p className="text-sm text-rose-400 font-bold mt-3">
            Bronze already underway — use Reset bronze on the Bracket tab to change length.
          </p>
        )}
      </Section>

      <Section title="🔐 Ref PIN">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <input
            type="password"
            value={state.pin}
            placeholder="Set a 4-digit PIN (optional)"
            maxLength={8}
            onChange={(e) => setState((s) => ({ ...s, pin: e.target.value }))}
            className="bg-slate-800 border border-slate-600 rounded-xl px-3 py-3 text-base w-52 min-h-[48px]"
          />
          <p className="text-sm text-slate-500 leading-relaxed">
            With a PIN set, score entry requires unlocking — keeps tipsy fingers off the table. Leave empty for
            open access.
          </p>
        </div>
      </Section>

      <Section title="💾 Backup & Restore">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={exportJSON}
            className="min-h-[48px] px-5 py-3 rounded-xl border border-emerald-500/50 text-emerald-300 text-base font-bold"
          >
            ⬇️ Export backup (do this end of Day 1!)
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="min-h-[48px] px-5 py-3 rounded-xl border border-sky-500/50 text-sky-300 text-base font-bold"
          >
            ⬆️ Import backup
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => e.target.files[0] && importJSON(e.target.files[0])}
          />
          <button
            onClick={() => requireEdit(fullReset)}
            className={`min-h-[48px] px-5 py-3 rounded-xl border text-base font-bold ml-auto transition-all ${
              confirmReset
                ? "border-rose-400 bg-rose-500/25 text-rose-200 animate-pulse"
                : "border-rose-500/50 text-rose-300"
            }`}
          >
            {confirmReset ? "⚠️ TAP AGAIN TO WIPE EVERYTHING" : "🗑️ Full reset"}
          </button>
        </div>
        <p className="text-sm text-slate-500 mt-3 leading-relaxed">
          Scores auto-save to this browser after every entry. The backup file is your insurance if the device
          dies or you switch devices.
        </p>
      </Section>
    </div>
  );
}
