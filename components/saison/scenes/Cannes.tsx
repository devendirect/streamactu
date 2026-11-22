import { Particules, Sprite, vars } from "@/components/saison/Briques";

/**
 * Festival de Cannes : projecteurs qui balaient, flashs de photographes (étoile de lumière, espacés :
 * jamais plus de 3 par seconde), palme dorée entourée d'étincelles.
 */
const FLASHS: [number, number, number][] = [[16, 20, 0], [38, 46, -1.5], [60, 26, -3], [78, 52, -4.5], [88, 24, -2.2], [48, 62, -5.2]];

export default function Cannes() {
  return (
    <>
      <div className="eff">
      <div className="cannes-rayons" />
      <div className="projo" style={vars({ "--px": "-45%", "--t": "9s", "--d": "0s" })} />
      <div className="projo" style={vars({ "--px": "5%", "--t": "11s", "--d": "-4s" })} />
      {FLASHS.map(([x, y, d], i) => (
        <i key={i} className="flash" style={vars({ "--x": `${x}%`, "--y": `${y}%`, "--d": `${d}s` })} />
      ))}
      </div>
      <Particules nom="star" n={30} couleurs={["#F2C14E", "#fff3b0", "#ffe08a"]} taille={[6, 16]} duree={[5, 10]} lent graine={53} derive={[-30, 30]} rot={[0, 90]} />
      <div className="cannes-palme">
        <Sprite nom="palme" largeur="clamp(54px, 6vw, 92px)" />
      </div>
    </>
  );
}
