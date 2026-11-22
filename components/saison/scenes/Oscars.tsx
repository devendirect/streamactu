import { Particules, Sprite, vars } from "@/components/saison/Briques";

/**
 * Cérémonies : un rideau de velours (plis, ombres, lambrequin doré) s'ouvre une fois sur le hero, une
 * statuette dorée brille dans sa lumière, des projecteurs balaient la scène, des étoiles retombent.
 */
export default function Oscars() {
  return (
    <>
      <div className="eff">
        <div className="projo" style={vars({ "--px": "-30%", "--t": "8s", "--d": "0s" })} />
        <div className="projo" style={vars({ "--px": "15%", "--t": "10s", "--d": "-3s" })} />
      </div>
      <div className="oscars-lueur" />
      <div className="oscars-statuette">
        <Sprite nom="statuette" largeur="clamp(52px, 5.6vw, 86px)" />
      </div>
      <Particules nom="star" n={16} couleurs={["#F0C15A", "#fff3b0"]} taille={[6, 14]} duree={[5, 9]} lent graine={101} derive={[-20, 20]} rot={[0, 90]} />
      <div className="oscars-rideau g" />
      <div className="oscars-rideau d" />
      <div className="oscars-lambrequin" />
    </>
  );
}
