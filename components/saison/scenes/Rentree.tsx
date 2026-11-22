import { Particules, Passage } from "@/components/saison/Briques";

/**
 * Rentrée : des feuilles d'automne qui tombent doucement, dans la lumière dorée de fin d'été, et des
 * rafales de vent qui emportent des feuilles en tourbillon à travers le hero.
 */
const RAFALES: [string, string, number, number, string, number][] = [
  ["clamp(26px, 3vw, 44px)", "10%", 10, 3, "#ff9f43", 1.5],
  ["clamp(20px, 2.4vw, 36px)", "20%", 12, 3.6, "#e8581c", 1.1],
  ["clamp(30px, 3.4vw, 50px)", "32%", 11, 4.3, "#f2c14e", 1.9],
  ["clamp(22px, 2.6vw, 38px)", "16%", 13, 5.1, "#b5481a", 1.3],
  ["clamp(26px, 3vw, 42px)", "40%", 12, 6, "#d9822b", 1.7],
  ["clamp(18px, 2.2vw, 32px)", "26%", 10, 6.8, "#ff9f43", 1.2],
  ["clamp(24px, 2.8vw, 40px)", "8%", 14, 7.6, "#c9632a", 1.6],
];

export default function Rentree() {
  return (
    <>
      <div className="eff"><div className="rentree-rayons" /></div>
      <Particules nom="feuille" n={40} couleurs={["#ff9f43", "#e8581c", "#f2c14e", "#b5481a", "#d9822b"]} taille={[22, 50]} duree={[9, 17]} flou={0.2} graine={81} derive={[-170, 170]} rot={[360, 900]} />
      {RAFALES.map(([w, haut, cycle, delai, couleur, tour], i) => (
        <Passage key={i} nom="feuille" largeur={w} haut={haut} cycle={cycle} delai={delai} couleur={couleur} interne="tourne" style={{ ["--tour" as string]: `${tour}s`, ["--bob" as string]: "0.9s" }} />
      ))}
    </>
  );
}
