import { flagOf } from "../lib/flags";

export default function Chip({ team, size = "md", dim }) {
  if (!team) return <span className="text-slate-500 italic text-base">TBD</span>;
  const sz = size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg";
  return (
    <span className={`inline-flex items-center gap-2 ${sz} ${dim ? "opacity-40" : ""}`}>
      <span className="text-[1.4em] leading-none">{flagOf(team.name)}</span>
      <span className="font-semibold tracking-wide">{team.name}</span>
    </span>
  );
}
