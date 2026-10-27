import { ACTU_PUBLIEE } from "@/lib/actu";
import EnteteClient, { type LienEntete } from "@/components/EnteteClient";

/**
 * En-tête du site. Les liens sont calculés ici (côté serveur) pour ne pas
 * envoyer les articles au navigateur ; EnteteClient gère le défilement,
 * le menu des plateformes et la page courante.
 */
export default function Header() {
  const annee = new Date().getUTCFullYear();
  const liens: LienEntete[] = [
    { href: "/", label: "Accueil" },
    { menu: "plateformes" },
    { href: "/prochaines-sorties", label: "À venir" },
    { href: `/top/series-${annee}`, label: "Tops", prefixe: "/top/" },
    // Jamais de rubrique vide : « Actu » n'apparaît qu'avec un article publié
    ...(ACTU_PUBLIEE ? [{ href: "/actu", label: "Actu", prefixe: "/actu" }] : []),
    { href: "/guides", label: "Guides", prefixe: "/guides" },
    { href: "/ma-liste", label: "Ma liste" },
  ];
  return <EnteteClient liens={liens} />;
}
