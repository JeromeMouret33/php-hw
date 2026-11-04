# HISTORIQUE

Journal daté, en ordre antichronologique.

## 2026-11-04 – Lien mort (issue #1) et protection du dépôt public

**Contexte** : une issue GitHub, ouverte par un robot publicitaire de vérification de liens, signale que le lien du dépliant DGFiP sur les FOVI renvoie une erreur 404. Après vérification directe, c'est exact. Le lien « Replay » du robot n'a pas été ouvert.

**Fait**
- Lien remplacé par la nouvelle adresse officielle du dépliant « Le point sur – Les escroqueries aux faux ordres de virement » (collectivites-locales.gouv.fr), vérifiée : PDF, code 200.
- Autres liens de la spécification testés : la plupart répondent. La Banque Postale, BleepingComputer et GitHub (Lemo-Opuscar) répondent 403, et l'étude sur les clés USB ne répond pas : ce sont probablement des blocages anti-robots, à vérifier dans un navigateur.
- Dépôt public : `.gitignore` empêche de publier les configurations clients (`collectivite-<client>.js`), les images et les vidéos (seuls les LISEZMOI restent publiés). Un avertissement est ajouté en tête de `config/collectivite.js` et dans `images/LISEZMOI.txt`. Testé avec des fichiers fictifs.

**Résultat** : `node outils/verifier.js` → 97 écrans, 106 chemins, aucun problème.

## 2026-11-04 – Parcours 1 sur l'outil de prise en main habituel

**Constat de l'animateur** : ses clients utilisent déjà TeamViewer avec leur vrai support. Version validée : outil habituel, puis code SMS, avec deux votes.

**Fait**
- Nouvelle variable `OUTIL_PRISE_EN_MAIN` (« TeamViewer » par défaut). La fenêtre de l'outil a un habillage générique, sans logo de l'éditeur.
- Parcours 1 réécrit :
  - boîte inondée, puis appel d'un numéro inconnu ;
  - « ouvrez {{OUTIL_PRISE_EN_MAIN}} comme d'habitude, donnez-moi l'identifiant et le mot de passe » (vote 1) ;
  - prise de contrôle : RH et paie refusés, copie, fichier de mots de passe ;
  - « lisez-moi le code SMS » pour garder le compte après l'appel (vote 2) ;
  - rançon quelques jours plus tard.
- Message clé : « le bon outil, mais pas le bon interlocuteur ».
- Film aligné (vote après la séquence 2), spécification mise à jour.
- Ajout à prévoir dans le mail à la collectivité : demander quel outil de prise en main utilise leur support.

**Résultat** : `node outils/verifier.js` sans erreur ; captures du parcours 1 relues.

## 2026-11-04 – Format « Finances et direction »

**Demande de l'animateur** : ajouter la séance proposée pour les publics finances et direction.

**Fait**
- **Format « Finances et direction (25 min) »** : 10 · 3 · 2 · 5 · 4 · 7, soit 17 minutes de parcours et 5 minutes de réflexes.
- **Logique** :
  - on ouvre sur un perso (« Coucou maman ») pour mettre la salle en confiance ;
  - puis la fraude au président, le RIB fournisseur, le faux partage (le vol de compte, qui explique la variante « boîte du fournisseur piratée » du parcours 2) et la visio truquée ;
  - on finit sur un message légitime.
- Ajout dans `moteur.js` et dans la spécification. Vérification au navigateur : menu, et enchaînement 10 → 3 → 2 → 5 → 4 → 7 → conclusion.

## 2026-11-04 – Formats court et standard pour des agents non spécialistes

**Demande de l'animateur** : composer les séances courte et standard avec des situations accessibles à des agents de mairie, sans les dégoûter. Le format complet garde les 12 parcours.

**Fait**
- **Court (20 min)** : 9 · 10 · 5 · 1 · 7, soit 14 minutes de parcours et 5 minutes de réflexes.
- **Standard (30 min, au lieu de 35)** : 9 · 5 · 10 · 11 · 6 · 8 · 12 · 1 · 7, soit 24 minutes de parcours et 5 minutes de réflexes.
- **Principes** :
  - les parcours 2, 3 et 4 sont écartés : ils demandent de connaître le circuit de la dépense et sont réservés au format complet ;
  - la séance commence par du perso ;
  - il y a un légitime toutes les 3 ou 4 situations ;
  - le parcours 12 vient juste après le 8 ;
  - la séance finit par le faux technicien, puis un message légitime.
- Mise à jour dans `moteur.js` et dans la spécification. Vérification au navigateur : menu filtré, et enchaînement 9 → 10 → 5 → 1 → 7 → conclusion.

## 2026-11-04 (nuit) – Décisions validées, mots-clés à la demande, fusion

**Décisions validées par l'animateur**, toutes conformes aux recommandations :
- parcours 1 avec deux votes et le fichier de mots de passe ;
- réorientation des parcours 3 et 4 ;
- ordre « Complet » ;
- écrans ajoutés (bonnes réponses et « Et si on l'avait supprimé ? ») ;
- « On le signale » compté comme prudent ;
- rythme du parcours 9 ;
- film qui remplace tous les écrans fixes du parcours 1 ;
- détails validés en bloc.

**Spécification** : passée en version 2, avec toutes les décisions validées et un historique des versions.

**Retour de l'animateur sur les mots-clés** : ils apparaissaient tout seuls. Désormais ils sont masqués à chaque écran. L'animateur les affiche avec le bouton « Afficher les mots-clés (n) », présent seulement sur les écrans qui en ont, ou avec la touche K. Le vérificateur contrôle qu'ils ne s'affichent jamais d'office et que le bouton correspond à leur présence.

**Fusion** : la branche `simulateur-phishing` est fusionnée dans `master`, à la demande de l'animateur.

**Résultat** : `node outils/verifier.js` → 97 écrans, 106 chemins, aucun problème ; captures relues.

## 2026-11-04 (soir) – Revue de plausibilité des 12 scénarios

**Demande de l'animateur** : vérifier que chaque scénario est plausible. Pour le parcours 1, les agents de ses clients n'ont pas les droits d'installation, alors que le scénario « faux support qui fait installer un outil (type TeamViewer) » est bien réel chez eux. Choix demandé : rendre le scénario plus costaud, ou assumer que l'installation est impossible.

**Choix retenu : les deux.** Le poste bloque l'outil (la protection fonctionne), et l'attaquant contourne par le compte de l'agent.

**Fait**
- Parcours 1, réécrit :
  - appel d'un numéro inconnu ;
  - demande de lancer un outil, « même sans droits » ;
  - vote 1, puis **outil bloqué** (indice vert) ;
  - plan B : « lisez-moi les deux codes reçus par SMS » ;
  - vote 2, puis connexion à distance avec le compte, où RH et paie sont refusés mais où traîne un fichier de mots de passe ;
  - rançon quelques jours plus tard ;
  - film aligné sur cette histoire.
- Parcours 2 : chronologie par le comptable public.
- Parcours 3 : « faire passer » le paiement sans les pièces.
- Parcours 4 : changement du RIB du notaire.
- Parcours 6 et 8 : nuances dans les coulisses ; source Arcep ajoutée au parcours 8.
- Parcours 5, 7, 9, 10, 11 et 12 : relus, sans changement.

**Sources consultées** :
- TeamViewer (QuickSupport « ne nécessite aucune installation ») ;
- Arcep (authentification des numéros depuis octobre 2024 ; 531 signalements d'usurpation en 2023, plus de 19 000 en 2025) ;
- Microsoft Threat Intelligence (mai 2024).

**Résultat** : `node outils/verifier.js` → 97 écrans, 106 chemins, aucun problème ; captures relues.

## 2026-11-04 (fin de journée) – Coulisses, style ludique, sources, relecture

**Demandes de l'animateur** :
- film facultatif, reporté ;
- plein écran validé ;
- numéros fictifs laissés tels quels ;
- points à sourcer : à faire par Claude ;
- relecture par un agent séparé ;
- nouveau panneau dépliable « Coulisses » (scénario, mode opératoire, ce qui se passe), activable à volonté ;
- style plus ludique pour la chronologie, le débrief et les réflexes.

**Fait**
- **Panneau « Coulisses »** (`moteur.js`) :
  - onglet discret à droite et touche C ;
  - le panneau reste ouvert d'un écran à l'autre ;
  - onglets « Cet écran », « Le scénario » (avec cible, durée et source), « Le mode opératoire ».
- **Commentaires rédigés pour les 12 parcours**, par deux agents en parallèle (1 à 6, 7 à 12), puis relus. Le parcours 5 explique le vol du code de double authentification : une fausse page qui relaie en temps réel, puis le cookie de session.
- **Style ludique** :
  - chronologie en cartes de bande dessinée qui apparaissent l'une après l'autre ;
  - débrief avec score en étoiles, bilan des votes, cartes illustrées et médaille du réflexe ;
  - conclusion en cartes à collectionner, avec un tampon final.
- **Sources** :
  - Arup : CNN et SCMP, mai 2024 ;
  - étude sur les clés USB : Tischer et al., IEEE S&P 2016 ;
  - SMS d'amende : ANTAI et Cybermalveillance.gouv.fr ;
  - Assistance rapide : Microsoft Threat Intelligence, mai 2024.
  - Les textes concernés ont été corrigés : chiffres Arup précisés, 45 % pour les clés USB, sens du code de l'Assistance rapide.
- **Relecture par un agent séparé** : 22 remarques. Appliquées :
  - tutoiement du vrai DGS ;
  - mot-clé « CODE SAISI » ;
  - débrief sans indices en mode film ;
  - verdicts propres aux parcours légitimes ;
  - « signaler » compté comme prudent ;
  - coulisses des votes sans la réponse, verdict masqué avant le vote ;
  - étiquettes qui évitent liens, boutons et éléments clés (nouvelle classe `cle`) ;
  - conséquence du P9 cohérente avec le chemin joué ;
  - mots-clés qui masquaient la copie de fichiers (P1) ;
  - textes agrandis (dont « Validé par vous ») ;
  - « Primes_2026.xlsx.exe » ;
  - étiquette ameli.fr ;
  - nuance juridique du P8 ;
  - compteur géant de l'inondation (P1) ;
  - pertes bénignes en orange plutôt qu'en sirène rouge ;
  - numéro de la banque affiché (P8) ;
  - IBAN sans code bancaire réel ;
  - redirection et règle « . » expliquées (P5) ;
  - bandeau de la visio placé sur le maire ;
  - poignée des coulisses plus discrète ;
  - « À retenir » du P1 réécrit.
- **Écartées** : numéros fictifs (choix de l'animateur), domaine des impôts (les deux domaines sont officiels, on garde la spécification), doubles parenthèses du réflexe 5 (déjà corrigées).
- **Vérificateur** : contrôle de la présence des coulisses, de la touche C et des captures du panneau ouvert, avec une attente pour les animations.

**Résultat** : `node outils/verifier.js` → 94 écrans, 97 chemins, aucun problème ; captures relues.

## 2026-11-04 – Phase 2 : les 11 autres parcours

**Retour de l'animateur sur le pilote** : validé (« c'est top » pour le mail, bien pour le vote, le débrief et les réflexes). Corrections demandées :
- la touche I doit aussi masquer les indices → elle bascule désormais entre afficher et masquer ;
- la touche K « ne fait rien » → elle n'agissait que sur les écrans qui ont des mots-clés, sans aucun retour visible. Désormais, un message s'affiche (« Mots-clés masqués », « Pas de mot-clé sur cet écran »), les mots-clés réapparaissent immédiatement, et le bouton n'apparaît que s'il y a des mots-clés ;
- à terme, un style plus ludique pour É3 (chronologie), le débrief et les réflexes → ajouté au BACKLOG.

**Fait**
- Moteur :
  - cibles conditionnées par une option de configuration (mode film) ;
  - second bouton de « Bien vu » paramétrable (`suiteDebrief`) ;
  - ordres de passage court, standard et complet au menu ;
  - adresses mail construites avec `{{ADRESSE:NOM}}` et FORMAT_ADRESSE ;
  - espaces insécables avant « ? ! : ; » ;
  - silhouette pour les numéros inconnus ;
  - texte foncé une fois un indice révélé.
- Composants : smartphone (SMS, WhatsApp, application), navigateur, visio, explorateur de fichiers, plus les écrans rançon, photo illustrée en SVG (clé USB, horodateur), séquence vidéo et comparaison. Messagerie : compteur, invitation, barre d'état au survol.
- Parcours 1 et 3 à 12, en fichiers de données. Le parcours 1 a aussi son mode film en 6 séquences, avec le dossier `videos/` et son `LISEZMOI.txt`.
- Vérificateur : gestion des cibles conditionnelles, contrôle des touches I et K, attente avant capture.
- Relecture visuelle de toutes les captures, en planches. Défauts corrigés :
  - menu coupé en bas ;
  - numéro illisible une fois révélé sur fond sombre ;
  - avatars « +6 » et « 03 » ;
  - terminal qui masquait le fichier piégé (parcours 6) ;
  - « ? » isolé en fin de ligne.
- Thèmes Gmail et Zimbra de la messagerie relus en capture.

**Résultat** : `node outils/verifier.js` → 94 écrans, 97 chemins complets (mode film compris), aucun problème.

**Détails de réalisme ajoutés** : chaque fichier de parcours les liste en en-tête. Pour l'essentiel :
- numéros d'appel dans des plages fictives et domaines inventés ;
- montants (acompte de 24 800 €, 480 000 € pour la visio, 35 € d'amende, paiements débités) ;
- répliques complètes des appels ;
- newsletters et mails de remplissage ;
- textes des écrans « Et si on l'avait supprimé ? ».

**Décisions prises, en attente de validation** : voir `SUIVI.md` (9 points).

## 2026-11-04 – Phase 1 : moteur et parcours pilote n°2

**Fait**
- Mise en place du cadre : `docs/specification.md` (copie figée), `CLAUDE.md`, et le triptyque SUIVI / BACKLOG / HISTORIQUE. La spécification nomme le triptyque sans en fixer le format ; le format a donc été défini ici (voir `CLAUDE.md`).
- BACKLOG exhaustif tiré de la spécification : moteur, configuration, 6 composants, 12 parcours, film, vérifications, points d'arrêt, points à sourcer, informations à recueillir.
- Simulateur hors ligne `simulateur/` :
  - Moteur : navigation, historique, indices cliquables, votes avec décompte, « Voir la suite quand même », « Bien vu » puis « Et si on avait continué ? », mots-clés en tampon, débrief avec indices trouvés et manqués, menu, carton des 5 réflexes, raccourcis clavier, scène 1920×1080 mise à l'échelle, visuel générique pour les images manquantes.
  - Configuration unique `config/collectivite.js`, avec toutes les variables de la spécification et des cases à cocher pour les parcours actifs.
  - Composants : messagerie (thèmes Outlook, Gmail et Zimbra), écran d'appel, chronologie de conséquences.
  - Parcours 2 en fichier de données pur : É1, vote 1, vote 2, É2a, É2b, Bien vu, É3, débrief.
- Vérificateur `outils/verifier.js` (Playwright) : structure, impasses, cibles, règle d'or, rendu de chaque écran, variables non remplacées, indices, boutons morts, flèche →, touche R, taille minimale du texte, absence de requête réseau, 6 chemins complets joués au clic, captures.
- Relecture visuelle des captures. Deux corrections : chevauchement des étiquettes d'indices (placement à 4 positions candidates qui évite les autres indices), et colonne de dates de la chronologie trop étroite.

**Résultat** : `node outils/verifier.js` → 8 écrans contrôlés, 6 chemins complets, aucun problème.

**Détails de réalisme ajoutés (absents de la spécification)**
- Parcours 2 : montant de la facture (18 450 €), banque et IBAN fictifs (« Nordbank Digital », Vilnius, LT58…), domaines et numéros fictifs du fournisseur, quatre mails de remplissage dans la boîte de réception, répliques exactes des deux appels, textes de la chronologie.

**Décisions prises, en attente de validation** : voir `SUIVI.md`, section « Décisions à valider ».
