import { Particules } from "@/components/saison/Briques";

/** Fête du cinéma : rampe de lumières de salle, pellicule qui défile, pop-corn et tickets qui tombent. */
export default function Cinema() {
  return (
    <>
      <div className="cinema-marquee" />
      <div className="cinema-pellicule" />
      <div className="cinema-neon">
        <span>FÊTE DU</span>
        {"CINÉMA".split("").map((l, i) => (
          <b key={i}>{l}</b>
        ))}
      </div>
      <Particules nom="popcorn" n={16} couleurs={["#fff"]} taille={[18, 34]} duree={[9, 16]} graine={62} derive={[-80, 80]} rot={[180, 540]} />
      <Particules nom="ticket" n={8} couleurs={["#FFD24A", "#ff7a7a"]} taille={[26, 44]} duree={[10, 18]} graine={63} derive={[-90, 90]} rot={[180, 480]} />
    </>
  );
}
