# Données publiques importées

Fichiers produits par les scripts `scripts/import-*.mjs`, lus côté serveur par le site.
Ils ne relèvent pas de la licence MIT du code : chacun garde la licence de sa source.

| Fichier | Source | Producteur | Licence | Script |
|---|---|---|---|---|
| `visas-cnc.json.br` | [Liste des visas d'exploitations cinématographiques](https://www.data.gouv.fr/datasets/6311c164ebfb165ddc828ded) | Centre national du cinéma et de l'image animée (CNC) | [Licence Ouverte v2.0 (Etalab)](https://www.etalab.gouv.fr/licence-ouverte-open-licence/) | `import-visas-cnc.mjs` |
| `entrees-cnc.json.br` | [Films ayant réalisé plus d'un million d'entrées](https://www.data.gouv.fr/datasets/films-ayant-realise-plus-dun-million-dentrees) | CNC | [Licence Ouverte (Etalab)](https://www.etalab.gouv.fr/licence-ouverte-open-licence/) | `import-entrees-cnc.mjs` |
| `tournages-france.json.br` | [Wikidata, lieu de tournage (P915)](https://www.wikidata.org/wiki/Property:P915), titres et disponibilités TMDB | Contributeurs de Wikidata | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) (lieux) | `import-tournages-france.mjs` |
| `tournages-paris.json.br` | [Lieux de tournage à Paris](https://opendata.paris.fr/explore/dataset/lieux-de-tournage-a-paris/) | Ville de Paris | [Open Database License (ODbL) 1.0](https://opendatacommons.org/licenses/odbl/1-0/) | `import-tournages-paris.mjs` |

## Base dérivée sous ODbL

`tournages-paris.json.br` est une base de données dérivée de « Lieux de tournage à Paris »
(Ville de Paris). Elle est mise à disposition sous la même licence, l'**Open Database
License (ODbL) 1.0**. Modifications : sélection des colonnes titre, type, année,
réalisateur, producteur, adresse et code postal ; rangement par colonne ; compression
Brotli. Pour la lire : décompresser (Brotli) puis lire le JSON.

## Visas du CNC

`visas-cnc.json.br` est tiré de la liste des visas du CNC (Licence Ouverte v2.0).
Modifications : courts métrages et lignes sans numéro de visa retirés ; colonnes
production, nationalité et localisation du dossier retirées ; rangement par colonne ;
compression Brotli. Date de mise à jour de la source : voir `source.maj` dans le fichier.

## Entrées du CNC

`entrees-cnc.json.br` est tiré du classeur Excel du CNC (une feuille par année depuis
2003, Licence Ouverte). Modifications : une ligne par film et par année (titre, date de
sortie convertie en AAAA-MM-JJ, année, entrées, nationalité) ; en-têtes et rangs retirés ;
rangement par colonne ; compression Brotli.
