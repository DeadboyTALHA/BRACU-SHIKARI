export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-background/60">
      <div className="mx-auto max-w-6xl px-4 py-8 text-center">
        <div className="font-display uppercase tracking-widest text-sm">
          <span className="text-foreground">BRACU SHIKARI</span>
          <span className="text-muted-foreground"> (</span>
          <span className="text-blood font-mono">BR4CU 5H1K4R1</span>
          <span className="text-muted-foreground">)</span>
        </div>
        <p className="mt-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
          Established 2026 · <a href="https://www.bracu.ac.bd/" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-blood transition-colors">BRAC University</a>
        </p>
      </div>
    </footer>
  );
}
