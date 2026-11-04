/*
 * PARCOURS 10 – « Bonjour maman » (malveillant)
 * Source : docs/specification.md, « 10. Bonjour maman ».
 * La révélation (É3) existe en deux versions : après un paiement (mauvaise branche)
 * et sans paiement (bonne branche, suivie de « Bien vu »).
 * Détails de réalisme ajoutés : numéro (plage fictive), titulaire du RIB, répliques.
 */
SIMU.enregistrerParcours({
  numero: 10,
  titre: '« Bonjour maman »',
  titreSalle: 'Un message d\'un proche',
  domaine: 'perso',
  nature: 'malveillant',
  cible: 'Tout agent parent',
  duree: '2 min',
  debut: 'e1',

  ecrans: {
    e1: {
      etape: 'É1',
      composant: 'smartphone',
      donnees: {
        mode: 'whatsapp',
        contact: '+33 6 39 98 55 03',
        heure: '20:14',
        messages: [
          { de: 'info', texte: 'Ce numéro ne figure pas dans vos contacts' },
          { de: 'eux', texte: '[[prenom|Coucou maman, j\'ai cassé mon téléphone, c\'est mon nouveau numéro, enregistre-le]] 😘', heure: '20:13' }
        ]
      },
      indices: {
        prenom: { type: 'suspect', etiquette: 'Pas de prénom, nouveau numéro' }
      },
      suivant: 'e2'
    },

    e2: {
      etape: 'É2',
      composant: 'smartphone',
      donnees: {
        mode: 'whatsapp',
        contact: '+33 6 39 98 55 03',
        heure: '20:21',
        messages: [
          { de: 'moi', texte: 'Ah mince ! Je t\'appelle ?', heure: '20:15' },
          { de: 'eux', texte: '[[vocal|Non, le micro est cassé, je peux pas parler]]', heure: '20:16' },
          { de: 'eux', texte: '[[urgence|J\'ai une facture urgente, mon appli bancaire ne marche pas sur ce téléphone, tu peux faire un virement de 980 € ? Je te rembourse demain.]]', heure: '20:18' },
          { de: 'eux', texte: 'RIB : [[tiers|M. D. KOVAL]] · FR76 3000 0000 0000 1234 5678 900', heure: '20:20' }
        ]
      },
      indices: {
        vocal:   { type: 'suspect', etiquette: 'Refus d\'un appel vocal (« micro cassé »)' },
        urgence: { type: 'suspect', etiquette: 'Urgence, et un virement à faire tout de suite' },
        tiers:   { type: 'suspect', etiquette: 'RIB au nom d\'un tiers' }
      },
      suivant: 'vote'
    },

    vote: {
      type: 'vote',
      question: 'Que fait-on ?',
      options: [
        { libelle: 'On fait le virement', suivant: 'e3', bon: false },
        { libelle: 'On appelle l\'enfant sur son ancien numéro, ou on pose une question personnelle', suivant: 'e3bon', bon: true }
      ],
      suiteQuandMeme: 'e3'
    },

    e3bon: {
      etape: 'É3',
      composant: 'appel',
      donnees: {
        appelant: 'Mon enfant',
        numero: 'Ancien numéro (contact enregistré)',
        duree: '00:21',
        contexte: 'Vous appelez votre enfant sur son <b>ancien numéro</b>.',
        repliques: [
          { qui: 'appelant', texte: 'Allô ? Non, je n\'ai rien cassé, mon téléphone marche très bien ! Pourquoi ?' }
        ]
      },
      motsCles: ['USURPATION'],
      suivant: 'bienvu'
    },

    bienvu: {
      type: 'bienvu',
      texte: 'Un appel sur l\'ancien numéro a suffi : votre enfant n\'a jamais changé de téléphone.',
      suite: 'e3',
      libelleSuite: 'Et si on avait payé ?'
    },

    e3: {
      etape: 'É3',
      composant: 'appel',
      donnees: {
        appelant: 'Mon enfant',
        numero: 'Ancien numéro (contact enregistré)',
        duree: '00:34',
        contexte: 'Le virement de 980 € est parti. Le soir, vous appelez votre enfant sur son <b>ancien numéro</b>.',
        repliques: [
          { qui: 'agent', texte: 'Tu as bien reçu les 980 € ?' },
          { qui: 'appelant', texte: 'Quels 980 € ? Je n\'ai rien cassé, et je ne t\'ai rien demandé !' }
        ]
      },
      motsCles: ['USURPATION'],
      suivant: 'debrief'
    }
  },

  debrief: {
    attaquant: 'L\'escroc mise sur l\'émotion et l\'urgence ; il envoie le même message à des milliers de numéros.',
    reflexe: 'Appeler la personne par un canal connu avant tout paiement.'
  }
});
