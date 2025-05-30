# Creation d'une pile similaire depuis le début

Ce document présente comment créer une telle pile depuis le début.

Pour rappel cette pile propose un ensemble de serveurs sous forme de conteneurs en 2 versions : une pour un environnement de développement et une pour un environnement de production. La pile permet de déployer un application distribuée complète reposant sur une base de données SQL (MariaDb), une base de données noSQL (MongoDb), une API REST (construire en PHP avec le framework Symfony), une application web cliente (construite en React et MobX).

une base de donnée SQL (MariaDb), une base de donnée noSQL (MongoDb), un serveur d'exécution PHP-FPM exposant une application Symfony présant une API REST qui exploite les deux bases de données précédentes, un serveur HTTP nginx permettant d'accéder à l'API REST et servant les fichiers statiques de l'application front React (en version prod). Pour la version de produ un compilateur de l'application React (en production), utilisé comme serveur de développement (en )

__Environnement de développement__ :

- Pilotée par le fichier docker-compose.yml (utilisé par docker-compose par défaut).
- Conteneur _mariadb_ : base de données SQL.
  - Données possiblement initialisée avec les fichiers de données présent dans le dossier docker/dbInit/mariadb.
  - Configuration des identifiants pour l'environnement de développement.
  - Accessible directement depuis la machine hote via le port standard 3306 depuis son interface réseau de bouclage.
  - Accessible par le réseau interne des conteneurs "lpdiwa-net".
  - Données de BD persistente (volume géré par Docker).
- Conteneur _mongo_ : base de données noSQL.
  - Données possiblement initialisée avec les fichiers de données présent dans le dossier docker/dbInit/mongo.
  - Configuration des identifiants pour l'environnement de développement.
  - Accessible directement depuis la machine hote via le port standard 37017 depuis son interface réseau de bouclage.
  - Accessible par le réseau interne des conteneurs "lpdiwa-net".
  - Données de BD persistente (volume géré par Docker).
- Conteneur _symfony_ : serveur PHP-FPM serveur l'application Symfony.
  - À l'exécution, installe les dépendances du projet (au besoin) et lance le serveur PHP-FPM.
  - Mode "dev" utilisé pour l'application Symfony.
  - Packages de dépendances de l'application géré par Docker dans un volume (pour des raisons de performance si la pile est lancée dans un environnement comme Windows)
- Conteneur _http_ : serveur nginx
  - transmet toutes les requêtes à des ressources PHP au serveur PHP-FPM.
  - sert directement les autres ressources de l'application Symfony (a priori aucune puisque l'application est une API REST)
  - configuré pour permettre des requêtes vers les ressources depuis un autre site web (pour permettre l'utilisation du serveur de dev de l'application React)
  - Accessible directement depuis la machine hote via le port standard 8080 depuis son interface réseau de bouclage.
- Conteneur _npm_ : serveur de développement de l'application React
  - À l'exécution, installe les dépendances du projet (au besoin) et lance le serveur de développement
  - Application React automatiquement configurée pour utiliser l'adresse "localhost:8080" pour accéder à l'API depuis le navigateur du développeur.
  - Accessible directement depuis la machine hote via le port 3000 depuis son interface réseau de bouclage.

__Environnement de production__ :

- Pilotée par le fichier docker-compose-prod.yml (à spécifier explicitement à docker-compose).
- Conteneur _mariadb_ : base de données SQL.
  - Données possiblement initialisée avec les fichiers de données présent dans le dossier docker/dbInit/mariadb.
  - Configuration des identifiants pour l'environnement de production.
  - Accessible par le réseau interne des conteneurs "lpdiwa-net".
  - Données de BD persistente (volume géré par Docker).
- Conteneur _mongo_ : base de données noSQL.
  - Données possiblement initialisée avec les fichiers de données présent dans le dossier docker/dbInit/mongo.
  - Configuration des identifiants pour l'environnement de développement.
  - Accessible par le réseau interne des conteneurs "lpdiwa-net".
  - Données de BD persistente (volume géré par Docker).
- Conteneur _symfony_ : serveur PHP-FPM serveur l'application Symfony.
  - À l'exécution, installe les dépendances de symfony (au besoin) et lance le serveur PHP-FPM.
  - Mode "prod" utilisé pour l'application Symfony.
  - Packages de dépendances de l'application géré par Docker dans un volume (pour des raisons de performance si la pile est lancée dans un environnement comme Windows)
- Conteneur _http_ : serveur nginx
  - transmet toutes les requêtes à des ressources PHP au serveur PHP-FPM.
  - sert directement les autres ressources de l'application Symfony (a priori aucune puisque l'application est une API REST)
  - sert directement les ressources compilées de l'application React (index.html, différents bundle js et css, assets)
  - Accessible directement depuis le port 80 de n'importe quelle interface d la machine hote.
- Conteneur _npm_ : forge de l'application React
  - À l'exécution, installe les dépendances du projet (au besoin) et forge l'application React, dont les produits seront directement servis par le serveur Nginx. Une fois l'application React forgé, le conteneur s'arrête.
  - Application React automatiquement configurée pour utiliser une adresse relative pour accéder à l'API puisque l'application React et l'API seront accessible depuis le même serveur HTTP.

## Création de la structure de base

### Structure de fichier

Initialement nous créons la structure suivante :
- docker/ : le dossier des différents fichier de configuration, d'environnement des conteneurs
  - conf : dossier des fichiers de configurations des serveurs (nginx, symfony)
    - dev : fichiers de configuration pour l'environnement de dev
    - prod : fichiers de configuration pour l'environnement de production
  - dbInit : dossier prévu pour contenir les fichiers de données pour initialiser les bases de données (optionnel)
    - mariadb : fichiers (.sql, .zip) de données pour la base de données MariaDb
    - mongo : fichiers (.js) de données pour la base de données MongoDb
  - env : dossiers des fichiers de variables d'environnement de configuration des différents conteneurs
    - dev : fichers de variables d'environnement pour l'environnement de développement
    - dev : fichers de variables d'environnement pour l'environnement de production
  - helpers : scripts de simplification de manipulations des conteneurs
    - dump_mariadb.sh : export le contenu de la BD MariaDb sous la forme d'un dump SQL (dans stdout par défaut).
    - goto_mariadb.sh : ouvre un client en ligne de commande et se connecte à la base de données MariaDb
    - got_mongo.sh : ouvre un client en ligne de commande et se connecte à la base de données MongoDb
  - images: dossier d'images de conteneurs personnalisées (Dockerfile)
    - symfony : image pour le conteneur _symfony_
- .env : fichier de variables d'environnement commune à tous les conteneurs (utile pour la configuration d'un proxy par exemple)
- docker-compose.yml : fichier de déclaration et configuration des services (conteneurs) pour le développement
- docker-compose-prod.yml : fichier de déclaration et configuration des services (conteneurs) pour la production

### Préparation du fichier .env

Avant de commencer, si notre machine est derrière un proxy qui n'est pas tranparent, il est nécessaire d'éditer le fichier .env pour déclarer les variables d'environnement propre au proxy.

### Build inital des images personnalisées des conteneurs

Nous créons l'image utilisée pour le conteneur Symfony.

```
docker-compose build
```

## Création de l'API REST avec Symfony

### Initialisation du Symfony

_Toutes les commandes se feront à partir du dossier racine du projet SymfonyReactOnDocker_

Pour initialiser un projet avec composer, ce dernier est conçu pour lui-même créer le dossier racine du projet Symfony. Nous allons donc lancer un conteneur pour invoquer le programme composer en partageant notre dossier racine du projet dans lequel il créra lui-même le dossier du projet Symfony (api/) :


```
docker run -it --rm -v `pwd`:/var/www/html lpdiwa-project-dev-symfony symfony new api --version="6.1.*"
```

Nous installons ensuite les différentes

### Installation des packages

Nous installons ensuite les packages utilisés pour notre API :
- symfony/orm-pack : bibliothèque
- symfony/serializer-pack : permet la serialisation de structure au format json, etc.
- symfony/validator : permet la validation de données selon la spécifique JSR-303
- doctrine/annotations : parser d'annotations utilisées avec l'ORM doctrine
- doctrine/doctrine-fixtures-bundle : gestion des fixtures avec l'ORM/ODM doctrine
- doctrine/mongodb-odm-bundle : gestion de MongoDb avec doctrine (ODM)
- symfony/maker-bundle (uniquement pour le dev) : utilitaire de création d'entité

Pour des raisons de performance, nous les packages du projet Symfony sont installées dans un volume de docker. À la différence de la commande de l'initilisation, nous allons utiliser docker-compose pour lancer notre service _symfony_ (et ainsi créer automatiquement le volume). Nous supprimons ce service une fois la commande exécutée, mais sans supprimer less donnéers persistente (i.e : les volumes associés au service).

```
docker-compose run --rm symfony composer require symfony/maker-bundle --dev
docker-compose run --rm symfony composer require symfony/orm-pack symfony/serializer-pack symfony/validator doctrine/annotations doctrine/doctrine-fixtures-bundle doctrine/mongodb-odm-bundle
```

À la question "Do you want to include Docker configuration from recipes?" à l'installation du package doctrine/doctrine-bundle, nous pouvons répondre "non" (n) puisque nous n'utiliserons pas cette fonctionnalité.

À la question "Do you want to execute this recipe?" à l'installation du package doctrine/mongodb-odm-bundle, nous répondons "oui" (y) pour continuer à l'installer.

### Lancement des services de bases de données

Avant de pouvoir créer les premières entités et provoquer ensuite la création des tables SQL et collections Mongo associées, nous devons lancer les bases de données. Nous pouvons les lancer en background (option -d) ou dans un autre terminal pour voir les journaux de ces deux services en temps réél (sans l'option -d)

```
docker-compose up mariadb mongo
```

### Création des entités SQL et de leur correspondance en SQL

Nous crééons ensuite les entités SQL nécessaire intéractivement, via l'outil make.

```
docker-compose run --rm symfony php bin/console make:entity
```

Par exemple, pour la démo, nous avons créé une seule entité _TodolistEntry_ avec les champs suivant :
- _content_ (type string, not nullable, taille 255)
- _dueDate_ (type date, nullable)

Une fois les entités crées nous pouvons créer la migration, appliquer celle-ci à la base de données

```
docker-compose run --rm symfony php bin/console make:migration
docker-compose run --rm symfony php bin/console doctrine:migrations:migrate
```

On pourra par la suite observer les changement fait dans la base de données en s'y connectant (via le script docker/helpers/goto_mariadb.sh).

### Création des entités Mongo

Il n'existe pas d'outil interactif pour créer des entités pour l'ODM, il faut les créer à la main. Pour ce faire créer dans api/src/Document les entités (se référer à la démo pour un exemple d'entité).

### Création des controlleurs REST

Créer autant de controlleurs que nécessaire via l'outil make.

```
docker compose run --rm symfony php bin/console make:controller
```

Les controlleurs doivent ensuite être édité à la main.

Pour la démonstration nous avons créé 3 controlleurs :

- OptionsRequestsController : Controlleur de requete OPTIONS utilisé pour permettre le CORS, nécessaire dans l'environnement de dev.
- ApiMongoTodolistController : Controlleur basique (CRUD) des entrées de todo list stockées sur Mongo
- ApiSqlTodolistController : Controlleur basique (CRUD) des entrées de todo list stockées sur Mariadb

### Test de l'API

L'API REST peut être testée simplement avec des commande curl, avec un outil pour forger des requêtes REST...

Pour pouvoir tester l'API il faut lancer les service de bd, le service symfony ainsi que le service nginx.
On peut à ce stade stopper la pile docker-compose actuelle (mongo et mariadb) pour la relancer avec les 4 services (pour avoir ainsi les logs des 4 services dans le même terminal).

```
docker-compose down
docker-compose up mariadb mongo symfony http
```

Quelques tests applicables sur la démo, avec l'utilitaire curl :

__Test du controlleur d'entrées Todolist SQL__

```
# Liste de toutes les entrées (vide à ce moment)
curl http://localhost:8080/api/sqltodolist
# Création de 2 entrées
curl -d '{"content": "Premiere todo SQL", "dueDate": "2022-11-23"}' http://localhost:8080/api/sqltodolist
curl -d '{"content": "2ème todo SQL"}' http://localhost:8080/api/sqltodolist
# Liste de toutes les entrées (2 entrées retournées normalement)
curl http://localhost:8080/api/sqltodolist
# Modification de l'entrée d'id 2
curl -X PUT -d '{"content": "2ème todo SQL corrigee", "dueDate": "2022-12-15"}' http://localhost:8080/api/sqltodolist/2
# Liste de toutes les entrées (2 entrées retournées normalement)
curl http://localhost:8080/api/sqltodolist
# Suppression de l'entrée d'id 2
curl -X DELETE http://localhost:8080/api/sqltodolist/2
# Liste de toutes les entrées (une seule entrée retournée normalement)
curl http://localhost:8080/api/sqltodolist
```

__Test du controlleur d'entrée Todolist Mongo__

```
# Liste de toutes les entrées (vide à ce moment)
curl http://localhost:8080/api/mongotodolist
# Création de 2 entrées
curl -d '{"content": "Premiere todo Mongo", "dueDate": "2022-11-23"}' http://localhost:8080/api/mongotodolist
curl -d '{"content": "2ème todo Mongo"}' http://localhost:8080/api/mongotodolist
# Liste de toutes les entrées (vide à ce moment)
curl http://localhost:8080/api/mongotodolist
# Modification de l'entrée d'id XXX (reprendre l'id fourni avant pour la deuxième entrée)
curl -X PUT -d '{"content": "2ème todo Mongo corrigee", "dueDate": "2022-12-15"}' http://localhost:8080/api/mongotodolist/XXX
# Liste de toutes les entrées (2 entrées retournées normalement)
curl http://localhost:8080/api/mongotodolist
# Suppression de l'entrée d'id XXX (reprendre l'id fourni avant pour la deuxième entrée)
curl -X DELETE http://localhost:8080/api/mongotodolist/XXX
# Liste de toutes les entrées (une seule entrée retournée normalement)
curl http://localhost:8080/api/mongotodolist
```

### Test des backup de données

On peut tester la génération de sauvegarde de données des bases de données pour pouvoir par la suite initialiser des bases de données "vides"

__Backup__

```
./docker/helpers/dump_mariadb.sh
./docker/helpers/dump_mongo.sh
```

__Arrêt de la pile et suppression des volumes de données des BD__

```
docker-compose down
docker volume rm lpdiwa-project-dev_mariadb-data
docker volume rm lpdiwa-project-dev_mongo-data
```

__Relancement de la pile__

```
docker-compose up mariadb mongo symfony http
```

Lorsque la pile est correctement déployée (`docker-compose ps` doit afficher les 4 services comme "healthy"), vous pouvez vérifier que les données ont bien été remises en BD (`curl http://localhost:8080/api/sqltodolist` et `curl http://localhost:8080/api/mongotodolist`).

### Préparation pour un dépot GIT

A la génération de la structure d'application Symfony (`symfony new api`), un dossier .git est généré dans le dossier api/.
Pour pouvoir considérer votre project global comme un seul projet, ce dernier doit être supprimé.

```
rm -rf api/.git
```

## Création de l'application React

### Initialisation de la structure de projet

Vous pouvez initialiser votre projet à la main (`npm init` ou si vous n'avez pas npm sur votre machine en utilisant le service npm de la pile docker prévu `docker-compose run --rm npm npm init`), ou utiliser la structure proposée dans la démo et plus généralement dans le cours, qui est présentée ci-dessous

La structure de base d'un projet React est déjà présente dans un dépôt git, il s'agit donc de la rapatrier dans vottre dépot. Par soucis de simplicité, nous n'utiliserons pas la notion de submodules de git. L'incovénient est que nous ne pourrons pas simplement rappatrier des mise à jour de la structure de base du project React si celle-ci venait à changer dans le dépôt distant.

```
git clone https://github.com/IUT-LAVAL-MMI/react-base-app app
rm -rf app/.git
```

### Installation des packages de base

Pour installer les packages de base de l'application React, il suffit de les installer en utilisant le conteneur docker npm.

```
docker-compose run --rm npm npm ci
```

Si la commande échoue, cela est probablement dû au fichier package-lock.json qui a été créé par une version de npm trop ancienne par rapport à celle que vous utilisez. Il suffit d'appliquer ces deux commandes.

```
rm -rf app/node_modules package-lock.json
docker-compose run --rm npm npm install
```

### Création de l'application

#### Accès à l'URL de l'API REST depuis l'application React

Votre application aura besoin de communiquer avec l'API. Une bonne approche est d'injecter la variable d'environnement du conteneur de l'URL de cette dernière (déclarée dans le fichier docker/env/dev/npm.env et docker/env/prod/npm.env pour les environnements de dev. et prod. respectivement) comme constant de l'application, grace à webpack.

Pour ce faire, éditer le fichier app/webpack.dev.js (vous ferez de même pour app/webpack.prod.js), et insérez les deux lignes suivantes :

_Après la ligne 9 "const PUBLIC_PATH = '/';"_ :

```
const API_EP_URI = process.env.API_EP_URI;
```

_Vers la ligne 29 remplacez le bloc_

```
new webpack.DefinePlugin({
  'APP_ENV.APP_PUBLIC_PATH': JSON.stringify(PUBLIC_PATH),
  'APP_ENV.APP_TITLE': JSON.stringify(packageInfo.appTitle),
}),
```

par

```
new webpack.DefinePlugin({
  'APP_ENV.APP_PUBLIC_PATH': JSON.stringify(PUBLIC_PATH),
  'APP_ENV.APP_TITLE': JSON.stringify(packageInfo.appTitle),
  'APP_ENV.API_EP_URI': JSON.stringify(API_EP_URI),
}),
```

Dans votre application, lorsque vous voudrez utiliser cette constante _APP_ENV.API_EP_URI_, il suffirat de l'injecter dans votre code via la variable globale __APP_ENV.API_EP_URI__. Par exemple, un fetch sur les entrées de la todolist SQL de la démo pourrait être

```
fetch(`${APP_ENV.API_EP_URI}/sqltodolist`).then(...)
```

#### Création du code-source de l'application

C'est à vous de jouer pour cette partie !



docker compose -f docker-compose-prod.yml exec symfony php bin/console doctrine:migrations:migrate
