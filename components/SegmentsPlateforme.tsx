import Link from "next/link";
import type { Plateforme } from "@/types";

type Vue = "nouveautes" | "series" | "films" | "prochaines-sorties";

/** Segments d'une plateforme : Nouveautés, Séries, Films, Prochaines sorties (chacun est une page) */
export default function SegmentsPlateforme({ pf, actif }: { pf: Plateforme; actif?: Vue }) {
  const vues: { vue: Vue; href: string; label: string }[] = [
    { vue: "nouveautes", href: `/${pf.slug}`, label: "Nouveautés" },
    { vue: "series", href: `/${pf.slug}/series`, label: "Nouvelles séries" },
    { vue: "films", href: `/${pf.slug}/films`, label: "Nouveaux films" },
    { vue: "prochaines-sorties", href: `/${pf.slug}/prochaines-sorties`, label: "Prochaines sorties" },
  ];
  return (
    <nav aria-label={`Vues ${pf.nom}`} className="max-w-full overflow-x-auto">
      <div className="segments">
        {vues.map((v) => (
          <Link key={v.vue} href={v.href} aria-current={actif === v.vue ? "page" : undefined}>
            {v.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
