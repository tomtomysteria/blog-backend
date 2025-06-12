# blog-backend

## Stack technique

- **Framework principal** : [NestJS](https://nestjs.com/)
- **ORM** : TypeORM
- **Base de données** : PostgreSQL
- **Authentification** : JWT avec Passport.js
- **Validation** : class-validator & class-transformer
- **Documentation API** : Swagger via @nestjs/swagger
- **Sécurité** : Helmet, express-rate-limit, dompurify
- **Autres outils** : bcrypt, jsdom, uuid

## Installation

1. Cloner le dépôt
2. Installer les dépendances :

```bash
yarn install
```

3. Créer un fichier `.env` à la racine avec les variables suivantes :

```
DATABASE_URL=postgres://<user>:<password>@<host>:<port>/<db>
JWT_SECRET=<your_secret>
PORT=3000
```

4. Lancer la base PostgreSQL en local (ou connecter à un hôte distant)

## Développement

```bash
yarn start:dev
```

## Production

```bash
yarn build
yarn start:prod
```

## Tests

```bash
yarn test
```

## Accès à la documentation Swagger

Une fois le projet lancé, accéder à :

```
http://localhost:3000/api
```

Cela affiche l'interface Swagger pour tester l'API REST.

## Scripts utiles

- `yarn lint` : Linter avec ESLint
- `yarn format` : Formatage via Prettier
- `yarn test:e2e` : Tests end-to-end
