import type { Metadata } from "next";
import Link from "next/link";
import { metadonnees, metaAccueil } from "@/lib/meta";
import { getNouveautesJour, getNouveautesSemaine, getSortiesAVenir } from "@/lib/tmdb";
import { aplatir, getUne, parScore, top10Series } from "@/lib/accueil";
import { GENRES_SEO } from "@/lib/genres";
import { getISOWeek, toISO, formatJourSemaineFR } from "@/lib/utils";
import UneCarrousel from "@/components/accueil/UneCarrousel";
import RangeeMesSeries from "@/components/accueil/RangeeMesSeries";
import BanniereWeekend from "@/components/accueil/BanniereWeekend";
import Decouvrir from "@/components/accueil/Decouvrir";
import FiltresRangees from "@/components/FiltresRangees";
import Rangee from "@/components/Rangee";
import CarteAffiche from "@/components/CarteAffiche";
import CartePaysage from "@/components/CartePaysage";
import Top10Velours from "@/components/Top10Velours";
import TexteEditorial from "@/components/TexteEditorial";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const { titre, description } = metaAccueil();
  return metadonnees(titre, description, "/");
}

const JOURS_COURTS = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."];

/** « jeu. 29 » : badge des sorties à venir */
function jourCourt(iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`);
  return `${JOURS_COURTS[d.getUTCDay()]} ${d.getUTCDate()}`;
}

/** Rangées de plus de MAX titres : la page complète est au bout du lien */
const MAX = 20;

export default async function HomePage() {
  const maintenant = new Date();
  const aujourdhui = toISO(maintenant);
  const { semaine, annee } = getISOWeek(maintenant);

  const [jour, semaineData, aVenir] = await Promise.all([
    getNouveautesJour(aujourdhui),
    getNouveautesSemaine(semaine, annee),
    getSortiesAVenir(),
  ]);

  const duJour = parScore(aplatir(jour));
  const seriesSemaine = aplatir(semaineData, "series");
  const filmsSemaine = parScore(aplatir(semaineData, "films"));
  const toutSemaine = parScore(aplatir(semaineData));
  const top10 = top10Series(seriesSemaine);
  const bientot = aplatir(aVenir)
    .filter((c) => c.dateSortie)
    .sort((a, b) => (a.dateSortie ?? "").localeCompare(b.dateSortie ?? ""))
    .slice(0, MAX);
  const une = await getUne(seriesSemaine);

  // Affiches des tuiles « Découvrir » : prises dans la semaine, jamais le jeu du jour
  const affiches = toutSemaine.flatMap((c) => (c.poster ? [c.poster] : []));

  return (
    <>
      {/* La une passe sous l'en-tête fixe */}
      <div className="-mt-entete">
        <UneCarrousel diapos={une} />
      </div>

      {/* La première rangée remonte sur le bas de la une */}
      <div
        className={`relative z-[5] ${
          une.length > 0 ? "mt-[clamp(-290px,-30vh,-230px)] max-[760px]:-mt-[150px]" : "pt-10"
        }`}
      >
        <div className="mb-7">
          <FiltresRangees />
        </div>

        <div data-rangees>
          <RangeeMesSeries seriesSemaine={seriesSemaine} />

          <Rangee
            niveau={1}
            titre={`Nouveautés streaming du ${formatJourSemaineFR(maintenant).toLowerCase()}`}
            sous={duJour.length === 0 ? "Pas encore de sortie aujourd'hui sur les sept plateformes." : undefined}
          >
            {duJour.slice(0, MAX).map((c, i) => (
              <CarteAffiche key={`${c.type}-${c.id}`} contenu={c} priorite={une.length === 0 && i < 4} />
            ))}
          </Rangee>

          <Rangee titre="Sortis cette semaine">
            {toutSemaine.slice(0, MAX).map((c) => (
              <CarteAffiche key={`${c.type}-${c.id}`} contenu={c} />
            ))}
          </Rangee>

          <Top10Velours titre="Top 10 des séries de la semaine" contenus={top10} />

          <BanniereWeekend image={une[0]?.fond ?? null} />

          {bientot.length > 0 && (
            <Rangee titre="Bientôt sur vos plateformes" href="/prochaines-sorties">
              {bientot.map((c) => (
                <CarteAffiche key={`${c.type}-${c.id}`} contenu={c} badge={jourCourt(c.dateSortie!)} />
              ))}
            </Rangee>
          )}

          {semaineData.map(({ plateforme, series, films }) => {
            const liste = [...series, ...films].sort((a, b) => b.note - a.note).map((c) => ({ ...c, plateforme }));
            if (liste.length < 3) return null;
            return (
              <Rangee key={plateforme.id} titre={`Nouveautés ${plateforme.nom}`} href={`/${plateforme.slug}`}>
                {liste.slice(0, MAX).map((c) => (
                  <CarteAffiche key={`${c.type}-${c.id}`} contenu={c} />
                ))}
              </Rangee>
            );
          })}

          <Decouvrir jeu={affiches[3] ?? null} pile={affiches.slice(0, 3)} />

          {filmsSemaine.length > 0 && (
            <Rangee titre="Films de la semaine" paysage>
              {filmsSemaine.slice(0, MAX).map((c) => (
                <CartePaysage key={c.id} contenu={c} />
              ))}
            </Rangee>
          )}
        </div>

        <section aria-labelledby="genres-titre" className="mb-section">
          <h2 id="genres-titre" className="mb-3 px-gouttiere text-[clamp(19px,1.6vw,23px)] leading-[1.2] font-bold tracking-[-0.01em]">
            Parcourir par genre
          </h2>
          <div className="flex flex-wrap gap-2 px-gouttiere">
            {GENRES_SEO.map((g) => (
              <Link key={g.slug} href={`/genre/${g.slug}`} className="puce">
                {g.nom}
              </Link>
            ))}
          </div>
        </section>

        <div className="px-gouttiere pb-10">
          <TexteEditorial
            titre="Comment lire cette page"
            paragraphes={[
              "Chaque jour, StreamActu.fr liste les séries et films qui sortent sur sept plateformes par abonnement disponibles en France, plateforme par plateforme. Une série apparaît le jour où un nouvel épisode est mis en ligne, un film le jour de sa sortie. Dans chaque plateforme, les titres sont triés par note des spectateurs sur TMDB.",
              "Pour voir plus loin, chaque plateforme a sa page avec les nouveautés de la semaine et ses archives mois par mois. Le calendrier des prochaines sorties couvre les quatre semaines à venir, et les tops classent les titres les mieux notés de l'année. Les données viennent de TMDB et JustWatch ; la méthode et les limites du site sont expliquées sur la page à propos.",
            ]}
            liens={[
              { href: "/prochaines-sorties", label: "Prochaines sorties" },
              { href: `/top/series-${maintenant.getUTCFullYear()}`, label: `Top séries ${maintenant.getUTCFullYear()}` },
              { href: "/a-propos#methode", label: "Méthode et limites" },
            ]}
          />
        </div>
      </div>
    </>
  );
}
