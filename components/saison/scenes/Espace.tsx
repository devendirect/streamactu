import { alea, vars } from "@/components/saison/Briques";

/**
 * 4 mai, saut en hyperespace : une cinquantaine de traînées d'étoiles (bleues, blanches, quelques roses)
 * jaillissent du centre, des ondes de choc s'élargissent, et un éclair blanc marque l'entrée dans le
 * saut. Aucune marque.
 */
const a = alea(404);
const RAYURES = Array.from({ length: 54 }, (_, i) => ({
  angle: i * (360 / 54) + a() * 4,
  longueur: 16 + a() * 22,
  duree: 1.1 + a() * 1.3,
  delai: -a() * 2.4,
  epaisseur: 2 + a() * 2.2,
  teinte: a() < 0.18 ? "rose" : a() < 0.5 ? "cyan" : "blanc",
}));

export default function Espace() {
  return (
    <>
      <div className="eff">
      <div className="calque-etoiles" />
      <div className="espace-flash" />
      <div className="espace-rayures">
        {RAYURES.map((r, i) => (
          <i
            key={i}
            className={`rayure ${r.teinte}`}
            style={vars({ "--a": `${r.angle.toFixed(1)}deg`, "--l": `${r.longueur.toFixed(1)}vw`, "--t": `${r.duree.toFixed(2)}s`, "--d": `${r.delai.toFixed(2)}s`, "--e": `${r.epaisseur.toFixed(1)}px` })}
          />
        ))}
      </div>
      <div className="espace-onde" style={vars({ "--d": "0s" })} />
      <div className="espace-onde" style={vars({ "--d": "-1.2s" })} />
      <div className="espace-onde" style={vars({ "--d": "-2.4s" })} />
      <div className="espace-coeur" />
      </div>
    </>
  );
}
