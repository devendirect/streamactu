"use client";

import { useRouter } from "next/navigation";
import type { ContexteTemporel } from "@/types";
import {
  toISO,
  formatDateFR,
  formatDateURL,
  formatJourSemaineFR,
  formatSemaineURL,
  formatSemaineFR,
  formatMoisURL,
  formatMoisFR,
  getISOWeek,
} from "@/lib/utils";

const MOIS_COURTS = ["", "Jan.", "Fév.", "Mar.", "Avr.", "Mai", "Juin", "Juil.", "Août", "Sep.", "Oct.", "Nov.", "Déc."];

interface Props {
  contexte: ContexteTemporel;
}

export default function NavigationTemporelle({ contexte }: Props) {
  const router = useRouter();
  const now = new Date();
  const todayISO = toISO(now);
  const { semaine: semaineAujourd, annee: anneeAujourdSem } = getISOWeek(now);
  const moisAujourd = now.getUTCMonth() + 1;
  const anneeAujourdMois = now.getUTCFullYear();

  // URLs des onglets
  const semaineCouranteURL = `/${formatSemaineURL(semaineAujourd, anneeAujourdSem)}`;
  const moisCourantURL = `/${formatMoisURL(moisAujourd, anneeAujourdMois)}`;

  function goJour(delta: number) {
    if (contexte.mode !== "jour") return;
    const d = new Date(contexte.dateISO + "T12:00:00Z");
    d.setUTCDate(d.getUTCDate() + delta);
    const iso = toISO(d);
    router.push(iso === todayISO ? "/" : `/${formatDateURL(d)}`);
  }

  function goSemaine(delta: number) {
    if (contexte.mode !== "semaine") return;
    let { semaine, annee } = contexte;
    semaine += delta;
    if (semaine < 1) { annee--; semaine = 52; }
    else if (semaine > 53) { annee++; semaine = 1; }
    router.push(`/${formatSemaineURL(semaine, annee)}`);
  }

  function goMois(delta: number) {
    if (contexte.mode !== "mois") return;
    let { mois, annee } = contexte;
    mois += delta;
    if (mois < 1) { annee--; mois = 12; }
    else if (mois > 12) { annee++; mois = 1; }
    router.push(`/${formatMoisURL(mois, annee)}`);
  }

  // Infos de navigation selon le mode
  let navLabel = "";
  let navSub = "";
  let prevLabel = "";
  let nextLabel = "";
  let canGoForward = false;
  let goPrev = () => {};
  let goNext = () => {};

  if (contexte.mode === "jour") {
    const d = new Date(contexte.dateISO + "T12:00:00Z");
    navLabel = formatJourSemaineFR(d);
    navSub = `streamactu.fr/${formatDateURL(d)}`;
    const prev = new Date(d); prev.setUTCDate(d.getUTCDate() - 1);
    const next = new Date(d); next.setUTCDate(d.getUTCDate() + 1);
    prevLabel = `← Hier`;
    nextLabel = `Demain →`;
    canGoForward = contexte.dateISO < todayISO;
    goPrev = () => goJour(-1);
    goNext = () => goJour(1);
    // Affiner avec les noms courts sauf pour hier/demain adjacents
    const diffPrev = (now.getTime() - prev.getTime()) / 86400000;
    const diffNext = (next.getTime() - now.getTime()) / 86400000;
    if (diffPrev > 1) prevLabel = `← ${formatDateFR(prev).split(" ").slice(0, 2).join(" ")}`;
    if (diffNext > 1) nextLabel = `${formatDateFR(next).split(" ").slice(0, 2).join(" ")} →`;
  } else if (contexte.mode === "semaine") {
    const { semaine, annee } = contexte;
    navLabel = `Semaine du ${formatSemaineFR(semaine, annee)}`;
    navSub = `streamactu.fr/${formatSemaineURL(semaine, annee)}`;
    prevLabel = "← Semaine préc.";
    nextLabel = "Semaine suiv. →";
    canGoForward =
      annee < anneeAujourdSem ||
      (annee === anneeAujourdSem && semaine < semaineAujourd);
    goPrev = () => goSemaine(-1);
    goNext = () => goSemaine(1);
  } else {
    const { mois, annee } = contexte;
    navLabel = formatMoisFR(mois, annee);
    navSub = `streamactu.fr/${formatMoisURL(mois, annee)}`;
    const mP = mois === 1 ? 12 : mois - 1;
    const mS = mois === 12 ? 1 : mois + 1;
    prevLabel = `← ${MOIS_COURTS[mP]}`;
    nextLabel = `${MOIS_COURTS[mS]} →`;
    canGoForward =
      annee < anneeAujourdMois ||
      (annee === anneeAujourdMois && mois < moisAujourd);
    goPrev = () => goMois(-1);
    goNext = () => goMois(1);
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
          <button
            key={tab.label}
            onClick={() => router.push(tab.href)}
            className="px-4 py-2.5 text-sm font-semibold transition-colors"
            style={{
              background: tab.active ? "#ECE6D8" : "transparent",
              color: tab.active ? "#16140F" : "#9A9282",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Navigation contextuelle */}
      <div className="flex items-center gap-5">
        <button
          onClick={goPrev}
          className="font-mono text-sm text-[#9A9282] hover:text-foreground transition-colors whitespace-nowrap"
        >
          {prevLabel}
        </button>
        <div className="text-center min-w-0">
          <div className="font-bold leading-tight text-base">{navLabel}</div>
          <div className="font-mono text-[10px] text-[#4A4437] mt-0.5">{navSub}</div>
        </div>
        <button
          onClick={goNext}
          disabled={!canGoForward}
          className="font-mono text-sm text-[#9A9282] hover:text-foreground disabled:opacity-20 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
        >
          {nextLabel}
        </button>
      </div>
    </div>
  );
}
