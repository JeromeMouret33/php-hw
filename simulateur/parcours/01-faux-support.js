/*
 * PARCOURS 1 – Le faux support informatique (malveillant)
 * Source : docs/specification.md (version 2), « 1. Le faux support informatique » et « Film ».
 * Version « outil habituel » (2026-11-04) : les agents utilisent déjà l'outil de prise en main
 * du vrai support ({{OUTIL_PRISE_EN_MAIN}}, TeamViewer par défaut). L'escroc n'a donc rien à faire
 * installer : il se fait donner l'identifiant et le mot de passe de l'outil (vote 1), prend la main,
 * copie ce que l'agent peut ouvrir, puis demande le code reçu par SMS pour garder le compte après
 * l'appel (vote 2). Il revient quelques jours plus tard et chiffre les serveurs.
 * Habillage générique de l'outil : aucun logo ni interface de l'éditeur.
 * Détails de réalisme ajoutés : newsletters, numéro d'appel, répliques, identifiant et mot de passe
 * affichés, SMS de code, noms de dossiers, fichier de mots de passe.
 */
SIMU.enregistrerParcours({
  numero: 1,
  titre: 'Le faux support informatique',
  titreSalle: 'Une boîte mail qui s\'emballe',
  domaine: 'pro',
  nature: 'malveillant',
  cible: 'Tout agent',
  duree: '4 min (3 min avec le film)',
  source: 'Microsoft Threat Intelligence, mai 2024 : inondation de mails puis faux appel du support et prise en main à distance avec un outil légitime',
  debut: { option: 'filmParcours1', alors: 'f1', sinon: 'e1' },

  ecrans: {

    // ================================================================ Écrans fixes

    e1: {
      coulisses: 'Rien n\'est piraté ici : l\'attaquant a inscrit l\'adresse de l\'agent à des centaines de newsletters, de façon automatique. Ces mails sont « légitimes », donc beaucoup passent les filtres anti-spam. But : créer une vraie gêne, pour que l\'appel du « support » paraisse logique.',
      etape: 'É1',
      composant: 'mail',
      donnees: {
        application: 'Messagerie – {{COLLECTIVITE_COURT}}',
        utilisateur: 'Service urbanisme',
        compteur: '200 non lus',
        vide: '<div class="compteur-geant">200</div>nouveaux messages en 10 minutes…',
        liste: [
          { de: 'Bons plans Jardin', objet: 'Votre lettre d\'information', apercu: '-40 % sur toute la gamme…', heure: '09:39', nonLu: true },
          { de: 'Actu Voyages', objet: 'Bienvenue dans notre newsletter', apercu: 'Confirmez votre inscription…', heure: '09:39', nonLu: true },
          { de: 'Le Mag Déco', objet: 'Inscription confirmée', apercu: 'Merci de votre inscription…', heure: '09:38', nonLu: true },
          { de: 'Promo Auto', objet: 'Votre devis gratuit', apercu: 'Profitez de notre offre…', heure: '09:38', nonLu: true },
          { de: 'Info Recettes', objet: 'Newsletter n° 1', apercu: 'Bienvenue parmi nos abonnés…', heure: '09:38', nonLu: true },
          { de: 'Club Sport', objet: 'Activez votre compte', apercu: 'Cliquez pour confirmer…', heure: '09:37', nonLu: true },
          { de: 'Ciné Hebdo', objet: 'Les sorties de la semaine', apercu: 'Ne manquez pas…', heure: '09:37', nonLu: true }
        ]
      },
      motsCles: ['DIVERSION'],
      suivant: 'e2'
    },

    e2: {
      coulisses: 'L\'attaquant sait que la boîte déborde : il l\'a provoqué. Le nom du prestataire est souvent public (marchés attribués, signatures de mails), le numéro de l\'agent aussi (annuaire, site). Il appelle d\'un numéro quelconque et se présente : c\'est l\'histoire qui convainc. Variante fréquente : un message ou un appel <b>Teams</b> venant d\'un compte extérieur nommé « Support informatique ».',
      etape: 'É2',
      composant: 'appel',
      donnees: {
        statut: 'entrant',
        appelant: 'Numéro inconnu',
        numero: '0262 00 55 17',
        contexte: '[[non-sollicite|Appel entrant : vous n\'avez ouvert aucun ticket.]]',
        repliques: [
          { qui: 'appelant', texte: 'Bonjour, ici le support informatique de {{PRESTATAIRE_INFO}}. [[provoque|On a détecté une attaque sur votre poste, c\'est pour ça que vous recevez tous ces mails.]]' },
          { qui: 'appelant', texte: '[[peur|C\'est grave : votre poste contamine le réseau.]]' }
        ]
      },
      indices: {
        'non-sollicite': { type: 'suspect', etiquette: 'Appel entrant non sollicité, alors qu\'aucun ticket n\'a été ouvert' },
        peur:            { type: 'suspect', etiquette: 'Urgence et peur (« votre poste contamine le réseau »)' },
        provoque:        { type: 'suspect', etiquette: 'Le problème annoncé est celui que l\'attaquant a lui-même provoqué' }
      },
      suivant: 'e3'
    },

    e3: {
      coulisses: 'L\'escroc sait que la collectivité utilise <b>{{OUTIL_PRISE_EN_MAIN}}</b> : l\'outil est déjà sur le poste, l\'agent a l\'habitude, rien ne paraît louche. Il n\'a rien à faire installer. L\'identifiant et le mot de passe affichés suffisent à prendre la main. C\'est le bon outil… mais pas le bon interlocuteur.',
      etape: 'É3',
      composant: 'appel',
      donnees: {
        appelant: 'Numéro inconnu',
        numero: '0262 00 55 17',
        duree: '02:14',
        contexte: '<div class="fenetre-outil"><div class="fo-titre">{{OUTIL_PRISE_EN_MAIN}} – Assistance à distance</div>' +
          '[[identifiants|<div class="fo-ligne"><span>Votre identifiant</span><b>1 284 553 907</b></div><div class="fo-ligne"><span>Mot de passe</span><b>k7x9q2</b></div>]]</div>',
        repliques: [
          { qui: 'appelant', texte: '[[outil|Ouvrez {{OUTIL_PRISE_EN_MAIN}} comme d\'habitude, et donnez-moi l\'identifiant et le mot de passe qui s\'affichent.]]' },
          { qui: 'agent', texte: 'Je préfère ouvrir un ticket {{OUTIL_TICKET}}, non ?' },
          { qui: 'appelant', texte: '[[ticket|Pas le temps, c\'est critique !]]' }
        ]
      },
      indices: {
        outil:       { type: 'suspect', etiquette: 'Le bon outil, mais pas le bon interlocuteur : le vrai support ne s\'en sert jamais sur un appel qu\'on n\'a pas demandé' },
        identifiants:{ type: 'suspect', etiquette: 'Identifiant + mot de passe = les clés du poste : seulement pour un support qu\'on a soi-même appelé' },
        ticket:      { type: 'suspect', etiquette: 'Refus de passer par {{OUTIL_TICKET}} (« pas le temps, c\'est critique »)' }
      },
      suivant: 'vote1'
    },

    vote1: {
      coulisses: 'Si la salle hésite : « Qui a appelé qui ? Et qui a ouvert un ticket ? » Si quelqu\'un dit « mais c\'est notre outil », gardez la remarque : c\'est tout le piège. Quel que soit le vote, la suite reste visible.',
      type: 'vote',
      question: 'Que fait-on ?',
      options: [
        { libelle: 'On donne l\'identifiant et le mot de passe', suivant: 'e4', bon: false },
        { libelle: 'On raccroche et on rappelle le support<br><span class="vote-detail">{{NUMERO_SUPPORT}}</span>', suivant: 'e3b', bon: true }
      ],
      suiteQuandMeme: 'e4'
    },

    e3b: {
      coulisses: 'Le vrai support confirme qu\'il n\'a jamais appelé. Il peut aussi calmer l\'inondation de mails et prévenir les collègues : l\'attaquant vise souvent plusieurs agents de la même structure.',
      etape: 'É3 bis',
      composant: 'appel',
      donnees: {
        appelant: '{{DSI_NOM}}',
        numero: '{{NUMERO_SUPPORT}}',
        duree: '00:52',
        contexte: 'Vous rappelez le support sur le <b>numéro connu</b>.',
        repliques: [
          { qui: 'agent', texte: 'On vient de m\'appeler de votre part, et on m\'a demandé mon identifiant {{OUTIL_PRISE_EN_MAIN}}…' },
          { qui: 'appelant', texte: 'Ce n\'était pas nous. Ne donnez rien : on s\'occupe de votre boîte mail.' }
        ]
      },
      suivant: 'bienvu1'
    },

    bienvu1: {
      coulisses: 'À souligner : le rappel n\'a pris qu\'une minute, et il a tout arrêté. Règle simple : on ne donne l\'identifiant de l\'outil qu\'au support qu\'on a soi-même appelé.',
      type: 'bienvu',
      texte: 'Raccrocher et rappeler le support sur le numéro connu : l\'attaquant n\'a jamais eu la main.',
      suite: 'e4'
    },

    e4: {
      coulisses: 'L\'attaquant voit l\'écran de l\'agent et pilote la souris, avec ses droits : RH et paie lui sont refusés, mais il copie ce qui est accessible. Et il tombe sur un fichier de mots de passe laissé dans le dossier commun. Problème pour lui : dès que l\'agent raccroche, la session se ferme.',
      etape: 'É4',
      composant: 'explorateur',
      donnees: {
        titre: 'Commun',
        chemin: '{{SERVEUR_FICHIERS}}',
        fichiers: [
          { nom: 'Urbanisme – Permis de construire', type: 'dossier', date: '03/11/2026', selectionne: true },
          { nom: 'Annuaire et organigramme', type: 'dossier', date: '28/10/2026', selectionne: true },
          { nom: '🔒 Ressources humaines', type: 'dossier', libelleType: 'Accès refusé', date: '' },
          { nom: '🔒 Paie', type: 'dossier', libelleType: 'Accès refusé', date: '' },
          { nom: 'Mots de passe serveurs.xlsx', type: 'xlsx', libelleType: 'Feuille Excel', date: '12/03/2024', taille: '18 Ko', selectionne: true }
        ],
        copie: { titre: 'Copie vers un serveur distant…', progression: 68, detail: 'Urbanisme, annuaire, Mots de passe serveurs.xlsx' },
        curseur: { x: 640, y: 260 },
        contexte: '<p>Le curseur bouge <b>tout seul</b>.</p><p>RH et paie lui sont refusés…</p><p>… mais un fichier de <b>mots de passe</b> traîne dans le dossier commun.</p>'
      },
      motsCles: ['PRISE DE CONTRÔLE', 'EXFILTRATION'],
      suivant: 'e5'
    },

    e5: {
      coulisses: 'Pour revenir plus tard, sans l\'agent, il lui faut le <b>compte</b>. Il lance « mot de passe oublié » sur ce compte : le code reçu par SMS lui permet de le réinitialiser et de valider la double authentification. Si la collectivité utilise une application de validation, il demande d\'« accepter la demande qui s\'affiche ».',
      etape: 'É5',
      composant: 'appel',
      donnees: {
        appelant: 'Numéro inconnu',
        numero: '0262 00 55 17',
        duree: '09:41',
        contexte: '<div class="sms-recu">📱 SMS · [[sms|Votre code de vérification : <b>482 917</b>. Ne le communiquez à personne.]]</div>',
        repliques: [
          { qui: 'appelant', texte: 'C\'est presque fini. [[code|Pour valider la mise à jour de sécurité, lisez-moi le code que vous venez de recevoir par SMS.]]' }
        ]
      },
      indices: {
        code: { type: 'suspect', etiquette: 'Avec ce code, il garde votre compte après avoir raccroché' },
        sms:  { type: 'suspect', etiquette: 'Le SMS le dit lui-même : ce code ne se communique à personne, même au support' }
      },
      suivant: 'vote2'
    },

    vote2: {
      coulisses: 'Relance : « À qui sert ce code ? Que dit le SMS lui-même ? » Quel que soit le vote, la suite reste visible.',
      type: 'vote',
      question: 'Il demande le code reçu par SMS. Que fait-on ?',
      options: [
        { libelle: 'On lit le code', suivant: 'e6', bon: false },
        { libelle: 'On raccroche et on prévient le support<br><span class="vote-detail">{{NUMERO_SUPPORT}}</span>', suivant: 'bienvu2', bon: true }
      ],
      suiteQuandMeme: 'e6'
    },

    bienvu2: {
      coulisses: 'Sans le code, l\'attaquant perd l\'accès en raccrochant. Mais il a déjà copié des fichiers, dont les mots de passe : il faut prévenir le support tout de suite pour les changer. Mieux vaut un signalement tardif que pas de signalement.',
      type: 'bienvu',
      texte: 'Sans le code, il perd l\'accès en raccrochant. Mais des fichiers sont partis : on prévient tout de suite le support, qui change les mots de passe.',
      suite: 'e6'
    },

    e6: {
      coulisses: 'Avec le compte, l\'attaquant revient depuis chez lui (messagerie, accès de télétravail). Les mots de passe volés le rendent administrateur. Quelques jours plus tard, il lance le chiffrement, souvent la nuit ou le week-end. C\'est la <b>double extorsion</b> : payer pour récupérer les fichiers, et payer pour que les données volées ne soient pas publiées. Payer ne garantit ni l\'un ni l\'autre.',
      etape: 'É6',
      composant: 'rancon',
      donnees: {
        titre: 'VOS FICHIERS SONT CHIFFRÉS',
        texte: 'Tous les postes et serveurs de {{COLLECTIVITE}} sont chiffrés.<br>Vos données (urbanisme, annuaire, documents partagés) ont été copiées.<br>Sans paiement, elles seront publiées.',
        compteur: '71:59:42',
        pied: 'Quelques jours plus tard, un lundi à 8 h – sur tous les postes'
      },
      motsCles: ['RANÇONGICIEL'],
      suivant: 'debrief'
    },

    // ================================================================ Film (6 séquences)

    f1: {
      coulisses: 'Rien n\'est piraté ici : l\'attaquant a inscrit l\'adresse de Nadia à des centaines de newsletters, de façon automatique. Beaucoup passent les filtres anti-spam. But : créer une gêne, pour que l\'appel du « support » paraisse logique.',
      etape: 'Séq. 1',
      composant: 'video',
      donnees: { sequence: 1, fichier: 'videos/parcours1-seq1.mp4', question: 'À votre avis, c\'est quoi ?',
        description: 'La boîte {{OUTIL_MAIL}} de Nadia, service urbanisme, se remplit : 200 newsletters en accéléré, le compteur s\'emballe.' },
      motsCles: ['DIVERSION'],
      suivant: 'f2'
    },
    f2: {
      coulisses: 'L\'attaquant sait que la boîte de Nadia déborde : il l\'a provoqué. Il connaît le prestataire et l\'outil habituel du support. Il appelle d\'un numéro quelconque et se présente : c\'est l\'histoire qui convainc.',
      etape: 'Séq. 2',
      composant: 'video',
      donnees: { sequence: 2, fichier: 'videos/parcours1-seq2.mp4', question: 'Qu\'est-ce qu\'il lui dit, d\'après vous ?',
        description: 'Appel entrant d\'un numéro inconnu : « Support informatique de {{PRESTATAIRE_INFO}}. Ouvrez {{OUTIL_PRISE_EN_MAIN}} comme d\'habitude, et donnez-moi l\'identifiant et le mot de passe. »' },
      motsCles: ['APPEL NON SOLLICITÉ', 'URGENCE', 'PEUR'],
      suivant: 'voteFilm'
    },
    voteFilm: {
      coulisses: 'Si la salle hésite : « Qui a appelé qui ? » Si quelqu\'un dit « mais c\'est notre outil », gardez la remarque : c\'est tout le piège. Quel que soit le vote, la suite reste visible.',
      type: 'vote',
      question: 'Il demande l\'identifiant et le mot de passe de {{OUTIL_PRISE_EN_MAIN}}. Que fait Nadia ?',
      options: [
        { libelle: 'Elle les donne', suivant: 'f3', bon: false },
        { libelle: 'Elle raccroche et rappelle le support<br><span class="vote-detail">{{NUMERO_SUPPORT}}</span>', suivant: 'bienvuFilm', bon: true }
      ],
      suiteQuandMeme: 'f3'
    },
    bienvuFilm: {
      coulisses: 'On ne donne l\'identifiant de l\'outil qu\'au support qu\'on a soi-même appelé.',
      type: 'bienvu',
      texte: 'Raccrocher et rappeler le support sur le numéro connu : l\'attaquant n\'a jamais eu la main.',
      suite: 'f3'
    },
    f3: {
      coulisses: 'Le bon outil, mais pas le bon interlocuteur : l\'attaquant pilote le poste avec les droits de Nadia.',
      etape: 'Séq. 3',
      composant: 'video',
      donnees: { sequence: 3, fichier: 'videos/parcours1-seq3.mp4', question: 'Que fallait-il faire à ce moment ?',
        description: 'Nadia ouvre {{OUTIL_PRISE_EN_MAIN}}, comme d\'habitude, et lit l\'identifiant et le mot de passe. Le curseur se met à bouger tout seul.' },
      motsCles: ['OUTIL HABITUEL', 'PORTE OUVERTE'],
      suivant: 'f4'
    },
    f4: {
      coulisses: 'L\'attaquant copie ce que Nadia peut ouvrir et trouve un fichier de mots de passe. Pour revenir sans elle, il lui faut son compte : d\'où le code SMS.',
      etape: 'Séq. 4',
      composant: 'video',
      donnees: { sequence: 4, fichier: 'videos/parcours1-seq4.mp4', question: 'Quelles données sont parties ? Et pourquoi ce code ?',
        description: 'Ouverture de {{SERVEUR_FICHIERS}} : Urbanisme, annuaire, « Accès refusé » sur RH et paie… et un fichier « Mots de passe serveurs ». Une barre de copie progresse. « Pour finir, lisez-moi le code reçu par SMS. »' },
      motsCles: ['EXFILTRATION', 'CODE DONNÉ'],
      suivant: 'f5'
    },
    f5: {
      coulisses: 'Pour Nadia, l\'incident est clos. Pour l\'attaquant, il commence : il a un compte valide et des mots de passe de serveurs. Il peut préparer son attaque pendant des jours avant de frapper.',
      etape: 'Séq. 5',
      composant: 'video',
      donnees: { sequence: 5, fichier: 'videos/parcours1-seq5.mp4', question: 'Combien de temps avant qu\'on s\'en rende compte ?',
        description: 'Fin d\'appel : « C\'est réglé, bonne journée. » Nadia sourit et reprend son travail. Rien ne paraît anormal.' },
      motsCles: ['TOUT SEMBLE NORMAL'],
      suivant: 'f6'
    },
    f6: {
      coulisses: 'Le chiffrement est souvent lancé la nuit ou le week-end. C\'est la <b>double extorsion</b> : payer pour récupérer les fichiers, et payer pour que les données volées ne soient pas publiées. Payer ne garantit ni l\'un ni l\'autre.',
      etape: 'Séq. 6',
      composant: 'video',
      donnees: { sequence: 6, fichier: 'videos/parcours1-seq6.mp4', question: 'Débrief et réflexe',
        description: 'Quelques jours plus tard, un lundi à 8 h : écran de rançon sur tous les postes du service, puis plan large de la mairie aux fenêtres éteintes.' },
      motsCles: ['RANÇONGICIEL', 'SERVICES À L\'ARRÊT'],
      suivant: 'debrief'
    }
  },

  coulisses: {
    scenario: 'Un agent de {{COLLECTIVITE_COURT}} voit sa boîte mail exploser, puis reçoit l\'appel d\'un faux support qui connaît l\'outil habituel, <b>{{OUTIL_PRISE_EN_MAIN}}</b>. L\'attaquant veut la main sur le poste, puis le compte de l\'agent, pour entrer durablement dans le réseau.',
    modeOperatoire: 'Schéma décrit par Microsoft en 2024 : inondation de la boîte (<b>« email bombing »</b>), puis appel d\'un faux support qui fait ouvrir un outil de prise en main <b>légitime</b>, souvent celui que la collectivité utilise déjà. Avec l\'identifiant et le mot de passe, il pilote le poste. Avec le code reçu par SMS, il garde le compte après l\'appel. Il revient ensuite, devient administrateur, puis déploie le <b>rançongiciel</b>.'
  },

  debrief: {
    attaquant: 'Avec l\'identifiant de l\'outil, il pilote le poste et copie ce que l\'agent peut ouvrir, dont un fichier de mots de passe. Avec le code SMS, il garde le compte, revient quelques jours plus tard, devient administrateur et chiffre les serveurs.',
    impact: 'Les services (état civil, paie, urbanisme) peuvent s\'arrêter plusieurs semaines.',
    message: 'C\'est le bon outil, mais pas le bon interlocuteur : un outil familier ne protège pas d\'un faux support.',
    reflexe: 'Raccrocher, rappeler le support sur le numéro connu {{NUMERO_SUPPORT}} ; ne donner l\'identifiant de {{OUTIL_PRISE_EN_MAIN}} qu\'au support qu\'on a soi-même appelé, et ne jamais lire un code reçu par SMS.'
  }
});
