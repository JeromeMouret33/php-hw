# HISTORIQUE

Journal daté, en ordre antichronologique.

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
