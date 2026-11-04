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

  debrief: {
    message: 'Ce sont précisément les organismes les plus imités.',
    reflexe: 'Légitime ou non, la bonne pratique reste la même : passer par l\'application ou le site tapé soi-même.'
  }
});
