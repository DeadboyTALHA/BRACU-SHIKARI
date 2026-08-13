import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/page-shell";
import { ExternalLink, User } from "lucide-react";
import posterUrl from "@/assets/poster.jpg";
import { getCtftimeStats } from "@/lib/ctftime.functions";

const statsQueryOptions = queryOptions({
  queryKey: ["ctftime-stats"],
  queryFn: () => getCtftimeStats(),
  staleTime: 15 * 60 * 1000,
});

// Real-name overrides keyed by CTFtime username.
const REAL_NAMES: Record<string, string> = {
  Kyoru: "Muktadirul Alam Sowad",
  Sanguinius: "Ayman Kabir",
  Sh4d0w_by8E: "Asif Bin Mahmood",
  D3dSeC: "Debopriyo Karmaker",
  D34d60yT: "Md. Minhazul Mowla",
  whyziswhy: "Zuhayer Iqbal Shafin",
  "s4m.404": "Mohammed Sayed Sameer",
  machinerohan: "Rohan Rahman",
  "5ak1b": "Sakib Mahmud",
  CaesarMeister: "Abrar Murshed",
};

// Members not listed on CTFtime.
const EXTRA_MEMBERS: { username: string; realName: string }[] = [];

const EXCLUDED_USERNAMES = new Set(["Es_cape", "jihad021", "hawkthorn7"]);


export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Team — BRACU SHIKARI" },
      { name: "description", content: "The players behind BRACU SHIKARI, the official CTF team of BRAC University." },
      { property: "og:title", content: "Team — BRACU SHIKARI" },
      { property: "og:description", content: "Meet the players behind BRACU SHIKARI." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(statsQueryOptions),
  component: Team,
});

function Team() {
  const { data: stats } = useSuspenseQuery(statsQueryOptions);

  const visibleMembers = stats.members.filter(
    (m) => !EXCLUDED_USERNAMES.has(m.username)
  );

  const teamMembers = [
    ...visibleMembers.map((m) => ({
      type: "ctftime" as const,
      userId: m.userId,
      username: m.username,
      realName: REAL_NAMES[m.username],
    })),
    ...EXTRA_MEMBERS.map((m) => ({
      type: "extra" as const,
      username: m.username,
      realName: m.realName,
    })),
  ];

  const operatorCount = teamMembers.length;

  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="font-mono text-xs uppercase tracking-[0.4em] text-blood">// Roster</div>
        <h1 className="mt-2 font-display text-4xl md:text-5xl uppercase tracking-tight">
          The Team
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          BRACU SHIKARI is built by students of BRAC University who share a passion
          for offensive security, cryptography, reverse engineering and web exploitation.
        </p>

        <div className="mt-10 grid md:grid-cols-[1fr_1.4fr] gap-8 items-start">
          <div className="clip-tactical overflow-hidden border border-border">
            <img src={posterUrl} alt="BRACU SHIKARI" className="w-full h-full object-cover" />
          </div>

          <div>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-blood">
              // {operatorCount} operators
            </div>
            <h2 className="mt-2 font-display text-2xl uppercase tracking-wide">
              Active Roster
            </h2>

            <div className="mt-5 grid sm:grid-cols-2 gap-3">
              {teamMembers.map((m) => {
                const CardContent = (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center border border-border bg-background/60 text-blood">
                      <User size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-display text-lg uppercase tracking-wide truncate">
                        {m.realName ?? m.username}
                      </div>
                      <div className="font-mono text-xs text-muted-foreground truncate">
                        @{m.username}
                      </div>
                    </div>
                  </div>
                );

                if (m.type === "ctftime") {
                  return (
                    <a
                      key={m.userId}
                      href={`https://ctftime.org/user/${m.userId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative clip-tactical border border-border bg-card/60 p-4 hover:border-blood hover:bg-blood/5 transition-colors"
                    >
                      {CardContent}
                      <ExternalLink size={14} className="text-muted-foreground group-hover:text-blood absolute right-4 top-1/2 -translate-y-1/2" />
                    </a>
                  );
                }

                return (
                  <div
                    key={m.username}
                    className="group clip-tactical border border-border bg-card/60 p-4"
                  >
                    {CardContent}
                  </div>
                );
              })}
            </div>

            <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Synced live from CTFtime.
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
