"use client";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { PAGES_SANS_NEIGE } from "@/lib/saison";
import { abonner, niveau, niveauServeur } from "@/components/saison/effets";

type Flocon = { x: number; y: number; r: number; v: number; a: number; d: number; rot: number; vr: number; cristal: boolean };

/**
 * Neige qui tombe sur la page (thème de Noël). Canvas fixe qui ne capte aucun clic,
 * trois plans de profondeur (petits flocons au loin, gros flocons flous devant).
 * Inactive : hors thème, neige coupée par le visiteur, mouvement réduit demandé,
 * et sur les pages de lecture (voir PAGES_SANS_NEIGE).
 */
export default function NeigeNoel() {
  const ref = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();
  const niv = useSyncExternalStore(abonner, niveau, niveauServeur);
  const active = niv !== "off";
  const lecture = PAGES_SANS_NEIGE.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !active || lecture) return;
    if (document.documentElement.getAttribute("data-saison") !== "noel") return;
    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduit.matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    let flocons: Flocon[] = [];
    let raf = 0;

    const creer = (init: boolean): Flocon => {
      const plan = Math.random(); // 0 loin → 1 proche
      return {
        x: Math.random() * W,
        y: init ? Math.random() * H : -20,
        r: plan < 0.6 ? 1 + Math.random() * 1.3 : plan < 0.9 ? 2.4 + Math.random() * 1.6 : 4.5 + Math.random() * 3,
        v: plan < 0.6 ? 0.6 + Math.random() * 0.5 : plan < 0.9 ? 1 + Math.random() * 0.8 : 1.6 + Math.random() * 0.9,
        a: plan < 0.6 ? 0.55 : plan < 0.9 ? 0.75 : 0.5,
        d: Math.random() * 6.28,
        rot: Math.random() * 6.28,
        vr: (Math.random() - 0.5) * 0.02,
        cristal: plan > 0.6 && Math.random() < 0.25,
      };
    };

    const remplir = () => {
      // Taille réelle du canvas (la barre de défilement n'en fait pas partie)
      W = canvas.clientWidth || window.innerWidth;
      H = canvas.clientHeight || window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // mode calme : quelques flocons seulement
      const n = Math.round((W < 760 ? 42 : 85) * (niv === "calme" ? 0.3 : 1));
      flocons = Array.from({ length: n }, () => creer(true));
    };

    const boucle = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      const vent = Math.sin(t / 4000) * 0.35;
      for (let i = 0; i < flocons.length; i++) {
        const f = flocons[i];
        f.y += f.v;
        f.x += Math.sin(t / 1400 + f.d) * 0.4 + vent * (f.r / 3 + 0.5);
        f.rot += f.vr;
        if (f.y > H + 20 || f.x < -30 || f.x > W + 30) {
          flocons[i] = { ...creer(false), x: Math.random() * W };
          continue;
        }
        ctx.globalAlpha = f.a;
        if (f.cristal) {
          ctx.save();
          ctx.translate(f.x, f.y);
          ctx.rotate(f.rot);
          ctx.font = `${f.r * 3.2}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "rgba(225,240,255,.9)";
          ctx.fillText("❄", 0, 0);
          ctx.restore();
        } else if (f.r > 4) {
          // premier plan : flocon flou, comme hors de la mise au point
          const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 1.6);
          g.addColorStop(0, "rgba(225,240,255,.85)");
          g.addColorStop(1, "rgba(225,240,255,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.r * 1.6, 0, 6.28);
          ctx.fill();
        } else {
          ctx.fillStyle = "rgb(225,240,255)";
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.r, 0, 6.28);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(boucle);
    };

    remplir();
    raf = requestAnimationFrame(boucle);
    window.addEventListener("resize", remplir);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", remplir);
      ctx.clearRect(0, 0, W, H);
    };
  }, [active, lecture, niv]);

  return <canvas ref={ref} aria-hidden="true" className="neige-noel" />;
}
