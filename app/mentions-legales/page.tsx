import type { Metadata } from "next";

const DESCRIPTION = "Informations légales, données personnelles et attribution TMDB pour StreamActu.fr.";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: DESCRIPTION,
  alternates: { canonical: "/mentions-legales" },
  openGraph: {
    title: "Mentions légales | StreamActu.fr",
    description: DESCRIPTION,
    images: ["/og-default.png"],
  },
};

export default function MentionsLegalesPage() {
  return (
    <div className="sa-container py-10 max-w-2xl space-y-10">
      <div>
        <p className="font-mono-label text-ink-3 mb-3">Informations légales</p>
        <h1 className="text-4xl font-extrabold tracking-[-0.025em]">Mentions légales</h1>
      </div>

      <section className="space-y-4 border-t border-border pt-6">
        <h2 className="font-mono-label text-[#9A9282]">Éditeur</h2>
        <p className="text-[#C4BBA9] leading-relaxed" style={{ fontFamily: "var(--font-newsreader), serif", fontSize: "17px" }}>
          StreamActu.fr est un site personnel de veille streaming. Il n&apos;est affilié à aucune plateforme de diffusion (Netflix, Prime Video, Disney+, Apple TV+, Canal+, HBO Max, Paramount+).
        </p>
      </section>

      <section className="space-y-4 border-t border-border pt-6">
        <h2 className="font-mono-label text-[#9A9282]">Données & API TMDB</h2>
        <p className="text-[#C4BBA9] leading-relaxed" style={{ fontFamily: "var(--font-newsreader), serif", fontSize: "17px" }}>
          Les données sur les séries et films (titres, synopsis, affiches, notes, casting) sont fournies par{" "}
          <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="text-primary underline">
            The Movie Database (TMDB)
          </a>
          .
        </p>
        <div className="border border-border/50 p-4 font-mono text-sm text-[#9A9282] leading-relaxed">
          <p className="font-semibold text-foreground mb-1">Attribution obligatoire</p>
          <p>
            This product uses the TMDB API but is not endorsed or certified by TMDB.<br />
            Données &amp; visuels fournis par TMDB. Ce produit utilise l&apos;API de TMDB mais n&apos;est ni approuvé ni certifié par TMDB.
          </p>
        </div>
      </section>

      <section className="space-y-4 border-t border-border pt-6">
        <h2 className="font-mono-label text-[#9A9282]">Intelligence artificielle</h2>
        <p className="text-[#C4BBA9] leading-relaxed" style={{ fontFamily: "var(--font-newsreader), serif", fontSize: "17px" }}>
          La fonctionnalité « Convaincs-moi » utilise l&apos;API Anthropic (Claude Haiku) pour générer un texte persuasif sur un contenu. Les textes générés sont produits par une IA et ne reflètent pas l&apos;avis de l&apos;éditeur.
        </p>
      </section>

      <section className="space-y-4 border-t border-border pt-6" id="rgpd">
        <h2 className="font-mono-label text-[#9A9282]">Données personnelles (RGPD)</h2>
        <p className="text-[#C4BBA9] leading-relaxed" style={{ fontFamily: "var(--font-newsreader), serif", fontSize: "17px" }}>
          <strong className="text-foreground">Mesure d&apos;audience.</strong> Avec votre
          consentement uniquement, le site utilise Google Analytics 4 pour compter les
          visites et comprendre quelles pages sont consultées. Tant que vous n&apos;avez
          pas accepté, aucun script Google n&apos;est chargé et aucun cookie n&apos;est
          déposé. Si vous acceptez, des cookies <code>_ga</code> sont déposés (durée
          maximale : 13 mois) et les données sont conservées 14 mois. Vous pouvez retirer
          votre consentement à tout moment via le lien « Gérer les cookies » en pied de
          page — les cookies de mesure sont alors supprimés.
        </p>
        <p className="text-[#C4BBA9] leading-relaxed" style={{ fontFamily: "var(--font-newsreader), serif", fontSize: "17px" }}>
          En dehors de cette mesure d&apos;audience, aucun cookie de traçage n&apos;est
          utilisé. Les données de jeu (Titre du jour, Pochette mystère) sont stockées
          uniquement dans le <em>localStorage</em> de votre navigateur et ne sont jamais
          transmises à nos serveurs. Les adresses IP sont traitées temporairement en
          mémoire pour limiter les abus techniques ; elles ne sont ni enregistrées sur
          disque, ni conservées au-delà de 24 heures, ni transmises à des tiers.
        </p>
      </section>

      <section className="space-y-4 border-t border-border pt-6">
        <h2 className="font-mono-label text-[#9A9282]">Hébergement</h2>
        <p className="text-[#C4BBA9] leading-relaxed" style={{ fontFamily: "var(--font-newsreader), serif", fontSize: "17px" }}>
          Ce site est hébergé sur un VPS avec Plesk. Le serveur est situé en Europe.
        </p>
      </section>
    </div>
  );
}
