import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Newsreader, Spline_Sans_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SplashScreenLoader from "@/components/SplashScreenLoader";
import ConsentAnalytics from "@/components/ConsentAnalytics";
import { CONTACT_EMAIL, ORG_ID, REPO_URL, SITE_URL } from "@/lib/site";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

const splineMono = Spline_Sans_Mono({
  variable: "--font-spline-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const DESCRIPTION =
  "Retrouvez chaque jour les nouvelles séries et films disponibles sur Netflix, Prime Video, Disney+, Apple TV+, Canal+, HBO Max et Paramount+.";

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: "StreamActu.fr",
    // Mise en ligne : juin 2026 (premier commit du dépôt le 28 juin 2026)
    foundingDate: "2026-06",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/icons/repere-pwa-512.png`,
      width: 512,
      height: 512,
    },
    description: DESCRIPTION,
    email: CONTACT_EMAIL,
    // Profil vérifiable : le code du site est public
    sameAs: [REPO_URL],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: CONTACT_EMAIL,
      url: `${SITE_URL}/contact`,
      availableLanguage: "fr",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "StreamActu.fr",
    url: SITE_URL,
    inLanguage: "fr-FR",
    publisher: { "@id": ORG_ID },
  },
];

export const metadata: Metadata = {
  title: {
    default: "StreamActu.fr — Nouveautés streaming",
    template: "%s | StreamActu.fr",
  },
  description: DESCRIPTION,
  // Grands aperçus d'image autorisés (Google Discover, articles Actu). Une page
  // qui définit ses propres robots (noindex) remplace cette valeur.
  robots: { index: true, follow: true, "max-image-preview": "large" },
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "StreamActu.fr",
    title: "StreamActu.fr — Nouveautés streaming",
    description: DESCRIPTION,
    url: SITE_URL,
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "StreamActu.fr — Nouveautés streaming",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StreamActu.fr — Nouveautés streaming",
    description: DESCRIPTION,
    images: ["/og-default.png"],
  },
  // Pas de canonical ici : il serait hérité par toutes les pages qui ne le
  // redéfinissent pas, les faisant passer pour des doublons de l'accueil.
  // (les pages qui définissent leur propre `alternates` perdent le lien RSS :
  // sans conséquence, sa découverte se fait via l'accueil et le footer)
  alternates: {
    types: { "application/rss+xml": "/flux.xml" },
  },
  icons: {
    apple: "/icons/repere-apple-touch-180.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#16140F",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${bricolage.variable} ${newsreader.variable} ${splineMono.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SplashScreenLoader />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        {/* GA4 derrière consentement CNIL — inerte si NEXT_PUBLIC_GA_ID absent */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <ConsentAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
