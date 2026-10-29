"use client";
import { useEffect, useRef, type RefObject } from "react";

// Point de départ du faisceau visé, en px depuis le coin haut gauche de la scène
const OX = 0;
const OY = -60;

/**
 * Faisceau du projecteur (signature, DESIGN.md) : cône chaud depuis le haut
 * gauche, qui s'allume en fondu, et poussière qui flotte dedans. La poussière
 * se met en pause hors écran et n'existe pas sous prefers-reduced-motion.
 * À poser dans un parent `relative isolate overflow-hidden` (la scène).
 * `cible` : exception de la page Surprise, le cône part toujours du coin
 * mais vise l'élément donné (l'affiche tirée) et s'éteint juste après lui.
 */
export default function Faisceau({ doux = false, cible }: { doux?: boolean; cible?: RefObject<HTMLElement | null> }) {
  const toile = useRef<HTMLCanvasElement>(null);
  const cone = useRef<HTMLDivElement>(null);
  // Visée courante, en degrés (sens de conic-gradient) et en px CSS
  const visee = useRef({ angle: 153, demi: 13, portee: 0 });

  // Visée : angle, demi-ouverture et portée calculés depuis la position de la cible
  useEffect(() => {
    const cv = toile.current;
    const el = cone.current;
    if (!cible || !cv || !el) return;
    const viser = () => {
      const r = cv.getBoundingClientRect();
      const c = cible.current?.getBoundingClientRect();
      if (!c || c.width === 0) return;
      const dx = c.left + c.width / 2 - r.left - OX;
      const dy = c.top + c.height / 2 - r.top - OY;
      const dist = Math.hypot(dx, dy);
      const angle = 180 - (Math.atan2(dx, dy) * 180) / Math.PI;
      const demi = (Math.atan((c.width * 0.8) / dist) * 180) / Math.PI;
      const portee = Math.hypot(dx, c.bottom - r.top - OY) + 40;
      visee.current = { angle, demi, portee };
      el.style.setProperty("--angle", `${angle}deg`);
      el.style.setProperty("--demi", `${demi}deg`);
      el.style.setProperty("--portee", `${portee}px`);
    };
    viser();
    // La scène change de taille au redimensionnement et au chargement des polices
    const obs = new ResizeObserver(viser);
    obs.observe(cv);
    return () => obs.disconnect();
  }, [cible]);

  useEffect(() => {
    const cv = toile.current;
    if (!cv || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let L = 0;
    let H = 0;
    let actif = false;
    let image = 0;
    const taille = () => {
      const r = cv.getBoundingClientRect();
      L = cv.width = r.width * devicePixelRatio;
      H = cv.height = r.height * devicePixelRatio;
    };
    taille();
    window.addEventListener("resize", taille);

    const grains = Array.from({ length: 80 }, () => ({
      d: Math.random(),
      // Place dans le cône : angle absolu (faisceau libre) ou écart à l'axe, de -1 à 1 (faisceau visé)
      a: ((140 + Math.random() * 26) * Math.PI) / 180,
      u: Math.random() * 2 - 1,
      v: 0.00012 + Math.random() * 0.0003,
      r: 0.6 + Math.random() * 1.6,
      p: Math.random() * 6.28,
    }));

    const boucle = (t: number) => {
      if (!actif) return;
      ctx.clearRect(0, 0, L, H);
      const { angle, demi, portee: porteeVisee } = visee.current;
      const portee = cible ? porteeVisee * devicePixelRatio : Math.hypot(L, H) * 0.95;
      const ox = cible ? OX * devicePixelRatio : L * 0.012;
      const oy = cible ? OY * devicePixelRatio : -H * 0.18;
      for (const g of grains) {
        g.d += g.v;
        if (g.d > 1) g.d = 0.05;
        const axe = cible ? ((angle + g.u * demi * 0.85) * Math.PI) / 180 : g.a;
        const ang = axe + Math.sin(t / 3000 + g.p) * 0.01;
        const dist = g.d * portee;
        const scint = 0.35 + 0.65 * Math.abs(Math.sin(t / 900 + g.p));
        ctx.beginPath();
        ctx.arc(ox + Math.sin(ang) * dist, oy - Math.cos(ang) * dist, g.r * devicePixelRatio, 0, 6.28);
        ctx.fillStyle = `rgba(255,241,210,${0.5 * scint * (1 - g.d * 0.7)})`;
        ctx.fill();
      }
      image = requestAnimationFrame(boucle);
    };

    // En pause hors écran
    const obs = new IntersectionObserver(([e]) => {
      actif = e.isIntersecting;
      cancelAnimationFrame(image);
      if (actif) image = requestAnimationFrame(boucle);
    });
    obs.observe(cv);

    return () => {
      actif = false;
      cancelAnimationFrame(image);
      obs.disconnect();
      window.removeEventListener("resize", taille);
    };
  }, [cible]);

  return (
    <>
      <div ref={cone} aria-hidden="true" className={`faisceau ${doux ? "faisceau--doux" : ""} ${cible ? "faisceau--vise" : ""}`} />
      <canvas ref={toile} aria-hidden="true" className="poussiere" />
    </>
  );
}
