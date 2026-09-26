import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  getNouveautesAnnee,
  getNouveautesMois,
  getSortiesAVenir,
  getSortiesRecentesPlateforme,
} from "@/lib/tmdb";
import { PLATEFORMES, PLATEFORME_PAR_SLUG } from "@/lib/plateformes";
import {
  bornesMois,
  formatMoisFR,
  formatMoisURL,
  libelleComptes,
  parseAnneeURL,
  parseMoisURL,
  toISO,
} from "@/lib/utils";
import EnTeteNouveautes from "@/components/EnTeteNouveautes";
import SectionPlateforme from "@/components/SectionPlateforme";
import MaillagePlateformes from "@/components/MaillagePlateformes";
import ArchivesMoisPlateforme from "@/components/ArchivesMoisPlateforme";
import MoisDeLAnnee from "@/components/MoisDeLAnnee";
import ListeSortiesParJour, { agregerSortiesParJour } from "@/components/ListeSortiesParJour";

export const revalidate = 3600;

const OG_IMAGES = ["/og-default.png"];
const MAX_TYPE = 20;

interface Props {
  params: Promise<{ slug: string; sous: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, sous } = await params;
  const pf = PLATEFORME_PAR_SLUG[slug];
  if (!pf) return { title: "Page non trouvée" };

  if (sous === "series" || sous === "films") {
    const title =
      sous === "series"
        ? `Nouvelles séries ${pf.nom}`
        : `Nouveaux films ${pf.nom}`;
    const description =
      sous === "series"
        ? `Les nouvelles séries ajoutées au catalogue ${pf.nom} en France ces dernières semaines, triées par note.`
        : `Les nouveaux films ajoutés au catalogue ${pf.nom} en France ces dernières semaines, triés par note.`;
    return {
      title,
      description,
      openGraph: { title, description, images: OG_IMAGES },
      alternates: { canonical: `/${pf.slug}/${sous}` },
    };
  }

  if (sous === "prochaines-sorties") {
    const title = `Prochaines sorties ${pf.nom}`;
    const description = `Le calendrier des prochaines sorties ${pf.nom} en France : nouvelles séries et films annoncés sur les quatre semaines à venir.`;

    // Calendrier vide pour cette plateforme → noindex
    let vide = false;
    try {
      const donnees = await getSortiesAVenir();
      vide = agregerSortiesParJour(donnees, pf.id).length === 0;
    } catch (err) {
      // au doute, on laisse indexable
      console.error(`[metadata] sorties à venir ${pf.slug} indisponibles :`, err instanceof Error ? err.message : err);
    }

    return {
      title,
      description,
      openGraph: { title, description, images: OG_IMAGES },
      alternates: { canonical: `/${pf.slug}/prochaines-sorties` },
      ...(vide ? { robots: { index: false } } : {}),
    };
  }

  const mois = parseMoisURL(sous);
  if (mois) {
    const label = formatMoisFR(mois.mois, mois.annee);
    const title = `Nouveautés ${pf.nom} — ${label}`;
    const description = `Toutes les séries et films arrivés sur ${pf.nom} en ${label} en France.`;
    return {
      title,
      description,
      openGraph: { title, description, images: OG_IMAGES },
      alternates: { canonical: `/${pf.slug}/${formatMoisURL(mois.mois, mois.annee)}` },
    };
  }

  const annee = parseAnneeURL(sous);
  if (annee && annee <= new Date().getUTCFullYear()) {
    const title = `Nouveautés ${pf.nom} ${annee}`;
    const description = `Toutes les séries et films arrivés sur ${pf.nom} en France en ${annee}, mois par mois.`;
    return {
      title,
      description,
      openGraph: { title, description, images: OG_IMAGES },
      alternates: { canonical: `/${pf.slug}/${annee}` },
    };
  }

  return { title: "Page non trouvée" };
}

export async function generateStaticParams() {
  const params: { slug: string; sous: string }[] = [];
  const now = new Date();

  for (const pf of PLATEFORMES) {
    params.push({ slug: pf.slug, sous: "series" });
    params.push({ slug: pf.slug, sous: "films" });
    params.push({ slug: pf.slug, sous: "prochaines-sorties" });

    // 3 derniers mois d'archives
    for (let i = 1; i <= 3; i++) {
      const d = new Date(now);
      d.setUTCDate(15);
      d.setUTCMonth(d.getUTCMonth() - i);
      params.push({
        slug: pf.slug,
        sous: formatMoisURL(d.getUTCMonth() + 1, d.getUTCFullYear()),
      });
    }

    // Récaps annuels déclarés au sitemap : année en cours et précédente
    params.push({ slug: pf.slug, sous: String(now.getUTCFullYear()) });
    params.push({ slug: pf.slug, sous: String(now.getUTCFullYear() - 1) });
  }

  return params;
}

export default async function SousPlateformePage({ params }: Props) {
  const { slug, sous } = await params;
  const pf = PLATEFORME_PAR_SLUG[slug];
  if (!pf) notFound();

  // ── Nouvelles séries / nouveaux films ─────────
  if (sous === "series" || sous === "films") {
    const estSeries = sous === "series";
    const sorties = await getSortiesRecentesPlateforme(pf.id);
    const contenus = (estSeries ? sorties.series : sorties.films).slice(0, MAX_TYPE);

    return (
      <>
        <EnTeteNouveautes
          titre={estSeries ? `Nouvelles séries ${pf.nom}` : `Nouveaux films ${pf.nom}`}
          intro={
            contenus.length > 0
              ? `${contenus.length} ${estSeries ? "série" : "film"}${contenus.length > 1 ? "s" : ""} ajouté${estSeries ? "e" : ""}${contenus.length > 1 ? "s" : ""} sur ${pf.nom} ces quatre dernières semaines, trié${estSeries ? "e" : ""}${contenus.length > 1 ? "s" : ""} par note.`
              : `Aucune sortie ${estSeries ? "série" : "film"} recensée sur ${pf.nom} ces quatre dernières semaines.`
          }
        />
        <div className="sa-container py-4 space-y-10">
          <nav aria-label={`Navigation ${pf.nom}`} className="flex items-center gap-4 flex-wrap">
            <Link
              href={`/${pf.slug}`}
              className="font-mono-label text-foreground border-b border-primary pb-1 hover:text-primary transition-colors"
            >
              ← Toutes les nouveautés {pf.nom}
            </Link>
            <Link
              href={`/${pf.slug}/${estSeries ? "films" : "series"}`}
              className="font-mono-label text-foreground border-b border-primary pb-1 hover:text-primary transition-colors"
            >
              {estSeries ? `Nouveaux films ${pf.nom}` : `Nouvelles séries ${pf.nom}`} →
            </Link>
          </nav>

          {contenus.length > 0 && (
            <SectionPlateforme
              data={{
                plateforme: pf,
                series: estSeries ? contenus : [],
                films: estSeries ? [] : contenus,
              }}
              priorite
              lienTitre={false}
            />
          )}

          <MaillagePlateformes actuelle={pf.id} />
        </div>
      </>
    );
  }

  // ── Prochaines sorties de la plateforme ───────
  if (sous === "prochaines-sorties") {
    const donnees = await getSortiesAVenir();
    const jours = agregerSortiesParJour(donnees, pf.id);
    const total = jours.reduce((n, j) => n + j.contenus.length, 0);

    return (
      <>
        <EnTeteNouveautes
          titre={`Prochaines sorties ${pf.nom}`}
          intro={
            total > 0
              ? `${total} sortie${total > 1 ? "s" : ""} annoncée${total > 1 ? "s" : ""} sur ${pf.nom} dans les quatre prochaines semaines. Les dates peuvent bouger : la page est actualisée plusieurs fois par jour.`
              : `Aucune sortie annoncée sur ${pf.nom} dans les quatre prochaines semaines pour l'instant.`
          }
        />
        <div className="sa-container py-4 space-y-10">
          <nav aria-label={`Navigation ${pf.nom}`} className="flex items-center gap-4 flex-wrap">
            <Link
              href={`/${pf.slug}`}
              className="font-mono-label text-foreground border-b border-primary pb-1 hover:text-primary transition-colors"
            >
              ← Nouveautés {pf.nom} de la semaine
            </Link>
            <Link
              href="/prochaines-sorties"
              className="font-mono-label text-foreground border-b border-primary pb-1 hover:text-primary transition-colors"
            >
              Toutes les prochaines sorties →
            </Link>
          </nav>

          <ListeSortiesParJour jours={jours} />

          <MaillagePlateformes actuelle={pf.id} />
        </div>
      </>
    );
  }

  // ── Archive mensuelle ─────────────────────────
  const mois = parseMoisURL(sous);
  if (mois) {
    const { debut } = bornesMois(mois.mois, mois.annee);
    if (debut > toISO(new Date())) notFound();

    const toutes = await getNouveautesMois(mois.mois, mois.annee);
    const data = toutes.find((p) => p.plateforme.id === pf.id);
    const total = (data?.series.length ?? 0) + (data?.films.length ?? 0);
    // Garde-fou anti-contenu maigre : pas de page d'archive vide
    if (!data || total === 0) notFound();

    const label = formatMoisFR(mois.mois, mois.annee);

    return (
      <>
        <EnTeteNouveautes
          titre={`Nouveautés ${pf.nom} — ${label}`}
          intro={`${libelleComptes(data.series.length, data.films.length)} arrivés sur ${pf.nom} en ${label}, triés par note.`}
        />
        <div className="sa-container py-4 space-y-10">
          <nav aria-label={`Navigation ${pf.nom}`}>
            <Link
              href={`/${pf.slug}`}
              className="font-mono-label text-foreground border-b border-primary pb-1 hover:text-primary transition-colors"
            >
              ← Nouveautés {pf.nom} de la semaine
            </Link>
          </nav>

          <SectionPlateforme data={data} priorite lienTitre={false} />

          <ArchivesMoisPlateforme plateforme={pf} moisActuel={sous} annee={mois.annee} />
          <MaillagePlateformes actuelle={pf.id} />
        </div>
      </>
    );
  }

  // ── Année ─────────────────────────────────────
  const annee = parseAnneeURL(sous);
  if (annee) {
    // Année future : rien à inventorier (même règle que /top/[slug])
    if (annee > new Date().getUTCFullYear()) notFound();

    const data = await getNouveautesAnnee(pf.id, annee);
    // Garde-fou anti-contenu maigre : c'est lui qui rend la page sûre sur les
    // plateformes à petit catalogue, où l'année peut être vide.
    if (!data || data.totalSeries + data.totalFilms === 0) notFound();

    return (
      <>
        <EnTeteNouveautes
          titre={`Nouveautés ${pf.nom} ${annee}`}
          intro={`${libelleComptes(data.totalSeries, data.totalFilms)} arrivés sur ${pf.nom} en ${annee}. Les mieux notés d'abord, puis le détail mois par mois.`}
        />
        <div className="sa-container py-4 space-y-10">
          <nav aria-label={`Navigation ${pf.nom}`}>
            <Link
              href={`/${pf.slug}`}
              className="font-mono-label text-foreground border-b border-primary pb-1 hover:text-primary transition-colors"
            >
              ← Nouveautés {pf.nom} de la semaine
            </Link>
          </nav>

          <SectionPlateforme
            data={{ plateforme: pf, series: data.series, films: data.films }}
            priorite
            lienTitre={false}
          />

          <MoisDeLAnnee plateforme={pf} mois={data.mois} />
          <MaillagePlateformes actuelle={pf.id} />
        </div>
      </>
    );
  }

  notFound();
}
