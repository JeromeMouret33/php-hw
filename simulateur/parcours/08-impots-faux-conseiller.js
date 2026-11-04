/*
 * PARCOURS 8 – Le remboursement d'impôts, puis le faux conseiller (malveillant)
 * Source : docs/specification.md, « 8. Le remboursement d'impôts, puis le faux conseiller ».
 * Habillage évocateur des finances publiques, sans logo ni Marianne.
 * Détails de réalisme ajoutés : numéro d'expédition (plage fictive), lien raccourci
 * inventé, montants des deux autres paiements.
 */
SIMU.enregistrerParcours({
  numero: 8,
  titre: 'Le remboursement d\'impôts, puis le faux conseiller',
  titreSalle: 'Un SMS des impôts',
  domaine: 'perso',
  nature: 'malveillant',
  cible: 'Tout agent, vie perso',
  duree: '4 min',
  debut: 'e1',

  ecrans: {
    e1: {
      etape: 'É1',
      composant: 'smartphone',
      donnees: {
        mode: 'sms',
        contact: '06 39 98 21 47',
        heure: '18:42',
        messages: [
          { de: 'eux', texte: 'DGFiP : [[montant|un remboursement de 312,40 € est en attente. Confirmez vos informations avant 48 h]] : [[lien|<span class="lien">https://rmb-fisc.link/x7Kq</span>]]', heure: '18:41' }
        ]
      },
      indices: {
        montant: { type: 'suspect', etiquette: 'Montant précis et urgence' },
        lien:    { type: 'suspect', etiquette: 'Lien raccourci, expéditeur au format numéro mobile' }
      },
      suivant: 'e2'
    },

    e2: {
      etape: 'É2',
      composant: 'navigateur',
      donnees: {
        onglet: 'Remboursement – Finances publiques',
        url: '[[adresse|impots-gouv-remboursement.fr]]/confirmation',
        page:
          '<div class="theme-fisc"><div class="site-bandeau"></div><div class="site-entete">Finances publiques <small>Espace remboursement</small></div>' +
          '<div class="site-corps"><div class="site-carte" style="width:900px"><h2>Remboursement de 312,40 €</h2>' +
          '<div style="display:flex;gap:20px"><div class="site-champ" style="flex:1"><label>Nom</label><div></div></div><div class="site-champ" style="flex:1"><label>Prénom</label><div></div></div></div>' +
          '[[carte|<div class="site-champ"><label>Numéro de carte bancaire</label><div class="vide">0000 0000 0000 0000</div></div>' +
          '<div style="display:flex;gap:20px"><div class="site-champ" style="flex:1"><label>Date d\'expiration</label><div class="vide">MM/AA</div></div><div class="site-champ" style="flex:1"><label>Cryptogramme</label><div class="vide">123</div></div></div>]]' +
          '<span class="site-btn bleu">Recevoir mon remboursement</span></div></div></div>'
      },
      indices: {
        adresse: { type: 'suspect', etiquette: 'Adresse du site, qui n\'est pas impots.gouv.fr' },
        carte:   { type: 'suspect', etiquette: 'Un remboursement ne demande jamais de carte bancaire : il part sur le RIB déjà connu des impôts' }
      },
      suivant: 'vote1'
    },

    vote1: {
      type: 'vote',
      question: 'Que fait-on ?',
      options: [
        { libelle: 'On remplit', suivant: 'e3', bon: false },
        { libelle: 'On ferme, et on va dans son espace sur impots.gouv.fr', suivant: 'bienvu1', bon: true }
      ],
      suiteQuandMeme: 'e3'
    },

    bienvu1: {
      type: 'bienvu',
      texte: 'Dans son espace sur impots.gouv.fr, aucun remboursement en attente : le SMS était faux.',
      suite: 'e3'
    },

    e3: {
      etape: 'É3',
      composant: 'appel',
      donnees: {
        appelant: '{{BANQUE_PERSO}}',
        numero: '[[numero|Service client (numéro enregistré)]]',
        duree: '01:26',
        contexte: '10 minutes plus tard, l\'écran affiche le vrai numéro de votre banque.',
        repliques: [
          { qui: 'appelant', texte: 'Service fraude de {{BANQUE_PERSO}} : une opération de 1 450 € est en cours sur votre carte.' },
          { qui: 'appelant', texte: '[[valider|Pour l\'annuler, validez-la dans votre application.]]' }
        ]
      },
      indices: {
        numero:  { type: 'suspect', etiquette: 'Le numéro affiché ne prouve rien : il peut être usurpé' },
        valider: { type: 'suspect', etiquette: 'Une banque ne demande jamais de valider une opération pour l\'annuler' }
      },
      suivant: 'vote2'
    },

    vote2: {
      type: 'vote',
      question: 'Que fait-on ?',
      options: [
        { libelle: 'On valide dans l\'application', suivant: 'e4', bon: false },
        { libelle: 'On raccroche, et on rappelle le numéro au dos de sa carte', suivant: 'bienvu2', bon: true }
      ],
      suiteQuandMeme: 'e4'
    },

    bienvu2: {
      type: 'bienvu',
      texte: 'Au numéro au dos de la carte, la vraie banque confirme : personne ne vous a appelé.',
      suite: 'e4'
    },

    e4: {
      etape: 'É4',
      composant: 'smartphone',
      donnees: {
        mode: 'app',
        heure: '19:03',
        app: {
          titre: '{{BANQUE_PERSO}}',
          couleur: '#7a1f3d',
          contenu:
            '<div class="app-carte app-alerte"><small>Validé par vous · 18:58</small><b>Paiement en ligne · 1 450,00 €</b></div>' +
            '<div class="app-carte app-alerte"><small>Validé par vous · 19:00</small><b>Paiement en ligne · 980,00 €</b></div>' +
            '<div class="app-carte app-alerte"><small>Validé par vous · 19:01</small><b>Paiement en ligne · 1 120,00 €</b></div>'
        },
        contexte: '<p>Trois paiements, <b>validés par la victime elle-même</b> dans son application.</p>'
      },
      motsCles: ['VALIDÉ PAR VOUS', 'REMBOURSEMENT REFUSÉ ?'],
      suivant: 'debrief'
    }
  },

  debrief: {
    attaquant: 'Le site sert à récolter les données ; l\'appel sert à faire valider les paiements.',
    impact: 'Quand la victime a validé les paiements elle-même, la banque peut contester le remboursement.',
    reflexe: 'Passer soi-même par impots.gouv.fr ; raccrocher et rappeler sa banque sur le numéro connu.'
  }
});
