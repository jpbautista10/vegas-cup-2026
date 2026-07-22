import { flagOf } from "../lib/flags";
import Chip from "../components/Chip";
import { Section, PairConnector, MidConnector, BMatch } from "../components/UI";

export default function BracketPage({
  bracket,
  thirdPlace,
  state,
  celebrate,
  teamById,
  requireEdit,
  setKoModal,
  sf1,
  sf2,
  finalists,
  tpTeams,
  finalGames,
  finalTally,
  champion,
  thirdPlaceWinner,
  addFinalGame,
  resetFinal,
}) {
  return (
    <div className="space-y-6">
      {!bracket && (
        <div className="rounded-2xl border border-slate-700 bg-slate-900/40 p-8 text-center text-base text-slate-400">
          🔒 The bracket unlocks once all 18 group games are scored
          {thirdPlace?.playinNeeded ? " and the flip cup play-in is decided" : ""}.
        </div>
      )}
      {bracket && (
        <>
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
                  <span className="text-slate-500">🛟 Battle Raft</span>
                </p>
                <span />
                <p className="text-xs font-black tracking-[0.15em] text-teal-300 text-center uppercase">
                  Semifinal
                  <br />
                  <span className="text-slate-500">🕳️ Cornhole</span>
                </p>
                <span />
                <p className="text-xs font-black tracking-[0.15em] text-amber-300 text-center uppercase">
                  The Final
                  <br />
                  <span className="text-slate-500">🍺 Beer Pong Bo3</span>
                </p>
                <span />
                <p className="text-xs font-black tracking-[0.15em] text-teal-300 text-center uppercase">
                  Semifinal
                  <br />
                  <span className="text-slate-500">🕳️ Cornhole</span>
                </p>
                <span />
                <p className="text-xs font-black tracking-[0.15em] text-teal-300 text-center uppercase">
                  Quarterfinals
                  <br />
                  <span className="text-slate-500">🛟 Battle Raft</span>
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
                    pair={bracket.QF1}
                    result={state.ko.QF1}
                    teamById={teamById}
                    celebrate={celebrate}
                    onClick={() =>
                      requireEdit(() =>
                        setKoModal({
                          slot: "QF1",
                          pair: bracket.QF1,
                          label: "Battle Raft — best of 3 falls",
                        }),
                      )
                    }
                  />
                  <BMatch
                    slot="QF2"
                    pair={bracket.QF2}
                    result={state.ko.QF2}
                    teamById={teamById}
                    celebrate={celebrate}
                    onClick={() =>
                      requireEdit(() =>
                        setKoModal({
                          slot: "QF2",
                          pair: bracket.QF2,
                          label: "Battle Raft — best of 3 falls",
                        }),
                      )
                    }
                  />
                </div>
                <PairConnector />
                <div className="flex flex-col justify-center">
                  <BMatch
                    slot="SF1"
                    pair={sf1}
                    result={state.ko.SF1}
                    teamById={teamById}
                    celebrate={celebrate}
                    onClick={() =>
                      sf1 &&
                      requireEdit(() =>
                        setKoModal({
                          slot: "SF1",
                          pair: sf1,
                          label: "Cornhole — first to 21, win by 2",
                        }),
                      )
                    }
                  />
                </div>
                <MidConnector />
                <div className="flex flex-col justify-center gap-3">
                  <div
                    className={`rounded-2xl border-2 p-4 text-center ${
                      champion
                        ? "border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/20"
                        : "border-amber-500/50 bg-slate-900/80"
                    }`}
                  >
                    <p className="text-[10px] font-black tracking-[0.3em] text-amber-400 uppercase mb-2">
                      🏆 Final
                    </p>
                    {!finalists && <p className="text-sm text-slate-500 italic py-3">Winners of SF1 & SF2</p>}
                    {finalists &&
                      [finalists.a, finalists.b].map((id) => {
                        const t = teamById(id);
                        const w = champion === id;
                        const l = champion && !w;
                        return (
                          <div
                            key={id}
                            className={`flex items-center justify-between px-2 py-2 rounded-xl mb-1 ${
                              w ? "bg-amber-400/20" : ""
                            } ${l ? "opacity-40" : ""}`}
                          >
                            <Chip team={t} size="sm" />
                            <span className="font-black text-amber-300 tabular-nums text-lg">
                              {finalTally ? (id === finalists.a ? finalTally.a : finalTally.b) : ""}
                              {w && " 👑"}
                            </span>
                          </div>
                        );
                      })}
                    {champion && (
                      <p className="text-xs font-black tracking-widest text-amber-400 mt-1">CHAMPION!</p>
                    )}
                  </div>
                  <div
                    className={`rounded-xl border p-3 text-center ${
                      thirdPlaceWinner ? "border-amber-700/60 bg-amber-900/15" : "border-slate-700 bg-slate-900/60"
                    }`}
                  >
                    <p className="text-[10px] font-black tracking-[0.25em] text-slate-500 uppercase mb-1.5">
                      🥉 Bronze — Flip Cup Bo5
                    </p>
                    {!tpTeams && <p className="text-sm text-slate-600 italic">SF losers</p>}
                    {tpTeams && (
                      <button
                        onClick={() =>
                          requireEdit(() =>
                            setKoModal({
                              slot: "TP",
                              pair: tpTeams,
                              label: "Flip Cup — best of 5 rounds",
                            }),
                          )
                        }
                        className="w-full"
                      >
                        {[tpTeams.a, tpTeams.b].map((id) => (
                          <div
                            key={id}
                            className={`flex items-center justify-between px-1 py-1 ${
                              thirdPlaceWinner === id
                                ? "text-amber-500 font-bold"
                                : thirdPlaceWinner
                                  ? "opacity-40"
                                  : ""
                            }`}
                          >
                            <Chip team={teamById(id)} size="sm" />
                            {thirdPlaceWinner === id && <span className="text-sm">🥉</span>}
                          </div>
                        ))}
                        {!thirdPlaceWinner && (
                          <p className="text-[10px] text-amber-400/80 font-bold mt-1">TAP TO SCORE →</p>
                        )}
                      </button>
                    )}
                  </div>
                </div>
                <MidConnector />
                <div className="flex flex-col justify-center">
                  <BMatch
                    slot="SF2"
                    pair={sf2}
                    result={state.ko.SF2}
                    teamById={teamById}
                    celebrate={celebrate}
                    onClick={() =>
                      sf2 &&
                      requireEdit(() =>
                        setKoModal({
                          slot: "SF2",
                          pair: sf2,
                          label: "Cornhole — first to 21, win by 2",
                        }),
                      )
                    }
                  />
                </div>
                <PairConnector flip />
                <div className="flex flex-col justify-around gap-4">
                  <BMatch
                    slot="QF3"
                    pair={bracket.QF3}
                    result={state.ko.QF3}
                    teamById={teamById}
                    celebrate={celebrate}
                    onClick={() =>
                      requireEdit(() =>
                        setKoModal({
                          slot: "QF3",
                          pair: bracket.QF3,
                          label: "Battle Raft — best of 3 falls",
                        }),
                      )
                    }
                  />
                  <BMatch
                    slot="QF4"
                    pair={bracket.QF4}
                    result={state.ko.QF4}
                    teamById={teamById}
                    celebrate={celebrate}
                    onClick={() =>
                      requireEdit(() =>
                        setKoModal({
                          slot: "QF4",
                          pair: bracket.QF4,
                          label: "Battle Raft — best of 3 falls",
                        }),
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <Section title="🏆 THE FINAL — Beer Pong, best of 3 · Unlimited rebuttal · Day 2 night">
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
                  {!champion && (
                    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                      <p className="text-sm text-slate-400">Game {finalGames.length + 1} winner:</p>
                      {[finalists.a, finalists.b].map((id) => (
                        <button
                          key={id}
                          onClick={() => requireEdit(() => addFinalGame(id))}
                          className="min-h-[48px] px-6 py-3 rounded-xl border-2 border-amber-500/50 font-bold text-base hover:bg-amber-500/20 transition-all hover:scale-[1.02]"
                        >
                          {flagOf(teamById(id)?.name)} {teamById(id)?.name}
                        </button>
                      ))}
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
                      <p className="text-7xl mb-4 animate-bounce">🏆</p>
                      <p className="text-sm font-black tracking-[0.4em] text-amber-400 uppercase mb-3">
                        Vegas Cup 2026 Champion
                      </p>
                      <p
                        className="text-4xl sm:text-5xl font-black text-amber-300"
                        style={{ textShadow: "0 0 30px rgba(245,200,66,0.6)" }}
                      >
                        {flagOf(teamById(champion)?.name)} {teamById(champion)?.name?.toUpperCase()}
                      </p>
                      <p className="text-base text-slate-400 mt-3">
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
        </>
      )}
    </div>
  );
}
