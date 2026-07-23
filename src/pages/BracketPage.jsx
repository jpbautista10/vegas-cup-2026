import Flag from "../components/Flag";
import Chip from "../components/Chip";
import { Section, PairConnector, MidConnector, BMatch } from "../components/UI";
import { KO_META, KO_WAVES, nextKoGames, waveStatus } from "../lib/koSchedule";

function statusTone(status) {
  if (status === "done") return "text-emerald-400";
  if (status === "live") return "text-amber-400";
  if (status === "next") return "text-amber-400/90";
  if (status === "filling") return "text-sky-300";
  return "text-slate-500";
}

function statusLabel(status) {
  if (status === "done") return "DONE";
  if (status === "live") return "LIVE";
  if (status === "next") return "NEXT →";
  if (status === "filling") return "FILLING";
  return "WAIT";
}

function KoScheduleTable({
  state,
  teamById,
  bracket,
  sf1,
  sf2,
  tpTeams,
  finalists,
  finalPreview,
  champion,
  thirdPlaceWinner,
  bracketReady,
}) {
  const next = nextKoGames(state, bracketReady, champion, thirdPlaceWinner);

  const pairFor = (slot) => {
    if (slot.startsWith("QF")) return bracket?.[slot];
    if (slot === "SF1") return sf1;
    if (slot === "SF2") return sf2;
    if (slot === "TP") return tpTeams;
    if (slot === "F") return finalists || finalPreview;
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-sm text-slate-500 uppercase tracking-widest font-bold">
          Day 2 — Knockout schedule · parallel pairs
        </p>
        {next.a && (
          <p className="text-sm font-black text-amber-400 tracking-wide">
            ▶ Now: {KO_META[next.a].label}
            {next.b ? ` + ${KO_META[next.b].label}` : ""}
          </p>
        )}
      </div>

      {KO_WAVES.map((w) => {
        const status = waveStatus(w.slots, state, champion, thirdPlaceWinner);
        const isActive = status === "live" || status === "next";
        return (
          <div
            key={w.wave}
            className={`rounded-2xl border overflow-hidden bg-slate-900/40 ${
              isActive ? "border-amber-400/50" : "border-slate-700/60"
            }`}
          >
            <div className="px-4 py-3 bg-gradient-to-r from-amber-500/15 to-transparent border-b border-slate-800 flex items-center justify-between gap-3 flex-wrap">
              <div>
                <span className="font-black tracking-widest text-amber-400 text-lg sm:text-xl">
                  {w.slots.map((s) => KO_META[s].label).join(" · ")}
                </span>
                <p className="text-xs text-slate-500 font-bold tracking-wide mt-0.5 uppercase">
                  {w.title} · {w.note}
                </p>
              </div>
              <span className={`text-xs font-black tracking-widest ${statusTone(status)}`}>
                {statusLabel(status)}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-base">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-slate-500 border-b border-slate-800">
                    <th className="text-left px-4 py-2 w-16">Game</th>
                    <th className="text-left px-2 py-2">Matchup</th>
                    <th className="text-center px-3 py-2 w-24">Slot</th>
                    <th className="text-center px-3 py-2 w-20">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {w.slots.map((slot) => {
                    const meta = KO_META[slot];
                    const pair = pairFor(slot);
                    const done =
                      slot === "F"
                        ? Boolean(champion)
                        : slot === "TP"
                          ? Boolean(thirdPlaceWinner)
                          : Boolean(state.ko[slot]?.winner);
                    const isNext = next.a === slot || next.b === slot;
                    const aId = pair?.a;
                    const bId = pair?.b;
                    const aLabel = pair?.aLabel || meta.round;
                    const bLabel = pair?.bLabel || "TBD";
                    const filling = !done && !isNext && Boolean(aId || bId);
                    return (
                      <tr
                        key={slot}
                        className={`border-b border-slate-800/40 last:border-0 ${
                          isNext ? "bg-amber-500/10" : filling ? "bg-sky-500/5" : done ? "opacity-80" : ""
                        }`}
                      >
                        <td className="px-4 py-3.5">
                          <span className="font-black text-amber-400 tabular-nums">{meta.label}</span>
                        </td>
                        <td className="px-2 py-3.5">
                          <div className="flex flex-col gap-1.5 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap text-sm sm:text-base font-semibold">
                              {aId ? (
                                <span className="inline-flex items-center gap-1.5 min-w-0">
                                  <Flag name={teamById(aId)?.name} size="sm" />
                                  <span className="truncate">{teamById(aId)?.name}</span>
                                </span>
                              ) : (
                                <span className="text-slate-400">{aLabel}</span>
                              )}
                              <span className="text-slate-600 text-xs font-bold shrink-0">vs</span>
                              {bId ? (
                                <span className="inline-flex items-center gap-1.5 min-w-0">
                                  <Flag name={teamById(bId)?.name} size="sm" />
                                  <span className="truncate">{teamById(bId)?.name}</span>
                                </span>
                              ) : (
                                <span className="text-slate-400">{bLabel}</span>
                              )}
                            </div>
                            <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                              {meta.icon} {meta.sport}
                            </span>
                          </div>
                        </td>
                        <td className="text-center px-3 py-3.5 text-slate-400 font-bold text-sm">{slot}</td>
                        <td className="text-center px-3 py-3.5">
                          {done ? (
                            <span className="text-[11px] font-black text-emerald-400">DONE</span>
                          ) : isNext ? (
                            <span className="text-[11px] font-black text-amber-400">
                              {status === "live" ? "LIVE" : "NEXT →"}
                            </span>
                          ) : filling ? (
                            <span className="text-[11px] font-black text-sky-300">FILLING</span>
                          ) : (
                            <span className="text-[11px] font-bold text-slate-500">WAIT</span>
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
      })}
    </div>
  );
}

export default function BracketPage({
  bracket,
  state,
  celebrate,
  teamById,
  requireEdit,
  setKoModal,
  sf1,
  sf2,
  finalists,
  finalPreview,
  tpTeams,
  finalGames,
  finalTally,
  bronzeGames = [],
  bronzeTally = null,
  champion,
  thirdPlaceWinner,
  resetFinal,
  resetBronze,
  finalBestOf = 3,
  finalWinsNeeded = 2,
  bronzeBestOf = 5,
  bronzeWinsNeeded = 3,
  bracketReady = false,
}) {
  const openKO = (slot, pair, label) => {
    if (!pair?.a || !pair?.b) return;
    requireEdit(() => setKoModal({ slot, pair, label }));
  };

  const statusBanner =
    bracket?.status === "groups"
      ? bracket.earlySeeds
        ? "Clinched teams are locking into the bracket as they qualify — knockout scoring unlocks when all group games (and any play-in) finish."
        : "Group stage in progress — bracket slots fill as teams clinch. Scoring unlocks when all 18 games (and any play-in) are done."
      : bracket?.status === "playin"
        ? "Flip Cup Wildcard Play-In still needed — then knockout scoring unlocks."
        : null;

  return (
    <div className="space-y-6">
      {!bracket && (
        <div className="rounded-2xl border border-slate-700 bg-slate-900/40 p-8 text-center text-base text-slate-400">
          Start the tournament in Setup to preview the knockout bracket.
        </div>
      )}
      {bracket && (
        <>
          {statusBanner && (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm sm:text-base text-amber-300 font-bold">
              {statusBanner}
            </div>
          )}

          <div className="rounded-2xl border border-slate-700/60 bg-slate-900/30 p-4 sm:p-5 overflow-x-auto">
            <p className="text-sm text-slate-500 mb-3 text-center sm:hidden font-bold tracking-wide">
              ← swipe to see the full bracket →
            </p>
            <div className="min-w-[980px]">
              <div
                className="grid mb-4"
                style={{ gridTemplateColumns: "1.1fr 28px 1.1fr 28px 1.4fr 28px 1.1fr 28px 1.1fr" }}
              >
                <p className="text-xs font-black tracking-[0.15em] text-teal-300 text-center uppercase">
                  Quarterfinals
                  <br />
                  <span className="text-slate-500">🛟 Battle Raft · G1–G2</span>
                </p>
                <span />
                <p className="text-xs font-black tracking-[0.15em] text-teal-300 text-center uppercase">
                  Semifinal
                  <br />
                  <span className="text-slate-500">🕳️ Cornhole · G5</span>
                </p>
                <span />
                <p className="text-xs font-black tracking-[0.15em] text-amber-300 text-center uppercase">
                  The Final
                  <br />
                  <span className="text-slate-500">🍺 Beer Pong · G8+</span>
                </p>
                <span />
                <p className="text-xs font-black tracking-[0.15em] text-teal-300 text-center uppercase">
                  Semifinal
                  <br />
                  <span className="text-slate-500">🕳️ Cornhole · G6</span>
                </p>
                <span />
                <p className="text-xs font-black tracking-[0.15em] text-teal-300 text-center uppercase">
                  Quarterfinals
                  <br />
                  <span className="text-slate-500">🛟 Battle Raft · G3–G4</span>
                </p>
              </div>
              <div
                className="grid"
                style={{
                  gridTemplateColumns: "1.1fr 28px 1.1fr 28px 1.4fr 28px 1.1fr 28px 1.1fr",
                  height: 480,
                }}
              >
                <div className="flex flex-col justify-around gap-4">
                  <BMatch
                    slot="QF1"
                    gameLabel={KO_META.QF1.label}
                    pair={bracket.QF1}
                    result={bracketReady ? state.ko.QF1 : null}
                    teamById={teamById}
                    celebrate={celebrate}
                    onClick={() => openKO("QF1", bracket.QF1, "G1 · Battle Raft — best of 3 falls")}
                  />
                  <BMatch
                    slot="QF2"
                    gameLabel={KO_META.QF2.label}
                    pair={bracket.QF2}
                    result={bracketReady ? state.ko.QF2 : null}
                    teamById={teamById}
                    celebrate={celebrate}
                    onClick={() => openKO("QF2", bracket.QF2, "G2 · Battle Raft — best of 3 falls")}
                  />
                </div>
                <PairConnector />
                <div className="flex flex-col justify-center">
                  <BMatch
                    slot="SF1"
                    gameLabel={KO_META.SF1.label}
                    pair={sf1}
                    result={bracketReady ? state.ko.SF1 : null}
                    teamById={teamById}
                    celebrate={celebrate}
                    onClick={() => openKO("SF1", sf1, "G5 · Cornhole — first to 21, win by 2")}
                  />
                </div>
                <MidConnector />
                <div className="flex flex-col justify-center gap-3">
                  <div
                    className={`rounded-2xl p-4 text-center bracket-final-box ${
                      champion ? "bracket-final-box--won" : ""
                    }`}
                  >
                    <p className="bracket-final-box__title text-[10px] font-black tracking-[0.3em] uppercase mb-2">
                      {KO_META.F.label}+ · 🏆 Final
                    </p>
                    {[finalPreview.a, finalPreview.b].map((id, i) => {
                      const label = i === 0 ? finalPreview.aLabel : finalPreview.bLabel;
                      if (!id) {
                        return (
                          <div
                            key={label || i}
                            className="flex items-center justify-between px-2 py-2 rounded-xl mb-1 text-sm font-semibold text-slate-300"
                          >
                            {label || "Finalist"}
                          </div>
                        );
                      }
                      const t = teamById(id);
                      const w = champion === id;
                      const l = champion && !w;
                      return (
                        <div
                          key={id}
                          className={`flex items-center justify-between px-2 py-2 rounded-xl mb-1 ${
                            w ? "bg-amber-400/25" : ""
                          } ${l ? "opacity-40" : ""}`}
                        >
                          <Chip team={t} size="sm" />
                          <span className="bracket-final-box__score font-black tabular-nums text-lg">
                            {finalTally ? (id === finalists.a ? finalTally.a : finalTally.b) : ""}
                            {w && " 👑"}
                          </span>
                        </div>
                      );
                    })}
                    {champion && (
                      <p className="bracket-final-box__title text-xs font-black tracking-widest mt-1">
                        CHAMPION!
                      </p>
                    )}
                  </div>
                  <div
                    className={`rounded-xl p-3 text-center bracket-bronze-box ${
                      thirdPlaceWinner ? "bracket-bronze-box--won" : ""
                    }`}
                  >
                    <p className="bracket-bronze-box__title text-[10px] font-black tracking-[0.25em] uppercase mb-1.5">
                      {KO_META.TP.label}+ · 🥉 Bronze — Flip Cup Bo{bronzeBestOf}
                    </p>
                    {(!tpTeams || (!tpTeams.a && !tpTeams.b)) && (
                      <div className="space-y-1 text-sm font-semibold text-slate-300">
                        <p>Loser SF1</p>
                        <p>Loser SF2</p>
                      </div>
                    )}
                    {tpTeams && (tpTeams.a || tpTeams.b) && (
                      <div className="w-full">
                        {[
                          { id: tpTeams.a, label: tpTeams.aLabel || "Loser SF1", tally: bronzeTally?.a },
                          { id: tpTeams.b, label: tpTeams.bLabel || "Loser SF2", tally: bronzeTally?.b },
                        ].map((row) => (
                          <div
                            key={row.label}
                            className={`flex items-center justify-between px-1 py-1 ${
                              row.id && thirdPlaceWinner === row.id
                                ? "font-bold"
                                : thirdPlaceWinner && row.id
                                  ? "opacity-40"
                                  : ""
                            }`}
                          >
                            {row.id ? (
                              <Chip team={teamById(row.id)} size="sm" />
                            ) : (
                              <span className="text-sm font-semibold text-slate-400">{row.label}</span>
                            )}
                            <span className="bracket-bronze-box__score font-black tabular-nums text-sm">
                              {row.id && bronzeTally != null ? row.tally : ""}
                              {row.id && thirdPlaceWinner === row.id ? " 🥉" : ""}
                            </span>
                          </div>
                        ))}
                        {tpTeams.scorable && !thirdPlaceWinner && (
                          <div className="mt-2 space-y-2">
                            <p className="text-[10px] font-bold opacity-80" style={{ color: "inherit" }}>
                              <span className="bracket-bronze-box__title">
                                Best of {bronzeBestOf} · first to {bronzeWinsNeeded}
                              </span>
                            </p>
                            <button
                              type="button"
                              onClick={() =>
                                openKO(
                                  "TP",
                                  { ...tpTeams, scorable: true },
                                  `G${7 + bronzeGames.length} · Flip Cup — bronze game`,
                                )
                              }
                              className="w-full min-h-[40px] rounded-lg border-2 border-[#cd7f32]/60 text-[11px] font-black bracket-bronze-box__title hover:bg-[#cd7f32]/15"
                            >
                              Score bronze game →
                            </button>
                            {bronzeGames.length > 0 && (
                              <button
                                type="button"
                                onClick={() => requireEdit(resetBronze)}
                                className="w-full text-[10px] text-slate-500 underline"
                              >
                                Reset bronze
                              </button>
                            )}
                          </div>
                        )}
                        {thirdPlaceWinner && (
                          <button
                            type="button"
                            onClick={() => requireEdit(resetBronze)}
                            className="mt-2 text-[10px] text-slate-500 underline"
                          >
                            correct bronze
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <MidConnector />
                <div className="flex flex-col justify-center">
                  <BMatch
                    slot="SF2"
                    gameLabel={KO_META.SF2.label}
                    pair={sf2}
                    result={bracketReady ? state.ko.SF2 : null}
                    teamById={teamById}
                    celebrate={celebrate}
                    onClick={() => openKO("SF2", sf2, "G6 · Cornhole — first to 21, win by 2")}
                  />
                </div>
                <PairConnector flip />
                <div className="flex flex-col justify-around gap-4">
                  <BMatch
                    slot="QF3"
                    gameLabel={KO_META.QF3.label}
                    pair={bracket.QF3}
                    result={bracketReady ? state.ko.QF3 : null}
                    teamById={teamById}
                    celebrate={celebrate}
                    onClick={() => openKO("QF3", bracket.QF3, "G3 · Battle Raft — best of 3 falls")}
                  />
                  <BMatch
                    slot="QF4"
                    gameLabel={KO_META.QF4.label}
                    pair={bracket.QF4}
                    result={bracketReady ? state.ko.QF4 : null}
                    teamById={teamById}
                    celebrate={celebrate}
                    onClick={() => openKO("QF4", bracket.QF4, "G4 · Battle Raft — best of 3 falls")}
                  />
                </div>
              </div>
            </div>
          </div>

          <Section
            title={`🏆 THE FINAL — Beer Pong, best of ${finalBestOf} (first to ${finalWinsNeeded}) · Unlimited rebuttal · Day 2 night`}
          >
            <div
              className={`rounded-2xl border-2 p-6 ${
                champion ? "border-amber-400 bg-amber-500/10" : "border-amber-500/40 bg-slate-900/60"
              }`}
            >
              {!finalists && (
                <p className="text-center text-base text-slate-500 py-6">Waiting for semifinal winners…</p>
              )}
              {finalists && (
                <>
                  <div className="flex items-center justify-center gap-5 flex-wrap text-xl mb-5">
                    <Chip team={teamById(finalists.a)} size="lg" />
                    <span className="font-black text-5xl text-amber-400 tabular-nums">
                      {finalTally.a} – {finalTally.b}
                    </span>
                    <Chip team={teamById(finalists.b)} size="lg" />
                  </div>
                  <p className="text-center text-sm text-slate-500 mb-4">
                    Best of {finalBestOf} · first to {finalWinsNeeded} wins · series starts at{" "}
                    {KO_META.F.label}
                  </p>
                  {!champion && (
                    <div className="flex flex-col gap-3 items-center">
                      <p className="text-sm text-slate-400">
                        G{7 + finalGames.length + 1} — tap to score (cups left standing count for Golden Cup)
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          openKO(
                            "F",
                            { ...finalists, scorable: true },
                            `G${7 + finalGames.length + 1} · Beer Pong — cups left standing`,
                          )
                        }
                        className="min-h-[48px] px-6 py-3 rounded-xl border-2 border-amber-500/50 font-bold text-base hover:bg-amber-500/20 transition-all hover:scale-[1.02]"
                      >
                        Score final game →
                      </button>
                      {finalGames.length > 0 && (
                        <button
                          onClick={() => requireEdit(resetFinal)}
                          className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-600 text-sm text-slate-400"
                        >
                          Reset final
                        </button>
                      )}
                    </div>
                  )}
                  {champion && (
                    <div className="text-center py-8">
                      <p className="text-6xl sm:text-7xl mb-4 animate-bounce">🏆🎰</p>
                      <p className="champion-jackpot-label font-display text-sm tracking-[0.4em] uppercase mb-3">
                        Fabulous Champion · Jackpot
                      </p>
                      <p className="champion-name font-display text-4xl sm:text-5xl tracking-[0.08em]">
                        <span className="inline-flex items-center justify-center gap-3">
                          <Flag name={teamById(champion)?.name} size="2xl" />
                          {teamById(champion)?.name?.toUpperCase()}
                        </span>
                      </p>
                      <p className="text-base text-slate-400 mt-3 tracking-wide">
                        {teamById(champion)?.players?.filter(Boolean).join(" · ")}
                      </p>
                      <button
                        onClick={() => requireEdit(resetFinal)}
                        className="mt-5 text-sm text-slate-500 underline"
                      >
                        correct result
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </Section>

          <KoScheduleTable
            state={state}
            teamById={teamById}
            bracket={bracket}
            sf1={sf1}
            sf2={sf2}
            tpTeams={tpTeams}
            finalists={finalists}
            finalPreview={finalPreview}
            champion={champion}
            thirdPlaceWinner={thirdPlaceWinner}
            bracketReady={bracketReady}
          />
        </>
      )}
    </div>
  );
}
