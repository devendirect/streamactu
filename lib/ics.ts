/**
 * Calendriers iCalendar (RFC 5545) à ajouter à son agenda : sorties à venir
 * par plateforme, et épisodes des séries de Ma liste. Événements « journée
 * entière » (les heures de mise en ligne ne sont pas connues). Module pur,
 * testé.
 */

export interface EvenementICS {
  /** Identifiant stable d'une génération à l'autre : l'agenda met à jour au lieu de dupliquer */
  uid: string;
  /** YYYY-MM-DD */
  date: string;
  titre: string;
  description?: string;
  url?: string;
}

/** Les agendas abonnés relisent le flux à leur rythme ; ceux qui lisent cette indication, toutes les 6 h */
const RAFRAICHISSEMENT = "PT6H";

/** Échappement des valeurs TEXT (§ 3.3.11) */
export function echapperTexte(texte: string): string {
  return texte.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

/**
 * Pliage des lignes à 75 octets (§ 3.1) : la suite commence par une espace.
 * On ne coupe jamais au milieu d'un caractère UTF-8.
 */
export function plierLigne(ligne: string): string {
  const morceaux: string[] = [];
  let courant = "";
  let octets = 0;
  for (const car of ligne) {
    const taille = Buffer.byteLength(car, "utf8");
    // 75 octets pour la première ligne, 74 + l'espace pour les suivantes
    if (octets + taille > 75) {
      morceaux.push(courant);
      courant = " ";
      octets = 1;
    }
    courant += car;
    octets += taille;
  }
  morceaux.push(courant);
  return morceaux.join("\r\n");
}

/** 2026-11-03 → 20261103 */
const dateICS = (iso: string) => iso.replace(/-/g, "");

function lendemain(iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

/** 2026-10-28T09:05:03Z → 20261028T090503Z */
const horodatage = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export function calendrierICS(options: {
  nom: string;
  description: string;
  evenements: EvenementICS[];
  maintenant: Date;
}): string {
  const stamp = horodatage(options.maintenant);
  const lignes = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//StreamActu.fr//Calendrier des sorties//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${echapperTexte(options.nom)}`,
    `X-WR-CALDESC:${echapperTexte(options.description)}`,
    `REFRESH-INTERVAL;VALUE=DURATION:${RAFRAICHISSEMENT}`,
    `X-PUBLISHED-TTL:${RAFRAICHISSEMENT}`,
  ];
  for (const e of options.evenements) {
    lignes.push(
      "BEGIN:VEVENT",
      `UID:${e.uid}`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${dateICS(e.date)}`,
      `DTEND;VALUE=DATE:${dateICS(lendemain(e.date))}`,
      `SUMMARY:${echapperTexte(e.titre)}`,
      ...(e.description ? [`DESCRIPTION:${echapperTexte(e.description)}`] : []),
      ...(e.url ? [`URL:${e.url}`] : []),
      // Journée entière qui ne bloque pas l'agenda
      "TRANSP:TRANSPARENT",
      "END:VEVENT"
    );
  }
  lignes.push("END:VCALENDAR");
  return lignes.map(plierLigne).join("\r\n") + "\r\n";
}
