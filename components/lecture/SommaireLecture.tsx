"use client";
import { useEffect, useState } from "react";

/**
 * Sommaire collant des pages de lecture : il suit la section lue (texte
 * blanc gras, sans barre de couleur). Sous 980 px, une ligne de pilules.
 */
export default function SommaireLecture({ liens, titre = "Sommaire" }: { liens: { id: string; label: string }[]; titre?: string }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entrees) => entrees.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-30% 0px -60% 0px" }
    );
    liens.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [liens]);

  if (liens.length === 0) return <div />;

  return (
    <nav aria-label={titre} className="sommaire">
      <h2 className="libelle mb-2.5 text-texte-2 max-[980px]:sr-only">{titre}</h2>
      <ul className="sommaire__liens">
        {liens.map(({ id, label }) => (
          <li key={id}>
            <a href={`#${id}`} aria-current={active === id ? "true" : undefined}>
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
