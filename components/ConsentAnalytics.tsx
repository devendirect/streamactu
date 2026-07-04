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
          className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-background"
        >
          <div className="sa-container py-4 flex items-center justify-between gap-x-6 gap-y-3 flex-wrap">
            <p className="text-sm text-[#C4BBA9] leading-relaxed flex-1 min-w-[30ch]">
              StreamActu.fr souhaite mesurer son audience avec Google Analytics.
              Rien n&apos;est collecté sans votre accord, et refuser ne change rien
              à votre navigation.{" "}
              <Link href="/mentions-legales#rgpd" className="underline hover:text-foreground transition-colors">
                En savoir plus
              </Link>
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => decider("denied")}
                className="font-mono-label px-5 py-2.5 border border-border text-foreground hover:border-primary transition-colors"
              >
                Refuser
              </button>
              <button
                type="button"
                onClick={() => decider("granted")}
                className="font-mono-label px-5 py-2.5 border border-border text-foreground hover:border-primary transition-colors"
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
export function BoutonGererCookies() {
  return (
    <button
      type="button"
      onClick={() => enregistrer(null)}
      className="font-mono-label text-ink-3 hover:text-foreground transition-colors"
    >
      Gérer les cookies
    </button>
  );
}
