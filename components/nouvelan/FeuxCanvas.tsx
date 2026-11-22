import { useEffect, useRef } from "react";

/**
 * Feux d'artifice du Nouvel An, en canvas avec une vraie physique : une fusée monte en laissant
 * des étincelles, éclate en bouquet, les étincelles subissent la gravité et le frottement de l'air,
 * scintillent et s'éteignent. Quatre types de bouquets : pivoine, saule (longues traînées dorées),
 * anneau, crépitement. Canvas transparent, qui ne capte aucun clic ; au repos hors écran, il s'arrête.
 * `final` : un grand final d'une minute (le composant parent le démonte ensuite) ; `arrivee` : plus doux.
 */

type Etincelle = {
  x: number; y: number; px: number; py: number; vx: number; vy: number;
  vie: number; decay: number; teinte: number; clair: number; taille: number;
  gravite: number; frein: number; scintille: boolean; crepite: boolean; fusee: boolean;
};
type Fusee = { x: number; y: number; vx: number; vy: number; cibleY: number; teinte: number; type: Type };
type Type = "pivoine" | "saule" | "anneau" | "crepitement";

const TEINTES = [45, 340, 190, 270, 150, 20, 55];
const TYPES: Type[] = ["pivoine", "pivoine", "saule", "anneau", "crepitement", "pivoine"];

export default function FeuxCanvas({ intensite }: { intensite: "final" | "arrivee" }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    let k = 1; // échelle selon la hauteur du hero
    const etincelles: Etincelle[] = [];
    const fusees: Fusee[] = [];
    let raf = 0;
    let minuteur = 0;
    let arrete = false;

    const taille = () => {
      W = canvas.clientWidth || window.innerWidth;
      H = canvas.clientHeight || window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      k = Math.max(0.7, H / 800);
    };
    taille();
    window.addEventListener("resize", taille);

    const alea = (a: number, b: number) => a + Math.random() * (b - a);

    const lancer = () => {
      const type = TYPES[Math.floor(Math.random() * TYPES.length)];
      const cibleY = alea(0.16, 0.42) * H;
      fusees.push({
        x: alea(0.12, 0.88) * W,
        y: H * 0.82,
        vx: alea(-0.6, 0.6),
        vy: -alea(10, 13) * k,
        cibleY,
        teinte: type === "saule" ? 42 : TEINTES[Math.floor(Math.random() * TEINTES.length)],
        type,
      });
    };

    const ajouter = (e: Partial<Etincelle> & { x: number; y: number; vx: number; vy: number; teinte: number }) => {
      if (etincelles.length > 1700) etincelles.shift();
      etincelles.push({
        px: e.x, py: e.y, vie: 1, decay: 0.012, clair: 62, taille: 2.6, gravite: 0.045 * k, frein: 0.988, scintille: false, crepite: false, fusee: false, ...e,
      });
    };

    const eclater = (f: Fusee) => {
      const { x, y, teinte, type } = f;
      // lueur de l'éclatement
      lueurs.push({ x, y, teinte, vie: 1 });
      if (type === "pivoine") {
        const n = 110;
        for (let i = 0; i < n; i++) {
          const a = (i / n) * Math.PI * 2 + alea(-0.05, 0.05);
          const v = alea(3.6, 8.6) * k;
          ajouter({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, teinte: teinte + alea(-8, 8), decay: alea(0.009, 0.016), scintille: Math.random() < 0.35 });
        }
      } else if (type === "saule") {
        const n = 80;
        for (let i = 0; i < n; i++) {
          const a = (i / n) * Math.PI * 2;
          const v = alea(2.4, 6) * k;
          ajouter({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, teinte: 40, clair: 70, taille: 2.1, decay: alea(0.004, 0.007), gravite: 0.06 * k, frein: 0.99, scintille: true });
        }
      } else if (type === "anneau") {
        const n = 64;
        const inclinaison = alea(0.35, 1);
        for (let i = 0; i < n; i++) {
          const a = (i / n) * Math.PI * 2;
          const v = 6.6 * k;
          ajouter({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v * inclinaison, teinte: teinte + (i % 2) * 14, decay: 0.011, taille: 2.8 });
        }
      } else {
        const n = 90;
        for (let i = 0; i < n; i++) {
          const a = Math.random() * Math.PI * 2;
          const v = alea(2.5, 7.4) * k;
          ajouter({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, teinte: 48, clair: 80, decay: alea(0.01, 0.02), crepite: true, scintille: true });
        }
      }
    };

    const lueurs: { x: number; y: number; teinte: number; vie: number }[] = [];

    const boucle = () => {
      if (arrete) return;
      // fondu des images précédentes : c'est ce qui dessine les traînées
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";

      for (let i = lueurs.length - 1; i >= 0; i--) {
        const l = lueurs[i];
        l.vie -= 0.14;
        if (l.vie <= 0) { lueurs.splice(i, 1); continue; }
        const r = 260 * k;
        const g = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, r);
        g.addColorStop(0, `hsla(${l.teinte},100%,68%,${0.07 * l.vie})`);
        g.addColorStop(1, `hsla(${l.teinte},100%,60%,0)`);
        ctx.fillStyle = g;
        ctx.fillRect(l.x - r, l.y - r, r * 2, r * 2);
      }

      for (let i = fusees.length - 1; i >= 0; i--) {
        const f = fusees[i];
        f.x += f.vx;
        f.y += f.vy;
        f.vy *= 0.972;
        ajouter({ x: f.x, y: f.y, vx: alea(-0.4, 0.4), vy: alea(0.4, 1.2), teinte: 36, clair: 78, taille: 1.8, decay: 0.07, gravite: 0.02, fusee: true });
        if (f.y <= f.cibleY || f.vy > -1.6) {
          eclater(f);
          fusees.splice(i, 1);
        }
      }

      for (let i = etincelles.length - 1; i >= 0; i--) {
        const e = etincelles[i];
        e.px = e.x;
        e.py = e.y;
        e.vx *= e.frein;
        e.vy = e.vy * e.frein + e.gravite;
        e.x += e.vx;
        e.y += e.vy;
        e.vie -= e.decay;
        if (e.vie <= 0) {
          if (e.crepite) {
            for (let j = 0; j < 3; j++) ajouter({ x: e.x, y: e.y, vx: alea(-1.6, 1.6), vy: alea(-1.6, 1.6), teinte: 50, clair: 90, taille: 1.1, decay: 0.07, gravite: 0.02 });
          }
          etincelles.splice(i, 1);
          continue;
        }
        const scint = e.scintille ? 0.55 + 0.45 * Math.random() : 1;
        const alpha = Math.min(1, e.vie * 1.4) * scint;
        ctx.strokeStyle = `hsla(${e.teinte},100%,${e.clair}%,${alpha})`;
        ctx.lineWidth = e.taille * (0.6 + e.vie * 0.6);
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(e.px, e.py);
        ctx.lineTo(e.x, e.y);
        ctx.stroke();
      }
      raf = requestAnimationFrame(boucle);
    };

    // Cadence des lancers : plus dense pour le grand final
    const cadence = () => {
      if (arrete) return;
      lancer();
      if (intensite === "final" && Math.random() < 0.35) lancer();
      minuteur = window.setTimeout(cadence, intensite === "final" ? alea(380, 900) : alea(650, 1100));
    };
    cadence();
    lancer();
    raf = requestAnimationFrame(boucle);

    return () => {
      arrete = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(minuteur);
      window.removeEventListener("resize", taille);
    };
  }, [intensite]);

  return <canvas ref={ref} className="feux-canvas" aria-hidden="true" />;
}
