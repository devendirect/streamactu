import { Particules, vars } from "@/components/saison/Briques";

/**
 * Anniversaire du site (28 juin, à partir de 2027) : ballons, confettis, serpentins qui se déroulent
 * du haut du hero et badge « 1 an » doré qui scintille.
 */

/** Un serpentin : un ruban qui ondule, dessiné en une seule courbe */
function Serpentin({ couleur, x, duree, delai }: { couleur: string; x: string; duree: number; delai: number }) {
  return (
    <div className="anniv-serpentin" style={vars({ "--x": x, "--t": `${duree}s`, "--d": `${delai}s` })}>
      <svg viewBox="0 0 60 420" width="100%" aria-hidden="true" focusable="false" style={{ display: "block", overflow: "visible" }}>
        <path
          d="M30 0 C58 22 2 44 30 66 C58 88 2 110 30 132 C58 154 2 176 30 198 C58 220 2 242 30 264 C58 286 2 308 30 330 C58 352 2 374 30 396"
          fill="none"
          stroke={couleur}
          strokeWidth="9"
          strokeLinecap="round"
        />
        <path
          d="M30 0 C58 22 2 44 30 66 C58 88 2 110 30 132 C58 154 2 176 30 198 C58 220 2 242 30 264 C58 286 2 308 30 330 C58 352 2 374 30 396"
          fill="none"
          stroke="#fff"
          strokeOpacity=".35"
          strokeWidth="2.4"
          strokeLinecap="round"
          transform="translate(-2 -1)"
        />
      </svg>
    </div>
  );
}

export default function Anniv() {
  return (
    <>
      <div className="eff">
      <Serpentin couleur="#ff6b8b" x="16%" duree={9} delai={-2} />
      <Serpentin couleur="#ffd166" x="38%" duree={11} delai={-6} />
      <Serpentin couleur="#6bd5ff" x="64%" duree={10} delai={-4} />
      <Serpentin couleur="#9b7bff" x="82%" duree={12} delai={-9} />
      </div>
      <Particules nom="balloon" n={13} couleurs={["#ff6b8b", "#ffd166", "#6bd5ff", "#9b7bff", "#5eeaa0"]} taille={[60, 100]} duree={[11, 19]} mode="monte" flou={0.2} graine={71} derive={[-40, 40]} rot={[-20, 20]} />
      <Particules nom="conf" n={50} couleurs={["#ff6b8b", "#ffd166", "#6bd5ff", "#9b7bff", "#5eeaa0"]} taille={[8, 16]} duree={[7, 13]} graine={72} derive={[-90, 90]} rot={[360, 1080]} />
      <div className="anniv-badge" role="img" aria-label="StreamActu a 1 an">
        1<small>AN</small>
        <i className="anniv-etincelle" style={vars({ "--l": "-8%", "--t": "12%", "--d": "0s" })} />
        <i className="anniv-etincelle" style={vars({ "--l": "92%", "--t": "6%", "--d": "-0.8s" })} />
        <i className="anniv-etincelle" style={vars({ "--l": "98%", "--t": "70%", "--d": "-1.6s" })} />
        <i className="anniv-etincelle" style={vars({ "--l": "4%", "--t": "88%", "--d": "-2.2s" })} />
      </div>
    </>
  );
}
