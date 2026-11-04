/*
 * PARCOURS 9 – Le colis, l'amende et le QR code (malveillant)
 * Source : docs/specification.md, « 9. Le colis, l'amende et le QR code ».
 * Trois variantes courtes, un vote chacune. Les votes des variantes 1 et 2 sont
 * enregistrés puis mènent à la variante suivante ; la conséquence (É4) se joue à la fin.
 * Détails de réalisme ajoutés : numéros d'expédition (plage fictive), adresses inventées,
 * montant de l'amende, montants débités ensuite.
 */
SIMU.enregistrerParcours({
  numero: 9,
  titre: 'Le colis, l\'amende et le QR code',
  titreSalle: 'Trois petits paiements',
  domaine: 'perso',
  nature: 'malveillant',
  cible: 'Tout agent',
  duree: '3 min',
  debut: 'e1',

  ecrans: {
    e1: {
      etape: 'É1',
      composant: 'smartphone',
      donnees: {
        mode: 'sms',
        contact: '06 39 98 07 12',
        heure: '12:05',
        messages: [
          { de: 'eux', texte: 'Votre colis n\'a pas pu être livré. [[frais|Frais de réexpédition : 1,99 €]] : <span class="lien">https://suivi-relivraison-colis.com/p/48K</span>', heure: '12:04' }
        ]
      },
      indices: {
        frais: { type: 'suspect', etiquette: 'Aucun colis attendu, petit montant pour baisser la garde' }
      },
      suivant: 'voteA'
    },

    voteA: {
      type: 'vote',
      question: 'Le colis : on paie les 1,99 € ?',
      options: [
        { libelle: 'On paie', suivant: 'e2', bon: false },
        { libelle: 'On ne paie pas', suivant: 'e2', bon: true }
      ],
      suiteQuandMeme: 'e2',
      libelleSuiteQuandMeme: 'Variante suivante'
    },

    e2: {
      etape: 'É2',
      composant: 'smartphone',
      donnees: {
        mode: 'sms',
        contact: '06 39 98 64 30',
        heure: '17:20',
        messages: [
          { de: 'eux', texte: 'Avis de contravention impayé. [[majoration|Majoration sous 48 h]] : réglez 35 € sur <span class="lien">https://amendes-reglement-en-ligne.fr</span>', heure: '17:19' }
        ]
      },
      indices: {
        majoration: { type: 'suspect', etiquette: 'Pression de la majoration ; l\'ANTAI ne réclame pas de paiement par SMS' }
      },
      suivant: 'voteB'
    },

    voteB: {
      type: 'vote',
      question: 'L\'amende : on paie ?',
      options: [
        { libelle: 'On paie', suivant: 'e3', bon: false },
        { libelle: 'On ne paie pas', suivant: 'e3', bon: true }
      ],
      suiteQuandMeme: 'e3',
      libelleSuiteQuandMeme: 'Variante suivante'
    },

    e3: {
      etape: 'É3',
      composant: 'photo',
      donnees: {
        scene: 'horodateur',
        panneau: '{{COLLECTIVITE_COURT}}',
        zones: { autocollant: 'autocollant' },
        legende: 'Horodateur, centre-ville de {{COLLECTIVITE_COURT}}',
        contexte: '<p>Le QR code ouvre cette page :</p><div class="carte-claire">[[site|🔒 paiement-stationnement-express.com]]</div>'
      },
      indices: {
        autocollant: { type: 'suspect', etiquette: 'Autocollant superposé, bords visibles' },
        site:        { type: 'suspect', etiquette: 'Le site ouvert n\'est pas celui de l\'application de stationnement de {{COLLECTIVITE_COURT}}' }
      },
      suivant: 'voteC'
    },

    voteC: {
      type: 'vote',
      question: 'Le stationnement : on paie par ce QR code ?',
      options: [
        { libelle: 'On paie', suivant: 'e4', bon: false },
        { libelle: 'On ne paie pas', suivant: 'bienvu', bon: true }
      ],
      suiteQuandMeme: 'e4'
    },

    bienvu: {
      type: 'bienvu',
      texte: 'On paie avec l\'application ou sur le site officiel, en le tapant soi-même : la carte reste à l\'abri.',
      suite: 'e4'
    },

    e4: {
      etape: 'É4',
      composant: 'smartphone',
      donnees: {
        mode: 'app',
        heure: '09:30',
        app: {
          titre: 'Mes comptes',
          couleur: '#24527a',
          contenu:
            '<div class="app-carte"><small>Lundi</small><b>Paiement · 1,99 €</b></div>' +
            '<div class="app-carte app-alerte"><small>Mardi</small><b>Paiement à l\'étranger · 249,00 €</b></div>' +
            '<div class="app-carte app-alerte"><small>Mercredi</small><b>Paiement à l\'étranger · 389,90 €</b></div>' +
            '<div class="app-carte app-alerte"><small>Jeudi</small><b>Paiement à l\'étranger · 412,50 €</b></div>'
        },
        contexte: '<p>1,99 € payés…</p><p>… puis des <b>centaines d\'euros</b> débités les jours suivants.</p>'
      },
      motsCles: ['CARTE COPIÉE'],
      suivant: 'debrief'
    }
  },

  debrief: {
    attaquant: 'Le petit montant n\'est qu\'un prétexte pour obtenir la carte. Ensuite, elle est débitée de nombreuses fois.',
    reflexe: 'Passer par l\'application ou le site officiel tapé soi-même ; signaler le SMS au 33700.'
  }
});
