# SUIVI – état actuel

*Mis à jour le 2026-11-21 (réponses du premier client, variante sans double authentification).*

## Où en est-on ?

**Développement terminé : 12 parcours, coulisses, style ludique, plausibilité revue, formats court et standard recomposés. Tout est sur master.**

- Prochaine action : **⛔ point d'arrêt n°2.** L'animateur teste les séances courte (20 min) et standard (30 min) sur le vrai vidéoprojecteur, chronomètre en main, puis valide ou envoie ses retours.
- **Premier client : configuration à jour avec ses réponses, hors dépôt.** L'animateur reçoit un dossier complet prêt à l'emploi (simulateur, configuration et logo), à décompresser sur son PC. Vérifiée avec `node outils/verifier.js --config <client>`.
- Réponses reçues le 2026-11-21 : support des postes assuré en interne (pas de prestataire), outil de prise en main confirmé, messagerie Microsoft 365, pas de double authentification (à confirmer auprès de leur service informatique), parcours 9 laissé tel quel, nom du dossier confirmé.
- Encore attendu : la photo du maire. L'animateur dépose lui-même la photo du DGS sur son PC, dans `images/<client>/`.
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

1. **Variante « sans double authentification »** (option `doubleAuthentification`, `true` par défaut). Le premier client n'en aurait pas, donc le code SMS du parcours 1 et l'écran de code du parcours 5 ne lui parleraient pas. Avec l'option à `false` :
   - parcours 1 : l'escroc demande le mot de passe de session au lieu du code SMS (écran, vote et « Bien vu » dédiés) ;
   - parcours 5 : l'écran du code est remplacé par le vol du seul mot de passe (mot-clé « MOT DE PASSE VOLÉ »), et le débrief dit qu'un mot de passe suffit sans double authentification.
   Ces écrans ne figuraient pas dans la spécification ; ils y sont ajoutés comme variante. **À valider par l'animateur.**
2. **Faux support interne** : quand il n'y a pas de prestataire, le faux support du parcours 1 se présente au nom du service informatique interne (variable `PRESTATAIRE_INFO`). **À valider.**

## Blocages

- Aucun pour le développement.
- Aucun. Film reporté (facultatif). Plein écran validé par l'animateur.
