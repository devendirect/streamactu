import { Particules } from "@/components/saison/Briques";
import Traineau from "@/components/noel/Traineau";

/**
 * Scène de Noël dans le hero : étoiles qui scintillent et traîneau à contre-jour qui
 * traverse le haut de l'écran, une fois toutes les 26 s (premier passage 3 s après l'arrivée).
 * Le halo qui le suit fait office de lune : la silhouette reste lisible sur n'importe quelle image.
 * Tout est décoratif (aria-hidden, ne capte aucun clic). Styles : app/noel.css.
 */
export default function CalqueNoel() {
  return (
    <>
      <div className="calque-etoiles" />
      {/* Scintillements dorés qui retombent doucement */}
      <Particules nom="star" n={12} couleurs={["#fff1b8", "#ffd97a"]} taille={[5, 11]} duree={[9, 15]} lent graine={7} derive={[-40, 40]} rot={[0, 120]} />
      <div className="eff">
      <div className="passage" style={{ ["--haut" as string]: "14%", ["--cycle" as string]: "26s", ["--delai" as string]: "3s" }}>
        <div className="passage__bob">
          <Traineau />
        </div>
      </div>
      </div>
    </>
  );
}
