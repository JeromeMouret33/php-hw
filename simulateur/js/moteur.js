/*
 * MOTEUR DU SIMULATEUR
 * ====================
 * Un seul moteur joue tous les parcours. Un parcours est un fichier de DONNÉES
 * (parcours/NN-*.js) qui appelle SIMU.enregistrerParcours({...}).
 *
 * Format d'un parcours :
 * {
 *   numero: 2,
 *   titre: "Le changement de RIB fournisseur",   // titre animateur (jamais projeté seul)
 *   titreSalle: "Un mail de fournisseur",        // titre neutre, projeté (ne divulgâche pas)
 *   domaine: "pro" | "perso",
 *   nature: "malveillant" | "legitime",
 *   cible, duree, source,                        // informations animateur
 *   debut: "e1",                                 // id du premier écran
 *   ecrans: {
 *     e1: {                                      // écran d'interface
 *       etape: "É1",
 *       composant: "mail",                       // voir js/composants.js
 *       donnees: {...},                          // propres au composant
 *       indices: { domaine: { type: "suspect"|"rassurant", etiquette: "..." } },
 *       motsCles: ["COMPLICE"],
 *       suivant: "vote1"                         // chemin malveillant (flèche →)
 *     },
 *     vote1: {
 *       type: "vote",
 *       question: "...",
 *       options: [{ libelle: "...", suivant: "e3", bon: false }, ...],
 *       suiteQuandMeme: "e3",                    // « Voir la suite quand même »
 *       libelleSuiteQuandMeme: "..."             // facultatif
 *     },
 *     bienvu: {
 *       type: "bienvu",
 *       texte: "...",
 *       suite: "e2a",                            // « Et si on avait continué ? »
 *       libelleSuite: "Et si on avait continué ?"// facultatif (légitime : « Et si on l'avait supprimé ? »)
 *     }
 *     // « debrief » est un écran réservé, généré à partir de parcours.debrief
 *   },
 *   debrief: { attaquant, impact, variante, reflexe }
 * }
 *
 * Dans tous les textes :
 *   {{VARIABLE}}        -> valeur de config/collectivite.js (rouge si absente)
 *   {{img:fichier.png}} -> image du dossier images/, visuel générique si absente
 *   [[id|texte]]        -> indice cliquable, défini dans « indices » de l'écran
 *   <span class="cle">…</span> -> élément essentiel, que les étiquettes d'indices évitent de recouvrir
 */
(function () {
  'use strict';

  const SIMU = window.SIMU = window.SIMU || {};
  SIMU.parcours = SIMU.parcours || [];
  SIMU.composants = SIMU.composants || {};
  SIMU.variablesManquantes = new Set();
  SIMU.erreurs = [];

  SIMU.enregistrerParcours = function (p) { SIMU.parcours.push(p); };

  const LARGEUR = 1920, HAUTEUR = 1080;
  const ECRAN_DEBRIEF = 'debrief';

  const conf = () => window.CONFIG_COLLECTIVITE || { variables: {} };

  // ---------------------------------------------------------------- Textes

  function echapper(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function valeur(nom) {
    const v = (conf().variables || {})[nom];
    if (v == null || v === '') { SIMU.variablesManquantes.add(nom); return null; }
    return v;
  }

  /** Transforme un texte de parcours en HTML : variables, images, indices. */
  function texte(s) {
    if (s == null) return '';
    let r = String(s);
    r = r.replace(/\{\{img:([^}|]+?)(?:\|(\w+))?\}\}/g, (m, nom, gen) => image(nom.trim(), { generique: gen || 'logo' }));
    r = r.replace(/\{\{ADRESSE:([A-Z0-9_]+)\}\}/g, (m, nom) => {
      const a = adresse(nom);
      return a == null ? `<span class="var-manquante">{{ADRESSE:${nom}}}</span>` : echapper(a);
    });
    r = r.replace(/\{\{\s*([A-Z0-9_]+)\s*\}\}/g, (m, nom) => {
      const v = valeur(nom);
      return v == null ? `<span class="var-manquante">{{${nom}}}</span>` : echapper(v);
    });
    r = r.replace(/\[\[([a-z0-9_-]+)\|([\s\S]*?)\]\]/gi,
      (m, id, contenu) => `<span class="indice" data-indice="${id}">${contenu}</span>`);
    // typographie française, uniquement dans le texte (jamais dans les balises)
    r = r.replace(/(^|>)([^<]*)/g, (m, a, t) => a + t.replace(/ ([?!:;»])/g, '\u00a0$1').replace(/« /g, '«\u00a0'));
    return r;
  }

  /**
   * {{ADRESSE:RESPONSABLE_INFO}} -> « paul.grondin@saint-exemple.re », construite à partir du nom,
   * de FORMAT_ADRESSE (prenom.nom, p.nom, nom.prenom, prenom-nom…) et de DOMAINE_MAIL.
   * {{ADRESSE:DGS}} utilise DGS_PRENOM et DGS_NOM.
   */
  function adresse(nom) {
    let prenom, famille;
    if (nom === 'DGS') { prenom = valeur('DGS_PRENOM'); famille = valeur('DGS_NOM'); }
    else { const v = valeur(nom); if (v == null) return null; const mots = String(v).trim().split(/\s+/); prenom = mots.shift(); famille = mots.join('-'); }
    const format = valeur('FORMAT_ADRESSE'), domaine = valeur('DOMAINE_MAIL');
    if (!prenom || !famille || !format || !domaine) return null;
    const net = x => x.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z-]/g, '');
    const local = format.replace(/prenom|nom|\bp\b|\bn\b/g, t => ({ prenom: net(prenom), nom: net(famille), p: net(prenom)[0], n: net(famille)[0] })[t]);
    return local + '@' + domaine;
  }

  /** Version texte brut (pour attributs, titres) : variables seulement. */
  function brut(s) {
    if (s == null) return '';
    return String(s)
      .replace(/\{\{\s*([A-Z0-9_]+)\s*\}\}/g, (m, nom) => { const v = valeur(nom); return v == null ? m : v; })
      .replace(/\[\[[a-z0-9_-]+\|([\s\S]*?)\]\]/gi, '$1');
  }

  function initiales(s) {
    const mots = String(s || '').replace(/<[^>]*>|\[\[[^|]*\||\]\]/g, '').split(/[\s'’-]+/).filter(m => /^\p{L}/u.test(m));
    return mots.length ? mots.slice(0, 2).map(m => m[0].toUpperCase()).join('') : '👤';
  }

  // ---------------------------------------------------------------- Images

  function image(nom, opts) {
    opts = opts || {};
    const dossier = conf().dossierImages || 'images/';
    return `<img class="${opts.classe || ''}" src="${echapper(dossier + nom)}" alt="${echapper(opts.alt || nom)}"` +
      ` data-generique="${opts.generique || 'logo'}" onerror="SIMU.imageGenerique(this)">`;
  }

  function svgGenerique(type) {
    let corps;
    if (type === 'portrait') {
      corps = '<rect width="200" height="200" fill="#c9d3dd"/><circle cx="100" cy="78" r="38" fill="#8a9bad"/>' +
        '<path d="M28 200c6-48 36-72 72-72s66 24 72 72z" fill="#8a9bad"/>';
    } else if (type === 'document') {
      corps = '<rect width="200" height="200" fill="#f3f4f6"/><rect x="50" y="24" width="100" height="152" rx="6" fill="#fff" stroke="#9aa5b1" stroke-width="4"/>' +
        '<g stroke="#c4ccd4" stroke-width="6"><line x1="66" y1="60" x2="134" y2="60"/><line x1="66" y1="84" x2="134" y2="84"/><line x1="66" y1="108" x2="120" y2="108"/></g>';
    } else {
      const ini = echapper(initiales(valeur('COLLECTIVITE_COURT') || 'C'));
      corps = '<path d="M100 10l78 28v56c0 50-34 84-78 96C56 178 22 144 22 94V38z" fill="#1f4e79"/>' +
        `<text x="100" y="122" font-family="Arial,sans-serif" font-size="64" font-weight="700" fill="#fff" text-anchor="middle">${ini}</text>`;
    }
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">${corps}</svg>`);
  }

  SIMU.imageGenerique = function (img) {
    img.onerror = null;
    img.src = svgGenerique(img.dataset.generique);
    img.classList.add('image-generique');
  };

  // ---------------------------------------------------------------- État

  const etat = {
    parcours: null,
    ecranId: null,
    historique: [],
    votes: {},          // idVote -> { choix, decomptes, quandMeme }
    revele: {},         // "ecran.indice" -> true
    visites: [],        // ids d'écrans visités, dans l'ordre
    motsClesVisibles: false, // mots-clés masqués par défaut : l'animateur les affiche (bouton ou K)
    coulisses: false,        // panneau « Coulisses » ouvert ou non (reste ouvert d'un écran à l'autre)
    ongletCoulisses: 'ecran', // 'ecran' | 'scenario' | 'mode'
    minuteries: []
  };
  SIMU.etat = etat;

  const $ = sel => document.querySelector(sel);
  let scene, zoneEcran, coucheEtiquettes, coucheMotsCles, bandeau, commandes, coulissesEl;

  function parcoursActifs() {
    const actifs = conf().parcoursActifs || {};
    return SIMU.parcours
      .filter(p => actifs[p.numero] !== false)
      .sort((a, b) => a.numero - b.numero);
  }

  function ecranCourant() {
    return etat.ecranId === ECRAN_DEBRIEF ? { type: 'debrief' } : etat.parcours.ecrans[etat.ecranId];
  }

  // ---------------------------------------------------------------- Navigation

  function demarrer(numero) {
    const p = SIMU.parcours.find(x => x.numero === numero);
    if (!p) return erreur(`Parcours ${numero} introuvable`);
    etat.parcours = p;
    etat.historique = [];
    etat.votes = {};
    etat.revele = {};
    etat.visites = [];
    etat.ecranId = null;
    aller(resoudre(p.debut));
  }

  /**
   * Une cible peut dépendre d'une option de la configuration :
   *   { option: 'filmParcours1', alors: 'f1', sinon: 'e1' }
   */
  function resoudre(cible) {
    if (cible && typeof cible === 'object') return (conf().options || {})[cible.option] ? cible.alors : cible.sinon;
    return cible;
  }

  function aller(id) {
    if (!etat.parcours) return;
    id = resoudre(id);
    if (id !== ECRAN_DEBRIEF && !etat.parcours.ecrans[id]) return erreur(`Écran « ${id} » introuvable dans le parcours ${etat.parcours.numero}`);
    if (etat.ecranId) etat.historique.push(etat.ecranId);
    etat.ecranId = id;
    afficher();
  }

  function retour() {
    if (!etat.parcours) return;
    if (!etat.historique.length) return menu();
    etat.ecranId = etat.historique.pop();
    afficher();
  }

  function revenirAuVote() {
    if (!etat.parcours) return;
    const pile = etat.historique.concat(etat.ecranId);
    for (let i = pile.length - 1; i >= 0; i--) {
      const e = etat.parcours.ecrans[pile[i]];
      if (e && e.type === 'vote' && pile[i] !== etat.ecranId) {
        etat.historique = pile.slice(0, i);
        etat.ecranId = pile[i];
        return afficher();
      }
    }
  }

  /** Flèche droite : avance sur le chemin malveillant. */
  function avancer() {
    if (!etat.parcours) return;
    const e = ecranCourant();
    if (e.type === 'vote') return voirLaSuite();
    if (e.type === 'bienvu') return aller(e.suite);
    if (e.type === 'debrief') return;
    if (e.suivant) aller(e.suivant);
  }

  function voirLaSuite() {
    const e = ecranCourant();
    etat.votes[etat.ecranId] = Object.assign(etat.votes[etat.ecranId] || {}, { choix: null, quandMeme: true });
    aller(e.suiteQuandMeme);
  }

  function choisir(index) {
    const e = ecranCourant();
    const opt = e.options[index];
    const v = etat.votes[etat.ecranId] = etat.votes[etat.ecranId] || {};
    v.choix = index;
    v.quandMeme = false;
    aller(opt.suivant);
  }

  /** Ordres de passage suggérés par la spécification (section « Réflexes et ordre de passage »). */
  const ORDRES = {
    court:    { nom: 'Court (20 min)',    ordre: [9, 5, 2, 1, 7] },
    standard: { nom: 'Standard (35 min)', ordre: [9, 10, 5, 2, 3, 1, 7, 8, 12] },
    complet:  { nom: 'Complet (50 min)',  ordre: [9, 5, 10, 2, 8, 12, 3, 11, 6, 4, 1, 7] }
  };

  /** Liste des parcours de la séance, dans l'ordre choisi au menu. */
  function seance() {
    const actifs = parcoursActifs();
    const o = ORDRES[etat.format];
    if (!o) return actifs;
    return o.ordre.map(n => actifs.find(p => p.numero === n)).filter(Boolean);
  }

  function parcoursSuivant() {
    const liste = seance();
    const i = liste.indexOf(etat.parcours);
    if (i >= 0 && i < liste.length - 1) demarrer(liste[i + 1].numero);
    else conclusion();
  }

  // ---------------------------------------------------------------- Affichage

  function nettoyer() {
    etat.minuteries.forEach(clearTimeout);
    etat.minuteries = [];
    coucheEtiquettes.innerHTML = '';
    coucheMotsCles.innerHTML = '';
    zoneEcran.className = '';
    if (coulissesEl && !etat.parcours) coulissesEl.className = 'cachee';
  }

  function afficher() {
    nettoyer();
    const p = etat.parcours;
    const e = ecranCourant();
    if (!etat.visites.includes(etat.ecranId)) etat.visites.push(etat.ecranId);
    scene.dataset.mode = 'parcours';
    scene.dataset.parcours = p.numero;
    scene.dataset.ecran = etat.ecranId;

    bandeau.innerHTML =
      `<span class="bandeau-parcours">Parcours ${p.numero} · ${echapper(brut(p.titreSalle))}</span>` +
      `<span class="bandeau-etape">${echapper(e.etape || (e.type === 'vote' ? 'Vote' : e.type === 'debrief' ? 'Débrief' : ''))}</span>` +
      `<span class="bandeau-vote">${badgeVote()}</span>`;

    let html;
    try {
      if (e.type === 'vote') html = rendreVote(e);
      else if (e.type === 'bienvu') html = rendreBienVu(e);
      else if (e.type === 'debrief') html = rendreDebrief();
      else {
        const comp = SIMU.composants[e.composant];
        if (!comp) throw new Error(`Composant « ${e.composant} » inconnu`);
        html = comp(e.donnees || {}, { texte, brut, image, echapper, initiales, valeur, conf });
        zoneEcran.className = 'ecran-composant composant-' + e.composant;
      }
    } catch (err) {
      return erreur(`Écran « ${etat.ecranId} » : ${err.message}`);
    }
    zoneEcran.innerHTML = html;
    brancherIndices(e);
    brancherBoutons();
    // Mots-clés : jamais automatiques. Masqués à chaque nouvel écran ; l'animateur les affiche s'il le souhaite.
    etat.motsClesVisibles = false;
    coucheMotsCles.classList.add('masque');
    rendreCommandes(e);
    rendreCoulisses();
  }

  // ----- Coulisses : panneau dépliable, commentaires de l'animateur

  /*
   * Données (dans le fichier de parcours) :
   *   parcours.coulisses = { scenario, modeOperatoire }
   *   ecran.coulisses    = 'ce qui se passe sur cet écran'
   * Le panneau s'ouvre par l'onglet discret à droite ou par la touche C.
   */
  function rendreCoulisses() {
    const boite = coulissesEl;
    if (!etat.parcours) { boite.className = 'cachee'; return; }
    const p = etat.parcours, e = ecranCourant(), c = p.coulisses || {};
    boite.className = etat.coulisses ? 'ouverte' : '';
    const onglets = [
      ['ecran', '👀 Cet écran'],
      ['scenario', '🎬 Le scénario'],
      ['mode', '🛠️ Le mode opératoire']
    ];
    let corps;
    if (etat.ongletCoulisses === 'scenario') {
      corps = `<p>${texte(c.scenario || 'Pas de scénario décrit pour ce parcours.')}</p>
        <div class="cl-fiches">
          <span class="cl-fiche">🎯 ${texte(p.cible || '')}</span>
          <span class="cl-fiche">⏱️ ${echapper(p.duree || '')}</span>
          ${e.type === 'debrief' || etat.historique.some(id => p.ecrans[id] && p.ecrans[id].type === 'vote')
            ? `<span class="cl-fiche ${p.nature === 'legitime' ? 'ok' : 'ko'}">${p.nature === 'legitime' ? '✅ Message légitime' : '🎣 Attaque'}</span>`
            : '<span class="cl-fiche">❓ Verdict après le vote</span>'}
        </div>
        ${p.source ? `<p class="cl-source">📚 ${texte(p.source)}</p>` : ''}`;
    } else if (etat.ongletCoulisses === 'mode') {
      corps = `<p>${texte(c.modeOperatoire || 'Pas de mode opératoire décrit pour ce parcours.')}</p>`;
    } else {
      const titre = e.type === 'debrief' ? 'Débrief' : e.type === 'vote' ? 'Vote' : e.type === 'bienvu' ? 'Bien vu' : (e.etape || '');
      corps = `<div class="cl-etape">${echapper(titre)}</div>
        <p>${e.coulisses ? texte(e.coulisses) : 'Rien de plus à dévoiler ici : passez à l\'onglet « Le scénario » ou « Le mode opératoire ».'}</p>`;
    }
    boite.innerHTML = `
      <button class="cl-poignee" data-cl="basculer" title="Coulisses (C)"><span>🕵️</span><b>Coulisses</b></button>
      <div class="cl-panneau">
        <div class="cl-entete"><span class="cl-titre">🕵️ Dans les coulisses</span><button class="cl-fermer" data-cl="basculer" title="Fermer (C)">✕</button></div>
        <div class="cl-onglets">${onglets.map(([k, l]) => `<button class="cl-onglet${etat.ongletCoulisses === k ? ' actif' : ''}" data-cl="${k}">${l}</button>`).join('')}</div>
        <div class="cl-corps">${corps}</div>
      </div>`;
    boite.querySelectorAll('[data-cl]').forEach(b => b.addEventListener('click', ev => {
      ev.stopPropagation();
      const a = b.dataset.cl;
      if (a === 'basculer') basculerCoulisses();
      else { etat.ongletCoulisses = a; rendreCoulisses(); }
    }));
  }

  function basculerCoulisses() {
    if (!etat.parcours) return;
    etat.coulisses = !etat.coulisses;
    if (etat.coulisses) etat.ongletCoulisses = 'ecran';
    rendreCoulisses();
  }

  function badgeVote() {
    const ids = Object.keys(etat.votes).filter(id => etat.historique.includes(id) || id === etat.ecranId);
    if (!ids.length) return '';
    const id = ids[ids.length - 1];
    const v = etat.votes[id], e = etat.parcours.ecrans[id];
    if (v.quandMeme) return 'Suite jouée « quand même »';
    if (v.choix == null) return '';
    return `La salle a choisi : <b>${echapper(brut(e.options[v.choix].libelle))}</b>`;
  }

  // ----- Indices

  function brancherIndices(e) {
    const defs = e.indices || {};
    zoneEcran.querySelectorAll('[data-indice]').forEach(el => {
      const id = el.dataset.indice;
      if (!defs[id]) { SIMU.erreurs.push(`Indice « ${id} » sans définition (écran ${etat.ecranId})`); return; }
      el.classList.add('indice-' + defs[id].type);
      el.addEventListener('click', ev => { ev.stopPropagation(); basculerIndice(el, id, defs[id]); });
      if (etat.revele[cleIndice(id)]) montrerIndice(el, id, defs[id]);
    });
    Object.keys(defs).forEach(id => {
      if (!zoneEcran.querySelector(`[data-indice="${id}"]`)) SIMU.erreurs.push(`Indice « ${id} » défini mais absent de l'écran ${etat.ecranId}`);
    });
  }

  const cleIndice = id => etat.ecranId + '.' + id;

  function basculerIndice(el, id, def) {
    const k = cleIndice(id);
    if (etat.revele[k]) {
      delete etat.revele[k];
      el.classList.remove('revele');
      const et = coucheEtiquettes.querySelector(`[data-pour="${id}"]`);
      if (et) et.remove();
    } else {
      etat.revele[k] = true;
      montrerIndice(el, id, def);
    }
    rendreCommandes(ecranCourant());
  }

  function montrerIndice(el, id, def) {
    el.classList.add('revele');
    const et = document.createElement('div');
    et.className = 'etiquette etiquette-' + def.type;
    et.dataset.pour = id;
    et.innerHTML = (def.type === 'rassurant' ? '✓ ' : '⚠ ') + texte(def.etiquette);
    coucheEtiquettes.appendChild(et);
    placerEtiquette(el, et);
  }

  /** Rectangle d'un élément dans le repère de la scène (1920×1080). */
  function rectScene(el) {
    const s = SIMU.echelle || 1;
    const rs = scene.getBoundingClientRect(), r = el.getBoundingClientRect();
    return { x: (r.left - rs.left) / s, y: (r.top - rs.top) / s, w: r.width / s, h: r.height / s };
  }

  function recouvrement(a, b) {
    const dx = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
    const dy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
    return dx > 0 && dy > 0 ? dx * dy : 0;
  }

  /**
   * Place l'étiquette à côté de son élément : on essaie dessous, dessus, à droite
   * et à gauche, et on garde la position qui recouvre le moins les autres
   * étiquettes, les autres indices et l'élément lui-même.
   */
  function placerEtiquette(el, et) {
    const r = rectScene(el);
    const w = et.offsetWidth, h = et.offsetHeight, marge = 12;
    const HAUT = 52 + 8, BAS = HAUTEUR - 56 - 8;
    const etiquettes = [...coucheEtiquettes.children].filter(o => o !== et).map(rectScene);
    // à ne pas masquer : les autres indices, et les éléments clés (liens, boutons, barre d'état au survol)
    const indices = [...zoneEcran.querySelectorAll('[data-indice], .cle, .lien, .btn-mail, .barre-etat, .inv-btn, .site-btn')]
      .filter(o => o !== el && !o.contains(el) && !el.contains(o)).map(rectScene);
    const candidats = [
      { x: r.x, y: r.y + r.h + marge },
      { x: r.x, y: r.y - h - marge },
      { x: r.x + r.w + marge, y: r.y + r.h / 2 - h / 2 },
      { x: r.x - w - marge, y: r.y + r.h / 2 - h / 2 }
    ];
    let meilleur = null;
    candidats.forEach((c, rang) => {
      const p = { x: Math.max(16, Math.min(c.x, LARGEUR - w - 16)), y: Math.max(HAUT, Math.min(c.y, BAS - h)), w, h };
      let score = rang * 50 + recouvrement(p, r) * 6;
      etiquettes.forEach(o => { score += recouvrement(p, o) * 5; });
      indices.forEach(o => { score += recouvrement(p, o) * 3; });
      if (!meilleur || score < meilleur.score) meilleur = { p, score };
    });
    et.style.left = meilleur.p.x + 'px';
    et.style.top = meilleur.p.y + 'px';
  }

  /** Touche I : révèle tous les indices de l'écran ; s'ils le sont tous déjà, les masque. */
  function basculerTousIndices() {
    const e = ecranCourant();
    const defs = e.indices || {};
    const els = [...zoneEcran.querySelectorAll('[data-indice]')].filter(el => defs[el.dataset.indice]);
    if (!els.length) return bulle('Aucun indice sur cet écran');
    const tousReveles = els.every(el => etat.revele[cleIndice(el.dataset.indice)]);
    els.forEach(el => {
      const id = el.dataset.indice, k = cleIndice(id);
      if (tousReveles) {
        delete etat.revele[k];
        el.classList.remove('revele');
      } else if (!etat.revele[k]) { etat.revele[k] = true; montrerIndice(el, id, defs[id]); }
    });
    if (tousReveles) coucheEtiquettes.innerHTML = '';
    rendreCommandes(e);
  }

  /** Petit message temporaire pour l'animateur. */
  function bulle(msg) {
    let b = document.getElementById('bulle');
    if (!b) { b = document.createElement('div'); b.id = 'bulle'; scene.appendChild(b); }
    b.textContent = msg;
    b.classList.add('visible');
    clearTimeout(bulle.t);
    bulle.t = setTimeout(() => b.classList.remove('visible'), 1600);
  }

  // ----- Mots-clés

  function poserMotCle(m) {
    if ([...coucheMotsCles.children].some(d => d.dataset.mot === m)) return;
    const d = document.createElement('div');
    d.className = 'mot-cle';
    d.dataset.mot = m;
    d.innerHTML = texte(m);
    coucheMotsCles.appendChild(d);
  }

  /** Pose les mots-clés l'un après l'autre (effet tampon). */
  function afficherMotsCles(mots) {
    coucheMotsCles.innerHTML = '';
    coucheMotsCles.classList.remove('masque');
    mots.forEach((m, i) => etat.minuteries.push(setTimeout(() => poserMotCle(m), i * 450)));
  }

  // ----- Vote

  function rendreVote(e) {
    const v = etat.votes[etat.ecranId] || {};
    const dec = v.decomptes || e.options.map(() => 0);
    v.decomptes = dec;
    etat.votes[etat.ecranId] = v;
    const total = dec.reduce((a, b) => a + b, 0);
    const opts = e.options.map((o, i) => {
      const pct = total ? Math.round(dec[i] * 100 / total) : 0;
      return `<div class="vote-option" data-option="${i}">
        <div class="vote-libelle">${texte(o.libelle)}</div>
        <div class="vote-barre"><span style="width:${pct}%"></span></div>
        <div class="vote-compteur">
          <button class="btn-rond" data-action="moins" data-option="${i}" aria-label="Retirer une voix">−</button>
          <span class="vote-nombre">${dec[i]}</span>
          <button class="btn-rond" data-action="plus" data-option="${i}" aria-label="Ajouter une voix">+</button>
          <span class="vote-pct">${total ? pct + ' %' : ''}</span>
        </div>
        <button class="btn btn-choix" data-action="choisir" data-option="${i}" data-cible="${resoudre(o.suivant)}">Jouer ce choix ▸</button>
      </div>`;
    }).join('');
    return `<div class="ecran-vote">
      <div class="vote-titre">❓ Vote à main levée</div>
      <h1 class="vote-question">${texte(e.question)}</h1>
      <div class="vote-options n${e.options.length}">${opts}</div>
      <div class="vote-pied">
        <button class="btn btn-secondaire" data-action="quandmeme" data-cible="${resoudre(e.suiteQuandMeme)}">${texte(e.libelleSuiteQuandMeme || 'Voir la suite quand même')} ▸</button>
      </div>
    </div>`;
  }

  // ----- Bien vu

  function rendreBienVu(e) {
    return `<div class="ecran-bienvu">
      <div class="bienvu-icone">✓</div>
      <h1>${texte(e.titre || 'Bien vu !')}</h1>
      <p class="bienvu-texte">${texte(e.texte)}</p>
      <div class="bienvu-actions">
        <button class="btn btn-principal" data-action="aller" data-cible="${resoudre(e.suite)}">${texte(e.libelleSuite || 'Et si on avait continué ?')} ▸</button>
        <button class="btn btn-secondaire" data-action="aller" data-cible="${resoudre(e.suiteDebrief) || ECRAN_DEBRIEF}">${texte(e.libelleSuiteDebrief || 'Passer au débrief')}</button>
      </div>
    </div>`;
  }

  // ----- Débrief

  function rendreDebrief() {
    const p = etat.parcours, d = p.debrief || {};
    const trouves = [], manques = [];
    etat.visites.forEach(id => {
      const e = p.ecrans[id];
      if (!e || !e.indices) return;
      Object.keys(e.indices).forEach(k => {
        const def = e.indices[k];
        (etat.revele[id + '.' + k] ? trouves : manques).push(def);
      });
    });
    const liste = (tab, cls, sym) => tab.map(def => `<li class="${cls} ${def.type}"><span class="db-puce">${sym}</span>${texte(def.etiquette)}</li>`).join('');
    let rang = 0;
    const bloc = (icone, titre, contenu, cls) => contenu
      ? `<section class="db-carte ${cls}" style="--retard:${(rang++) * 0.15 + 0.3}s"><div class="db-icone">${icone}</div><div><h2>${titre}</h2><p>${texte(contenu)}</p></div></section>` : '';
    const legitime = p.nature === 'legitime';
    const suivant = seance();
    const dernier = suivant.indexOf(p) === suivant.length - 1;
    // score ludique : indices trouvés et votes de la salle
    const total = trouves.length + manques.length;
    const etoiles = total ? '★'.repeat(trouves.length) + '☆'.repeat(manques.length) : '';
    const votes = Object.keys(etat.votes).map(id => ({ v: etat.votes[id], e: p.ecrans[id] }))
      .filter(x => x.e && x.e.type === 'vote' && x.v.choix != null);
    // « prudent » : un choix défendable (ex. signaler un message légitime), compté comme un bon réflexe
    const bonsVotes = votes.filter(x => x.e.options[x.v.choix].bon || x.e.options[x.v.choix].prudent).length;
    const verdict = !total ? '' : legitime
      ? (trouves.length === total ? '🏆 Tous les signes rassurants repérés' : trouves.length * 2 >= total ? '👏 Presque tous les signes repérés' : '🔎 Des signes rassurants vous ont échappé')
      : (trouves.length === total ? '🏆 Rien ne vous a échappé !' : trouves.length * 2 >= total ? '👏 Bien joué, presque tout repéré' : '🔎 L\'attaquant a été discret…');
    return `<div class="ecran-debrief">
      <div class="db-haut">
        <h1>🎯 Débrief · ${echapper(brut(p.titre))}</h1>
        <div class="db-scores">
          ${total ? `<div class="db-score"><span class="db-etoiles">${etoiles}</span><span>${legitime ? 'Signes rassurants' : 'Indices'} : <b>${trouves.length} / ${total}</b></span></div>` : ''}
          ${votes.length ? `<div class="db-score"><span class="db-gros">${bonsVotes === votes.length ? '✅' : '⚠️'}</span><span>Votes : <b>${bonsVotes} / ${votes.length}</b> bon${bonsVotes > 1 ? 's' : ''} réflexe${bonsVotes > 1 ? 's' : ''}</span></div>` : ''}
        </div>
      </div>
      <div class="debrief-colonnes">
        <section class="db-carte db-indices" style="--retard:.1s">
          <div class="db-icone">🔍</div>
          <div>
            <h2>${legitime ? 'Les signes rassurants' : 'Les indices'}${verdict ? ` <small>${verdict}</small>` : ''}</h2>
            ${total ? `<ul class="debrief-indices">
              ${liste(trouves, 'trouve', '✓')}
              ${liste(manques, 'manque', '?')}
            </ul>` : '<p>Pas de chasse aux indices sur ce chemin : demandez à la salle ce qui aurait dû l\'alerter.</p>'}
          </div>
        </section>
        <div class="debrief-droite">
          ${bloc('🕵️', 'Ce que fait l\'attaquant ensuite', d.attaquant, 'db-attaquant')}
          ${bloc('💥', 'Impact', d.impact, 'db-impact')}
          ${bloc('🔀', 'Variante', d.variante, 'db-variante')}
          ${bloc('💡', 'À retenir', d.message, 'db-retenir')}
        </div>
      </div>
      <section class="debrief-reflexe"><span class="db-medaille">🏅</span><div><span>Le bon réflexe</span><p>${texte(d.reflexe)}</p></div></section>
      <div class="debrief-actions">
        <button class="btn btn-secondaire" data-action="menu">Menu</button>
        <button class="btn btn-principal" data-action="suivant-parcours">${dernier ? 'Réflexes de conclusion' : 'Parcours suivant'} ▸</button>
      </div>
    </div>`;
  }

  // ----- Boutons

  function brancherBoutons() {
    zoneEcran.querySelectorAll('button[data-action]').forEach(b => {
      b.addEventListener('click', ev => {
        ev.stopPropagation();
        const a = b.dataset.action, i = +b.dataset.option;
        if (a === 'plus' || a === 'moins') {
          const v = etat.votes[etat.ecranId];
          v.decomptes[i] = Math.max(0, v.decomptes[i] + (a === 'plus' ? 1 : -1));
          const y = zoneEcran.scrollTop;
          zoneEcran.innerHTML = rendreVote(ecranCourant());
          zoneEcran.scrollTop = y;
          brancherBoutons();
        } else if (a === 'choisir') choisir(i);
        else if (a === 'quandmeme') voirLaSuite();
        else if (a === 'aller') aller(b.dataset.cible);
        else if (a === 'menu') menu();
        else if (a === 'suivant-parcours') parcoursSuivant();
        else if (a === 'demarrer') demarrer(+b.dataset.parcours);
        else if (a === 'conclusion') conclusion();
        else if (a === 'format') { etat.format = b.dataset.format; menu(); }
      });
    });
  }

  function rendreCommandes(e) {
    const peutAvancer = e.type === 'vote' || e.type === 'bienvu' || (e.type !== 'debrief' && e.suivant);
    const aUnVote = etat.historique.some(id => etat.parcours.ecrans[id] && etat.parcours.ecrans[id].type === 'vote');
    commandes.innerHTML =
      `<button class="cmd" data-cmd="menu" title="Menu (M)">☰ Menu</button>` +
      `<button class="cmd" data-cmd="retour" title="Retour (←)">◂ Retour</button>` +
      (aUnVote ? `<button class="cmd" data-cmd="vote" title="Revenir au dernier vote (R)">↺ Dernier vote</button>` : '') +
      `<span class="cmd-espace"></span>` +
      (Object.keys(e.indices || {}).length ? `<button class="cmd" data-cmd="indices" title="Révéler / masquer tous les indices (I)">${
        Object.keys(e.indices).every(id => etat.revele[cleIndice(id)]) ? 'Masquer les indices' : 'Tous les indices'}</button>` : '') +
      ((e.motsCles || []).length ? `<button class="cmd" data-cmd="motscles" title="Afficher / masquer les mots-clés (K)">${
        etat.motsClesVisibles ? 'Masquer les mots-clés' : `Afficher les mots-clés (${e.motsCles.length})`}</button>` : '') +
      `<button class="cmd" data-cmd="pleinecran" title="Plein écran (F)">⛶</button>` +
      (peutAvancer ? `<button class="cmd cmd-suite" data-cmd="avancer" title="Suite (→)">Suite ▸</button>` : '');
    brancherCommandes();
  }

  function brancherCommandes() {
    commandes.querySelectorAll('[data-cmd]').forEach(b => b.addEventListener('click', () => ({
      menu, retour, vote: revenirAuVote, avancer, indices: basculerTousIndices,
      motscles: basculerMotsCles, pleinecran: pleinEcran
    })[b.dataset.cmd]()));
  }

  /** Touche K : masque ou réaffiche les mots-clés en surimpression de l'écran. */
  function basculerMotsCles() {
    const e = etat.parcours ? ecranCourant() : {};
    if (!e.motsCles || !e.motsCles.length) return bulle('Pas de mot-clé sur cet écran');
    etat.motsClesVisibles = !etat.motsClesVisibles;
    if (etat.motsClesVisibles) afficherMotsCles(e.motsCles);
    else coucheMotsCles.classList.add('masque');
    rendreCommandes(e);
  }

  // ---------------------------------------------------------------- Menu, conclusion

  function menu() {
    nettoyer();
    etat.parcours = null;
    etat.ecranId = null;
    scene.dataset.mode = 'menu';
    coulissesEl.className = 'cachee';
    delete scene.dataset.parcours;
    scene.dataset.ecran = 'menu';
    bandeau.innerHTML = `<span class="bandeau-parcours">${texte('{{COLLECTIVITE}}')}</span>`;
    const liste = seance();
    const formats = [['tous', 'Tous les parcours']].concat(Object.keys(ORDRES).map(k => [k, ORDRES[k].nom]))
      .map(([k, nom]) => `<button class="btn-format${(etat.format || 'tous') === k ? ' actif' : ''}" data-action="format" data-format="${k}">${nom}</button>`).join('');
    const cartes = liste.map((p, i) => `
      <button class="carte-parcours" data-action="demarrer" data-parcours="${p.numero}">
        <span class="carte-numero">${ORDRES[etat.format] ? `${i + 1}. ` : ''}Parcours ${p.numero}</span>
        <span class="carte-titre">${texte(p.titreSalle)}</span>
        <span class="carte-meta">${p.domaine === 'perso' ? 'Vie perso' : 'Vie pro'} · ${echapper(p.duree || '')}</span>
      </button>`).join('');
    zoneEcran.innerHTML = `<div class="ecran-menu">
      <div class="menu-entete">${image('logo-collectivite.png', { classe: 'menu-logo', generique: 'logo', alt: 'Logo' })}
        <div><h1>Hameçonnage : à vous de jouer</h1><p>${texte('{{COLLECTIVITE}}')} · séance de sensibilisation</p></div></div>
      <div class="menu-formats"><span>Séance :</span>${formats}</div>
      <div class="menu-cartes">${cartes || '<p class="menu-vide">Aucun parcours actif : vérifiez « parcoursActifs » dans config/collectivite.js.</p>'}</div>
      <div class="menu-pied"><button class="btn btn-secondaire" data-action="conclusion">Réflexes de conclusion</button>
      <span class="menu-aide">→ suite · ← retour · R dernier vote · I indices · K mots-clés · C coulisses · F plein écran · M menu</span></div>
    </div>`;
    brancherBoutons();
    commandes.innerHTML = `<span class="cmd-espace"></span><button class="cmd" data-cmd="pleinecran" title="Plein écran (F)">⛶ Plein écran</button>`;
    brancherCommandes();
  }

  const REFLEXES = [
    ['🛑', 'Urgence, secret, peur = stop.', 'Plus on vous presse, plus il faut ralentir.'],
    ['📞', 'Vérifier par un autre canal,', 'sur des coordonnées déjà connues (contre-appel, ancien numéro, numéro au dos de la carte).'],
    ['🧭', 'Aller soi-même sur le site ou l\'application officiels,', 'jamais via le lien reçu.'],
    ['🔐', 'Ne jamais donner un code, un mot de passe ou la main sur son poste', 'à quelqu\'un qui vous contacte.'],
    ['📣', 'Signaler sans honte', 'au {{DSI_NOM}}, au {{NUMERO_SUPPORT}} : un signalement rapide limite les dégâts.']
  ];

  function conclusion() {
    nettoyer();
    etat.parcours = null;
    scene.dataset.mode = 'conclusion';
    coulissesEl.className = 'cachee';
    scene.dataset.ecran = 'conclusion';
    bandeau.innerHTML = `<span class="bandeau-parcours">${texte('{{COLLECTIVITE}}')}</span>`;
    zoneEcran.innerHTML = `<div class="ecran-conclusion">
      <h1>🎯 Cinq réflexes à garder</h1>
      <div class="cc-cartes">${REFLEXES.map((r, i) => `
        <div class="cc-carte cc-${i + 1}" style="--retard:${i * 0.35 + 0.2}s">
          <span class="cc-num">${i + 1}</span><span class="cc-icone">${r[0]}</span>
          <b>${texte(r[1])}</b><p>${texte(r[2])}</p>
        </div>`).join('')}
        <div class="cc-tampon" style="--retard:2.2s">Vigilant,<br>pas paranoïaque.</div>
      </div>
      <button class="btn btn-secondaire cc-menu" data-action="menu">Menu</button>
    </div>`;
    brancherBoutons();
    commandes.innerHTML = `<span class="cmd-espace"></span><button class="cmd" data-cmd="pleinecran">⛶ Plein écran</button>`;
    brancherCommandes();
  }

  // ---------------------------------------------------------------- Divers

  function erreur(msg) {
    SIMU.erreurs.push(msg);
    console.error('[simulateur]', msg);
    zoneEcran.innerHTML = `<div class="ecran-erreur"><h1>Erreur de parcours</h1><p>${echapper(msg)}</p></div>`;
  }

  function pleinEcran() {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
  }

  function ajuster() {
    const s = Math.min(window.innerWidth / LARGEUR, window.innerHeight / HAUTEUR);
    SIMU.echelle = s;
    scene.style.transform = `translate(-50%, -50%) scale(${s})`;
  }

  function clavier(ev) {
    if (ev.target.matches('input, textarea')) return;
    const k = ev.key;
    if (k === 'ArrowRight') avancer();
    else if (k === 'ArrowLeft') retour();
    else if (k === 'r' || k === 'R') revenirAuVote();
    else if (k === 'f' || k === 'F') pleinEcran();
    else if (k === 'k' || k === 'K') basculerMotsCles();
    else if (k === 'i' || k === 'I') { if (etat.parcours) basculerTousIndices(); }
    else if (k === 'm' || k === 'M') menu();
    else if (k === 'c' || k === 'C') basculerCoulisses();
    else return;
    ev.preventDefault();
  }

  function init() {
    scene = $('#scene');
    zoneEcran = $('#ecran');
    coucheEtiquettes = $('#couche-etiquettes');
    coucheMotsCles = $('#couche-motscles');
    bandeau = $('#bandeau');
    commandes = $('#commandes');
    coulissesEl = document.createElement('aside');
    coulissesEl.id = 'coulisses';
    scene.appendChild(coulissesEl);
    ajuster();
    window.addEventListener('resize', ajuster);
    document.addEventListener('keydown', clavier);
    document.title = brut('Sensibilisation hameçonnage – {{COLLECTIVITE}}');
    menu();
  }

  // API publique (utilisée aussi par outils/verifier.js)
  Object.assign(SIMU, { resoudre, texte, brut, image, demarrer, aller, retour, avancer, revenirAuVote, menu, conclusion, ECRAN_DEBRIEF });

  document.addEventListener('DOMContentLoaded', init);
})();
