"use client";
import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Image d'une carte cachée à droite d'une rangée : elle n'existe qu'une fois
 * la carte près de la partie visible de la rangée. Le `loading="lazy"` de
 * Chrome ne regarde que la hauteur : il chargeait les 12 affiches de chaque
 * rangée du haut de page (mesuré le 29/10 : 63 affiches sur l'accueil pour
 * 2 ou 3 visibles par rangée sur téléphone). Ensuite, le lazy du navigateur
 * reprend la main pour la hauteur. Sans JavaScript : l'image en <noscript>.
 */
export default function ImageDifferee(props: ImageProps & { src: string }) {
  const repere = useRef<HTMLSpanElement>(null);
  const [proche, setProche] = useState(false);

  useEffect(() => {
    const el = repere.current;
    if (!el) return;
    const observateur = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setProche(true);
          observateur.disconnect();
        }
      },
      // Racine : la piste de la rangée ; une demi-largeur d'avance au défilement
      { root: el.closest(".rangee__piste"), rootMargin: "0px 50%" }
    );
    observateur.observe(el);
    return () => observateur.disconnect();
  }, []);

  if (proche) return <Image {...props} alt={props.alt} loading="lazy" />;
  return (
    <span ref={repere} className="absolute inset-0">
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={props.src} alt={props.alt} loading="lazy" className="size-full object-cover" />
      </noscript>
    </span>
  );
}
