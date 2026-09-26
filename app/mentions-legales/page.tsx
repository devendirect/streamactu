import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL, HEBERGEUR, REPO_URL } from "@/lib/site";
import { metadonnees } from "@/lib/meta";

export const metadata: Metadata = metadonnees(
  "Mentions légales",
  "Mentions légales de StreamActu.fr : éditeur, hébergement, données personnelles (RGPD), intelligence artificielle et attribution des données TMDB.",
  "/mentions-legales"
);

const styleProse = {
  fontFamily: "var(--font-newsreader), serif",
  fontSize: "17px",
} as const;

const classeProse = "text-[#C4BBA9] leading-relaxed";

export default function MentionsLegalesPage() {
  return (
    <div className="sa-container py-10 max-w-2xl space-y-10">
      <div>
        <p className="font-mono-label text-ink-3 mb-3">Informations légales</p>
        <h1 className="text-4xl font-extrabold tracking-[-0.025em]">Mentions légales</h1>
      </div>

      <section className="space-y-4 border-t border-border pt-6" id="editeur">
        <h2 className="font-mono-label text-[#9A9282]">Éditeur</h2>
        <p className={classeProse} style={styleProse}>
          StreamActu.fr est édité à titre non professionnel par un particulier. Conformément à
          la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l&apos;économie numérique
          (LCEN), qui permet aux éditeurs non professionnels de préserver leur anonymat, ses
          éléments d&apos;identification personnelle ont été communiqués à l&apos;hébergeur
          mentionné ci-dessous.
        </p>
        <p className={classeProse} style={styleProse}>
          Contact :{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary underline">
            {CONTACT_EMAIL}
          </a>{" "}
          (voir aussi la{" "}
          <Link href="/contact" className="text-primary underline">
            page contact
          </Link>
          ).
        </p>
        <p className={classeProse} style={styleProse}>
          Le site n&apos;est affilié à aucune plateforme de diffusion (Netflix, Prime Video,
          Disney+, Apple TV+, Canal+, HBO Max, Paramount+) et ne diffuse lui-même aucun contenu.
        </p>
      </section>

      <section className="space-y-4 border-t border-border pt-6" id="hebergeur">
        <h2 className="font-mono-label text-[#9A9282]">Hébergement</h2>
        <p className={classeProse} style={styleProse}>
          {HEBERGEUR.nom}
          <br />
          {HEBERGEUR.adresse}
          <br />
          Téléphone : {HEBERGEUR.telephone}
          <br />
          SIREN : {HEBERGEUR.siren}
        </p>
      </section>

      <section className="space-y-4 border-t border-border pt-6">
        <h2 className="font-mono-label text-[#9A9282]">Données &amp; API TMDB</h2>
        <p className={classeProse} style={styleProse}>
          Les données sur les séries et films (titres, synopsis, affiches, notes, casting) sont
          fournies par{" "}
          <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="text-primary underline">
            The Movie Database (TMDB)
          </a>
          . Les disponibilités par plateforme viennent de{" "}
          <a href="https://www.justwatch.com/fr" target="_blank" rel="noopener noreferrer" className="text-primary underline">
            JustWatch
          </a>
          , via TMDB.
        </p>
        <div className="border border-border/50 p-4 font-mono text-sm text-[#9A9282] leading-relaxed">
          <p className="font-semibold text-foreground mb-1">Attribution obligatoire</p>
          <p>
            This product uses the TMDB API but is not endorsed or certified by TMDB.<br />
            Données &amp; visuels fournis par TMDB. Ce produit utilise l&apos;API de TMDB mais n&apos;est ni approuvé ni certifié par TMDB.
          </p>
        </div>
      </section>

      <section className="space-y-4 border-t border-border pt-6" id="ia">
        <h2 className="font-mono-label text-[#9A9282]">Intelligence artificielle</h2>
        <p className={classeProse} style={styleProse}>
          Deux fonctions utilisent l&apos;API d&apos;Anthropic (modèle Claude Haiku).{" "}
          <strong className="text-foreground">Convaincs-moi</strong> rédige un court texte
          persuasif sur un titre, à partir de ses seules données TMDB (titre, synopsis, genres,
          casting) : rien de ce que vous saisissez n&apos;est envoyé.{" "}
          <strong className="text-foreground">Le Retrouveur</strong> envoie à Anthropic le
          texte que vous tapez pour décrire un film ou une série (600 caractères au plus), afin
          de proposer des titres. Les textes générés sont produits par une IA : ils ne
          reflètent pas l&apos;avis de l&apos;éditeur et peuvent contenir des erreurs.
        </p>
      </section>

      <section className="space-y-4 border-t border-border pt-6" id="propriete">
        <h2 className="font-mono-label text-[#9A9282]">Propriété intellectuelle</h2>
        <p className={classeProse} style={styleProse}>
          Le code source du site, textes des pages et des guides compris, est publié sous licence MIT
          sur{" "}
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="text-primary underline">
            GitHub
          </a>
          : vous pouvez le réutiliser en conservant la mention de copyright et le texte de la licence.
          La licence ne couvre pas les données et visuels fournis par TMDB, les disponibilités fournies
          par JustWatch, ni les noms et logos des plateformes, qui restent soumis à leurs propres
          conditions. Le nom et le logo StreamActu.fr ne sont pas couverts non plus.
        </p>
      </section>

      <section className="space-y-4 border-t border-border pt-6" id="rgpd">
        <h2 className="font-mono-label text-[#9A9282]">Données personnelles (RGPD)</h2>
        <p className={classeProse} style={styleProse}>
          <strong className="text-foreground">Mesure d&apos;audience.</strong> Avec votre
          consentement uniquement, le site utilise Google Analytics 4 pour compter les
          visites et comprendre quelles pages sont consultées. Tant que vous n&apos;avez
          pas accepté, aucun script Google n&apos;est chargé et aucun cookie n&apos;est
          déposé. Si vous acceptez, des cookies <code>_ga</code> sont déposés (durée
          maximale : 13 mois) et les données sont conservées 14 mois. Vous pouvez retirer
          votre consentement à tout moment via le lien « Gérer les cookies » en pied de
          page : les cookies de mesure sont alors supprimés.
        </p>
        <p className={classeProse} style={styleProse}>
          <strong className="text-foreground">Texte saisi dans le Retrouveur.</strong> Il est
          transmis à Anthropic (Anthropic PBC, États-Unis), qui agit comme sous-traitant pour
          générer la réponse ; le site ne l&apos;enregistre pas. Aucune donnée personnelle
          n&apos;est demandée : évitez d&apos;en écrire dans ce champ. Le traitement par
          Anthropic est décrit dans sa{" "}
          <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline">
            politique de confidentialité
          </a>
          .
        </p>
        <p className={classeProse} style={styleProse}>
          En dehors de la mesure d&apos;audience, aucun cookie de traçage n&apos;est
          utilisé. Les données de jeu (Titre du jour, Pochette mystère) et votre liste
          « à voir » sont stockées uniquement dans le <em>localStorage</em> de votre
          navigateur et ne sont jamais transmises à nos serveurs. Les adresses IP sont
          traitées temporairement en mémoire pour limiter les abus techniques ; elles ne
          sont ni enregistrées sur disque, ni conservées au-delà de 24 heures, ni
          transmises à des tiers.
        </p>
        <p className={classeProse} style={styleProse}>
          Pour toute question ou pour exercer vos droits (accès, rectification, effacement,
          opposition) :{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary underline">
            {CONTACT_EMAIL}
          </a>
          . Vous pouvez aussi adresser une réclamation à la CNIL.
        </p>
      </section>
    </div>
  );
}
