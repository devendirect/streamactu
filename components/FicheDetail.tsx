import Image from "next/image";
import Link from "next/link";
import type { Serie, Film } from "@/types";
import { formatDuree, formatDateFR, formatJourSemaineFR, toISO } from "@/lib/utils";
import { calendrierSerie, phraseCalendrier } from "@/lib/episodes";
import { citationsOeuvre } from "@/lib/citations";
import { dureeSaison, formatDureeLongue, libelleClassification } from "@/lib/faits";
import type { FaitsWikidata } from "@/lib/wikidata";
import { PLATEFORME_PAR_ID, plateformesDepuisFournisseurs } from "@/lib/plateformes";
import { slugPourGenreId } from "@/lib/genres";
import { hauteurLogo } from "@/lib/logo";
import ConvaincsMoi from "@/components/ConvaincsMoi";
import BoutonMaListe from "@/components/BoutonMaListe";
import LienGA from "@/components/LienGA";
import SuggestionsGenre from "@/components/SuggestionsGenre";
import Faisceau from "@/components/Faisceau";
import Icone from "@/components/Icone";
import SousNavFiche from "@/components/fiche/SousNavFiche";
import EpisodesFiche from "@/components/fiche/EpisodesFiche";
import BandeAnnonce from "@/components/fiche/BandeAnnonce";
import type { SuggestionsFiche } from "@/lib/suggestions";

/** Au-delà, les articles les plus anciens ne sont pas listés (les guides le sont tous) */
const MAX_ARTICLES_CITES = 5;

interface FicheDetailProps {
  contenu: Serie | Film;
  /** Titres du même genre sur la même plateforme (bas de fiche), si disponibles */
  suggestions?: SuggestionsFiche | null;
  /** Récompenses, adaptation, tournage, liens externes (Wikidata), si disponibles */
  faits?: FaitsWikidata | null;
  /** Logo du titre et grande image de fond (TMDB images), si disponibles */
  images?: { logo: string | null; logoRatio?: number | null; fond: string | null };
  /** Rang dans le Top 10 des séries de la semaine (1 à 10), sinon null */
  rang?: number | null;
}

const MOIS_COURTS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

/** « 28 oct. » */
function formatDateCourte(iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`);
  return `${d.getUTCDate()} ${MOIS_COURTS[d.getUTCMonth()]}`;
}

export default function FicheDetail({ contenu, suggestions, faits, images, rang = null }: FicheDetailProps) {
  const logo = images?.logo ?? null;
  const fond = images?.fond ?? contenu.backdrop;
  const isSerie = contenu.type === "serie";
  const serie = isSerie ? (contenu as Serie) : null;
  const film = !isSerie ? (contenu as Film) : null;

  // Phrase-réponse explicite (« où regarder X ? ») — c'est elle que les
  // moteurs et assistants IA citent, pas les badges.
  const plateformesFR =
    contenu.dispo && contenu.dispo.length > 0
      ? contenu.dispo.length === 1
        ? contenu.dispo[0]
        : `${contenu.dispo.slice(0, -1).join(", ")} et ${contenu.dispo.at(-1)}`
      : null;
  // Durée de toute la série, reprise dans la phrase seulement si elle couvre tous les épisodes comptés par TMDB
  const dureeTout = serie?.dureeTotale && serie.dureeTotale.nbEpisodes === serie.nbEpisodes ? serie.dureeTotale : null;
  // Détails factuels tirés de TMDB : saisons et épisodes (et leur durée), réalisation
  const details = serie
    ? serie.nbSaisons > 0
      ? ` en ${serie.nbSaisons} saison${serie.nbSaisons > 1 ? "s" : ""}${
          serie.nbEpisodes > 0
            ? ` (${serie.nbEpisodes} épisode${serie.nbEpisodes > 1 ? "s" : ""}${dureeTout ? `, ${formatDureeLongue(dureeTout.minutes)} au total` : ""})`
            : ""
        }`
      : ""
    : film && film.realisateurs.length > 0
      ? ` réalisé par ${film.realisateurs.slice(0, 2).join(" et ")}`
      : "";
  // Série terminée ou arrêtée (statut TMDB) : bornes de diffusion
  const anneeFin = serie?.statut && serie.derniereDiffusion ? Number(serie.derniereDiffusion.slice(0, 4)) : null;
  const sortie = isSerie
    ? contenu.annee && anneeFin
      ? anneeFin > contenu.annee
        ? `série diffusée de ${contenu.annee} à ${anneeFin}${details}`
        : `série diffusée en ${contenu.annee}${details}`
      : contenu.annee
        ? `série diffusée depuis ${contenu.annee}${details}`
        : `série${details}`
    : contenu.dateSortie
      ? `film sorti le ${formatDateFR(contenu.dateSortie)}${details ? ` et${details}` : ""}`
      : contenu.annee
        ? `film sorti en ${contenu.annee}${details ? ` et${details}` : ""}`
        : `film${details}`;
  const phraseDispo = plateformesFR
    ? `« ${contenu.titre} », ${sortie}, est disponible en streaming sur ${plateformesFR} en France.`
    : `« ${contenu.titre} », ${sortie}, n'est actuellement disponible sur aucune plateforme de streaming par abonnement en France.`;

  // Calendrier de la saison en cours (dates françaises si le décalage est connu)
  const calendrier = serie
    ? calendrierSerie(
        serie.episodesSaison,
        serie.reseaux ?? [],
        plateformesDepuisFournisseurs(contenu.dispo ?? []).map((p) => p.id),
        toISO(new Date())
      )
    : null;

  // Articles et guides du site qui parlent de ce titre
  const citations = citationsOeuvre(contenu.type, contenu.id);
  const liensSite = citations
    ? [
        ...citations.articles.slice(0, MAX_ARTICLES_CITES).map((c) => ({
          ...c,
          prefixe: c.role === "choix" ? "Choisi dans" : "Cité dans",
        })),
        ...citations.guides.map((c) => ({ ...c, prefixe: c.role === "choix" ? "Dans le guide" : "Cité dans le guide" })),
      ]
    : [];

  // Liens vers d'autres sites : IMDb (identifiant TMDB), AlloCiné et SensCritique (Wikidata).
  // Un lien seulement : les notes IMDb ne sont pas reprises (licence, voir plan-fiches-enrichies.md, lot 5).
  const liensExternes = [
    contenu.imdbId && /^tt\d+$/.test(contenu.imdbId) ? { nom: "IMDb", url: `https://www.imdb.com/title/${contenu.imdbId}/` } : null,
    faits?.allocine ? { nom: "AlloCiné", url: faits.allocine } : null,
    faits?.senscritique ? { nom: "SensCritique", url: faits.senscritique } : null,
  ].filter((l): l is { nom: string; url: string } => l !== null);

  // Durée totale de la saison en cours, si toutes les durées d'épisode sont connues
  const dureeTotale = calendrier && serie?.episodesSaison ? dureeSaison(serie.episodesSaison.episodes) : null;

  // Plateformes suivies (pastilles de couleur) et autres services de l'abonnement
  const plateformesSuivies = plateformesDepuisFournisseurs(contenu.dispo ?? []);
  const autresServices = (contenu.dispo ?? []).filter((nom) => plateformesDepuisFournisseurs([nom]).length === 0);
  const urlOptions = `https://www.themoviedb.org/${isSerie ? "tv" : "movie"}/${contenu.id}/watch?locale=FR`;
  const paramsClic = (plateforme: string) => ({
    titre: contenu.titre,
    type: contenu.type,
    plateformes: contenu.dispo?.join(", ") || "aucune",
    plateforme,
  });

  // Épisodes de la saison en cours, en cartes (date française quand elle est connue)
  const aujourdhui = toISO(new Date());
  const datesEpisodes = new Map<number, string>();
  calendrier?.sorties.forEach((s) => s.numeros.forEach((n) => datesEpisodes.set(n, s.date)));
  const episodes =
    calendrier && serie?.episodesSaison
      ? serie.episodesSaison.episodes.map((e) => ({ numero: e.numero, date: datesEpisodes.get(e.numero) ?? null, duree: e.duree }))
      : [];
  const datesCourtes = Object.fromEntries(
    episodes.flatMap((e) => (e.date ? [[e.date, formatDateCourte(e.date)]] : []))
  );
  const saisonsListe = serie
    ? serie.saisons
        .filter((s) => s.numero > 0)
        .map((s) => ({
          numero: s.numero,
          nom: s.nom,
          nbEpisodes: s.nbEpisodes,
          annee: s.dateDiffusion ? s.dateDiffusion.slice(0, 4) : null,
          // Durée seulement si toute la saison est diffusée (sinon elle ne vaut que pour une partie)
          duree: serie.dureesSaisons?.find((d) => d.saison === s.numero && d.nbEpisodes === s.nbEpisodes)?.minutes ?? null,
        }))
    : [];
  const prochaine = calendrier?.prochaine ?? null;

  const ancres = [
    { id: "ou-regarder", label: "Où regarder" },
    ...(serie && calendrier ? [{ id: "episodes", label: "Épisodes" }] : []),
    { id: "a-propos", label: "À propos" },
    ...(contenu.casting.length > 0 ? [{ id: "distribution", label: "Distribution" }] : []),
    ...(faits || liensExternes.length > 0 || saisonsListe.length > 0 ? [{ id: "reperes", label: "Repères" }] : []),
    ...(contenu.trailer ? [{ id: "bande-annonce", label: "Bande-annonce" }] : []),
    ...(suggestions ? [{ id: "similaires", label: "Dans le même genre" }] : []),
  ];

  const SECTION = "mb-section scroll-mt-[140px] px-gouttiere";
  const TITRE = "mb-3.5 text-[clamp(20px,1.7vw,24px)] font-extrabold tracking-[-0.015em]";
  const ETIQUETTE = "libelle mb-2 text-texte-2";

  return (
    <article>
      {/* ── Première vue : le titre sous le projecteur ── */}
      <section
        aria-labelledby="titre-fiche"
        className="scene -mt-entete flex min-h-[min(86vh,820px)] flex-col justify-end px-gouttiere pt-[110px] pb-[clamp(34px,5vw,56px)] max-[760px]:min-h-[82vh]"
      >
        <div className="scene__fond">
          {fond && (
            <Image
              src={fond}
              alt=""
              fill
              sizes="100vw"
              loading="eager"
              fetchPriority="high"
              className="object-cover object-[65%_20%] brightness-[0.62] saturate-[0.9]"
            />
          )}
        </div>
        <Faisceau />

        <div className="w-[min(640px,100%)]">
          <nav aria-label="Fil d'Ariane" className="mb-3.5 flex flex-wrap items-center gap-1.5 text-sm text-texte-2">
            <Link href="/" className="transition-colors duration-200 hover:text-texte">
              Accueil
            </Link>
            {plateformesSuivies[0] && (
              <>
                <Icone nom="droite" taille={14} className="opacity-60" />
                <Link href={`/${plateformesSuivies[0].slug}`} className="transition-colors duration-200 hover:text-texte">
                  {plateformesSuivies[0].nom}
                </Link>
              </>
            )}
            <Icone nom="droite" taille={14} className="opacity-60" />
            <span>{isSerie ? "Séries" : "Films"}</span>
          </nav>

          <p className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[14.5px] text-texte-doux">
            {rang && (
              <span className="inline-flex h-[30px] items-center gap-2 rounded-full bg-velours pr-3 pl-1 text-[13.5px] font-bold text-lumiere">
                <b className="font-salle grid h-6 min-w-6 place-items-center rounded-full bg-lumiere/15 text-[17px]">{rang}</b>
                des séries cette semaine
              </span>
            )}
            <span>
              {isSerie ? "Série" : "Film"}
              {serie?.saisonActuelle ? ` · Saison ${serie.saisonActuelle}` : ""}
            </span>
          </p>

          <h1 id="titre-fiche">
            {logo ? (
              <>
                <span className="sr-only">{contenu.titre}</span>
                {/* Logo PNG détouré, tailles variées : pas d'optimisation */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo}
                  alt=""
                  width={500}
                  height={hauteurLogo(images?.logoRatio)}
                  className="max-h-[190px] w-[min(460px,86%)] object-contain object-[left_bottom] drop-shadow-[0_4px_30px_rgba(0,0,0,0.55)]"
                />
              </>
            ) : (
              <span className="font-salle block text-[clamp(48px,7vw,92px)] leading-[0.9] font-black">{contenu.titre}</span>
            )}
          </h1>

          <p className="mt-[18px] flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-[15px] text-texte-doux">
            {contenu.note > 0 && (
              <span className="inline-flex items-center gap-[5px] text-base font-extrabold text-white">
                <Icone nom="etoile" taille={16} className="fill-current text-ambre" />
                {contenu.note.toFixed(1).replace(".", ",")}
                <span className="sr-only">sur 10</span>
              </span>
            )}
            <span className="tabular text-sm text-texte-2">{contenu.nbVotes.toLocaleString("fr-FR")} votes TMDB</span>
            {contenu.annee > 0 && <span>{contenu.annee}</span>}
            {serie && serie.nbSaisons > 0 && (
              <span>
                {serie.nbSaisons} saison{serie.nbSaisons > 1 ? "s" : ""}
              </span>
            )}
            {serie?.statut && <span>{serie.statut === "terminee" ? "Série terminée" : "Série arrêtée"}</span>}
            {film?.duree ? <span>{formatDuree(film.duree)}</span> : null}
            {contenu.classification && (
              <span
                className="rounded-[4px] border border-white/35 px-2 py-0.5 text-[13px] font-semibold"
                title="Classification française (source TMDB)"
              >
                {libelleClassification(contenu.classification)}
              </span>
            )}
          </p>

          {contenu.synopsis && (
            <p className="mt-3.5 line-clamp-3 max-w-[58ch] text-[clamp(15.5px,1.2vw,17px)] leading-[1.6] text-[#E2E2E6]">
              {contenu.synopsis}
            </p>
          )}

          <div className="mt-[26px] flex flex-wrap gap-2.5">
            {plateformesSuivies.map((pf) => (
              <LienGA
                key={pf.id}
                href={urlOptions}
                target="_blank"
                rel="noopener noreferrer"
                evenement="clic_plateforme"
                params={paramsClic(pf.nom)}
                className="btn-blanc gap-3 max-[760px]:flex-[1_1_100%] max-[760px]:justify-center"
              >
                <span
                  aria-hidden="true"
                  className="size-3 rounded-full shadow-[0_0_0_2px_rgba(0,0,0,0.12)]"
                  style={{ background: pf.couleur }}
                />
                Regarder sur {pf.nom}
                <Icone nom="externe" taille={18} />
              </LienGA>
            ))}
            {contenu.trailer && (
              <a href="#bande-annonce" className="btn-verre">
                <Icone nom="lecture" taille={20} />
                Bande-annonce
              </a>
            )}
            <BoutonMaListe contenu={contenu} variante="verre" />
          </div>

          {prochaine && (
            <p className="mt-[18px] inline-flex items-center gap-2.5 rounded-[10px] bg-ambre/15 px-3.5 py-2.5 text-[14.5px] font-bold text-ambre">
              <Icone nom="calendrier" taille={18} />
              {prochaine.date === aujourdhui ? "Prochain épisode aujourd'hui" : `Prochain épisode le ${formatJourSemaineFR(prochaine.date).toLowerCase()}`}
              {" · "}S{calendrier!.saison} ép. {prochaine.numeros.join(", ")}
            </p>
          )}
        </div>
      </section>

      <SousNavFiche ancres={ancres} />

      {/* ── Où regarder : la question telle qu'on la tape, puis la réponse ── */}
      <section id="ou-regarder" aria-labelledby="h-ou-regarder" className={SECTION}>
        <h2 id="h-ou-regarder" className={TITRE}>
          {/* {" "} explicite : le compilateur perd l'espace après {…} quand la ligne contient une entité */}
          Où regarder {contenu.titre}{" "}en streaming&nbsp;?
        </h2>
        {(plateformesSuivies.length > 0 || autresServices.length > 0) && (
          <div className="grid max-w-[900px] grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-3">
            {[
              ...plateformesSuivies.map((pf) => ({ nom: pf.nom, couleur: pf.couleur, clair: pf.slug === "apple-tv-plus" || pf.slug === "canal-plus" })),
              ...autresServices.map((nom) => ({ nom, couleur: "var(--sa-surface-2)", clair: false })),
            ].map((s) => (
              <LienGA
                key={s.nom}
                href={urlOptions}
                target="_blank"
                rel="noopener noreferrer"
                evenement="clic_plateforme"
                params={paramsClic(s.nom)}
                className="flex items-center gap-4 rounded-xl bg-surface px-[18px] py-4 transition-[background-color,translate] duration-[250ms] ease-salle hover:-translate-y-0.5 hover:bg-surface-2"
              >
                <span
                  aria-hidden="true"
                  className={`grid size-11 flex-none place-items-center rounded-[10px] text-lg font-black ${s.clair ? "text-[#111]" : "text-white"}`}
                  style={{ background: s.couleur }}
                >
                  {s.nom[0]}
                </span>
                <span>
                  <strong className="block text-[17px]">{s.nom}</strong>
                  <span className="text-sm text-texte-2">Inclus dans l&apos;abonnement</span>
                </span>
                <Icone nom="externe" taille={18} className="ml-auto text-texte-2" />
              </LienGA>
            ))}
          </div>
        )}
        <p className="mt-4 max-w-[68ch] text-[16.5px] leading-[1.6] text-texte-doux">{phraseDispo}</p>
        <p className="mt-2.5 text-[13.5px] text-texte-2">
          {/* Lien requis par TMDB pour les données de disponibilité (source JustWatch) */}
          <LienGA
            href={urlOptions}
            target="_blank"
            rel="noopener noreferrer"
            evenement="clic_plateforme"
            params={paramsClic("toutes")}
            className="underline underline-offset-[3px] transition-colors duration-200 hover:text-texte"
          >
            Toutes les options de visionnage
          </LienGA>{" "}
          · disponibilités TMDB (source JustWatch), France uniquement
        </p>
      </section>

      {/* ── Calendrier des épisodes de la saison en cours ── */}
      {serie && calendrier && (
        <section id="episodes" aria-labelledby="h-episodes" className={SECTION}>
          <h2 id="h-episodes" className={TITRE}>
            Quand sortent les épisodes de {contenu.titre}&nbsp;?
          </h2>
          <p className="mb-[18px] max-w-[68ch] text-[16.5px] leading-[1.6] text-texte-doux">
            {phraseCalendrier(calendrier, calendrier.plateforme ? PLATEFORME_PAR_ID[calendrier.plateforme].nom : null)}
            {dureeTotale &&
              ` La ${calendrier.libelleSaison} dure ${formatDureeLongue(dureeTotale)} au total (${calendrier.nbEpisodes} épisodes).`}
          </p>
          {episodes.length > 0 && (
            <EpisodesFiche
              saisonCourante={calendrier.saison}
              episodes={episodes}
              saisons={saisonsListe}
              aujourdhui={aujourdhui}
              dates={datesCourtes}
            />
          )}
          {!calendrier.datesFrance && (
            <p className="mt-2 text-[13.5px] text-texte-2">Dates de diffusion d&apos;origine : la date française n&apos;est pas connue.</p>
          )}
        </section>
      )}

      {/* ── À propos ── */}
      <section id="a-propos" aria-labelledby="h-a-propos" className={SECTION}>
        <h2 id="h-a-propos" className={TITRE}>
          À propos
        </h2>
        <div className="grid grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-[clamp(24px,4vw,56px)] max-[900px]:grid-cols-1">
          <div>
            <p className="max-w-[62ch] text-[clamp(17px,1.35vw,19px)] leading-[1.65] text-[#E2E2E6]">
              {contenu.synopsis || "Synopsis non disponible."}
            </p>
            {/* Genres, cliquables quand une page genre existe */}
            {contenu.genres.length > 0 && (
              <div className="mt-[18px] flex flex-wrap gap-2">
                {contenu.genres.map((g) => {
                  const slugGenre = slugPourGenreId(g.id);
                  return slugGenre ? (
                    <Link key={g.id} href={`/genre/${slugGenre}`} className="puce">
                      {g.nom}
                    </Link>
                  ) : (
                    <span key={g.id} className="puce hover:bg-surface hover:text-texte-doux">
                      {g.nom}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
          <div>
            {/* Articles et guides du site qui en parlent */}
            {liensSite.length > 0 && (
              <div>
                <h3 className={ETIQUETTE}>Sur StreamActu</h3>
                <ul>
                  {liensSite.map((l) => (
                    <li key={l.chemin} className="border-t border-trait py-3 text-[15px]">
                      <span className="text-texte-2">{l.prefixe} </span>
                      <Link href={l.chemin} className="font-bold transition-colors duration-200 hover:text-ambre">
                        {l.titre}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <ConvaincsMoi contenu={contenu} />
          </div>
        </div>
      </section>

      {/* ── Distribution ── */}
      {contenu.casting.length > 0 && (
        <section id="distribution" aria-labelledby="h-distribution" className={SECTION}>
          <h2 id="h-distribution" className={TITRE}>
            Distribution principale
          </h2>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-x-3.5 gap-y-[18px]">
            {contenu.casting.slice(0, 8).map((personne) => (
              <li key={personne.id} className="flex min-w-0 items-center gap-3">
                <span className="relative size-[60px] flex-none overflow-hidden rounded-full bg-surface-2">
                  {personne.photo && (
                    <Image src={personne.photo} alt={personne.nom} fill sizes="60px" className="object-cover" />
                  )}
                </span>
                <span className="min-w-0">
                  <strong className="block truncate text-[15px]">{personne.nom}</strong>
                  <span className="block truncate text-[13.5px] text-texte-2">{personne.personnage}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Repères : prix, adaptation, tournage (Wikidata), autres sites ; saisons ── */}
      {(faits || liensExternes.length > 0 || saisonsListe.length > 0) && (
        <section id="reperes" aria-labelledby="h-reperes" className={SECTION}>
          <h2 id="h-reperes" className={TITRE}>
            Repères
          </h2>
          <div className="grid grid-cols-2 gap-[clamp(24px,4vw,56px)] max-[860px]:grid-cols-1">
            {(faits || liensExternes.length > 0) && (
              <div>
                <dl className="text-[15px]">
                  {faits && faits.prix.length > 0 && (
                    <div className="grid grid-cols-[140px_minmax(0,1fr)] gap-3.5 border-t border-trait py-[13px] max-[860px]:grid-cols-[110px_minmax(0,1fr)]">
                      <dt className="text-texte-2">Récompenses</dt>
                      <dd>
                        <ul className="space-y-1">
                          {faits.prix.map((p) => (
                            <li key={p.libelle}>
                              {p.libelle}
                              {p.annee && <span className="tabular text-texte-2"> · {p.annee}</span>}
                            </li>
                          ))}
                          {faits.autresPrix > 0 && (
                            <li className="text-texte-2">
                              et {faits.autresPrix} autre{faits.autresPrix > 1 ? "s" : ""} prix majeur{faits.autresPrix > 1 ? "s" : ""}
                            </li>
                          )}
                        </ul>
                      </dd>
                    </div>
                  )}
                  {faits && faits.adapteDe.length > 0 && (
                    <div className="grid grid-cols-[140px_minmax(0,1fr)] gap-3.5 border-t border-trait py-[13px] max-[860px]:grid-cols-[110px_minmax(0,1fr)]">
                      <dt className="text-texte-2">D&apos;après</dt>
                      <dd>{faits.adapteDe.join(", ")}</dd>
                    </div>
                  )}
                  {faits && faits.tournage.length > 0 && (
                    <div className="grid grid-cols-[140px_minmax(0,1fr)] gap-3.5 border-t border-trait py-[13px] max-[860px]:grid-cols-[110px_minmax(0,1fr)]">
                      <dt className="text-texte-2">Tournage</dt>
                      <dd>{faits.tournage.join(", ")}</dd>
                    </div>
                  )}
                  {liensExternes.length > 0 && (
                    <div className="grid grid-cols-[140px_minmax(0,1fr)] gap-3.5 border-t border-trait py-[13px] max-[860px]:grid-cols-[110px_minmax(0,1fr)]">
                      <dt className="text-texte-2">Ailleurs</dt>
                      <dd className="flex flex-wrap gap-x-4">
                        {liensExternes.map((l) => (
                          <a
                            key={l.nom}
                            href={l.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-[3px] transition-colors duration-200 hover:text-ambre"
                          >
                            {l.nom}
                          </a>
                        ))}
                      </dd>
                    </div>
                  )}
                </dl>
                {faits && (
                  <p className="mt-2.5 text-[13.5px] text-texte-2">
                    Source :{" "}
                    <a href="https://www.wikidata.org/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-[3px]">
                      Wikidata
                    </a>
                  </p>
                )}
              </div>
            )}
            {saisonsListe.length > 0 && (
              <div>
                <h3 className={ETIQUETTE}>Saisons</h3>
                {serie?.dureeTotale && (
                  <p className="mb-3 text-[15px] leading-[1.55] text-texte-doux">
                    Pour tout voir : <strong className="font-semibold text-texte">{formatDureeLongue(serie.dureeTotale.minutes)}</strong>{" "}
                    pour les {serie.dureeTotale.nbEpisodes} épisode{serie.dureeTotale.nbEpisodes > 1 ? "s" : ""}
                    {serie.statut ? "" : ` déjà diffusé${serie.dureeTotale.nbEpisodes > 1 ? "s" : ""}`}.
                  </p>
                )}
                <ul>
                  {saisonsListe.map((s) => (
                    <li key={s.numero} className="flex justify-between gap-4 border-t border-trait py-[13px] text-[15px]">
                      <strong className="truncate">{s.nom}</strong>
                      <span className="tabular shrink-0 whitespace-nowrap text-texte-2">
                        {s.nbEpisodes > 0 ? `${s.nbEpisodes} épisode${s.nbEpisodes > 1 ? "s" : ""}` : "épisodes à venir"}
                        {s.duree ? ` · ${formatDureeLongue(s.duree)}` : ""}
                        {" · "}
                        {s.annee ?? "à venir"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Bande-annonce, chargée au clic ── */}
      {contenu.trailer && (
        <section id="bande-annonce" aria-labelledby="h-bande-annonce" className={SECTION}>
          <h2 id="h-bande-annonce" className={TITRE}>
            Bande-annonce
          </h2>
          <BandeAnnonce cle={contenu.trailer.key} titre={contenu.titre} type={contenu.type} image={fond} />
        </section>
      )}

      {suggestions && <SuggestionsGenre suggestions={suggestions} />}

      {/* ── Actions ── */}
      <div className={`${SECTION} flex flex-wrap items-center gap-[18px]`}>
        <BoutonMaListe contenu={contenu} />
        <a
          href={`https://www.themoviedb.org/${isSerie ? "tv" : "movie"}/${contenu.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="lien-fleche"
        >
          Fiche TMDB
          <Icone nom="droite" taille={18} />
        </a>
      </div>
    </article>
  );
}
