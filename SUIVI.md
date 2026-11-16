# SUIVI – état actuel

*Mis à jour le 2026-11-16 (configuration du premier client).*

## Où en est-on ?

**Développement terminé : 12 parcours, coulisses, style ludique, plausibilité revue, formats court et standard recomposés. Tout est sur master.**

- Prochaine action : **⛔ point d'arrêt n°2.** L'animateur teste les séances courte (20 min) et standard (30 min) sur le vrai vidéoprojecteur, chronomètre en main, puis valide ou envoie ses retours.
- **Premier client : configuration prête, hors dépôt** (fichier `config/collectivite-<client>.js` et logo, remis à l'animateur sous forme d'archive ; ils ne sont pas dans git). Vérifiée avec `node outils/verifier.js --config <client>`.
- En attente de l'animateur ou du client :
  - quel prestataire assure le support des postes, et confirmation de l'outil de prise en main ;
  - messagerie Microsoft 365 ou serveur local, et méthode de double authentification (SMS ou application) ;
  - existence d'un stationnement payant avec horodateurs dans la commune (parcours 9) ;
  - nom exact du dossier de la direction de l'urbanisme (tronqué sur la capture) ;
  - photos du DGS (avec son accord) et du maire.
- Reporté : le film du parcours 1 (facultatif).

## Comment tester

1. Ouvrir `simulateur/index.html` dans Chrome, Edge ou Firefox, par double-clic, sans serveur ni connexion.
   Pour un client : décompresser son archive à la racine du dépôt, puis ouvrir `simulateur/seance-<client>.html`.
2. Choisir un format de séance (Tous, Court, Standard, Complet), puis cliquer sur un parcours. F passe en plein écran.
3. Touches :
   - → : suite, sur le chemin malveillant ;
   - ← : retour ;
   - R : dernier vote ;
   - I : afficher ou masquer tous les indices ;
   - K : afficher ou masquer les mots-clés. Ils sont **masqués par défaut** ; le bouton « Afficher les mots-clés (n) » n'apparaît que sur les écrans qui en ont ;
   - C : ouvrir ou fermer le panneau « Coulisses » (aussi par l'onglet discret à droite). Il reste ouvert d'un écran à l'autre ; trois onglets : « Cet écran », « Le scénario », « Le mode opératoire » ;
   - M : menu.
4. Film du parcours 1 : déposer les 6 vidéos dans `simulateur/videos/` (voir `LISEZMOI.txt`), puis passer `filmParcours1: true` dans `config/collectivite.js`. Sans les vidéos, le simulateur affiche la description de chaque séquence.
5. Contrôle automatique : `node outils/verifier.js` (94 écrans, 97 chemins, captures dans `captures/`).

## Décisions à valider

**Aucune.** Toutes les décisions ont été validées par l'animateur le 2026-11-04 et intégrées à la spécification (`docs/specification.md`, version 2). Le détail est dans HISTORIQUE.md.

## Blocages

- Aucun pour le développement.
- Aucun. Film reporté (facultatif). Plein écran validé par l'animateur.
