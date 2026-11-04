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
      coulisses: 'Créer un compte WhatsApp avec la photo du DGS ne demande qu\'un numéro de téléphone et une image trouvée en ligne. L\'excuse « en réunion » empêche l\'appel qui ferait tomber l\'imitation. Le premier message est volontairement vague : l\'escroc teste si l\'agent répond.',
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
      coulisses: 'Une fois la conversation engagée, l\'escroc pose la vraie demande. Un agent ne peut pas payer seul : il demande donc de <b>faire passer</b> le paiement sans les pièces habituelles (« je signerai après »). Le secret isole l\'agent. Variante fréquente : les cartes cadeaux, payées de sa poche « je te rembourse », dont les codes se dépensent en quelques minutes.',
      etape: 'É2',
      composant: 'smartphone',
      donnees: {
        mode: 'whatsapp',
        contact: '+262 693 00 31 08',
        avatar: 'photo-dgs.jpg',
        heure: '10:14',
        messages: [
          { de: 'moi', texte: 'Oui bien sûr, de quoi avez-vous besoin ?', heure: '10:12' },
          { de: 'eux', texte: '<span class="cle">Il faut faire passer en urgence un acompte de 24 800 € à un cabinet</span>, pour une opération confidentielle. Je t\'envoie le RIB : prépare le paiement aujourd\'hui, je signerai les pièces après. [[secret|N\'en parle à personne, même pas à ton chef de service.]]', heure: '10:13' },
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
      coulisses: 'Relance : « Si c\'était vraiment le DGS, qu\'est-ce que ça coûterait de l\'appeler ? » Quel que soit le vote, la suite reste visible.',
      type: 'vote',
      question: 'Que fait-on ?',
      options: [
        { libelle: 'On s\'exécute', suivant: 'e3', bon: false },
        { libelle: 'On rappelle {{DGS_PRENOM}} {{DGS_NOM}} sur son numéro habituel', suivant: 'e2b', bon: true }
      ],
      suiteQuandMeme: 'e3'
    },

    e2b: {
      coulisses: 'Le DGS est dans son bureau : un contre-appel sur le numéro de l\'annuaire suffit. Il faut aussi prévenir les finances : d\'autres collègues ont peut-être reçu le même message.',
      etape: 'É2 bis',
      composant: 'appel',
      donnees: {
        appelant: '{{DGS_PRENOM}} {{DGS_NOM}}',
        numero: 'Numéro habituel (annuaire)',
        duree: '00:38',
        contexte: 'Vous appelez le DGS sur son <b>numéro connu</b>.',
        repliques: [
          { qui: 'agent', texte: 'Vous m\'avez demandé de faire passer un acompte de 24 800 € sur WhatsApp ?' },
          { qui: 'appelant', texte: 'Pas du tout, je suis dans mon bureau ! C\'est une arnaque : ne payez rien et prévenez les finances.' }
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
      coulisses: 'Le faux avocat sert à relancer un agent qui hésite, ou à réclamer un second virement. Il invoque l\'urgence et menace l\'agent d\'en porter la responsabilité. Un titre d\'avocat annoncé au téléphone ne prouve rien.',
      etape: 'É3',
      composant: 'appel',
      donnees: {
        statut: 'entrant',
        appelant: 'Maître Lebon – Avocat',
        numero: '01 99 00 27 41',
        contexte: 'Quelques minutes plus tard, un appel arrive.',
        repliques: [
          { qui: 'appelant', texte: 'Maître Lebon, l\'avocat chargé de l\'opération. Le DGS vous a prévenu ?' },
          { qui: 'appelant', texte: 'Le paiement doit passer avant midi, sinon l\'opération est perdue, et c\'est vous qui en porterez la responsabilité.' }
        ]
      },
      motsCles: ['PRESSION'],
      suivant: 'debrief'
    }
  },

  coulisses: {
    scenario: 'Un agent des finances ou de la direction reçoit un WhatsApp au nom du DGS, {{DGS_PRENOM}} {{DGS_NOM}}. L\'escroc veut faire passer un paiement <b>en contournant le circuit de la dépense</b> (« je signerai les pièces après »), ou obtenir des cartes cadeaux.',
    modeOperatoire: 'C\'est la <b>fraude au président</b>, une forme de FOVI. L\'escroc se prépare avec des informations publiques : organigramme, photos, agenda publiés sur le site ou les réseaux sociaux. Il crée un compte de messagerie avec la photo du dirigeant, choisit un moment où celui-ci est injoignable, puis joue sur l\'autorité, le secret et la flatterie. Un faux avocat rappelle ensuite pour maintenir la pression.'
  },

  debrief: {
    attaquant: 'L\'escroc s\'appuie sur l\'organigramme et l\'agenda publics de la collectivité. Si l\'agent hésite, un faux avocat rappelle pour mettre la pression.',
    reflexe: 'Rappeler la personne sur son numéro connu, aucune dérogation au circuit de validation, même pour un élu ou le DGS.'
  }
});
