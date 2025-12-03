# Flowtime

Projet d'application de productivité + calendrier + To-Do + Assistant IA

## 📑 Table des matières

-   [Description](#📌-description)
-   [Technologies utilisées](#🛠️-technologies-utilisées)
-   [Installation](#📦-installation)
-   [Architecture générale](#-architecture-générale)
-   [Fonctionnalités prévues](#-fonctionnalités-prévues)
-   [Lancer le projet](#🚀-lancer-le-projet)
-   [Structure du projet](#-structure-du-projet)
-   [Notes](#-notes)

## 📌 Description

Application web de productivité comprenant :

-   Un calendrier interactif (FullCalendar)
-   Une to-do list collaborative
-   Un assistant virtuel (IA) capable de générer un planning et des tâches
-   Un système de projets partagés

(Optionnel) Mise à jour temps réel via WebSocket

L’objectif : fournir un outil simple et intelligent pour organiser sa journée ou un projet d’équipe.

## 🛠️ Technologies utilisées

| Catégorie                     | Outils / Technologies                                            |
| ----------------------------- | ---------------------------------------------------------------- |
| **Frontend**                  | React (Vite) <br> FullCalendar <br> Axios                        |
| **Backend**                   | Django <br> JWT Token <br> Django-Jazzmin <br> Django-Channels\* |
| **Intelligence Artificielle** | API OpenAI                                                       |
| **Base de données**           | SQLite ou PostgreSQL                                             |

## 📦 Installation

Pour installer le projet,

-   Installer les dépendances

```
# Cloner le repo
git clone "https://github.com/H-Etien/ICC-TFE.git"

# Créer le venv
python -m venv venv

# Lancer le venv
.run_env.sh

# Installer les dépendances backend/Django
pip install -r requirements.txt

# Installer les dépendances frontend/React
npm install
```

## 🚀 Lancer le projet

-   Lancer le backend (Django)

```
. backend.sh
```

-   Lancer le frontend (React)

```
. frontend.sh
```

![emplacement script](emplacement_script.png)
