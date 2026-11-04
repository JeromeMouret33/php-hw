# Simulateur de sensibilisation à l'hameçonnage – agents de collectivité

## Référence

- **`docs/specification.md` est la spécification figée** (version 2 du 2026-11-04, qui intègre les décisions validées après le développement ; voir son historique des versions). Son contenu est validé : on ne réinvente rien en cours de route.
- Si un détail manque pour réaliser un écran (montant, numéro fictif, texte de remplissage), on peut l'ajouter, à condition de le noter dans `HISTORIQUE.md` comme « détail de réalisme ajouté ».
- Toute **contradiction ou tout écart** par rapport à la spécification va dans la section « Décisions à valider » de `SUIVI.md`. On ne la tranche pas en silence.

## Suivi : protocole obligatoire

Trois fichiers à la racine, à tenir à jour **au fil de l'eau**, pas en fin de session :

| Fichier | Rôle | Quand l'écrire |
| --- | --- | --- |
| `SUIVI.md` | Photo de l'état actuel : phase en cours, dernière tâche terminée, prochaine action, blocages, décisions à valider | Début et fin de chaque tâche |
| `BACKLOG.md` | Liste exhaustive des tâches tirées de la spécification, avec leurs critères d'acceptation, en cases à cocher | Cocher dès qu'un critère est vérifié, jamais avant |
| `HISTORIQUE.md` | Journal daté, en ordre antichronologique : ce qui a été fait, les décisions prises, les détails ajoutés | À chaque tâche terminée ou décision prise |

Règles :

1. En début de session, lire `SUIVI.md`, puis `BACKLOG.md`.
2. Une case n'est cochée que si le critère a été **vérifié** (vérificateur passé, capture relue). Une tâche partiellement faite reste décochée ; on écrit dans `SUIVI.md` ce qui manque.
3. On respecte les **points d'arrêt** de la spécification : après le pilote (parcours 2) et avant la livraison, on s'arrête et on attend la validation de l'animateur.
4. Tout ce qui n'a pas été fait, ou a été reporté, reste visible dans `BACKLOG.md`, avec une note.

## Architecture

```
simulateur/            dossier autonome, ouvert directement dans le navigateur (file://), sans serveur
  index.html           point d'entrée, charge les scripts dans l'ordre
  config/collectivite.js  LE fichier de configuration (variables, parcours actifs, dossier images)
  images/              images de la collectivité (logo, photos) – visuel générique si absentes
  css/simulateur.css   habillage, scène 1920×1080 mise à l'échelle
  js/moteur.js         moteur : navigation, indices, votes, « voir la suite », débrief, clavier
  js/composants.js     composants d'interface réutilisables (messagerie, appel, …)
  parcours/NN-*.js     un fichier de DONNÉES par parcours, sans code spécifique
outils/verifier.js     parcours automatique de toutes les branches + captures 1920×1080
docs/specification.md  spécification figée
```

Conventions des données de parcours, détaillées en tête de `simulateur/js/moteur.js` :

- `{{VARIABLE}}` est remplacée par la configuration. Une variable absente apparaît en rouge et fait échouer le vérificateur.
- `[[id|texte]]` crée un indice cliquable. Sa définition (`suspect` ou `rassurant`, et l'étiquette) va dans `indices` de l'écran.
- Aucun parcours ne contient de code : s'il faut un nouveau comportement, on le met dans le moteur ou dans un composant.

## Règles non négociables

- Le simulateur fonctionne 100 % hors ligne : aucune ressource externe (police, script, image distante), aucun envoi réseau.
- Les champs de saisie ne transmettent rien.
- Aucune vraie marque d'attaquant ni vrai domaine malveillant. Les organismes imités ont un habillage évocateur, sans leurs logos.
- Règle d'or : aucun parcours ne se bloque sur une bonne réponse. Chaque vote propose « Voir la suite quand même ».
- Le texte doit rester lisible sur vidéoprojecteur : pas de corps de texte sous 22 px à l'échelle 1920×1080.

## Vérifier

```
node outils/verifier.js          # toutes les branches, boutons, variables, indices + captures dans captures/
node outils/verifier.js --sans-captures
```

Il faut relire visuellement les captures (`captures/`), pas seulement le code.
