import Flag from "./Flag";

export default function Chip({ team, size = "md", dim }) {
  if (!team) return <span className="text-slate-500 italic text-base">TBD</span>;
  const flagSize = size === "lg" ? "lg" : size === "sm" ? "sm" : "md";
  const text = size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg";
  return (
    <span className={`inline-flex items-center gap-2 ${text} ${dim ? "opacity-40" : ""}`}>
      <Flag name={team.name} size={flagSize} />
      <span className="font-semibold tracking-wide">{team.name}</span>
    </span>
  );
}
