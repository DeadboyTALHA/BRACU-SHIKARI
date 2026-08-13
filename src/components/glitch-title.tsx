import { useEffect, useState } from "react";

const NAMES = ["BRACU SHIKARI", "BR4CU 5H1K4R1"];

export function GlitchTitle({ className = "" }: { className?: string }) {
  const [idx, setIdx] = useState(0);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlash(true);
      setTimeout(() => {
        setIdx((i) => (i + 1) % NAMES.length);
        setFlash(false);
      }, 180);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <h1
      className={`font-display font-bold uppercase tracking-tight text-glow-red transition-all duration-200 ${flash ? "opacity-40 blur-sm" : "opacity-100"} ${className}`}
      aria-label="BRACU SHIKARI"
    >
      {NAMES[idx]}
    </h1>
  );
}
