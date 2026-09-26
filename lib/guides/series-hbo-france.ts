import type { Guide } from "../guides";

/**
 * Faits vérifiés le 2026-09-26 (voir `sources`) : fin de l'accord OCS/HBO le
 * 31 décembre 2022 ; The Last of Us sur Prime Video dès le 16 janvier 2023 ;
 * Pass Warner sur Prime Video le 16 mars 2023 ; lancement de Max le 11 juin
 * 2024 (accord avec Canal+) ; retour au nom HBO Max le 9 juillet 2025.
 * Disponibilité actuelle : fiche StreamActu.fr (JustWatch via TMDB) du jour.
 */
export const GUIDE_SERIES_HBO_FRANCE: Guide = {
  slug: "series-hbo-france",
  titre: "Où regarder les séries HBO en France",
  description:
    "Les séries HBO sont sur HBO Max en France, aussi proposé en chaîne sur Prime Video. OCS, Prime Video, Max : l'histoire des droits HBO depuis 2022.",
  chapo:
    "En France, les séries HBO se regardent sur HBO Max, la plateforme de Warner Bros. Discovery lancée le 11 juin 2024 sous le nom de Max et rebaptisée HBO Max le 9 juillet 2025. Elle est aussi proposée en chaîne sur Prime Video. Avant elle, les séries HBO sont passées par OCS jusqu'à fin 2022, puis par Prime Video en 2023.",
  publie: "2026-09-26",
  misAJour: "2026-09-26",
  sections: [
    {
      titre: "Aujourd'hui : HBO Max",
      blocs: [
        {
          p: "HBO Max rassemble les séries HBO, récentes et anciennes, les films Warner Bros. et DC, et des programmes Discovery. Les nouvelles saisons HBO y sortent au rythme d'un épisode par semaine, en général peu après leur diffusion aux États-Unis.",
        },
        {
          p: "On peut s'y abonner directement, ou l'ajouter à un abonnement Prime Video sous forme de chaîne. Au 26 septembre 2026, la fiche de [A Knight of the Seven Kingdoms](/serie/a-knight-of-the-seven-kingdoms-224372), la série de l'univers Game of Thrones sortie en 2026, indique ainsi deux accès : HBO Max et la chaîne HBO Max sur Prime Video. À son lancement, la plateforme était aussi incluse dans des offres Canal+ ; ces offres groupées évoluent, et le mieux est de vérifier auprès de son opérateur ou de Canal+.",
        },
        {
          p: "Les nouveautés de la plateforme sont suivies chaque jour sur la page [HBO Max](/hbo-max), avec les [nouvelles séries HBO Max](/hbo-max/series) et le [récap de l'année](/hbo-max/2026).",
        },
      ],
    },
    {
      titre: "Avant 2023 : OCS",
      blocs: [
        {
          p: "Pendant des années, les séries HBO étaient diffusées en France par OCS, le bouquet de cinéma et de séries d'Orange. Le contrat n'a pas été reconduit et s'est terminé le 31 décembre 2022. Les séries ajoutées moins de deux ans plus tôt sont restées un temps sur OCS, comme la première saison de House of the Dragon ou The White Lotus. Les classiques sont partis : le 2 janvier 2023, Game of Thrones, The Wire, Six Feet Under et Les Soprano n'étaient plus disponibles nulle part en France en streaming.",
        },
        {
          p: "OCS a depuis été racheté par le groupe Canal+.",
        },
      ],
    },
    {
      titre: "2023 : le passage par Prime Video",
      blocs: [
        {
          p: "Warner Bros. Discovery s'est alors tourné vers Amazon. The Last of Us, adaptée du jeu vidéo, est sortie sur Prime Video le 16 janvier 2023, sans supplément pour les abonnés, chaque épisode arrivant en version française et sous-titrée au lendemain de la diffusion américaine. À partir du 16 mars 2023, un Pass Warner, vendu en option sur Prime Video, a rassemblé les séries HBO et les chaînes du groupe.",
        },
      ],
    },
    {
      titre: "Depuis juin 2024 : Max, puis HBO Max",
      blocs: [
        {
          p: "Le 11 juin 2024, Warner Bros. Discovery lance en France sa propre plateforme, Max, avec un accord de distribution pluriannuel avec Canal+. Le 9 juillet 2025, Max reprend le nom de HBO Max, comme dans les autres pays : le catalogue ne change pas, seul le nom et le logo changent. StreamActu.fr a suivi le 2 août 2026 : l'adresse de la page est devenue /hbo-max.",
        },
      ],
    },
    {
      titre: "Pourquoi une série HBO peut être ailleurs",
      blocs: [
        {
          p: "Toutes les séries estampillées HBO ne sont pas forcément sur HBO Max : certaines ont été coproduites avec d'autres diffuseurs, ou vendues avant le lancement de la plateforme, et leurs droits en France appartiennent à quelqu'un d'autre pour la durée du contrat. Le guide [pourquoi un film quitte une plateforme](/guides/film-quitte-plateforme) explique ce mécanisme de licences. Pour savoir où se trouve une série précise, sa fiche sur StreamActu.fr affiche chaque jour les plateformes où elle est disponible par abonnement.",
        },
      ],
    },
  ],
  faq: [
    {
      q: "Où regarder les séries HBO en France ?",
      r: "Sur HBO Max, par abonnement direct ou en chaîne sur Prime Video. La plateforme s'appelait Max entre son lancement en France, le 11 juin 2024, et le 9 juillet 2025.",
    },
    {
      q: "Les séries HBO sont-elles encore sur OCS ?",
      r: "Non pour les nouveautés. Le contrat entre HBO et OCS s'est terminé le 31 décembre 2022, et OCS a depuis été racheté par le groupe Canal+.",
    },
    {
      q: "Faut-il un abonnement Prime Video pour regarder HBO Max ?",
      r: "Non. HBO Max s'abonne directement. La chaîne HBO Max proposée dans Prime Video est une autre façon d'y accéder, qui s'ajoute à un abonnement Prime.",
    },
  ],
  sources: [
    { titre: "iGeneration, « Une grosse partie du catalogue de HBO quitte OCS », 2 janvier 2023", url: "https://www.igen.fr/services/2023/01/une-grosse-partie-du-catalogue-de-hbo-quitte-ocs-134679" },
    { titre: "iGeneration, « Les séries HBO migrent sur Prime Video : The Last of Us disponible sans surcoût », janvier 2023", url: "https://www.igen.fr/services/2023/01/les-series-hbo-migrent-sur-prime-video-last-us-disponible-sans-surcout-134897" },
    { titre: "Univers Freebox, « Max (HBO) débarquera en France le 11 juin, accord particulier avec Canal+ », 7 mai 2024", url: "https://www.universfreebox.com/article/565261/canal-annonce-le-lancement-de-max-hbo-dans-ses-offres-des-le-11-juin-prochain" },
    { titre: "Journal du Geek, « Max disparaît en France, voici HBO Max », 9 juillet 2025", url: "https://www.journaldugeek.com/2025/07/09/max-disparait-en-france-voici-hbo-max/" },
  ],
};
