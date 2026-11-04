/*
 * CONFIGURATION DE LA COLLECTIVITÉ
 * ================================
 * C'est le SEUL fichier à modifier pour adapter le simulateur à une collectivité.
 * Changez les valeurs entre guillemets ; ne touchez pas aux noms en MAJUSCULES.
 * Les images vont dans le dossier indiqué par « dossierImages » (voir images/LISEZMOI.txt).
 *
 * Collectivité fictive par défaut : Commune de Saint-Exemple.
 *
 * ATTENTION, DÉPÔT PUBLIC : ne committez jamais ce fichier rempli avec les données
 * d'un vrai client. Gardez la version client dans collectivite-<client>.js (ignoré par git)
 * et copiez-la ici seulement sur le poste de l'animateur, le jour de la séance.
 */
window.CONFIG_COLLECTIVITE = {

  variables: {
    // --- Variables de la spécification ---
    COLLECTIVITE:       "Commune de Saint-Exemple",
    COLLECTIVITE_COURT: "Saint-Exemple",
    DOMAINE_MAIL:       "saint-exemple.re",
    DOMAINE_PIEGE:      "saint-exemple-re.com",
    FORMAT_ADRESSE:     "prenom.nom",
    OUTIL_MAIL:         "Outlook",            // Outlook, Gmail ou Zimbra (habillage de la messagerie)
    DGS_PRENOM:         "Marie",
    DGS_NOM:            "Payet",
    MAIRE_NOM:          "Jean Hoarau",
    DSI_NOM:            "Service informatique",
    RESPONSABLE_INFO:   "Paul Grondin",
    PRESTATAIRE_INFO:   "InfoRéunion Services",
    NUMERO_SUPPORT:     "0262 00 00 00 (poste 1234)",
    OUTIL_TICKET:       "GLPI",
    OUTIL_PRISE_EN_MAIN:"TeamViewer",       // outil de prise en main à distance utilisé par le vrai support
    FOURNISSEUR:        "Transports Lagon Bleu",
    SERVICE_FINANCES:   "Direction des finances",
    SERVEUR_FICHIERS:   "\\\\SRV-FICHIERS\\Commun",
    PARKING:            "Parking de l'Hôtel de ville",
    BANQUE_PERSO:       "Crédit de l'Île",

    // --- Ajouts pour le parcours 2 (à valider, voir SUIVI.md) ---
    // Le dossier fournisseur a besoin d'un vrai domaine et d'un vrai numéro
    // à comparer avec ceux du mail piégé. Valeurs fictives.
    FOURNISSEUR_DOMAINE:        "transports-lagonbleu.re",
    FOURNISSEUR_DOMAINE_PIEGE:  "transport-lagonbleu.re",
    FOURNISSEUR_TEL_DOSSIER:    "0262 00 41 10",
    FOURNISSEUR_TEL_PIEGE:      "0693 00 74 52"
  },

  // Dossier des images de la collectivité (logo, photos). Si une image manque,
  // un visuel générique s'affiche à la place.
  dossierImages: "images/",

  // Options de séance
  options: {
    // true : le parcours 1 joue le film (6 séquences, dossier videos/) à la place des écrans É1 à É5
    filmParcours1: false
  },

  // Parcours de la séance : true = proposé dans le menu, false = masqué.
  // Les parcours pas encore développés sont ignorés automatiquement.
  parcoursActifs: {
    1: true,  2: true,  3: true,  4: true,  5: true,  6: true,
    7: true,  8: true,  9: true, 10: true, 11: true, 12: true
  }
};
