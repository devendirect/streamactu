import type { Contenu } from "@/types";
import { getNouveautesJour } from "@/lib/tmdb";
import { toISO } from "@/lib/utils";

export const revalidate = 3600;

const SITE_URL = process.env.SITE_URL ?? "https://streamactu.fr";
const NB_JOURS = 7;
const MAX_ITEMS = 100;

function echapperXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

interface ItemFlux {
  contenu: Contenu;
  plateformes: string[];
  dateISO: string;
}

export async function GET() {
  // Sorties des 7 derniers jours — mêmes caches que les pages jour
  const jours: string[] = [];
  const now = new Date();
  for (let i = 0; i < NB_JOURS; i++) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    jours.push(toISO(d));
  }

  const items: ItemFlux[] = [];
  const vus = new Map<string, ItemFlux>();

  try {
    const donnees = await Promise.all(jours.map((iso) => getNouveautesJour(iso)));
    donnees.forEach((plateformes, i) => {
      for (const pf of plateformes) {
        for (const contenu of [...pf.series, ...pf.films]) {
          const cle = `${contenu.type}-${contenu.id}`;
          const existant = vus.get(cle);
          if (existant) {
            if (!existant.plateformes.includes(pf.plateforme.nom)) {
              existant.plateformes.push(pf.plateforme.nom);
            }
            continue;
          }
          const item: ItemFlux = {
            contenu,
            plateformes: [pf.plateforme.nom],
            dateISO: jours[i],
          };
          vus.set(cle, item);
          items.push(item);
        }
      }
    });
  } catch (err) {
    console.error("[flux] nouveautés indisponibles :", err instanceof Error ? err.message : err);
  }

  const xmlItems = items
    .slice(0, MAX_ITEMS)
    .map(({ contenu, plateformes, dateISO }) => {
      const url = `${SITE_URL}/${contenu.type}/${contenu.slug}`;
      const titre = `${contenu.titre} — ${contenu.type === "serie" ? "série" : "film"} sur ${plateformes.join(", ")}`;
      const description = contenu.synopsis || `${contenu.titre} est disponible en streaming.`;
      const pubDate = new Date(dateISO + "T08:00:00Z").toUTCString();
      return `    <item>
      <title>${echapperXml(titre)}</title>
      <link>${echapperXml(url)}</link>
      <guid isPermaLink="true">${echapperXml(url)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${echapperXml(description)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>StreamActu.fr — Nouveautés streaming</title>
    <link>${SITE_URL}</link>
    <description>Les nouvelles séries et films disponibles sur Netflix, Prime Video, Disney+, Apple TV+, Canal+, HBO Max et Paramount+.</description>
    <language>fr</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${xmlItems}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
