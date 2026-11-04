# SUIVI – état actuel

*Mis à jour le 2026-11-04.*

## Où en est-on ?

**Phase 1 terminée côté développement : moteur et parcours pilote n°2 (RIB fournisseur).**
**⛔ Point d'arrêt n°1 : on attend la validation de l'animateur avant d'attaquer les 11 autres parcours.**

- Dernière tâche terminée : relecture visuelle des captures du pilote et correction du placement des étiquettes.
- Prochaine action : l'animateur ouvre `simulateur/index.html` sur son poste et valide le rendu, la fluidité et le réalisme ; il tranche aussi les décisions ci-dessous.
- Ensuite : composants smartphone, navigateur, visio et explorateur, puis les parcours 1 et 3 à 12 (voir `BACKLOG.md`, phase 2).

## Comment tester le pilote

1. Ouvrir `simulateur/index.html` dans Chrome, Edge ou Firefox, par double-clic : aucun serveur ni connexion n'est nécessaire.
2. Appuyer sur F pour passer en plein écran, puis cliquer sur la carte « 2 · Un mail de fournisseur ».
3. Cliquer sur les éléments suspects du mail : ils s'entourent en rouge, avec leur étiquette.
4. Utiliser → pour la suite, R pour revenir au dernier vote, ← pour reculer, K pour masquer les mots-clés, I pour révéler tous les indices et M pour le menu.
5. Contrôle automatique : `node outils/verifier.js`, qui produit les captures dans `captures/`.

## Décisions à valider (écarts ou compléments à la spécification)

1. **Variables ajoutées pour le parcours 2** : `FOURNISSEUR_DOMAINE`, `FOURNISSEUR_DOMAINE_PIEGE`, `FOURNISSEUR_TEL_DOSSIER` et `FOURNISSEUR_TEL_PIEGE`.
   La spécification prévoit `{{DOMAINE_PIEGE}}` (exemple : saint-exemple-re.com) pour le domaine du faux fournisseur. Or cet exemple imite le domaine *de la collectivité*, alors que l'indice porte sur un domaine « proche de celui du dossier fournisseur ». Il fallait aussi un vrai numéro de dossier à comparer au numéro du mail.
   → `DOMAINE_PIEGE` est conservé pour le parcours 5. **À confirmer.**
2. **Titre « salle » neutre** (`titreSalle`) projeté dans le menu et le bandeau, par exemple « Un mail de fournisseur ». Les titres de la spécification (« Le faux partage… », « — malveillant ») révéleraient la réponse à la salle. Le titre complet n'apparaît qu'au débrief. **À confirmer.**
3. **Touches en plus** de celles de la spécification (→ et R) : ← retour, F plein écran, K mots-clés, I tous les indices, M menu. **À confirmer.**
4. **Étiquettes d'indices** : quand les cinq indices d'É1 sont révélés en même temps, deux étiquettes recouvrent un peu de texte ordinaire, jamais un autre indice. En séance, on les révèle une par une. **À juger sur le projecteur.**
5. **Numéros de téléphone fictifs** (0262 00 41 10, 0693 00 74 52) : il faudra vérifier qu'ils ne sont attribués à personne avant diffusion.

## Blocages

- Aucun pour le développement.
- Le film (Lemo-Opuscar) est un chantier parallèle à mener sur le poste de l'animateur. Il n'a pas été commencé.
