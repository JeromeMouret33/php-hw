# SUIVI – état actuel

*Mis à jour le 2026-11-22 (mise en situation livrée, relecture de cohérence intégrée).*

## Où en est-on ?

**Développement terminé : 12 parcours, coulisses, style ludique, plausibilité revue, formats court et standard recomposés. Tout est sur master.**

- **Livré le 2026-11-22 : gestes et survol naturels.** Cliquer sur un bouton, un lien ou « décrocher » dans les fausses interfaces fait avancer le parcours ; l'adresse d'un lien apparaît au passage de la souris. « Suite ▸ » et → restent disponibles. Nouveau dossier complet remis à l'animateur.
- **Livré le 2026-11-22 : volet « Mise en situation »**, à gauche de l'écran (touche S), pour introduire chaque parcours. Il s'ouvre au lancement du parcours et se referme dès qu'on avance.
- **Relecture de cohérence du 2026-11-22** : un relecteur indépendant a relu le déroulé des 12 parcours avec la configuration du client. 20 remarques, dont 4 bloquantes ; 18 traitées, 2 laissées (voir HISTORIQUE). Les quatre séances ont été rejouées de bout en bout depuis le menu.
- **Séance conseillée pour le premier client** : Standard (30 min) pour tous les agents ; Court (20 min) si le créneau est serré ; Finances et direction (25 min) pour ces services.
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
3. **Gestes naturels** (demande de l'animateur du 2026-11-22). Les boutons et liens des fausses interfaces font avancer le parcours. Choix faits sans l'animateur, **à valider à l'essai** :
   - sur un écran suivi d'un vote, le geste joue directement le « mauvais » choix (la salle vient de dire « on clique ») ; « Suite ▸ » mène toujours au vote à main levée ;
   - sur un élément qui est aussi un indice, le 1er clic révèle l'indice, le 2e fait le geste ;
   - les appels en cours et les conversations n'ont pas de geste : « Suite ▸ » y reste le seul moyen ;
   - survol : sur les mails des parcours 4, 5 et 12, l'adresse du lien n'apparaît en bas à gauche qu'au passage de la souris sur le bouton ou le lien, puis reste affichée ; au parcours 4, cette adresse est un ajout (même domaine extérieur que l'expéditeur) ;
   - gestes en place : P1 et P3 (décrocher), P4 (rejoindre la réunion), P5 (ouvrir le document, se connecter, vérifier), P6 (la clé USB), P8 (lien du SMS, bouton du faux site), P9 (liens des deux SMS, autocollant du QR code).
4. **Volet « Mise en situation »** (demande de l'animateur du 2026-11-22). Les textes de contexte des 12 parcours ne figuraient pas dans la spécification : ils ont été rédigés pour l'occasion (lieu, moment, rôle, ce qui précède le message), sans rien dévoiler. Choix faits sans l'animateur, **à valider à l'essai** :
   - le volet s'ouvre de lui-même au lancement d'un parcours depuis le menu ou par « Parcours suivant », et se referme dès qu'on avance (réglable : option `situationAuDemarrage`) ;
   - en cours de parcours, il ne s'ouvre pas tout seul : l'onglet bat quand le contexte a changé, et l'animateur l'ouvre avec S ;
   - les textes eux-mêmes (ton, détails du quotidien) sont à relire par l'animateur.
5. **Corrections issues de la relecture du 2026-11-22**, qui touchent des textes de la spécification. **À valider** :
   - parcours 5 : l'adresse d'expédition du faux partage devient un indice (« ce n'est pas le domaine de la collectivité »), alors qu'il avait été décidé de ne pas en ajouter ;
   - parcours 7 : titre « Le mail de maintenance du service informatique » (au lieu de « de la DSI », terme inconnu de certains clients) ;
   - parcours 3 et 4 : une ligne « Impact » ajoutée au débrief (ce que coûte le mauvais choix) ; réflexe du parcours 4 reformulé (« changement de RIB ou paiement inhabituel », « mot de code ») ;
   - parcours 11 et 12 : phrase « À retenir » réécrite ;
   - parcours 1 : le réflexe ne parle de code SMS que si la double authentification existe ; l'escroc perd la main quand l'outil de prise en main est fermé, et non quand on raccroche.
6. **Laissé tel quel après la relecture** : l'expéditeur du vrai mail des impôts (parcours 12) reste en `impots.gouv.fr`, décision déjà validée ; le titre « Bonjour maman » du parcours 10 reste celui de la spécification, bien que le message dise « Coucou maman ».

## Blocages

- Aucun pour le développement.
- Aucun. Film reporté (facultatif). Plein écran validé par l'animateur.
