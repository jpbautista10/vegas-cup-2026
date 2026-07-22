import { useMemo } from "react";

const BILL_COLORS = ["#1a7a3c", "#0d5c2e", "#228b4a", "#166534"];
const CONFETTI = ["#ffd700", "#ff2d6a", "#00e5ff", "#f472b6", "#fb923c", "#ffe566", "#fff"];
const MONEY_EMOJI = ["💵", "💸", "💰", "🪙", "💲"];

/**
 * Vegas jackpot celebration — cascading cash + neon confetti.
 */
export default function Confetti() {
  const pieces = useMemo(() => {
    const out = [];

    // Dollar bills (paper rectangles)
    for (let i = 0; i < 36; i++) {
      out.push({
        kind: "bill",
        left: Math.random() * 100,
        delay: Math.random() * 3,
        dur: 3.2 + Math.random() * 3.5,
        color: BILL_COLORS[i % BILL_COLORS.length],
        w: 22 + Math.random() * 14,
        h: 11 + Math.random() * 6,
        rot: Math.random() * 360,
        sway: 12 + Math.random() * 28,
      });
    }

    // Emoji cash / coins
    for (let i = 0; i < 42; i++) {
      out.push({
        kind: "emoji",
        left: Math.random() * 100,
        delay: Math.random() * 2.8,
        dur: 2.8 + Math.random() * 3.2,
        emoji: MONEY_EMOJI[i % MONEY_EMOJI.length],
        size: 18 + Math.random() * 16,
        rot: Math.random() * 360,
        sway: 8 + Math.random() * 24,
      });
    }

    // Neon confetti strips
    for (let i = 0; i < 48; i++) {
      out.push({
        kind: "confetti",
        left: Math.random() * 100,
        delay: Math.random() * 2.5,
        dur: 2.5 + Math.random() * 3,
        color: CONFETTI[i % CONFETTI.length],
        w: 5 + Math.random() * 7,
        h: 8 + Math.random() * 10,
        rot: Math.random() * 360,
        sway: 6 + Math.random() * 18,
      });
    }

    return out;
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] overflow-hidden" aria-hidden>
      {pieces.map((p, i) => {
        const anim = `vc-money-fall ${p.dur}s linear ${p.delay}s infinite`;
        if (p.kind === "emoji") {
          return (
            <span
              key={i}
              className="absolute select-none"
              style={{
                top: "-40px",
                left: `${p.left}%`,
                fontSize: p.size,
                lineHeight: 1,
                transform: `rotate(${p.rot}deg)`,
                animation: anim,
                ["--vc-sway"]: `${p.sway}px`,
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.35))",
              }}
            >
              {p.emoji}
            </span>
          );
        }
        if (p.kind === "bill") {
          return (
            <div
              key={i}
              className="absolute rounded-[2px] flex items-center justify-center overflow-hidden"
              style={{
                top: "-30px",
                left: `${p.left}%`,
                width: p.w,
                height: p.h,
                background: `linear-gradient(135deg, ${p.color}, #0a3d1f)`,
                border: "1px solid rgba(255,255,255,0.25)",
                boxShadow: "0 2px 6px rgba(0,0,0,0.35)",
                transform: `rotate(${p.rot}deg)`,
                animation: anim,
                ["--vc-sway"]: `${p.sway}px`,
              }}
            >
              <span
                style={{
                  color: "#c8f5d4",
                  fontSize: Math.max(7, p.h * 0.55),
                  fontWeight: 900,
                  letterSpacing: "-0.02em",
                  textShadow: "0 0 2px rgba(0,0,0,0.5)",
                }}
              >
                $
              </span>
            </div>
          );
        }
        return (
          <div
            key={i}
            className="absolute rounded-sm"
            style={{
              top: "-20px",
              left: `${p.left}%`,
              width: p.w,
              height: p.h,
              background: p.color,
              boxShadow: p.color === "#ffd700" ? "0 0 6px rgba(255,215,0,0.7)" : undefined,
              transform: `rotate(${p.rot}deg)`,
              animation: anim,
              ["--vc-sway"]: `${p.sway}px`,
            }}
          />
        );
      })}
    </div>
  );
}
