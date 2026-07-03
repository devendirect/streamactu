import Image from "next/image";
import type { Serie, Film } from "@/types";
import { formatDuree } from "@/lib/utils";
import ConvaincsMoi from "@/components/ConvaincsMoi";

interface FicheDetailProps {
  contenu: Serie | Film;
}

export default function FicheDetail({ contenu }: FicheDetailProps) {
  const isSerie = contenu.type === "serie";
  const serie = isSerie ? (contenu as Serie) : null;
  const film = !isSerie ? (contenu as Film) : null;

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

        {/* Genres */}
        {contenu.genres.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {contenu.genres.map((g) => (
              <span
                key={g.id}
                className="font-mono-label text-[#B8AF9D] px-3 py-1 border border-border/50"
              >
                {g.nom}
              </span>
            ))}
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
          <a
            href={`https://www.themoviedb.org/${isSerie ? "tv" : "movie"}/${contenu.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono-label text-foreground border-b border-primary pb-1 hover:text-primary transition-colors"
          >
            Fiche TMDB →
          </a>
          {contenu.trailer && (
            <a
              href={`https://www.youtube.com/watch?v=${contenu.trailer.key}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-primary text-background font-mono-label font-semibold px-5 py-3 hover:opacity-90 transition-opacity"
            >
              ▶ Bande-annonce
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
