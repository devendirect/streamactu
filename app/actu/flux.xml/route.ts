import { ACTU_PUBLIEE, ARTICLES } from "@/lib/actu";
import { SITE_URL } from "@/lib/site";

// Flux RSS des articles Actu, séparé du flux des sorties (/flux.xml) : un
// abonné aux sorties ne reçoit pas les articles, et inversement.
export const revalidate = 3600;

function echapperXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  // Rubrique absente tant qu'aucun article n'est publié
  if (!ACTU_PUBLIEE) return new Response("Not Found", { status: 404 });

  const items = ARTICLES.map((a) => {
    const url = `${SITE_URL}/actu/${a.slug}`;
    // Publication le vendredi matin, heure de Paris
    const pubDate = new Date(`${a.publie}T07:00:00Z`).toUTCString();
    return `    <item>
      <title>${echapperXml(a.titre)}</title>
      <link>${echapperXml(url)}</link>
      <guid isPermaLink="true">${echapperXml(url)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${echapperXml(a.chapo)}</description>
    </item>`;
  }).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>StreamActu.fr : que regarder ce week-end</title>
    <link>${SITE_URL}/actu</link>
    <description>Chaque vendredi, les séries et films à regarder ce week-end sur les plateformes de streaming en France.</description>
    <language>fr</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
