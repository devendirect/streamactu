import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site";
import { metadonnees } from "@/lib/meta";

export const metadata: Metadata = metadonnees(
  "Contact",
  `Écrire à StreamActu.fr : signaler une disponibilité fausse, une fiche erronée ou proposer une amélioration, à ${CONTACT_EMAIL}.`,
  "/contact"
);

const styleProse = {
  fontFamily: "var(--font-newsreader), serif",
  fontSize: "17px",
} as const;

const SUJETS = [
  {
    titre: "Une disponibilité fausse",
    objet: "Disponibilité",
    texte:
      "Un titre annoncé sur une plateforme alors qu'il n'y est pas, ou l'inverse ? Indiquez la page et la plateforme. Les disponibilités viennent de TMDB et JustWatch : un décalage de quelques jours avec la plateforme arrive, mais une erreur durable mérite d'être signalée.",
  },
  {
    titre: "Une fiche erronée",
    objet: "Fiche",
    texte:
      "Mauvaise affiche, synopsis d'un autre titre, date de sortie fausse : donnez l'adresse de la fiche. Ces informations viennent de TMDB : une erreur corrigée à la source profite aussi aux autres sites qui s'en servent.",
  },
  {
    titre: "Une suggestion",
    objet: "Suggestion",
    texte:
      "Une plateforme à suivre, un genre qui manque, une page qui serait utile : décrivez ce que vous cherchiez à faire sur le site. Chaque suggestion est lue.",
  },
  {
    titre: "Vos données",
    objet: "Données personnelles",
    texte:
      "Le site ne crée pas de compte et ne vous demande aucune donnée personnelle. Pour une question sur la mesure d'audience ou pour exercer vos droits, écrivez-moi ; le détail est dans les mentions légales.",
  },
];

export default function ContactPage() {
  return (
    <div className="sa-container py-10 max-w-2xl space-y-10">
      <div>
        <p className="font-mono-label text-ink-3 mb-3">Le site</p>
        <h1 className="text-4xl font-extrabold tracking-[-0.025em]">Contact</h1>
      </div>

      <section className="space-y-5">
        <p className="text-[#C4BBA9] leading-relaxed" style={styleProse}>
          StreamActu.fr est tenu par un développeur web indépendant, sur son temps libre. Il
          n&apos;y a ni formulaire ni service client, mais une adresse e-mail lue par une vraie
          personne. Comptez quelques jours pour une réponse.
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="inline-block border border-primary px-5 py-3 font-mono text-primary hover:bg-primary/10 transition-colors"
        >
          {CONTACT_EMAIL}
        </a>
      </section>

      {SUJETS.map((s) => (
        <section key={s.objet} className="space-y-3 border-t border-border pt-6">
          <h2 className="font-mono-label text-[#9A9282]">{s.titre}</h2>
          <p className="text-[#C4BBA9] leading-relaxed" style={styleProse}>
            {s.texte}
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(s.objet)}`}
            className="font-mono-label text-foreground border-b border-primary pb-1 hover:text-primary transition-colors"
          >
            Écrire →
          </a>
        </section>
      ))}

      <p className="text-[#C4BBA9] leading-relaxed border-t border-border pt-6" style={styleProse}>
        Pour savoir qui édite le site, d&apos;où viennent les données et comment sont faits les
        classements, voir la page{" "}
        <Link href="/a-propos" className="text-primary underline">
          à propos
        </Link>
        .
      </p>
    </div>
  );
}
