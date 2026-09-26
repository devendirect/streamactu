import type { Metadata } from "next";
import Link from "next/link";
import { PLATEFORMES } from "@/lib/plateformes";
import { metadonnees } from "@/lib/meta";
import { CONTACT_EMAIL, ORG_ID, SITE_URL } from "@/lib/site";

const DESCRIPTION =
  "Qui édite StreamActu.fr, d'où viennent les données, comment sont faits les classements, ce que le site ne sait pas faire et comment il est financé.";

export const metadata: Metadata = metadonnees("À propos", DESCRIPTION, "/a-propos");

const styleProse = {
  fontFamily: "var(--font-newsreader), serif",
  fontSize: "17px",
} as const;

const classeProse = "text-[#C4BBA9] leading-relaxed";
const classeLien = "text-primary underline";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "À propos de StreamActu.fr",
  url: `${SITE_URL}/a-propos`,
  description: DESCRIPTION,
  inLanguage: "fr-FR",
  about: { "@id": ORG_ID },
  publisher: { "@id": ORG_ID },
};

function Section({ id, titre, children }: { id: string; titre: string; children: React.ReactNode }) {
  return (
    <section id={id} className="space-y-4 border-t border-border pt-6 scroll-mt-24">
      <h2 className="font-mono-label text-[#9A9282]">{titre}</h2>
      {children}
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className={classeProse} style={styleProse}>
      {children}
    </p>
  );
}

export default function AProposPage() {
  return (
    <div className="sa-container py-10 max-w-2xl space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <div>
        <p className="font-mono-label text-ink-3 mb-3">Le site</p>
        <h1 className="text-4xl font-extrabold tracking-[-0.025em]">À propos de StreamActu.fr</h1>
      </div>

      <Section id="site" titre="Ce que fait StreamActu.fr">
        <P>
          StreamActu.fr recense chaque jour les nouvelles séries et films disponibles en
          streaming par abonnement en France, sur les sept grandes plateformes :{" "}
          {PLATEFORMES.map((pf) => pf.nom).join(", ")}. Chaque fiche indique la note des
          spectateurs, le casting, la bande-annonce et les plateformes où regarder le titre.
          Le site ne diffuse aucun contenu : il indique où regarder légalement chaque titre.
        </P>
      </Section>

      <Section id="qui" titre="Qui édite le site">
        <P>
          StreamActu.fr est un projet personnel, tenu par un développeur web indépendant sur
          son temps libre. Il n&apos;est affilié à aucune
          plateforme de diffusion. L&apos;éditeur reste anonyme, comme la loi le permet aux
          éditeurs non professionnels ; son identité est connue de l&apos;hébergeur (voir les{" "}
          <Link href="/mentions-legales" className={classeLien}>
            mentions légales
          </Link>
          ). Pour le joindre :{" "}
          <Link href="/contact" className={classeLien}>
            page contact
          </Link>{" "}
          ou <a href={`mailto:${CONTACT_EMAIL}`} className={classeLien}>{CONTACT_EMAIL}</a>.
        </P>
      </Section>

      <Section id="methode" titre="D'où viennent les données, et comment elles sont classées">
        <P>
          Les informations sur les titres (synopsis, affiches, notes, casting, dates)
          proviennent de{" "}
          <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className={classeLien}>
            The Movie Database (TMDB)
          </a>
          , une base collaborative. Les disponibilités par plateforme viennent de JustWatch,
          via TMDB. Le périmètre est le catalogue français, par abonnement uniquement : ni
          location, ni achat. Rien n&apos;est saisi à la main : les pages du jour et de la
          semaine sont recalculées toutes les heures, le calendrier des sorties toutes les six
          heures, les archives et les classements une fois par jour.
        </P>
        <P>
          <strong className="text-foreground">Les listes de nouveautés</strong> sont triées
          par note des spectateurs TMDB.{" "}
          <strong className="text-foreground">Les classements</strong> (tops du mois et de
          l&apos;année) utilisent une note pondérée par le nombre de votes. Sans elle, un
          titre noté 9/10 par 12 personnes passerait devant un classique noté 8,5 par
          20 000 personnes. Chaque note est donc mélangée à une note de référence de 7/10,
          comme si le titre avait reçu 100 votes de plus à 7 : (note × votes + 7 × 100) ÷
          (votes + 100). Le 9/10 à 12 votes tombe à 7,2 ; le 8,5 à 20 000 votes reste à 8,5.
          Le top de l&apos;année ne retient en plus que les titres ayant au moins 200 votes.
        </P>
        <P>
          Pour éviter les pages presque vides, certaines ne sont pas publiées : un croisement
          genre × plateforme de moins de cinq titres, un top de moins de cinq titres, une
          archive mensuelle sans aucune sortie. Les jours de moins de trois sorties restent
          consultables mais ne sont pas proposés aux moteurs de recherche.
        </P>
      </Section>

      <Section id="limites" titre="Ce que le site ne sait pas faire">
        <P>
          Une nouveauté est datée par sa date de diffusion (épisode d&apos;une série) ou de
          sortie (film) selon TMDB, pas par sa date d&apos;arrivée sur la plateforme. Un film
          sorti au cinéma il y a un an et ajouté à Netflix aujourd&apos;hui n&apos;apparaît donc
          pas dans les nouveautés du jour ; il reste trouvable par la recherche et sur sa fiche.
        </P>
        <P>
          Les disponibilités peuvent avoir quelques jours de décalage avec la plateforme,
          dans un sens ou dans l&apos;autre. Un titre tout juste sorti, avec moins de cinq
          votes sur TMDB, n&apos;apparaît pas encore. Les offres gratuites avec publicité, la
          location et l&apos;achat ne sont pas couverts. Si vous voyez une erreur,{" "}
          <Link href="/contact" className={classeLien}>
            signalez-la
          </Link>
          .
        </P>
      </Section>

      <Section id="ia" titre="Intelligence artificielle">
        <P>
          Deux fonctions utilisent Claude Haiku, un modèle d&apos;Anthropic.{" "}
          <strong className="text-foreground">Convaincs-moi</strong> rédige un court texte
          pour donner envie de regarder un titre, à partir de ses données TMDB.{" "}
          <strong className="text-foreground">Le Retrouveur</strong> propose des titres à partir
          d&apos;une description libre ; le texte que vous tapez est envoyé à Anthropic pour
          cela (détails dans les{" "}
          <Link href="/mentions-legales#rgpd" className={classeLien}>
            mentions légales
          </Link>
          ). Ces textes sont générés automatiquement : ce ne sont pas des avis de
          l&apos;éditeur, et ils peuvent se tromper.
        </P>
        <P>
          Le site lui-même a été développé avec l&apos;aide de Claude, utilisé comme binôme
          pour le code et pour les premières versions des textes des pages, vérifiés avant
          publication. Les listes, fiches et classements ne sont pas rédigés par une IA : ils
          sont calculés à partir des données TMDB.
        </P>
      </Section>

      <Section id="financement" titre="Financement">
        <P>
          Aucun. Le site n&apos;affiche pas de publicité, ne contient pas de lien affilié et
          ne reçoit rien des plateformes : les liens vers Netflix ou Disney+ ne rapportent
          rien. C&apos;est aussi une condition d&apos;utilisation de l&apos;API TMDB, réservée
          aux usages non commerciaux. Les frais (serveur, appels à l&apos;IA) sont payés par
          l&apos;éditeur.
        </P>
      </Section>

      <Section id="suivre" titre="Suivre les nouveautés">
        <P>
          Les sorties des sept derniers jours sont disponibles dans le{" "}
          <a href="/flux.xml" className={classeLien}>
            flux RSS
          </a>
          , et le calendrier des sorties annoncées sur la page{" "}
          <Link href="/prochaines-sorties" className={classeLien}>
            prochaines sorties
          </Link>
          .
        </P>
      </Section>
    </div>
  );
}
