import { createServerFn } from "@tanstack/react-start";

export type CtfEvent = {
  eventId: string;
  name: string;
  place: number;
  points: number;
  rating: number;
};

export type CtfMember = {
  userId: string;
  username: string;
};

export type CtftimeStats = {
  teamName: string;
  primaryAlias: string;
  country: string;
  countryPlace: number | null;
  worldPlace: number | null;
  ratingPoints: number | null;
  year: number;
  events: CtfEvent[];
  members: CtfMember[];
  fetchedAt: string;
};


const TEAM_ID = 433462;

// Simple in-memory cache (per worker instance) for 15 minutes
let cache: { at: number; data: CtftimeStats } | null = null;
const TTL_MS = 15 * 60 * 1000;

function stripTags(s: string) {
  return s.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").trim();
}

async function fetchAndParse(): Promise<CtftimeStats> {
  const ua = "Mozilla/5.0 (compatible; BracuShikariSite/1.0)";
  const [apiRes, htmlRes] = await Promise.all([
    fetch(`https://ctftime.org/api/v1/teams/${TEAM_ID}/`, { headers: { "User-Agent": ua, Accept: "application/json" } }),
    fetch(`https://ctftime.org/team/${TEAM_ID}`, { headers: { "User-Agent": ua } }),
  ]);

  if (!apiRes.ok) throw new Error(`CTFtime API ${apiRes.status}`);
  if (!htmlRes.ok) throw new Error(`CTFtime page ${htmlRes.status}`);

  const api = (await apiRes.json()) as {
    name: string;
    primary_alias: string;
    country: string;
    rating: Record<string, { rating_place?: number; country_place?: number; rating_points?: number }>;
  };
  const html = await htmlRes.text();

  const currentYear = new Date().getUTCFullYear();
  const years = Object.keys(api.rating)
    .map((y) => parseInt(y, 10))
    .filter((y) => !Number.isNaN(y))
    .sort((a, b) => b - a);
  const activeYear = years.find((y) => api.rating[String(y)]?.rating_place || api.rating[String(y)]?.country_place) ?? currentYear;
  const activeRating = api.rating[String(activeYear)] ?? {};

  const yearlyCountryPlaces = years
    .map((y) => ({ year: y, place: api.rating[String(y)]?.country_place ?? null }))
    .filter((r): r is { year: number; place: number } => typeof r.place === "number")
    .slice(0, 8);

  // Parse per-event table rows.
  const rowRe = /<tr>\s*<td class="place_ico"[^>]*>[^<]*<\/td>\s*<td class="place">(\d+)<\/td>\s*<td><a href="\/event\/(\d+)">([^<]+)<\/a><\/td>\s*<td>([\d.]+)<\/td>\s*<td>([\d.]+)<\/td>\s*<\/tr>/g;
  const events: CtfEvent[] = [];
  let m: RegExpExecArray | null;
  while ((m = rowRe.exec(html)) !== null) {
    events.push({
      place: parseInt(m[1], 10),
      eventId: m[2],
      name: stripTags(m[3]),
      points: parseFloat(m[4]),
      rating: parseFloat(m[5]),
    });
  }
  events.sort((a, b) => a.place - b.place);

  // Parse team members. Only inside the members tab to avoid other /user/ links.
  const members: CtfMember[] = [];
  const membersSection = html.split('id="recent_members"')[1]?.split("</table>")[0] ?? "";
  const memRe = /<a href="\/user\/(\d+)">([^<]+)<\/a>/g;
  const seen = new Set<string>();
  let mm: RegExpExecArray | null;
  while ((mm = memRe.exec(membersSection)) !== null) {
    if (seen.has(mm[1])) continue;
    seen.add(mm[1]);
    members.push({ userId: mm[1], username: stripTags(mm[2]) });
  }

  return {
    teamName: api.name,
    primaryAlias: api.primary_alias,
    country: api.country,
    countryPlace: activeRating.country_place ?? null,
    worldPlace: activeRating.rating_place ?? null,
    ratingPoints: activeRating.rating_points ?? null,
    year: activeYear,
    events,
    members,
    fetchedAt: new Date().toISOString(),
  };
}


export const getCtftimeStats = createServerFn({ method: "GET" }).handler(async () => {
  const now = Date.now();
  if (cache && now - cache.at < TTL_MS) return cache.data;
  try {
    const data = await fetchAndParse();
    cache = { at: now, data };
    return data;
  } catch (err) {
    if (cache) return cache.data; // serve stale on failure
    throw err;
  }
});
