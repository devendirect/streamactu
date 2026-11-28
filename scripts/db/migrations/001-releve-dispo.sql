-- Relevé quotidien des catalogues (plan docs/seo-geo/plan-historique-dispo.md, lot 1).
-- plateforme = identifiant TMDB principal de la plateforme suivie (8 = Netflix…),
-- toutes variantes confondues (lib/fournisseurs-releve.json).
-- Conservation : 6 mois au plus (conditions TMDB), purge par scripts/releve-dispo.mjs.

-- Titres présents, confirmés par au moins deux relevés (ou par le relevé de référence)
CREATE TABLE releve_presence (
  plateforme SMALLINT UNSIGNED NOT NULL,
  type ENUM('film', 'serie') NOT NULL,
  tmdb_id INT UNSIGNED NOT NULL,
  -- Premier jour où la présence a été constatée (relevé de référence ou arrivée)
  depuis DATE NOT NULL,
  PRIMARY KEY (plateforme, type, tmdb_id),
  KEY titre (type, tmdb_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Changements vus une seule fois, en attente de confirmation (anti-bruit)
CREATE TABLE releve_attente (
  plateforme SMALLINT UNSIGNED NOT NULL,
  type ENUM('film', 'serie') NOT NULL,
  tmdb_id INT UNSIGNED NOT NULL,
  changement ENUM('arrivee', 'depart') NOT NULL,
  -- Premier jour où le changement a été vu : c'est la date de l'événement s'il est confirmé
  vu_le DATE NOT NULL,
  PRIMARY KEY (plateforme, type, tmdb_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Arrivées et départs confirmés ; on ajoute seulement, la purge des 6 mois exceptée
CREATE TABLE releve_evenement (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  jour DATE NOT NULL,
  plateforme SMALLINT UNSIGNED NOT NULL,
  type ENUM('film', 'serie') NOT NULL,
  tmdb_id INT UNSIGNED NOT NULL,
  evenement ENUM('arrivee', 'depart') NOT NULL,
  PRIMARY KEY (id),
  KEY titre (type, tmdb_id),
  KEY plateforme_jour (plateforme, jour),
  KEY jour (jour)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Un passage par jour, plateforme et type : journal, et détection du premier relevé
CREATE TABLE releve_passage (
  jour DATE NOT NULL,
  plateforme SMALLINT UNSIGNED NOT NULL,
  type ENUM('film', 'serie') NOT NULL,
  -- reference : premier relevé, aucun événement ; garde_fou : départs ignorés ce jour-là
  statut ENUM('reference', 'ok', 'echec', 'garde_fou') NOT NULL,
  nb_titres INT UNSIGNED NULL,
  nb_arrivees INT UNSIGNED NOT NULL DEFAULT 0,
  nb_departs INT UNSIGNED NOT NULL DEFAULT 0,
  duree_ms INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (jour, plateforme, type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
