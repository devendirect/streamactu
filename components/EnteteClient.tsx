"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Icone from "@/components/Icone";
import { Repere, Symbole, Wordmark } from "@/components/Logo";
import PastillePlateforme from "@/components/PastillePlateforme";
import { PLATEFORMES } from "@/lib/plateformes";

export type LienEntete = { href: string; label: string; prefixe?: string } | { menu: "plateformes" };

/** Page courante : égalité stricte, ou préfixe pour les rubriques à sous-pages */
export function estCourant(pathname: string, href: string, prefixe?: string): boolean {
  return pathname === href || (prefixe !== undefined && pathname.startsWith(prefixe));
}

function surPlateforme(pathname: string): boolean {
  const premier = pathname.split("/")[1];
  return PLATEFORMES.some((pf) => pf.slug === premier);
}

const LIEN_NAV = "inline-flex items-center gap-1 py-2 text-texte-doux transition-colors duration-200 hover:text-white aria-[current=page]:font-bold aria-[current=page]:text-white";
const ACTION = "grid size-[42px] place-items-center rounded-full transition-colors duration-200 hover:bg-white/10 aria-[current=page]:text-ambre";

export default function EnteteClient({ liens }: { liens: LienEntete[] }) {
  const pathname = usePathname();
  const [colle, setColle] = useState(false);
  // Menu ouvert sur une page donnée : il se referme de lui-même quand on en change
  const [menuOuvertSur, setMenuOuvertSur] = useState<string | null>(null);
  const menuOuvert = menuOuvertSur === pathname;
  const setMenuOuvert = (ouvert: boolean) => setMenuOuvertSur(ouvert ? pathname : null);
  const menuRef = useRef<HTMLDivElement>(null);
  const boutonRef = useRef<HTMLButtonElement>(null);

  // Fondu transparent en haut de page, verre sombre dès qu'on défile
  useEffect(() => {
    const suivre = () => setColle(window.scrollY > 30);
    suivre();
    window.addEventListener("scroll", suivre, { passive: true });
    return () => window.removeEventListener("scroll", suivre);
  }, []);

  useEffect(() => {
    if (!menuOuvert) return;
    const dehors = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOuvertSur(null);
    };
    const echap = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOuvertSur(null);
        boutonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", dehors);
    document.addEventListener("keydown", echap);
    return () => {
      document.removeEventListener("pointerdown", dehors);
      document.removeEventListener("keydown", echap);
    };
  }, [menuOuvert]);

  const courant = (href: string, prefixe?: string) => (estCourant(pathname, href, prefixe) ? "page" : undefined);

  return (
    <header
      data-entete
      className={`fixed inset-x-0 top-0 z-50 flex h-entete items-center gap-[34px] px-gouttiere transition-[background-color,box-shadow,backdrop-filter] duration-400 ${
        colle
          ? "bg-[rgba(18,18,20,0.72)] shadow-[0_1px_0_var(--sa-trait)] backdrop-blur-[20px] backdrop-saturate-[1.6]"
          : "bg-linear-to-b from-[rgba(10,10,11,0.75)] to-transparent"
      }`}
    >
      <Link
        href="/"
        aria-label="StreamActu.fr, accueil"
        className="flex flex-none items-center gap-2 [--sa-logo-encre:var(--sa-texte)] [--sa-logo-gris:#C9C3B5]"
      >
        <span className="flex max-[760px]:hidden">
          <Repere taille={38} />
        </span>
        <span className="hidden max-[760px]:flex">
          <Symbole taille={30} />
        </span>
        <span className="flex [&>svg]:h-[34px] [&>svg]:w-auto max-[760px]:[&>svg]:h-[22px]">
          <Wordmark hauteur={34} renforce />
        </span>
      </Link>

      <nav aria-label="Navigation principale" className="flex gap-6 text-[15px] font-medium max-[1020px]:hidden">
        {liens.map((l) =>
          "menu" in l ? (
            <div key="plateformes" ref={menuRef} className="relative">
              <button
                ref={boutonRef}
                type="button"
                aria-expanded={menuOuvert}
                aria-controls="menu-plateformes"
                aria-current={surPlateforme(pathname) ? "page" : undefined}
                onClick={() => setMenuOuvert(!menuOuvert)}
                className={LIEN_NAV}
              >
                Plateformes
                <Icone
                  nom="bas"
                  taille={16}
                  className={`transition-transform duration-300 ease-salle ${menuOuvert ? "rotate-180" : ""}`}
                />
              </button>
              <div
                id="menu-plateformes"
                hidden={!menuOuvert}
                className="absolute top-[calc(100%+10px)] left-0 z-[70] min-w-[220px] rounded-lg border border-trait bg-surface p-2 shadow-[0_18px_40px_rgba(0,0,0,0.35)]"
              >
                {PLATEFORMES.map((pf) => (
                  <Link
                    key={pf.id}
                    href={`/${pf.slug}`}
                    aria-current={pathname.split("/")[1] === pf.slug ? "page" : undefined}
                    className="flex items-center rounded-md px-3 py-[9px] text-[15px] transition-colors duration-200 hover:bg-white/[0.08] aria-[current=page]:font-bold"
                  >
                    <PastillePlateforme pf={pf} />
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Link key={l.href} href={l.href} aria-current={courant(l.href, l.prefixe)} className={LIEN_NAV}>
              {l.label}
            </Link>
          )
        )}
      </nav>

      <div className="ml-auto flex items-center gap-1.5">
        <Link href="/recherche" aria-label="Rechercher" aria-current={courant("/recherche")} className={ACTION}>
          <Icone nom="recherche" taille={22} />
        </Link>
        <Link
          href="/surprise"
          aria-label="À la surprise"
          aria-current={courant("/surprise")}
          className={`${ACTION} max-[760px]:hidden`}
        >
          <Icone nom="de" taille={22} />
        </Link>
        <Link
          href="/jeux"
          aria-label="Jeux"
          aria-current={courant("/jeux")}
          className={`${ACTION} max-[760px]:hidden`}
        >
          <Icone nom="jeu" taille={22} />
        </Link>
      </div>
    </header>
  );
}
