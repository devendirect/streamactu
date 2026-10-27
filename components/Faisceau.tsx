"use client";
import { useEffect, useRef } from "react";

/**
 * Faisceau du projecteur (signature, DESIGN.md) : cône chaud depuis le haut
 * gauche, qui s'allume en fondu, et poussière qui flotte dedans. La poussière
 * se met en pause hors écran et n'existe pas sous prefers-reduced-motion.
 * À poser dans un parent `relative isolate overflow-hidden` (la scène).
 */
export default function Faisceau({ doux = false }: { doux?: boolean }) {
  const toile = useRef<HTMLCanvasElement>(null);

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
      a: ((140 + Math.random() * 26) * Math.PI) / 180,
      v: 0.00012 + Math.random() * 0.0003,
      r: 0.6 + Math.random() * 1.6,
      p: Math.random() * 6.28,
    }));

    const boucle = (t: number) => {
      if (!actif) return;
      ctx.clearRect(0, 0, L, H);
      const portee = Math.hypot(L, H) * 0.95;
      const ox = L * 0.012;
      const oy = -H * 0.18;
      for (const g of grains) {
        g.d += g.v;
        if (g.d > 1) g.d = 0.05;
        const ang = g.a + Math.sin(t / 3000 + g.p) * 0.01;
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
  }, []);

  return (
    <>
      <div aria-hidden="true" className={`faisceau ${doux ? "faisceau--doux" : ""}`} />
      <canvas ref={toile} aria-hidden="true" className="poussiere" />
    </>
  );
}
