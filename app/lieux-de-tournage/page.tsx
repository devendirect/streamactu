import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { metadonnees } from "@/lib/meta";
import { ORG_ID, SITE_URL } from "@/lib/site";
import { formatDateFR, slugify } from "@/lib/utils";
import { ancre, type RegionTournage, type TitreGroupe } from "@/lib/lieux-tournage";
import { donneesLieuxTournage, type DonneesLieuxTournage } from "@/lib/lieux-tournage-donnees";
import EnTeteNouveautes from "@/components/EnTeteNouveautes";
import PastillePlateforme from "@/components/PastillePlateforme";

// Plateformes relues une fois par jour ; lieux importés chaque trimestre
export const revalidate = 86400;

const CHEMIN = "/lieux-de-tournage";
const TITRE = "Lieux de tournage en France : films et séries";
const DESCRIPTION =
  "Où ont été tournés les films et séries disponibles en streaming : Paris, Marseille, Nice, Lyon, outre-mer, région par région, avec leurs plateformes.";
/** Au-delà, les titres d'une liste sont repliés (toujours présents dans la page) */
const VISIBLES = 12;

export function generateMetadata(): Metadata {
  return metadonnees(TITRE, DESCRIPTION, CHEMIN);
}

const H2 = "mb-3.5 scroll-mt-28 text-[clamp(20px,1.7vw,24px)] font-extrabold tracking-[-0.015em]";
const H3 = "mb-2.5 mt-6 scroll-mt-28 text-[17px] font-bold";

function pluriel(n: number, mot: string): string {
  return `${n.toLocaleString("fr-FR")} ${mot}${n > 1 ? "s" : ""}`;
}

function LigneTitre({ t, d, ou }: { t: TitreGroupe; d: DonneesLieuxTournage; ou: boolean }) {
  const pf = d.plateformes.get(`${t.type}-${t.id}`) ?? [];
  return (
    <li className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-trait py-2.5 text-[15.5px]">
      <Link href={`/${t.type}/${slugify(t.titre)}-${t.id}`} className="font-semibold hover:text-ambre">
        {t.titre}
      </Link>
      <span className="tabular text-[13.5px] text-texte-2">
        {t.type === "serie" ? "série" : "film"}
        {t.annee ? ` · ${t.annee}` : ""}
        {ou && t.ou.length > 0 ? ` · ${t.ou.join(", ")}` : ""}
      </span>
      <span className="flex flex-wrap gap-x-3 text-[13px] text-texte-doux">
        {pf.map((p) => (
          <PastillePlateforme key={p.id} pf={p} />
        ))}
      </span>
    </li>
  );
}

function ListeTitres({ titres, d, ou = false }: { titres: TitreGroupe[]; d: DonneesLieuxTournage; ou?: boolean }) {
  const visibles = titres.slice(0, VISIBLES);
  const replies = titres.slice(VISIBLES);
  return (
    <>
      <ul>
        {visibles.map((t) => (
          <LigneTitre key={`${t.type}-${t.id}`} t={t} d={d} ou={ou} />
        ))}
      </ul>
      {replies.length > 0 && (
        // Repliés mais dans le HTML : lus par les moteurs et sans JavaScript
        <details className="group">
          <summary className="cursor-pointer py-2.5 text-[14.5px] text-texte-2 underline underline-offset-[3px] hover:text-ambre">
            Voir les {pluriel(replies.length, "autre")} titres
          </summary>
          <ul>
            {replies.map((t) => (
              <LigneTitre key={`${t.type}-${t.id}`} t={t} d={d} ou={ou} />
            ))}
          </ul>
        </details>
      )}
    </>
  );
}

function SectionRegion({ r, d, niveau }: { r: RegionTournage; d: DonneesLieuxTournage; niveau: "h2" | "h3" }) {
  const Titre = niveau;
  return (
    <section aria-labelledby={ancre(r.region)} className="max-w-[820px]">
      <Titre id={ancre(r.region)} className={niveau === "h2" ? H2 : H3}>
        {r.region} <span className="font-normal text-texte-2">· {pluriel(r.nbTitres, "titre")}</span>
      </Titre>
      {r.region === "Île-de-France" && (
        <p className="mb-3 text-[15.5px] leading-[1.6] text-texte-doux">
          Pour les séries, rue par rue et arrondissement par arrondissement d&apos;après les autorisations de tournage de la
          Ville de Paris : le guide{" "}
          <Link href="/guides/series-tournees-paris" className="text-white underline decoration-ambre/60 underline-offset-4">
            séries tournées à Paris
          </Link>
          .
        </p>
      )}
      {r.communes.map((c) => (
        <div key={c.id}>
          {/* Sous-titre de commune : la recherche « films tournés à Marseille » y trouve sa réponse */}
          <h3 id={ancre(`${r.region}-${c.nom}`)} className={niveau === "h2" ? H3 : "mb-2 mt-4 text-[15.5px] font-bold"}>
            {c.nom} <span className="font-normal text-texte-2">· {pluriel(c.titres.length, "titre")}</span>
          </h3>
          <ListeTitres titres={c.titres} d={d} />
        </div>
      ))}
      {r.autres.length > 0 && (
        <div>
          {r.communes.length > 0 && (
            <h3 className={niveau === "h2" ? H3 : "mb-2 mt-4 text-[15.5px] font-bold"}>Ailleurs dans la région</h3>
          )}
          <ListeTitres titres={r.autres} d={d} ou />
        </div>
      )}
    </section>
  );
}

export default async function LieuxDeTournagePage() {
  const d = await donneesLieuxTournage();
  if (!d || d.regions.length === 0) notFound();

  const metropole = d.regions.filter((r) => !r.outreMer);
  const outreMer = d.regions.filter((r) => r.outreMer);
  const nbOutreMer = outreMer.reduce((n, r) => n + r.nbTitres, 0);
  const top = metropole.slice(0, 3);
  const villes = metropole
    .flatMap((r) => r.communes)
    .sort((a, b) => b.titres.length - a.titres.length)
    .slice(0, 5);
  const majFR = formatDateFR(d.maj);

  const intro =
    `${pluriel(d.nbTitres, "film et série")} tournés en France sont disponibles aujourd'hui en streaming sur les sept plateformes suivies : ` +
    top.map((r) => `${r.nbTitres} en ${r.region}`).join(", ") +
    `. Les villes les plus présentes sont ${villes.map((c) => `${c.nom} (${c.titres.length})`).join(", ")}.` +
    (outreMer.length > 0 ? ` L'outre-mer n'en compte que ${nbOutreMer}.` : "");

  const url = `${SITE_URL}${CHEMIN}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: TITRE,
      description: DESCRIPTION,
      url,
      inLanguage: "fr-FR",
      dateModified: `${d.maj}T12:00:00Z`,
      publisher: { "@id": ORG_ID },
      isBasedOn: "https://www.wikidata.org/wiki/Property:P915",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "StreamActu.fr", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Lieux de tournage", item: url },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <EnTeteNouveautes titre="Lieux de tournage en France" intro={intro} />
      <div className="space-y-section px-gouttiere pt-8 pb-10">
        <nav aria-label="Régions" className="flex flex-wrap gap-2">
          {metropole.map((r) => (
            <a key={r.region} href={`#${ancre(r.region)}`} className="puce">
              {r.region} <span className="tabular text-texte-2">{r.nbTitres}</span>
            </a>
          ))}
          {outreMer.length > 0 && (
            <a href="#outre-mer" className="puce">
              Outre-mer <span className="tabular text-texte-2">{nbOutreMer}</span>
            </a>
          )}
        </nav>

        {metropole.map((r) => (
          <SectionRegion key={r.region} r={r} d={d} niveau="h2" />
        ))}

        {outreMer.length > 0 && (
          <section aria-labelledby="outre-mer" className="max-w-[820px]">
            <h2 id="outre-mer" className={H2}>
              Outre-mer <span className="font-normal text-texte-2">· {pluriel(nbOutreMer, "titre")}</span>
            </h2>
            <p className="mb-2 text-[15.5px] leading-[1.6] text-texte-doux">
              Peu de films et de séries disponibles en streaming ont un lieu de tournage renseigné en outre-mer, et aucune
              collectivité ne publie la liste des tournages réalisés sur son territoire. Les titres ci-dessous sont ceux que
              recense Wikidata.
            </p>
            {outreMer.map((r) => (
              <SectionRegion key={r.region} r={r} d={d} niveau="h3" />
            ))}
          </section>
        )}

        <section aria-labelledby="methode" className="max-w-[68ch]">
          <h2 id="methode" className={H2}>
            D&apos;où viennent ces lieux
          </h2>
          <div className="space-y-3 text-[16px] leading-[1.65] text-texte-doux">
            <p>
              Les lieux de tournage viennent de{" "}
              <a href="https://www.wikidata.org/wiki/Property:P915" target="_blank" rel="noopener noreferrer" className="underline underline-offset-[3px]">
                Wikidata
              </a>{" "}
              (base libre, domaine public), qui recense {pluriel(d.nbTitresWikidata, "film et série")} ayant au moins un lieu de
              tournage en France. Seuls ceux disponibles aujourd&apos;hui en streaming par abonnement sur Netflix, Prime
              Video, Disney+, Apple TV+, Canal+, HBO Max ou Paramount+ sont listés ici. Chaque lieu est rattaché à sa commune
              et à sa région par le découpage administratif de Wikidata.
            </p>
            <p>
              Wikidata n&apos;est pas exhaustif : les films connus y sont mieux renseignés que les productions récentes, et
              un lieu peut n&apos;y être qu&apos;une ville ou une région. Les plateformes sont relues chaque jour (JustWatch,
              via TMDB) ; la liste des lieux a été mise à jour le {majFR}.
            </p>
            <p>
              Pour corriger ou compléter un lieu de tournage, le plus utile est de le faire sur Wikidata : la page en
              tiendra compte à la mise à jour suivante. La méthode générale du site est décrite dans{" "}
              <Link href="/a-propos#methode" className="underline underline-offset-[3px]">
                À propos
              </Link>
              .
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
