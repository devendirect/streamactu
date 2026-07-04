import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import type { Contenu, MediaType } from "@/types";
import { getNouveautesMois, getTopAnnee } from "@/lib/tmdb";
import {
  bornesMois,
  formatMoisFR,
  formatMoisURL,
  parseMoisURL,
  scoreBayesien,
  toISO,
} from "@/lib/utils";
import { jsonLdClassement } from "@/lib/seo";
import EnTeteNouveautes from "@/components/EnTeteNouveautes";
import CarteContenu from "@/components/CarteContenu";
import MaillagePlateformes from "@/components/MaillagePlateformes";

export const revalidate = 86400;

const OG_IMAGES = ["/og-default.png"];
const MIN_CONTENUS = 5; // garde-fou anti-contenu maigre
const MAX_TOP = 20;

type TopParams =
  | { type: MediaType; portee: "mois"; mois: number; annee: number }
  | { type: MediaType; portee: "annee"; annee: number };

/** "series-juin-2026" | "films-2026" → paramètres du top, sinon null */
function parseTopSlug(brut: string): TopParams | null {
  let slug = brut;
  try {
    slug = decodeURIComponent(brut);
  } catch {
    // segment déjà décodé
  }

  const m = slug.match(/^(series|films)-(.+)$/);
  if (!m) return null;
  const type: MediaType = m[1] === "series" ? "serie" : "film";

  if (/^\d{4}$/.test(m[2])) {
    const annee = parseInt(m[2], 10);
    if (annee < 2000 || annee > 2100) return null;
    return { type, portee: "annee", annee };
  }

  const mois = parseMoisURL(m[2]);
  if (mois) return { type, portee: "mois", ...mois };

  return null;
}

function libelles(params: TopParams) {
  const estSeries = params.type === "serie";
  const nomType = estSeries ? "séries" : "films";
  const periode =
    params.portee === "mois"
      ? formatMoisFR(params.mois, params.annee)
      : String(params.annee);
  return {
    titre: `Top ${nomType} — ${periode}`,
    title: `Top ${nomType} ${periode} — les mieux noté${estSeries ? "es" : "s"} en streaming`,
    description:
      params.portee === "mois"
        ? `Le classement des ${nomType} sorti${estSeries ? "es" : "s"} en ${periode} les mieux noté${estSeries ? "es" : "s"} sur les plateformes de streaming en France.`
        : `Le classement des ${nomType} de ${periode} les mieux noté${estSeries ? "es" : "s"} disponibles en streaming en France.`,
  };
}

/** Top du mois : agrège les nouveautés du mois toutes plateformes, note pondérée */
async function getTopMois(type: MediaType, mois: number, annee: number): Promise<Contenu[]> {
  const plateformes = await getNouveautesMois(mois, annee);
  const vus = new Set<number>();
  const contenus: Contenu[] = [];

  for (const pf of plateformes) {
    for (const c of type === "serie" ? pf.series : pf.films) {
      if (vus.has(c.id)) continue;
      vus.add(c.id);
      contenus.push(c);
    }
  }

  return contenus
    .sort(
      (a, b) =>
        scoreBayesien(b.note, b.nbVotes) - scoreBayesien(a.note, a.nbVotes)
    )
    .slice(0, MAX_TOP);
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const top = parseTopSlug(slug);
  if (!top) return { title: "Page non trouvée" };

  const { title, description } = libelles(top);
  return {
    title,
    description,
    openGraph: { title: `${title} | StreamActu.fr`, description, images: OG_IMAGES },
    alternates: { canonical: `/top/${slug}` },
  };
}

export async function generateStaticParams() {
  const params: { slug: string }[] = [];
  const now = new Date();

  // Tops des 3 derniers mois révolus
  for (let i = 1; i <= 3; i++) {
    const d = new Date(now);
    d.setUTCDate(15);
    d.setUTCMonth(d.getUTCMonth() - i);
    const mois = formatMoisURL(d.getUTCMonth() + 1, d.getUTCFullYear());
    params.push({ slug: `series-${mois}` }, { slug: `films-${mois}` });
  }

  // Tops de l'année en cours
  const annee = now.getUTCFullYear();
  params.push({ slug: `series-${annee}` }, { slug: `films-${annee}` });

  return params;
}

export default async function TopPage({ params }: Props) {
  const { slug } = await params;
  const top = parseTopSlug(slug);
  if (!top) notFound();

  const now = new Date();

  let contenus: Contenu[];
  if (top.portee === "mois") {
    // Pas de top pour un mois qui n'a pas commencé
    if (bornesMois(top.mois, top.annee).debut > toISO(now)) notFound();
    contenus = await getTopMois(top.type, top.mois, top.annee);
  } else {
    if (top.annee > now.getUTCFullYear()) notFound();
    contenus = await getTopAnnee(top.type, top.annee);
  }

  if (contenus.length < MIN_CONTENUS) notFound();

  const { titre, description } = libelles(top);
  const estSeries = top.type === "serie";
  const anneeEnCours = top.portee === "annee" && top.annee === now.getUTCFullYear();

  // Liens croisés : type opposé sur la même période, et top annuel
  const slugOppose = slug.startsWith("series-")
    ? slug.replace(/^series-/, "films-")
    : slug.replace(/^films-/, "series-");

  return (
    <>
      <EnTeteNouveautes
        titre={titre}
        intro={`${description}${anneeEnCours ? " Classement de l'année en cours, mis à jour chaque jour." : ""}`}
      />
      <div className="sa-container py-4 space-y-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdClassement(titre, `/top/${slug}`, contenus),
          }}
        />

        <nav aria-label="Autres classements" className="flex items-center gap-4 flex-wrap">
          <Link
            href={`/top/${slugOppose}`}
            className="font-mono-label text-foreground border-b border-primary pb-1 hover:text-primary transition-colors"
          >
            {estSeries ? "Top films" : "Top séries"} de la même période →
          </Link>
          {top.portee === "mois" && (
            <Link
              href={`/top/${estSeries ? "series" : "films"}-${top.annee}`}
              className="font-mono-label text-foreground border-b border-primary pb-1 hover:text-primary transition-colors"
            >
              Top {estSeries ? "séries" : "films"} {top.annee} →
            </Link>
          )}
        </nav>

        {/* Classement numéroté */}
        <ol className="list-none m-0 p-0">
          {contenus.map((c, i) => (
            <li key={c.id} className="flex items-center gap-4">
              <span
                aria-hidden="true"
                className="font-mono text-primary shrink-0 w-9 text-right"
                style={{ fontSize: i < 3 ? "22px" : "15px", fontWeight: 600 }}
              >
                {i + 1}
              </span>
              <span className="sr-only">Numéro {i + 1} :</span>
              <div className="flex-1 min-w-0">
                <CarteContenu contenu={c} priorite={i === 0} />
              </div>
            </li>
          ))}
        </ol>

        <MaillagePlateformes />
      </div>
    </>
  );
}
