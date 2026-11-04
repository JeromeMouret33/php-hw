/*
 * PARCOURS 6 – La clé USB du parking (malveillant)
 * Source : docs/specification.md, « 6. La clé USB du parking ».
 * Les « commandes » affichées sont descriptives et factices (aucune commande réelle).
 */
SIMU.enregistrerParcours({
  numero: 6,
  titre: 'La clé USB du parking',
  titreSalle: 'Un objet trouvé',
  domaine: 'pro',
  nature: 'malveillant',
  cible: 'Tout agent',
  duree: '2 min',
  source: 'Tischer et al., « Users Really Do Plug in USB Drives They Find », IEEE Symposium on Security and Privacy, 2016',
  debut: 'e1',

  ecrans: {
    e1: {
      coulisses: 'La clé n\'a pas été perdue : elle a été posée. L\'étiquette joue sur la curiosité (les primes des collègues) et sur le sens du devoir (rendre un document confidentiel). Le lieu est choisi pour qu\'un agent, qui a un poste sur le réseau, la ramasse.',
      etape: 'É1',
      composant: 'photo',
      donnees: {
        scene: 'cle-usb',
        texteEtiquette: 'Primes 2026',
        texteEtiquette2: 'CONFIDENTIEL RH',
        panneau: '{{PARKING}}',
        zones: { etiquette: 'curiosite', lieu: 'lieu' },
        legende: 'Trouvée ce matin sur le {{PARKING}}'
      },
      indices: {
        curiosite: { type: 'suspect', etiquette: 'Étiquette qui pique la curiosité' },
        lieu:      { type: 'suspect', etiquette: 'Objet trouvé dans un lieu de passage des agents' }
      },
      suivant: 'vote'
    },

    vote: {
      coulisses: 'Relance : « Comment savoir ce qu\'il y a sur cette clé sans la brancher ? » On ne peut pas : d\'où la remise au {{DSI_NOM}}. Brancher montre les deux pièges : le faux fichier et le clavier fantôme.',
      type: 'vote',
      question: 'Que fait-on de cette clé ?',
      options: [
        { libelle: 'On la branche pour retrouver son propriétaire', suivant: 'e2', bon: false },
        { libelle: 'On la remet au {{DSI_NOM}}', suivant: 'bienvu', bon: true }
      ],
      suiteQuandMeme: 'e2'
    },

    bienvu: {
      type: 'bienvu',
      texte: 'Remise au {{DSI_NOM}} sans être branchée : elle sera analysée sur un poste isolé.',
      suite: 'e2'
    },

    e2: {
      coulisses: 'Un ordinateur accepte tout clavier branché, sans rien demander. La clé tape en quelques secondes des commandes préparées, qui installent un outil de contrôle à distance. C\'est ensuite le poste qui se connecte à l\'attaquant, depuis l\'intérieur du réseau : la porte est ouverte de dedans.',
      etape: 'É2',
      composant: 'explorateur',
      donnees: {
        titre: 'Clé USB (E:)',
        chemin: 'Ce PC › Clé USB (E:)',
        fichiers: [
          { nom: 'Primes_2026.xlsx', type: 'xlsx', libelleType: 'Application', date: '02/11/2026', taille: '1 Mo', selectionne: true }
        ],
        terminal: {
          titre: 'Nouveau clavier détecté',
          lignes: [
            '> ouverture d\'une fenêtre cachée',
            '> téléchargement d\'un outil de contrôle à distance… OK',
            '> connexion au serveur de l\'attaquant… OK',
            '> accès au réseau de {{COLLECTIVITE_COURT}} : OUVERT'
          ]
        },
        contexte: '<p>« Primes_2026.xlsx » n\'est pas un tableur : c\'est un <b>programme</b>.</p><p>Ou bien la clé se fait passer pour un <b>clavier</b>, et tape des commandes en trois secondes.</p>'
      },
      motsCles: ['CLAVIER FANTÔME', 'PORTE OUVERTE'],
      suivant: 'debrief'
    }
  },

  coulisses: {
    scenario: 'Un agent trouve une clé USB « Primes 2026 – CONFIDENTIEL RH » sur le {{PARKING}}. L\'attaquant compte sur la curiosité ou la bonne volonté pour qu\'elle soit branchée sur un poste de la collectivité.',
    modeOperatoire: 'L\'attaquant dépose des clés piégées là où passent les agents, avec une étiquette qui donne envie de regarder. Deux techniques existent : un fichier qui ressemble à un document mais qui est en réalité un programme, ou une clé modifiée qui se présente à l\'ordinateur comme un <b>clavier</b> et tape des commandes toute seule. Dans les deux cas, l\'attaquant obtient un accès au poste, puis au réseau.'
  },

  debrief: {
    attaquant: 'Dès le branchement, un programme s\'exécute ou la clé tape elle-même des commandes : l\'attaquant obtient un accès au réseau.',
    message: 'En 2016, des chercheurs américains ont abandonné 297 clés USB sur leur campus : des fichiers ont été ouverts sur 135 d\'entre elles, soit 45 %, souvent pour retrouver le propriétaire.',
    reflexe: 'Ne jamais brancher un support inconnu, le remettre au {{DSI_NOM}}.'
  }
});
