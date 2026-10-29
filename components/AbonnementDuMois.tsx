"use client";

import { useEffect, useMemo, useState } from "react";
import type { ElementListe } from "@/lib/use-ma-liste";
import { PLATEFORMES, PLATEFORME_PAR_ID } from "@/lib/plateformes";
import { EVENEMENT_ABONNEMENTS, ecrireAbonnements, lireAbonnements } from "@/lib/abonnements";
import { PRIX_ABONNEMENTS, PRIX_RELEVES_LE, formatPrix } from "@/lib/prix-abonnements";
import { planRotation, type ChoixPlateforme } from "@/lib/rotation";
import { formatDateFR, toISO } from "@/lib/utils";
import PastillePlateforme from "@/components/PastillePlateforme";

/** Comme la route /api/dispo-liste : les titres ajoutés le plus récemment d'abord */
const MAX_TITRES = 60;
const ORDRE = PLATEFORMES.map((p) => p.id);
const PRIX = Object.fromEntries(Object.entries(PRIX_ABONNEMENTS).map(([id, p]) => [id, p!.prix]));

type Dispos = Record<string, { plateformes: number[]; prochainEpisode: string | null }>;

const pluriel = (n: number, mot: string) => `${n} ${mot}${n > 1 ? "s" : ""}`;

/**
 * « Quel abonnement ce mois-ci ? » : croise les titres à voir de Ma liste
 * (déjà vus exclus) avec leurs plateformes en France et les abonnements
 * cochés. Tout se calcule dans le navigateur ; seule la liste des titres
 * part vers /api/dispo-liste, qui ne l'enregistre pas.
 */
export default function AbonnementDuMois({ liste }: { liste: ElementListe[] }) {
  const [abonnements, setAbonnements] = useState<number[]>([]);
  const [dispos, setDispos] = useState<{ cle: string; donnees: Dispos } | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setAbonnements(lireAbonnements());
    sync();
    window.addEventListener(EVENEMENT_ABONNEMENTS, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENEMENT_ABONNEMENTS, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const aVoir = useMemo(
    () => liste.filter((e) => !e.vu).sort((a, b) => (a.ajouteLe < b.ajouteLe ? 1 : -1)).slice(0, MAX_TITRES),
    [liste]
  );
  // Ne redemande les disponibilités que si l'ensemble des titres change
  const cleDemande = aVoir.map((e) => `${e.type}-${e.id}`).sort().join(",");

  useEffect(() => {
    if (!cleDemande) return;
    let annule = false;
    fetch("/api/dispo-liste", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titres: cleDemande.split(",").map((c) => {
          const [type, id] = c.split("-");
          return { type, id: Number(id) };
        }),
      }),
    })
      .then((r) => {
        if (!r.ok) throw new Error(r.status === 429 ? "Trop de calculs d'affilée : réessayez dans une minute." : "");
        return r.json() as Promise<Dispos>;
      })
      .then((donnees) => {
        if (annule) return;
        setDispos({ cle: cleDemande, donnees });
        setErreur(null);
      })
      .catch((e: Error) => {
        if (!annule) setErreur(e.message || "Les disponibilités ne répondent pas pour le moment.");
      });
    return () => {
      annule = true;
    };
  }, [cleDemande]);

  if (aVoir.length === 0) return null;

  const aujourdhui = toISO(new Date());
  const mois = new Date().toLocaleDateString("fr-FR", { month: "long" });
  const titreDe = Object.fromEntries(aVoir.map((e) => [`${e.type}-${e.id}`, e.titre]));
  const pret = dispos?.cle === cleDemande;
  const plan = pret
    ? planRotation(
        aVoir
          .filter((e) => dispos.donnees[`${e.type}-${e.id}`])
          .map((e) => {
            const d = dispos.donnees[`${e.type}-${e.id}`];
            return {
              cle: `${e.type}-${e.id}`,
              plateformes: d.plateformes,
              episodeCeMois: !!d.prochainEpisode && d.prochainEpisode.slice(0, 7) === aujourdhui.slice(0, 7),
            };
          }),
        abonnements,
        ORDRE,
        PRIX
      )
    : null;

  const basculer = (id: number) =>
    ecrireAbonnements(abonnements.includes(id) ? abonnements.filter((x) => x !== id) : [...abonnements, id]);

  const titres = (c: ChoixPlateforme) => {
    const noms = c.cles.map((k) => titreDe[k]).filter(Boolean);
    return noms.length > 4 ? `${noms.slice(0, 4).join(", ")}…` : noms.join(", ");
  };
  const prix = (id: number) => {
    const p = PRIX_ABONNEMENTS[id];
    if (!p) return "";
    // Canal+ : l'offre la moins chère ne donne pas tout, on montre les deux
    if (p.complete) {
      return ` ${formatPrix(p.prix)} par mois avec ${p.offre} (sans les ${p.complete.manque}), ${formatPrix(p.complete.prix)} avec ${p.complete.offre}.`;
    }
    return ` Dès ${formatPrix(p.prix)} par mois (${p.offre}).`;
  };

  const [ceMois, ...ensuite] = plan?.aPrendre ?? [];

  return (
    <section aria-labelledby="h-abonnement-mois" className="mb-section rounded-lg border border-trait bg-surface p-[clamp(18px,2.4vw,28px)]">
      <h2 id="h-abonnement-mois" className="text-[clamp(20px,2vw,26px)] leading-tight font-extrabold tracking-[-0.02em]">
        Quel abonnement en {mois}&nbsp;?
      </h2>
      <p className="mt-1.5 max-w-[68ch] text-[15px] text-texte-2">
        D&apos;après les {pluriel(aVoir.length, "titre")} à voir de votre liste (les titres marqués comme vus ne comptent pas) et
        les abonnements que vous avez.
      </p>

      <div role="group" aria-label="Mes abonnements" className="mt-4 flex flex-wrap gap-1.5">
        {PLATEFORMES.map((p) => (
          <button key={p.id} type="button" aria-pressed={abonnements.includes(p.id)} onClick={() => basculer(p.id)} className="puce">
            <PastillePlateforme pf={p} />
          </button>
        ))}
      </div>

      <div aria-live="polite" className="mt-5 max-w-[72ch] space-y-3 text-[15.5px] leading-[1.55] text-texte-doux">
        {erreur && !pret && <p>{erreur}</p>}
        {!erreur && !pret && <p className="text-texte-2">Calcul en cours…</p>}
        {plan && (
          <>
            {ceMois && (
              <p>
                <span className="font-bold text-texte">À prendre en {mois} :</span>{" "}
                <PastillePlateforme pf={PLATEFORME_PAR_ID[ceMois.id]} className="font-semibold text-texte" />,{" "}
                {pluriel(ceMois.cles.length, "titre")} de votre liste ({titres(ceMois)})
                {ceMois.avecEpisode > 0 && `, dont ${ceMois.avecEpisode} avec un nouvel épisode ce mois-ci`}.{prix(ceMois.id)}
              </p>
            )}
            {plan.aGarder.length > 0 && (
              <p>
                <span className="font-bold text-texte">À garder :</span>{" "}
                {plan.aGarder.map((c, i) => (
                  <span key={c.id}>
                    {i > 0 && ", "}
                    <PastillePlateforme pf={PLATEFORME_PAR_ID[c.id]} /> ({pluriel(c.cles.length, "titre")})
                  </span>
                ))}
                .
              </p>
            )}
            {plan.enPause.length > 0 && (
              <p>
                <span className="font-bold text-texte">Vous pouvez mettre en pause :</span>{" "}
                {plan.enPause.map((id, i) => (
                  <span key={id}>
                    {i > 0 && ", "}
                    <PastillePlateforme pf={PLATEFORME_PAR_ID[id]} />
                  </span>
                ))}
                , aucun titre de votre liste n&apos;y est.
              </p>
            )}
            {ensuite.length > 0 && (
              <p>
                <span className="font-bold text-texte">Les mois suivants :</span>{" "}
                {ensuite.map((c, i) => (
                  <span key={c.id}>
                    {i > 0 && ", puis "}
                    <PastillePlateforme pf={PLATEFORME_PAR_ID[c.id]} /> ({pluriel(c.cles.length, "titre")})
                  </span>
                ))}
                .
              </p>
            )}
            {!ceMois && plan.aGarder.length > 0 && <p>Vos abonnements couvrent tous les titres disponibles de votre liste.</p>}
            {plan.nullePart.length > 0 && (
              <p className="text-texte-2">
                {plan.nullePart.length > 1
                  ? `${plan.nullePart.length} titres ne sont inclus dans aucun abonnement suivi`
                  : "1 titre n'est inclus dans aucun abonnement suivi"}{" "}
                ({plan.nullePart.map((k) => titreDe[k]).slice(0, 4).join(", ")}
                {plan.nullePart.length > 4 ? "…" : ""}) : location, achat ou plateforme non suivie.
              </p>
            )}
          </>
        )}
      </div>

      <p className="mt-5 text-[13px] text-texte-2">
        Disponibilités en France : JustWatch via TMDB. Nouvel épisode : date de diffusion d&apos;origine. Prix : offre la moins
        chère, hors promotion, relevés le {formatDateFR(PRIX_RELEVES_LE)} sur les sites officiels
        {ORDRE.some((id) => !PRIX_ABONNEMENTS[id]) ? " (pas encore relevé pour toutes les plateformes)" : ""}.
      </p>
    </section>
  );
}
