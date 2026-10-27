"use client";

import Link from "next/link";
import Icone from "@/components/Icone";
import type { ContexteTemporel } from "@/types";
import {
  toISO,
  parseISO,
  bornesSemaine,
  decalerSemaineISO,
  formatDateFR,
  formatDateURL,
  formatJourSemaineFR,
  formatSemaineURL,
  formatSemaineFR,
  formatMoisURL,
  formatMoisFR,
  getISOWeek,
  horizonFuturISO,
  ANNEE_PLANCHER,
} from "@/lib/utils";

const MOIS_COURTS = ["", "Jan.", "Fév.", "Mar.", "Avr.", "Mai", "Juin", "Juil.", "Août", "Sep.", "Oct.", "Nov.", "Déc."];

interface Props {
  contexte: ContexteTemporel;
}

export default function NavigationTemporelle({ contexte }: Props) {
  const now = new Date();
  const todayISO = toISO(now);
  const horizonISO = horizonFuturISO(now);
  const { semaine: semaineAujourd, annee: anneeAujourdSem } = getISOWeek(now);
  const moisAujourd = now.getUTCMonth() + 1;
  const anneeAujourdMois = now.getUTCFullYear();

  // URLs des onglets
  const semaineCouranteURL = `/${formatSemaineURL(semaineAujourd, anneeAujourdSem)}`;
  const moisCourantURL = `/${formatMoisURL(moisAujourd, anneeAujourdMois)}`;

  // Infos de navigation selon le mode
  let navLabel = "";
  let navSub = "";
  let prevLabel = "";
  let nextLabel = "";
  let prevHref = "/";
  let nextHref = "/";
  let canGoForward = false;
  // Pas de lien vers une période sous ANNEE_PLANCHER (404)
  let canGoBack = true;

  if (contexte.mode === "jour") {
    const d = parseISO(contexte.dateISO);
    navLabel = formatJourSemaineFR(d);
    navSub = `streamactu.fr/${formatDateURL(d)}`;
    const prev = new Date(d); prev.setUTCDate(d.getUTCDate() - 1);
    const next = new Date(d); next.setUTCDate(d.getUTCDate() + 1);
    prevHref = toISO(prev) === todayISO ? "/" : `/${formatDateURL(prev)}`;
    nextHref = toISO(next) === todayISO ? "/" : `/${formatDateURL(next)}`;
    canGoBack = prev.getUTCFullYear() >= ANNEE_PLANCHER;
    prevLabel = "Hier";
    nextLabel = "Demain";
    // Navigable dans le futur jusqu'à l'horizon (diffusions programmées)
    canGoForward = contexte.dateISO < horizonISO;
    // Affiner avec les noms courts sauf pour hier/demain adjacents
    const diffPrev = (now.getTime() - prev.getTime()) / 86400000;
    const diffNext = (next.getTime() - now.getTime()) / 86400000;
    if (diffPrev > 1) prevLabel = formatDateFR(prev).split(" ").slice(0, 2).join(" ");
    if (diffNext > 1) nextLabel = formatDateFR(next).split(" ").slice(0, 2).join(" ");
  } else if (contexte.mode === "semaine") {
    const { semaine, annee } = contexte;
    navLabel = `Semaine du ${formatSemaineFR(semaine, annee)}`;
    navSub = `streamactu.fr/${formatSemaineURL(semaine, annee)}`;
    const prev = decalerSemaineISO(semaine, annee, -1);
    const next = decalerSemaineISO(semaine, annee, 1);
    prevHref = `/${formatSemaineURL(prev.semaine, prev.annee)}`;
    nextHref = `/${formatSemaineURL(next.semaine, next.annee)}`;
    canGoBack = prev.annee >= ANNEE_PLANCHER;
    prevLabel = "Semaine préc.";
    nextLabel = "Semaine suiv.";
    // Navigable tant que la semaine suivante commence dans l'horizon
    canGoForward = bornesSemaine(next.semaine, next.annee).debut <= horizonISO;
  } else {
    const { mois, annee } = contexte;
    navLabel = formatMoisFR(mois, annee);
    navSub = `streamactu.fr/${formatMoisURL(mois, annee)}`;
    const mP = mois === 1 ? 12 : mois - 1;
    const aP = mois === 1 ? annee - 1 : annee;
    const mS = mois === 12 ? 1 : mois + 1;
    const aS = mois === 12 ? annee + 1 : annee;
    prevHref = `/${formatMoisURL(mP, aP)}`;
    nextHref = `/${formatMoisURL(mS, aS)}`;
    canGoBack = aP >= ANNEE_PLANCHER;
    prevLabel = MOIS_COURTS[mP];
    nextLabel = MOIS_COURTS[mS];
    canGoForward =
      annee < anneeAujourdMois ||
      (annee === anneeAujourdMois && mois < moisAujourd);
  }

  const isAujourd = contexte.mode === "jour" && contexte.dateISO === todayISO;
  const isSemaine = contexte.mode === "semaine";
  const isMois = contexte.mode === "mois";
  const fleche = "inline-flex items-center gap-1 text-sm font-semibold whitespace-nowrap";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {/* Onglets temporels : chaque période reste une page */}
      <div className="segments">
        {[
          { label: "Aujourd'hui", active: isAujourd, href: "/" },
          { label: "Cette semaine", active: isSemaine, href: semaineCouranteURL },
          { label: "Ce mois", active: isMois, href: moisCourantURL },
        ].map((tab) => (
          <Link key={tab.label} href={tab.href} aria-current={tab.active ? "page" : undefined}>
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Navigation contextuelle */}
      <div className="flex items-center gap-5">
        {canGoBack ? (
          <Link href={prevHref} className={`${fleche} text-texte-doux transition-colors duration-200 hover:text-white`}>
            <Icone nom="gauche" taille={16} />
            {prevLabel}
          </Link>
        ) : (
          <span aria-disabled="true" className={`${fleche} cursor-not-allowed text-texte-2 opacity-40`}>
            <Icone nom="gauche" taille={16} />
            {prevLabel}
          </span>
        )}
        <div className="min-w-0 text-center">
          <div className="text-base leading-tight font-bold">{navLabel}</div>
          <div className="mt-0.5 text-xs text-texte-2">{navSub}</div>
        </div>
        {canGoForward ? (
          <Link href={nextHref} className={`${fleche} text-texte-doux transition-colors duration-200 hover:text-white`}>
            {nextLabel}
            <Icone nom="droite" taille={16} />
          </Link>
        ) : (
          <span aria-disabled="true" className={`${fleche} cursor-not-allowed text-texte-2 opacity-40`}>
            {nextLabel}
            <Icone nom="droite" taille={16} />
          </span>
        )}
      </div>
    </div>
  );
}
