/*
 * PARCOURS 11 – Le message de l'Assurance Maladie (légitime)
 * Source : docs/specification.md, « 11. Le message de l'Assurance Maladie ».
 * Habillage évocateur, sans logo.
 * Détails ajoutés : documents affichés dans l'application, écran de ce qui aurait
 * été perdu en supprimant le message (règle d'or des parcours légitimes).
 */
SIMU.enregistrerParcours({
  numero: 11,
  titre: 'Le message de l\'Assurance Maladie',
  titreSalle: 'Un message de l\'Assurance Maladie',
  domaine: 'perso',
  nature: 'legitime',
  cible: 'Tout agent',
  duree: '2 min',
  debut: 'e1',

  ecrans: {
    e1: {
      coulisses: 'Le message ne contient aucun lien vers une page de connexion : il invite à passer <b>soi-même</b> par l\'application ou ameli.fr. Pas de montant, pas d\'urgence. Le nom de l\'expéditeur, à lui seul, ne prouve rien : c\'est le contenu qui rassure.',
      etape: 'É1',
      composant: 'smartphone',
      donnees: {
        mode: 'sms',
        contact: 'Assurance Maladie',
        heure: '11:40',
        messages: [
          { de: 'eux', texte: '[[calme|Un nouveau document est disponible dans votre compte.]] [[soi-meme|Consultez-le depuis l\'application]] ou [[pas-de-lien|ameli.fr]].', heure: '11:39' }
        ]
      },
      indices: {
        'pas-de-lien': { type: 'rassurant', etiquette: 'Pas de lien cliquable vers une page de saisie' },
        calme:         { type: 'rassurant', etiquette: 'Aucune urgence, aucun montant, aucune donnée bancaire demandée' },
        'soi-meme':    { type: 'rassurant', etiquette: 'Invitation à passer soi-même par l\'application officielle' }
      },
      suivant: 'vote'
    },

    vote: {
      coulisses: 'Relance : « Comment vérifier sans toucher au message ? » « On supprime » montre ce qu\'on risque de manquer ; « on ouvre l\'application soi-même » montre le document, et la suite reste visible.',
      type: 'vote',
      question: 'Que fait-on ?',
      options: [
        { libelle: 'On supprime', suivant: 'perte', bon: false },
        { libelle: 'On ouvre l\'application soi-même', suivant: 'e2', bon: true }
      ],
      suiteQuandMeme: 'perte',
      libelleSuiteQuandMeme: 'Et si on l\'avait supprimé ?'
    },

    e2: {
      coulisses: 'On a ouvert l\'application officielle sans passer par le message : le document y est. Ce geste protège dans tous les cas : si le message avait été faux, on n\'aurait rien trouvé, sans aucun risque.',
      etape: 'É2',
      composant: 'smartphone',
      donnees: {
        mode: 'app',
        heure: '11:42',
        app: {
          titre: 'Assurance Maladie · Mon compte',
          couleur: '#0c419a',
          contenu:
            '<p><b>Mes documents</b></p>' +
            '<div class="app-carte app-ok"><small>Nouveau · aujourd\'hui</small><b>Attestation de droits</b></div>' +
            '<div class="app-carte"><small>Octobre</small><b>Relevé de remboursements</b></div>'
        },
        contexte: '<p>On a ouvert l\'application <b>soi-même</b> : le document y est bien.</p>'
      },
      suivant: 'bienvu'
    },

    bienvu: {
      type: 'bienvu',
      texte: 'Le document est bien là. On a vérifié sans cliquer : c\'est le bon geste, que le message soit vrai ou faux.',
      suite: 'perte',
      libelleSuite: 'Et si on l\'avait supprimé ?'
    },

    perte: {
      coulisses: 'Supprimer ne fait courir aucun risque de sécurité. Mais on peut passer à côté d\'un document utile. La solution n\'est pas de tout supprimer, c\'est de vérifier par l\'application.',
      etape: 'Et si…',
      composant: 'chronologie',
      donnees: {
        titre: 'Si on l\'avait supprimé…',
        etapes: [
          { quand: 'Sur le moment', titre: 'Rien de grave', texte: 'Supprimer un message n\'expose à rien.' },
          { quand: 'Plus tard', titre: 'Un document oublié', texte: 'L\'attestation reste non consultée : une démarche peut passer inaperçue.', alerte: true }
        ]
      },
      suivant: 'debrief'
    }
  },

  coulisses: {
    scenario: 'Message légitime : l\'Assurance Maladie prévient qu\'un document est disponible. Elle ne demande rien d\'autre que d\'aller le consulter dans son compte.',
    modeOperatoire: 'L\'Assurance Maladie fait partie des organismes les plus imités : faux renouvellement de carte Vitale, faux remboursement. L\'imitation contiendrait un lien vers une page de saisie, une demande de carte bancaire ou de petits frais, et une urgence. Attention : un nom d\'expéditeur comme « Assurance Maladie » peut lui aussi être imité dans un SMS.'
  },

  debrief: {
    message: 'Ce sont précisément les organismes les plus imités.',
    reflexe: 'Légitime ou non, la bonne pratique reste la même : passer par l\'application ou le site tapé soi-même.'
  }
});
