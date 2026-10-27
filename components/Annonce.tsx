"use client";
import { useEffect, useRef, useState } from "react";

const EVENEMENT = "sa-annonce";

/** Affiche une courte confirmation en bas d'écran (« Ajouté à Ma liste ») */
export function annoncer(texte: string): void {
  window.dispatchEvent(new CustomEvent<string>(EVENEMENT, { detail: texte }));
}

/**
 * Annonce en pilule blanche, en bas d'écran (au-dessus de la barre mobile).
 * Montée une fois dans le layout ; lue par les lecteurs d'écran (role status).
 */
export default function Annonce() {
  const [texte, setTexte] = useState("");
  const [visible, setVisible] = useState(false);
  const minuteur = useRef<number | undefined>(undefined);

  useEffect(() => {
    const recevoir = (e: Event) => {
      setTexte((e as CustomEvent<string>).detail);
      setVisible(true);
      window.clearTimeout(minuteur.current);
      minuteur.current = window.setTimeout(() => setVisible(false), 2400);
    };
    window.addEventListener(EVENEMENT, recevoir);
    return () => {
      window.removeEventListener(EVENEMENT, recevoir);
      window.clearTimeout(minuteur.current);
    };
  }, []);

  return (
    <p
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed bottom-7 left-1/2 z-[120] -translate-x-1/2 rounded-full bg-texte px-[18px] py-3 text-sm font-semibold whitespace-nowrap text-fond transition-[opacity,translate] duration-[350ms] ease-salle max-[760px]:bottom-[88px] ${
        visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
      }`}
    >
      {texte}
    </p>
  );
}
