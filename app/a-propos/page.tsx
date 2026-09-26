import type { Metadata } from "next";
import Link from "next/link";
import { PLATEFORMES } from "@/lib/plateformes";

const DESCRIPTION =
  "StreamActu.fr recense chaque jour les nouveautés du streaming en France : ce que fait le site, qui l'édite, d'où viennent les données et leur mise à jour.";

export const metadata: Metadata = {
  title: "À propos",
  description: DESCRIPTION,
  alternates: { canonical: "/a-propos" },
  openGraph: {
    title: "À propos | StreamActu.fr",
    description: DESCRIPTION,
    images: ["/og-default.png"],
  },
};

const styleProse = {
  fontFamily: "var(--font-newsreader), serif",
  fontSize: "17px",
} as const;

export default function AProposPage() {
  return (
    <div className="sa-container py-10 max-w-2xl space-y-10">
      <div>
        <p className="font-mono-label text-ink-3 mb-3">Le site</p>
        <h1 className="text-4xl font-extrabold tracking-[-0.025em]">À propos de StreamActu.fr</h1>
      </div>

      <section className="space-y-4 border-t border-border pt-6">
        <h2 className="font-mono-label text-[#9A9282]">Ce que fait StreamActu.fr</h2>
        <p className="text-[#C4BBA9] leading-relaxed" style={styleProse}>
          StreamActu.fr recense chaque jour les nouvelles séries et films disponibles en
          streaming par abonnement en France, sur les sept grandes plateformes :{" "}
          {PLATEFORMES.map((pf) => pf.nom).join(", ")}. Chaque fiche indique la note des
          spectateurs, le casting, la bande-annonce et les plateformes où regarder le titre.
          Les classements mensuels et annuels sont établis d&apos;après la note des
          spectateurs, pondérée par le nombre de votes.
        </p>
      </section>

      <section className="space-y-4 border-t border-border pt-6">
        <h2 className="font-mono-label text-[#9A9282]">D&apos;où viennent les données</h2>
        <p className="text-[#C4BBA9] leading-relaxed" style={styleProse}>
          Les informations sur les titres (synopsis, affiches, notes, casting, dates) et les
          disponibilités par plateforme proviennent de{" "}
          <a
            href="https://www.themoviedb.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            The Movie Database (TMDB)
          </a>{" "}
          (source des disponibilités : JustWatch). Le périmètre est le catalogue français,
          par abonnement uniquement — ni location, ni achat. Le site est mis à jour chaque
          jour, automatiquement.
        </p>
      </section>

      <section className="space-y-4 border-t border-border pt-6">
        <h2 className="font-mono-label text-[#9A9282]">Qui édite le site</h2>
        <p className="text-[#C4BBA9] leading-relaxed" style={styleProse}>
          StreamActu.fr est un site indépendant de veille streaming, édité en France. Il
          n&apos;est affilié à aucune plateforme de diffusion et ne diffuse lui-même aucun
          contenu : il indique où regarder légalement chaque titre. Les détails juridiques
          sont dans les{" "}
          <Link href="/mentions-legales" className="text-primary underline">
            mentions légales
          </Link>
          .
        </p>
      </section>

      <section className="space-y-4 border-t border-border pt-6">
        <h2 className="font-mono-label text-[#9A9282]">Suivre les nouveautés</h2>
        <p className="text-[#C4BBA9] leading-relaxed" style={styleProse}>
          Les sorties des sept derniers jours sont disponibles dans le{" "}
          <a href="/flux.xml" className="text-primary underline">
            flux RSS
          </a>
          , et le calendrier des sorties annoncées sur la page{" "}
          <Link href="/prochaines-sorties" className="text-primary underline">
            prochaines sorties
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
