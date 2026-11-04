/*
 * PARCOURS 7 – Le mail de maintenance de la DSI (légitime)
 * Source : docs/specification.md, « 7. Le mail de maintenance de la DSI ».
 * Détails ajoutés : page intranet de confirmation (bonne réponse), écran « Bien vu »
 * nuancé pour l'option « on signale », écran de ce qui aurait été perdu (règle d'or).
 */
SIMU.enregistrerParcours({
  numero: 7,
  titre: 'Le mail de maintenance de la DSI',
  titreSalle: 'Un mail du service informatique',
  domaine: 'pro',
  nature: 'legitime',
  cible: 'Tout agent',
  duree: '2 min',
  debut: 'e1',

  ecrans: {
    e1: {
      etape: 'É1',
      composant: 'mail',
      donnees: {
        application: 'Messagerie – {{COLLECTIVITE_COURT}}',
        utilisateur: '{{FORMAT_ADRESSE}}@{{DOMAINE_MAIL}}',
        liste: [
          { de: '{{RESPONSABLE_INFO}}', objet: 'Coupure de la messagerie samedi 8 h – 12 h', apercu: 'Aucune action n\'est requise…', heure: 'Lun. 10:05', nonLu: true, selectionne: true },
          { de: 'Ressources humaines', objet: 'Note de service – congés de fin d\'année', apercu: 'Les demandes de congés…', heure: 'Lun. 09:12' },
          { de: 'Accueil', objet: 'Fermeture exceptionnelle vendredi', apercu: 'L\'accueil sera fermé…', heure: 'Ven.' }
        ],
        message: {
          objet: 'Coupure de la messagerie samedi de 8 h à 12 h',
          deNom: '{{RESPONSABLE_INFO}} – {{DSI_NOM}}',
          deAdresse: '[[adresse|{{ADRESSE:RESPONSABLE_INFO}}]]',
          a: 'Tous les agents',
          date: 'Lun. 10:05',
          corps:
            '<p>Bonjour,</p>' +
            '<p>[[avance|La messagerie sera coupée <b>samedi de 8 h à 12 h</b> pour maintenance.]]</p>' +
            '<p>[[action|Aucune action n\'est requise de votre part. Nous ne vous demanderons jamais votre mot de passe.]]</p>' +
            '<p>[[verifiable|Détails sur l\'intranet, référence {{OUTIL_TICKET}} n° 4521.]]</p>' +
            '<p class="signature">{{img:logo-collectivite.png}}<br><b>{{RESPONSABLE_INFO}}</b> · {{DSI_NOM}}<br>{{COLLECTIVITE}} · {{NUMERO_SUPPORT}}</p>'
        }
      },
      indices: {
        adresse:    { type: 'rassurant', etiquette: 'Adresse interne exacte, signature officielle avec le logo' },
        action:     { type: 'rassurant', etiquette: 'Aucune action demandée, aucun lien de connexion' },
        verifiable: { type: 'rassurant', etiquette: 'Information vérifiable sur l\'intranet et au {{NUMERO_SUPPORT}}' },
        avance:     { type: 'rassurant', etiquette: 'Annonce faite à l\'avance, sans urgence' }
      },
      suivant: 'vote'
    },

    vote: {
      type: 'vote',
      question: 'Que fait-on de ce mail ?',
      options: [
        { libelle: 'On le supprime', suivant: 'perte', bon: false },
        { libelle: 'On le signale', suivant: 'signale', bon: false },
        { libelle: 'On le garde', suivant: 'e2', bon: true }
      ],
      suiteQuandMeme: 'perte',
      libelleSuiteQuandMeme: 'Et si on l\'avait supprimé ?'
    },

    e2: {
      etape: 'É2',
      composant: 'navigateur',
      donnees: {
        onglet: 'Intranet – Actualités',
        url: 'intranet.{{DOMAINE_MAIL}}/actualites',
        page:
          '<div class="theme-intranet"><div class="site-entete">{{COLLECTIVITE}} <small>Intranet</small></div>' +
          '<div class="site-corps"><div class="site-carte" style="width:1100px">' +
          '<h2>Maintenance de la messagerie</h2><p><b>Samedi, de 8 h à 12 h</b> : la messagerie sera indisponible.</p>' +
          '<p>Aucune action n\'est requise. Référence {{OUTIL_TICKET}} n° 4521.</p>' +
          '<p class="site-note">Une question ? {{DSI_NOM}} – {{NUMERO_SUPPORT}}</p></div></div></div>'
      },
      suivant: 'bienvu'
    },

    bienvu: {
      type: 'bienvu',
      texte: 'Message légitime : on le garde, il n\'y a rien à faire. L\'intranet confirme la maintenance.',
      suite: 'perte',
      libelleSuite: 'Et si on l\'avait supprimé ?'
    },

    signale: {
      type: 'bienvu',
      titre: 'Prudent, mais pas nécessaire',
      texte: 'Le {{DSI_NOM}} confirmera que le message est légitime. Vérifier, c\'est bien ; ici, tous les signes étaient rassurants.',
      suite: 'perte',
      libelleSuite: 'Et si on l\'avait supprimé ?'
    },

    perte: {
      etape: 'Et si…',
      composant: 'chronologie',
      donnees: {
        titre: 'Si on l\'avait supprimé…',
        etapes: [
          { quand: 'Samedi, 8 h 05', titre: 'Plus de messagerie', texte: 'Sans l\'information, vous croyez à une panne… ou à une attaque.' },
          { quand: 'Samedi, 8 h 15', titre: 'Inquiétude pour rien', texte: 'Vous appelez le support pour une coupure annoncée depuis lundi.', alerte: true }
        ]
      },
      suivant: 'debrief'
    }
  },

  debrief: {
    message: 'Un message légitime informe ; un message malveillant fait agir vite.',
    reflexe: 'En cas de doute, vérifier par un autre canal plutôt que supprimer par réflexe.'
  }
});
