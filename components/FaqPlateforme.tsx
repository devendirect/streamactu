import Link from "next/link";
import type { Contenu, Plateforme } from "@/types";
import { libelleComptes, scoreBayesien } from "@/lib/utils";
import { jsonLdFaq } from "@/lib/seo";
import { accord } from "@/lib/meta";
import Icone from "@/components/Icone";

interface Props {
  plateforme: Plateforme;
  series: Contenu[];
  films: Contenu[];
  /** "cette semaine" | "ces quatre dernières semaines" */
  periodeIntro: string;
  /** Comptes réels TMDB (les listes sont plafonnées à 20 titres par type) */
  totaux?: { series: number; films: number };
}

interface Entree {
  question: string;
  reponse: string;
  lien?: { href: string; label: string };
}

const parNote = (a: Contenu, b: Contenu) =>
  scoreBayesien(b.note, b.nbVotes) - scoreBayesien(a.note, a.nbVotes);

/**
 * FAQ des pages plateformes — les questions reprennent les formulations des
 * requêtes utilisateurs dans les moteurs et assistants IA, les réponses sont
 * des phrases complètes et datées, citables telles quelles.
 */
export default function FaqPlateforme({ plateforme, series, films, periodeIntro, totaux }: Props) {
  const nom = plateforme.nom;
  const tous = [...series, ...films].sort(parNote);
  const entrees: Entree[] = [];

  const nbSeries = totaux?.series ?? series.length;
  const nbFilms = totaux?.films ?? films.length;
  const comptes = libelleComptes(nbSeries, nbFilms);
  const tronquee = nbSeries + nbFilms > series.length + films.length;
  const exemples = tous.slice(0, 3).map((c) => `« ${c.titre} »`);
  entrees.push({
    question: `Quelles sont les nouveautés ${nom} en ce moment ?`,
    reponse:
      tous.length > 0
        ? `${comptes} ${nbSeries + nbFilms > 1 ? "sont" : "est"} sorti${accord(nbSeries, nbFilms)} ${periodeIntro} sur ${nom} en France${
            nbSeries > 0 ? " (nouvelles séries ou nouveaux épisodes)" : ""
          }, dont ${exemples.join(", ")}. ${
            tronquee
              ? "Les plus populaires sont présentés sur cette page, triés par note des spectateurs."
              : "La liste complète, triée par note des spectateurs, est présentée sur cette page."
          }`
        : `Aucune sortie n'a été recensée ces dernières semaines sur ${nom} en France. Les archives des mois précédents restent consultables sur cette page.`,
  });

  const meilleureSerie = [...series].sort(parNote)[0];
  if (meilleureSerie) {
    entrees.push({
      question: `Quelle série regarder sur ${nom} en ce moment ?`,
      reponse: `Parmi les sorties récentes sur ${nom}, la série la mieux notée par les spectateurs est « ${meilleureSerie.titre} » (${meilleureSerie.note.toFixed(1)}/10 sur TMDB).`,
      lien: { href: `/serie/${meilleureSerie.slug}`, label: `Voir la fiche` },
    });
  }

  const meilleurFilm = [...films].sort(parNote)[0];
  if (meilleurFilm) {
    entrees.push({
      question: `Quel film regarder sur ${nom} en ce moment ?`,
      reponse: `Parmi les films sortis récemment sur ${nom}, le mieux noté par les spectateurs est « ${meilleurFilm.titre} » (${meilleurFilm.note.toFixed(1)}/10 sur TMDB).`,
      lien: { href: `/film/${meilleurFilm.slug}`, label: `Voir la fiche` },
    });
  }

  entrees.push({
    question: `Quand sortent les prochains films et séries sur ${nom} ?`,
    reponse: `Le calendrier des sorties ${nom} annoncées en France (nouvelles séries et films) est actualisé plusieurs fois par jour sur la page des prochaines sorties. Les nouveaux épisodes des séries déjà lancées apparaissent, eux, dans les nouveautés du jour de leur sortie.`,
    lien: { href: `/${plateforme.slug}/prochaines-sorties`, label: `Prochaines sorties ${nom}` },
  });

  entrees.push({
    question: "À quelle fréquence ces informations sont-elles mises à jour ?",
    reponse: `Chaque jour. Les données proviennent de TMDB et couvrent le catalogue ${nom} disponible en France par abonnement.`,
  });

  return (
    <section aria-labelledby="faq-plateforme">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdFaq(entrees.map(({ question, reponse }) => ({ question, reponse }))),
        }}
      />
      <h2 id="faq-plateforme" className="mb-3.5 text-[clamp(20px,1.7vw,24px)] font-extrabold tracking-[-0.015em]">
        Questions fréquentes
      </h2>
      {/* Accordéon : les réponses restent dans le HTML (moteurs, lecture sans JavaScript) */}
      <div className="max-w-[820px]">
        {entrees.map((e) => (
          <details key={e.question} className="group border-t border-trait last:border-b">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-[18px] text-[17px] font-bold [&::-webkit-details-marker]:hidden">
              <h3>{e.question}</h3>
              <Icone
                nom="bas"
                taille={20}
                className="flex-none text-texte-2 transition-transform duration-300 ease-salle group-open:rotate-180"
              />
            </summary>
            <p className="max-w-[68ch] pb-5 leading-[1.6] text-texte-doux">
              {e.reponse}
              {e.lien && (
                <>
                  {" "}
                  <Link
                    href={e.lien.href}
                    className="text-white underline decoration-ambre/60 underline-offset-4 transition-[text-decoration-color] duration-200 hover:decoration-ambre"
                  >
                    {e.lien.label}
                  </Link>
                </>
              )}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
