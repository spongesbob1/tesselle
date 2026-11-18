# Stockage objet compatible S3 (bucket privé + URLs signées) pour les avatars

## Context and Problem Statement

Les avatars téléversés par les utilisateurs doivent rester visibles uniquement de leur propriétaire tant qu'un modérateur ne les a pas validés. Il faut donc choisir dès maintenant où stocker les fichiers et comment contrôler leur accès, car ce choix conditionne le flux de téléversement, le modèle de validation et l'infrastructure à provisionner. Le projet utilise PostgreSQL avec Prisma pour la persistance des données.

## Considered Options

1. Stockage objet compatible S3 (bucket privé + URLs signées)
2. Système de fichiers du serveur de l'API
3. Dans PostgreSQL (colonne binaire)
4. Service tiers de gestion d'images (ex. Cloudinary)

## Decision Outcome

Chosen option: 1 - Stockage objet compatible S3 (bucket privé + URLs signées), because il sépare les fichiers de la base de données et permet de n'exposer un avatar non validé qu'à son propriétaire grâce à des URLs signées à durée limitée. Le service de stockage supplémentaire à provisionner est un coût acceptable au regard de l'isolation des accès et de la scalabilité obtenues.

## Consequences

- Bénéfice : les binaires restent hors de PostgreSQL, ce qui garde la base et ses sauvegardes légères.
- Bénéfice : le contrôle d'accès repose sur des URLs signées à durée limitée, sans faire transiter chaque image par l'API.
- Bénéfice : l'API reste sans état vis-à-vis des fichiers, ce qui facilite le déploiement multi-instances et la montée en charge.
- Contrainte : un service de stockage compatible S3 (et son bucket privé) doit être provisionné et configuré dans chaque environnement.
- Contrainte : l'API doit gérer la génération des URLs signées, leur durée de validité et la vérification des droits (propriétaire ou modérateur) avant de les émettre.
- Contrainte : la cohérence entre le statut de validation (en base) et l'objet stocké n'est pas transactionnelle ; il faudra traiter les cas d'échec partiel et les fichiers orphelins.
- Impact futur : la validation par un modérateur pourra reposer sur ce même mécanisme (URL signée pour la revue, puis diffusion de l'avatar validé).
- Verify : choisir le fournisseur S3 compatible, le SDK client et la durée de validité des URLs signées selon les manifestes et l'infrastructure du projet.

## Status

Proposed