# BACKLOG

Liste exhaustive des tâches, tirée de `docs/specification.md`. On ne coche une case qu'après vérification.
Légende : `[x]` fait et vérifié · `[ ]` à faire · `[~]` commencé, voir la note · `[-]` reporté ou hors périmètre, voir la note.

## Phase 0 – Cadre

- [x] Spécification copiée dans `docs/specification.md`
- [x] `CLAUDE.md` et le triptyque SUIVI / BACKLOG / HISTORIQUE mis en place

## Phase 1 – Moteur et parcours pilote (parcours 2)

### Moteur (`simulateur/js/moteur.js`)
- [x] Navigation entre écrans, historique, retour arrière
- [x] Indices cliquables : entourés en rouge (suspect) ou en vert (rassurant), avec une étiquette courte, placée de façon à ne pas recouvrir les autres indices ; texte foncé une fois révélé, même sur fond sombre
- [x] Votes : saisie du résultat par l'animateur (compteurs + et −, pourcentages), affichage à l'écran, choix de la branche, rappel du choix dans le bandeau
- [x] « Voir la suite quand même » disponible à chaque vote (règle d'or, contrôlée par le vérificateur)
- [x] Écran « Bien vu » puis bouton « Et si on avait continué ? » vers la suite malveillante complète
- [x] Variante légitime : le bouton montre ce que l'agent aurait perdu en supprimant le message (`libelleSuite`, écran « Et si… ») – éprouvée sur les parcours 7, 11 et 12
- [x] Mots-clés en surimpression, sans voix (apparition en tampon ; K masque et réaffiche, avec un message de confirmation ; bouton présent seulement s'il y a des mots-clés)
- [x] Débrief : indices trouvés et manqués, ce que fait l'attaquant ensuite, impact, réflexe en une phrase
- [x] Plein écran (bouton et touche F) – validé par l'animateur sur son poste
- [x] Raccourcis clavier (I bascule désormais : afficher / masquer tous les indices) : → avance sur le chemin malveillant, R revient au dernier vote (plus ← retour, F plein écran, K mots-clés, I tous les indices, M menu)
- [x] Scène fixe en 1920×1080, mise à l'échelle de la fenêtre
- [x] Lecture du fichier de configuration : variables textuelles, parcours actifs (cases à cocher), dossier images
- [x] Visuel générique si une image manque, sans qu'aucun parcours ne casse
- [x] Menu de séance projetable, sans divulgâcher la nature des parcours
- [x] Carton de conclusion : les 5 réflexes

### Configuration (`simulateur/config/collectivite.js`)
- [x] Collectivité fictive par défaut, « Commune de Saint-Exemple », avec toutes les variables du tableau de la spécification : COLLECTIVITE, COLLECTIVITE_COURT, DOMAINE_MAIL, DOMAINE_PIEGE, FORMAT_ADRESSE, OUTIL_MAIL, DGS_NOM, DGS_PRENOM, MAIRE_NOM, DSI_NOM, RESPONSABLE_INFO, PRESTATAIRE_INFO, NUMERO_SUPPORT, OUTIL_TICKET, FOURNISSEUR, SERVICE_FINANCES, SERVEUR_FICHIERS, PARKING, BANQUE_PERSO
- [x] Liste des images attendues documentée (`images/LISEZMOI.txt`) : logo-collectivite.png, photo-dgs.jpg, photo-maire.jpg, signature-mail.png, facture-fournisseur.pdf
- [x] Habillage de la messagerie selon OUTIL_MAIL (Outlook / Gmail / Zimbra) – les trois thèmes relus en capture

### Composants d'interface (six au total, réutilisés par tous les parcours)
- [x] Messagerie (liste, lecture, pièces jointes, aperçu de pièce jointe) – utilisé par le pilote
- [x] Écran d'appel (appelant, numéro, répliques) – utilisé par le pilote *(la variante « appel entrant » est codée, à éprouver sur le parcours 1)*
- [x] Chronologie de conséquences (écran moteur, hors des six composants) – utilisée par le pilote
- [x] Smartphone (SMS, WhatsApp, application) – parcours 3, 8, 9, 10, 11
- [x] Navigateur avec barre d'adresse et barre d'état au survol – parcours 5, 7, 8
- [x] Visio (image figée puis dégradée, sans trucage de visage) – parcours 4
- [x] Explorateur de fichiers (copie, terminal, curseur) – parcours 1, 6

### Parcours 2 – Le changement de RIB fournisseur (pilote)
- [x] É1 mail avec ses 5 indices : domaine, IBAN, hors Chorus Pro, urgence, téléphone
- [x] Vote 1 « on met à jour / on vérifie », puis vote 2 « quel numéro appeler ? »
- [x] É2a branche piège (complice, mot-clé COMPLICE)
- [x] É2b bonne branche (vrai fournisseur), « Bien vu », « Et si on avait continué ? »
- [x] É3 conséquence (mots-clés DOUBLE PAIEMENT, FONDS PERDUS)
- [x] Débrief : variante (boîte du fournisseur piratée), fonds vers l'étranger, réflexe

### Vérifications du pilote
- [x] `outils/verifier.js` : parcours de toutes les branches, détection d'impasse, de bouton mort, de variable non remplacée et d'indice non défini
- [x] Captures 1920×1080 de chaque écran, relues visuellement
- [~] Risques à lever dès le pilote : réalisme des fausses interfaces, contraste et taille du texte sur vidéoprojecteur *Note : premier passage fait (aucun texte d'écran sous 18 px, corps de texte à 24 px ou plus, contrastes forts) ; le réalisme et la lecture au fond de la salle restent à juger par l'animateur, sur le vrai projecteur*

### ⛔ Point d'arrêt n°1
- [x] L'animateur valide le pilote (rendu, fluidité, réalisme) – validé le 2026-11-04, avec deux retours : la touche I doit aussi masquer les indices, et la touche K ne semblait rien faire (corrigés)

## Phase 2 – Les 11 autres parcours (un fichier de données chacun, sans code spécifique)

Critères d'acceptation communs, vérifiés le 2026-11-04 par `outils/verifier.js` et la relecture des captures, à vérifier pour chacun : tous les écrans du storyboard présents · tous les indices cliquables · tous les votes et toutes les branches jouables jusqu'à l'impact · débrief et réflexe affichés · aucune variable non remplacée.

- [x] Parcours 1 – Le faux support informatique (É1 à É5, plus le mode film en 6 séquences, activé par `filmParcours1`)
- [x] Parcours 3 – La fraude au président par messagerie (WhatsApp, rebond « Maître Lebon »)
- [x] Parcours 4 – La visio truquée (invitation, mosaïque, révélation « IMITATION PAR IA »)
- [x] Parcours 5 – Le faux partage de document (mail, fausse page, code de double authentification, rebond)
- [x] Parcours 6 – La clé USB du parking
- [x] Parcours 7 – Le mail de maintenance de la DSI (légitime)
- [x] Parcours 8 – Le remboursement d'impôts, puis le faux conseiller (2 votes)
- [x] Parcours 9 – Le colis, l'amende et le QR code (3 variantes, un vote chacune)
- [x] Parcours 10 – « Bonjour maman »
- [x] Parcours 11 – Le message de l'Assurance Maladie (légitime)
- [x] Parcours 12 – L'avis d'impôt disponible (légitime, écran comparatif avec le parcours 8)
- [x] Ordres de passage suggérés (court, standard, complet) sélectionnables depuis le menu ; « Parcours suivant » suit l'ordre choisi *(ordre « complet » proposé, à valider : voir SUIVI)*
- [x] Style plus ludique pour l'écran de conséquence (cartes de bande dessinée animées), le débrief (score en étoiles, votes, cartes illustrées, médaille du réflexe) et les réflexes de conclusion (cartes à collectionner, tampon final)

### Phase 2 bis – Panneau « Coulisses » (demande de l'animateur, 2026-11-04)
- [x] Onglet discret à droite et touche C : panneau dépliable, qui reste ouvert d'un écran à l'autre
- [x] Trois onglets : « Cet écran » (ce qui se passe), « Le scénario » (cible, durée, source), « Le mode opératoire »
- [x] Commentaires rédigés pour les 12 parcours : scénario et mode opératoire de chaque parcours, plus un commentaire par écran d'interface et par vote (contrôlé par le vérificateur)
- [x] Parcours 5 : explication du vol du code de double authentification (fausse page servant de relais en temps réel, cookie de session)

## Phase 3 – Film du parcours 1 (chantier parallèle)

- [-] *(Facultatif, reporté par l'animateur : « on verra après »)* Réalisation avec Lemo-Opuscar, style Living Screencast, muet, mots-clés, 6 séquences à arrêt automatique. *Note : chantier séparé, à mener sur le poste de l'animateur, hors de ce dépôt pour l'instant.*
- [ ] Variables COLLECTIVITE, PRESTATAIRE_INFO, SERVEUR_FICHIERS, OUTIL_MAIL et NUMERO_SUPPORT lues depuis la configuration
- [~] Export en 6 fichiers courts, appelés par le parcours 1 du simulateur *Note : côté simulateur, c'est prêt (`videos/parcours1-seqN.mp4`, option `filmParcours1`, description affichée si une séquence manque) ; les fichiers restent à produire*
- [x] Carton final fixe pendant le débrief (bloc « À retenir » du débrief du parcours 1)
- [ ] (Optionnel) courte séquence animée pour le parcours 4, sans vrai trucage de visage

## Phase 4 – Vérifications avant livraison

- [x] Captures automatiques de chaque écran des 12 parcours en 1920×1080, relues visuellement (premier passage ; à refaire après chaque modification d'écran)
- [x] Script qui parcourt les 12 parcours, toutes branches comprises, sans impasse, bouton mort ni variable non remplacée (94 écrans, 97 chemins, mode film compris, touches I et K)
- [x] Relecture par un agent séparé, avec un regard d'animateur : lisibilité au fond de la salle, rythme, cohérence des indices – 22 remarques le 2026-11-04 : 19 appliquées, 1 déjà corrigée, 1 sans objet (domaine des impôts), 1 écartée par l'animateur (numéros fictifs) ; détail dans HISTORIQUE.md
- [ ] ⛔ Point d'arrêt n°2 : répétition à blanc des 12 parcours sur le vidéoprojecteur réel, chronomètre en main

## Hors développement – à faire par l'animateur

- [-] Vérifier que les numéros fictifs ne sont attribués à personne *(l'animateur choisit de les laisser tels quels)*
- [x] Sourcer avant diffusion, sources intégrées aux textes et à l'onglet « Le scénario » :
  - Arup (P4) : 15 virements, environ 200 M HK$ (≈ 25 M US$), confirmé par Arup en mai 2024 – CNN 16/05/2024, South China Morning Post
  - Clés USB (P6) : Tischer et al., IEEE S&P 2016, 297 clés, fichiers ouverts sur 135 (45 %) – le texte disait « environ la moitié », corrigé
  - ANTAI (P9) : « l'ANTAI n'envoie jamais de SMS » (antai.gouv.fr ; Cybermalveillance.gouv.fr)
  - Faux support (P1) : Microsoft Threat Intelligence, mai 2024 (abus de l'Assistance rapide après inondation de mails)
- [ ] Recueillir auprès de la collectivité : outil de messagerie, format des adresses, prestataire informatique et support, procédure réelle de changement de RIB, accord du DGS pour sa photo
