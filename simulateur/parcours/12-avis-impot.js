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
      coulisses: 'L\'expéditeur et le lien pointent vers impots.gouv.fr, ce qui se vérifie en survolant le lien. Le mail n\'annonce rien d\'alarmant et ne demande rien : il renvoie vers l\'espace particulier. Il arrive au moment de l\'année où les avis sont publiés.',
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
      coulisses: 'Relance : « Que nous demande ce mail ? » Rien, sinon d\'aller voir. « On supprime » montre ce qu\'on risque de manquer ; « légitime » confirme, puis la comparaison avec le faux SMS du parcours 8 reste accessible.',
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
      coulisses: 'Supprimer ce mail n\'expose à rien : l\'avis reste disponible dans l\'espace particulier. Le risque est seulement d\'oublier une échéance. Mieux vaut vérifier que tout supprimer.',
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
      coulisses: 'Côte à côte, les différences sautent aux yeux : expéditeur, adresse du lien, demande, ton. Le faux pousse à agir vite et à donner sa carte ; le vrai informe. Dans les deux cas, taper soi-même impots.gouv.fr protège.',
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

  coulisses: {
    scenario: 'Message légitime : l\'administration fiscale prévient que l\'avis d\'impôt est disponible dans l\'espace particulier. Elle ne demande ni paiement, ni carte, ni saisie.',
    modeOperatoire: 'Les impôts sont parmi les organismes les plus imités, surtout aux moments clés de l\'année : déclaration, avis, remboursements. L\'imitation (voir le parcours 8) annonce un remboursement ou une dette, donne un lien vers une adresse qui n\'est pas impots.gouv.fr et demande une carte bancaire. Un nom d\'expéditeur se copie facilement : le bon réflexe reste de taper soi-même impots.gouv.fr.'
  },

  debrief: {
    message: 'Même un mail légitime se consulte au mieux en tapant soi-même impots.gouv.fr.',
    reflexe: 'Taper soi-même impots.gouv.fr : c\'est le geste qui protège dans tous les cas.'
  }
});
