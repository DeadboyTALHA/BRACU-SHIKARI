import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/page-shell";
import { ExternalLink, Globe, MapPin, Trophy, Calendar } from "lucide-react";
import { getCtftimeStats } from "@/lib/ctftime.functions";

const statsQueryOptions = queryOptions({
  queryKey: ["ctftime-stats"],
  queryFn: () => getCtftimeStats(),
  staleTime: 15 * 60 * 1000,
});

export const Route = createFileRoute("/achievements")({
  head: () => ({
    meta: [
      { title: "Achievements — BRACU SHIKARI" },
      { name: "description", content: "Live CTF results and rankings of BRACU SHIKARI, the official CTF team of BRAC University. World rank, national rank, and every event we played." },
      { property: "og:title", content: "Achievements — BRACU SHIKARI" },
      { property: "og:description", content: "Live CTFtime results of BRACU SHIKARI." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(statsQueryOptions),
  errorComponent: ({ error }) => (
    <PageShell>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl uppercase text-blood">Signal Lost</h1>
        <p className="mt-3 text-muted-foreground">Couldn't reach CTFtime right now. {error.message}</p>
      </div>
    </PageShell>
  ),
  component: Achievements,
});

function rankColor(rank: number) {
  if (rank <= 50) return "text-blood text-glow-red";
  if (rank <= 150) return "text-foreground";
  return "text-muted-foreground";
}

function Achievements() {
  const { data: stats } = useSuspenseQuery(statsQueryOptions);
  const top10Events = [...stats.events]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10)
    .sort((a, b) => a.place - b.place);




  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="font-mono text-xs uppercase tracking-[0.4em] text-blood">// Live from CTFtime</div>
        <h1 className="mt-2 font-display text-4xl md:text-5xl uppercase tracking-tight">
          Achievements
        </h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          Real-time results pulled from our{" "}
          <a href="https://ctftime.org/team/433462" target="_blank" rel="noreferrer" className="text-blood hover:underline">
            CTFtime profile
          </a>
          . Ranks update as new events finalize.
        </p>

        {/* Headline rankings */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <RankCard
            icon={<Globe size={18} />}
            label={`World Rank ${stats.year}`}
            value={stats.worldPlace ? `#${stats.worldPlace}` : "—"}
            highlight
          />
          <RankCard
            icon={<MapPin size={18} />}
            label={`Bangladesh Rank ${stats.year}`}
            value={stats.countryPlace ? `#${stats.countryPlace}` : "—"}
            highlight
          />
          <RankCard
            icon={<Trophy size={18} />}
            label={`Total Rating Points ${stats.year}`}
            value={stats.ratingPoints !== null ? stats.ratingPoints.toFixed(3) : "—"}
          />
          <RankCard
            icon={<Calendar size={18} />}
            label="Events Played"
            value={stats.events.length.toString()}
          />
        </div>

        {/* Events */}

        <div className="mt-12">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-blood">// Event Log</div>
          <div className="mt-3 clip-tactical border border-border bg-card/40 overflow-hidden">
            <div className="hidden md:grid grid-cols-[80px_1fr_100px_100px_60px] gap-4 border-b border-border bg-background/40 px-6 py-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              <div>Rank</div>
              <div>Event</div>
              <div className="text-right">Points</div>
              <div className="text-right">Rating</div>
              <div />
            </div>
            {top10Events.map((e) => (
              <div
                key={e.eventId}
                className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[80px_1fr_100px_100px_60px] gap-4 border-b border-border/60 last:border-b-0 px-6 py-4 items-center hover:bg-blood/5 transition-colors"
              >
                <div className={`font-mono text-lg font-semibold ${rankColor(e.place)}`}>#{e.place}</div>
                <div className="font-display uppercase tracking-wide text-base md:text-lg">{e.name}</div>
                <div className="hidden md:block text-right font-mono text-sm text-muted-foreground">{e.points.toFixed(0)}</div>
                <div className="hidden md:block text-right font-mono text-sm text-blood">+{e.rating.toFixed(2)}</div>
                <div className="hidden md:block text-right">
                  <a
                    href={`https://ctftime.org/event/${e.eventId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center text-muted-foreground hover:text-blood"
                    aria-label={`View ${e.name}`}
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Last synced {new Date(stats.fetchedAt).toUTCString()}
          </p>
        </div>
      </section>
    </PageShell>
  );
}

function RankCard({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="clip-tactical border border-border bg-card/60 p-5">
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        <span className="text-blood">{icon}</span>
        {label}
      </div>
      <div className={`mt-2 font-display text-3xl md:text-4xl ${highlight ? "text-blood text-glow-red" : "text-foreground"}`}>
        {value}
      </div>
    </div>
  );
}
