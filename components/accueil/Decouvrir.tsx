import Image from "next/image";
import Link from "next/link";

/**
 * « Découvrir autrement » : trois tuiles vers les jeux, À la surprise et
 * Retrouver un titre. `jeu` est une affiche floutée (jamais celle du jeu du
 * jour), `pile` trois affiches empilées.
 */
export default function Decouvrir({ jeu, pile }: { jeu: string | null; pile: string[] }) {
  const tuile =
    "relative isolate flex min-h-[230px] flex-col justify-end overflow-hidden rounded-[14px] p-[22px] transition-transform duration-[350ms] ease-salle hover:-translate-y-[3px] max-[960px]:min-h-[190px]";
  const titre = "font-salle text-[32px] leading-[0.95] font-black";

  return (
    <section aria-label="Découvrir autrement" className="mb-section grid grid-cols-[1.25fr_1fr_1fr] gap-3 px-gouttiere max-[960px]:grid-cols-1">
      <Link href="/jeux" className={`${tuile} group`}>
        {jeu && (
          <Image
            src={jeu}
            alt=""
            fill
            sizes="(max-width: 960px) 100vw, 40vw"
            className="-z-[2] scale-110 object-cover blur-[16px] brightness-[0.55] transition-[filter] duration-[600ms] ease-salle group-hover:blur-[7px] group-hover:brightness-[0.6]"
          />
        )}
        <span aria-hidden="true" className="absolute inset-0 -z-[1] bg-linear-to-t from-[rgba(43,8,14,0.9)] to-transparent to-70%" />
        <h3 className={`${titre} text-lumiere`}>La pochette mystère</h3>
        <p className="mt-1.5 max-w-[32ch] text-[14.5px] text-[#E6D5CE]">
          Une affiche floutée, quatre essais. Et le Titre du jour en six indices.
        </p>
      </Link>

      <Link href="/surprise" className={`${tuile} group bg-linear-160 from-[#1D1D21] to-surface`}>
        <span aria-hidden="true" className="absolute top-[18px] right-[22px] h-[140px] w-[150px]">
          {pile.slice(0, 3).map((src, i) => (
            <span
              key={src}
              className={`absolute top-0 left-1/2 block aspect-[2/3] w-[82px] origin-[50%_110%] overflow-hidden rounded-lg shadow-[0_14px_24px_-12px_rgba(0,0,0,0.9)] transition-transform duration-[450ms] ease-salle ${
                [
                  "-translate-x-1/2 -rotate-[14deg] group-hover:-translate-x-[62%] group-hover:-rotate-[22deg]",
                  "-translate-x-1/2 rotate-[14deg] group-hover:-translate-x-[38%] group-hover:rotate-[22deg]",
                  "-translate-x-1/2",
                ][i]
              }`}
            >
              <Image src={src} alt="" fill sizes="82px" className="object-cover" />
            </span>
          ))}
        </span>
        <h3 className={titre}>À la surprise</h3>
        <p className="mt-1.5 max-w-[32ch] text-[14.5px] text-texte-2">Un titre tiré au hasard sur vos plateformes.</p>
      </Link>

      <Link href="/retrouver" className={`${tuile} justify-between! bg-linear-140 from-velours to-velours-sombre`}>
        <blockquote className="text-[19px] leading-[1.4] font-semibold text-lumiere">
          « La série où un cambrioleur s&apos;inspire d&apos;Arsène Lupin… »
        </blockquote>
        <span>
          <h3 className={`${titre} text-lumiere`}>Retrouver un titre</h3>
          <p className="mt-1.5 max-w-[32ch] text-[14.5px] text-[#E6D5CE]">Décrivez l&apos;histoire, l&apos;IA retrouve le titre.</p>
        </span>
      </Link>
    </section>
  );
}
