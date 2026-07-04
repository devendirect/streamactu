# Mise en place de Google Analytics 4 (GA4)

Plan d'action pour mesurer l'audience de StreamActu.fr avec GA4, dans les règles
CNIL/RGPD (site français → le consentement n'est pas optionnel).

## 1. Créer la propriété GA4

- [x] Sur [analytics.google.com](https://analytics.google.com), créer un compte
      « StreamActu » puis une propriété « streamactu.fr » (fuseau Paris, devise EUR).
- [x] Ajouter un flux de données **Web** pour `https://streamactu.fr`.
- [x] Noter l'identifiant de mesure `G-XXXXXXXXXX`.
- [x] Dans Administration → Paramètres des données → Conservation des données :
      passer de 2 à 14 mois.

## 2. Intégrer le tag dans Next.js

Utiliser le composant officiel plutôt qu'un script à la main :

- [x] `npm install @next/third-parties` *(version 16.2.9, alignée sur Next)*
- [x] Dans `app/layout.tsx` :

```tsx
import { GoogleAnalytics } from "@next/third-parties/google";

// dans le JSX, après <body>…</body> :
{process.env.NEXT_PUBLIC_GA_ID && (
  <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
)}
```

- [ ] Ajouter `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX` dans l'environnement **au moment du
      build** (variable `NEXT_PUBLIC_*` = inlinée au build, pas lue au runtime Plesk).
      Laisser vide en local pour ne pas polluer les stats.
- [x] ⚠️ Avant d'écrire le code, vérifier la doc locale
      (`node_modules/next/dist/docs/`) : cette version de Next.js diverge des
      conventions habituelles (cf. `AGENTS.md`).

## 3. Consentement RGPD/CNIL — obligatoire avant tout envoi

Google Analytics n'est **pas** exempté de consentement par la CNIL. Deux options :

**Option A — bannière de consentement + chargement conditionnel (choisie)**
- [x] Bannière maison légère (`components/ConsentAnalytics.tsx`) plutôt que
      tarteaucitron : un seul service à gérer, zéro dépendance externe, boutons
      Accepter/Refuser strictement identiques. Le tag GA n'est **pas chargé du tout**
      avant accord (plus strict que le Consent Mode, qui envoie des pings anonymes).
- [x] Ne charger le tag GA qu'après consentement explicite ; pas de pré-cochage.
- [x] Retrait du consentement : lien « Gérer les cookies » dans le footer, qui rouvre
      la bannière et supprime les cookies `_ga` en cas de refus.
- [x] Mentions légales (section RGPD) mises à jour : cookies déposés, durées (13 mois
      cookie, 14 mois données), modalités de retrait.

**Option B — alternative exemptée de consentement (pas de bannière)**
- [ ] Envisager [Matomo configuré selon l'exemption CNIL](https://matomo.org) (auto-hébergeable
      sur le VPS) ou Plausible : mesure d'audience sans bannière, données plus simples.
      À considérer sérieusement pour un site de contenu où la bannière fait fuir.

Décision à prendre avant l'étape 4 — le reste du document suppose l'option A (GA4).

## 4. Événements personnalisés utiles au site

GA4 mesure déjà pages vues, scroll et clics sortants (« mesures améliorées » — vérifier
qu'elles sont activées). À ajouter avec `sendGAEvent` de `@next/third-parties/google` :

- [x] `search` : terme cherché (page /recherche) — nom **standard GA4** plutôt que
      `recherche`, pour que le rapport « Recherche sur le site » se remplisse tout
      seul. Paramètres : `search_term`, `resultats`. Envoyé à partir de 3 caractères
      pour ne pas tracer chaque étape de la frappe.
- [x] `clic_plateforme` : clic sur « Toutes les options → » d'une fiche (le lien
      « où regarder », vers TMDB/JustWatch). Paramètres : `titre`, `type`,
      `plateformes`. C'est l'intention de visionnage — les fiches n'ont pas de lien
      direct vers Netflix/Prime.
- [x] `retrouveur_utilise` : envoyé en fin de session Retrouveur. Paramètres :
      `resultats` (nombre de titres trouvés), `erreur: 1` en cas d'échec.
- [x] `lecture_trailer` : clic sur le bouton « ▶ Bande-annonce » (lien YouTube).
      Paramètres : `titre`, `type`. (La lecture dans l'iframe embarquée n'est pas
      traçable sans l'API YouTube.)
- [x] Marquer `clic_plateforme` comme événement clé (Administration → Événements,
      possible seulement après réception des premiers événements).
- [x] Déclarer les dimensions personnalisées (voir étape 5 bis ci-dessous) — sans
      ça, les paramètres `titre`, `type`, `plateformes`, `resultats` ne remontent
      pas dans les rapports.

## 5 bis. Dimensions personnalisées (obligatoire pour voir les paramètres)

Administration → Définitions personnalisées → Créer une dimension personnalisée :

| Nom affiché | Portée | Paramètre d'événement |
|---|---|---|
| Titre | Événement | `titre` |
| Type de contenu | Événement | `type` |
| Plateformes | Événement | `plateformes` |
| Nombre de résultats | Événement | `resultats` |

(`search_term` est standard, rien à déclarer.)

## 5. Brancher Search Console et propreté des données

- [ ] Lier la propriété GA4 à Search Console (Administration → Associations de produits) :
      croise les requêtes Google avec le comportement sur site.
- [ ] Définir le trafic interne (votre IP) : Administration → Flux de données →
      Configurer les paramètres du tag → Définir le trafic interne, puis activer le
      filtre en mode « Actif ».
- [ ] Exclure les referrers parasites éventuels (spam) au fil de l'eau.

## 6. Suivre le trafic venant des chats IA

- [ ] Administration → Paramètres des canaux → créer un groupe de canaux personnalisé
      « IA » avec les sources : `chatgpt.com`, `chat.openai.com`, `perplexity.ai`,
      `claude.ai`, `copilot.microsoft.com`, `gemini.google.com`.
- [ ] Créer un rapport personnalisé « Trafic IA » (Explorer) : sessions, pages
      d'atterrissage, conversions par source IA — c'est l'indicateur de succès du
      plan `docs/visibilite-ia.md`.

## 7. Vérifier que tout fonctionne

- [ ] DebugView (Administration → DebugView) avec l'extension Chrome
      « Google Analytics Debugger » : vérifier pages vues + événements en temps réel.
- [ ] Vérifier qu'**aucun** hit ne part avant le consentement (onglet Réseau,
      filtrer `google-analytics.com/g/collect`).
- [ ] Contrôler à J+2 que les rapports Temps réel et Acquisition se remplissent.

## Rapports à regarder chaque semaine

1. **Acquisition → Acquisition de trafic** : part du SEO, du direct, des IA.
2. **Engagement → Pages et écrans** : quelles fiches/tops performent.
3. **Rapport « Trafic IA »** (étape 6) : progression mois par mois.
4. Search Console (lié) : requêtes qui montent, pages qui perdent des positions.
