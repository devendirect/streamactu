import type { Metadata } from "next";
import { metadonnees, metaAccueil } from "@/lib/meta";
import { getNouveautesJour } from "@/lib/tmdb";
import { toISO, formatJourSemaineFR } from "@/lib/utils";
import AccueilClient from "@/components/AccueilClient";
import EnTeteNouveautes from "@/components/EnTeteNouveautes";
import TexteEditorial from "@/components/TexteEditorial";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const { titre, description } = metaAccueil();
  return metadonnees(titre, description, "/");
}

export default async function HomePage() {
  const maintenant = new Date();
  const aujourdhui = toISO(maintenant);
  const nouveautes = await getNouveautesJour(aujourdhui);

  return (
    <>
      <EnTeteNouveautes
        titre={`Nouveautés streaming du ${formatJourSemaineFR(maintenant).toLowerCase()}`}
        intro="Les séries et films qui sortent aujourd'hui sur Netflix, Prime Video, Disney+, Apple TV+, Canal+, HBO Max et Paramount+, mis à jour chaque jour."
      />
      <AccueilClient
        plateformes={nouveautes}
        contexte={{ mode: "jour", dateISO: aujourdhui }}
      />
      <div className="sa-container pb-10">
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
    </>
  );
}
