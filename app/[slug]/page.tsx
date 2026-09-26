import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  getNouveautesJour,
  getNouveautesMois,
  getNouveautesSemaine,
  getSortiesRecentesPlateforme,
} from "@/lib/tmdb";
import { PLATEFORMES, PLATEFORME_PAR_SLUG } from "@/lib/plateformes";
import {
  parseDateURL,
  parseMoisURL,
  parseSemaineURL,
  decalerSemaineISO,
  formatDateURL,
  formatJourSemaineFR,
  formatMoisFR,
  formatMoisURL,
  formatSemaineURL,
  formatSemaineFR,
  horizonFuturISO,
  libelleComptes,
  toISO,
  bornesMois,
  bornesSemaine,
  getISOWeek,
} from "@/lib/utils";
import type { Contenu } from "@/types";
import { comptesUniques, metadonnees, metaHubPlateforme, metaJour, metaMois, metaSemaine } from "@/lib/meta";
import AccueilClient from "@/components/AccueilClient";
import EnTeteNouveautes from "@/components/EnTeteNouveautes";
import SectionPlateforme from "@/components/SectionPlateforme";
import MaillagePlateformes from "@/components/MaillagePlateformes";
import ArchivesMoisPlateforme from "@/components/ArchivesMoisPlateforme";
import FaqPlateforme from "@/components/FaqPlateforme";

// 1h : les pages plateforme suivent la fraîcheur des données semaine
export const revalidate = 3600;


interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const pf = PLATEFORME_PAR_SLUG[slug];
  if (pf) {
    const { titre, description } = metaHubPlateforme(pf.nom);
    return metadonnees(titre, description, `/${pf.slug}`);
  }

  // Les données viennent des mêmes caches que le rendu de la page : aucun
  // appel supplémentaire. Au doute (API indisponible), description sans chiffres
  // et page laissée indexable.
  const date = parseDateURL(slug);
  if (date) {
    const iso = toISO(date);
    const futur = iso > toISO(new Date());
    let comptes = { series: [] as Contenu[], films: [] as Contenu[] };
    let vide = false;
    if (!futur) {
      try {
        comptes = comptesUniques(await getNouveautesJour(iso));
        // Jour vide → noindex (la page reste servie aux visiteurs)
        vide = comptes.series.length + comptes.films.length === 0;
      } catch (err) {
        console.error(`[metadata] comptage du jour ${iso} indisponible :`, err instanceof Error ? err.message : err);
      }
    }
    const { titre, description } = metaJour(date, futur, comptes.series, comptes.films);
    // Futur : contenu prévisionnel et changeant, jamais indexé
    return metadonnees(titre, description, `/${formatDateURL(date)}`, {
      ...(vide || futur ? { robots: { index: false } } : {}),
    });
  }

  const sem = parseSemaineURL(slug);
  if (sem) {
    const futur = bornesSemaine(sem.semaine, sem.annee).debut > toISO(new Date());
    let comptes = { series: [] as Contenu[], films: [] as Contenu[] };
    if (!futur) {
      try {
        comptes = comptesUniques(await getNouveautesSemaine(sem.semaine, sem.annee));
      } catch (err) {
        console.error(`[metadata] semaine ${slug} indisponible :`, err instanceof Error ? err.message : err);
      }
    }
    const { titre, description } = metaSemaine(sem.semaine, sem.annee, futur, comptes.series, comptes.films);
    return metadonnees(titre, description, `/${formatSemaineURL(sem.semaine, sem.annee)}`, {
      ...(futur ? { robots: { index: false } } : {}),
    });
  }

  const mois = parseMoisURL(slug);
  if (mois) {
    let comptes = { series: [] as Contenu[], films: [] as Contenu[] };
    try {
      comptes = comptesUniques(await getNouveautesMois(mois.mois, mois.annee));
    } catch (err) {
      console.error(`[metadata] mois ${slug} indisponible :`, err instanceof Error ? err.message : err);
    }
    const { titre, description } = metaMois(mois.mois, mois.annee, comptes.series, comptes.films);
    return metadonnees(titre, description, `/${formatMoisURL(mois.mois, mois.annee)}`);
  }

  return { title: "Page non trouvée" };
}

/**
 * Surface pré-rendue volontairement réduite pour limiter les appels TMDB
 * au build (~250 au lieu de ~730) et le risque d'échec sur une erreur
 * transitoire. Les URLs plus anciennes (30 jours de sitemap, 12 semaines,
 * 6 mois) restent servies via ISR à la première visite.
 */
export async function generateStaticParams() {
  const params: { slug: string }[] = [];
  const now = new Date();

  // 7 derniers jours (le reste des 30 jours du sitemap : à la demande)
  for (let i = 1; i <= 7; i++) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    params.push({ slug: formatDateURL(d) });
  }

  // 3 derniers mois — mêmes caches que les tops mensuels et archives plateforme
  for (let i = 1; i <= 3; i++) {
    const d = new Date(now);
    d.setUTCDate(15); // évite le débordement de fin de mois (ex. 31 → mois suivant)
    d.setUTCMonth(d.getUTCMonth() - i);
    params.push({ slug: formatMoisURL(d.getUTCMonth() + 1, d.getUTCFullYear()) });
  }

  // 4 dernières semaines — mêmes caches que le sitemap, les hubs plateforme
  // et les pages series/films
  const { semaine: semCourante, annee: anneeCourante } = getISOWeek(now);
  for (let i = 0; i < 4; i++) {
    const { semaine, annee } = decalerSemaineISO(semCourante, anneeCourante, -i);
    params.push({ slug: formatSemaineURL(semaine, annee) });
  }

  // Pages plateforme (réutilisent la semaine courante)
  for (const pf of PLATEFORMES) {
    params.push({ slug: pf.slug });
  }

  return params;
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;
  const aujourdhui = toISO(new Date());

  // ── Page plateforme (hub — semaine courante) ──
  const pf = PLATEFORME_PAR_SLUG[slug];
  if (pf) {
    const { semaine, annee } = getISOWeek(new Date());
    const toutes = await getNouveautesSemaine(semaine, annee);
    let data = toutes.find((p) => p.plateforme.id === pf.id);
    let periodeLabel = `Semaine du ${formatSemaineFR(semaine, annee)}`;
    let periodeIntro = "cette semaine";

    // Semaine creuse (petites plateformes) → on élargit aux 4 dernières
    // semaines plutôt que de servir une page vide. Mêmes caches, aucun
    // appel supplémentaire.
    if ((data?.series.length ?? 0) + (data?.films.length ?? 0) === 0) {
      const recentes = await getSortiesRecentesPlateforme(pf.id);
      if (recentes.series.length + recentes.films.length > 0) {
        data = { plateforme: pf, ...recentes };
        periodeLabel = "Dernières semaines";
        periodeIntro = "ces quatre dernières semaines";
      }
    }

    const comptes = libelleComptes(data?.series.length ?? 0, data?.films.length ?? 0);

    return (
      <>
        <EnTeteNouveautes
          titre={`Nouveautés ${pf.nom} — ${periodeLabel}`}
          intro={
            comptes
              ? `${comptes} ajoutés ${periodeIntro} au catalogue ${pf.nom} en France, triés par note.`
              : `Aucune sortie recensée récemment sur ${pf.nom} — les archives des mois précédents sont ci-dessous.`
          }
        />
        <div className="sa-container py-4 space-y-10">
          <nav aria-label={`Nouveautés ${pf.nom} par type`} className="flex items-center gap-4 flex-wrap">
            <Link
              href={`/${pf.slug}/series`}
              className="font-mono-label text-foreground border-b border-primary pb-1 hover:text-primary transition-colors"
            >
              Nouvelles séries {pf.nom} →
            </Link>
            <Link
              href={`/${pf.slug}/films`}
              className="font-mono-label text-foreground border-b border-primary pb-1 hover:text-primary transition-colors"
            >
              Nouveaux films {pf.nom} →
            </Link>
            <Link
              href={`/${pf.slug}/prochaines-sorties`}
              className="font-mono-label text-foreground border-b border-primary pb-1 hover:text-primary transition-colors"
            >
              Prochaines sorties {pf.nom} →
            </Link>
          </nav>

          {data && <SectionPlateforme data={data} priorite lienTitre={false} />}

          <FaqPlateforme
            plateforme={pf}
            series={data?.series ?? []}
            films={data?.films ?? []}
            periodeIntro={periodeIntro}
          />
          <ArchivesMoisPlateforme plateforme={pf} />
          <MaillagePlateformes actuelle={pf.id} />
        </div>
      </>
    );
  }

  // ── Vue jour ──────────────────────────────────
  const date = parseDateURL(slug);
  if (date) {
    const iso = toISO(date);
    // Le futur est navigable jusqu'à l'horizon (épisodes programmés), noindex
    if (iso > horizonFuturISO()) notFound();
    const futur = iso > aujourdhui;

    const nouveautes = await getNouveautesJour(iso);
    const label = formatJourSemaineFR(date);
    return (
      <>
        <EnTeteNouveautes
          titre={`Nouveautés streaming — ${label}`}
          intro={
            futur
              ? "Les épisodes et sorties annoncés ce jour-là sur Netflix, Prime Video, Disney+, Apple TV+, Canal+, HBO Max et Paramount+ — programme susceptible de changer."
              : "Les séries et films sortis ce jour-là sur Netflix, Prime Video, Disney+, Apple TV+, Canal+, HBO Max et Paramount+."
          }
        />
        <AccueilClient
          plateformes={nouveautes}
          contexte={{ mode: "jour", dateISO: iso }}
        />
      </>
    );
  }

  // ── Vue semaine ───────────────────────────────
  const semData = parseSemaineURL(slug);
  if (semData) {
    const { semaine, annee } = semData;
    const { debut } = bornesSemaine(semaine, annee);
    // Semaines futures navigables tant qu'elles commencent dans l'horizon
    if (debut > horizonFuturISO()) notFound();
    const futur = debut > aujourdhui;

    const nouveautes = await getNouveautesSemaine(semaine, annee);
    return (
      <>
        <EnTeteNouveautes
          titre={`Nouveautés streaming — Semaine du ${formatSemaineFR(semaine, annee)}`}
          intro={
            futur
              ? "Les épisodes et sorties annoncés cette semaine-là sur les sept grandes plateformes — programme susceptible de changer."
              : "Les séries et films sortis cette semaine-là sur les sept grandes plateformes de streaming disponibles en France."
          }
        />
        <AccueilClient
          plateformes={nouveautes}
          contexte={{ mode: "semaine", semaine, annee }}
        />
      </>
    );
  }

  // ── Vue mois ──────────────────────────────────
  const moisData = parseMoisURL(slug);
  if (moisData) {
    const { mois, annee } = moisData;
    const { debut } = bornesMois(mois, annee);
    if (debut > aujourdhui) notFound();

    const nouveautes = await getNouveautesMois(mois, annee);
    return (
      <>
        <EnTeteNouveautes
          titre={`Nouveautés streaming — ${formatMoisFR(mois, annee)}`}
          intro="Le récapitulatif du mois : toutes les séries et films arrivés sur Netflix, Prime Video, Disney+ et les autres plateformes."
        />
        <AccueilClient
          plateformes={nouveautes}
          contexte={{ mode: "mois", mois, annee }}
        />
      </>
    );
  }

  notFound();
}
