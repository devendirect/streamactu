"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import FeuxCanvas from "@/components/nouvelan/FeuxCanvas";
import { Particules } from "@/components/saison/Briques";
import { abonner, effetsActifs, effetsActifsServeur } from "@/components/saison/effets";
import { decalageHeure, etatNouvelAn, texteRestant } from "@/lib/nouvelan";

type Mode = "avant" | "final" | "arrivee" | "calme";

/**
 * Nouvel An dans le hero : compte à rebours réel jusqu'à minuit à Paris (lib/nouvelan.ts), puis
 * feux d'artifice.
 *  - avant minuit : ciel calme, étoiles et compte à rebours (pas de feux : la surprise est pour minuit) ;
 *  - minuit passé pendant que la page est ouverte : grand bouquet d'une minute et « Bonne année » ;
 *  - arrivée après minuit : court bouquet de 10 s, puis calme, avec le message dans la pastille.
 * Mouvement réduit : le texte reste, les feux et les vœux animés sont masqués (app/nouvelan.css).
 * Aperçu : ?saison=nouvelan&heure=2026-12-31T23:59:50 (heure de Paris).
 */
export default function CalqueNouvelAn() {
  const effets = useSyncExternalStore(abonner, effetsActifs, effetsActifsServeur);
  // Décalage d'aperçu lu une fois à l'arrivée ; 0 en temps normal
  const [decalage] = useState(() => decalageHeure(window.location.search, Date.now()));
  const [maintenant, setMaintenant] = useState(() => Date.now() + decalage);
  const [mode, setMode] = useState<Mode>(() => (etatNouvelAn(new Date(Date.now() + decalage)).phase === "apres" ? "arrivee" : "avant"));

  // Horloge : une fois par seconde ; passe en « final » à l'instant où minuit tombe
  useEffect(() => {
    const id = window.setInterval(() => {
      const t = Date.now() + decalage;
      setMaintenant(t);
      if (etatNouvelAn(new Date(t)).phase === "apres") setMode((m) => (m === "avant" ? "final" : m));
    }, 1000);
    return () => window.clearInterval(id);
  }, [decalage]);

  // Les feux s'éteignent : 60 s pour le grand final, 10 s pour une arrivée après minuit
  useEffect(() => {
    if (mode !== "final" && mode !== "arrivee") return;
    const id = window.setTimeout(() => setMode("calme"), mode === "final" ? 60000 : 10000);
    return () => window.clearTimeout(id);
  }, [mode]);

  const etat = etatNouvelAn(new Date(maintenant));
  const texte = mode === "avant" ? `Bonne année dans ${texteRestant(etat.restant)}` : `Bonne année ${etat.annee} !`;

  return (
    <>
      <div className="calque-etoiles" />
      {mode === "final" && <div className="voeux-na">Bonne année {etat.annee} !</div>}
      {effets && (mode === "final" || mode === "arrivee") && <FeuxCanvas intensite={mode === "final" ? "final" : "arrivee"} />}
      {mode === "final" && <Particules evenement nom="conf" n={44} couleurs={["#FFD75E", "#fff3c4", "#e8e8f0", "#ff6b8b", "#6bd5ff"]} taille={[8, 14]} duree={[6, 11]} graine={2027} derive={[-90, 90]} rot={[360, 1080]} />}
      {/* Un seul libellé annoncé : l'horloge change chaque seconde, elle ne doit pas être lue à chaque tick */}
      <div className="pastille-na" role="timer" aria-live="off" aria-label={mode === "avant" ? "Compte à rebours avant le Nouvel An" : texte}>
        <span aria-hidden="true">✦</span> {texte}
      </div>
    </>
  );
}
