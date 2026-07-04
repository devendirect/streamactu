import Image from "next/image";
import Link from "next/link";
import type { Serie, Film } from "@/types";
import { formatDuree, formatDateFR } from "@/lib/utils";
import { slugPourGenreId } from "@/lib/genres";
import ConvaincsMoi from "@/components/ConvaincsMoi";
import BoutonMaListe from "@/components/BoutonMaListe";
import LienGA from "@/components/LienGA";

interface FicheDetailProps {
  contenu: Serie | Film;
}

export default function FicheDetail({ contenu }: FicheDetailProps) {
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
  const sortie = isSerie
    ? contenu.annee
      ? `série diffusée depuis ${contenu.annee}`
      : "série"
    : contenu.dateSortie
      ? `film sorti le ${formatDateFR(contenu.dateSortie)}`
      : contenu.annee
        ? `film sorti en ${contenu.annee}`
        : "film";
  const phraseDispo = plateformesFR
    ? `« ${contenu.titre} », ${sortie}, est disponible en streaming sur ${plateformesFR} en France.`
    : `« ${contenu.titre} », ${sortie}, n'est actuellement disponible sur aucune plateforme de streaming par abonnement en France.`;

  return (
    <article>
      {/* ── Backdrop ── */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-card to-background">
        {contenu.backdrop && (
          <Image
            src={contenu.backdrop}
            alt={`Image de ${contenu.titre}`}
            fill
            sizes="100vw"
            className="object-cover opacity-40"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        {/* Titre sur fond */}
        <div className="absolute left-6 right-6 bottom-5">
          <div className="flex items-baseline gap-3 mb-2 font-mono-label text-[#D8CFBC]">
            <span className="text-[13px] text-foreground">
              {isSerie ? "▣" : "◈"}
            </span>
            {isSerie ? "Série" : "Film"}
            {serie?.saisonActuelle && (
              <span className="text-primary border-l border-border/40 pl-3">
                Saison {serie.saisonActuelle}
              </span>
            )}
          </div>
          <h1 className="text-[clamp(32px,6vw,52px)] font-extrabold leading-[0.92] tracking-[-0.025em]">
            {contenu.titre}
          </h1>
        </div>
      </div>

      {/* ── Corps ── */}
      <div className="px-6 py-6 space-y-6">

        {/* Méta */}
        <div className="flex items-center gap-3 flex-wrap pb-5 border-b border-border text-sm">
          <span className="font-mono text-primary text-base">★ {contenu.note.toFixed(1)}</span>
          <span className="font-mono-label text-ink-3">
            TMDB · {contenu.nbVotes.toLocaleString("fr-FR")} votes
          </span>
          <span className="text-border/60">·</span>
          <span className="font-mono text-[#9A9282]">{contenu.annee}</span>
          {serie && (
            <>
              <span className="text-border/60">·</span>
              <span className="font-mono text-[#9A9282]">
                {serie.nbSaisons} saison{serie.nbSaisons > 1 ? "s" : ""}
              </span>
            </>
          )}
          {film?.duree && (
            <>
              <span className="text-border/60">·</span>
              <span className="font-mono text-[#9A9282]">{formatDuree(film.duree)}</span>
            </>
          )}
        </div>

        {/* ── Où regarder ── */}
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="font-mono-label text-ink-4">
            {contenu.dispo && contenu.dispo.length > 0 ? "Disponible sur" : "Hors abonnement streaming FR"}
          </span>
          {contenu.dispo?.slice(0, 4).map((nom) => (
            <span
              key={nom}
              className="font-mono-label px-2 py-0.5"
              style={{ background: "#C7BEAC", color: "#16140F", fontSize: "10px", letterSpacing: "0.1em" }}
            >
              {nom}
            </span>
          ))}
          {/* Lien requis par TMDB pour les données de disponibilité (source JustWatch) */}
          <LienGA
            href={`https://www.themoviedb.org/${isSerie ? "tv" : "movie"}/${contenu.id}/watch?locale=FR`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono-label text-ink-3 underline hover:text-foreground transition-colors"
            evenement="clic_plateforme"
            params={{
              titre: contenu.titre,
              type: contenu.type,
              plateformes: contenu.dispo?.join(", ") || "aucune",
            }}
          >
            Toutes les options →
          </LienGA>
        </div>

        <p
          className="text-[15px] leading-relaxed text-[#9A9282]"
          style={{ fontFamily: "var(--font-newsreader), serif" }}
        >
          {phraseDispo}
        </p>

        {/* Genres — cliquables quand une page genre existe */}
        {contenu.genres.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {contenu.genres.map((g) => {
              const slugGenre = slugPourGenreId(g.id);
              return slugGenre ? (
                <Link
                  key={g.id}
                  href={`/genre/${slugGenre}`}
                  className="font-mono-label text-[#B8AF9D] px-3 py-1 border border-border/50 hover:border-primary hover:text-primary transition-colors"
                >
                  {g.nom}
                </Link>
              ) : (
                <span
                  key={g.id}
                  className="font-mono-label text-[#B8AF9D] px-3 py-1 border border-border/50"
                >
                  {g.nom}
                </span>
              );
            })}
          </div>
        )}

        {/* Synopsis */}
        <p
          className="text-[18px] leading-relaxed text-[#C4BBA9]"
          style={{ fontFamily: "var(--font-newsreader), serif" }}
        >
          {contenu.synopsis || "Synopsis non disponible."}
        </p>

        {/* ── Convaincs-moi ── */}
        <ConvaincsMoi contenu={contenu} />

        {/* ── Distribution ── */}
        {contenu.casting.length > 0 && (
          <div>
            <div className="font-mono-label text-ink-3 mb-4">Distribution principale</div>
            <div className="grid grid-cols-2 gap-3">
              {contenu.casting.slice(0, 6).map((personne) => (
                <div key={personne.id} className="flex items-center gap-3">
                  <div className="relative w-11 h-11 shrink-0 border border-border overflow-hidden bg-white/5">
                    {personne.photo ? (
                      <Image
                        src={personne.photo}
                        alt={personne.nom}
                        fill
                        className="object-cover"
                        sizes="44px"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold leading-tight truncate">
                      {personne.nom}
                    </div>
                    <div className="font-mono-label text-ink-3 mt-0.5 truncate">
                      {personne.personnage}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Saisons ── */}
        {serie && serie.saisons.filter((s) => s.numero > 0).length > 0 && (
          <div>
            <div className="font-mono-label text-ink-3 mb-3">Saisons</div>
            <div>
              {serie.saisons
                .filter((s) => s.numero > 0)
                .map((s) => (
                  <div
                    key={s.numero}
                    className="flex items-baseline justify-between gap-4 py-2.5 border-t border-border/50"
                  >
                    <span className="text-sm font-semibold truncate">{s.nom}</span>
                    <span className="font-mono text-sm text-[#9A9282] whitespace-nowrap shrink-0">
                      {s.nbEpisodes > 0
                        ? `${s.nbEpisodes} épisode${s.nbEpisodes > 1 ? "s" : ""}`
                        : "épisodes à venir"}
                      {" · "}
                      {s.dateDiffusion ? s.dateDiffusion.slice(0, 4) : "à venir"}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ── Bande-annonce ── */}
        {contenu.trailer && (
          <div>
            <div className="font-mono-label text-ink-3 mb-3">Bande-annonce</div>
            <div className="relative aspect-video border border-border overflow-hidden bg-card">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${contenu.trailer.key}?rel=0&modestbranding=1`}
                title={contenu.trailer.nom}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        )}

        {/* ── Actions ── */}
        <div className="flex items-center gap-3 flex-wrap pb-2">
          <BoutonMaListe contenu={contenu} />
          <a
            href={`https://www.themoviedb.org/${isSerie ? "tv" : "movie"}/${contenu.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono-label text-foreground border-b border-primary pb-1 hover:text-primary transition-colors"
          >
            Fiche TMDB →
          </a>
          {contenu.trailer && (
            <LienGA
              href={`https://www.youtube.com/watch?v=${contenu.trailer.key}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-primary text-background font-mono-label font-semibold px-5 py-3 hover:opacity-90 transition-opacity"
              evenement="lecture_trailer"
              params={{ titre: contenu.titre, type: contenu.type }}
            >
              ▶ Bande-annonce
            </LienGA>
          )}
        </div>
      </div>
    </article>
  );
}
