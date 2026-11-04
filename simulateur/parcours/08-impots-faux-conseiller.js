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
      coulisses: 'Ce SMS part en masse, vers des numéros pris au hasard ou issus de fuites de données. Le lien raccourci cache la vraie adresse. Le montant précis et le délai de 48 h poussent à cliquer sans réfléchir.',
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
      coulisses: 'Le site copie l\'habillage des impôts, mais son adresse n\'est pas impots.gouv.fr. Tout ce qui est tapé part en direct chez l\'escroc : nom, prénom, numéro de carte, date, cryptogramme. Rappel : un vrai remboursement est versé sur le <b>compte bancaire déjà connu</b> de l\'administration.',
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
      coulisses: 'Relance : « Pourquoi les impôts auraient-ils besoin de votre carte pour vous rembourser ? » « On remplit » montre la suite de l\'arnaque ; « on ferme » montre l\'espace impots.gouv.fr vide, et la suite reste visible.',
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
      coulisses: 'L\'escroc a saisi la carte sur un site marchand ; la banque envoie une demande de validation. Il appelle, avec le <b>vrai numéro de la banque affiché</b> : ce numéro peut être usurpé. Il cite les infos du faux site, donc il paraît crédible. « Valider pour annuler » est un mensonge : valider, c\'est payer.',
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
      coulisses: 'Relance : « Le numéro affiché, est-ce une preuve ? » Non. « On valide » montre les paiements partis ; « on raccroche » montre le réflexe : rappeler soi-même le numéro au dos de la carte, jamais celui donné par l\'appelant.',
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
      coulisses: 'Chaque paiement porte la mention « validé par vous » : techniquement, c\'est vrai. La banque peut donc estimer que la victime a commis une négligence et contester le remboursement. L\'escroc, lui, a déjà disparu.',
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

  coulisses: {
    scenario: 'Un particulier reçoit un faux SMS des impôts, puis un faux appel de sa banque. L\'escroc veut lui faire <b>valider lui-même</b> des paiements avec sa carte.',
    modeOperatoire: 'Étape 1 : le faux site récolte l\'identité et les données de carte. Étape 2, quelques minutes plus tard : l\'escroc tente des paiements avec cette carte, et la banque demande une validation dans l\'application. Il appelle alors la victime en se faisant passer pour le service fraude, en affichant le numéro de la banque grâce à l\'<b>usurpation du numéro</b> (« spoofing »). Il connaît déjà son nom et ses données : la victime le croit et valide.'
  },

  debrief: {
    attaquant: 'Le site sert à récolter les données ; l\'appel sert à faire valider les paiements.',
    impact: 'Quand la victime a validé les paiements elle-même, la banque peut contester le remboursement.',
    reflexe: 'Passer soi-même par impots.gouv.fr ; raccrocher et rappeler sa banque sur le numéro connu.'
  }
});
