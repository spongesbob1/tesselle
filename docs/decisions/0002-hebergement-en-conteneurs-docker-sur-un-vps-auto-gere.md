# Conteneurs Docker sur un VPS auto-géré

## Context and Problem Statement

L'API Node.js, la base PostgreSQL et le stockage objet doivent être hébergés et déployés, et plusieurs fonctionnalités du projet reposent sur ce choix d'hébergement. Il faut le trancher maintenant, car il conditionne la manière de déployer l'API, de sauvegarder les données, de stocker les fichiers (URLs signées, bucket privé) et le coût récurrent du projet.

## Considered Options

1. PaaS managé (Render, Railway, Fly.io) avec Postgres managé
2. Cloud public complet (AWS : conteneur + RDS + S3)
3. Conteneurs Docker sur un VPS auto-géré
4. Hébergement déjà existant du front étendu à l'API

## Decision Outcome

Chosen option: 3 - Conteneurs Docker sur un VPS auto-géré, because il offre un coût faible et un contrôle total sur l'API, PostgreSQL et le stockage objet, avec une pile reproductible via Docker. Le surcroît d'exploitation (sauvegardes, mises à jour, sécurité) est accepté en contrepartie.

## Consequences

- Coût récurrent faible et prévisible, sans dépendance forte à un fournisseur PaaS ou cloud.
- Contrôle total sur la configuration de l'API, de Postgres et du stockage objet ; l'environnement est reproductible grâce aux conteneurs.
- Le stockage objet devra être un service compatible S3 auto-hébergé (ex. MinIO), ce qui permet de conserver les URLs signées et un bucket privé.
- L'équipe devient responsable des sauvegardes Postgres (planification, chiffrement, tests de restauration), des mises à jour système et des images, ainsi que de la sécurité (pare-feu, accès SSH, TLS, gestion des secrets).
- Pas de haute disponibilité ni de montée en charge automatique : le VPS est un point de défaillance unique, et la montée en charge sera manuelle.
- Il faudra prévoir un processus de déploiement (ex. Docker Compose, reverse proxy, CI/CD) et de la supervision/journalisation dans les cycles suivants.
- Une migration ultérieure vers un PaaS ou un cloud public reste possible, car l'usage de conteneurs et d'une API compatible S3 limite le couplage.
- Verify : choisir le fournisseur VPS, le dimensionnement et les versions des images (Node.js, PostgreSQL, MinIO) à partir des manifestes et fichiers de verrouillage du projet, et confirmer les pratiques de sécurité et de sauvegarde actuelles avant mise en production.

## Status

Proposed