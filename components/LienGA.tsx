"use client";

import { evenementGA } from "@/lib/ga";

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  /** nom de l'événement GA4 envoyé au clic */
  evenement: string;
  params?: Record<string, string | number>;
}

/** Lien (souvent sortant) qui envoie un événement GA4 au clic — utilisable depuis un composant serveur */
export default function LienGA({ evenement, params, children, ...rest }: Props) {
  return (
    <a {...rest} onClick={() => evenementGA(evenement, params)}>
      {children}
    </a>
  );
}
