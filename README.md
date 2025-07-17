# 🚀 Système d'Affiliation React

Un système d'affiliation complet développé en React avec gestion des rôles (Admin, Influenceur, Prospect), authentification JWT, et interface responsive.

## 📋 Fonctionnalités

### 🔐 Authentification & Rôles
- **Authentification JWT** avec stockage sécurisé
- **Trois rôles utilisateurs** : Admin, Influenceur, Prospect
- **Redirection automatique** selon le rôle après connexion
- **Routes protégées** avec vérification des permissions

### 👨‍💼 Interface Admin
- **Dashboard** avec statistiques globales et graphiques
- **Gestion des influenceurs** (liste, ajout, modification, suppression)
- **Gestion des prospects** (validation, suivi)
- **Gestion des remises** (paiements, validation)
- **Statistiques détaillées** avec graphiques Recharts

### 👤 Interface Influenceur
- **Dashboard personnel** avec statistiques individuelles
- **Gestion des liens d'affiliation** (création, suivi)
- **Suivi des prospects** personnels
- **Historique des remises** et gains
- **Statistiques personnelles** avec graphiques

### 🌐 Interface Publique
- **Formulaire d'affiliation** accessible via lien unique
- **Validation des liens** d'affiliation
- **Inscription simplifiée** pour les prospects
- **Confirmation d'inscription** avec redirection

## 🛠️ Technologies Utilisées

- **React 18** - Framework frontend
- **React Router DOM** - Gestion des routes
- **Ant Design** - Framework UI principal
- **Recharts** - Bibliothèque de graphiques
- **Axios** - Client HTTP

## 🎨 Gestion des styles

- **Ant Design** : Composants UI principaux et thèmes personnalisés
- **CSS personnalisé** : Fichiers CSS (`App.css`, `index.css`) et styles inline pour l'adaptation visuelle
- **Responsive** : Utilisation des composants Ant Design et de styles CSS pour l'adaptation mobile/tablette/desktop

## 📁 Structure du Projet

```
src/
├── components/          # Composants réutilisables
│   ├── Button.jsx
│   ├── Input.jsx
│   └── PrivateRoute.jsx
├── context/            # Contextes React
│   └── AuthContext.jsx
├── layouts/            # Layouts par rôle
│   ├── AdminLayout.jsx
│   ├── InfluenceurLayout.jsx
│   └── PublicLayout.jsx
├── pages/              # Pages de l'application
│   ├── admin/          # Pages Admin
│   ├── influenceur/    # Pages Influenceur
│   └── public/         # Pages Publiques
├── services/           # Services API
│   ├── authService.js
│   ├── influenceurService.js
│   ├── prospectService.js
│   └── remiseService.js
└── App.jsx            # Point d'entrée principal
```

## 🚀 Installation & Démarrage

### Prérequis
- Node.js (version 16 ou supérieure)
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone <repository-url>
cd front

# Installer les dépendances
npm install

# Créer le fichier .env à la racine
cp .env.example .env # (ou créez-le manuellement)
# Modifiez la variable REACT_APP_API_URL selon votre environnement

# Démarrer le serveur de développement
npm start
```

L'application sera accessible à l'adresse : `http://localhost:3000`

## 🔧 Configuration

### Variables d'environnement
Créez un fichier `.env` à la racine du projet :

```env
REACT_APP_API_URL=http://localhost:8000
```

- **REACT_APP_API_URL** : URL de base de l'API backend (à adapter pour la production)

### API Backend
Le système est conçu pour fonctionner avec une API backend qui expose les endpoints suivants :

#### Authentification
- `POST /api/influenceurs/auth/login/` - Connexion
- `GET /api/influenceurs/auth/profile/` - Profil utilisateur

#### Influenceurs
- `GET /api/influenceurs/` - Liste des influenceurs
- `POST /api/influenceurs/` - Créer un influenceur
- `PUT /api/influenceurs/:id/` - Modifier un influenceur
- `DELETE /api/influenceurs/:id/` - Supprimer un influenceur

#### Prospects
- `GET /api/prospects/` - Liste des prospects
- `POST /api/prospects/` - Créer un prospect
- `POST /api/prospects/:id/valider/` - Valider un prospect

#### Affiliation
- `GET /api/affiliation/:code/` - Informations d'affiliation
- `POST /api/affiliation/:code/` - Soumettre une affiliation

#### Remises
- `GET /api/remises/` - Liste des remises
- `POST /api/remises/:id/payer/` - Payer une remise
- `GET /api/remises/statistiques/` - Statistiques des remises

## 🎨 Interface Utilisateur

### Design Responsive
- **Basé sur Ant Design** : composants responsives, grilles, formulaires, tableaux, etc.
- **Styles CSS personnalisés** : pour ajuster l'apparence et les couleurs (voir `App.css`, `index.css`)
- **Styles inline** : pour des ajustements rapides et des backgrounds dynamiques

### Composants Réutilisables
- **Button** - Boutons avec variantes et états de chargement (Ant Design + custom)
- **Input** - Champs de saisie avec validation (Ant Design + custom)
- **PrivateRoute** - Protection des routes par rôle

## 🔒 Sécurité

### Authentification
- **JWT Token** stocké dans localStorage
- **Intercepteurs Axios** pour ajouter automatiquement le token
- **Gestion des erreurs 401** avec redirection automatique
- **Validation des rôles** à chaque changement de route

### Protection des Routes
- **PrivateRoute** vérifie l'authentification et le rôle
- **Redirection automatique** vers la page appropriée
- **Écran de chargement** pendant la vérification du token

## 📊 Fonctionnalités Avancées

### Graphiques et Statistiques
- **Recharts** pour les visualisations
- **Graphiques en ligne** pour l'évolution des données
- **Cartes de statistiques** avec indicateurs de changement
- **Données en temps réel** (simulées pour l'exemple)

### Gestion des États
- **Context API** pour l'état global d'authentification
- **Hooks personnalisés** pour la logique métier
- **Gestion d'erreurs** centralisée
- **États de chargement** pour une meilleure UX

## 🧪 Tests

```bash
# Lancer les tests
npm test

# Lancer les tests en mode watch
npm test -- --watch
```

## 📦 Build de Production

```bash
# Créer le build de production
npm run build

# Tester le build localement
npx serve -s build
```

## 🏗️ Déploiement

1. **Créer un fichier `.env`** à la racine avec la bonne URL d'API :
   ```env
   REACT_APP_API_URL=https://votre-api-production.com/api/v1
   ```
2. **Lancer la commande de build** :
   ```bash
   npm run build
   ```
3. **Déployer le dossier `build/`** sur votre hébergeur (Netlify, Vercel, Nginx, etc.)

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Contacter l'équipe de développement

---

**Développé avec ❤️ en React et Ant Design**
