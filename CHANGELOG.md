# Changelog

Toutes les modifications notables apportées à ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/),
et ce projet adhère au [Versionnage Sémantique](https://semver.org/lang/fr/).

## [Non publié]

### Ajouté

- Suppression des avertissements de qualité de code (`biome-ignore` pour les styles `!important` légitimes dans `globals.css`)
- Documentation JSDoc complète sur les schémas de validation (`backend.schemas.ts`, `frontend.schemas.ts`)
- Corrections de formatage automatique sur les composants `Banner`, `ProjectBanner` et les pages `dashboard` et `projects`

## [0.1.0] - 2025-06-01

### Ajouté

#### Authentification

- Inscription sécurisée avec validation du formulaire (prénom, nom, email, mot de passe)
- Connexion avec gestion de session via cookies chiffrés (JWT)
- Déconnexion avec suppression de session
- Mise à jour du profil utilisateur (prénom, nom, email)
- Changement de mot de passe sécurisé avec vérification de l'ancien mot de passe
- Data Access Layer (DAL) avec vérification de session mise en cache (`React.cache`)

#### Gestion des Projets

- Création de projets avec nom, description et contributeurs optionnels
- Édition des informations d'un projet (nom, description)
- Suppression de projets
- Gestion des membres : ajout et suppression de contributeurs avec rôle (`ADMIN`, `CONTRIBUTOR`)
- Gestion des droits d'accès par rôle :
  - **OWNER/ADMIN** : peut éditer le projet et gérer les contributeurs
  - **CONTRIBUTOR** : peut créer et gérer des tâches
  - **Non-membre** : aucun accès au projet

#### Gestion des Tâches

- Création de tâches avec titre, description, date d'échéance, priorité et assignés
- Édition complète des tâches (tous les champs sont modifiables)
- Suppression de tâches
- Système de statuts : `TODO`, `IN_PROGRESS`, `DONE`, `CANCELED`
- Système de priorités : `LOW`, `MEDIUM`, `HIGH`, `URGENT`
- Assignation de tâches à plusieurs utilisateurs

#### Commentaires

- Ajout de commentaires sur les tâches
- Suppression de commentaires
- Affichage chronologique des commentaires avec auteur et date

#### Génération IA de Tâches (RAG)

- Intégration avec l'API Mistral AI via LlamaIndex.TS
- Saisie de prompts en langage naturel pour décrire les tâches souhaitées
- Récupération et injection des tâches existantes dans le contexte du LLM (RAG)
- Génération automatique de tâches pertinentes et contextualisées
- Streaming de la réponse en temps réel via Server-Sent Events
- Interface de révision : modification et validation avant intégration au projet

#### Tableaux de Bord

- Vue liste des tâches assignées à l'utilisateur, triées par urgence
- Vue kanban mensuelle des tâches (par statut)
- Vue liste des projets avec les tâches assignées
- Calendrier d'événements pour visualiser les échéances

#### Interface et Accessibilité

- Design responsive adapté aux mobiles (370px+), tablettes et desktops
- Conformité WCAG 2.1 niveau AA :
  - Balises ARIA sur les composants interactifs
  - Navigation au clavier complète
  - Textes alternatifs sur toutes les images
  - Contraste des couleurs vérifié (ratios 4.5:1 à 7:1)
- Composants UI accessibles basés sur Radix UI et Base UI
- Support du mode sombre (dark mode)

#### Architecture Technique

- Framework : Next.js 16 avec App Router, React 19, TypeScript
- Server Actions pour toutes les opérations sensibles
- Validation des données avec Zod (côté client et serveur)
- Sanitisation des entrées utilisateur avec DOMPurify
- Documentation API générée automatiquement avec TypeDoc
- Déploiement de la documentation sur GitHub Pages via GitHub Actions
- Linting et formatage avec Biome

[Non publié]: https://github.com/WillIsback/P11-Abricot/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/WillIsback/P11-Abricot/releases/tag/v0.1.0
