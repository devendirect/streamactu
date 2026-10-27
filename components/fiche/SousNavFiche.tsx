"use client";
import { useEffect, useState } from "react";

/**
 * Sous-navigation collante de la fiche, sous l'en-tête : la section en cours
 * de lecture passe en surbrillance.
 */
export default function SousNavFiche({ ancres }: { ancres: { id: string; label: string }[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entrees) => entrees.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ancres.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [ancres]);

  return (
    <nav
      aria-label="Sections de la fiche"
      className="sticky top-entete z-40 mb-[clamp(30px,4vw,48px)] flex gap-1.5 overflow-x-auto border-b border-trait bg-[rgba(10,10,11,0.86)] px-gouttiere py-2.5 backdrop-blur-[16px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {ancres.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          aria-current={active === id ? "true" : undefined}
          className="inline-flex h-9 flex-none items-center rounded-full px-3.5 text-[14.5px] font-semibold text-texte-2 transition-colors duration-200 hover:text-white aria-[current=true]:bg-surface-2 aria-[current=true]:text-white"
        >
          {label}
        </a>
      ))}
    </nav>
  );
}
