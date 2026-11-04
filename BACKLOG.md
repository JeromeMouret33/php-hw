# BACKLOG

Liste exhaustive des tâches, tirée de `docs/specification.md`. On ne coche une case qu'après vérification.
Légende : `[x]` fait et vérifié · `[ ]` à faire · `[~]` commencé, voir la note · `[-]` reporté ou hors périmètre, voir la note.

## Phase 0 – Cadre

- [x] Spécification copiée dans `docs/specification.md`
- [x] `CLAUDE.md` et le triptyque SUIVI / BACKLOG / HISTORIQUE mis en place

## Phase 1 – Moteur et parcours pilote (parcours 2)

### Moteur (`simulateur/js/moteur.js`)
- [x] Navigation entre écrans, historique, retour arrière
- [x] Indices cliquables : entourés en rouge (suspect) ou en vert (rassurant), avec une étiquette courte, placée de façon à ne pas recouvrir les autres indices *(le vert n'est pas encore éprouvé : aucun parcours légitime pour l'instant)*
- [x] Votes : saisie du résultat par l'animateur (compteurs + et −, pourcentages), affichage à l'écran, choix de la branche, rappel du choix dans le bandeau
- [x] « Voir la suite quand même » disponible à chaque vote (règle d'or, contrôlée par le vérificateur)
- [x] Écran « Bien vu » puis bouton « Et si on avait continué ? » vers la suite malveillante complète
- [~] Variante légitime : le bouton montre ce que l'agent aurait perdu en supprimant le message (libellé paramétrable, `libelleSuite`) *Note : prévue dans le moteur, à éprouver sur les parcours 7, 11 et 12*
- [x] Mots-clés en surimpression, sans voix (apparition en tampon, K pour masquer)
- [x] Débrief : indices trouvés et manqués, ce que fait l'attaquant ensuite, impact, réflexe en une phrase
- [~] Plein écran (bouton et touche F) *Note : impossible à tester sans écran, à essayer sur le poste de l'animateur*
- [x] Raccourcis clavier : → avance sur le chemin malveillant, R revient au dernier vote (plus ← retour, F plein écran, K mots-clés, I tous les indices, M menu)
- [x] Scène fixe en 1920×1080, mise à l'échelle de la fenêtre
- [x] Lecture du fichier de configuration : variables textuelles, parcours actifs (cases à cocher), dossier images
- [x] Visuel générique si une image manque, sans qu'aucun parcours ne casse
- [x] Menu de séance projetable, sans divulgâcher la nature des parcours
- [x] Carton de conclusion : les 5 réflexes

### Configuration (`simulateur/config/collectivite.js`)
- [x] Collectivité fictive par défaut, « Commune de Saint-Exemple », avec toutes les variables du tableau de la spécification : COLLECTIVITE, COLLECTIVITE_COURT, DOMAINE_MAIL, DOMAINE_PIEGE, FORMAT_ADRESSE, OUTIL_MAIL, DGS_NOM, DGS_PRENOM, MAIRE_NOM, DSI_NOM, RESPONSABLE_INFO, PRESTATAIRE_INFO, NUMERO_SUPPORT, OUTIL_TICKET, FOURNISSEUR, SERVICE_FINANCES, SERVEUR_FICHIERS, PARKING, BANQUE_PERSO
- [x] Liste des images attendues documentée (`images/LISEZMOI.txt`) : logo-collectivite.png, photo-dgs.jpg, photo-maire.jpg, signature-mail.png, facture-fournisseur.pdf
- [~] Habillage de la messagerie selon OUTIL_MAIL (Outlook / Gmail / Zimbra) *Note : les trois thèmes sont codés, seul Outlook a été relu en capture*

### Composants d'interface (six au total, réutilisés par tous les parcours)
- [x] Messagerie (liste, lecture, pièces jointes, aperçu de pièce jointe) – utilisé par le pilote
- [x] Écran d'appel (appelant, numéro, répliques) – utilisé par le pilote *(la variante « appel entrant » est codée, à éprouver sur le parcours 1)*
- [x] Chronologie de conséquences (écran moteur, hors des six composants) – utilisée par le pilote
- [ ] Smartphone (SMS et WhatsApp) – parcours 3, 8, 9, 10, 11
- [ ] Navigateur avec barre d'adresse – parcours 5, 8, 9
- [ ] Visio – parcours 4
- [ ] Explorateur de fichiers – parcours 1, 6

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
- [ ] L'animateur valide le pilote (rendu, fluidité, réalisme)

## Phase 2 – Les 11 autres parcours (un fichier de données chacun, sans code spécifique)

Critères d'acceptation communs, à vérifier pour chacun : tous les écrans du storyboard présents · tous les indices cliquables · tous les votes et toutes les branches jouables jusqu'à l'impact · débrief et réflexe affichés · aucune variable non remplacée.

- [ ] Parcours 1 – Le faux support informatique (É1 à É5, avec emplacement pour le film)
- [ ] Parcours 3 – La fraude au président par messagerie (WhatsApp, rebond « Maître Lebon »)
- [ ] Parcours 4 – La visio truquée (invitation, mosaïque, révélation « IMITATION PAR IA »)
- [ ] Parcours 5 – Le faux partage de document (mail, fausse page, code de double authentification, rebond)
- [ ] Parcours 6 – La clé USB du parking
- [ ] Parcours 7 – Le mail de maintenance de la DSI (légitime)
- [ ] Parcours 8 – Le remboursement d'impôts, puis le faux conseiller (2 votes)
- [ ] Parcours 9 – Le colis, l'amende et le QR code (3 variantes, un vote chacune)
- [ ] Parcours 10 – « Bonjour maman »
- [ ] Parcours 11 – Le message de l'Assurance Maladie (légitime)
- [ ] Parcours 12 – L'avis d'impôt disponible (légitime, écran comparatif avec le parcours 8)
- [ ] Ordres de passage suggérés (court, standard, complet) sélectionnables depuis le menu

## Phase 3 – Film du parcours 1 (chantier parallèle)

- [-] Réalisation avec Lemo-Opuscar, style Living Screencast, muet, mots-clés, 6 séquences à arrêt automatique. *Note : chantier séparé, à mener sur le poste de l'animateur, hors de ce dépôt pour l'instant.*
- [ ] Variables COLLECTIVITE, PRESTATAIRE_INFO, SERVEUR_FICHIERS, OUTIL_MAIL et NUMERO_SUPPORT lues depuis la configuration
- [ ] Export en 6 fichiers courts, appelés par le parcours 1 du simulateur
- [ ] Carton final fixe pendant le débrief
- [ ] (Optionnel) courte séquence animée pour le parcours 4, sans vrai trucage de visage

## Phase 4 – Vérifications avant livraison

- [ ] Captures automatiques de chaque écran des 12 parcours en 1920×1080, relues visuellement
- [ ] Script qui parcourt les 12 parcours, toutes branches comprises, sans impasse, bouton mort ni variable non remplacée
- [ ] Relecture par un agent séparé, avec un regard d'animateur : lisibilité au fond de la salle, rythme, cohérence des indices
- [ ] ⛔ Point d'arrêt n°2 : répétition à blanc des 12 parcours sur le vidéoprojecteur réel, chronomètre en main

## Hors développement – à faire par l'animateur

- [ ] Sourcer avant diffusion : montant et date du cas Arup (parcours 4), étude sur les clés USB de 2016 (parcours 6), consigne de l'ANTAI sur les SMS (parcours 9)
- [ ] Recueillir auprès de la collectivité : outil de messagerie, format des adresses, prestataire informatique et support, procédure réelle de changement de RIB, accord du DGS pour sa photo
