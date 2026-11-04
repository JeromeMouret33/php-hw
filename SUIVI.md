# SUIVI – état actuel

*Mis à jour le 2026-11-04.*

## Où en est-on ?

**Phase 2 terminée : les 12 parcours sont développés et vérifiés.** Le pilote a été validé par l'animateur (point d'arrêt n°1), avec deux retours sur les touches I et K, corrigés.

- Dernière tâche terminée : relecture des captures des 12 parcours et correction des défauts vus à l'écran.
- Prochaine action : l'animateur joue les 12 parcours sur son poste, puis tranche les décisions ci-dessous.
- Ensuite, d'après la spécification :
  - phase 3, le film du parcours 1 (chantier parallèle, sur le poste de l'animateur) ;
  - phase 4, la relecture par un agent séparé, puis **⛔ le point d'arrêt n°2** : répétition à blanc sur le vrai vidéoprojecteur, chronomètre en main ;
  - plus tard, le style plus ludique de la chronologie, du débrief et des réflexes (retour de l'animateur, « à terme »).

## Comment tester

1. Ouvrir `simulateur/index.html` dans Chrome, Edge ou Firefox, par double-clic, sans serveur ni connexion.
2. Choisir un format de séance (Tous, Court, Standard, Complet), puis cliquer sur un parcours. F passe en plein écran.
3. Touches :
   - → : suite, sur le chemin malveillant ;
   - ← : retour ;
   - R : dernier vote ;
   - I : afficher ou masquer tous les indices ;
   - K : masquer ou réafficher les mots-clés (un message s'affiche s'il n'y en a pas sur l'écran) ;
   - M : menu.
4. Film du parcours 1 : déposer les 6 vidéos dans `simulateur/videos/` (voir `LISEZMOI.txt`), puis passer `filmParcours1: true` dans `config/collectivite.js`. Sans les vidéos, le simulateur affiche la description de chaque séquence.
5. Contrôle automatique : `node outils/verifier.js` (94 écrans, 97 chemins, captures dans `captures/`).

## Décisions à valider

**Décisions de la phase 1 (pilote)** : variables fournisseur ajoutées, titres neutres projetés, touches supplémentaires, recouvrement des étiquettes quand tout est révélé.
→ Le pilote a été validé sans remarque sur ces points : je les considère comme acceptés. À reconfirmer si besoin.

**Nouvelles décisions (phase 2)** :

1. **Le film remplace É1 à É5, pas seulement É2 à É5.** La séquence 1 du film montre la même boîte inondée que l'écran É1 ; garder les deux ferait doublon.
2. **Vote placé après la séquence 2 du film**, avant que Nadia ne donne le code. Le film ne prévoit pas de vote, mais la règle d'or en exige un.
3. **Écrans ajoutés pour les bonnes réponses**, que le storyboard ne détaille pas :
   - rappel au vrai support (parcours 1) ;
   - rappel au vrai DGS (parcours 3) ;
   - appel de l'enfant sur l'ancien numéro, sans paiement (parcours 10) ;
   - page intranet de confirmation (parcours 7).
4. **Écrans « Et si on l'avait supprimé ? »** pour les parcours légitimes 7, 11 et 12 : ce que l'agent aurait perdu, rédigé sobrement, car la spécification n'en donne pas le contenu.
5. **Parcours 7, option « On le signale »** : un écran « Prudent, mais pas nécessaire » plutôt qu'une mauvaise réponse.
6. **Parcours 9** : les votes du colis et de l'amende mènent tous deux à la variante suivante. La conséquence (É4) se joue une seule fois, à la fin, comme dans le storyboard.
7. **Ordre « Complet »** proposé : 9 · 5 · 10 · 2 · 8 · 12 · 3 · 11 · 6 · 4 · 1 · 7. Il alterne perso et pro autant que possible et place 12 juste après 8. Il finit par le film puis un légitime, mais les légitimes tombent en 6e, 8e et 12e positions, pas exactement « tous les 3 ou 4 ».
8. **Images** : `signature-mail.png` n'est pas utilisée ; la signature des mails internes affiche le logo, sans quoi le visuel générique serait peu lisible. Les « conseillers » de la visio utilisent `conseiller-1.jpg` et `conseiller-2.jpg`, absents de la liste de la spécification : sans ces fichiers, une silhouette générique s'affiche.
9. **Parcours 5** : l'expéditeur du faux partage utilise `{{DOMAINE_PIEGE}}`, comme le prévoit le tableau des variables, sans indice ajouté dessus.

## Blocages

- Aucun pour le développement.
- Film (Lemo-Opuscar) : pas commencé, à faire sur le poste de l'animateur.
- Plein écran : à essayer sur un vrai poste (impossible à tester ici).
