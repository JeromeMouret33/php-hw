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
      coulisses: 'L\'escroc ne connaît ni votre prénom ni celui de votre enfant : il écrit « maman » et attend. « Nouveau numéro » prépare le terrain : il explique pourquoi le contact n\'est pas enregistré.',
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
      coulisses: 'Le refus d\'appel est le point clé : à la voix, l\'arnaque tomberait. L\'urgence et la promesse « je te rembourse demain » empêchent de réfléchir. Le RIB au nom d\'un inconnu est un signal fort.',
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
      coulisses: 'Relance : « Que pourriez-vous demander que seul votre enfant sait ? » « On fait le virement » montre l\'appel du soir ; « on appelle » montre que l\'ancien numéro marche, et la suite reste visible.',
      type: 'vote',
      question: 'Que fait-on ?',
      options: [
        { libelle: 'On fait le virement', suivant: 'e3', bon: false },
        { libelle: 'On appelle l\'enfant sur son ancien numéro, ou on pose une question personnelle', suivant: 'e3bon', bon: true }
      ],
      suiteQuandMeme: 'e3'
    },

    e3bon: {
      coulisses: 'Un simple appel sur le numéro connu suffit : l\'enfant répond, rien n\'est cassé. L\'escroc n\'a aucun moyen d\'empêcher cette vérification, c\'est pour ça qu\'il insiste sur l\'écrit.',
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
      coulisses: 'Le virement est parti vers le compte d\'un tiers. L\'escroc a peut-être déjà transféré l\'argent ailleurs. Seul réflexe utile maintenant : prévenir sa banque immédiatement et porter plainte.',
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

  coulisses: {
    scenario: 'Un parent reçoit un message d\'un « enfant » qui aurait changé de numéro. L\'escroc veut obtenir un <b>virement rapide</b>, avant toute vérification.',
    modeOperatoire: 'Le message « Coucou maman » est envoyé <b>en masse</b> : l\'escroc ne sait pas si vous avez des enfants, il attend que quelqu\'un réponde. Il refuse tout appel vocal pour ne pas être démasqué. Le RIB fourni appartient à un tiers, souvent un intermédiaire qui fait suivre l\'argent. Une fois le virement parti, le récupérer est très difficile.'
  },

  debrief: {
    attaquant: 'L\'escroc mise sur l\'émotion et l\'urgence ; il envoie le même message à des milliers de numéros.',
    reflexe: 'Appeler la personne par un canal connu avant tout paiement.'
  }
});
