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
  source: 'Mode opératoire documenté : inondation de spams puis faux appel du support, prise en main à distance',
  debut: { option: 'filmParcours1', alors: 'f1', sinon: 'e1' },

  ecrans: {

    // ================================================================ Écrans fixes

    e1: {
      etape: 'É1',
      composant: 'mail',
      donnees: {
        application: 'Messagerie – {{COLLECTIVITE_COURT}}',
        utilisateur: 'Service urbanisme',
        compteur: '200 non lus',
        vide: '200 nouveaux messages en 10 minutes…',
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
      etape: 'É3',
      composant: 'appel',
      donnees: {
        appelant: '{{PRESTATAIRE_INFO}} – Support',
        numero: '0262 00 55 17',
        duree: '02:14',
        repliques: [
          { qui: 'appelant', texte: '[[code|Ouvrez l\'Assistance rapide et donnez-moi le code à 6 chiffres.]]' },
          { qui: 'agent', texte: 'Je préfère ouvrir un ticket {{OUTIL_TICKET}}, non ?' },
          { qui: 'appelant', texte: '[[ticket|Pas le temps, c\'est critique !]]' }
        ]
      },
      indices: {
        code:   { type: 'suspect', etiquette: 'Le vrai support ne demande jamais un code de prise en main sur un appel entrant' },
        ticket: { type: 'suspect', etiquette: 'Refus de passer par {{OUTIL_TICKET}} (« pas le temps, c\'est critique »)' }
      },
      suivant: 'vote'
    },

    vote: {
      type: 'vote',
      question: 'Que fait-on ?',
      options: [
        { libelle: 'On donne le code', suivant: 'e4', bon: false },
        { libelle: 'On raccroche et on rappelle le support<br><span class="vote-detail">{{NUMERO_SUPPORT}}</span>', suivant: 'e3b', bon: true }
      ],
      suiteQuandMeme: 'e4'
    },

    e3b: {
      etape: 'É3 bis',
      composant: 'appel',
      donnees: {
        appelant: '{{DSI_NOM}}',
        numero: '{{NUMERO_SUPPORT}}',
        duree: '00:52',
        contexte: 'Vous rappelez le support sur le <b>numéro connu</b>.',
        repliques: [
          { qui: 'agent', texte: 'On vient de m\'appeler de votre part pour une attaque sur mon poste…' },
          { qui: 'appelant', texte: 'Nous ne vous avons pas appelé. Ne donnez aucun code : on s\'occupe de votre boîte mail.' }
        ]
      },
      suivant: 'bienvu'
    },

    bienvu: {
      type: 'bienvu',
      texte: 'Raccrocher et rappeler le support sur le numéro connu : l\'attaquant n\'a jamais eu la main sur le poste.',
      suite: 'e4'
    },

    e4: {
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
      etape: 'Séq. 1',
      composant: 'video',
      donnees: { sequence: 1, fichier: 'videos/parcours1-seq1.mp4', question: 'À votre avis, c\'est quoi ?',
        description: 'La boîte {{OUTIL_MAIL}} de Nadia, service urbanisme, se remplit : 200 newsletters en accéléré, le compteur s\'emballe.' },
      motsCles: ['DIVERSION'],
      suivant: 'f2'
    },
    f2: {
      etape: 'Séq. 2',
      composant: 'video',
      donnees: { sequence: 2, fichier: 'videos/parcours1-seq2.mp4', question: 'Qu\'est-ce qu\'il lui dit, d\'après vous ?',
        description: 'Appel entrant « {{PRESTATAIRE_INFO}} – Support ». Le chrono de l\'appel défile, Nadia décroche.' },
      motsCles: ['APPEL NON SOLLICITÉ', 'URGENCE', 'PEUR'],
      suivant: 'voteFilm'
    },
    voteFilm: {
      type: 'vote',
      question: 'On lui demande le code de l\'Assistance rapide. Que fait Nadia ?',
      options: [
        { libelle: 'Elle donne le code', suivant: 'f3', bon: false },
        { libelle: 'Elle raccroche et rappelle le support<br><span class="vote-detail">{{NUMERO_SUPPORT}}</span>', suivant: 'bienvuFilm', bon: true }
      ],
      suiteQuandMeme: 'f3'
    },
    bienvuFilm: {
      type: 'bienvu',
      texte: 'Raccrocher et rappeler le support sur le numéro connu : l\'attaquant n\'a jamais eu la main sur le poste.',
      suite: 'f3'
    },
    f3: {
      etape: 'Séq. 3',
      composant: 'video',
      donnees: { sequence: 3, fichier: 'videos/parcours1-seq3.mp4', question: 'Que fallait-il faire à ce moment ?',
        description: 'Nadia ouvre l\'outil d\'assistance à distance et lit un code à 6 chiffres à voix haute.' },
      motsCles: ['CODE DONNÉ', 'PORTE OUVERTE'],
      suivant: 'f4'
    },
    f4: {
      etape: 'Séq. 4',
      composant: 'video',
      donnees: { sequence: 4, fichier: 'videos/parcours1-seq4.mp4', question: 'Quelles données sont parties ?',
        description: 'Le curseur bouge seul. Ouverture de {{SERVEUR_FICHIERS}} : dossiers RH, État civil, Marchés. Une barre de copie progresse.' },
      motsCles: ['PRISE DE CONTRÔLE', 'EXFILTRATION'],
      suivant: 'f5'
    },
    f5: {
      etape: 'Séq. 5',
      composant: 'video',
      donnees: { sequence: 5, fichier: 'videos/parcours1-seq5.mp4', question: 'Combien de temps avant qu\'on s\'en rende compte ?',
        description: 'Fin d\'appel : « C\'est réglé, bonne journée. » Nadia sourit et reprend son travail. Un petit programme reste en arrière-plan.' },
      motsCles: ['TOUT SEMBLE NORMAL'],
      suivant: 'f6'
    },
    f6: {
      etape: 'Séq. 6',
      composant: 'video',
      donnees: { sequence: 6, fichier: 'videos/parcours1-seq6.mp4', question: 'Débrief et réflexe',
        description: 'Le lendemain, 8 h : écran de rançon sur tous les postes du service, puis plan large de la mairie aux fenêtres éteintes.' },
      motsCles: ['RANÇONGICIEL', 'SERVICES À L\'ARRÊT'],
      suivant: 'debrief'
    }
  },

  debrief: {
    attaquant: 'En quelques minutes, l\'attaquant obtient l\'accès au réseau, vole des données personnelles d\'usagers, puis chiffre les serveurs.',
    impact: 'Les services (état civil, paie, urbanisme) peuvent s\'arrêter plusieurs semaines.',
    message: 'Le support ne vous appelle jamais pour prendre la main. Raccrochez, rappelez le {{NUMERO_SUPPORT}}.',
    reflexe: 'Raccrocher, rappeler le support sur le numéro connu {{NUMERO_SUPPORT}}, ne jamais installer ni ouvrir un outil de prise en main à la demande d\'un appelant.'
  }
});
