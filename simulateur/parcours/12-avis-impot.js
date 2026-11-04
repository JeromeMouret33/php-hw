/*
 * PARCOURS 12 – L'avis d'impôt disponible (légitime)
 * Source : docs/specification.md, « 12. L'avis d'impôt disponible ».
 * À jouer juste après le parcours 8 : l'écran É2 compare le faux SMS du parcours 8
 * et ce vrai mail, différences surlignées.
 * Détails ajoutés : date du mail, écran de ce qui aurait été perdu (règle d'or).
 */
SIMU.enregistrerParcours({
  numero: 12,
  titre: 'L\'avis d\'impôt disponible',
  titreSalle: 'Un mail des impôts',
  domaine: 'perso',
  nature: 'legitime',
  cible: 'Tout agent',
  duree: '2 min',
  debut: 'e1',

  ecrans: {
    e1: {
      etape: 'É1',
      composant: 'mail',
      donnees: {
        application: 'Messagerie personnelle',
        utilisateur: 'Ma boîte perso',
        liste: [
          { de: 'Finances publiques', objet: 'Votre avis d\'impôt est disponible', apercu: 'Votre avis d\'impôt sur les revenus…', heure: '24 juil.', nonLu: true, selectionne: true },
          { de: 'Club de sport', objet: 'Reprise des cours en septembre', apercu: 'Les inscriptions ouvrent…', heure: '22 juil.' },
          { de: 'École', objet: 'Fournitures scolaires', apercu: 'Voici la liste…', heure: '19 juil.' }
        ],
        message: {
          objet: 'Votre avis d\'impôt est disponible dans votre espace particulier',
          deNom: 'Finances publiques',
          deAdresse: '[[expediteur|ne-pas-repondre@impots.gouv.fr]]',
          a: 'Moi',
          date: '[[calendrier|24 juil.]]',
          corps:
            '<p>Bonjour,</p>' +
            '<p>[[calme|Votre avis d\'impôt sur les revenus est disponible dans votre espace particulier.]]</p>' +
            '<p>Pour le consulter, connectez-vous à votre espace sur <span class="lien">impots.gouv.fr</span>.</p>' +
            '<p>La Direction générale des finances publiques</p>'
        },
        barreEtat: '[[lien|https://www.impots.gouv.fr]]'
      },
      indices: {
        expediteur: { type: 'rassurant', etiquette: 'Expéditeur sur impots.gouv.fr' },
        lien:       { type: 'rassurant', etiquette: 'Lien vers impots.gouv.fr (vérifié au survol)' },
        calme:      { type: 'rassurant', etiquette: 'Aucune carte bancaire, aucun formulaire, aucune urgence' },
        calendrier: { type: 'rassurant', etiquette: 'Cohérent avec le calendrier fiscal' }
      },
      suivant: 'vote'
    },

    vote: {
      type: 'vote',
      question: 'Légitime ou malveillant ?',
      options: [
        { libelle: 'Malveillant : on supprime', suivant: 'perte', bon: false },
        { libelle: 'Légitime', suivant: 'bienvu', bon: true }
      ],
      suiteQuandMeme: 'perte',
      libelleSuiteQuandMeme: 'Et si on l\'avait supprimé ?'
    },

    bienvu: {
      type: 'bienvu',
      texte: 'C\'est bien le vrai mail. Et même dans ce cas, le meilleur geste reste de taper soi-même impots.gouv.fr.',
      suite: 'perte',
      libelleSuite: 'Et si on l\'avait supprimé ?',
      suiteDebrief: 'e2',
      libelleSuiteDebrief: 'Comparer avec le faux SMS'
    },

    perte: {
      etape: 'Et si…',
      composant: 'chronologie',
      donnees: {
        titre: 'Si on l\'avait supprimé…',
        etapes: [
          { quand: 'Sur le moment', titre: 'Rien de grave', texte: 'L\'avis reste disponible dans l\'espace particulier sur impots.gouv.fr.' },
          { quand: 'Plus tard', titre: 'Mais un rendez-vous manqué', texte: 'Sans l\'avoir lu, on peut passer à côté d\'une échéance de paiement.', alerte: true }
        ]
      },
      suivant: 'e2'
    },

    e2: {
      etape: 'É2',
      composant: 'comparaison',
      donnees: {
        titre: 'Le faux et le vrai, côte à côte',
        gauche: {
          verdict: 'malveillant',
          titre: 'Le SMS du parcours 8',
          contenu:
            '<div class="cmp-message">DGFiP : un remboursement de 312,40 € est en attente. Confirmez vos informations <mark>avant 48 h</mark> : <mark>rmb-fisc.link/x7Kq</mark></div>' +
            '<ul><li>Expéditeur : <mark>un numéro de mobile</mark></li><li>Lien : <mark>raccourci, puis impots-gouv-remboursement.fr</mark></li><li>Demande : <mark>carte bancaire</mark></li><li>Ton : <mark>urgence</mark></li></ul>'
        },
        droite: {
          verdict: 'legitime',
          titre: 'Le mail de l\'avis d\'impôt',
          contenu:
            '<div class="cmp-message">Votre avis d\'impôt sur les revenus est disponible dans votre espace particulier.</div>' +
            '<ul><li>Expéditeur : <b>impots.gouv.fr</b></li><li>Lien : <b>impots.gouv.fr</b></li><li>Demande : <b>aucune</b></li><li>Ton : <b>informatif, aucune urgence</b></li></ul>'
        }
      },
      suivant: 'debrief'
    }
  },

  debrief: {
    message: 'Même un mail légitime se consulte au mieux en tapant soi-même impots.gouv.fr.',
    reflexe: 'Taper soi-même impots.gouv.fr : c\'est le geste qui protège dans tous les cas.'
  }
});
