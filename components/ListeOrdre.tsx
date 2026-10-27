import Image from "next/image";
import Link from "next/link";
import { cheminOeuvreGuide, idEtape, SEUIL_GROUPE_ANNEES, type AncresOrdre, type BlocOrdre, type OeuvreGuide } from "@/lib/guides";
import { cleOeuvre, type OeuvreArticle } from "@/lib/actu-oeuvres";
import type { Plateforme } from "@/types";
import { Etiquette, Plateformes } from "@/components/PiecesOrdre";
import { TexteEnLigne } from "@/components/TexteEnLigne";
import ListeHistoire, { type EtapeAffichee } from "@/components/ListeHistoire";

/**
 * Listes des guides « ordre de visionnage » (maquette du 2026-10-09,
 * docs hors git : design_handoff_guide_ordre_visionnage). Rendu serveur
 * complet : titres, liens, plateformes et repères sont dans le HTML ; les
 * couches « Mes abonnements » et suivi de visionnage viendront s'y greffer.
 */

const POINTILLES = "repeating-linear-gradient(90deg,#A1A1A8 0 3px,transparent 3px 6px)";
const pad = (n: number) => String(n).padStart(2, "0");

interface Contexte {
  oeuvres?: Map<string, OeuvreArticle>;
  /** Ancre et numéro de chaque titre dans la première liste de sortie (ancresOrdre) */
  ancres: AncresOrdre;
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
        <div className="relative h-[84px] w-14 overflow-hidden rounded-md bg-surface">
          {o?.poster && <Image src={o.poster} alt="" fill sizes="56px" className="object-cover" />}
        </div>
        {o && <BarrePlateformes plateformes={plateformes} auCinema={item.auCinema} />}
      </Link>
      <div className="flex min-w-0 flex-col gap-[7px]">
        <div className="flex items-baseline gap-2.5">
          <span className="font-salle tabular flex-none text-[34px] leading-none font-black text-transparent [-webkit-text-stroke:1.5px_rgba(255,241,210,0.5)]">{pad(numero)}</span>
          <Link
            href={href}
            className="text-[18px] font-bold leading-[1.2] text-foreground [text-wrap:pretty] hover:text-primary transition-colors"
          >
            {o?.titre ?? item.titre}
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[13px] uppercase tracking-[0.06em] text-texte-2">
          <span>
            {item.type === "serie" ? "Série" : "Film"}
            {o?.annee ? ` · ${o.annee}` : ""}
          </span>
          {item.facultatif && <Etiquette>Facultatif</Etiquette>}
        </div>
        {o && <Plateformes plateformes={plateformes} auCinema={item.auCinema} />}
        <span className="sa-hors text-[13px] uppercase tracking-[0.06em] text-texte-2">Hors de vos abonnements</span>
        <p className="m-0 text-[16px] leading-normal text-texte-doux [text-wrap:pretty]">
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
              className="border border-border px-2.5 py-[7px] text-[13px] tracking-[0.06em] text-texte-doux hover:text-primary transition-colors"
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

/** Données de la liste client : tout est calculé ici, côté serveur */
function etapesAffichees(bloc: BlocOrdre, ctx: Contexte): EtapeAffichee[] {
  const vus = new Set<string>();
  return bloc.oeuvres.map((item) => {
    const cle = cleOeuvre(item);
    const o = ctx.oeuvres?.get(cle);
    const suite = vus.has(cle);
    vus.add(cle);
    const ancre = ctx.ancres.get(cle);
    return {
      id: idEtape(item),
      type: item.type,
      titre: o?.titre ?? item.titre,
      href: hrefOeuvre(item, o),
      portion: item.portion,
      plateformes: o ? o.plateformes.map(({ id, nom, couleur }) => ({ id, nom, couleur })) : null,
      auCinema: item.auCinema,
      facultatif: item.facultatif,
      repere: item.repere,
      suite,
      fiche: ancre ? { ancre: ancre.ancre, numero: ancre.numero } : undefined,
      image: o?.grandeImage ?? null,
    };
  });
}

export default function ListeOrdre({
  bloc,
  idListe,
  cleSuivi,
  ...ctx
}: { bloc: BlocOrdre; idListe: string; cleSuivi: string } & Contexte) {
  return bloc.ordre === "sortie" ? (
    <ListeSortie bloc={bloc} idListe={idListe} ctx={ctx} />
  ) : (
    <ListeHistoire cle={cleSuivi} etapes={etapesAffichees(bloc, ctx)} />
  );
}
