import { Particules, PassageLibre } from "@/components/saison/Briques";

/**
 * 1er avril, « tout de travers » : le gros du gag est en CSS (app/themes.css : le hero tangue comme un
 * bateau, cartes qui penchent, logo à l'envers). Ici, des poissons dessinés (queue qui bat, bulles)
 * qui nagent à travers le hero, et le poisson collé en haut avec son mot.
 */
function Poisson({ corps, ventre }: { corps: string; ventre: string }) {
  return (
    <svg viewBox="0 0 110 60" style={{ width: "100%", display: "block", overflow: "visible" }} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`pg-${corps.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={corps} />
          <stop offset="0.62" stopColor={corps} />
          <stop offset="1" stopColor={ventre} />
        </linearGradient>
      </defs>
      <g className="poisson-queue">
        <path d="M78 30 C88 20 100 8 108 6 C104 18 104 42 108 54 C100 52 88 40 78 30 Z" fill={corps} />
      </g>
      <path d="M26 30 C34 12 58 6 80 30 C58 54 34 48 26 30 Z" fill={`url(#pg-${corps.slice(1)})`} />
      <path d="M44 12 C52 2 64 4 66 14 Z" fill={corps} opacity="0.85" />
      <path d="M50 46 C54 54 62 54 64 46 Z" fill={corps} opacity="0.8" />
      <path d="M34 32 C42 36 52 36 60 32" fill="none" stroke="#fff" strokeOpacity=".45" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M54 16 C58 24 58 36 54 44 M66 18 C70 26 70 34 66 42" fill="none" stroke="#fff" strokeOpacity=".4" strokeWidth="2.6" />
      <circle cx="38" cy="26" r="4" fill="#fff" />
      <circle cx="37" cy="26" r="1.9" fill="#101820" />
      <circle cx="12" cy="20" r="2.4" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="1" className="poisson-bulle" />
      <circle cx="6" cy="10" r="1.7" fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="1" className="poisson-bulle" style={{ animationDelay: "0.5s" }} />
    </svg>
  );
}

export default function Avril() {
  return (
    <>
      <Particules nom="fish" n={9} couleurs={["#2fb8f2", "#ffc42e", "#ff8a2a", "#7be0a4", "#ff7aa3"]} taille={[26, 46]} duree={[11, 17]} lent flou={0.2} graine={401} derive={[-90, 90]} rot={[-60, 60]} />
      <PassageLibre largeur="clamp(64px, 6.4vw, 108px)" haut="24%" cycle={18} delai={4} classe="poisson-nage">
        <Poisson corps="#2fb8f2" ventre="#9be3ff" />
      </PassageLibre>
      <PassageLibre largeur="clamp(48px, 4.8vw, 82px)" haut="38%" cycle={22} delai={9} rtl classe="poisson-nage">
        <Poisson corps="#ffc42e" ventre="#fff0a6" />
      </PassageLibre>
      <div className="avril-poisson">
        <div style={{ width: "clamp(100px, 12vw, 180px)" }} className="ondule">
          <Poisson corps="#ff8a2a" ventre="#ffd09a" />
        </div>
      </div>
      <div className="avril-postit">Poisson d&apos;avril&nbsp;!</div>
    </>
  );
}
