export default function SkeletonCarte() {
  return (
    <div className="flex items-center gap-3 py-3 border-t border-border animate-pulse">
      {/* poster placeholder */}
      <div className="w-[46px] h-[68px] shrink-0 bg-white/5" />

      {/* texte */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="h-2.5 w-20 bg-white/5 rounded-sm" />
        <div className="h-4 w-36 bg-white/8 rounded-sm" />
      </div>

      {/* note */}
      <div className="h-3 w-10 bg-white/5 rounded-sm" />
    </div>
  );
}
