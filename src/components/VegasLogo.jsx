/**
 * Marquee-style Vegas Cup wordmark — trophy + slot, neon gold / hot pink strip signage.
 */
export default function VegasLogo({ compact = false }) {
  const size = compact ? 40 : 48;
  return (
    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
      <div className="flex items-center gap-1.5 shrink-0" aria-hidden>
        <div
          className="vegas-logo-badge relative flex items-center justify-center rounded-lg"
          style={{ width: size, height: size }}
        >
          <span className="text-2xl sm:text-[1.65rem] leading-none drop-shadow-[0_0_8px_rgba(255,215,0,0.85)]">
            🏆
          </span>
        </div>
        <div
          className="vegas-logo-badge vegas-logo-badge--slot relative flex items-center justify-center rounded-lg"
          style={{ width: size, height: size }}
        >
          <span className="text-2xl sm:text-[1.65rem] leading-none">🎰</span>
        </div>
      </div>
      <div className="min-w-0 leading-none">
        <h1 className="flex items-baseline gap-1.5 flex-wrap m-0">
          <span className="vegas-logo-gold font-display text-[1.35rem] sm:text-[2rem] tracking-[0.12em] uppercase neon-pulse">
            Vegas
          </span>
          <span className="vegas-logo-pink font-display text-[1.35rem] sm:text-[2rem] tracking-[0.12em] uppercase">
            Cup
          </span>
          <span className="vegas-logo-cyan font-display text-sm sm:text-lg tracking-[0.2em] ml-0.5">
            2026
          </span>
        </h1>
        {!compact && (
          <p className="vegas-logo-tagline hidden sm:block mt-1 text-[10px] sm:text-xs font-semibold tracking-[0.28em] uppercase">
            Fabulous · House World Cup · Strip Edition
          </p>
        )}
      </div>
    </div>
  );
}
