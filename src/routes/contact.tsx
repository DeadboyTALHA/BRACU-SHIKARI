import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Facebook, Linkedin, Flag, Mail, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — BRACU SHIKARI" },
      { name: "description", content: "Get in touch with BRACU SHIKARI — the official CTF team of BRAC University. Email, Facebook, LinkedIn, and CTFtime." },
      { property: "og:title", content: "Contact — BRACU SHIKARI" },
      { property: "og:description", content: "Reach out to BRACU SHIKARI via email, Facebook, LinkedIn, or CTFtime." },
    ],
  }),
  component: Contact,
});

const links = [
  {
    icon: Mail,
    label: "Email",
    handle: "shikari@bracu.ac.bd",
    url: "mailto:shikari@bracu.ac.bd",
  },
  {
    icon: Facebook,
    label: "Facebook",
    handle: "@bracu.shikari",
    url: "https://www.facebook.com/bracu.shikari",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    handle: "bracu-shikari",
    url: "https://www.linkedin.com/company/bracu-shikari/",
  },
  {
    icon: Flag,
    label: "CTFtime",
    handle: "team/433462",
    url: "https://ctftime.org/team/433462",
  },
];

function Contact() {
  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="font-mono text-xs uppercase tracking-[0.4em] text-blood">// Establish Connection</div>
        <h1 className="mt-2 font-display text-4xl md:text-5xl uppercase tracking-tight">
          Contact Us
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Follow us or reach out through any of the channels below. For collaboration,
          sponsorships, or joining as a BRAC University student, our Facebook DMs and inbox are open.
        </p>

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {links.map(({ icon: Icon, label, handle, url }) => (
            <a
              key={label}
              href={url}
              target={url.startsWith("mailto:") ? undefined : "_blank"}
              rel={url.startsWith("mailto:") ? undefined : "noreferrer"}
              className="clip-tactical group border border-border bg-card/60 p-6 hover:border-blood transition-colors block"
            >
              <div className="flex items-start justify-between">
                <Icon className="text-blood" size={28} />
                <ExternalLink className="text-muted-foreground group-hover:text-blood transition-colors" size={16} />
              </div>
              <div className="mt-6 font-display uppercase tracking-widest text-xl">{label}</div>
              <div className="mt-1 font-mono text-sm text-muted-foreground group-hover:text-foreground transition-colors break-all">
                {handle}
              </div>
            </a>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
