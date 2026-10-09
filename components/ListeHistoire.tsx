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
    <div className="mb-2 flex flex-col gap-3.5 rounded-[4px] border border-border bg-card p-4">
      <div className="flex items-baseline justify-between">
        <span className="font-mono-label text-ink-3">Votre progression</span>
        <span className="text-[20px] font-extrabold">
          {nombre} <span className="font-semibold text-ink-3">/ {etapes.length}</span>
        </span>
      </div>
      <div className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${etapes.length}, minmax(0, 1fr))` }}>
        {vu.map((v, i) => (
          <span
            key={etapes[i].id}
            className="h-1.5 rounded-[1px]"
            style={{ background: v ? "#E3A53A" : i === courante ? "rgba(227,165,58,0.4)" : "rgba(236,230,216,0.12)" }}
          />
        ))}
      </div>
      {prochaine ? (
        <div className="grid gap-3.5 border-t border-border pt-3.5 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
          <div className="relative aspect-video overflow-hidden rounded-[2px] bg-[#2B2720]">
            {prochaine.image && <Image src={prochaine.image} alt="" fill sizes="(max-width: 600px) 100vw, 320px" className="object-cover" />}
          </div>
          <div className="flex min-w-0 flex-col gap-2.5">
            <span className="font-mono-label text-primary">Prochaine étape · {pad(courante + 1)}</span>
            <div className="flex flex-col gap-[3px]">
              <span className="text-[18px] font-extrabold leading-[1.2]">{prochaine.titre}</span>
              {portionDe(prochaine) && <span className="font-serif text-[17px] text-[#C4BBA9]">{portionDe(prochaine)}</span>}
            </div>
            {prochaine.plateformes && <Plateformes plateformes={prochaine.plateformes} auCinema={prochaine.auCinema} />}
            <div className="flex flex-wrap gap-1.5">
              <Link
                href={prochaine.href}
                className="inline-flex min-h-10 items-center rounded-[2px] border border-[rgba(236,230,216,0.16)] border-b-[3px] border-b-primary px-3 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-foreground transition-colors hover:bg-[#221E17]"
              >
                Voir la fiche →
              </Link>
            </div>
            <button
              type="button"
              onClick={marquer}
              className="min-h-11 cursor-pointer rounded-[2px] border-0 bg-primary font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-primary-foreground"
            >
              Marquer comme vue
            </button>
          </div>
        </div>
      ) : (
        <p className="m-0 font-serif text-[17px] text-[#C4BBA9]">Vous avez tout vu, dans l&apos;ordre de l&apos;histoire.</p>
      )}
      {nombre > 0 && (
        <button
          type="button"
          onClick={reinitialiser}
          className="cursor-pointer self-start border-0 bg-transparent p-0 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3 hover:text-foreground"
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
              className="flex gap-2 border-t border-border py-2.5"
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
                    className={`flex size-[22px] items-center justify-center rounded-[2px] border font-mono text-[13px] font-bold text-primary-foreground ${
                      estVue
                        ? "border-primary bg-primary"
                        : estCourante
                          ? "border-foreground"
                          : "border-[rgba(236,230,216,0.3)]"
                    }`}
                  >
                    {estVue ? "✓" : ""}
                  </span>
                </button>
              )}
              <div className="flex min-w-0 flex-1 flex-col gap-1.5 pt-2.5">
                <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                  <span className={`text-[17px] font-extrabold ${estVue ? "text-ink-3" : "text-primary"}`}>{i + 1}</span>
                  <Link
                    href={e.href}
                    className={`text-[17px] font-bold leading-[1.2] transition-colors hover:text-primary ${estVue ? "text-[#9A9282]" : "text-foreground"}`}
                  >
                    {e.titre}
                  </Link>
                  {e.suite && <Etiquette>Suite</Etiquette>}
                  {e.facultatif && <Etiquette>Facultatif</Etiquette>}
                  {estCourante && (
                    <span className="rounded-[2px] bg-primary px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-primary-foreground">
                      À voir
                    </span>
                  )}
                </div>
                {portion && (
                  <span className={`font-serif text-[17px] leading-[1.35] ${estVue ? "text-ink-3" : "text-foreground"}`}>{portion}</span>
                )}
                {!estVue && (
                  <>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-[5px]">
                      {e.plateformes && <Plateformes plateformes={e.plateformes} auCinema={e.auCinema} />}
                      {e.fiche && (
                        <a
                          href={`#${e.fiche.ancre}`}
                          className="ml-auto font-mono text-[11px] uppercase tracking-[0.2em] text-ink-3 transition-colors hover:text-primary"
                        >
                          Fiche {e.fiche.numero} ↑
                        </a>
                      )}
                    </div>
                    <p className="m-0 font-serif text-[16px] leading-normal text-[#C4BBA9] [text-wrap:pretty]">
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
