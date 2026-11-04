/*
 * PARCOURS 4 – La visio truquée (malveillant)
 * Source : docs/specification.md, « 4. La visio truquée ».
 * Aucun vrai trucage de visage : les photos de la collectivité sont seulement
 * figées, puis dégradées par un filtre visuel.
 * Détails de réalisme ajoutés : adresse extérieure de l'invitation, horaire,
 * montant demandé, noms des « conseillers », messages de la conversation.
 */
SIMU.enregistrerParcours({
  numero: 4,
  titre: 'La visio truquée',
  titreSalle: 'Une réunion en visio',
  domaine: 'pro',
  nature: 'malveillant',
  cible: 'Direction, finances',
  duree: '3 min',
  source: 'Cas réel Arup, Hong Kong, 2024 (CNN, 16/05/2024 ; South China Morning Post)',
  debut: 'e1',

  ecrans: {
    e1: {
      coulisses: 'L\'adresse est extérieure, mais l\'attaquant y affiche le nom du maire : c\'est ce que l\'œil lit en premier. Le prétexte « acquisition foncière confidentielle » justifie le secret, et le paiement au notaire un gros montant. La réunion est fixée le jour même, pour laisser peu de temps à la réflexion.',
      etape: 'É1',
      composant: 'mail',
      donnees: {
        application: 'Messagerie – {{COLLECTIVITE_COURT}}',
        utilisateur: '{{SERVICE_FINANCES}}',
        liste: [
          { de: '{{MAIRE_NOM}}', objet: 'Réunion confidentielle – acquisition foncière', apercu: 'Invitation : aujourd\'hui 14 h 00', heure: '11:02', nonLu: true, selectionne: true },
          { de: 'Commande publique', objet: 'Ouverture des plis – lot 3', apercu: 'La commission se réunira…', heure: '10:21' },
          { de: 'Trésorerie de {{COLLECTIVITE_COURT}}', objet: 'Situation de trésorerie', apercu: 'Veuillez trouver ci-joint…', heure: 'Hier' }
        ],
        message: {
          objet: 'Réunion confidentielle – acquisition foncière',
          deNom: '{{MAIRE_NOM}}',
          deAdresse: '[[adresse|cabinet.maire@reunion-visio.net]]',
          a: '{{SERVICE_FINANCES}}',
          date: '11:02',
          invitation: { jour: 'AUJ.', titre: 'Réunion confidentielle – acquisition foncière', quand: 'Aujourd\'hui, 14 h 00 – 14 h 30', organisateur: 'Organisateur : {{MAIRE_NOM}}' },
          corps: '<p>Merci de vous connecter à 14 h. Le sujet est strictement confidentiel jusqu\'au prochain conseil.</p><p>{{MAIRE_NOM}}</p>'
        }
      },
      indices: {
        adresse: { type: 'suspect', etiquette: 'Invitation depuis une adresse extérieure à {{DOMAINE_MAIL}}' }
      },
      suivant: 'e2'
    },

    e2: {
      coulisses: 'L\'imitation est fragile en direct : elle supporte mal les gestes imprévus et les questions inattendues. D\'où un maire qui parle peu, une demande écrite dans la conversation et une coupure réseau invoquée au bon moment. Les « conseillers » meublent l\'écran pour rendre la réunion crédible.',
      etape: 'É2',
      composant: 'visio',
      donnees: {
        titre: 'Réunion confidentielle – acquisition foncière',
        duree: '06:18',
        participants: [
          { nom: '{{MAIRE_NOM}}', image: 'photo-maire.jpg', etat: 'fige', parle: true, indice: 'fige' },
          { nom: '{{DGS_PRENOM}} {{DGS_NOM}}', image: 'photo-dgs.jpg' },
          { nom: 'Conseiller juridique', image: 'conseiller-1.jpg' },
          { nom: 'Conseiller financier', image: 'conseiller-2.jpg' }
        ],
        chat: [
          { de: '{{MAIRE_NOM}}', texte: '[[demande|Le notaire de l\'acquisition a changé de banque : mettez à jour son RIB aujourd\'hui, le paiement de 480 000 € part demain. Confidentialité absolue jusqu\'au conseil.]]' },
          { de: 'Vous', texte: 'L\'étude notariale a-t-elle confirmé ce changement ?' },
          { de: '{{MAIRE_NOM}}', texte: '[[question|Le réseau coupe… Le conseiller financier vous envoie le RIB.]]' }
        ],
        bandeau: 'Connexion instable'
      },
      indices: {
        fige:     { type: 'suspect', etiquette: 'Image légèrement figée, lèvres décalées, « problème de réseau » invoqué' },
        question: { type: 'suspect', etiquette: 'Personne ne répond à une question imprévue' },
        demande:  { type: 'suspect', etiquette: 'Montant important, urgence, confidentialité' }
      },
      suivant: 'vote'
    },

    vote: {
      coulisses: 'Relance : « Quelle question seul le vrai maire saurait-il trancher ? » Quel que soit le vote, la suite reste visible.',
      type: 'vote',
      question: 'Que fait-on ?',
      options: [
        { libelle: 'On met à jour le RIB du notaire', suivant: 'e3', bon: false },
        { libelle: 'On pose une question de contrôle et on rappelle', suivant: 'bienvu', bon: true }
      ],
      suiteQuandMeme: 'e3'
    },

    bienvu: {
      type: 'bienvu',
      texte: 'Une question imprévue, puis un rappel par un autre canal : l\'imitation ne résiste pas.',
      suite: 'e3'
    },

    e3: {
      coulisses: 'Ici, la dégradation est mise en scène pour que la salle voie le trucage. Dans la réalité, rien ne se dégrade à l\'écran : la victime découvre l\'escroquerie après coup, en parlant au vrai maire. Seule la procédure (rappel, double validation) protège.',
      etape: 'É3',
      composant: 'visio',
      donnees: {
        titre: 'Réunion confidentielle – acquisition foncière',
        duree: '07:02',
        participants: [
          { nom: '{{MAIRE_NOM}}', image: 'photo-maire.jpg', etat: 'degrade' },
          { nom: '{{DGS_PRENOM}} {{DGS_NOM}}', image: 'photo-dgs.jpg', etat: 'degrade' },
          { nom: 'Conseiller juridique', image: 'conseiller-1.jpg', etat: 'degrade' },
          { nom: 'Conseiller financier', image: 'conseiller-2.jpg', etat: 'degrade' }
        ],
        chat: [{ de: 'Conseiller financier', texte: 'Nouveau RIB du notaire : LT77 9990 0000 9921 4410' }]
      },
      motsCles: ['IMITATION PAR IA'],
      suivant: 'debrief'
    }
  },

  coulisses: {
    scenario: 'Un agent des finances est invité à une visio « confidentielle » avec le maire et le DGS. On lui demande de changer en urgence le RIB du notaire d\'une acquisition, juste avant le paiement. Les visages et les voix sont imités.',
    modeOperatoire: 'L\'attaquant utilise des outils d\'IA qui imitent un visage et une voix à partir de vidéos publiques (conseil municipal diffusé en ligne, interviews). Il peut s\'agir de séquences préparées à l\'avance ou d\'imitations en direct, encore imparfaites : d\'où les excuses de « mauvais réseau ». C\'est le scénario du cas Arup à Hong Kong en 2024, où les autres participants de la visio étaient des imitations.'
  },

  debrief: {
    attaquant: 'Quelques minutes de vidéo publique (conseil municipal en ligne) suffisent pour imiter un visage et une voix.',
    message: 'En 2024 à Hong Kong, un employé du groupe Arup a fait 15 virements, environ 200 millions de dollars de Hong Kong (près de 25 millions de dollars américains), après une visio où le directeur financier et des collègues étaient des imitations générées par IA. Arup l\'a confirmé en mai 2024.',
    reflexe: 'Rappeler par un autre canal, double validation pour tout virement inhabituel, mot de passe convenu en interne pour les demandes sensibles.'
  }
});
