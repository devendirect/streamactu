# Visibilité dans les chats IA (ChatGPT, Claude, Perplexity, Gemini, Copilot)

Plan d'action pour que StreamActu.fr soit trouvé, cité et recommandé par les assistants IA.
Les étapes sont ordonnées : commencez par le haut, chaque bloc est autonome.

## 1. Servir un `llms.txt` à la racine

Le fichier `https://streamactu.fr/llms.txt` est un standard émergent : un condensé du site
en Markdown, pensé pour être lu par les modèles. À faire :

- [x] Créer une route Next.js `app/llms.txt/route.ts` qui renvoie du `text/plain`
      (même modèle que `app/flux.xml/route.ts` déjà en place). *Fait : liens plateformes
      et tops générés depuis `PLATEFORMES` et la date courante, revalidation 24 h.*
- [x] Contenu recommandé :

```markdown
# StreamActu.fr

> Les nouveautés séries et films du streaming en France, mises à jour chaque jour :
> Netflix, Prime Video, Disney+, Apple TV+, Canal+, Max et Paramount+.
> Notes, casting, bandes-annonces et classements mensuels et annuels.

## Pages principales

- [Accueil](https://streamactu.fr/) : les sorties du jour par plateforme
- [Sitemap](https://streamactu.fr/sitemap.xml) : toutes les fiches films et séries
- [Flux RSS](https://streamactu.fr/flux.xml) : les dernières nouveautés
- [Tops](https://streamactu.fr/top/films-2026) : classements par mois et par année

## À propos

- Données : TMDB (The Movie Database), disponibilités France uniquement
- Langue : français
```

- [x] Garder les URLs et la description synchronisées quand la structure du site évolue.
      *Fait : règle ajoutée dans `AGENTS.md` (tout agent qui touche aux routes publiques
      doit synchroniser llms.txt, llms-full.txt et le footer dans le même commit) ; les
      liens plateformes et tops sont de toute façon générés dynamiquement.*
- [x] Optionnel : `llms-full.txt` avec la liste complète des tops en cours (généré
      dynamiquement, comme le sitemap). *Fait : `app/llms-full.txt/route.ts` — tops année
      et dernier mois révolu, titre par titre avec note et lien fiche, référencé depuis
      llms.txt. Réutilise les caches des pages top (aucun appel TMDB en plus).*

## 2. Ouvrir robots.txt aux crawlers IA — décision à prendre

`app/robots.ts` autorise déjà `*` : **tous les robots IA passent donc aujourd'hui**.
Il n'y a rien à ajouter pour être visible. La vraie décision est inverse : voulez-vous
bloquer l'entraînement tout en gardant la visibilité « recherche » ? Deux familles d'agents :

| Usage | Agents | Effet si bloqué |
|---|---|---|
| Recherche/citation (à garder) | `OAI-SearchBot`, `ChatGPT-User`, `Claude-User`, `Claude-SearchBot`, `PerplexityBot`, `Bingbot` | Le site disparaît des réponses avec sources |
| Entraînement (blocable sans perte de visibilité) | `GPTBot`, `ClaudeBot`, `Google-Extended`, `CCBot`, `Applebot-Extended` | Le contenu ne nourrit plus les futurs modèles |

- [x] Décider : tout laisser ouvert (recommandé pour un site d'actualité qui vit de sa
      visibilité) ou bloquer la famille « entraînement » dans `app/robots.ts`.
      *Choix par défaut appliqué : tout reste ouvert (aucune modification de robots.ts).
      Revenez sur ce point si vous préférez bloquer l'entraînement.*
- [ ] Ne jamais bloquer `Bingbot` : Copilot **et** ChatGPT Search s'appuient sur l'index Bing.

## 3. S'inscrire sur Bing Webmaster Tools

ChatGPT Search et Copilot puisent dans Bing ; c'est le levier le plus direct.

- [x] Créer un compte sur [Bing Webmaster Tools](https://www.bing.com/webmasters)
      (import possible depuis Search Console en un clic).
- [x] Soumettre `https://streamactu.fr/sitemap.xml`.
- [ ] Activer IndexNow pour pousser les nouvelles fiches dès leur création
      (une clé à déposer à la racine + un ping HTTP à chaque nouvelle URL).

## 4. Rendre le contenu « citable » par un modèle

Les assistants citent les pages qui répondent directement à une question. Le site a déjà
le JSON-LD (Movie, TVSeries, ItemList, aggregateRating) — c'est la base. En plus :

- [x] Chaque fiche doit répondre en clair, dès le premier écran, à « où regarder X ? ».
      *Fait : phrase-réponse sous les badges dans `FicheDetail.tsx` — « *Titre*, film
      sorti le *date*, est disponible en streaming sur *Plateformes* en France. »
      (formulation honnête : la date est celle de la sortie, pas de l'ajout au catalogue).*
- [x] Dates explicites et absolues. *Fait via la phrase-réponse (date complète pour les
      films, année de première diffusion pour les séries).*
- [x] Les tops en listes ordonnées HTML (`<ol>`) — déjà le cas — avec le critère de
      classement énoncé en toutes lettres dans l'intro. *Fait : « Classement établi
      d'après la note des spectateurs sur TMDB, pondérée par le nombre de votes. »*
- [x] Ajouter une courte section FAQ sur les pages plateformes (« Quelles sont les
      nouveautés Netflix ce mois-ci ? ») : les questions formulées telles quelles
      matchent les requêtes utilisateurs dans les chats.
- [x] Vérifier que tout le contenu important est dans le HTML servi : OK, tout est
      SSR/ISR, aucun contenu clé rendu uniquement côté client.

## 5. Notoriété hors site (ce que les modèles « savent »)

Les modèles recommandent les sites qu'ils ont vus cités ailleurs pendant l'entraînement.

- [x] Page « À propos » claire : qui, quoi, source des données (TMDB), fréquence de mise
      à jour. *Fait : `/a-propos` (app/a-propos/page.tsx), liée dans le footer, le sitemap
      et le llms.txt.*
- [ ] Obtenir des liens/mentions sur des sites déjà bien connus des modèles
      (annuaires de sites de streaming, articles presse tech FR, Reddit r/francophonie
      streaming, forums ciné).
- [ ] Cohérence du nom : toujours « StreamActu.fr » (le modèle associe le nom au domaine).

## 6. Mesurer les visites venant des IA

- [ ] Dans Analytics (voir `docs/google-analytics.md`), créer un canal personnalisé
      regroupant les referrers : `chatgpt.com`, `chat.openai.com`, `perplexity.ai`,
      `claude.ai`, `copilot.microsoft.com`, `gemini.google.com`.
- [ ] Dans les logs Plesk, suivre la fréquence de passage des user-agents IA
      (`GPTBot`, `PerplexityBot`, `ClaudeBot`…) pour vérifier qu'ils crawlent bien
      après la mise en place du llms.txt.

## Vérifications finales

- [ ] `curl https://streamactu.fr/llms.txt` renvoie 200 en `text/plain`.
- [ ] Poser la question dans ChatGPT (mode recherche) et Perplexity :
      « quelles sont les nouveautés Netflix en France ce mois-ci ? » — noter si
      streamactu.fr apparaît dans les sources, refaire le test chaque mois.
