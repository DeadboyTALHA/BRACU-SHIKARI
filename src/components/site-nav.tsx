import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logoUrl from "@/assets/logo.jpg";

const links = [
  { to: "/", label: "Home" },
  { to: "/achievements", label: "Achievements" },
  { to: "/team", label: "Team" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3 group">
          <img src={logoUrl} />
          <span className="font-display text-lg font-bold uppercase tracking-widest">
            BRACU <span className="text-blood">SHIKARI</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "text-foreground after:scale-x-100" }}
              inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
              className="relative px-4 py-2 text-sm font-mono uppercase tracking-wider transition-colors after:absolute after:bottom-1 after:left-4 after:right-4 after:h-px after:origin-left after:scale-x-0 after:bg-blood after:transition-transform hover:after:scale-x-100"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <button
          className="md:hidden text-foreground p-2"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <nav className="md:hidden border-t border-border/60 bg-background/95 px-4 py-3 flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "text-blood" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="py-2 font-mono text-sm uppercase tracking-wider"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
