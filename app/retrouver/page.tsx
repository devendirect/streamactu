import type { Metadata } from "next";
import RetrouveurClient from "@/components/RetrouveurClient";

export const metadata: Metadata = {
  title: "Retrouver un film ou une série",
  description:
    "Décrivez un film ou une série dont vous vous souvenez vaguement et Claude l'identifie pour vous.",
  robots: { index: false },
};

export default function RetrouveurPage() {
  return <RetrouveurClient />;
}
