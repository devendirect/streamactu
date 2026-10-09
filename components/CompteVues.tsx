"use client";

import { useEtapesVues } from "@/lib/use-etapes-vues";

/** « · 2 vues » dans la carte de sommaire d'un ordre de l'histoire (rien avant le montage) */
export default function CompteVues({ cle, etapes }: { cle: string; etapes: string[] }) {
  const { monte, nombre } = useEtapesVues(cle, etapes);
  if (!monte) return null;
  return <> · {nombre} {nombre > 1 ? "vues" : "vue"}</>;
}
