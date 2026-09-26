import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES, MIN_GUIDES_INDEX } from "@/lib/guides";
import { metadonnees } from "@/lib/meta";
import { formatDateFR } from "@/lib/utils";

export const metadata: Metadata = metadonnees(
  "Guides streaming",
  "Les guides de StreamActu.fr : comment sont faits les classements, quelle plateforme choisir, où trouver une série en France. Méthode et sources indiquées.",
  "/guides",
  // Une liste d'un ou deux liens est trop maigre pour l'index
  GUIDES.length < MIN_GUIDES_INDEX ? { robots: { index: false, follow: true } } : {}
);

export default function GuidesPage() {
  const guides = [...GUIDES].sort((a, b) => b.misAJour.localeCompare(a.misAJour));
  return (
    <div className="sa-container py-10 max-w-2xl space-y-10">
      <div className="space-y-4">
        <p className="font-mono-label text-ink-3">Le site</p>
        <h1 className="text-4xl font-extrabold tracking-[-0.025em]">Guides</h1>
        <p className="text-[#C4BBA9] leading-relaxed" style={{ fontFamily: "var(--font-newsreader), serif", fontSize: "17px" }}>
          Des guides durables, mis à jour quand les faits changent. Chacun s&apos;appuie sur les données
          du site et cite ses sources extérieures. Ils sont signés par l&apos;éditeur du site et rédigés
          avec l&apos;aide de Claude, puis vérifiés ; le détail est sur la page{" "}
          <Link href="/a-propos#ia" className="text-primary underline">
            à propos
          </Link>
          .
        </p>
      </div>

      <ul className="space-y-6">
        {guides.map((g) => (
          <li key={g.slug} className="border-t border-border pt-5 space-y-2">
            <Link href={`/guides/${g.slug}`} className="text-xl font-bold hover:text-primary transition-colors">
              {g.titre} →
            </Link>
            <p className="text-[15px] leading-relaxed text-[#9A9282]" style={{ fontFamily: "var(--font-newsreader), serif" }}>
              {g.description}
            </p>
            <p className="font-mono-label text-ink-3">Mis à jour le {formatDateFR(g.misAJour)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
