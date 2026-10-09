import Image from "next/image";
import Link from "next/link";
import { cheminOeuvreGuide, SEUIL_GROUPE_ANNEES, type AncresOrdre, type BlocOrdre, type OeuvreGuide } from "@/lib/guides";
import { cleOeuvre, type OeuvreArticle } from "@/lib/actu-oeuvres";
import type { Plateforme } from "@/types";
import { TexteEnLigne } from "@/components/TexteEnLigne";

/**
 * Listes des guides « ordre de visionnage » (maquette du 2026-10-09,
 * docs hors git : design_handoff_guide_ordre_visionnage). Rendu serveur
 * complet : titres, liens, plateformes et repères sont dans le HTML ; les
 * couches « Mes abonnements » et suivi de visionnage viendront s'y greffer.
 */

const POINTILLES = "repeating-linear-gradient(90deg,#8E8676 0 3px,transparent 3px 6px)";
const pad = (n: number) => String(n).padStart(2, "0");

interface Contexte {
  oeuvres?: Map<string, OeuvreArticle>;
  /** Ancre et numéro de chaque titre dans la première liste de sortie (ancresOrdre) */
  ancres: AncresOrdre;
}

/** Plateformes du jour, ou mention « au cinéma » / « aucune plateforme » ; le nom est toujours écrit */
function Plateformes({ plateformes, auCinema }: { plateformes: Plateforme[]; auCinema?: boolean }) {
  if (plateformes.length > 0) {
    return (
      <ul className="flex flex-wrap gap-x-4 gap-y-[5px]" aria-label="Plateformes en France">
        {plateformes.map((p) => (
          <li
            key={p.id}
            data-pf={p.id}
            className="inline-flex items-center gap-[7px] font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-foreground"
          >
            <span
              aria-hidden="true"
              className="size-2 shadow-[inset_0_0_0_1px_rgba(236,230,216,0.18)]"
              style={{ background: p.couleur }}
            />
            {p.nom}
          </li>
        ))}
      </ul>
    );
  }
  if (auCinema) {
    return (
      <p className="inline-flex items-center gap-[7px] font-mono text-[11px] uppercase tracking-[0.12em] text-primary">
        <span aria-hidden="true" className="size-[7px] border border-primary" />
        Au cinéma · pas encore en streaming
      </p>
    );
  }
  return (
    <p className="inline-flex items-center gap-[7px] font-mono text-[11px] uppercase tracking-[0.12em] text-[#9A9282]">
      <span aria-hidden="true" className="size-[7px] border border-dashed border-[#9A9282]" />
      Aucune plateforme d&apos;abonnement
    </p>
  );
}

/** Barre de 3 px sous la vignette : un segment par plateforme, pointillés sans plateforme, doré au cinéma */
function BarrePlateformes({ plateformes, auCinema }: { plateformes: Plateforme[]; auCinema?: boolean }) {
  const segments =
    plateformes.length > 0
      ? plateformes.map((p) => p.couleur)
      : [auCinema ? "var(--primary)" : POINTILLES];
  return (
    <div className="mt-1 flex h-[3px] gap-px">
      {segments.map((fond, i) => (
        <span key={i} className="flex-1" style={{ background: fond }} />
      ))}
    </div>
  );
}

function Etiquette({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-[2px] border border-[rgba(236,230,216,0.24)] px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#C4BBA9]">
      {children}
    </span>
  );
}

/** Plateformes d'une ligne pour le filtre « Mes abonnements » (absent sans fiche : jamais en retrait) */
function dataLigne(o?: OeuvreArticle): { "data-ligne"?: string } {
  return o ? { "data-ligne": o.plateformes.map((p) => p.id).join(" ") } : {};
}

function hrefOeuvre(item: OeuvreGuide, o?: OeuvreArticle): string {
  return o ? `/${o.type}/${o.slug}` : cheminOeuvreGuide(item);
}

// ──────────────────────────────────────────────
// Ordre de sortie
// ──────────────────────────────────────────────

function LigneSortie({ item, numero, ancre, o }: { item: OeuvreGuide; numero: number; ancre?: string; o?: OeuvreArticle }) {
  const href = hrefOeuvre(item, o);
  const plateformes = o?.plateformes ?? [];
  return (
    <li id={ancre} {...dataLigne(o)} className="grid scroll-mt-40 grid-cols-[56px_minmax(0,1fr)] gap-4 border-t border-border py-4">
      <Link href={href} aria-hidden="true" tabIndex={-1} className="block w-14">
        <div className="relative h-[84px] w-14 overflow-hidden rounded-[2px] bg-[#2B2720] shadow-[inset_0_0_0_1px_rgba(236,230,216,0.08)]">
          {o?.poster && <Image src={o.poster} alt="" fill sizes="56px" className="object-cover" />}
        </div>
        {o && <BarrePlateformes plateformes={plateformes} auCinema={item.auCinema} />}
      </Link>
      <div className="flex min-w-0 flex-col gap-[7px]">
        <div className="flex items-baseline gap-2.5">
          <span className="flex-none font-mono text-[11px] tracking-[0.1em] text-primary">{pad(numero)}</span>
          <Link
            href={href}
            className="text-[18px] font-bold leading-[1.2] text-foreground [text-wrap:pretty] hover:text-primary transition-colors"
          >
            {o?.titre ?? item.titre}
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-3">
          <span>
            {item.type === "serie" ? "Série" : "Film"}
            {o?.annee ? ` · ${o.annee}` : ""}
          </span>
          {item.facultatif && <Etiquette>Facultatif</Etiquette>}
        </div>
        {o && <Plateformes plateformes={plateformes} auCinema={item.auCinema} />}
        <span className="sa-hors font-mono text-[10px] uppercase tracking-[0.2em] text-[#9A9282]">Hors de vos abonnements</span>
        <p className="m-0 font-serif text-[16px] leading-normal text-[#C4BBA9] [text-wrap:pretty]">
          <TexteEnLigne texte={item.repere} />
        </p>
      </div>
    </li>
  );
}

/** Regroupe une longue liste par année de sortie (l'année de la fiche ; sans fiche, rattachée au groupe précédent) */
function groupesParAnnee(items: OeuvreGuide[], oeuvres?: Map<string, OeuvreArticle>) {
  const groupes: { annee: number | null; lignes: { item: OeuvreGuide; numero: number }[] }[] = [];
  items.forEach((item, i) => {
    const annee = oeuvres?.get(cleOeuvre(item))?.annee || null;
    const dernier = groupes.at(-1);
    if (!dernier || (annee !== null && annee !== dernier.annee)) groupes.push({ annee, lignes: [] });
    groupes.at(-1)!.lignes.push({ item, numero: i + 1 });
  });
  return groupes;
}

function ListeSortie({ bloc, idListe, ctx }: { bloc: BlocOrdre; idListe: string; ctx: Contexte }) {
  const ligne = ({ item, numero }: { item: OeuvreGuide; numero: number }) => {
    const cle = cleOeuvre(item);
    const ancre = ctx.ancres.get(cle);
    // L'ancre n'est posée que sur la première liste de sortie qui contient le titre
    const estPremiere = ancre?.bloc === bloc && ancre.numero === pad(numero);
    return (
      <LigneSortie key={`${cle}-${numero}`} item={item} numero={numero} ancre={estPremiere ? ancre?.ancre : undefined} o={ctx.oeuvres?.get(cle)} />
    );
  };

  if (bloc.oeuvres.length <= SEUIL_GROUPE_ANNEES) {
    return <ol className="m-0 list-none p-0">{bloc.oeuvres.map((item, i) => ligne({ item, numero: i + 1 }))}</ol>;
  }

  const groupes = groupesParAnnee(bloc.oeuvres, ctx.oeuvres);
  const annees = groupes.filter((g) => g.annee !== null);
  return (
    <div>
      {annees.length > 1 && (
        <nav aria-label="Aller à l'année" className="mb-4 flex flex-wrap gap-1.5">
          {annees.map((g) => (
            <a
              key={g.annee}
              href={`#${idListe}-${g.annee}`}
              className="border border-border px-2.5 py-[7px] font-mono text-[11px] tracking-[0.1em] text-[#C4BBA9] hover:text-primary transition-colors"
            >
              {g.annee}
            </a>
          ))}
        </nav>
      )}
      <ol className="m-0 list-none p-0">
        {groupes.map((g, gi) => (
          <li key={`${g.annee}-${gi}`} className="list-none">
            {g.annee !== null && (
              <h3 id={`${idListe}-${g.annee}`} className="scroll-mt-40 pb-2 pt-5 text-[15px] font-extrabold text-primary">
                {g.annee}
              </h3>
            )}
            <ol className="m-0 list-none p-0">{g.lignes.map(ligne)}</ol>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ──────────────────────────────────────────────
// Ordre de l'histoire
// ──────────────────────────────────────────────

function ListeHistoire({ bloc, ctx }: { bloc: BlocOrdre; ctx: Contexte }) {
  const vus = new Set<string>();
  return (
    <ol className="m-0 list-none p-0">
      {bloc.oeuvres.map((item, i) => {
        const cle = cleOeuvre(item);
        const o = ctx.oeuvres?.get(cle);
        const suite = vus.has(cle);
        vus.add(cle);
        const ancre = ctx.ancres.get(cle);
        const portion = item.portion ?? (item.type === "serie" ? "Toutes les saisons disponibles" : undefined);
        return (
          <li key={`${cle}-${i}`} {...dataLigne(o)} className="flex flex-col gap-1.5 border-t border-border py-2.5">
            <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1 pt-2.5">
              <span className="text-[17px] font-extrabold text-primary">{i + 1}</span>
              <Link
                href={hrefOeuvre(item, o)}
                className="text-[17px] font-bold leading-[1.2] text-foreground hover:text-primary transition-colors"
              >
                {o?.titre ?? item.titre}
              </Link>
              {suite && <Etiquette>Suite</Etiquette>}
              {item.facultatif && <Etiquette>Facultatif</Etiquette>}
            </div>
            {portion && <span className="font-serif text-[17px] leading-[1.35] text-foreground">{portion}</span>}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-[5px]">
              {o && <Plateformes plateformes={o.plateformes} auCinema={item.auCinema} />}
              {ancre && (
                <a
                  href={`#${ancre.ancre}`}
                  className="ml-auto font-mono text-[11px] uppercase tracking-[0.2em] text-ink-3 hover:text-primary transition-colors"
                >
                  Fiche {ancre.numero} ↑
                </a>
              )}
            </div>
            <p className="m-0 font-serif text-[16px] leading-normal text-[#C4BBA9] [text-wrap:pretty]">
              <TexteEnLigne texte={item.repere} />
            </p>
          </li>
        );
      })}
    </ol>
  );
}

export default function ListeOrdre({ bloc, idListe, ...ctx }: { bloc: BlocOrdre; idListe: string } & Contexte) {
  return bloc.ordre === "sortie" ? <ListeSortie bloc={bloc} idListe={idListe} ctx={ctx} /> : <ListeHistoire bloc={bloc} ctx={ctx} />;
}
