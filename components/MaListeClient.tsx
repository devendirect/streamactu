"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Contenu } from "@/types";
import { useMaListe } from "@/lib/use-ma-liste";
import Rangee from "@/components/Rangee";
import CartePaysage from "@/components/CartePaysage";
import Icone from "@/components/Icone";
import { annoncer } from "@/components/Annonce";
import AbonnementDuMois from "@/components/AbonnementDuMois";
import AjouterAgenda from "@/components/AjouterAgenda";

type Filtre = "tout" | "serie" | "film";
type Tri = "ajout" | "note" | "titre";

const TRIS: { val: Tri; label: string }[] = [
  { val: "ajout", label: "Ajout récent" },
  { val: "note", label: "Mieux notés" },
  { val: "titre", label: "De A à Z" },
];

/**
 * Ma liste : nouveaux épisodes de la semaine sur le velours (séries gardées
 * croisées avec les sorties de la semaine), « Quel abonnement ce mois-ci ? »,
 * puis les titres gardés en grille, filtrables et triables, chacun marquable
 * comme vu et retirable.
 */
export default function MaListeClient({ seriesSemaine }: { seriesSemaine: Contenu[] }) {
  const { liste, restaure, retirer, basculerVu } = useMaListe();
  const [filtre, setFiltre] = useState<Filtre>("tout");
  const [tri, setTri] = useState<Tri>("ajout");

  // Évite le flash « liste vide » avant restauration du localStorage
  if (!restaure) {
    return (
      <div className="px-gouttiere py-8">
        <div className="h-5 w-40 animate-pulse rounded-sm bg-surface" />
      </div>
    );
  }

  if (liste.length === 0) {
    return (
      <div className="mx-auto max-w-[56ch] space-y-5 px-gouttiere py-16 text-center">
        <p className="text-[clamp(22px,4vw,32px)] leading-tight font-extrabold tracking-[-0.02em]">
          Rien pour l&apos;instant : votre prochaine soirée se prépare ici.
        </p>
        <p className="text-texte-2">
          Ajoutez des titres depuis leur fiche avec le bouton Ma liste. Tout reste dans votre navigateur, sans compte.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link href="/" className="btn-blanc">
            Voir les nouveautés
          </Link>
          <Link href="/surprise" className="btn-verre">
            <Icone nom="de" taille={20} />
            Laissez le hasard choisir
          </Link>
        </div>
      </div>
    );
  }

  const gardees = new Set(liste.filter((e) => e.type === "serie").map((e) => e.id));
  const nouveauxEpisodes = seriesSemaine.filter((c) => gardees.has(c.id));

  const visibles = liste
    .filter((e) => filtre === "tout" || e.type === filtre)
    .sort((a, b) =>
      tri === "note" ? b.note - a.note : tri === "titre" ? a.titre.localeCompare(b.titre, "fr") : a.ajouteLe < b.ajouteLe ? 1 : -1
    );

  // Titres à voir (60 au plus, comme la route) : l'adresse du calendrier Ma liste
  const aVoirAgenda = liste
    .filter((e) => !e.vu)
    .sort((a, b) => (a.ajouteLe < b.ajouteLe ? 1 : -1))
    .slice(0, 60)
    .map((e) => `${e.type}-${e.id}`);

  return (
    <div className="pt-8 pb-10">
      {nouveauxEpisodes.length > 0 && (
        <div className="velours mb-section pt-[34px] pb-2.5">
          <Rangee titre="Nouveaux épisodes cette semaine" salle paysage className="mb-6">
            {nouveauxEpisodes.map((c) => (
              <CartePaysage key={c.id} contenu={c} />
            ))}
          </Rangee>
        </div>
      )}

      <div className="px-gouttiere">
        <AbonnementDuMois liste={liste} />

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div role="group" aria-label="Type" className="segments">
            {(
              [
                ["tout", "Tout"],
                ["serie", "Séries"],
                ["film", "Films"],
              ] as const
            ).map(([v, label]) => (
              <button key={v} type="button" aria-pressed={filtre === v} onClick={() => setFiltre(v)}>
                {label}
              </button>
            ))}
          </div>
          <div role="group" aria-label="Trier" className="flex flex-wrap gap-2">
            {TRIS.map((t) => (
              <button key={t.val} type="button" aria-pressed={tri === t.val} onClick={() => setTri(t.val)} className="puce">
                {t.label}
              </button>
            ))}
          </div>
          <p className="tabular ml-auto text-sm text-texte-2">
            {visibles.length} titre{visibles.length > 1 ? "s" : ""}
          </p>
        </div>

        <ul className="grid grid-cols-[repeat(auto-fill,minmax(clamp(132px,13vw,180px),1fr))] gap-x-3.5 gap-y-[22px]">
          {visibles.map((item) => (
            <li key={`${item.type}-${item.id}`} className="relative min-w-0">
              <Link href={`/${item.type}/${item.slug}`} className="group block">
                <span className="relative block aspect-[2/3] overflow-hidden rounded-lg bg-surface">
                  {item.poster && (
                    <Image
                      src={item.poster}
                      alt={item.titre}
                      fill
                      sizes="(max-width: 760px) 40vw, 180px"
                      className={`object-cover transition-[transform,opacity] duration-300 ease-salle group-hover:scale-[1.03] ${item.vu ? "opacity-45" : ""}`}
                    />
                  )}
                  {item.vu && (
                    <span className="absolute bottom-2 left-2 rounded-[4px] bg-[rgba(10,10,11,0.75)] px-2 py-0.5 text-[12px] font-bold text-texte backdrop-blur-[10px]">
                      Vu
                    </span>
                  )}
                </span>
                <span className="block truncate pt-2 text-sm leading-[1.3] font-semibold">{item.titre}</span>
                <span className="mt-0.5 flex items-center gap-1.5 text-[13px] text-texte-2">
                  {item.type === "serie" ? "Série" : "Film"}
                  {item.annee > 0 && ` · ${item.annee}`}
                  {item.note > 0 && (
                    <span className="inline-flex items-center gap-1">
                      ·<Icone nom="etoile" taille={12} className="fill-current text-ambre" />
                      {item.note.toFixed(1).replace(".", ",")}
                    </span>
                  )}
                </span>
              </Link>
              {/* Vu et retrait : hors du lien (imbrication invalide sinon) */}
              <button
                type="button"
                onClick={() => {
                  basculerVu(item.id, item.type);
                  annoncer(item.vu ? `${item.titre} : de nouveau à voir` : `${item.titre} marqué comme vu`);
                }}
                aria-pressed={!!item.vu}
                aria-label={`${item.titre} : vu`}
                title={item.vu ? "Remettre à voir" : "Marquer comme vu"}
                className={`absolute top-2 left-2 grid size-9 place-items-center rounded-full backdrop-blur-[10px] transition-colors duration-200 ${
                  item.vu ? "bg-white text-fond" : "bg-[rgba(10,10,11,0.6)] text-white hover:bg-[rgba(10,10,11,0.85)]"
                }`}
              >
                <Icone nom="coche" taille={18} />
              </button>
              <button
                type="button"
                onClick={() => {
                  retirer(item.id, item.type);
                  annoncer(`${item.titre} retiré de Ma liste`);
                }}
                aria-label={`Retirer ${item.titre} de Ma liste`}
                className="absolute top-2 right-2 grid size-9 place-items-center rounded-full bg-[rgba(10,10,11,0.6)] text-white backdrop-blur-[10px] transition-colors duration-200 hover:bg-[rgba(10,10,11,0.85)]"
              >
                <Icone nom="fermer" taille={18} />
              </button>
            </li>
          ))}
        </ul>

        {aVoirAgenda.length > 0 && (
          <div className="mt-section">
            <AjouterAgenda
              chemin={`/calendrier/ma-liste.ics?t=${aVoirAgenda.join(",")}`}
              texte="Les nouveaux épisodes de vos séries et la sortie de vos films dans votre agenda. Les titres sont dans l'adresse : ajoutez à nouveau le calendrier quand votre liste a beaucoup changé."
            />
          </div>
        )}
      </div>
    </div>
  );
}
