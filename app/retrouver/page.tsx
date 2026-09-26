import type { Metadata } from "next";
import RetrouveurClient from "@/components/RetrouveurClient";
import TexteEditorial from "@/components/TexteEditorial";
import { metadonnees } from "@/lib/meta";
import { jsonLdFaq } from "@/lib/seo";
import { PLAFONDS_IA_JOUR } from "@/lib/plafonds-ia";

// Indexable depuis le 2026-09-26 : c'est la page cible des annuaires d'outils
// IA (voir docs/seo-geo/backlinks-annuaires.md). Le texte ci-dessous est rendu
// côté serveur ; le formulaire, lui, reste interactif.
export const metadata: Metadata = metadonnees(
  "Retrouver un film ou une série oubliée",
  "Titre oublié ? Décrivez une scène, une ambiance ou un acteur : le Retrouveur propose les films et séries qui correspondent, et où les regarder en France.",
  "/retrouver"
);

const FAQ = [
  {
    question: "Comment retrouver un film dont on a oublié le titre ?",
    reponse:
      "Décrivez ce dont vous vous souvenez, avec vos mots : une scène, l'époque, le pays, un acteur, l'ambiance. Le Retrouveur propose de trois à cinq titres, explique pourquoi chacun correspond et indique où le regarder en streaming en France.",
  },
  {
    question: "Le Retrouveur est-il gratuit ?",
    reponse:
      "Oui, sans compte. Chaque visiteur dispose de cinq recherches par jour, pour limiter le coût des appels à l'intelligence artificielle.",
  },
  {
    question: "Que devient le texte que je tape ?",
    reponse:
      "Il est envoyé à l'API d'Anthropic (modèle Claude Haiku) pour générer la réponse, puis n'est pas enregistré par le site. N'y écrivez pas de données personnelles.",
  },
];

export default function RetrouveurPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdFaq(FAQ) }} />
      <RetrouveurClient />
      <div className="sa-container pb-16 space-y-8">
        <TexteEditorial
          titre="Comment ça marche"
          paragraphes={[
            "Vous décrivez le film ou la série comme vous le raconteriez à un ami, sans chercher de mots-clés. Claude Haiku, un modèle d'intelligence artificielle d'Anthropic, en tire les indices utiles (genre, époque, lieu, intrigue, acteurs), puis propose de trois à cinq titres réels, du plus probable au moins probable, avec une phrase qui explique pourquoi chacun correspond.",
            "Chaque titre proposé est ensuite vérifié dans la base TMDB : affiche, année, note des spectateurs, et plateformes où il est disponible par abonnement en France aujourd'hui. Un interrupteur permet de n'afficher que les titres regardables en streaming en France.",
          ]}
        />
        <TexteEditorial
          titre="Pour de meilleurs résultats"
          paragraphes={[
            "Plus la description est concrète, plus la réponse est juste : une scène précise vaut mieux qu'un adjectif. Donnez ce dont vous êtes sûr (une série plutôt qu'un film, les années 2000, un décor de sous-marin, une actrice rousse), et dites-le quand vous hésitez. Si la première réponse ne convient pas, reformulez en ajoutant un détail plutôt qu'en répétant la même description.",
          ]}
        />
        <TexteEditorial
          titre="Limites"
          paragraphes={[
            `Les propositions sont générées par une IA : elle peut se tromper ou proposer un titre proche du bon. La fiche de chaque titre permet de vérifier. Le service est limité à cinq recherches par jour et par visiteur, et à ${PLAFONDS_IA_JOUR.retrouver} recherches par jour pour l'ensemble du site, pour garder un coût raisonnable sur un site sans publicité. Le texte saisi est envoyé à Anthropic et n'est pas conservé par StreamActu.fr.`,
          ]}
          liens={[
            { href: "/mentions-legales#ia", label: "Traitement du texte saisi" },
            { href: "/a-propos#ia", label: "L'IA sur StreamActu.fr" },
          ]}
        />
      </div>
    </>
  );
}
