# Souplesse Pilates — Product Summary

[🇬🇧 English](#-english) | [🇫🇷 Français](#-français)

---

<a name="-english"></a>
## 🇬🇧 English Product Summary

(Remaining content from English guide...)
...
...

---

<a name="-français"></a>
## 🇫🇷 Résumé du Produit

Ce document offre une vue d'ensemble de la plateforme **Souplesse Pilates**. Il explique ce que fait le logiciel, pour qui il est conçu et sa valeur fondamentale.

---

## Qu'est-ce que c'est ?

Souplesse Pilates est une **application web de gestion de studio** pour les centres de Pilates. Elle permet aux propriétaires de publier leurs horaires en ligne, d'accepter des réservations en temps réel et de gérer l'ensemble des opérations depuis un tableau de bord sécurisé.

---

## Pour qui est-ce conçu ?

### Propriétaires / Managers de Studio
- Publier et gérer les horaires (Pilates, Yoga, Stretching, Cardio).
- Surveiller la capacité des cours en temps réel.
- Consulter, ajouter et supprimer des réservations clients.

### Clients / Visiteurs
- Parcourir les cours disponibles avec des fiches visuelles riches.
- Réserver une place via un assistant guidé en 3 étapes.
- Recevoir une confirmation immédiate à l'écran.

---

## Comment ça marche ?

L'application est un **monolithe full-stack** propulsé par :
- **Backend** : Java 21 + Spring Boot 4.x + PostgreSQL
- **Frontend** : HTML5, CSS3, JavaScript ES6 (React SPA)
- **Sécurité** : Authentification JWT sans état pour l'administration.
- **Déploiement** : Docker Compose (démarrage en une seule commande).

---

## Fonctionnalités Clés

| Fonctionnalité | Public | Admin |
| :--- | :---: | :---: |
| Parcourir les cours disponibles | ✅ | ✅ |
| Réserver un cours (assistant en 3 étapes) | ✅ | — |
| Voir toutes les réservations | — | ✅ |
| Créer / Éditer / Supprimer des cours | — | ✅ |
| Gérer les réservations clients | — | ✅ |
| Tableau de bord sécurisé par JWT | — | ✅ |

---

## Identifiants Admin par Défaut

- **Email** : `admin@souplesse.dz`
- **Mot de passe** : `admin123`

Ces identifiants sont créés automatiquement au premier démarrage.
