"use client";

import Link from "next/link";
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

  if (contexte.mode === "jour") {
    const d = parseISO(contexte.dateISO);
    navLabel = formatJourSemaineFR(d);
    navSub = `streamactu.fr/${formatDateURL(d)}`;
    const prev = new Date(d); prev.setUTCDate(d.getUTCDate() - 1);
    const next = new Date(d); next.setUTCDate(d.getUTCDate() + 1);
    prevHref = toISO(prev) === todayISO ? "/" : `/${formatDateURL(prev)}`;
    nextHref = toISO(next) === todayISO ? "/" : `/${formatDateURL(next)}`;
    prevLabel = `← Hier`;
    nextLabel = `Demain →`;
    // Navigable dans le futur jusqu'à l'horizon (diffusions programmées)
    canGoForward = contexte.dateISO < horizonISO;
    // Affiner avec les noms courts sauf pour hier/demain adjacents
    const diffPrev = (now.getTime() - prev.getTime()) / 86400000;
    const diffNext = (next.getTime() - now.getTime()) / 86400000;
    if (diffPrev > 1) prevLabel = `← ${formatDateFR(prev).split(" ").slice(0, 2).join(" ")}`;
    if (diffNext > 1) nextLabel = `${formatDateFR(next).split(" ").slice(0, 2).join(" ")} →`;
  } else if (contexte.mode === "semaine") {
    const { semaine, annee } = contexte;
    navLabel = `Semaine du ${formatSemaineFR(semaine, annee)}`;
    navSub = `streamactu.fr/${formatSemaineURL(semaine, annee)}`;
    const prev = decalerSemaineISO(semaine, annee, -1);
    const next = decalerSemaineISO(semaine, annee, 1);
    prevHref = `/${formatSemaineURL(prev.semaine, prev.annee)}`;
    nextHref = `/${formatSemaineURL(next.semaine, next.annee)}`;
    prevLabel = "← Semaine préc.";
    nextLabel = "Semaine suiv. →";
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
    prevLabel = `← ${MOIS_COURTS[mP]}`;
    nextLabel = `${MOIS_COURTS[mS]} →`;
    canGoForward =
      annee < anneeAujourdMois ||
      (annee === anneeAujourdMois && mois < moisAujourd);
  }

  const isAujourd = contexte.mode === "jour" && contexte.dateISO === todayISO;
  const isSemaine = contexte.mode === "semaine";
  const isMois = contexte.mode === "mois";

  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      {/* Onglets temporels */}
      <div className="flex gap-1">
        {[
          { label: "Aujourd'hui", active: isAujourd, href: "/" },
          { label: "Cette semaine", active: isSemaine, href: semaineCouranteURL },
          { label: "Ce mois", active: isMois, href: moisCourantURL },
        ].map((tab) => (
          <Link
            key={tab.label}
            href={tab.href}
            aria-current={tab.active ? "page" : undefined}
            className="px-4 py-2.5 text-sm font-semibold transition-colors"
            style={{
              background: tab.active ? "#ECE6D8" : "transparent",
              color: tab.active ? "#16140F" : "#9A9282",
            }}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Navigation contextuelle */}
      <div className="flex items-center gap-5">
        <Link
          href={prevHref}
          className="font-mono text-sm text-[#9A9282] hover:text-foreground transition-colors whitespace-nowrap"
        >
          {prevLabel}
        </Link>
        <div className="text-center min-w-0">
          <div className="font-bold leading-tight text-base">{navLabel}</div>
          <div className="font-mono text-[10px] text-ink-4 mt-0.5">{navSub}</div>
        </div>
        {canGoForward ? (
          <Link
            href={nextHref}
            className="font-mono text-sm text-[#9A9282] hover:text-foreground transition-colors whitespace-nowrap"
          >
            {nextLabel}
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className="font-mono text-sm text-[#9A9282] opacity-20 cursor-not-allowed whitespace-nowrap"
          >
            {nextLabel}
          </span>
        )}
      </div>
    </div>
  );
}
