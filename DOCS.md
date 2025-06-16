# Documentation Technique & Métier - blog-backend

## Objectif du projet

Ce backend sert d'API REST pour un système de blog permettant :

- L'inscription et l'authentification des utilisateurs
- La création, modification, lecture et suppression d'articles (CRUD)
- La gestion des commentaires et des utilisateurs

## Concepts métier

- **Utilisateur** : peut créer un compte, se connecter, publier des articles, commenter
- **Article** : contient un titre, un contenu (HTML sécurisé), un auteur, une date
- **Commentaire** : rattaché à un article, publié par un utilisateur

## Concepts techniques et librairies

### NestJS

Framework Node.js orienté vers la modularité et l'architecture propre. Basé sur TypeScript. Il utilise les décorateurs, l'injection de dépendances, les modules, et permet une organisation claire du code.

### TypeORM

ORM (Object Relational Mapper) qui permet d'interagir avec la base PostgreSQL en manipulant des entités TypeScript. Supporte les migrations, relations entre entités, et requêtes typées.

### PostgreSQL

Base de données relationnelle utilisée pour stocker les utilisateurs, articles et commentaires. Elle est robuste, open-source, et très utilisée dans les projets Node.js.

### JWT (jsonwebtoken)

Permet de générer des tokens d’authentification. Ces tokens sont utilisés pour sécuriser les routes backend et permettent de maintenir une session utilisateur côté frontend sans serveur d’état.

### Passport.js + passport-jwt

Librairie d’authentification middleware. Elle permet de vérifier le token JWT pour sécuriser les routes avec stratégie d’authentification.

### class-validator & class-transformer

Permettent la validation automatique des DTOs (objets de transfert de données) avec des décorateurs. Ex : `@IsEmail()`, `@Length(3, 50)`.

### dompurify + jsdom

Dompurify nettoie le contenu HTML (généré via l’éditeur frontend) pour éviter les attaques XSS. Jsdom est nécessaire pour exécuter dompurify côté serveur car il simule un DOM navigateur.

### express-rate-limit

Middleware pour limiter le nombre de requêtes par IP sur certaines routes sensibles (comme login), évitant les attaques brute-force.

### Helmet

Ajoute des headers de sécurité HTTP à l'application Express intégrée dans NestJS. Exemple : désactive le cache, empêche l’exécution de scripts inline, etc.

### Swagger - @nestjs/swagger

Génère automatiquement une documentation interactive de l’API à partir des décorateurs NestJS (`@ApiTags`, `@ApiProperty`, etc.). Accessible à `/api`.

### uuid

Génère des identifiants uniques universels (UUID), utiles pour identifier de manière sécurisée et distribuée les utilisateurs, articles, etc.

## Routes principales

- `POST /auth/login`, `POST /auth/register`
- `GET /articles`, `POST /articles`, `PUT /articles/:id`, `DELETE /articles/:id`
- `GET /articles/:id/comments`, `POST /comments`, etc.

## Communication avec le frontend

- Le frontend interagit via HTTP (Axios)
- Le token JWT est inclus dans les headers `Authorization: Bearer <token>`
- Les réponses sont formatées en JSON
- Les erreurs sont gérées via les codes HTTP (401 = non authentifié, 403 = interdit, 422 = validation, etc.)
