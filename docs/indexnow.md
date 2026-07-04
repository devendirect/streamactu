# IndexNow — soumettre les nouvelles pages à Bing en temps réel

## Pourquoi

IndexNow permet de **pousser** une URL vers les moteurs au moment où elle apparaît,
au lieu d'attendre leur prochain crawl. Pour StreamActu, où des dizaines de fiches
apparaissent chaque jour et où la fraîcheur est l'argument principal, c'est le
complément naturel du sitemap.

Moteurs participants : **Bing** (donc Copilot et ChatGPT Search, qui puisent dans son
index), Seznam, Naver, Yandex. **Google n'utilise pas IndexNow** — le sitemap reste
la seule voie pour lui. Un ping envoyé à un moteur participant est automatiquement
partagé avec les autres.

## Comment ça marche

1. Vous générez une **clé** (chaîne hexadécimale de 8 à 128 caractères).
2. Vous prouvez que vous possédez le domaine en servant un fichier
   `https://streamactu.fr/<clé>.txt` contenant exactement la clé.
3. À chaque nouvelle URL (ou URL modifiée), vous envoyez un ping HTTP.
   Deux formats :

**GET — une URL à la fois** (pratique pour tester) :

```
https://api.indexnow.org/indexnow?url=https://streamactu.fr/film/exemple-123&key=<clé>
```

**POST — jusqu'à 10 000 URLs d'un coup** (le format à utiliser en production) :

```http
POST https://api.indexnow.org/indexnow
Content-Type: application/json; charset=utf-8

{
  "host": "streamactu.fr",
  "key": "<clé>",
  "keyLocation": "https://streamactu.fr/<clé>.txt",
  "urlList": [
    "https://streamactu.fr/film/exemple-123",
    "https://streamactu.fr/serie/exemple-456"
  ]
}
```

Réponses : `200` accepté, `202` accepté (clé en cours de validation), `400` requête
invalide, `403` clé introuvable/invalide, `422` URLs hors domaine, `429` trop de requêtes.

## Mise en place sur StreamActu (étapes)

### 1. Générer et déposer la clé

- [ ] Générer une clé : 32 caractères hexadécimaux, par exemple avec
      `[guid]::NewGuid().ToString("N")` en PowerShell.
- [ ] Créer le fichier `public/<clé>.txt` contenant uniquement la clé (Next.js sert
      `public/` à la racine, aucune route à écrire).
- [ ] Stocker la clé dans une variable d'environnement `INDEXNOW_KEY` (Plesk +
      `.env.production`) pour les scripts — ne pas la committer en dur ailleurs
      que dans `public/` (le fichier public est par nature… public, ce n'est pas
      un secret, mais centraliser évite les divergences).
- [ ] Vérifier après déploiement : `curl https://streamactu.fr/<clé>.txt` renvoie la clé.

### 2. Choisir la stratégie d'envoi

Le site n'a pas d'événement « publication » : les fiches apparaissent au fil des
données TMDB (ISR). Deux options, de la plus simple à la plus fine :

**Option A — cron quotidien qui rejoue le flux RSS (recommandée)**

Le flux `/flux.xml` contient déjà les fiches des 7 derniers jours. Un script planifié
(tâche Plesk, une fois par jour après la revalidation) :

1. télécharge `https://streamactu.fr/flux.xml`,
2. en extrait les URLs `<link>`,
3. ajoute les pages chaudes du jour (`/`, pages plateformes, page jour courante),
4. envoie le tout en un seul POST IndexNow.

Envoyer une URL déjà soumise la veille est sans pénalité — IndexNow déduplique.
C'est ~60 lignes de script (Node ou PowerShell), zéro modification du code du site.

**Option B — ping au moment du rendu**

Déclencher le ping dans le code Next.js à la première génération d'une fiche.
Plus « temps réel », mais plus intrusif (effet de bord dans le rendu, gestion des
échecs, risque de pinger à chaque revalidation ISR). À réserver pour plus tard si
l'option A montre ses limites.

### 3. Vérifier que ça fonctionne

- [ ] Bing Webmaster Tools → **IndexNow** : le rapport liste les URLs reçues
      (délai de quelques heures après le premier ping).
- [ ] Tester une URL à la main avec le format GET ci-dessus — réponse `200` ou `202`.
- [ ] Au bout d'une semaine, comparer dans Bing WMT le délai d'indexation des
      nouvelles fiches avant/après.

## Bonnes pratiques et pièges

- **N'envoyer que du nouveau ou du modifié.** Bombarder tout le sitemap chaque jour
  est contre-productif : les moteurs jaugent la fiabilité des pings d'un site et
  ignorent ceux qui crient au loup.
- Ne jamais soumettre les pages noindex (recherche, surprise, jours futurs) : un
  ping vers une page noindex érode la confiance dans vos soumissions.
- La clé peut être changée à tout moment (nouveau fichier + nouveaux pings) ; les
  moteurs revalident automatiquement.
- IndexNow **ne garantit pas l'indexation** — il garantit que le moteur sait que
  l'URL existe. La qualité de la page décide du reste.
- 429 = ralentir. En pratique, un POST groupé par jour est très loin des limites.
