# Abricot.co - SaaS de Gestion de Projet IA

**Projet 11 - Formation Développeur FullStack IA - OpenClassroom**  
Développé par : Derue William

## Vue d'ensemble

Abricot.co est une plateforme SaaS innovante de gestion de projet collaboratif augmentée par l'IA. Elle permet aux freelances et aux équipes de gérer efficacement leurs projets et tâches, avec la capacité de générer automatiquement des tâches via une intelligence artificielle.

## Fonctionnalités principales

### Authentification et Profil

- Inscription et connexion sécurisées
- Gestion du profil utilisateur (nom, email, mot de passe)

### Gestion des Projets

- Création et édition de projets
- Attribution de rôles : administrateur, contributeur
- Gestion des contributeurs

### Gestion des Tâches

- Création et édition de tâches
- Assignation à des utilisateurs
- Suivi du statut (À faire, En cours, Terminée)
- Système de commentaires collaboratifs

### Génération IA de Tâches

- Saisie de prompts textuels libres
- Analyse avec RAG (Retrieval Augmented Generation) des tâches existantes
- Génération automatique de tâches pertinentes
- Modification et intégration au projet avant validation

### Tableaux de Bord

- Vue liste des tâches assignées (par urgence)
- Vue kanban des tâches du mois
- Vue liste des projets avec tâches assignées

## Stack Technique

| Élément            | Technologie                            |
| ------------------ | -------------------------------------- |
| Framework Frontend | Next.js + React + TypeScript           |
| Framework IA/RAG   | LlamaIndex.TS                          |
| LLM                | Mistral AI                             |
| Accessibilité      | WCAG 2.1 niveau AA                     |
| Design             | Responsive (mobile, tablette, desktop) |

## Installation et Démarrage

Le project fonctionne avec un [fork](https://github.com/WillIsback/dev-react-P11.git) du backend original qui a été largement modifié. [![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/WillIsback/dev-react-P11.git)

### Prérequis

- backend `git clone https://github.com/WillIsback/dev-react-P11.git`
- Node.js 18+
- pnpm

### Installation

```bash
pnpm install
```

### Développement

```bash
pnpm dev
```

L'application sera accessible à [http://localhost:3000](http://localhost:3000)

### Build Production

```bash
pnpm build
pnpm start
```

## Architecture du Projet

```
src/
├── app/                    # Pages et layout Next.js
├── components/            # Composants React réutilisables
├── contexts/             # Contexts React (ProjectContext)
├── action/               # Server Actions
├── service/              # Logique métier (auth, project, task, user, dashboard)
├── lib/                  # Utilitaires (client, server, session, DAL)
├── schemas/              # Schémas de validation
└── types/                # Types TypeScript
```

## Conventions de Code

- Code TypeScript conforme aux standards
- Nommage explicite des fonctions et composants
- Commentaires sur le code complexe
- Composants fonctionnels avec Hooks
- Server Actions pour les opérations sécurisées

## Restrictions d'Accès

- **Administrateur du projet** : Peut éditer le projet, gérer les contributeurs, créer et supprimer des tâches
- **Contributeur** : Peut créer et supprimer des tâches seulement
- **Non-contributeur** : Pas d'accès au projet

## Documents de Référence

- [Cahier des charges - Auto-évaluation](/.github/Context/Cdc.md)
- [Spécifications Fonctionnelles](/.github/Context/Specification.md)
