/*
 * PARCOURS 3 – La fraude au président par messagerie (malveillant)
 * Source : docs/specification.md, « 3. La fraude au président par messagerie ».
 * Détails de réalisme ajoutés : numéro inconnu, montant de l'acompte,
 * écran de rappel au vrai DGS (bonne branche), numéro de « Maître Lebon ».
 */
SIMU.enregistrerParcours({
  numero: 3,
  titre: 'La fraude au président par messagerie',
  titreSalle: 'Un message de la direction',
  domaine: 'pro',
  nature: 'malveillant',
  cible: 'Assistants de direction, finances, RH',
  duree: '3 min',
  source: 'Escroquerie la plus répandue dans les administrations territoriales selon La Banque Postale',
  debut: 'e1',

  ecrans: {
    e1: {
      etape: 'É1',
      composant: 'smartphone',
      donnees: {
        mode: 'whatsapp',
        contact: '[[numero|+262 693 00 31 08]]',
        avatar: 'photo-dgs.jpg',
        heure: '10:12',
        messages: [
          { de: 'info', texte: 'Ce numéro ne figure pas dans vos contacts' },
          { de: 'eux', texte: '[[ton|Bonjour, tu es disponible ?]]', heure: '10:11' },
          { de: 'eux', texte: 'Je suis en réunion à la préfecture, [[appel|je ne peux pas parler]]. J\'ai besoin d\'un service discret.', heure: '10:11' }
        ],
        contexte: '<p>La photo de profil est celle de <b>{{DGS_PRENOM}} {{DGS_NOM}}</b>, DGS de {{COLLECTIVITE_COURT}}.</p>'
      },
      indices: {
        numero: { type: 'suspect', etiquette: 'Nouveau numéro, photo récupérée sur le site de la collectivité' },
        ton:    { type: 'suspect', etiquette: 'Ton inhabituel (tutoiement, formules vagues)' },
        appel:  { type: 'suspect', etiquette: 'Impossible d\'appeler (« en réunion »)' }
      },
      suivant: 'e2'
    },

    e2: {
      etape: 'É2',
      composant: 'smartphone',
      donnees: {
        mode: 'whatsapp',
        contact: '+262 693 00 31 08',
        avatar: 'photo-dgs.jpg',
        heure: '10:14',
        messages: [
          { de: 'eux', texte: 'Je suis en réunion à la préfecture, je ne peux pas parler. J\'ai besoin d\'un service discret.', heure: '10:11' },
          { de: 'moi', texte: 'Oui bien sûr, de quoi avez-vous besoin ?', heure: '10:12' },
          { de: 'eux', texte: 'Il faut régler en urgence un acompte de 24 800 € à un cabinet pour une opération confidentielle. Je t\'envoie le RIB. [[secret|N\'en parle à personne, pas même aux finances.]]', heure: '10:13' },
          { de: 'eux', texte: '[[flatterie|Je compte sur toi, tu es la seule personne de confiance.]]', heure: '10:13' }
        ],
        contexte: '<p>Variante fréquente : acheter des <b>cartes cadeaux</b> « pour les agents méritants ».</p>'
      },
      indices: {
        secret:    { type: 'suspect', etiquette: 'Secret demandé, contournement du circuit de la dépense' },
        flatterie: { type: 'suspect', etiquette: 'Flatterie (« tu es la seule personne de confiance »)' }
      },
      suivant: 'vote'
    },

    vote: {
      type: 'vote',
      question: 'Que fait-on ?',
      options: [
        { libelle: 'On s\'exécute', suivant: 'e3', bon: false },
        { libelle: 'On rappelle {{DGS_PRENOM}} {{DGS_NOM}} sur son numéro habituel', suivant: 'e2b', bon: true }
      ],
      suiteQuandMeme: 'e3'
    },

    e2b: {
      etape: 'É2 bis',
      composant: 'appel',
      donnees: {
        appelant: '{{DGS_PRENOM}} {{DGS_NOM}}',
        numero: 'Numéro habituel (annuaire)',
        duree: '00:38',
        contexte: 'Vous appelez le DGS sur son <b>numéro connu</b>.',
        repliques: [
          { qui: 'agent', texte: 'Vous m\'avez demandé un acompte de 24 800 € sur WhatsApp ?' },
          { qui: 'appelant', texte: 'Pas du tout, je suis dans mon bureau ! C\'est une arnaque : ne paie rien et préviens les finances.' }
        ]
      },
      suivant: 'bienvu'
    },

    bienvu: {
      type: 'bienvu',
      texte: 'Un simple appel sur le numéro habituel du DGS a suffi : il n\'a jamais rien demandé.',
      suite: 'e3'
    },

    e3: {
      etape: 'É3',
      composant: 'appel',
      donnees: {
        statut: 'entrant',
        appelant: 'Maître Lebon – Avocat',
        numero: '01 99 00 27 41',
        contexte: 'Quelques minutes plus tard, un appel arrive.',
        repliques: [
          { qui: 'appelant', texte: 'Maître Lebon, l\'avocat chargé de l\'opération. Le DGS vous a prévenu ?' },
          { qui: 'appelant', texte: 'Le virement doit partir avant midi, sinon l\'opération est perdue, et c\'est vous qui en porterez la responsabilité.' }
        ]
      },
      motsCles: ['PRESSION'],
      suivant: 'debrief'
    }
  },

  debrief: {
    attaquant: 'L\'escroc s\'appuie sur l\'organigramme et l\'agenda publics de la collectivité. Si l\'agent hésite, un faux avocat rappelle pour mettre la pression.',
    reflexe: 'Rappeler la personne sur son numéro connu, aucune dérogation au circuit de validation, même pour un élu ou le DGS.'
  }
});
