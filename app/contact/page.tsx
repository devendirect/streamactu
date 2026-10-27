import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site";
import { metadonnees } from "@/lib/meta";
import TeteLecture from "@/components/lecture/TeteLecture";
import Icone from "@/components/Icone";

export const metadata: Metadata = metadonnees(
  "Contact",
  `Écrire à StreamActu.fr : signaler une disponibilité fausse, une fiche erronée ou proposer une amélioration, à ${CONTACT_EMAIL}.`,
  "/contact"
);

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
    <>
      <TeteLecture
        ariane={[{ href: "/", label: "Accueil" }]}
        titre="Contact"
        chapo="StreamActu.fr est tenu par un développeur web indépendant, sur son temps libre. Il n'y a ni formulaire ni service client, mais une adresse e-mail lue par une vraie personne. Comptez quelques jours pour une réponse."
      />

      <div className="space-y-section px-gouttiere pb-16">
        {/* L'adresse en avant */}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="inline-block border-b-2 border-white/40 pb-1.5 text-[clamp(24px,4vw,46px)] font-extrabold tracking-[-0.02em] break-all transition-colors duration-200 hover:border-lumiere"
        >
          {CONTACT_EMAIL}
        </a>

        <div className="grid max-w-[960px] grid-cols-2 gap-3 max-[760px]:grid-cols-1">
          {SUJETS.map((s) => (
            <section key={s.objet} className="flex flex-col gap-3 rounded-[14px] bg-surface p-[22px]">
              <h2 className="text-[clamp(19px,1.6vw,22px)] font-extrabold tracking-[-0.015em]">{s.titre}</h2>
              <p className="text-[16px] leading-[1.6] text-texte-doux">{s.texte}</p>
              <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(s.objet)}`} className="lien-fleche mt-auto">
                Écrire
                <Icone nom="droite" taille={18} />
              </a>
            </section>
          ))}
        </div>

        <p className="max-w-[68ch] text-[17px] leading-[1.7] text-texte-doux">
          Pour savoir qui édite le site, d&apos;où viennent les données et comment sont faits les classements, voir la page{" "}
          <Link
            href="/a-propos"
            className="text-white underline decoration-ambre/60 underline-offset-4 transition-[text-decoration-color] duration-200 hover:decoration-ambre"
          >
            à propos
          </Link>
          .
        </p>
      </div>
    </>
  );
}
