import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getNouveautesJour, getNouveautesMois, getNouveautesSemaine } from "@/lib/tmdb";
import {
  parseDateURL,
  parseMoisURL,
  parseSemaineURL,
  formatDateURL,
  formatJourSemaineFR,
  formatMoisURL,
  formatMoisFR,
  formatSemaineURL,
  formatSemaineFR,
  toISO,
  bornesMois,
  getISOWeek,
} from "@/lib/utils";
import AccueilClient from "@/components/AccueilClient";

export const revalidate = 86400;

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
      openGraph: { title, description },
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
      openGraph: { title, description },
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
      openGraph: { title, description },
      alternates: { canonical: `/${slug}` },
    };
  }

  return { title: "Page non trouvée" };
}

export async function generateStaticParams() {
  const params: { slug: string }[] = [];
  const now = new Date();
  const MOIS = [
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre",
  ];

  // 30 derniers jours
  for (let i = 1; i <= 30; i++) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    params.push({ slug: formatDateURL(d) });
  }

  // 6 derniers mois
  for (let i = 1; i <= 6; i++) {
    const d = new Date(now);
    d.setMonth(d.getMonth() - i);
    params.push({ slug: `${MOIS[d.getMonth()]}-${d.getFullYear()}` });
  }

  // 12 dernières semaines
  const { semaine: semCourante, annee: anneeCourante } = getISOWeek(now);
  for (let i = 0; i < 12; i++) {
    let sem = semCourante - i;
    let annee = anneeCourante;
    if (sem < 1) { annee--; sem += 52; }
    params.push({ slug: formatSemaineURL(sem, annee) });
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
    return (
      <AccueilClient
        plateformes={nouveautes}
        contexte={{ mode: "jour", dateISO: iso }}
      />
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
      <AccueilClient
        plateformes={nouveautes}
        contexte={{ mode: "semaine", semaine, annee }}
      />
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
      <AccueilClient
        plateformes={nouveautes}
        contexte={{ mode: "mois", mois, annee }}
      />
    );
  }

  notFound();
}
