/*
 * PARCOURS 2 – Le changement de RIB fournisseur (malveillant) – PILOTE
 * Source : docs/specification.md, section « 2. Le changement de RIB fournisseur ».
 * Détails de réalisme ajoutés (hors spécification) : montant de la facture,
 * IBAN et banque fictifs, mails de remplissage de la boîte, horaires.
 */
SIMU.enregistrerParcours({
  numero: 2,
  titre: 'Le changement de RIB fournisseur',
  titreSalle: 'Un mail de fournisseur',
  domaine: 'pro',
  nature: 'malveillant',
  cible: 'Finances, commande publique, secrétariat',
  duree: '4 min',
  source: 'Mode opératoire n°1 signalé par la DGFiP auprès des collectivités',
  debut: 'e1',

  ecrans: {

    // ---------------------------------------------------------------- É1
    e1: {
      etape: 'É1',
      composant: 'mail',
      donnees: {
        application: 'Messagerie – {{COLLECTIVITE_COURT}}',
        utilisateur: '{{SERVICE_FINANCES}}',
        dossier: 'Boîte de réception',
        liste: [
          { de: '{{FOURNISSEUR}}', objet: 'Changement de coordonnées bancaires', apercu: 'Suite à un changement d\'établissement bancaire…', heure: '09:12', nonLu: true, selectionne: true, pj: true },
          { de: 'Trésorerie de {{COLLECTIVITE_COURT}}', objet: 'Rejet de mandat n° 1842', apercu: 'Pièce justificative manquante, merci de…', heure: '08:47' },
          { de: 'Ressources humaines', objet: 'Calendrier des entretiens annuels', apercu: 'Vous trouverez ci-joint le planning…', heure: 'Hier' },
          { de: '{{RESPONSABLE_INFO}}', objet: 'Rappel : mise à jour des postes', apercu: 'Merci de redémarrer votre poste ce soir…', heure: 'Hier' }
        ],
        message: {
          objet: 'Changement de coordonnées bancaires – facture n° 2026-118',
          deNom: '{{FOURNISSEUR}} – Comptabilité',
          deAdresse: '[[domaine|comptabilite@{{FOURNISSEUR_DOMAINE_PIEGE}}]]',
          a: '{{SERVICE_FINANCES}}',
          date: 'Mar. 09:12',
          piecesJointes: [
            { nom: 'Nouveau_RIB.pdf', taille: '84 Ko', type: 'pdf', ouverte: true },
            { nom: '[[hors-chorus|Facture_2026-118.pdf]]', taille: '212 Ko', type: 'pdf' }
          ],
          corps:
            '<p>Bonjour,</p>' +
            '<p>Suite à un changement d\'établissement bancaire, merci de mettre à jour nos coordonnées. Vous trouverez ci-joint notre nouveau RIB.</p>' +
            '<p>[[urgence|La facture n° 2026-118 reste en attente, merci de procéder rapidement.]]</p>' +
            '<p>Cordialement,</p>' +
            '<p class="signature">Service comptabilité<br><b>{{FOURNISSEUR}}</b><br>[[telephone|Tél. : {{FOURNISSEUR_TEL_PIEGE}}]]</p>'
        },
        apercu: {
          titre: 'Nouveau_RIB.pdf',
          contenu:
            '<div class="doc-rib">' +
            '<div class="rib-titre">RELEVÉ D\'IDENTITÉ BANCAIRE</div>' +
            '<div class="rib-ligne"><span>Titulaire</span><b>{{FOURNISSEUR}}</b></div>' +
            '[[iban|<div class="rib-ligne"><span>Banque</span><b>Nordbank Digital – Vilnius (Lituanie)</b></div>' +
            '<div class="rib-ligne"><span>IBAN</span><b class="mono">LT58 3250 0000 4417 2093</b></div>]]' +
            '<div class="rib-ligne"><span>BIC</span><b class="mono">NRDBLT2XXXX</b></div>' +
            '<div class="rib-note">Merci d\'utiliser exclusivement ces coordonnées pour tout règlement à venir.</div>' +
            '</div>'
        }
      },
      indices: {
        domaine:      { type: 'suspect', etiquette: 'Domaine proche mais différent de celui du dossier fournisseur ({{FOURNISSEUR_DOMAINE}})' },
        iban:         { type: 'suspect', etiquette: 'IBAN dans une néobanque étrangère' },
        'hors-chorus':{ type: 'suspect', etiquette: 'Facture et RIB transmis par mail, hors Chorus Pro' },
        urgence:      { type: 'suspect', etiquette: 'Urgence sur une facture réelle : l\'attaquant connaît le marché' },
        telephone:    { type: 'suspect', etiquette: 'Numéro différent de celui du dossier ({{FOURNISSEUR_TEL_DOSSIER}})' }
      },
      suivant: 'vote1'
    },

    // ---------------------------------------------------------------- Vote 1
    vote1: {
      type: 'vote',
      question: 'Que fait-on de ce mail ?',
      options: [
        { libelle: 'On met à jour le RIB', suivant: 'e3', bon: false },
        { libelle: 'On vérifie d\'abord', suivant: 'vote2', bon: true }
      ],
      suiteQuandMeme: 'e3'
    },

    // ---------------------------------------------------------------- Vote 2
    vote2: {
      type: 'vote',
      question: 'On vérifie. Quel numéro appelle-t-on ?',
      options: [
        { libelle: 'Le numéro indiqué dans le mail<br><span class="vote-detail">{{FOURNISSEUR_TEL_PIEGE}}</span>', suivant: 'e2a', bon: false },
        { libelle: 'Le numéro du dossier fournisseur<br><span class="vote-detail">{{FOURNISSEUR_TEL_DOSSIER}}</span>', suivant: 'e2b', bon: true }
      ],
      suiteQuandMeme: 'e2a'
    },

    // ---------------------------------------------------------------- É2a – branche piège
    e2a: {
      etape: 'É2a',
      composant: 'appel',
      donnees: {
        appelant: '{{FOURNISSEUR}}',
        numero: '{{FOURNISSEUR_TEL_PIEGE}}',
        duree: '00:47',
        contexte: 'Vous appelez le numéro <b>indiqué dans le mail</b>.',
        repliques: [
          { qui: 'agent', texte: 'Bonjour, je vous appelle au sujet de votre changement de coordonnées bancaires.' },
          { qui: 'appelant', texte: 'Oui, tout à fait, nous avons changé de banque le mois dernier. Le RIB joint au mail est le bon.' },
          { qui: 'appelant', texte: 'Merci beaucoup de vérifier, c\'est très prudent de votre part ! Vous pouvez y aller pour la facture 2026-118.' }
        ]
      },
      motsCles: ['COMPLICE'],
      suivant: 'e3'
    },

    // ---------------------------------------------------------------- É2b – bonne branche
    e2b: {
      etape: 'É2b',
      composant: 'appel',
      donnees: {
        appelant: '{{FOURNISSEUR}}',
        numero: '{{FOURNISSEUR_TEL_DOSSIER}}',
        duree: '01:12',
        contexte: 'Vous appelez le numéro <b>du dossier fournisseur</b>, connu avant ce mail.',
        repliques: [
          { qui: 'agent', texte: 'Bonjour, je vous appelle au sujet de votre changement de coordonnées bancaires.' },
          { qui: 'appelant', texte: 'Un changement de banque ? Non, nous n\'avons jamais changé de banque.' },
          { qui: 'appelant', texte: 'Ce mail ne vient pas de chez nous. Surtout, ne modifiez rien !' }
        ]
      },
      suivant: 'bienvu'
    },

    // ---------------------------------------------------------------- Bien vu
    bienvu: {
      type: 'bienvu',
      texte: 'Le contre-appel sur le numéro du dossier fournisseur a déjoué l\'arnaque : le vrai {{FOURNISSEUR}} n\'a jamais changé de banque.',
      suite: 'e2a',
      libelleSuite: 'Et si on avait continué ?'
    },

    // ---------------------------------------------------------------- É3 – conséquence
    e3: {
      etape: 'É3',
      composant: 'chronologie',
      donnees: {
        titre: 'Le RIB est mis à jour…',
        etapes: [
          { quand: 'Jour J', titre: 'Le virement part', texte: 'Les coordonnées de {{FOURNISSEUR}} sont modifiées. La facture n° 2026-118 est payée : <b>18 450 €</b> partent vers l\'IBAN lituanien.' },
          { quand: 'Quelques heures plus tard', titre: 'L\'argent disparaît', texte: 'Les fonds sont retransférés vers l\'étranger. Ils sont désormais introuvables.' },
          { quand: '30 jours plus tard', titre: 'Le vrai fournisseur relance', texte: '« Facture n° 2026-118 impayée : merci de régulariser. » La collectivité doit payer une seconde fois.', alerte: true }
        ]
      },
      motsCles: ['DOUBLE PAIEMENT', 'FONDS PERDUS'],
      suivant: 'debrief'
    }
  },

  debrief: {
    attaquant: 'Les sommes partent souvent vers l\'étranger en quelques heures.',
    impact: 'Double paiement : le vrai fournisseur reste à payer, et les fonds versés à l\'escroc sont perdus.',
    variante: 'Plus difficile : le mail vient de la vraie boîte du fournisseur, piratée. Seul le contre-appel la déjoue.',
    reflexe: 'Contre-appel sur des coordonnées déjà connues, factures uniquement via Chorus Pro, alerte immédiate du comptable public et dépôt de plainte.'
  }
});
