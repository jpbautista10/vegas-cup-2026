import { flagUrl, isoOf } from "../lib/flags";

const SIZES = {
  xs: "h-5 w-7",
  sm: "h-6 w-8",
  md: "h-7 w-10",
  lg: "h-8 w-11",
  xl: "h-10 w-14",
  "2xl": "h-12 w-[4.5rem]",
};

/**
 * Modern flag badge with rounded corners (CDN image). Falls back to a neutral tile.
 */
export default function Flag({ name, size = "md", className = "", title }) {
  const url = flagUrl(name, size === "xs" || size === "sm" ? 40 : size === "2xl" ? 160 : 80);
  const box = SIZES[size] || SIZES.md;
  const label = title || name || "Unknown";

  if (!url || !isoOf(name)) {
    return (
      <span
        title={label}
        aria-label={label}
        className={`inline-flex shrink-0 items-center justify-center rounded-md border border-slate-600 bg-slate-700 text-[10px] font-black text-slate-300 ${box} ${className}`}
      >
        ?
      </span>
    );
  }

  return (
    <span
      title={label}
      className={`inline-flex shrink-0 overflow-hidden rounded-md border border-white/25 shadow-sm ring-1 ring-black/10 ${box} ${className}`}
    >
      <img
        src={url}
        alt=""
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
        draggable={false}
      />
    </span>
  );
}
