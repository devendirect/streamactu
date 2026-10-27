"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { GoogleAnalytics } from "@next/third-parties/google";
import { CLE_CONSENT as CLE } from "@/lib/ga";

type Choix = "granted" | "denied";
/** null : pas de choix enregistré → bannière affichée */
type Etat = Choix | null;
const EVT_CHANGE = "sa-consent-change";

function getSnapshot(): Etat {
  const lu = localStorage.getItem(CLE);
  return lu === "granted" || lu === "denied" ? lu : null;
}

function subscribe(cb: () => void) {
  window.addEventListener(EVT_CHANGE, cb);
  return () => window.removeEventListener(EVT_CHANGE, cb);
}

function enregistrer(choix: Choix | null) {
  if (choix === null) {
    localStorage.removeItem(CLE);
  } else {
    localStorage.setItem(CLE, choix);
  }
  window.dispatchEvent(new Event(EVT_CHANGE));
}

/** Expire les cookies Google Analytics (_ga, _ga_*) après un retrait de consentement */
function supprimerCookiesGA() {
  for (const cookie of document.cookie.split(";")) {
    const nom = cookie.split("=")[0].trim();
    if (nom === "_ga" || nom.startsWith("_ga_")) {
      document.cookie = `${nom}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${location.hostname}`;
      document.cookie = `${nom}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
  }
}

/**
 * Bannière de consentement CNIL + chargement conditionnel de Google Analytics.
 * Le tag n'est monté qu'après un accord explicite — aucun hit, aucun cookie
 * avant. Refuser est aussi simple qu'accepter (boutons identiques), et le
 * choix se retire via « Gérer les cookies » dans le footer.
 */
export default function ConsentAnalytics({ gaId }: { gaId: string }) {
  // undefined pendant le SSR et l'hydratation : rien n'est rendu, ni bannière
  // ni tag — pas de décalage d'hydratation ni de flash.
  const choix = useSyncExternalStore<Etat | undefined>(
    subscribe,
    getSnapshot,
    () => undefined
  );

  const decider = (c: Choix) => {
    if (c === "denied") supprimerCookiesGA();
    enregistrer(c);
  };

  return (
    <>
      {choix === "granted" && <GoogleAnalytics gaId={gaId} />}
      {choix === null && (
        <div
          role="dialog"
          aria-label="Consentement à la mesure d'audience"
          className="fixed inset-x-gouttiere bottom-4 z-[100] mx-auto max-w-[760px] rounded-2xl border border-trait bg-surface-2 shadow-[0_30px_80px_rgba(0,0,0,0.5)] max-[760px]:bottom-[calc(84px+env(safe-area-inset-bottom))]"
        >
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 p-[18px]">
            <p className="min-w-[30ch] flex-1 text-sm leading-relaxed text-texte-doux">
              StreamActu.fr souhaite mesurer son audience avec Google Analytics.
              Rien n&apos;est collecté sans votre accord, et refuser ne change rien
              à votre navigation.{" "}
              <Link href="/mentions-legales#rgpd" className="text-white underline decoration-ambre/60 underline-offset-4 hover:decoration-ambre">
                En savoir plus
              </Link>
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => decider("denied")}
                className="inline-flex h-11 items-center rounded-lg bg-white/10 px-5 font-bold transition-colors duration-200 hover:bg-white/20"
              >
                Refuser
              </button>
              <button
                type="button"
                onClick={() => decider("granted")}
                className="inline-flex h-11 items-center rounded-lg bg-white/10 px-5 font-bold transition-colors duration-200 hover:bg-white/20"
              >
                Accepter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** Lien du footer : efface le choix et rouvre la bannière (retrait du consentement) */
export function BoutonGererCookies({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => enregistrer(null)}
      className={className ?? "text-sm text-texte-2 transition-colors duration-200 hover:text-texte"}
    >
      Gérer les cookies
    </button>
  );
}
