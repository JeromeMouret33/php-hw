# HISTORIQUE

Journal daté, en ordre antichronologique.

## 2026-11-04 – Phase 1 : moteur et parcours pilote n°2

**Fait**
- Mise en place du cadre : `docs/specification.md` (copie figée), `CLAUDE.md`, et le triptyque SUIVI / BACKLOG / HISTORIQUE. La spécification nomme le triptyque sans en fixer le format ; le format a donc été défini ici (voir `CLAUDE.md`).
- BACKLOG exhaustif tiré de la spécification : moteur, configuration, 6 composants, 12 parcours, film, vérifications, points d'arrêt, points à sourcer, informations à recueillir.
- Simulateur hors ligne `simulateur/` :
  - Moteur : navigation, historique, indices cliquables, votes avec décompte, « Voir la suite quand même », « Bien vu » puis « Et si on avait continué ? », mots-clés en tampon, débrief avec indices trouvés et manqués, menu, carton des 5 réflexes, raccourcis clavier, scène 1920×1080 mise à l'échelle, visuel générique pour les images manquantes.
  - Configuration unique `config/collectivite.js`, avec toutes les variables de la spécification et des cases à cocher pour les parcours actifs.
  - Composants : messagerie (thèmes Outlook, Gmail et Zimbra), écran d'appel, chronologie de conséquences.
  - Parcours 2 en fichier de données pur : É1, vote 1, vote 2, É2a, É2b, Bien vu, É3, débrief.
- Vérificateur `outils/verifier.js` (Playwright) : structure, impasses, cibles, règle d'or, rendu de chaque écran, variables non remplacées, indices, boutons morts, flèche →, touche R, taille minimale du texte, absence de requête réseau, 6 chemins complets joués au clic, captures.
- Relecture visuelle des captures. Deux corrections : chevauchement des étiquettes d'indices (placement à 4 positions candidates qui évite les autres indices), et colonne de dates de la chronologie trop étroite.

**Résultat** : `node outils/verifier.js` → 8 écrans contrôlés, 6 chemins complets, aucun problème.

**Détails de réalisme ajoutés (absents de la spécification)**
- Parcours 2 : montant de la facture (18 450 €), banque et IBAN fictifs (« Nordbank Digital », Vilnius, LT58…), domaines et numéros fictifs du fournisseur, quatre mails de remplissage dans la boîte de réception, répliques exactes des deux appels, textes de la chronologie.

**Décisions prises, en attente de validation** : voir `SUIVI.md`, section « Décisions à valider ».
