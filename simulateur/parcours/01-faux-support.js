/*
 * PARCOURS 1 – Le faux support informatique (malveillant)
 * Source : docs/specification.md, « 1. Le faux support informatique » et « Film ».
 * Deux modes, selon options.filmParcours1 dans config/collectivite.js :
 *   - écrans fixes É1 à É5 (par défaut) ;
 *   - film en 6 séquences (videos/parcours1-seqN.mp4), à la place des écrans É1 à É5.
 * Détails de réalisme ajoutés : liste des newsletters, numéro d'appel affiché,
 * répliques complètes, écran de retour d'appel au vrai support, noms de dossiers.
 */
SIMU.enregistrerParcours({
  numero: 1,
  titre: 'Le faux support informatique',
  titreSalle: 'Une boîte mail qui s\'emballe',
  domaine: 'pro',
  nature: 'malveillant',
  cible: 'Tout agent',
  duree: '4 min (3 min avec le film)',
  source: 'Mode opératoire documenté : inondation de spams puis faux appel du support, prise en main à distance avec l\'Assistance rapide de Windows (Microsoft Threat Intelligence, mai 2024)',
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
      coulisses: 'L\'attaquant sait que la boîte déborde : c\'est lui qui l\'a provoqué. Le nom du prestataire se trouve souvent en ligne (marchés publics, signatures de mails). Et le numéro affiché ne prouve rien : il peut être falsifié.',
      etape: 'É2',
      composant: 'appel',
      donnees: {
        statut: 'entrant',
        appelant: '{{PRESTATAIRE_INFO}} – Support',
        numero: '0262 00 55 17',
        contexte: '[[non-sollicite|Appel entrant : vous n\'avez ouvert aucun ticket.]]',
        repliques: [
          { qui: 'appelant', texte: 'Bonjour, support informatique. [[provoque|On a détecté une attaque sur votre poste, c\'est pour ça que vous recevez tous ces mails.]]' },
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
      coulisses: '<b>Assistance rapide</b> est un vrai outil Microsoft, déjà présent dans Windows : rien ne paraît louche. Le code, généré côté attaquant puis dicté à la victime, sert à relier les deux ordinateurs : une fois la connexion acceptée, l\'appelant voit l\'écran et peut prendre la main. Le refus du ticket est voulu : un ticket laisserait une trace et alerterait le vrai support.',
      etape: 'É3',
      composant: 'appel',
      donnees: {
        appelant: '{{PRESTATAIRE_INFO}} – Support',
        numero: '0262 00 55 17',
        duree: '02:14',
        repliques: [
          { qui: 'appelant', texte: '[[code|Ouvrez l\'Assistance rapide et tapez le code que je vais vous dicter.]]' },
          { qui: 'agent', texte: 'Je préfère ouvrir un ticket {{OUTIL_TICKET}}, non ?' },
          { qui: 'appelant', texte: '[[ticket|Pas le temps, c\'est critique !]]' }
        ]
      },
      indices: {
        code:   { type: 'suspect', etiquette: 'Le vrai support ne fait jamais ouvrir un outil de prise en main sur un appel entrant' },
        ticket: { type: 'suspect', etiquette: 'Refus de passer par {{OUTIL_TICKET}} (« pas le temps, c\'est critique »)' }
      },
      suivant: 'vote'
    },

    vote: {
      coulisses: 'Si la salle hésite : « Qui a appelé qui ? Et qui a ouvert un ticket ? » Quel que soit le vote, la suite reste visible.',
      type: 'vote',
      question: 'Que fait-on ?',
      options: [
        { libelle: 'On tape le code dicté', suivant: 'e4', bon: false },
        { libelle: 'On raccroche et on rappelle le support<br><span class="vote-detail">{{NUMERO_SUPPORT}}</span>', suivant: 'e3b', bon: true }
      ],
      suiteQuandMeme: 'e4'
    },

    e3b: {
      coulisses: 'Le vrai support confirme qu\'il n\'a jamais appelé. Il peut aussi calmer l\'inondation de mails et prévenir les collègues : l\'attaquant peut viser plusieurs agents de la même structure.',
      etape: 'É3 bis',
      composant: 'appel',
      donnees: {
        appelant: '{{DSI_NOM}}',
        numero: '{{NUMERO_SUPPORT}}',
        duree: '00:52',
        contexte: 'Vous rappelez le support sur le <b>numéro connu</b>.',
        repliques: [
          { qui: 'agent', texte: 'On vient de m\'appeler de votre part pour une attaque sur mon poste…' },
          { qui: 'appelant', texte: 'Nous ne vous avons pas appelé. Ne tapez aucun code : on s\'occupe de votre boîte mail.' }
        ]
      },
      suivant: 'bienvu'
    },

    bienvu: {
      coulisses: 'À souligner : le rappel n\'a pris qu\'une minute, et il a tout arrêté.',
      type: 'bienvu',
      texte: 'Raccrocher et rappeler le support sur le numéro connu : l\'attaquant n\'a jamais eu la main sur le poste.',
      suite: 'e4'
    },

    e4: {
      coulisses: 'Une fois connecté, l\'attaquant agit avec les droits de l\'agent : tout ce que l\'agent peut ouvrir, il peut le copier. Il vole d\'abord les données (pour menacer de les publier), puis installe un programme qui lui garde un accès, même après la fin de l\'appel.',
      etape: 'É4',
      composant: 'explorateur',
      donnees: {
        titre: 'Commun',
        chemin: '{{SERVEUR_FICHIERS}}',
        fichiers: [
          { nom: 'Ressources humaines', type: 'dossier', date: '03/11/2026', selectionne: true },
          { nom: 'État civil', type: 'dossier', date: '03/11/2026', selectionne: true },
          { nom: 'Marchés publics', type: 'dossier', date: '28/10/2026' },
          { nom: 'Urbanisme', type: 'dossier', date: '02/11/2026' },
          { nom: 'Paie', type: 'dossier', date: '31/10/2026' },
          { nom: 'maj-securite.exe', type: 'exe', libelleType: 'Application', date: 'Aujourd\'hui', taille: '2 Mo' }
        ],
        copie: { titre: 'Copie vers un serveur distant…', progression: 68, detail: 'Ressources humaines, État civil · 4 812 éléments' },
        curseur: { x: 640, y: 260 },
        contexte: '<p>Le curseur bouge <b>tout seul</b>.</p><p>Il ouvre le serveur de fichiers, copie les dossiers RH et état civil…</p><p>… puis installe un programme.</p>'
      },
      motsCles: ['PRISE DE CONTRÔLE', 'EXFILTRATION', 'RANÇONGICIEL'],
      suivant: 'e5'
    },

    e5: {
      coulisses: 'Le chiffrement est souvent lancé la nuit ou le week-end, quand personne ne surveille. C\'est la <b>double extorsion</b> : payer pour récupérer les fichiers, et payer pour que les données volées ne soient pas publiées. Payer ne garantit ni l\'un ni l\'autre.',
      etape: 'É5',
      composant: 'rancon',
      donnees: {
        titre: 'VOS FICHIERS SONT CHIFFRÉS',
        texte: 'Tous les postes et serveurs de {{COLLECTIVITE}} sont chiffrés.<br>Vos données (ressources humaines, état civil) ont été copiées.<br>Sans paiement, elles seront publiées.',
        compteur: '71:59:42',
        pied: 'Le lendemain matin, 8 h – sur tous les postes'
      },
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
      coulisses: 'L\'attaquant sait que la boîte de Nadia déborde : c\'est lui qui l\'a provoqué. Le nom du prestataire se trouve souvent en ligne. Et le numéro affiché ne prouve rien : il peut être falsifié.',
      etape: 'Séq. 2',
      composant: 'video',
      donnees: { sequence: 2, fichier: 'videos/parcours1-seq2.mp4', question: 'Qu\'est-ce qu\'il lui dit, d\'après vous ?',
        description: 'Appel entrant « {{PRESTATAIRE_INFO}} – Support ». Le chrono de l\'appel défile, Nadia décroche.' },
      motsCles: ['APPEL NON SOLLICITÉ', 'URGENCE', 'PEUR'],
      suivant: 'voteFilm'
    },
    voteFilm: {
      coulisses: 'Si la salle hésite : « Qui a appelé qui ? Et qui a ouvert un ticket ? » Quel que soit le vote, la suite reste visible.',
      type: 'vote',
      question: 'On lui dicte un code pour l\'Assistance rapide. Que fait Nadia ?',
      options: [
        { libelle: 'Elle tape le code', suivant: 'f3', bon: false },
        { libelle: 'Elle raccroche et rappelle le support<br><span class="vote-detail">{{NUMERO_SUPPORT}}</span>', suivant: 'bienvuFilm', bon: true }
      ],
      suiteQuandMeme: 'f3'
    },
    bienvuFilm: {
      coulisses: 'À souligner : le rappel n\'a pris qu\'une minute, et il a tout arrêté.',
      type: 'bienvu',
      texte: 'Raccrocher et rappeler le support sur le numéro connu : l\'attaquant n\'a jamais eu la main sur le poste.',
      suite: 'f3'
    },
    f3: {
      coulisses: '<b>Assistance rapide</b> est un vrai outil Microsoft, déjà présent dans Windows : rien ne paraît louche. Le code, généré côté attaquant puis dicté à la victime, sert à relier les deux ordinateurs : une fois la connexion acceptée, l\'appelant voit l\'écran et peut prendre la main.',
      etape: 'Séq. 3',
      composant: 'video',
      donnees: { sequence: 3, fichier: 'videos/parcours1-seq3.mp4', question: 'Que fallait-il faire à ce moment ?',
        description: 'Nadia ouvre l\'outil d\'assistance à distance et tape le code à 6 chiffres que lui dicte l\'appelant.' },
      motsCles: ['CODE SAISI', 'PORTE OUVERTE'],
      suivant: 'f4'
    },
    f4: {
      coulisses: 'L\'attaquant agit avec les droits de Nadia : tout ce qu\'elle peut ouvrir, il peut le copier. Il vole d\'abord les données, pour pouvoir menacer de les publier.',
      etape: 'Séq. 4',
      composant: 'video',
      donnees: { sequence: 4, fichier: 'videos/parcours1-seq4.mp4', question: 'Quelles données sont parties ?',
        description: 'Le curseur bouge seul. Ouverture de {{SERVEUR_FICHIERS}} : dossiers RH, État civil, Marchés. Une barre de copie progresse.' },
      motsCles: ['PRISE DE CONTRÔLE', 'EXFILTRATION'],
      suivant: 'f5'
    },
    f5: {
      coulisses: 'Pour Nadia, l\'incident est clos. Pour l\'attaquant, il commence : le programme laissé en arrière-plan lui garde un accès. Il peut explorer le réseau pendant des heures, voire des jours, avant de frapper.',
      etape: 'Séq. 5',
      composant: 'video',
      donnees: { sequence: 5, fichier: 'videos/parcours1-seq5.mp4', question: 'Combien de temps avant qu\'on s\'en rende compte ?',
        description: 'Fin d\'appel : « C\'est réglé, bonne journée. » Nadia sourit et reprend son travail. Un petit programme reste en arrière-plan.' },
      motsCles: ['TOUT SEMBLE NORMAL'],
      suivant: 'f6'
    },
    f6: {
      coulisses: 'Le chiffrement est souvent lancé la nuit ou le week-end. C\'est la <b>double extorsion</b> : payer pour récupérer les fichiers, et payer pour que les données volées ne soient pas publiées. Payer ne garantit ni l\'un ni l\'autre.',
      etape: 'Séq. 6',
      composant: 'video',
      donnees: { sequence: 6, fichier: 'videos/parcours1-seq6.mp4', question: 'Débrief et réflexe',
        description: 'Le lendemain, 8 h : écran de rançon sur tous les postes du service, puis plan large de la mairie aux fenêtres éteintes.' },
      motsCles: ['RANÇONGICIEL', 'SERVICES À L\'ARRÊT'],
      suivant: 'debrief'
    }
  },

  coulisses: {
    scenario: 'Un agent de {{COLLECTIVITE_COURT}} voit sa boîte mail exploser, puis reçoit l\'appel d\'un faux support informatique. Le but de l\'attaquant : prendre la main sur le poste pour entrer dans le réseau de la collectivité.',
    modeOperatoire: 'Mode opératoire décrit par Microsoft en 2024. L\'attaquant inonde d\'abord la boîte de la victime de newsletters (<b>« email bombing »</b>), puis appelle en se présentant comme le support. Il fait ouvrir <b>Assistance rapide</b>, l\'outil d\'aide à distance intégré à Windows. Une fois la main prise, il installe ses propres programmes, copie des données et prépare le <b>rançongiciel</b>.'
  },

  debrief: {
    attaquant: 'En quelques minutes, l\'attaquant obtient l\'accès au réseau, vole des données personnelles d\'usagers, puis chiffre les serveurs.',
    impact: 'Les services (état civil, paie, urbanisme) peuvent s\'arrêter plusieurs semaines.',
    message: 'Un code tapé, et l\'attaquant a les mêmes droits que vous sur le réseau.',
    reflexe: 'Raccrocher, rappeler le support sur le numéro connu {{NUMERO_SUPPORT}}, ne jamais installer ni ouvrir un outil de prise en main à la demande d\'un appelant.'
  }
});
