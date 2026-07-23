import { Board } from "../components/UI";

export default function StatsPage({ leaderboards, teamById }) {
  if (!leaderboards) return null;
  return (
    <div className="grid sm:grid-cols-2 gap-5">
      <Board
        title="🥇 Golden Cup — Most cups sunk (groups + Final)"
        subtitle="Winner sinks 10 cups per pong game; loser sinks 10 − cups left standing"
        rows={leaderboards.goldenCup}
        value={(r) => r.cupsSunk}
        unit="cups"
        teamById={teamById}
      />
      <Board
        title="🎯 Cornhole Cannon — Points scored (groups + SF)"
        subtitle="Win = 21 pts. Max 63 = 2 group wins + SF win. SF margin only changes the loser’s pts (21 − margin)."
        rows={leaderboards.cornCannon}
        value={(r) => r.cornPts}
        unit="pts"
        teamById={teamById}
      />
      <Board
        title="⚡ Diff Kings — Best differential (groups + KO score)"
        rows={leaderboards.diffKings}
        value={(r) => (r.diff > 0 ? "+" : "") + r.diff}
        unit=""
        teamById={teamById}
      />
      <Board
        title="🔥 Win Machine — Total wins (all stages)"
        rows={leaderboards.winMachine}
        value={(r) => r.totalWins}
        unit="W"
        teamById={teamById}
      />
    </div>
  );
}
