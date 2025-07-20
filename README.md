🎮 Lootopia Frontend

Interface web Angular du projet Lootopia – un jeu de chasse au trésor interactif où les joueurs peuvent créer, rejoindre, et creuser pour dénicher des récompenses virtuelles.


🧱 Stack technique

Angular 18 (avec composants standalone)

Angular Material (UI)

Google Maps JavaScript API

JWT Auth avec LocalStorage

API RESTful (backend Spring Boot)


📁 Structure principale du repo


src/

├── app/

│   ├── auth/                # Login, Register, Activation

│   ├── pages/               # Toutes les pages du site

│   │   ├── chasses/         # Pages liées aux chasses (création, liste, etc.)

│   │   ├── participations/  # Pages de participation et creusage

│   │   ├── admin/           # Page de gestion admin

│   ├── services/            # Services Angular (API + stockage local)

│   ├── layout/              # Barre latérale + layout principal

├── assets/icons/           # Icônes (treasureChest.jpg)


✅ Fonctionnalités implémentées


🔐 Authentification

Création de compte (avec acceptation RGPD)

Activation de compte par lien (token)

Connexion par email/mot de passe

Gestion du token JWT + rôle utilisateur

Affichage dynamique des menus selon le rôle (USER, ADMIN)

Déconnexion


🎮 Joueur (ROLE_USER)
Voir les chasses publiques

Rejoindre une chasse

Voir ses participations

Creuser pour chercher un trésor (via carte ou coordonnées)

Re-tenter un creusage après 24h ou débloquer avec des couronnes

Voir sa progression et les récompenses obtenues

Page "Gestion du compte" (pseudo, email, mot de passe, MFA, etc.)


🛠️ Organisateur (ROLE_USER)
Créer une nouvelle chasse

Voir les chasses qu’on a créées

Ajouter des étapes avec :

Validation par passphrase

Validation par repère RA

Validation par cache géographique (avec carte interactive + coffre)

Modifier une chasse


🛡️ Administrateur (ROLE_ADMIN)
Accès exclusif à la page "Gestion des utilisateurs"

Voir tous les utilisateurs (pseudo, email partiel, type de compte)

Supprimer un utilisateur de la base

Accès interdit à toutes les pages USER


🧪 Fonctionnalités annexes
Synchronisation du rôle utilisateur dans localStorage

Mise à jour automatique du solde de couronnes

Compte à rebours visible après un creusage échoué

Gestions d'états (spinner, messages d'erreurs, succès)


🧭 Navigation dynamique
L’interface adapte dynamiquement les éléments affichés :

Si non connecté → pages login / register uniquement

Si connecté en USER → pages joueur + organisateur

Si connecté en ADMIN → uniquement la page admin + déconnexion


🧰 À venir (non inclus dans le MVP)
Système complet de MFA

Mode RA réel pour les repères

Edition des infos personnelles

Historique complet des actions
