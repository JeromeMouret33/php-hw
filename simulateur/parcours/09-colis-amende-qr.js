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
  source: 'ANTAI, « Attention aux SMS, courriels et sites frauduleux » ; Cybermalveillance.gouv.fr, usurpation ANTAI',
  debut: 'e1',

  ecrans: {
    e1: {
      coulisses: 'Le petit montant fait baisser la garde : « 1,99 €, ce n\'est rien ». Mais pour payer, il faut saisir sa carte en entier. L\'escroc ignore si vous attendez un colis : il envoie le même SMS à tout le monde.',
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
      coulisses: 'Relance : « Attendez-vous un colis ? Et si oui, de quel transporteur ? » Le vote est noté ; on enchaîne sur la variante suivante.',
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
      coulisses: 'Même mécanique, avec la peur en plus : la majoration. Le lien mène à un site qui imite un paiement d\'amende officiel. Une vraie amende se vérifie sur le site officiel tapé soi-même, avec les références de l\'avis reçu.',
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
        majoration: { type: 'suspect', etiquette: 'Pression de la majoration ; l\'ANTAI n\'envoie jamais de SMS pour réclamer une amende' }
      },
      suivant: 'voteB'
    },

    voteB: {
      coulisses: 'Relance : « Avez-vous reçu un avis de contravention papier ou dans un espace officiel ? » Le vote est noté ; on enchaîne sur la dernière variante.',
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
      coulisses: 'Un autocollant collé par-dessus le QR code officiel : il suffit de quelques secondes. Ce type d\'arnaque (« quishing ») a été signalé dans plusieurs villes françaises. Le QR code cache l\'adresse : on ne voit le site qu\'une fois ouvert.',
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
      coulisses: 'Relance : « Comment paie-t-on d\'habitude son stationnement à {{COLLECTIVITE_COURT}} ? » Quel que soit le vote, la suite reste visible.',
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
      coulisses: 'La carte a été copiée lors d\'un de ces petits paiements : 1,99 € de colis, 35 € d\'amende ou un stationnement. Les débits arrivent ensuite, souvent à l\'étranger, en plusieurs fois. Le réflexe : faire opposition auprès de sa banque et signaler le SMS au <b>33700</b>.',
      etape: 'É4',
      composant: 'smartphone',
      donnees: {
        mode: 'app',
        heure: '09:30',
        app: {
          titre: 'Mes comptes',
          couleur: '#24527a',
          contenu:
            '<div class="app-carte"><small>Lundi</small><b>Petit paiement (colis, amende ou stationnement)</b></div>' +
            '<div class="app-carte app-alerte"><small>Mardi</small><b>Paiement à l\'étranger · 249,00 €</b></div>' +
            '<div class="app-carte app-alerte"><small>Mercredi</small><b>Paiement à l\'étranger · 389,90 €</b></div>' +
            '<div class="app-carte app-alerte"><small>Jeudi</small><b>Paiement à l\'étranger · 412,50 €</b></div>'
        },
        contexte: '<p>Un petit montant payé…</p><p>… puis des <b>centaines d\'euros</b> débités les jours suivants.</p>'
      },
      motsCles: ['CARTE COPIÉE'],
      suivant: 'debrief'
    }
  },

  coulisses: {
    scenario: 'N\'importe qui peut être visé : un colis, une amende, un stationnement. L\'escroc ne veut pas les 1,99 € ni les 35 € : il veut le <b>numéro de carte complet</b>.',
    modeOperatoire: 'Les SMS partent en masse : sur des milliers de destinataires, certains attendent justement un colis ou craignent une amende. Le faux site de paiement enregistre la carte (numéro, date, cryptogramme). Elle est ensuite réutilisée ou revendue pour des achats, parfois plusieurs jours après. Pour le QR code, l\'escroc colle simplement un autocollant sur un horodateur : on parle de « quishing ».'
  },

  debrief: {
    attaquant: 'Le petit montant n\'est qu\'un prétexte pour obtenir la carte. Ensuite, elle est débitée de nombreuses fois.',
    reflexe: 'Passer par l\'application ou le site officiel tapé soi-même ; signaler le SMS au 33700.'
  }
});
