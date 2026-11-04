# Parcours phishing – sensibilisation agents de collectivité

Nov 4, 2026 · @Jerome

## Mode d'emploi

12 parcours (7 pro, 5 perso, dont 3 légitimes) joués dans un simulateur HTML hors ligne, projeté en plein écran et piloté par l'animateur. Chaque parcours dure 2 à 4 minutes ; on en choisit 5 à 8 selon le temps disponible.

**Déroulé type d'un parcours**

1. **Accroche** : le message arrive (mail, SMS, WhatsApp, appel) dans une fausse interface réaliste.
2. **Chasse aux indices** : la salle pointe ce qui l'interpelle ; l'animateur clique sur l'élément, qui s'entoure en rouge (suspect) ou en vert (rassurant) avec une étiquette courte.
3. **Vote à main levée** : « on clique / on répond / on supprime ? » ; l'animateur saisit le résultat, affiché à l'écran.
4. **Conséquence jouée** : quel que soit le vote, le parcours se joue jusqu'au bout (faux site, saisie, appel de rebond, impact). Si la salle a bien répondu, un écran « Bien vu » s'affiche, puis un bouton « Et si on avait continué ? » déroule la suite malveillante complète.
5. **Débrief** : indices manqués, ce que l'attaquant fait ensuite, impact sur le SI ou sur la victime, le bon réflexe en une phrase.

**Règle d'or : on va toujours au bout.** Le simulateur ne bloque jamais un parcours sur une bonne réponse. Chaque point de vote propose deux sorties : le chemin choisi par la salle et « Voir la suite quand même ». L'animateur peut ainsi dire « Bon réflexe, et voici ce qui se serait passé si on avait cliqué », jusqu'à l'impact final. Pour les parcours légitimes (7, 11, 12), le bouton montre à l'inverse ce que l'agent aurait perdu en supprimant le message. Raccourcis clavier : flèche droite pour avancer sur le chemin malveillant, R pour revenir au dernier vote.

**Légende utilisée dans les storyboards**

| Repère | Sens |
| --- | --- |
| É1, É2… | Écran du simulateur, dans l'ordre |
| 🔴 Indice | Élément suspect à faire trouver (étiquette affichée au clic) |
| 🟢 Indice | Élément rassurant (parcours légitimes) |
| ❓ Vote | Point de décision soumis à la salle |
| {{VARIABLE}} | Valeur remplacée par la configuration de la collectivité |
| Mot-clé | Texte affiché en surimpression, sans voix : l'animateur commente |

**Règles de réalisme** : aucune vraie marque d'attaquant ni vrai domaine malveillant ; les domaines piégés sont inventés et le simulateur fonctionne sans connexion. Les parcours s'appuient sur des modes opératoires publiés (DGFiP, Cybermalveillance.gouv.fr, cas médiatisés).

## Personnalisation par collectivité

Toute la personnalisation passe par un seul fichier de configuration et un dossier d'images : on change les valeurs, et les 12 parcours se mettent à jour sans toucher au code. Compter 15 à 30 minutes par collectivité, collecte des informations comprise.

**Variables textuelles**

| Variable | Exemple | Utilisée dans |
| --- | --- | --- |
| {{COLLECTIVITE}} | Commune de Saint-Exemple | Tous |
| {{COLLECTIVITE\_COURT}} | Saint-Exemple | Objets de mails, SMS |
| {{DOMAINE\_MAIL}} | saint-exemple.re | 1, 2, 3, 5, 7 |
| {{DOMAINE\_PIEGE}} | saint-exemple-re.com | 2, 5 |
| {{FORMAT\_ADRESSE}} | prenom.nom | 1, 3, 5, 7 |
| {{OUTIL\_MAIL}} | Outlook / Gmail / Zimbra | Habillage de la messagerie |
| {{DGS\_NOM}} / {{DGS\_PRENOM}} | Marie Payet | 3, 4 |
| {{MAIRE\_NOM}} | Jean Hoarau | 4 |
| {{DSI\_NOM}} | Service informatique / DSI | 1, 7 |
| {{RESPONSABLE\_INFO}} | Paul Grondin | 1, 7 |
| {{PRESTATAIRE\_INFO}} | InfoRéunion Services | 1 |
| {{NUMERO\_SUPPORT}} | 0262 00 00 00 (poste 1234) | 1, 7 |
| {{OUTIL\_TICKET}} | GLPI | 7 |
| {{FOURNISSEUR}} | Transports Lagon Bleu | 2 |
| {{SERVICE\_FINANCES}} | Direction des finances | 2, 3 |
| {{SERVEUR\_FICHIERS}} | \\\\SRV-FICHIERS\\Commun | 1 (film) |
| {{PARKING}} | Parking de l'Hôtel de ville | 6 |
| {{BANQUE\_PERSO}} | Banque fictive « Crédit de l'Île » | 8 |

**Images à fournir (dossier images/)**

| Fichier | Contenu | Utilisé dans |
| --- | --- | --- |
| logo-collectivite.png | Logo officiel, fond transparent | Signatures, intranet, mail DSI |
| photo-dgs.jpg | Photo du DGS (avec son accord) | Avatar WhatsApp / Teams, parcours 3 et 4 |
| photo-maire.jpg | Photo publique du maire | Visio truquée, parcours 4 |
| signature-mail.png | Signature mail type de la collectivité | Mails internes 1, 3, 7 |
| facture-fournisseur.pdf | Modèle de facture du fournisseur fictif | Parcours 2 |

Si une image manque, le simulateur affiche un visuel générique : aucun parcours ne casse.

**Ce qui coûte à modifier**

| Modification | Effort | Comment |
| --- | --- | --- |
| Noms, domaines, numéros, logos, photos | Faible (minutes) | Édition du fichier de config |
| Ajouter ou retirer un parcours de la séance | Faible | Case à cocher dans la config |
| Adapter un usage local (ex. pas de Chorus Pro, validation RIB en interne) | Moyen (une heure) | Réécriture d'un écran et du débrief |
| Nouveau parcours complet | Moyen à élevé | Storyboard + écrans |
| Vidéo personnalisée | Faible si variables prévues | Re-rendu automatique, sans réécriture |

La vidéo est conçue pour lire les mêmes variables (nom de la collectivité, du prestataire, du serveur de fichiers) : on relance le rendu, sans refaire le film.

**À recueillir auprès de la collectivité avant la séance** : outil de messagerie, format des adresses, nom du prestataire informatique et du support, procédure réelle de changement de RIB, accord du DGS pour l'usage de sa photo.

## Parcours professionnels (1 à 7)

### 1. Le faux support informatique — malveillant

Cible : tout agent. Mode opératoire documenté (inondation de spams puis faux appel du support, prise en main via un outil d'assistance à distance). Durée : 4 min, ou 3 min avec le film (voir plus bas).

1. **É1 — Boîte mail inondée** : 200 mails de newsletters en 10 minutes dans {{OUTIL\_MAIL}}. Mot-clé : « DIVERSION ».
2. **É2 — Appel entrant** : écran de téléphone « {{PRESTATAIRE\_INFO}} – Support ». L'animateur joue l'attaquant : « On a détecté une attaque sur votre poste, c'est pour ça que vous recevez tous ces mails. »
   - 🔴 Appel entrant non sollicité, alors qu'aucun ticket n'a été ouvert
   - 🔴 Urgence et peur (« votre poste contamine le réseau »)
   - 🔴 Le problème annoncé est celui que l'attaquant a lui-même provoqué
3. **É3 — Demande d'installation** : « Ouvrez l'Assistance rapide et donnez-moi le code à 6 chiffres. »
   - 🔴 Le vrai support ne demande jamais un code de prise en main sur un appel entrant
   - 🔴 Refus de passer par {{OUTIL\_TICKET}} (« pas le temps, c'est critique »)
4. **❓ Vote** : on donne le code / on raccroche et on rappelle {{NUMERO\_SUPPORT}}.
5. **É4 — Conséquence** : le curseur bouge seul, ouvre {{SERVEUR\_FICHIERS}}, copie les dossiers RH et état civil, puis installe un programme. Mots-clés : « PRISE DE CONTRÔLE », « EXFILTRATION », « RANÇONGICIEL ».
6. **É5 — Écran de rançon** sur tous les postes le lendemain matin.

**Débrief** : en quelques minutes, l'attaquant obtient l'accès au réseau, vole des données personnelles d'usagers puis chiffre les serveurs ; les services (état civil, paie, urbanisme) peuvent s'arrêter plusieurs semaines. **Réflexe** : raccrocher, rappeler le support sur le numéro connu {{NUMERO\_SUPPORT}}, ne jamais installer ni ouvrir un outil de prise en main à la demande d'un appelant.

### 2. Le changement de RIB fournisseur — malveillant

Cible : finances, commande publique, secrétariat. Mode opératoire n°1 signalé par la DGFiP auprès des collectivités. Durée : 4 min.

1. **É1 — Mail** de « {{FOURNISSEUR}} » : « Suite à un changement d'établissement bancaire, merci de mettre à jour nos coordonnées. La facture n° 2026-118 reste en attente, merci de procéder rapidement. » Pièces jointes : nouveau RIB, facture.
   - 🔴 Domaine proche mais différent de celui du dossier fournisseur ({{DOMAINE\_PIEGE}})
   - 🔴 IBAN dans une néobanque ou une banque étrangère
   - 🔴 Facture et RIB transmis par mail, hors Chorus Pro
   - 🔴 Urgence sur une facture réelle (l'attaquant connaît le marché)
   - 🔴 Numéro de téléphone du mail différent de celui du dossier
2. **❓ Vote** : on met à jour / on vérifie. Si « on vérifie » : quel numéro appeler ?
3. **É2a — Branche piège** : on appelle le numéro du mail ; un complice confirme poliment. Mot-clé : « COMPLICE ».
4. **É2b — Bonne branche** : on appelle le numéro du dossier fournisseur ; le vrai fournisseur n'a jamais changé de banque.
5. **É3 — Conséquence (si mise à jour)** : le virement part ; 30 jours plus tard, le vrai fournisseur relance son impayé. Mots-clés : « DOUBLE PAIEMENT », « FONDS PERDUS ».

**Débrief** : variante plus difficile, le mail vient de la vraie boîte du fournisseur, piratée : seul le contre-appel la déjoue. Les sommes partent souvent vers l'étranger en quelques heures. **Réflexe** : contre-appel sur des coordonnées déjà connues, factures uniquement via Chorus Pro, alerte immédiate du comptable public et dépôt de plainte.

### 3. La fraude au président par messagerie — malveillant

Cible : assistants de direction, finances, RH. Escroquerie la plus répandue dans les administrations territoriales selon La Banque Postale. Durée : 3 min.

1. **É1 — WhatsApp** d'un numéro inconnu avec {{photo-dgs.jpg}} : « Bonjour, tu es disponible ? Je suis en réunion à la préfecture, je ne peux pas parler. J'ai besoin d'un service discret. »
   - 🔴 Nouveau numéro, photo récupérée sur le site de la collectivité
   - 🔴 Ton inhabituel (tutoiement, formules vagues)
   - 🔴 Impossible d'appeler (« en réunion »)
2. **É2 — La demande** : régler en urgence un acompte à un cabinet pour une « opération confidentielle », ou acheter des cartes cadeaux « pour les agents méritants ».
   - 🔴 Secret demandé, contournement du circuit de la dépense
   - 🔴 Flatterie (« je compte sur toi, tu es la seule personne de confiance »)
3. **❓ Vote** : on s'exécute / on rappelle {{DGS\_PRENOM}} {{DGS\_NOM}} sur son numéro habituel.
4. **É3 — Rebond** : appel d'un faux « Maître Lebon, avocat » qui met la pression. Mot-clé : « PRESSION ».

**Débrief** : l'escroc s'appuie sur l'organigramme et l'agenda publics de la collectivité. **Réflexe** : rappeler la personne sur son numéro connu, aucune dérogation au circuit de validation, même pour un élu ou le DGS.

### 4. La visio truquée — malveillant

Cible : direction, finances. Base réelle : en 2024 à Hong Kong, un employé du groupe Arup a viré environ 25 millions de dollars après une visio où le directeur financier et des collègues étaient des imitations générées par IA (chiffre approximatif, à sourcer avant diffusion). Durée : 3 min, avec une courte séquence animée.

1. **É1 — Invitation** : « Réunion confidentielle – acquisition foncière » envoyée au nom de {{MAIRE\_NOM}}.
   - 🔴 Invitation depuis une adresse extérieure à {{DOMAINE\_MAIL}}
2. **É2 — La visio** : mosaïque avec {{photo-maire.jpg}}, {{photo-dgs.jpg}} et deux « conseillers ». Le maire parle peu ; la demande arrive dans la conversation écrite.
   - 🔴 Image légèrement figée, lèvres décalées, « problème de réseau » invoqué
   - 🔴 Personne ne répond à une question imprévue
   - 🔴 Montant important, urgence, confidentialité
3. **❓ Vote** : on lance le virement / on pose une question de contrôle et on rappelle.
4. **É3 — Révélation** : les visages se dégradent ; mot-clé : « IMITATION PAR IA ».

**Débrief** : quelques minutes de vidéo publique (conseil municipal en ligne) suffisent pour imiter un visage et une voix. **Réflexe** : rappeler par un autre canal, double validation pour tout virement inhabituel, mot de passe convenu en interne pour les demandes sensibles.

### 5. Le faux partage de document — malveillant

Cible : tout agent. Hameçonnage d'identifiants Microsoft 365 avec contournement de la double authentification. Durée : 3 min.

1. **É1 — Mail** : « {{DGS\_PRENOM}} {{DGS\_NOM}} vous a partagé Deliberation\_budget\_2027.pdf ».
   - 🔴 Au survol, le lien pointe vers un domaine sans rapport avec Microsoft ni {{DOMAINE\_MAIL}}
   - 🔴 Document « urgent à consulter avant 17 h »
2. **É2 — Page de connexion** très réaliste, adresse du type login-microsoftonline.docs-securise.app.
   - 🔴 Adresse de la page dans la barre du navigateur
   - 🔴 On redemande le mot de passe alors qu'on est déjà connecté
3. **❓ Vote** : on se connecte / on ferme et on ouvre OneDrive directement.
4. **É3 — Code de double authentification** saisi sur la fausse page : l'attaquant le rejoue en direct. Mot-clé : « SESSION VOLÉE ».
5. **É4 — Conséquence** : règle de transfert créée en silence, puis le même faux partage part à tous les contacts depuis le vrai compte de l'agent. Mots-clés : « REBOND », « VOTRE NOM ».

**Débrief** : la double authentification ne protège pas si on saisit le code sur une fausse page. **Réflexe** : ouvrir les documents depuis l'application ou l'intranet, jamais via le lien d'un mail inattendu ; en cas de doute, signaler à {{DSI\_NOM}}.

### 6. La clé USB du parking — malveillant

Cible : tout agent. Durée : 2 min.

1. **É1 — Photo** : clé USB étiquetée « Primes 2026 – CONFIDENTIEL RH » trouvée sur le {{PARKING}}.
   - 🔴 Étiquette qui pique la curiosité
   - 🔴 Objet trouvé dans un lieu de passage des agents
2. **❓ Vote** : on la branche pour retrouver son propriétaire / on la remet au service informatique.
3. **É2 — Conséquence** : le fichier Primes\_2026.xlsx est un programme ; ou bien la clé se fait passer pour un clavier et tape des commandes en trois secondes. Mots-clés : « CLAVIER FANTÔME », « PORTE OUVERTE ».

**Débrief** : une étude universitaire américaine (2016) a montré qu'environ la moitié des clés abandonnées étaient branchées par ceux qui les trouvaient (chiffre approximatif, à sourcer). **Réflexe** : ne jamais brancher un support inconnu, le remettre à {{DSI\_NOM}}.

### 7. Le mail de maintenance de la DSI — légitime

Cible : tout agent. Objectif : montrer qu'un bon réflexe n'est pas de tout supprimer. Durée : 2 min.

1. **É1 — Mail** de {{RESPONSABLE\_INFO}} (adresse {{FORMAT\_ADRESSE}}@{{DOMAINE\_MAIL}}) : « Coupure de la messagerie samedi de 8 h à 12 h pour maintenance. Aucune action n'est requise de votre part. Nous ne vous demanderons jamais votre mot de passe. Détails sur l'intranet, référence {{OUTIL\_TICKET}} n° 4521. »
   - 🟢 Adresse interne exacte, signature officielle avec {{logo-collectivite.png}}
   - 🟢 Aucune action demandée, aucun lien de connexion
   - 🟢 Information vérifiable sur l'intranet et au {{NUMERO\_SUPPORT}}
   - 🟢 Annonce faite à l'avance, sans urgence
2. **❓ Vote** : on supprime / on signale / on garde.
3. **É2 — Bonne réponse** : on garde, rien à faire.

**Débrief** : un message légitime informe ; un message malveillant fait agir vite. **Réflexe** : en cas de doute, vérifier par un autre canal plutôt que supprimer par réflexe.

## Parcours personnels (8 à 12)

### 8. Le remboursement d'impôts, puis le faux conseiller — malveillant

Cible : tout agent, vie perso. Chaîne complète : hameçonnage puis appel de rebond. Durée : 4 min.

1. **É1 — SMS** : « DGFiP : un remboursement de 312,40 € est en attente. Confirmez vos informations avant 48 h : \[lien\] ».
   - 🔴 Montant précis et urgence
   - 🔴 Lien raccourci, expéditeur au format numéro mobile
2. **É2 — Faux site** reprenant l'habillage des impôts, adresse du type impots-gouv-remboursement.fr. Formulaire : identité, puis carte bancaire « pour recevoir le remboursement ».
   - 🔴 Adresse du site, qui n'est pas impots.gouv.fr
   - 🔴 Un remboursement ne demande jamais de carte bancaire : il part sur le RIB déjà connu des impôts
3. **❓ Vote** : on remplit / on ferme et on va dans son espace sur impots.gouv.fr.
4. **É3 — 10 minutes plus tard, appel** : l'écran affiche le vrai numéro de {{BANQUE\_PERSO}}. « Service fraude : une opération de 1 450 € est en cours. Pour l'annuler, validez-la dans votre application. »
   - 🔴 Le numéro affiché ne prouve rien : il peut être usurpé
   - 🔴 Une banque ne demande jamais de valider une opération pour l'annuler
5. **❓ Vote** : on valide / on raccroche et on rappelle le numéro au dos de sa carte.
6. **É4 — Conséquence** : trois paiements validés par la victime elle-même. Mots-clés : « VALIDÉ PAR VOUS », « REMBOURSEMENT REFUSÉ ? ».

**Débrief** : le site sert à récolter les données, l'appel sert à faire valider les paiements ; quand la victime a validé, la banque peut contester le remboursement. **Réflexe** : passer soi-même par impots.gouv.fr ; raccrocher et rappeler sa banque sur le numéro connu.

### 9. Le colis, l'amende et le QR code — malveillant

Cible : tout agent. Trois variantes courtes à enchaîner. Durée : 3 min.

1. **É1 — SMS colis** : « Votre colis n'a pas pu être livré. Frais de réexpédition : 1,99 € ».
   - 🔴 Aucun colis attendu, petit montant pour baisser la garde
2. **É2 — SMS amende** : « Avis de contravention impayé, majoration sous 48 h ».
   - 🔴 Pression de la majoration ; l'ANTAI rappelle qu'elle ne réclame pas de paiement par SMS (à vérifier sur antai.gouv.fr avant diffusion)
3. **É3 — Photo d'horodateur** avec un QR code autocollant collé par-dessus l'officiel.
   - 🔴 Autocollant superposé, bords visibles
   - 🔴 Le site ouvert n'est pas celui de l'application de stationnement de {{COLLECTIVITE\_COURT}}
4. **❓ Vote** sur chaque variante : on paie / on ne paie pas.
5. **É4 — Conséquence** : 1,99 € payés, puis des centaines d'euros débités les jours suivants. Mot-clé : « CARTE COPIÉE ».

**Débrief** : le petit montant n'est qu'un prétexte pour obtenir la carte. **Réflexe** : passer par l'application ou le site officiel tapé soi-même ; signaler le SMS au 33700.

### 10. « Bonjour maman » — malveillant

Cible : tout agent parent. Durée : 2 min.

1. **É1 — WhatsApp** d'un numéro inconnu : « Coucou maman, j'ai cassé mon téléphone, c'est mon nouveau numéro, enregistre-le ».
   - 🔴 Pas de prénom, nouveau numéro
2. **É2 — La demande** : « J'ai une facture urgente, mon appli bancaire ne marche pas sur ce téléphone, tu peux faire un virement de 980 € ? Je te rembourse demain. »
   - 🔴 Refus d'un appel vocal (« micro cassé »)
   - 🔴 Urgence, RIB au nom d'un tiers
3. **❓ Vote** : on paie / on appelle l'enfant sur son ancien numéro ou on pose une question personnelle.
4. **É3 — Révélation** : l'enfant répond sur son ancien numéro, il n'a rien cassé. Mot-clé : « USURPATION ».

**Débrief** : l'escroc mise sur l'émotion et l'urgence ; il envoie le même message à des milliers de numéros. **Réflexe** : appeler la personne par un canal connu avant tout paiement.

### 11. Le message de l'Assurance Maladie — légitime

Cible : tout agent. Objectif : apprendre à vérifier sans paniquer. Durée : 2 min.

1. **É1 — Message** : « Un nouveau document est disponible dans votre compte. Consultez-le depuis l'application ou ameli.fr. » Aucun lien de connexion, aucune demande de données.
   - 🟢 Pas de lien cliquable vers une page de saisie
   - 🟢 Aucune urgence, aucun montant, aucune donnée bancaire demandée
   - 🟢 Invitation à passer soi-même par l'application officielle
2. **❓ Vote** : on supprime / on ouvre l'application soi-même.
3. **É2 — Bonne réponse** : on ouvre l'application officielle, le document y est bien.

**Débrief** : ce sont précisément les organismes les plus imités ; la bonne pratique reste la même, légitime ou non : passer par l'application ou le site tapé soi-même.

### 12. L'avis d'impôt disponible — légitime

Cible : tout agent. À jouer juste après le parcours 8, en comparaison côte à côte. Durée : 2 min.

1. **É1 — Mail** : « Votre avis d'impôt est disponible dans votre espace particulier ».
   - 🟢 Expéditeur et lien sur impots.gouv.fr (vérifiés au survol)
   - 🟢 Aucune carte bancaire, aucun formulaire, aucune urgence
   - 🟢 Cohérent avec le calendrier fiscal
2. **❓ Vote** : légitime ou malveillant ?
3. **É2 — Écran comparatif** : le faux SMS du parcours 8 à gauche, le vrai mail à droite, les différences surlignées.

**Débrief** : même un mail légitime se consulte au mieux en tapant soi-même impots.gouv.fr ; c'est le geste qui protège dans tous les cas.

## Film : « Le support qui n'en était pas un »

Film muet de 2 min 30 environ, en 6 séquences qui s'arrêtent seules pour laisser l'animateur commenter et interroger la salle. Style Living Screencast (plan-séquence dans l'écran d'un agent), mots-clés en surimpression, effets sonores ponctuels sans voix. Il remplace les écrans É2 à É5 du parcours 1.

Personnage : « Nadia », agente au service urbanisme de {{COLLECTIVITE}}, devant son poste un mardi à 9 h 40.

| Séq. | Durée | Ce qu'on voit | Mots-clés à l'écran | Son | Pause : question à la salle |
| --- | --- | --- | --- | --- | --- |
| 1 | 20 s | La boîte {{OUTIL\_MAIL}} de Nadia se remplit : 200 newsletters en accéléré, compteur qui s'emballe | DIVERSION | Notifications en rafale | « À votre avis, c'est quoi ? » |
| 2 | 25 s | Appel entrant « {{PRESTATAIRE\_INFO}} – Support ». Chrono de l'appel qui défile, Nadia décroche | APPEL NON SOLLICITÉ · URGENCE · PEUR | Sonnerie | « Qu'est-ce qu'il lui dit, d'après vous ? » (l'animateur joue l'attaquant) |
| 3 | 25 s | Nadia ouvre l'outil d'assistance à distance et lit un code à 6 chiffres à voix haute | CODE DONNÉ · PORTE OUVERTE | Clic, silence | « Que fallait-il faire à ce moment ? » |
| 4 | 35 s | Le curseur bouge seul. Ouverture de {{SERVEUR\_FICHIERS}} : dossiers RH, État civil, Marchés. Barre de copie qui progresse | PRISE DE CONTRÔLE · EXFILTRATION | Bruits de clics rapides | « Quelles données sont parties ? » |
| 5 | 20 s | Fin d'appel : « C'est réglé, bonne journée. » Nadia sourit, reprend son travail. Un petit programme reste en arrière-plan | TOUT SEMBLE NORMAL | Raccrocher | « Combien de temps avant qu'on s'en rende compte ? » |
| 6 | 25 s | Le lendemain 8 h : écran de rançon sur tous les postes du service, puis plan large de la mairie aux fenêtres éteintes | RANÇONGICIEL · SERVICES À L'ARRÊT | Bourdonnement grave, puis silence | Débrief et réflexe |

**Carton final** (fixe, à laisser à l'écran pendant le débrief) : « Le support ne vous appelle jamais pour prendre la main. Raccrochez, rappelez le {{NUMERO\_SUPPORT}}. »

**Notes de production**

- Réalisation avec Lemo-Opuscar, style Living Screencast, sans narration ; préciser au lancement : pas de voix, mots-clés seulement, arrêt automatique à la fin de chaque séquence.
- Les variables {{COLLECTIVITE}}, {{PRESTATAIRE\_INFO}}, {{SERVEUR\_FICHIERS}}, {{OUTIL\_MAIL}} et {{NUMERO\_SUPPORT}} sont lues depuis la configuration : un nouveau rendu suffit pour une autre collectivité.
- Le film est exporté en 6 fichiers courts plutôt qu'un seul, appelés par le parcours 1 du simulateur.
- Une séquence animée courte du même type peut illustrer le parcours 4 (visio truquée), sans vrai trucage de visage.

## Réflexes et ordre de passage

Cinq réflexes couvrent les 12 parcours ; ils servent de carton de conclusion.

1. **Urgence, secret, peur = stop.** Plus on vous presse, plus il faut ralentir.
2. **Vérifier par un autre canal**, sur des coordonnées déjà connues (contre-appel, ancien numéro, numéro au dos de la carte).
3. **Aller soi-même sur le site ou l'application officiels**, jamais via le lien reçu.
4. **Ne jamais donner un code, un mot de passe ou la main sur son poste** à quelqu'un qui vous contacte.
5. **Signaler sans honte** au {{DSI\_NOM}} ({{NUMERO\_SUPPORT}}) : un signalement rapide limite les dégâts.

**Ordres de passage suggérés**

| Format | Parcours, dans l'ordre | Durée indicative |
| --- | --- | --- |
| Court (20 min) | 9 · 5 · 2 · 1 (film) · 7 | 15 min + 5 min de réflexes |
| Standard (35 min) | 9 · 10 · 5 · 2 · 3 · 1 (film) · 7 · 8 + 12 | 30 min + 5 min de réflexes |
| Complet (50 min) | Les 12, en alternant perso et pro, un légitime tous les 3 ou 4 parcours | 45 min + 5 min de réflexes |

Commencer par un parcours perso (9 ou 10) met la salle en confiance ; finir par le film et un parcours légitime laisse le message « vigilant, pas paranoïaque ».

**Points à sourcer avant diffusion** : le montant et la date du cas Arup (parcours 4), l'étude sur les clés USB (parcours 6), la consigne ANTAI sur les SMS (parcours 9).

**Sources**

- [Collectivités locales – Lutte contre les tentatives d'escroquerie (FOVI)](https://www.collectivites-locales.gouv.fr/index.php/gerer-les-finances-publiques-locales/lutte-contre-les-tentatives-descroquerie)
- [Dépliant DGFiP – Se prémunir contre les FOVI](https://www.collectivites-locales.gouv.fr/files/finances-locales/doc/4_FOVI%20web.pdf)
- [La Banque Postale – Collectivités : se protéger des tentatives de fraude](https://www.labanquepostale.fr/collectivites/actualite/2025/tentatives-fraude.html)
- [Lemo-Opuscar (GitHub)](https://github.com/lemomo-ai/lemo-opuscar)

## Plan de réalisation (consignes pour la session de développement)

Le contenu de ce document est validé : il sert de spécification figée, rien n'est inventé en cours de route. Le développement se fait dans Claude Code, en local, sur le poste de l'animateur.

**Ordre de travail**

1. **Moteur + parcours pilote** : construire une seule fois le moteur (navigation, indices cliquables, votes, bouton « Et si on avait continué ? », plein écran, raccourcis clavier, lecture du fichier de configuration), et l'éprouver sur le parcours 2 (RIB fournisseur), le plus riche en embranchements.
2. **Point d'arrêt n°1** : l'animateur valide le pilote (rendu, fluidité, réalisme) avant la suite.
3. **Les 11 autres parcours** : chaque parcours est un fichier de données (écrans, indices, votes, branches) joué par le même moteur ; aucun code spécifique par parcours.
4. **Vidéo du parcours 1** : chantier séparé avec Lemo-Opuscar (style Living Screencast, muet, mots-clés, 6 séquences à arrêt automatique), mené en parallèle.
5. **Point d'arrêt n°2** : répétition à blanc des 12 parcours sur le vidéoprojecteur réel, chronomètre en main.

**Architecture**

- Simulateur 100 % hors ligne : un dossier ouvert dans le navigateur, sans serveur ni connexion.
- Un fichier de configuration par collectivité (variables de la section Personnalisation) et un dossier images/ ; collectivité fictive par défaut : « Commune de Saint-Exemple ».
- Six composants d'interface réutilisés par tous les parcours : messagerie, smartphone (SMS et WhatsApp), écran d'appel, navigateur avec barre d'adresse, visio, explorateur de fichiers.
- Règle d'or appliquée par le moteur : aucun parcours ne se bloque sur une bonne réponse ; « Voir la suite quand même » est disponible à chaque vote.
- Réalisme : habillage évocateur des organismes imités (couleurs, mise en page, ton) sans reproduire leurs logos ni leurs pages à l'identique ; les champs de saisie ne transmettent rien. Le logo et les photos de la collectivité cliente sont utilisés avec son accord.

**Pilotage**

- CLAUDE.md + triptyque SUIVI / BACKLOG / HISTORIQUE : chaque tâche est cochée au fil de l'eau, pour reprendre sans perte.
- Une tâche par parcours, avec ses critères d'acceptation : tous les écrans du storyboard présents, tous les indices cliquables, tous les votes et branches jouables jusqu'à l'impact, débrief et réflexe affichés.

**Vérifications avant livraison**

- Capture automatique de chaque écran en 1920×1080, relue visuellement (pas seulement le code).
- Script qui parcourt les 12 parcours, toutes branches comprises (y compris « voir la suite »), et signale impasse, bouton mort ou variable non remplacée.
- Relecture par un agent séparé, avec un regard d'animateur : lisibilité au fond de la salle, rythme, cohérence des indices.
- Risques à lever dès le pilote : réalisme des fausses interfaces, contraste et taille du texte sur vidéoprojecteur.
