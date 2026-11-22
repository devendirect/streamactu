import { PassageLibre } from "@/components/saison/Briques";
import { Chauve, Fantome } from "@/components/saison/scenes/Creatures";

/**
 * Halloween. Variante 1 : une volée de chauves-souris à contour orange (lisibles sur toute image).
 * Variante 2 : des fantômes verts qui glissent dans la brume, avec un faible éclair espacé.
 */
const CHAUVES: [string, string, number, number, boolean][] = [
  ["clamp(66px, 7vw, 110px)", "10%", 15, 3, false],
  ["clamp(54px, 5.6vw, 88px)", "22%", 17, 4.1, false],
  ["clamp(74px, 7.6vw, 120px)", "34%", 16, 4.9, false],
  ["clamp(48px, 5vw, 78px)", "16%", 14, 5.8, true],
  ["clamp(62px, 6.4vw, 100px)", "28%", 18, 6.7, true],
  ["clamp(42px, 4.4vw, 68px)", "6%", 16, 8, false],
];
const FANTOMES: [string, string, number, number, boolean][] = [
  ["clamp(70px, 8vw, 130px)", "12%", 28, 3, false],
  ["clamp(50px, 6vw, 96px)", "30%", 34, 7, true],
  ["clamp(90px, 10vw, 170px)", "22%", 40, 13, false],
  ["clamp(46px, 5vw, 80px)", "8%", 32, 18, true],
  ["clamp(60px, 7vw, 112px)", "36%", 36, 24, false],
];

export default function Halloween({ variante }: { variante: number }) {
  if (variante === 2) {
    return (
      <>
        <div className="eff"><div className="halloween-brume vert" /></div>
        <div className="eff"><div className="halloween-brume vert bas" /></div>
        {FANTOMES.map(([w, haut, cycle, delai, rtl], i) => (
          <PassageLibre key={i} largeur={w} haut={haut} cycle={cycle} delai={delai} rtl={rtl} classe="spectre" style={{ ["--bob" as string]: "2.6s" }}>
            <Fantome />
          </PassageLibre>
        ))}
        <div className="eff"><div className="halloween-eclair" /></div>
      </>
    );
  }
  return (
    <>
      <div className="halloween-lune" />
      <div className="halloween-toile" />
      <div className="eff"><div className="halloween-brume" /></div>
      <div className="eff"><div className="halloween-eclair violet" /></div>
      {CHAUVES.map(([w, haut, cycle, delai, rtl], i) => (
        <PassageLibre key={i} largeur={w} haut={haut} cycle={cycle} delai={delai} rtl={rtl} couleur="#050208" classe="chauve chauve-vol" style={{ ["--bob" as string]: `${(1.2 + (i % 4) * 0.35).toFixed(2)}s` }}>
          <Chauve vol={0.2 + (i % 3) * 0.04} />
        </PassageLibre>
      ))}
    </>
  );
}
