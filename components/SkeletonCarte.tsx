/** Affiche en attente : même format que CarteAffiche (2:3, titre, méta) */
export default function SkeletonCarte() {
  return (
    <div aria-hidden="true" className="min-w-0">
      <div className="aspect-[2/3] animate-pulse rounded-lg bg-surface" />
      <div className="mt-2 h-3.5 w-4/5 animate-pulse rounded-full bg-surface" />
      <div className="mt-1.5 h-3 w-1/2 animate-pulse rounded-full bg-surface" />
    </div>
  );
}
