import { Particules, PassageLibre, Sprite, vars } from "@/components/saison/Briques";

/**
 * Saint-Valentin. Variante 1 : des cœurs qui montent. Variante 2 : une pluie de pétales de rose.
 * Dans les deux cas : de grosses lueurs floues (bokeh) qui dérivent et un halo qui bat comme un cœur.
 */
const BOKEH: [number, number, number, number][] = [[12, 22, 150, 0], [34, 58, 110, -3], [58, 18, 180, -6], [74, 46, 130, -2], [90, 24, 100, -8], [46, 36, 90, -5]];

/** Flèche de Cupidon : hampe, pointe en cœur, empennage. Elle laisse une traînée de petits cœurs. */
function Fleche() {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div className="valentin-traine">
        {[10, 15, 20, 26].map((w, i) => (
          <span key={i} style={{ width: w, opacity: 0.3 + i * 0.2 }}>
            <Sprite nom="coeur" largeur="100%" style={{ color: "#ff5d8f" }} />
          </span>
        ))}
      </div>
      <svg viewBox="0 0 150 34" style={{ width: "clamp(110px, 12vw, 190px)", display: "block", overflow: "visible", filter: "drop-shadow(0 0 8px rgba(255,93,143,.85))" }} aria-hidden="true" focusable="false">
        <path d="M10 17 L124 17" stroke="#ffd9e2" strokeWidth="3" strokeLinecap="round" />
        <path d="M10 17 L2 6 M10 17 L2 28 M22 17 L14 8 M22 17 L14 26 M34 17 L28 10 M34 17 L28 24" stroke="#ff7aa3" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M126 17 C132 8 146 8 148 17 C146 26 132 26 126 17 Z" fill="#ff5d8f" />
      </svg>
    </div>
  );
}

function Ambiance() {
  return (
    <>
      <div className="eff">
      <div className="valentin-pouls" />
      {BOKEH.map(([x, y, t, d], i) => (
        <i key={i} className="valentin-bokeh" style={vars({ "--x": `${x}%`, "--y": `${y}%`, "--t": `${t / 10 + 9}s`, "--d": `${d}s`, "--w": `${t}px` })} />
      ))}
      </div>
    </>
  );
}

export default function Valentin({ variante }: { variante: number }) {
  if (variante === 2) {
    return (
      <>
        <Ambiance />
        <PassageLibre largeur="auto" haut="22%" cycle={17} delai={5}>
          <Fleche />
        </PassageLibre>
        <Particules nom="petale3d" trois n={44} couleurs={["#d11a45", "#e8365f", "#ff6b8b", "#9e0f33", "#ffb3c1"]} taille={[24, 50]} duree={[9, 17]} flou={0.2} graine={22} derive={[-160, 160]} rot={[360, 900]} />
      </>
    );
  }
  return (
    <>
      <Ambiance />
      <PassageLibre largeur="auto" haut="22%" cycle={17} delai={5}>
        <Fleche />
      </PassageLibre>
      <Particules nom="coeur" n={40} couleurs={["#ff6b8b", "#ff9fb5", "#ffc2d1", "#e83e6b"]} taille={[14, 46]} duree={[8, 15]} mode="monte" flou={0.22} graine={21} derive={[-70, 70]} rot={[-40, 40]} />
    </>
  );
}
