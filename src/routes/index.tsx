import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { GlitchTitle } from "@/components/glitch-title";
import { Target, Search, Trophy, Users, Shield } from "lucide-react";
import logoUrl from "@/assets/logo.jpg";
import bannerUrl from "@/assets/banner.png";

export const Route = createFileRoute("/")({
  component: Home,
});

const pillars = [
  { icon: Target, label: "Learn" },
  { icon: Search, label: "Research" },
  { icon: Trophy, label: "Compete" },
  { icon: Users, label: "Community" },
];

function Home() {
  return (
    <PageShell>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${bannerUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 py-24 md:py-32 text-center">
          <img
            src={logoUrl}
            alt="BRACU SHIKARI"
            className="mx-auto h-28 w-28 md:h-36 md:w-36 rounded-full ring-2 ring-blood/50 shadow-glow-red mb-8"
          />
          <div className="flex justify-center">
            <GlitchTitle className="text-5xl md:text-7xl lg:text-8xl" />
          </div>
          <div className="mt-6 flex items-center justify-center gap-3 font-mono text-xs md:text-sm uppercase tracking-[0.3em] text-muted-foreground">
            <span className="h-px w-8 bg-blood" />
            <span>Hunt</span>
            <span className="text-blood">·</span>
            <span>Hack</span>
            <span className="text-blood">·</span>
            <span>Defend</span>
            <span className="h-px w-8 bg-blood" />
          </div>
          <p className="mt-8 mx-auto max-w-2xl text-base md:text-lg text-muted-foreground">
            The Official CTF (Capture The Flag) Team of{" "}
            <span className="text-foreground font-semibold">BRAC University</span>.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/achievements"
              className="clip-tactical inline-flex items-center gap-2 bg-blood px-6 py-3 font-mono text-sm font-semibold uppercase tracking-wider text-primary-foreground hover:bg-blood-glow transition-colors"
            >
              <Trophy size={16} /> Achievements
            </Link>
            <a
              href="https://ctftime.org/team/433462"
              target="_blank"
              rel="noreferrer"
              className="clip-tactical inline-flex items-center gap-2 border border-border bg-card px-6 py-3 font-mono text-sm font-semibold uppercase tracking-wider text-foreground hover:border-blood hover:text-blood transition-colors"
            >
              <Shield size={16} /> CTFtime Profile
            </a>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {pillars.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="clip-tactical bg-card/60 border border-border p-6 text-center hover:border-blood/60 transition-colors"
            >
              <Icon className="mx-auto text-blood" size={28} />
              <div className="mt-3 font-display uppercase tracking-widest text-sm">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Ethos */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center">
        <div className="font-mono text-xs uppercase tracking-[0.4em] text-blood">// Doctrine</div>
        <p className="mt-4 font-display text-2xl md:text-3xl uppercase tracking-wide">
          Ethical Mindset. Technical Excellence. Global Impact.
        </p>
        <p className="mt-6 text-muted-foreground max-w-2xl mx-auto">
          A new-generation team of BRAC University students competing in international
          Capture The Flag events across web, pwn, reverse engineering, cryptography,
          forensics, and OSINT.
          </p>
      </section>
    </PageShell>
  );
}
