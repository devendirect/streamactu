"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import Icone, { type NomIcone } from "@/components/Icone";
import { estCourant } from "@/components/EnteteClient";
import PastillePlateforme from "@/components/PastillePlateforme";
import { PLATEFORMES } from "@/lib/plateformes";

type LienFeuille = { href: string; label: string; icone: NomIcone };

/**
 * Barre d'onglets mobile (sous 760 px) et feuille « Plus » : tout ce qui n'a
 * pas d'onglet. Les liens sont reçus du serveur (Tops de l'année, Actu
 * seulement si la rubrique est publiée).
 */
export default function BarreMobile({ explorer, plaisir }: { explorer: LienFeuille[]; plaisir: LienFeuille[] }) {
  const pathname = usePathname();
  // Feuille ouverte sur une page donnée : elle disparaît d'elle-même quand on en change
  const [ouverteSur, setOuverteSur] = useState<string | null>(null);
  const ouvert = ouverteSur === pathname;
  const [visible, setVisible] = useState(false);
  const boutonRef = useRef<HTMLButtonElement>(null);
  const boiteRef = useRef<HTMLDivElement>(null);
  const fermerRef = useRef<HTMLButtonElement>(null);
  const departGlisse = useRef<number | null>(null);

  const fermer = useCallback(() => {
    setVisible(false);
    const calme = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => setOuverteSur(null), calme ? 0 : 300);
    boutonRef.current?.focus({ preventScroll: true });
  }, []);

  const ouvrir = () => {
    setVisible(false);
    setOuverteSur(pathname);
    requestAnimationFrame(() => setVisible(true));
  };

  useEffect(() => {
    if (!ouvert) return;
    document.documentElement.classList.add("feuille-ouverte");
    fermerRef.current?.focus({ preventScroll: true });
    const clavier = (e: KeyboardEvent) => {
      if (e.key === "Escape") fermer();
      // Le focus reste dans la feuille tant qu'elle est ouverte
      if (e.key === "Tab" && boiteRef.current) {
        const elements = boiteRef.current.querySelectorAll<HTMLElement>("a[href], button");
        const premier = elements[0];
        const dernier = elements[elements.length - 1];
        if (e.shiftKey && document.activeElement === premier) {
          e.preventDefault();
          dernier.focus();
        } else if (!e.shiftKey && document.activeElement === dernier) {
          e.preventDefault();
          premier.focus();
        }
      }
    };
    document.addEventListener("keydown", clavier);
    return () => {
      document.removeEventListener("keydown", clavier);
      document.documentElement.classList.remove("feuille-ouverte");
    };
  }, [ouvert, fermer]);

  const onglet = (href: string, label: string, icone: NomIcone, prefixe?: string) => (
    <Link
      href={href}
      aria-current={estCourant(pathname, href, prefixe) ? "page" : undefined}
      className="flex flex-col items-center gap-[3px] py-1.5 text-[11px] font-semibold text-texte-2 aria-[current=page]:text-ambre"
    >
      <Icone nom={icone} taille={22} />
      {label}
    </Link>
  );

  return (
    <>
      <nav
        aria-label="Navigation mobile"
        className="fixed inset-x-0 bottom-0 z-[60] hidden grid-cols-5 border-t border-trait bg-[rgba(18,18,20,0.8)] px-1 pt-1.5 pb-[calc(6px+env(safe-area-inset-bottom))] backdrop-blur-[16px] max-[760px]:grid"
      >
        {onglet("/", "Accueil", "accueil")}
        {onglet("/prochaines-sorties", "À venir", "calendrier")}
        {onglet("/recherche", "Recherche", "recherche")}
        {onglet("/ma-liste", "Ma liste", "liste")}
        <button
          ref={boutonRef}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={ouvert}
          onClick={ouvrir}
          className="flex flex-col items-center gap-[3px] py-1.5 text-[11px] font-semibold text-texte-2"
        >
          <Icone nom="menu" taille={22} />
          Plus
        </button>
      </nav>

      {ouvert && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="feuille-titre"
          onClick={(e) => {
            if (e.target === e.currentTarget) fermer();
          }}
          className={`fixed inset-0 z-[110] flex items-end bg-black/60 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
        >
          <div
            ref={boiteRef}
            onTouchStart={(e) => {
              if (boiteRef.current?.scrollTop === 0) departGlisse.current = e.touches[0].clientY;
            }}
            onTouchMove={(e) => {
              if (departGlisse.current === null || !boiteRef.current) return;
              const dy = Math.max(0, e.touches[0].clientY - departGlisse.current);
              boiteRef.current.style.transform = `translateY(${dy}px)`;
            }}
            onTouchEnd={(e) => {
              if (departGlisse.current === null || !boiteRef.current) return;
              const dy = e.changedTouches[0].clientY - departGlisse.current;
              boiteRef.current.style.transform = "";
              departGlisse.current = null;
              // Glisser vers le bas pour fermer
              if (dy > 90) fermer();
            }}
            className={`max-h-[88vh] w-full overflow-y-auto overscroll-contain rounded-t-[22px] bg-surface px-5 pt-2 pb-[calc(24px+env(safe-area-inset-bottom))] transition-transform duration-[380ms] ease-salle ${
              visible ? "translate-y-0" : "translate-y-full"
            }`}
          >
            <div aria-hidden="true" className="mx-auto mt-1 mb-2.5 h-[5px] w-10 rounded-[3px] bg-white/25" />
            <div className="flex items-center justify-between">
              <h2 id="feuille-titre" className="text-[22px] font-extrabold">
                Plus
              </h2>
              <button
                ref={fermerRef}
                type="button"
                onClick={() => fermer()}
                aria-label="Fermer"
                className="grid size-10 place-items-center rounded-full bg-white/10"
              >
                <Icone nom="fermer" taille={20} />
              </button>
            </div>

            <h3 className="libelle mt-5 mb-2.5 text-texte-2">Plateformes</h3>
            <div className="flex flex-wrap gap-2">
              {PLATEFORMES.map((pf) => (
                <Link
                  key={pf.id}
                  href={`/${pf.slug}`}
                  className="inline-flex h-10 items-center rounded-full bg-white/[0.08] px-3.5 text-sm font-semibold"
                >
                  <PastillePlateforme pf={pf} />
                </Link>
              ))}
            </div>

            {[
              { titre: "Explorer", liens: explorer },
              { titre: "Pour le plaisir", liens: plaisir },
            ].map((g) => (
              <div key={g.titre}>
                <h3 className="libelle mt-5 mb-2.5 text-texte-2">{g.titre}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {g.liens.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="flex min-h-[54px] items-center gap-3 rounded-[14px] bg-white/[0.06] px-3.5 text-[15px] font-semibold transition-colors duration-200 active:bg-white/[0.12]"
                    >
                      <Icone nom={l.icone} taille={22} className="flex-none text-ambre" />
                      <span>{l.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <nav aria-label="Le site" className="mt-[22px] flex flex-wrap gap-x-[18px] gap-y-1.5 border-t border-trait pt-4">
              {[
                ["/a-propos", "À propos"],
                ["/contact", "Contact"],
                ["/mentions-legales", "Mentions légales"],
              ].map(([href, label]) => (
                <Link key={href} href={href} className="text-sm text-texte-2">
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
