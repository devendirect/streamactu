"use client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { DiapoUne } from "@/lib/accueil";
import BoutonMaListe from "@/components/BoutonMaListe";
import Faisceau from "@/components/Faisceau";
import Icone from "@/components/Icone";
import { metaContenu } from "@/components/CarteAffiche";
import { hauteurLogo } from "@/lib/logo";

const DUREE = 8000;

/**
 * La une (signature, DESIGN.md) : carrousel plein écran de quatre titres sous
 * le faisceau du projecteur. Défilement automatique toutes les 8 s, en pause
 * au survol et au focus, arrêté sous prefers-reduced-motion. Toutes les
 * diapositives sont dans le HTML ; seule la première est visible sans
 * JavaScript.
 */
export default function UneCarrousel({ diapos }: { diapos: DiapoUne[] }) {
  const [actuelle, setActuelle] = useState(0);
  const [pause, setPause] = useState(false);
  const [calme, setCalme] = useState(false);
  // Change à chaque diapositive : relance le vacillement du projecteur et la barre de progression
  const [tour, setTour] = useState(0);
  const une = useRef<HTMLElement>(null);
  // Images des diapositives : la première d'emblée ; les suivantes une à une,
  // celle d'après dès que la page est chargée (8 s d'avance), pour ne pas
  // concurrencer la première (elles sont dans l'écran : « lazy » ne suffit pas)
  const [chargees, setChargees] = useState(1);

  const aller = useCallback(
    (n: number) => {
      const m = (n + diapos.length) % diapos.length;
      setActuelle(m);
      setTour((t) => t + 1);
      // La diapositive affichée et la suivante (saut par les points compris)
      setChargees((c) => Math.max(c, m + 2));
    },
    [diapos.length]
  );

  useEffect(() => {
    const requete = window.matchMedia("(prefers-reduced-motion: reduce)");
    const suivre = () => setCalme(requete.matches);
    suivre();
    requete.addEventListener("change", suivre);
    return () => requete.removeEventListener("change", suivre);
  }, []);

  useEffect(() => {
    const charger = () => setChargees((c) => Math.max(c, 2));
    if (document.readyState === "complete") charger();
    else window.addEventListener("load", charger, { once: true });
    return () => window.removeEventListener("load", charger);
  }, []);

  useEffect(() => {
    if (pause || calme || diapos.length < 2) return;
    const minuteur = window.setTimeout(() => aller(actuelle + 1), DUREE);
    return () => window.clearTimeout(minuteur);
  }, [actuelle, pause, calme, diapos.length, aller]);

  // Profondeur : le fond et le titre glissent en sens inverse sous la souris
  useEffect(() => {
    const el = une.current;
    if (!el || calme || !window.matchMedia("(hover: hover)").matches) return;
    const bouger = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--px", `${((e.clientX - r.left) / r.width - 0.5) * -26}px`);
      el.style.setProperty("--py", `${((e.clientY - r.top) / r.height - 0.5) * -16}px`);
    };
    el.addEventListener("mousemove", bouger);
    return () => el.removeEventListener("mousemove", bouger);
  }, [calme]);

  if (diapos.length === 0) return null;

  return (
    <section
      ref={une}
      aria-roledescription="carrousel"
      aria-label="À la une"
      onMouseEnter={() => setPause(true)}
      onMouseLeave={() => setPause(false)}
      onFocus={() => setPause(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPause(false);
      }}
      className={`une relative isolate h-[min(92vh,900px)] min-h-[560px] overflow-hidden max-[760px]:h-[76vh] max-[760px]:min-h-[520px] ${pause ? "en-pause" : ""}`}
      style={{ ["--duree" as string]: `${DUREE}ms` }}
    >
      {diapos.map((d, n) => {
        const { contenu, fond, logo, logoRatio, plateforme } = d;
        const active = n === actuelle;
        const images = n < chargees || n === actuelle;
        const fiche = `/${contenu.type}/${contenu.slug}`;
        return (
          <article
            key={`${contenu.type}-${contenu.id}`}
            aria-roledescription="diapositive"
            aria-label={`${n + 1} sur ${diapos.length}`}
            aria-hidden={!active}
            inert={!active}
            className={`une__diapo ${active ? "est-active" : ""}`}
          >
            <div className="une__fond">
              {fond && images && (
                <Image
                  src={fond}
                  alt=""
                  fill
                  sizes="100vw"
                  loading={n === 0 ? "eager" : "lazy"}
                  fetchPriority={n === 0 ? "high" : "low"}
                  className="object-cover object-[65%_20%] brightness-[0.72] saturate-[0.9]"
                />
              )}
            </div>
            <div className="une__contenu">
              <h2 className="une__logo">
                {logo && !images ? (
                  <span className="sr-only">{contenu.titre}</span>
                ) : logo ? (
                  // Logo PNG détouré, tailles variées : pas d'optimisation
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logo}
                    alt={contenu.titre}
                    width={500}
                    height={hauteurLogo(logoRatio)}
                    className="max-h-[180px] w-[min(440px,86%)] object-contain object-[left_bottom] drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
                  />
                ) : (
                  <span className="block max-w-[14ch] text-[clamp(40px,5vw,68px)] leading-[0.95] font-black tracking-[-0.03em]">
                    {contenu.titre}
                  </span>
                )}
              </h2>
              <div className="une__texte">
                <p className="mt-[18px] flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[15px] text-texte-doux">
                  <span className="rounded-[4px] bg-ambre px-[9px] py-[3px] text-[13px] font-extrabold text-sur-ambre">
                    {metaContenu(contenu)}
                  </span>
                  {plateforme && (
                    <span className="inline-flex items-center gap-1.5 font-semibold">
                      <span
                        aria-hidden="true"
                        className="size-2 rounded-full shadow-[0_0_0_1px_rgba(245,245,247,0.22)]"
                        style={{ background: plateforme.couleur }}
                      />
                      {plateforme.nom}
                    </span>
                  )}
                  {contenu.note > 0 && (
                    <span className="inline-flex items-center gap-1 font-bold text-white">
                      <Icone nom="etoile" taille={14} className="fill-current text-ambre" />
                      {contenu.note.toFixed(1).replace(".", ",")}
                      <span className="sr-only">sur 10</span>
                    </span>
                  )}
                  {contenu.genres[0] && <span>{contenu.genres[0].nom}</span>}
                </p>
                {contenu.synopsis && (
                  <p className="mt-3 line-clamp-3 max-w-[54ch] text-[clamp(15px,1.2vw,17px)] leading-[1.55] text-[#E2E2E6] max-[760px]:line-clamp-2">
                    {contenu.synopsis}
                  </p>
                )}
                <div className="mt-6 flex flex-wrap gap-2.5 max-[760px]:flex-nowrap">
                  <Link href={`${fiche}#ou-regarder`} className="btn-blanc">
                    {plateforme ? (
                      <span
                        aria-hidden="true"
                        className="size-3 rounded-full shadow-[0_0_0_1px_rgba(10,10,11,0.25)]"
                        style={{ background: plateforme.couleur }}
                      />
                    ) : (
                      <Icone nom="externe" taille={20} />
                    )}
                    Où regarder
                  </Link>
                  <Link href={fiche} className="btn-verre btn-verre--icone-mobile">
                    <Icone nom="info" taille={20} />
                    <span className="btn-verre__texte">Plus d&apos;infos</span>
                  </Link>
                  <BoutonMaListe contenu={contenu} variante="verre" />
                </div>
              </div>
            </div>
          </article>
        );
      })}

      {/* Deux classes identiques en alternance : l'animation repart à chaque diapositive sans remonter le faisceau */}
      <div aria-hidden="true" className={`une__lumiere ${tour === 0 ? "" : tour % 2 ? "vacille-a" : "vacille-b"}`}>
        <Faisceau />
      </div>

      {diapos.length > 1 && (
        <div role="group" aria-label="Choisir la diapositive" className="une__indicateurs">
          {diapos.map((d, n) => (
            <button
              key={n === actuelle ? `${n}-${tour}` : n}
              type="button"
              aria-label={d.contenu.titre}
              aria-current={n === actuelle}
              onClick={() => aller(n)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
