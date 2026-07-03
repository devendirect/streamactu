import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getNouveautesJour, getNouveautesMois, getNouveautesSemaine } from "@/lib/tmdb";
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
  toISO,
  bornesMois,
  getISOWeek,
} from "@/lib/utils";
import AccueilClient from "@/components/AccueilClient";
import EnTeteNouveautes from "@/components/EnTeteNouveautes";

export const revalidate = 86400;

const OG_IMAGES = ["/og-default.png"];

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const date = parseDateURL(slug);
  if (date) {
    const label = formatJourSemaineFR(date);
    const title = `Nouveautés streaming — ${label}`;
    const description = `Toutes les séries et films sortis le ${label} sur les plateformes de streaming.`;
    return {
      title,
      description,
      openGraph: { title, description, images: OG_IMAGES },
      alternates: { canonical: `/${slug}` },
    };
  }

  const sem = parseSemaineURL(slug);
  if (sem) {
    const label = `Semaine du ${formatSemaineFR(sem.semaine, sem.annee)}`;
    const title = `Nouveautés streaming — ${label}`;
    const description = `Toutes les séries et films sortis pendant la ${label.toLowerCase()} sur les plateformes de streaming.`;
    return {
      title,
      description,
      openGraph: { title, description, images: OG_IMAGES },
      alternates: { canonical: `/${slug}` },
    };
  }

  const mois = parseMoisURL(slug);
  if (mois) {
    const label = formatMoisFR(mois.mois, mois.annee);
    const title = `Nouveautés streaming — ${label}`;
    const description = `Toutes les séries et films sortis en ${label} sur Netflix, Prime Video, Disney+ et autres plateformes.`;
    return {
      title,
      description,
      openGraph: { title, description, images: OG_IMAGES },
      alternates: { canonical: `/${slug}` },
    };
  }

  return { title: "Page non trouvée" };
}

export async function generateStaticParams() {
  const params: { slug: string }[] = [];
  const now = new Date();

  // 30 derniers jours
  for (let i = 1; i <= 30; i++) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    params.push({ slug: formatDateURL(d) });
  }

  // 6 derniers mois
  for (let i = 1; i <= 6; i++) {
    const d = new Date(now);
    d.setUTCDate(15); // évite le débordement de fin de mois (ex. 31 → mois suivant)
    d.setUTCMonth(d.getUTCMonth() - i);
    params.push({ slug: formatMoisURL(d.getUTCMonth() + 1, d.getUTCFullYear()) });
  }

  // 12 dernières semaines
  const { semaine: semCourante, annee: anneeCourante } = getISOWeek(now);
  for (let i = 0; i < 12; i++) {
    const { semaine, annee } = decalerSemaineISO(semCourante, anneeCourante, -i);
    params.push({ slug: formatSemaineURL(semaine, annee) });
  }

  return params;
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;
  const aujourdhui = toISO(new Date());

  // ── Vue jour ──────────────────────────────────
  const date = parseDateURL(slug);
  if (date) {
    const iso = toISO(date);
    if (iso > aujourdhui) notFound();

    const nouveautes = await getNouveautesJour(iso);
    const label = formatJourSemaineFR(date);
    return (
      <>
        <EnTeteNouveautes
          titre={`Nouveautés streaming — ${label}`}
          intro={`Les séries et films sortis ce jour-là sur Netflix, Prime Video, Disney+, Apple TV+, Canal+, Max et Paramount+.`}
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
    const { semaine: semAujourd, annee: anneeAujourd } = getISOWeek(new Date());
    const estFutur =
      annee > anneeAujourd ||
      (annee === anneeAujourd && semaine > semAujourd);
    if (estFutur) notFound();

    const nouveautes = await getNouveautesSemaine(semaine, annee);
    return (
      <>
        <EnTeteNouveautes
          titre={`Nouveautés streaming — Semaine du ${formatSemaineFR(semaine, annee)}`}
          intro="Les séries et films sortis cette semaine-là sur les sept grandes plateformes de streaming disponibles en France."
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
