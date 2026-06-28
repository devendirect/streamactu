import { SectionPlateformeSkeleton } from "@/components/SectionPlateforme";

export default function Loading() {
  return (
    <div className="sa-container py-4">
      {/* Barre de filtres skeleton */}
      <div className="border-b border-border/20 py-3 mb-1 flex items-center justify-between">
        <div className="flex gap-5">
          <div className="h-7 w-16 bg-white/6 rounded-sm animate-pulse" />
          <div className="h-7 w-14 bg-white/6 rounded-sm animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="h-7 w-12 bg-white/6 rounded-sm animate-pulse" />
          <div className="h-7 w-28 bg-white/4 rounded-sm animate-pulse" />
          <div className="h-7 w-24 bg-white/4 rounded-sm animate-pulse" />
        </div>
      </div>
      <div className="border-b border-border/20 py-3 mb-1 flex items-center justify-between">
        <div className="flex gap-1">
          <div className="h-9 w-24 bg-white/8 rounded-sm animate-pulse" />
          <div className="h-9 w-28 bg-white/4 rounded-sm animate-pulse" />
          <div className="h-9 w-20 bg-white/4 rounded-sm animate-pulse" />
        </div>
        <div className="h-4 w-48 bg-white/4 rounded-sm animate-pulse" />
      </div>
      <div className="border-b border-border/20 py-2.5 mb-6 flex items-center gap-2">
        <div className="h-6 w-20 bg-white/4 rounded-sm animate-pulse" />
        <div className="h-7 w-14 bg-white/6 rounded-sm animate-pulse" />
        <div className="h-7 w-20 bg-white/4 rounded-sm animate-pulse" />
        <div className="h-7 w-24 bg-white/4 rounded-sm animate-pulse" />
      </div>

      {/* Sections plateforme skeleton */}
      <div className="space-y-10">
        {Array.from({ length: 3 }).map((_, i) => (
          <SectionPlateformeSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
