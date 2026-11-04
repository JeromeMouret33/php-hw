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
  debut: 'e1',

  ecrans: {
    e1: {
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

  debrief: {
    attaquant: 'Dès le branchement, un programme s\'exécute ou la clé tape elle-même des commandes : l\'attaquant obtient un accès au réseau.',
    message: 'Une étude universitaire américaine (2016) a montré qu\'environ la moitié des clés abandonnées étaient branchées par ceux qui les trouvaient.',
    reflexe: 'Ne jamais brancher un support inconnu, le remettre au {{DSI_NOM}}.'
  }
});
