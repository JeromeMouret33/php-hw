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
      coulisses: 'L\'attaquant a acheté un nom de domaine à une lettre près ({{FOURNISSEUR_DOMAINE_PIEGE}} au lieu de {{FOURNISSEUR_DOMAINE}}) : l\'œil glisse dessus. Il connaît la facture : il a lu les marchés publiés, ou piraté la boîte du fournisseur. Le RIB mène à un compte ouvert pour recevoir l\'argent et le faire sortir vite.',
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
            '<div class="rib-ligne"><span>IBAN</span><b class="mono">LT58 9990 0000 4417 2093</b></div>]]' +
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
      coulisses: 'Relance : « Qu\'est-ce qui, dans ce mail, prouve qu\'il vient vraiment du fournisseur ? » Quel que soit le vote, la suite reste visible.',
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
      coulisses: 'Question à poser : « Qui a écrit ce numéro de téléphone ? » Laissez la salle débattre avant de voter.',
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
      coulisses: 'Le complice attend cet appel : il suit un script et remercie même l\'agent d\'être prudent. Un contre-appel ne vaut que si le numéro vient d\'une source connue avant le message. Ici, l\'agent a « vérifié » auprès de l\'escroc lui-même.',
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
      coulisses: 'Le vrai fournisseur n\'est au courant de rien. En plus : le prévenir, car sa boîte mail est peut-être piratée, et alerter le comptable public, comme le prévoit le réflexe.',
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
      coulisses: 'Le comptable public paie le mandat avec les coordonnées que la collectivité lui a transmises : le contrôle du RIB se joue <b>au moment de la demande</b>, côté collectivité. Le compte bénéficiaire sert de relais : l\'argent repart en quelques heures. Plus l\'alerte est rapide (banque, comptable public, plainte), plus on a de chances de bloquer les fonds.',
      etape: 'É3',
      composant: 'chronologie',
      donnees: {
        titre: 'Le RIB est mis à jour…',
        etapes: [
          { quand: 'Jour J', titre: 'Le RIB est modifié', texte: 'La fiche de {{FOURNISSEUR}} est mise à jour, et le mandat de la facture n° 2026-118 part chez le comptable public.' },
          { quand: 'Quelques jours plus tard', titre: 'Le comptable paie', texte: 'Rien ne l\'alerte : <b>18 450 €</b> partent vers l\'IBAN de l\'escroc… et sont retransférés à l\'étranger dans les heures qui suivent.' },
          { quand: '30 jours plus tard', titre: 'Le vrai fournisseur relance', texte: '« Facture n° 2026-118 impayée : merci de régulariser. » La collectivité doit payer une seconde fois.', alerte: true }
        ]
      },
      motsCles: ['DOUBLE PAIEMENT', 'FONDS PERDUS'],
      suivant: 'debrief'
    }
  },

  coulisses: {
    scenario: 'Un agent des finances reçoit un mail de « {{FOURNISSEUR}} » qui annonce un changement de banque. L\'attaquant veut que la prochaine facture soit payée sur son compte à lui.',
    modeOperatoire: 'C\'est une <b>fraude aux faux ordres de virement (FOVI)</b>, contre laquelle la DGFiP met en garde les collectivités. L\'attaquant repère un vrai marché (avis publiés, ou boîte mail du fournisseur piratée), puis imite le fournisseur avec un domaine presque identique. Il fournit un RIB vers un compte qu\'il contrôle et un numéro de téléphone tenu par un complice. Dès le virement reçu, l\'argent est retransféré ailleurs.'
  },

  debrief: {
    attaquant: 'Les sommes partent souvent vers l\'étranger en quelques heures.',
    impact: 'Double paiement : le vrai fournisseur reste à payer, et les fonds versés à l\'escroc sont perdus.',
    variante: 'Plus difficile : le mail vient de la vraie boîte du fournisseur, piratée. Seul le contre-appel la déjoue.',
    reflexe: 'Contre-appel sur des coordonnées déjà connues, factures uniquement via Chorus Pro, alerte immédiate du comptable public et dépôt de plainte.'
  }
});
