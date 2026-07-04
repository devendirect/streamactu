import SkeletonCarte from "@/components/SkeletonCarte";

/** Squelette générique des pages de listes (genres, tops, calendrier) */
export default function SkeletonPage() {
  return (
    <div className="sa-container py-7">
      <div className="h-9 w-72 max-w-full bg-white/8 rounded-sm animate-pulse mb-3" />
      <div className="h-4 w-96 max-w-full bg-white/5 rounded-sm animate-pulse mb-10" />
      {Array.from({ length: 5 }).map((_, i) => (
        <SkeletonCarte key={i} />
      ))}
    </div>
  );
}
