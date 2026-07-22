export default function RulesPage() {
  const R = ({ t, children }) => (
    <div className="rounded-2xl border border-slate-700/60 bg-slate-900/40 p-5 sm:p-6">
      <h3 className="font-black text-amber-300 text-xl sm:text-2xl tracking-wide mb-3">{t}</h3>
      <div className="text-base text-slate-300 space-y-2 leading-relaxed">{children}</div>
    </div>
  );
  return (
    <div className="space-y-5">
      <R t="🏆 TOURNAMENT FORMAT">
        <p>9 nations · 3 groups of 3 · Day 1 group stage (18 games), Day 2 knockouts.</p>
        <p>
          Top 2 per group + the 2 best third-place teams advance to the quarterfinals. Worst third place is
          eliminated (the only team going home after groups).
        </p>
        <p>
          Bracket: QF1 Winner A vs Wildcard 1 · QF2 Winner B vs Wildcard 2 · QF3 Winner C vs Runner-up A · QF4
          Runner-up B vs Runner-up C. If a wildcard would face its own group winner, the wildcards swap slots.
          SF1 = QF1w vs QF2w, SF2 = QF3w vs QF4w.
        </p>
      </R>
      <R t="📊 GROUP STAGE — POINTS & DIFF">
        <p>
          Every group match = 2 games: Beer Pong + Cornhole. Both always played. Each game won ={" "}
          <b>1 point</b>.
        </p>
        <p>
          <b>Diff</b> (the &quot;goal difference&quot;): pong margin = cups left standing for the winner;
          cornhole margin = 21 minus loser&apos;s score. Winner +margin, loser −margin, all into one combined
          number.
        </p>
        <p>
          <b>Tiebreakers (in order):</b> 1) Points → 2) Head-to-head (within group only) → 3) Combined diff → 4)
          Roster size (smaller team ranks higher) → 5) Sudden-death flip cup, one round, on the spot.
        </p>
        <p>
          Third-place ranking across groups uses the same ladder minus head-to-head. A dead tie for the last
          wildcard spot triggers the <b>Flip Cup Wildcard Play-In</b> — winner takes the final QF spot.
        </p>
      </R>
      <R t="🍺 BEER PONG (group stage + Final)">
        <p>
          2v2 · 10-cup triangle each side · Teams alternate turns, both players shoot each turn · Sunk cup is
          removed · Elbows behind the table edge.
        </p>
        <p>
          Both teammates sink in the same turn = balls back, shoot again. Re-racks: 2 per team per game (at 6,
          4, 3, or 2 cups). Bounce shots count 2 cups but can be swatted.
        </p>
        <p>First to clear all opposing cups wins. Record cups still standing on your side = your margin.</p>
        <p>
          <b>Group stage & knockouts: NO rebuttal.</b> Game ends when the last cup drops.
        </p>
      </R>
      <R t="🕳️ CORNHOLE (group stage + Semifinals)">
        <p>
          2v2 · 4 bags per team per round · Bag on board = 1 pt, in the hole = 3 pts · Cancellation scoring
          (only the net difference per round counts).
        </p>
        <p>Group stage: first to reach or pass 21 wins. Margin = 21 − loser&apos;s score.</p>
        <p>
          <b>Semifinals only: must win by 2</b> — at 21-20 the game continues until a 2-point lead.
        </p>
      </R>
      <R t="🔄 FLIP CUP (tiebreaks, Play-In & 3rd Place Match)">
        <p>
          Full teams line up on opposite sides. First player drinks, sets cup on the edge, flips it upside-down
          with one finger — only then may the next player start. First team to finish the line wins the round.
        </p>
        <p>
          False start (starting before your teammate lands their flip) = that player re-drinks a splash and
          re-flips.
        </p>
        <p>
          Tiebreak/Play-In = single round, sudden death. <b>3rd Place Match = best of 5 rounds.</b>
        </p>
      </R>
      <R t="🛟 BATTLE RAFT (Quarterfinals)">
        <p>
          Two players on inflatable rafts in the pool, one pool noodle each. Knock your opponent off their raft
          to win the fall. Falling = any part of your body fully in the water or losing the raft.
        </p>
        <p>
          <b>Both fall simultaneously?</b> Last one touching their raft wins the fall; if truly identical
          (crowd decides), the fall is void and replayed.
        </p>
        <p>
          No grabbing the opponent&apos;s body or raft with hands — noodle contact only. Paddling with hands to
          reposition is fine.
        </p>
        <p>
          <b>Best of 3 falls.</b> Teams of 2: Player 1 takes fall 1, Player 2 takes fall 2, team picks anyone
          for the decider. Teams with 3+ players: three different players, or your two designated rafters —
          declare before the match.
        </p>
      </R>
      <R t="🏆 THE FINAL — Beer Pong, Best of 3">
        <p>Best of 3 full games of pong. Same rules as group stage, plus:</p>
        <p>
          <b>UNLIMITED REBUTTAL:</b> when the last cup is sunk, the trailing team shoots until they miss. Clear
          ALL remaining cups without missing = overtime (3-cup rack each, sudden death, rebuttal applies
          again). Miss once = game over.
        </p>
        <p>No lead is safe. Champions must survive last licks. 🏆</p>
      </R>
      <R t="📅 SCHEDULE OVERVIEW">
        <p>
          <b>Day 1:</b> Draw ceremony → Round 1: Beer Pong (Games 1–9) → Halftime → Round 2: Cornhole (Games
          10–18) → 3rd-place ranking → Flip Cup Play-In if needed (nightcap). Every pairing plays twice with a
          long rest between their games.
        </p>
        <p>
          <b>Day 2:</b> QF1–QF4 Battle Raft (midday, pool) → SF1–SF2 Cornhole (afternoon) → 3rd Place Flip Cup
          (evening) → THE FINAL, Beer Pong Bo3, under the lights.
        </p>
        <p>
          Total: 18 group games + up to 1 play-in + 4 QF + 2 SF + 1 bronze + Final (2–3 games) ={" "}
          <b>up to 29 games of glory.</b>
        </p>
      </R>
    </div>
  );
}
