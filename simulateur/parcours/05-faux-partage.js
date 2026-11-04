/*
 * PARCOURS 5 – Le faux partage de document (malveillant)
 * Source : docs/specification.md, « 5. Le faux partage de document ».
 * Détails de réalisme ajoutés : adresse d'expédition sur {{DOMAINE_PIEGE}} (variable
 * prévue par la spécification pour ce parcours), adresse exacte du lien, code de
 * double authentification, règle de transfert, nombre de contacts.
 */
SIMU.enregistrerParcours({
  numero: 5,
  titre: 'Le faux partage de document',
  titreSalle: 'Un document partagé',
  domaine: 'pro',
  nature: 'malveillant',
  cible: 'Tout agent',
  duree: '3 min',
  source: 'Hameçonnage d\'identifiants Microsoft 365 avec contournement de la double authentification',
  debut: 'e1',

  ecrans: {
    e1: {
      coulisses: 'L\'attaquant a choisi un expéditeur crédible (le DGS) et un document tentant (le budget). Le mail imite une notification de partage, comme les agents en reçoivent tous les jours : on clique par habitude. Le lien mène vers un domaine que l\'attaquant a enregistré.',
      etape: 'É1',
      composant: 'mail',
      donnees: {
        application: 'Messagerie – {{COLLECTIVITE_COURT}}',
        utilisateur: '{{FORMAT_ADRESSE}}@{{DOMAINE_MAIL}}',
        liste: [
          { de: '{{DGS_PRENOM}} {{DGS_NOM}}', objet: 'a partagé « Deliberation_budget_2027.pdf »', apercu: 'Document urgent à consulter…', heure: '15:47', nonLu: true, selectionne: true },
          { de: 'Ressources humaines', objet: 'Note de service – congés de fin d\'année', apercu: 'Les demandes de congés…', heure: '14:10' },
          { de: 'Accueil', objet: 'Colis arrivé pour votre service', apercu: 'Un colis vous attend…', heure: '11:32' }
        ],
        message: {
          objet: '{{DGS_PRENOM}} {{DGS_NOM}} vous a partagé « Deliberation_budget_2027.pdf »',
          deNom: '{{DGS_PRENOM}} {{DGS_NOM}} (via partage)',
          deAdresse: 'partage@{{DOMAINE_PIEGE}}',
          a: '{{FORMAT_ADRESSE}}@{{DOMAINE_MAIL}}',
          date: '15:47',
          corps:
            '<p>{{DGS_PRENOM}} {{DGS_NOM}} a partagé un fichier avec vous.</p>' +
            '<p style="font-size:30px">📄 <b>Deliberation_budget_2027.pdf</b></p>' +
            '<p>[[urgence|Document urgent à consulter avant 17 h.]]</p>' +
            '<p><span class="btn-mail">Ouvrir le document</span></p>'
        },
        barreEtat: '[[lien|https://partage-docs.cloud-securise.app/d/8f3k2x]]'
      },
      indices: {
        lien:    { type: 'suspect', etiquette: 'Au survol, le lien pointe vers un domaine sans rapport avec Microsoft ni {{DOMAINE_MAIL}}' },
        urgence: { type: 'suspect', etiquette: 'Document « urgent à consulter avant 17 h »' }
      },
      suivant: 'e2'
    },

    e2: {
      coulisses: 'Derrière cette page, le serveur de l\'attaquant affiche en direct la vraie page de connexion Microsoft, qu\'il relaie. C\'est pour ça qu\'elle est si réaliste : ce sont les vrais écrans, parfois avec l\'habillage de la collectivité. Seule l\'adresse dans la barre trahit le relais (on y arrive après une redirection depuis le lien du mail).',
      etape: 'É2',
      composant: 'navigateur',
      donnees: {
        onglet: 'Connectez-vous à votre compte',
        url: '[[adresse|login-microsoftonline.docs-securise.app]]/common/oauth2',
        page:
          '<div class="theme-connexion"><div class="site-carte">' +
          '<h2>Connexion</h2><p>Pour consulter « Deliberation_budget_2027.pdf », confirmez votre identité.</p>' +
          '<div class="site-champ"><label>Adresse e-mail</label><div>{{FORMAT_ADRESSE}}@{{DOMAINE_MAIL}}</div></div>' +
          '<div class="site-champ">[[motdepasse|<label>Mot de passe</label><div class="vide">••••••••</div>]]</div>' +
          '<span class="site-btn neutre">Se connecter</span></div></div>'
      },
      indices: {
        adresse:    { type: 'suspect', etiquette: 'Adresse de la page dans la barre du navigateur' },
        motdepasse: { type: 'suspect', etiquette: 'On redemande le mot de passe alors qu\'on est déjà connecté' }
      },
      suivant: 'vote'
    },

    vote: {
      coulisses: 'Relance : « Si on vous partage vraiment un document, où le retrouvez-vous sans cliquer sur ce lien ? » Quel que soit le vote, la suite reste visible.',
      type: 'vote',
      question: 'Que fait-on ?',
      options: [
        { libelle: 'On se connecte', suivant: 'e3', bon: false },
        { libelle: 'On ferme, et on ouvre OneDrive directement', suivant: 'bienvu', bon: true }
      ],
      suiteQuandMeme: 'e3'
    },

    bienvu: {
      type: 'bienvu',
      texte: 'En ouvrant OneDrive soi-même, on constate qu\'aucun document n\'a été partagé. Le mot de passe reste à l\'abri.',
      suite: 'e3'
    },

    e3: {
      coulisses: 'Le code saisi part aussitôt vers la vraie page Microsoft, par le relais. Microsoft valide la connexion et remet un <b>cookie de session</b> : l\'attaquant le copie. Avec ce cookie, son navigateur est reconnu comme déjà connecté : plus besoin du mot de passe ni du code.',
      etape: 'É3',
      composant: 'navigateur',
      donnees: {
        onglet: 'Vérification en deux étapes',
        url: 'login-microsoftonline.docs-securise.app/common/mfa',
        page:
          '<div class="theme-connexion"><div class="site-carte">' +
          '<h2>Vérification en deux étapes</h2><p>Saisissez le code reçu sur votre téléphone.</p>' +
          '<div class="site-champ"><label>Code</label><div style="letter-spacing:12px;font-size:34px">482 917</div></div>' +
          '<span class="site-btn neutre">Vérifier</span></div>' +
          '<div class="site-carte" style="width:560px;margin-left:40px;border-top:10px solid #d7191c">' +
          '<h2>Pendant ce temps…</h2><p>L\'attaquant saisit <b>ce même code</b> sur la vraie page de connexion.</p><p>Il est connecté à votre compte.</p></div></div>'
      },
      motsCles: ['SESSION VOLÉE'],
      suivant: 'e4'
    },

    e4: {
      coulisses: 'L\'attaquant crée une règle de transfert discrète, nommée « . » pour passer inaperçue dans la liste : il continue de lire les mails, même si l\'agent change de mot de passe. Puis il renvoie le piège depuis le vrai compte, car les contacts font confiance à un expéditeur connu. Il faut changer le mot de passe, fermer les sessions et supprimer la règle.',
      etape: 'É4',
      composant: 'mail',
      donnees: {
        application: 'Messagerie – {{COLLECTIVITE_COURT}}',
        utilisateur: '{{FORMAT_ADRESSE}}@{{DOMAINE_MAIL}}',
        dossier: 'Éléments envoyés',
        compteur: '312 envoyés',
        liste: [
          { de: 'À : Tous mes contacts', objet: 'Je vous ai partagé « Deliberation_budget_2027.pdf »', apercu: 'Document urgent à consulter…', heure: '16:02', selectionne: true },
          { de: 'À : Trésorerie', objet: 'Je vous ai partagé « Deliberation_budget_2027.pdf »', apercu: 'Document urgent à consulter…', heure: '16:02' },
          { de: 'À : Prestataires', objet: 'Je vous ai partagé « Deliberation_budget_2027.pdf »', apercu: 'Document urgent à consulter…', heure: '16:02' },
          { de: 'À : Élus', objet: 'Je vous ai partagé « Deliberation_budget_2027.pdf »', apercu: 'Document urgent à consulter…', heure: '16:01' }
        ],
        message: {
          objet: 'Règle créée sur votre boîte, en silence',
          deNom: 'Paramètres › Règles de la boîte de réception',
          deAdresse: '{{FORMAT_ADRESSE}}@{{DOMAINE_MAIL}}',
          a: '—',
          date: '16:00',
          corps: '<p><b>Règle « . »</b></p><p>Transférer tous les messages reçus vers <b>archives-7731@relais-courrier.net</b></p><p>puis les marquer comme lus.</p><p>Ensuite, le même faux partage part à <b>tous vos contacts</b>, depuis <b>votre vrai compte</b>.</p>'
        }
      },
      motsCles: ['REBOND', 'VOTRE NOM'],
      suivant: 'debrief'
    }
  },

  coulisses: {
    scenario: 'Un agent reçoit un faux partage de document au nom du DGS. L\'attaquant veut prendre le contrôle de son compte Microsoft 365, malgré la double authentification, pour s\'en servir contre la collectivité et ses contacts.',
    modeOperatoire: 'C\'est un hameçonnage <b>« adversary-in-the-middle »</b> (l\'attaquant au milieu). La fausse page n\'est pas une simple copie : c\'est un <b>relais</b> placé entre l\'agent et la vraie page Microsoft. Tout ce que l\'agent saisit (identifiant, mot de passe, puis code) est transmis en direct à Microsoft, qui renvoie un <b>cookie de session</b>. L\'attaquant garde ce cookie et ouvre la boîte mail sans plus avoir besoin ni du mot de passe ni du code.'
  },

  debrief: {
    attaquant: 'L\'attaquant rejoue le code en direct, crée une règle de transfert en silence, puis envoie le même faux partage à tous les contacts, depuis le vrai compte de l\'agent.',
    message: 'La double authentification ne protège pas si on saisit le code sur une fausse page.',
    reflexe: 'Ouvrir les documents depuis l\'application ou l\'intranet, jamais via le lien d\'un mail inattendu ; en cas de doute, signaler au {{DSI_NOM}}.'
  }
});
