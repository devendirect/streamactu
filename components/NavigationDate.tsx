"use client";

import { useRouter } from "next/navigation";
import { formatDateFR, formatDateURL, parseDateURL, toISO } from "@/lib/utils";

interface NavigationDateProps {
  dateISO: string;  // "2026-06-27"
}

export default function NavigationDate({ dateISO }: NavigationDateProps) {
  const router = useRouter();
  const date = new Date(dateISO + "T12:00:00Z");

  const aujourdhui = toISO(new Date());
  const estAujourdhui = dateISO === aujourdhui;

  function aller(delta: number) {
    const d = new Date(date);
    d.setUTCDate(d.getUTCDate() + delta);
    const iso = toISO(d);
    if (iso === aujourdhui) {
      router.push("/");
    } else {
      router.push(`/${formatDateURL(d)}`);
    }
  }

  const labelJour = estAujourdhui
    ? `Aujourd'hui · ${formatDateFR(date)}`
    : formatDateFR(date);

  const peutAvancer = dateISO < aujourdhui;

  return (
    <div className="flex items-center justify-between border border-border py-2.5 px-4">
      <button
        onClick={() => aller(-1)}
        aria-label="Jour précédent"
        className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ←
      </button>

      <span className="text-sm font-semibold">{labelJour}</span>

      <button
        onClick={() => aller(1)}
        disabled={!peutAvancer}
        aria-label="Jour suivant"
        className="font-mono text-sm text-foreground disabled:text-muted-foreground/30 hover:text-primary disabled:cursor-not-allowed transition-colors"
      >
        →
      </button>
    </div>
  );
}
