/*
 * PARCOURS 1 – Le faux support informatique (malveillant)
 * Source : docs/specification.md, « 1. Le faux support informatique » et « Film »,
 * revu pour la plausibilité le 2026-11-04 (voir SUIVI.md, décisions 16 à 18) :
 *   - les agents n'ont pas les droits d'installation : l'outil de prise en main est
 *     BLOQUÉ par le poste, et l'attaquant passe au plan B (codes reçus par SMS,
 *     pour prendre le compte de l'agent et se connecter à distance) ;
 *   - l'attaquant ne voit que ce que l'agent peut ouvrir (RH et paie refusés),
 *     mais trouve un fichier de mots de passe dans le dossier commun ;
 *   - l'appel vient d'un numéro inconnu (pas d'usurpation du nom du prestataire).
 * Deux modes, selon options.filmParcours1 dans config/collectivite.js :
 *   - écrans fixes (par défaut) ;
 *   - film en 6 séquences (videos/parcours1-seqN.mp4), à la place des écrans fixes.
 * Détails de réalisme ajoutés : liste des newsletters, numéro d'appel, répliques,
 * fenêtre de blocage, SMS de code, noms de dossiers, fichier de mots de passe.
 */
SIMU.enregistrerParcours({
  numero: 1,
  titre: 'Le faux support informatique',
  titreSalle: 'Une boîte mail qui s\'emballe',
  domaine: 'pro',
  nature: 'malveillant',
  cible: 'Tout agent',
  duree: '4 min (3 min avec le film)',
  source: 'Microsoft Threat Intelligence, mai 2024 : inondation de mails puis faux appel du support et prise en main à distance ; TeamViewer : la version QuickSupport « ne nécessite aucune installation »',
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
      coulisses: 'Premier essai : un outil de prise en main à distance. Il en existe dans Windows (Assistance rapide) et dans le commerce ; certaines versions <b>se lancent sans installation</b>, précisément pour dépanner un poste sans droits administrateur. L\'agent qui pense « de toute façon, je ne peux rien installer » baisse la garde. Le refus du ticket est voulu : un ticket alerterait le vrai support.',
      etape: 'É3',
      composant: 'appel',
      donnees: {
        appelant: 'Numéro inconnu',
        numero: '0262 00 55 17',
        duree: '02:14',
        repliques: [
          { qui: 'appelant', texte: '[[outil|Je vous envoie un lien : lancez l\'outil d\'assistance et donnez-moi l\'identifiant qui s\'affiche.]]' },
          { qui: 'agent', texte: 'Je préfère ouvrir un ticket {{OUTIL_TICKET}}. Et je n\'ai pas les droits pour installer un logiciel.' },
          { qui: 'appelant', texte: '[[ticket|Pas le temps, c\'est critique !]] [[sans-installation|Et pas besoin de droits : c\'est une version qui se lance sans installation.]]' }
        ]
      },
      indices: {
        outil:               { type: 'suspect', etiquette: 'Le vrai support ne fait jamais lancer un outil de prise en main sur un appel entrant' },
        ticket:              { type: 'suspect', etiquette: 'Refus de passer par {{OUTIL_TICKET}} (« pas le temps, c\'est critique »)' },
        'sans-installation': { type: 'suspect', etiquette: 'Il a réponse à tout : l\'absence de droits ne l\'arrête pas' }
      },
      suivant: 'vote1'
    },

    vote1: {
      coulisses: 'Si la salle hésite : « Qui a appelé qui ? Et qui a ouvert un ticket ? » Si quelqu\'un dit « de toute façon, c\'est bloqué chez nous », gardez la remarque : la suite y répond. Quel que soit le vote, la suite reste visible.',
      type: 'vote',
      question: 'Que fait-on ?',
      options: [
        { libelle: 'On lance l\'outil', suivant: 'e3bis', bon: false },
        { libelle: 'On raccroche et on rappelle le support<br><span class="vote-detail">{{NUMERO_SUPPORT}}</span>', suivant: 'e3b', bon: true }
      ],
      suiteQuandMeme: 'e3bis'
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
          { qui: 'agent', texte: 'On vient de m\'appeler de votre part pour une attaque sur mon poste…' },
          { qui: 'appelant', texte: 'Nous ne vous avons pas appelé. Ne lancez rien et ne donnez aucun code : on s\'occupe de votre boîte mail.' }
        ]
      },
      suivant: 'bienvu1'
    },

    bienvu1: {
      coulisses: 'À souligner : le rappel n\'a pris qu\'une minute, et il a tout arrêté. La suite montre ce que l\'attaquant tente quand l\'outil est bloqué.',
      type: 'bienvu',
      texte: 'Raccrocher et rappeler le support sur le numéro connu : l\'attaquant n\'a rien obtenu.',
      suite: 'e3bis'
    },

    e3bis: {
      coulisses: 'La protection du poste a tenu… alors l\'attaquant change de cible : le <b>compte</b> de l\'agent. Il lance « mot de passe oublié » sur ce compte : le premier code réinitialise le mot de passe, le second valide la double authentification. Si la collectivité utilise une application de validation, il demande simplement d\'« accepter la demande qui s\'affiche ».',
      etape: 'É4',
      composant: 'appel',
      donnees: {
        appelant: 'Numéro inconnu',
        numero: '0262 00 55 17',
        duree: '04:37',
        contexte:
          '<div class="fenetre-alerte">[[bloque|🛡️ <b>Cette application a été bloquée.</b><br>Votre administrateur a bloqué ce programme.]]</div>' +
          '<div class="sms-recu">📱 SMS · [[sms|Votre code de vérification : <b>482 917</b>. Ne le communiquez à personne.]]</div>',
        repliques: [
          { qui: 'agent', texte: 'Ça ne marche pas : c\'est bloqué par l\'administrateur.' },
          { qui: 'appelant', texte: 'Pas grave, j\'interviens directement sur votre compte. [[code|Vous allez recevoir deux codes par SMS : lisez-les-moi.]]' }
        ]
      },
      indices: {
        bloque: { type: 'rassurant', etiquette: 'La protection du poste a fonctionné : l\'outil est bloqué' },
        code:   { type: 'suspect', etiquette: 'Plan B : faute d\'accès au poste, il vise le compte de l\'agent' },
        sms:    { type: 'suspect', etiquette: 'Le SMS le dit lui-même : ce code ne se communique à personne, même au support' }
      },
      motsCles: ['PLAN B'],
      suivant: 'vote2'
    },

    vote2: {
      coulisses: 'Relance : « À qui sert ce code ? Que dit le SMS lui-même ? » Quel que soit le vote, la suite reste visible.',
      type: 'vote',
      question: 'Il demande les codes reçus par SMS. Que fait-on ?',
      options: [
        { libelle: 'On lit les codes', suivant: 'e4', bon: false },
        { libelle: 'On raccroche et on rappelle le support<br><span class="vote-detail">{{NUMERO_SUPPORT}}</span>', suivant: 'bienvu2', bon: true }
      ],
      suiteQuandMeme: 'e4'
    },

    bienvu2: {
      coulisses: 'Un code reçu par SMS ne se donne jamais, à personne : le vrai support n\'en a jamais besoin. Signaler aussi l\'appel : l\'attaquant a peut-être appelé des collègues.',
      type: 'bienvu',
      texte: 'Le code reste secret, le compte aussi. Le vrai support n\'a jamais besoin d\'un code reçu par SMS.',
      suite: 'e4'
    },

    e4: {
      coulisses: 'Avec les codes, l\'attaquant se connecte <b>depuis chez lui</b>, avec le compte de l\'agent (messagerie, accès de télétravail). Il n\'a que les droits de l\'agent : RH et paie lui sont refusés. Mais il copie tout ce qui est accessible et cherche un accès plus puissant. Un fichier de mots de passe laissé dans un dossier partagé lui ouvre les serveurs.',
      etape: 'É5',
      composant: 'explorateur',
      donnees: {
        titre: 'Commun – session ouverte à distance',
        chemin: '{{SERVEUR_FICHIERS}}',
        fichiers: [
          { nom: 'Urbanisme – Permis de construire', type: 'dossier', date: '03/11/2026', selectionne: true },
          { nom: 'Annuaire et organigramme', type: 'dossier', date: '28/10/2026', selectionne: true },
          { nom: '🔒 Ressources humaines', type: 'dossier', libelleType: 'Accès refusé', date: '' },
          { nom: '🔒 Paie', type: 'dossier', libelleType: 'Accès refusé', date: '' },
          { nom: 'Mots de passe serveurs.xlsx', type: 'xlsx', libelleType: 'Feuille Excel', date: '12/03/2024', taille: '18 Ko', selectionne: true }
        ],
        copie: { titre: 'Copie vers un serveur distant…', progression: 68, detail: 'Urbanisme, annuaire, Mots de passe serveurs.xlsx' },
        contexte: '<p>L\'attaquant est connecté <b>depuis chez lui</b>, avec le compte de l\'agent.</p><p>RH et paie lui sont refusés…</p><p>… mais un fichier de <b>mots de passe</b> traîne dans le dossier commun.</p>'
      },
      motsCles: ['COMPTE VOLÉ', 'EXFILTRATION'],
      suivant: 'e5'
    },

    e5: {
      coulisses: 'Entre le vol du compte et la rançon, l\'attaquant a pris quelques jours pour devenir administrateur et préparer le terrain. Le chiffrement est souvent lancé la nuit ou le week-end. C\'est la <b>double extorsion</b> : payer pour récupérer les fichiers, et payer pour que les données volées ne soient pas publiées. Payer ne garantit ni l\'un ni l\'autre.',
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
      coulisses: 'L\'attaquant sait que la boîte de Nadia déborde : il l\'a provoqué. Le nom du prestataire est souvent public. Il appelle d\'un numéro quelconque et se présente : c\'est l\'histoire qui convainc.',
      etape: 'Séq. 2',
      composant: 'video',
      donnees: { sequence: 2, fichier: 'videos/parcours1-seq2.mp4', question: 'Qu\'est-ce qu\'il lui dit, d\'après vous ?',
        description: 'Appel entrant d\'un numéro inconnu : « Support informatique de {{PRESTATAIRE_INFO}} ». Le chrono de l\'appel défile, Nadia décroche.' },
      motsCles: ['APPEL NON SOLLICITÉ', 'URGENCE', 'PEUR'],
      suivant: 'f3'
    },
    f3: {
      coulisses: 'L\'outil de prise en main est bloqué : la protection du poste a fonctionné. L\'attaquant passe au plan B, le compte de Nadia : les codes reçus par SMS lui permettent de réinitialiser son mot de passe et de valider la double authentification.',
      etape: 'Séq. 3',
      composant: 'video',
      donnees: { sequence: 3, fichier: 'videos/parcours1-seq3.mp4', question: 'Que fallait-il faire à ce moment ?',
        description: 'Nadia lance l\'outil envoyé par l\'appelant : « bloqué par votre administrateur ». L\'appelant enchaîne : « Vous allez recevoir deux codes par SMS, lisez-les-moi. »' },
      motsCles: ['BLOQUÉ', 'PLAN B'],
      suivant: 'voteFilm'
    },
    voteFilm: {
      coulisses: 'Relance : « À qui sert ce code ? Que dit le SMS lui-même ? » Quel que soit le vote, la suite reste visible.',
      type: 'vote',
      question: 'L\'appelant demande les codes reçus par SMS. Que fait Nadia ?',
      options: [
        { libelle: 'Elle lit les codes', suivant: 'f4', bon: false },
        { libelle: 'Elle raccroche et rappelle le support<br><span class="vote-detail">{{NUMERO_SUPPORT}}</span>', suivant: 'bienvuFilm', bon: true }
      ],
      suiteQuandMeme: 'f4'
    },
    bienvuFilm: {
      coulisses: 'Un code reçu par SMS ne se donne jamais, à personne : le vrai support n\'en a jamais besoin.',
      type: 'bienvu',
      texte: 'Le code reste secret, le compte aussi. Le vrai support n\'a jamais besoin d\'un code reçu par SMS.',
      suite: 'f4'
    },
    f4: {
      coulisses: 'L\'attaquant agit depuis chez lui, avec les droits de Nadia : RH et paie lui sont refusés, mais il copie ce qui est accessible… et trouve un fichier de mots de passe.',
      etape: 'Séq. 4',
      composant: 'video',
      donnees: { sequence: 4, fichier: 'videos/parcours1-seq4.mp4', question: 'Quelles données sont parties ?',
        description: 'Depuis l\'extérieur, l\'attaquant ouvre {{SERVEUR_FICHIERS}} avec le compte de Nadia : Urbanisme, annuaire, « Accès refusé » sur RH et paie… et un fichier « Mots de passe serveurs ». Une barre de copie progresse.' },
      motsCles: ['COMPTE VOLÉ', 'EXFILTRATION'],
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
    scenario: 'Un agent de {{COLLECTIVITE_COURT}} voit sa boîte mail exploser, puis reçoit l\'appel d\'un faux support. L\'attaquant veut entrer dans le réseau : d\'abord par un outil de prise en main, puis, si le poste le bloque, par le <b>compte</b> de l\'agent.',
    modeOperatoire: 'Schéma décrit par Microsoft en 2024 : inondation de la boîte (<b>« email bombing »</b>), puis appel d\'un faux support qui fait lancer un outil de prise en main à distance, parfois une version qui <b>se lance sans installation</b>. Si le poste est bien protégé, l\'attaquant passe au <b>plan B</b> : il se fait lire les codes reçus par SMS pour prendre le compte et se connecter à distance. Il cherche ensuite un accès administrateur, puis déploie le <b>rançongiciel</b>.'
  },

  debrief: {
    attaquant: 'Bloqué sur le poste, l\'attaquant prend le compte de l\'agent avec deux codes lus au téléphone. Il entre dans le réseau à distance, copie ce que l\'agent peut ouvrir, trouve un accès administrateur, puis chiffre les serveurs.',
    impact: 'Les services (état civil, paie, urbanisme) peuvent s\'arrêter plusieurs semaines.',
    message: 'Quand la machine dit non, l\'escroc demande à l\'humain : la protection technique ne suffit pas si on donne le code.',
    reflexe: 'Raccrocher, rappeler le support sur le numéro connu {{NUMERO_SUPPORT}}, ne jamais lancer un outil de prise en main ni lire un code reçu par SMS à la demande d\'un appelant.'
  }
});
