"use client";

import Image from "next/image";
import Link from "next/link";
import { useEtapesVues } from "@/lib/use-etapes-vues";
import { Etiquette, Plateformes, type PlateformeAffichee } from "@/components/PiecesOrdre";
import { TexteEnLigne } from "@/components/TexteEnLigne";

/**
 * Ordre de l'histoire d'un guide d'ordre, avec le suivi de visionnage
 * (maquette du 2026-10-09). Rendu serveur complet dans l'état « rien de vu » :
 * titres, portions, plateformes et repères sont dans le HTML. Après le
 * montage s'ajoutent les cases « Étape vue » et la carte de progression ;
 * une étape vue se replie (plateformes et repère masqués).
 */

export interface EtapeAffichee {
  /** idEtape : clé stable de la progression */
  id: string;
  type: "film" | "serie";
  titre: string;
  href: string;
  portion?: string;
  /** null : fiche indisponible (ni plateformes ni filtre) */
  plateformes: PlateformeAffichee[] | null;
  auCinema?: boolean;
  facultatif?: boolean;
  repere: string;
  /** Le titre est déjà apparu dans une étape précédente */
  suite: boolean;
  /** Même titre dans la liste de sortie */
  fiche?: { ancre: string; numero: string };
  /** Image 16:9 de la carte « Prochaine étape » */
  image: string | null;
}

const pad = (n: number) => String(n).padStart(2, "0");

function portionDe(e: EtapeAffichee): string | undefined {
  return e.portion ?? (e.type === "serie" ? "Toutes les saisons disponibles" : undefined);
}

function CarteProgression({
  etapes,
  vu,
  nombre,
  courante,
  marquer,
  reinitialiser,
}: {
  etapes: EtapeAffichee[];
  vu: boolean[];
  nombre: number;
  courante: number;
  marquer: () => void;
  reinitialiser: () => void;
}) {
  const prochaine = courante >= 0 ? etapes[courante] : null;
  return (
    <div className="mb-2 flex flex-col gap-3.5 rounded-xl bg-surface p-4">
      <div className="flex items-baseline justify-between">
        <span className="libelle text-texte-2">Votre progression</span>
        <span className="text-[20px] font-extrabold">
          {nombre} <span className="font-semibold text-texte-2">/ {etapes.length}</span>
        </span>
      </div>
      <div className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${etapes.length}, minmax(0, 1fr))` }}>
        {vu.map((v, i) => (
          <span
            key={etapes[i].id}
            className="h-1.5 rounded-full"
            style={{ background: v ? "#E3A53A" : i === courante ? "rgba(227,165,58,0.4)" : "rgba(245,245,247,0.12)" }}
          />
        ))}
      </div>
      {prochaine ? (
        <div className="grid gap-3.5 border-t border-trait pt-3.5 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
          <div className="relative aspect-video overflow-hidden rounded-md bg-surface">
            {prochaine.image && <Image src={prochaine.image} alt="" fill sizes="(max-width: 600px) 100vw, 320px" className="object-cover" />}
          </div>
          <div className="flex min-w-0 flex-col gap-2.5">
            <span className="libelle text-ambre">Prochaine étape · {pad(courante + 1)}</span>
            <div className="flex flex-col gap-[3px]">
              <span className="text-[18px] font-extrabold leading-[1.2]">{prochaine.titre}</span>
              {portionDe(prochaine) && <span className="text-[17px] text-texte-doux">{portionDe(prochaine)}</span>}
            </div>
            {prochaine.plateformes && <Plateformes plateformes={prochaine.plateformes} auCinema={prochaine.auCinema} />}
            <div className="flex flex-wrap gap-1.5">
              <Link
                href={prochaine.href}
                className="inline-flex min-h-10 items-center rounded-md border border-trait px-3 text-[13px] font-medium uppercase tracking-[0.06em] text-texte transition-colors hover:bg-surface-2"
              >
                Voir la fiche →
              </Link>
            </div>
            <button
              type="button"
              onClick={marquer}
              className="btn-blanc h-11 justify-center text-[15px]"
            >
              Marquer comme vue
            </button>
          </div>
        </div>
      ) : (
        <p className="m-0 text-[17px] text-texte-doux">Vous avez tout vu, dans l&apos;ordre de l&apos;histoire.</p>
      )}
      {nombre > 0 && (
        <button
          type="button"
          onClick={reinitialiser}
          className="cursor-pointer self-start border-0 bg-transparent p-0 text-[13px] uppercase tracking-[0.06em] text-texte-2 hover:text-texte"
        >
          Réinitialiser
        </button>
      )}
    </div>
  );
}

export default function ListeHistoire({ cle, etapes }: { cle: string; etapes: EtapeAffichee[] }) {
  const { monte, vu, nombre, basculer, reinitialiser } = useEtapesVues(
    cle,
    etapes.map((e) => e.id)
  );
  const courante = monte ? vu.indexOf(false) : -1;

  return (
    <div>
      {monte && (
        <CarteProgression
          etapes={etapes}
          vu={vu}
          nombre={nombre}
          courante={courante}
          marquer={() => courante >= 0 && basculer(etapes[courante].id)}
          reinitialiser={reinitialiser}
        />
      )}
      <ol className="m-0 list-none p-0">
        {etapes.map((e, i) => {
          const estVue = vu[i];
          const estCourante = i === courante;
          const portion = portionDe(e);
          return (
            <li
              key={`${e.id}-${i}`}
              {...(e.plateformes ? { "data-ligne": e.plateformes.map((p) => p.id).join(" ") } : {})}
              {...(estVue ? { "data-vue": "" } : {})}
              className="flex gap-2 border-t border-trait py-2.5"
            >
              {monte && (
                <button
                  type="button"
                  aria-pressed={estVue}
                  aria-label={`Étape vue : ${i + 1}, ${e.titre}`}
                  onClick={() => basculer(e.id)}
                  className="flex size-11 flex-none cursor-pointer items-center justify-center border-0 bg-transparent p-0"
                >
                  <span
                    aria-hidden="true"
                    className={`flex size-[22px] items-center justify-center rounded-md border tabular text-[13px] font-bold text-sur-ambre ${
                      estVue
                        ? "border-ambre bg-ambre"
                        : estCourante
                          ? "border-foreground"
                          : "border-[rgba(245,245,247,0.3)]"
                    }`}
                  >
                    {estVue ? "✓" : ""}
                  </span>
                </button>
              )}
              <div className="flex min-w-0 flex-1 flex-col gap-1.5 pt-2.5">
                <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                  <span className={`font-salle tabular text-[34px] leading-none font-black text-transparent ${estVue ? "[-webkit-text-stroke:1.5px_rgba(161,161,168,0.5)]" : "[-webkit-text-stroke:1.5px_rgba(255,241,210,0.5)]"}`}>{i + 1}</span>
                  <Link
                    href={e.href}
                    className={`text-[17px] font-bold leading-[1.2] transition-colors hover:text-ambre ${estVue ? "text-texte-2" : "text-texte"}`}
                  >
                    {e.titre}
                  </Link>
                  {e.suite && <Etiquette>Suite</Etiquette>}
                  {e.facultatif && <Etiquette>Facultatif</Etiquette>}
                  {estCourante && (
                    <span className="rounded-md bg-ambre px-1.5 py-0.5 text-[13px] uppercase tracking-[0.06em] text-sur-ambre">
                      À voir
                    </span>
                  )}
                </div>
                {portion && (
                  <span className={`text-[17px] leading-[1.35] ${estVue ? "text-texte-2" : "text-texte"}`}>{portion}</span>
                )}
                {!estVue && (
                  <>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-[5px]">
                      {e.plateformes && <Plateformes plateformes={e.plateformes} auCinema={e.auCinema} />}
                      {e.fiche && (
                        <a
                          href={`#${e.fiche.ancre}`}
                          className="ml-auto text-[13px] uppercase tracking-[0.06em] text-texte-2 transition-colors hover:text-ambre"
                        >
                          Fiche {e.fiche.numero} ↑
                        </a>
                      )}
                    </div>
                    <p className="m-0 text-[16px] leading-normal text-texte-doux [text-wrap:pretty]">
                      <TexteEnLigne texte={e.repere} />
                    </p>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
