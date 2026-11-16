/*
 * CONFIGURATION DE LA COLLECTIVITÉ
 * ================================
 * C'est le SEUL fichier à modifier pour adapter le simulateur à une collectivité.
 * Changez les valeurs entre guillemets ; ne touchez pas aux noms en MAJUSCULES.
 * Les images vont dans le dossier indiqué par « dossierImages » (voir images/LISEZMOI.txt).
 *
 * Collectivité fictive par défaut : Commune de Saint-Exemple.
 *
 * ATTENTION, DÉPÔT PUBLIC : ne mettez jamais les données d'un vrai client dans ce fichier.
 * Pour un client, créez config/collectivite-<client>.js (ignoré par git, voir
 * collectivite-exemple-client.txt) : il ne contient que les valeurs à remplacer.
 * On ouvre alors la séance avec index.html?config=<client>.
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
    FOURNISSEUR_TEL_PIEGE:      "0693 00 74 52",

    // --- Localisation (ajouts du 2026-11-16) ---
    // Parcours 1 : ce que l'agent voit sur le serveur de fichiers
    DOSSIER_SERVICE:    "Urbanisme – Permis de construire",   // dossier de son propre service
    DOSSIER_COMMUN:     "Commun à tous les services",
    DOSSIER_REFUSE_1:   "Ressources humaines",                // dossiers d'autres services, refusés
    DOSSIER_REFUSE_2:   "Paie",
    // Numéros fictifs des escrocs (indicatif local)
    NUMERO_FAUX_SUPPORT:"0262 00 55 17",                       // parcours 1
    NUMERO_FAUX_DGS:    "+262 693 00 31 08",                   // parcours 3
    // Parcours 2 : la règle de la maison, affichée au débrief
    PROCEDURE_RIB:      "Un changement de RIB ne se traite jamais sur un simple mail : contre-appel, puis circuit habituel de la dépense."
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
