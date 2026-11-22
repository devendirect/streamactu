import { useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { Particules, PassageLibre, Sprite } from "@/components/saison/Briques";
import { abonner, effetsActifs, effetsActifsServeur } from "@/components/saison/effets";

/**
 * Pâques : cinq œufs décorés sont cachés sur le bord du hero. Les trouver (un clic ou Entrée) fait monter
 * le compteur ; au cinquième, une pluie de confettis. Le score est gardé dans le navigateur pour l'année.
 * Des papillons butinent à travers le hero, des pétales de printemps tombent.
 */

/** Un œuf décoré : dégradé, reflet et motif (rayures, zigzag, pois, fleurs, bandes) */
function Oeuf({ couleur, motif, largeur }: { couleur: string; motif: number; largeur: string }) {
  const corps = "M15 2 C25 2 29 22 29 28 C29 35 23 39 15 39 C7 39 1 35 1 28 C1 22 5 2 15 2Z";
  const motifs = [
    <path key="r" d="M2 22 H28 M1.5 28 H28.5 M3 34 H27" stroke="#fff" strokeOpacity=".8" strokeWidth="2.2" fill="none" />,
    <path key="z" d="M2 26 L7.5 20 L13 27 L18.5 20 L24 27 L28.5 22 M3 33 L8 29 L13 34 L18 29 L23 34 L27 31" stroke="#fff" strokeOpacity=".8" strokeWidth="1.8" fill="none" />,
    <g key="p" fill="#fff" fillOpacity=".8">
      {[[9, 14], [20, 15], [14, 22], [6, 28], [23, 27], [14, 33]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2" />
      ))}
    </g>,
    <g key="f" fill="#fff" fillOpacity=".85">
      {[[10, 20], [21, 28], [11, 33]].map(([x, y], i) => (
        <g key={i}>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx={x} cy={y - 2.2} rx="1.1" ry="1.9" transform={`rotate(${a} ${x} ${y})`} />
          ))}
          <circle cx={x} cy={y} r="1" fill={couleur} />
        </g>
      ))}
    </g>,
    <path key="b" d="M3 20 L27 30 M2 27 L27 37 M5 14 L20 21" stroke="#fff" strokeOpacity=".75" strokeWidth="2.6" fill="none" />,
  ];
  return (
    <svg viewBox="0 0 30 40" style={{ width: largeur, aspectRatio: "30 / 40", display: "block", overflow: "visible" }} aria-hidden="true" focusable="false">
      <path d={corps} fill={couleur} />
      <clipPath id={`oc${motif}`}>
        <path d={corps} />
      </clipPath>
      <g clipPath={`url(#oc${motif})`}>{motifs[motif % motifs.length]}</g>
      <path d={corps} fill="url(#ombre-c)" />
      <path d={corps} fill="url(#reflet-c)" />
      <ellipse cx="10.5" cy="11" rx="2.6" ry="4" fill="#fff" opacity=".5" transform="rotate(-18 10.5 11)" />
    </svg>
  );
}

/** Un papillon vu de dessus : les ailes battent en se refermant vers le corps */
function Papillon({ aile, aile2 }: { aile: string; aile2: string }) {
  const haute = "M30 26 C20 4 2 4 4 20 C6 30 20 30 30 28 Z";
  const basse = "M30 28 C22 32 8 34 12 46 C18 50 28 42 30 32 Z";
  const aileDessin = (
    <g>
      <path d={haute} fill={aile} />
      <path d={basse} fill={aile2} />
      <circle cx="12" cy="16" r="3" fill="#fff" opacity=".7" />
      <circle cx="17" cy="42" r="2" fill="#fff" opacity=".6" />
    </g>
  );
  return (
    <svg viewBox="0 0 60 56" style={{ width: "100%", display: "block", overflow: "visible" }} aria-hidden="true" focusable="false">
      <g className="papillon-aile">
        {aileDessin}
        <g transform="translate(60 0) scale(-1 1)">{aileDessin}</g>
      </g>
      <ellipse cx="30" cy="30" rx="2.2" ry="9" fill="#2a2030" />
      <path d="M29 22 C27 16 24 13 22 12 M31 22 C33 16 36 13 38 12" stroke="#2a2030" strokeWidth="0.9" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// Positions dans la zone visible du hero (le bas passe sous la rangée de cartes)
const OEUFS: { id: number; pos: CSSProperties; couleur: string; angle: number; largeur: string }[] = [
  { id: 0, pos: { left: "44%", top: "92px" }, couleur: "#ff8fab", angle: -14, largeur: "clamp(40px, 4.4vw, 64px)" },
  { id: 1, pos: { right: "5%", top: "38%" }, couleur: "#6fc3f2", angle: 10, largeur: "clamp(34px, 3.8vw, 56px)" },
  { id: 2, pos: { left: "63%", top: "58%" }, couleur: "#f6c445", angle: -8, largeur: "clamp(44px, 4.8vw, 70px)" },
  { id: 3, pos: { left: "-14px", top: "52%" }, couleur: "#a98bf0", angle: -72, largeur: "clamp(38px, 4vw, 60px)" },
  { id: 4, pos: { right: "-16px", top: "46%" }, couleur: "#5fd391", angle: 78, largeur: "clamp(40px, 4.4vw, 64px)" },
];
const CLE = "paques-oeufs";

function lire(): number[] {
  try {
    const v = JSON.parse(localStorage.getItem(CLE) || "null");
    if (v && v.annee === new Date().getFullYear() && Array.isArray(v.ids)) return v.ids;
  } catch {
    // stockage indisponible : on repart de zéro
  }
  return [];
}

export default function Paques() {
  const effets = useSyncExternalStore(abonner, effetsActifs, effetsActifsServeur);
  const [trouves, setTrouves] = useState<number[]>(lire);
  const [fete, setFete] = useState(false);
  // Liste toujours à jour : deux clics très rapprochés ne doivent pas s'écraser
  const courant = useRef(trouves);

  const trouver = (id: number) => {
    if (courant.current.includes(id)) return;
    const ids = [...courant.current, id];
    courant.current = ids;
    setTrouves(ids);
    try {
      localStorage.setItem(CLE, JSON.stringify({ annee: new Date().getFullYear(), ids }));
    } catch {
      // le score ne sera pas gardé
    }
    if (ids.length === OEUFS.length) {
      setFete(true);
      window.setTimeout(() => setFete(false), 8000);
    }
  };

  return (
    <>
      <PassageLibre largeur="clamp(40px, 4vw, 64px)" haut="20%" cycle={26} delai={4} classe="papillon" style={{ ["--bob" as string]: "1.1s" }}>
        <Papillon aile="#ff9ec4" aile2="#ffc7e0" />
      </PassageLibre>
      <PassageLibre largeur="clamp(32px, 3.2vw, 52px)" haut="34%" cycle={30} delai={12} rtl classe="papillon" style={{ ["--bob" as string]: "1.5s" }}>
        <Papillon aile="#7fc8ff" aile2="#b9e1ff" />
      </PassageLibre>
      {OEUFS.filter((o) => !trouves.includes(o.id)).map((o) => (
        <button
          key={o.id}
          type="button"
          className="paques-oeuf"
          title="Un œuf caché !"
          aria-label="Un œuf caché : cliquez pour le trouver"
          style={{ ...o.pos, transform: `rotate(${o.angle}deg)`, ["--k" as string]: `${o.id * 0.7}s` }}
          onClick={() => trouver(o.id)}
        >
          <Oeuf couleur={o.couleur} motif={o.id} largeur={o.largeur} />
        </button>
      ))}
      <div className="paques-compteur" role="status">
        <Sprite nom="egg" largeur="12px" style={{ color: "#ffcf5a" }} />
        {trouves.length >= OEUFS.length ? "Bravo, les 5 œufs sont trouvés !" : `Œufs trouvés : ${trouves.length} / ${OEUFS.length}`}
      </div>
      <Particules nom="petal" n={18} couleurs={["#ffc2d9", "#fff", "#ffe08a", "#cfe9ff"]} taille={[12, 22]} duree={[10, 18]} lent flou={0.15} graine={44} derive={[-120, 120]} rot={[240, 720]} />
      {fete && effets && <Particules evenement nom="conf" n={44} couleurs={["#ff8fab", "#8fd3ff", "#ffd166", "#b69cff", "#7be0a4"]} taille={[8, 14]} duree={[4, 8]} graine={5} derive={[-90, 90]} rot={[360, 1080]} />}
    </>
  );
}
