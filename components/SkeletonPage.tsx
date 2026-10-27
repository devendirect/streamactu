import SkeletonCarte from "@/components/SkeletonCarte";

/** Squelette générique des pages de listes : la scène d'en-tête, puis une grille d'affiches */
export default function SkeletonPage() {
  return (
    <div role="status" aria-label="Chargement">
      <div className="tete-texte -mt-entete flex min-h-[380px] flex-col justify-end px-gouttiere pt-[clamp(130px,18vh,190px)] pb-[34px]">
        <div className="mb-3 h-[clamp(34px,4.6vw,64px)] w-[min(560px,90%)] animate-pulse rounded-lg bg-surface" />
        <div className="h-4 w-[min(640px,95%)] animate-pulse rounded-full bg-surface" />
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(clamp(132px,13vw,180px),1fr))] gap-x-3.5 gap-y-[22px] px-gouttiere pt-8 pb-10">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonCarte key={i} />
        ))}
      </div>
    </div>
  );
}
