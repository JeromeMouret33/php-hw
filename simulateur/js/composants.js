/*
 * COMPOSANTS D'INTERFACE
 * ======================
 * Chaque composant reçoit (donnees, outils) et renvoie du HTML.
 * outils = { texte, brut, image, echapper, initiales, valeur, conf }
 *   - texte(s) : remplace {{VARIABLES}}, {{img:...}} et [[indice|...]] -> HTML
 *   - brut(s)  : variables seulement, texte brut
 *
 * Composants prévus par la spécification (six) :
 *   mail (messagerie) ........ FAIT
 *   appel (écran d'appel) .... FAIT
 *   smartphone (SMS, WhatsApp, application) FAIT
 *   navigateur ............... FAIT
 *   visio .................... FAIT
 *   explorateur .............. FAIT
 * Écrans complémentaires :
 *   chronologie (conséquences), rancon, photo (scène illustrée),
 *   video (séquence du film), comparaison (deux messages côte à côte)
 */
(function () {
  'use strict';
  const C = window.SIMU.composants;

  // ------------------------------------------------------------ Messagerie

  function themeMail(valeur) {
    const o = String(valeur('OUTIL_MAIL') || '').toLowerCase();
    if (o.includes('gmail')) return 'gmail';
    if (o.includes('zimbra')) return 'zimbra';
    return 'outlook';
  }

  const ICONE_PJ = { pdf: 'PDF', doc: 'DOC', xls: 'XLS', img: 'IMG', zip: 'ZIP' };

  C.mail = function (d, o) {
    const { texte, brut, echapper, initiales, valeur } = o;
    const theme = themeMail(valeur);
    const m = d.message || {};
    const liste = (d.liste || []).map(l => `
      <div class="ml-item${l.nonLu ? ' non-lu' : ''}${l.selectionne ? ' selectionne' : ''}">
        <div class="ml-ligne1"><span class="ml-de">${texte(l.de)}</span><span class="ml-heure">${texte(l.heure)}</span></div>
        <div class="ml-objet">${l.pj ? '<span class="ml-trombone">📎</span>' : ''}${texte(l.objet)}</div>
        <div class="ml-apercu">${texte(l.apercu)}</div>
      </div>`).join('');
    const pjs = (m.piecesJointes || []).map(pj => `
      <div class="mail-pj${pj.ouverte ? ' ouverte' : ''}">
        <span class="pj-type pj-${pj.type || 'pdf'}">${ICONE_PJ[pj.type || 'pdf']}</span>
        <span class="pj-texte"><span class="pj-nom">${texte(pj.nom)}</span><span class="pj-taille">${texte(pj.taille || '')}</span></span>
      </div>`).join('');
    const apercu = d.apercu ? `
      <aside class="mail-apercu">
        <div class="apercu-barre"><span>${texte(d.apercu.titre)}</span><span class="apercu-outils">⤢ ⤓ ✕</span></div>
        <div class="apercu-page">${texte(d.apercu.contenu)}</div>
      </aside>` : '';
    return `<div class="mail theme-${theme}">
      <div class="mail-barre">
        <span class="mail-app"><span class="mail-app-icone">✉</span>${echapper(brut(d.application || 'Messagerie'))}</span>
        <span class="mail-recherche">🔍 Rechercher</span>
        <span class="mail-utilisateur"><span class="avatar petit">${echapper(initiales(brut(d.utilisateur || '{{COLLECTIVITE_COURT}}')))}</span>${texte(d.utilisateur || '')}</span>
      </div>
      <div class="mail-corps">
        <nav class="mail-rail">
          <span class="rail-btn actif">✉</span><span class="rail-btn">📅</span><span class="rail-btn">👥</span><span class="rail-btn">✓</span>
        </nav>
        <section class="mail-liste">
          <div class="ml-entete">${texte(d.dossier || 'Boîte de réception')}${d.compteur ? `<span class="ml-compteur">${texte(d.compteur)}</span>` : ''}</div>
          ${liste}
        </section>
        <section class="mail-lecture${d.apercu ? ' avec-apercu' : ''}">
          ${d.message ? '' : `<article class="mail-message mail-vide">${texte(d.vide || 'Sélectionnez un élément pour le lire')}</article>`}
          ${d.message ? `<article class="mail-message">
            <h1 class="mail-objet">${texte(m.objet)}</h1>
            <div class="mail-entete">
              <span class="avatar">${echapper(initiales(brut(m.deNom)))}</span>
              <div class="mail-exp">
                <div><span class="mail-de-nom">${texte(m.deNom)}</span> <span class="mail-de-adresse">&lt;${texte(m.deAdresse)}&gt;</span></div>
                <div class="mail-a">À : ${texte(m.a)}</div>
              </div>
              <span class="mail-date">${texte(m.date)}</span>
            </div>
            ${pjs ? `<div class="mail-pjs">${pjs}</div>` : ''}
            ${m.invitation ? `<div class="mail-invitation"><div class="inv-date">${texte(m.invitation.jour)}</div>
              <div class="inv-texte"><b>${texte(m.invitation.titre)}</b><span>${texte(m.invitation.quand)}</span><span>${texte(m.invitation.organisateur)}</span></div>
              <span class="inv-btn">${texte(m.invitation.bouton || 'Rejoindre la réunion')}</span></div>` : ''}
            <div class="mail-texte">${texte(m.corps)}</div>
            ${d.barreEtat ? `<div class="barre-etat">${texte(d.barreEtat)}</div>` : ''}
          </article>` : ''}
          ${apercu}
        </section>
      </div>
    </div>`;
  };

  // ------------------------------------------------------------ Écran d'appel

  C.appel = function (d, o) {
    const { texte, brut, echapper, initiales } = o;
    const entrant = d.statut === 'entrant';
    const repliques = (d.repliques || []).map(r => `
      <div class="replique replique-${r.qui === 'agent' ? 'agent' : 'appelant'}">
        <span class="replique-qui">${r.qui === 'agent' ? 'Vous' : texte(d.appelant)}</span>
        <p>${texte(r.texte)}</p>
      </div>`).join('');
    return `<div class="appel">
      <div class="telephone">
        <div class="tel-encoche"></div>
        <div class="tel-statut">${entrant ? 'Appel entrant…' : 'Appel en cours'}</div>
        <div class="tel-avatar">${echapper(initiales(brut(d.appelant)))}</div>
        <div class="tel-nom">${texte(d.appelant)}</div>
        <div class="tel-numero">${texte(d.numero)}</div>
        <div class="tel-duree">${entrant ? '' : texte(d.duree || '00:00')}</div>
        ${entrant ? `<div class="tel-boutons-entrant"><span class="tel-btn rouge">✕</span><span class="tel-btn vert">✆</span></div>` : `
        <div class="tel-grille">
          <span class="tel-btn-gris">🔇<small>Muet</small></span><span class="tel-btn-gris">⌨<small>Clavier</small></span><span class="tel-btn-gris">🔊<small>HP</small></span>
        </div>
        <div class="tel-raccrocher"><span class="tel-btn rouge">✆</span></div>`}
      </div>
      <div class="appel-droite">
        ${d.contexte ? `<div class="appel-contexte">${texte(d.contexte)}</div>` : ''}
        <div class="appel-repliques">${repliques}</div>
      </div>
    </div>`;
  };

  // ------------------------------------------------------------ Chronologie

  /*
   * titre, etapes : [{ quand, titre, texte, icone (emoji, facultatif), alerte }]
   * Les cartes apparaissent l'une après l'autre, comme les cases d'une bande dessinée.
   */
  const ICONES_CHRONO = ['⚡', '💸', '🔥', '📉'];
  C.chronologie = function (d, o) {
    const { texte } = o;
    const etapes = (d.etapes || []).map((e, i) => `
      ${i ? `<li class="chrono-fleche" style="--retard:${i * 0.9}s">➜</li>` : ''}
      <li class="chrono-carte${e.alerte ? ' alerte' : ''}" style="--retard:${i * 0.9 + 0.2}s">
        <span class="chrono-quand">${texte(e.quand)}</span>
        <span class="chrono-icone">${e.icone || (e.alerte ? '🚨' : ICONES_CHRONO[i % ICONES_CHRONO.length])}</span>
        ${e.titre ? `<h3>${texte(e.titre)}</h3>` : ''}<p>${texte(e.texte)}</p>
      </li>`).join('');
    return `<div class="chronologie">
      <h1><span class="chrono-clap">🎬</span>${texte(d.titre)}</h1>
      <ol class="chrono-bande n${(d.etapes || []).length}">${etapes}</ol>
    </div>`;
  };

  // ------------------------------------------------------------ Smartphone

  /*
   * mode : 'sms' | 'whatsapp' | 'app'
   * contact, numero, avatar (fichier image, facultatif), heure
   * messages : [{ de: 'eux' | 'moi' | 'info', texte, heure }]
   * app : { titre, couleur, contenu }   (mode 'app')
   * saisie : texte dans la zone de saisie (facultatif)
   * contexte : panneau explicatif à droite du téléphone (facultatif)
   */
  C.smartphone = function (d, o) {
    const { texte, brut, echapper, initiales, image } = o;
    const mode = d.mode || 'sms';
    const avatar = d.avatar ? image(d.avatar, { classe: 'sp-avatar-img', generique: 'portrait', alt: brut(d.contact) })
      : `<span class="sp-avatar-ini">${echapper(initiales(brut(d.contact || d.numero || '?')))}</span>`;
    let ecran;
    if (mode === 'app') {
      const a = d.app || {};
      ecran = `<div class="sp-app-entete" style="background:${a.couleur || '#1f4e79'}">${texte(a.titre)}</div>
        <div class="sp-app-contenu">${texte(a.contenu)}</div>`;
    } else {
      const bulles = (d.messages || []).map(m => m.de === 'info'
        ? `<div class="sp-info">${texte(m.texte)}</div>`
        : `<div class="sp-bulle sp-${m.de === 'moi' ? 'moi' : 'eux'}">${texte(m.texte)}${m.heure ? `<span class="sp-heure">${texte(m.heure)}</span>` : ''}</div>`).join('');
      ecran = `<div class="sp-entete"><span class="sp-retour">‹</span><span class="sp-avatar">${avatar}</span>
          <span class="sp-contact"><b>${texte(d.contact || d.numero)}</b>${d.contact && d.numero ? `<small>${texte(d.numero)}</small>` : ''}</span></div>
        <div class="sp-fil">${bulles}</div>
        <div class="sp-saisie"><span>${texte(d.saisie || (mode === 'whatsapp' ? 'Message' : 'Message texte'))}</span><span class="sp-envoi">➤</span></div>`;
    }
    return `<div class="smartphone-scene${d.contexte ? '' : ' seul'}">
      <div class="sp sp-${mode}">
        <div class="sp-statut"><span>${texte(d.heure || '10:24')}</span><span class="sp-encoche"></span><span>▂▄▆ 🔋</span></div>
        <div class="sp-ecran">${ecran}</div>
      </div>
      ${d.contexte ? `<div class="sp-contexte">${texte(d.contexte)}</div>` : ''}
    </div>`;
  };

  // ------------------------------------------------------------ Navigateur

  /*
   * onglet, url (indice possible), securise (cadenas, vrai par défaut),
   * page : HTML de la page (classes utilitaires site-*), barreEtat : URL affichée au survol
   */
  C.navigateur = function (d, o) {
    const { texte } = o;
    return `<div class="nav">
      <div class="nav-onglets"><span class="nav-onglet actif">${texte(d.onglet || 'Nouvel onglet')}<i>✕</i></span><span class="nav-plus">＋</span></div>
      <div class="nav-barre"><span class="nav-fleches">← → ⟳</span>
        <span class="nav-url"><span class="nav-cadenas">${d.securise === false ? '⚠' : '🔒'}</span>${texte(d.url)}</span>
        <span class="nav-menu">⋮</span></div>
      <div class="nav-page">${texte(d.page)}</div>
      ${d.barreEtat ? `<div class="barre-etat">${texte(d.barreEtat)}</div>` : ''}
    </div>`;
  };

  // ------------------------------------------------------------ Visio

  /*
   * titre, duree, participants : [{ nom, image, etat: 'normal'|'fige'|'degrade', parle, indice }]
   * chat : [{ de, texte }], bandeau : message d'état (indice possible), contexte (facultatif)
   */
  C.visio = function (d, o) {
    const { texte, brut, image } = o;
    const tuiles = (d.participants || []).map(p => `
      <div class="vi-tuile vi-${p.etat || 'normal'}${p.parle ? ' parle' : ''}${p.indice ? ' indice' : ''}"${p.indice ? ` data-indice="${p.indice}"` : ''}>
        ${image(p.image || 'participant-generique.png', { classe: 'vi-img', generique: 'portrait', alt: brut(p.nom) })}
        ${p.etat === 'fige' ? '<span class="vi-fige">⏸ Connexion instable</span>' : ''}
        <span class="vi-nom">${p.parle ? '🔊 ' : ''}${texte(p.nom)}</span>
      </div>`).join('');
    const chat = (d.chat || []).map(m => `<div class="vi-msg"><b>${texte(m.de)}</b><p>${texte(m.texte)}</p></div>`).join('');
    return `<div class="visio">
      <div class="vi-haut"><span class="vi-titre">${texte(d.titre)}</span><span class="vi-duree">● ${texte(d.duree || '12:41')}</span></div>
      <div class="vi-corps">
        <div class="vi-grille n${(d.participants || []).length}">${tuiles}</div>
        <aside class="vi-chat"><div class="vi-chat-titre">Conversation</div>${chat}<div class="vi-chat-saisie">Envoyer un message…</div></aside>
      </div>
      ${d.bandeau ? `<div class="vi-bandeau">${texte(d.bandeau)}</div>` : ''}
      <div class="vi-bas"><span>🎤</span><span>📷</span><span>🖥</span><span>💬</span><span class="vi-quitter">Quitter</span></div>
    </div>`;
  };

  // ------------------------------------------------------------ Explorateur de fichiers

  const ICONE_FICHIER = { dossier: '📁', xlsx: '📊', docx: '📄', pdf: '📕', exe: '⚙', lnk: '🔗', txt: '📄' };

  /*
   * titre, chemin, raccourcis (colonne de gauche), fichiers : [{ nom, type, taille, date, selectionne }]
   * copie : { titre, progression (0-100), detail }, terminal : { titre, lignes: [] },
   * curseur : { x, y } (position dans la fenêtre, px), contexte
   */
  C.explorateur = function (d, o) {
    const { texte } = o;
    const lignes = (d.fichiers || []).map(f => `
      <div class="ex-ligne${f.selectionne ? ' selectionne' : ''}">
        <span class="ex-nom"><span class="ex-icone">${ICONE_FICHIER[f.type] || '📄'}</span>${texte(f.nom)}</span>
        <span>${texte(f.date || '')}</span><span>${texte(f.libelleType || (f.type === 'dossier' ? 'Dossier de fichiers' : (f.type || '').toUpperCase()))}</span><span>${texte(f.taille || '')}</span>
      </div>`).join('');
    const rac = (d.raccourcis || ['Accès rapide', 'Bureau', 'Documents', 'Ce PC', 'Réseau']).map(r => `<div>${texte(r)}</div>`).join('');
    return `<div class="explorateur">
      <div class="ex-fenetre">
        <div class="ex-titre"><span>📁 ${texte(d.titre || 'Explorateur de fichiers')}</span><span class="ex-btns">─ ☐ ✕</span></div>
        <div class="ex-chemin"><span>← → ↑</span><span class="ex-adresse">${texte(d.chemin)}</span></div>
        <div class="ex-corps">
          <nav class="ex-gauche">${rac}</nav>
          <div class="ex-liste"><div class="ex-ligne ex-entete"><span>Nom</span><span>Modifié le</span><span>Type</span><span>Taille</span></div>${lignes}</div>
        </div>
        ${d.copie ? `<div class="ex-copie"><div class="ex-copie-titre">${texte(d.copie.titre)}</div>
          <div class="ex-copie-barre"><span style="width:${d.copie.progression || 0}%"></span></div>
          <div class="ex-copie-detail">${texte(d.copie.detail || '')}</div></div>` : ''}
        ${d.terminal ? `<div class="ex-terminal"><div class="ex-terminal-titre">${texte(d.terminal.titre || 'Invite de commandes')}</div>
          <pre>${(d.terminal.lignes || []).map(l => texte(l)).join('\n')}<span class="curseur-texte">█</span></pre></div>` : ''}
        ${d.curseur ? `<div class="ex-curseur" style="left:${d.curseur.x}px;top:${d.curseur.y}px">➤</div>` : ''}
      </div>
      ${d.contexte ? `<div class="ex-contexte">${texte(d.contexte)}</div>` : ''}
    </div>`;
  };

  // ------------------------------------------------------------ Écran de rançon (fictif)

  C.rancon = function (d, o) {
    const { texte } = o;
    return `<div class="rancon">
      <div class="rancon-cadenas">🔒</div>
      <h1>${texte(d.titre)}</h1>
      <div class="rancon-texte">${texte(d.texte)}</div>
      ${d.compteur ? `<div class="rancon-compteur">${texte(d.compteur)}</div>` : ''}
      ${d.pied ? `<div class="rancon-pied">${texte(d.pied)}</div>` : ''}
    </div>`;
  };

  // ------------------------------------------------------------ Photo (scène illustrée en SVG)

  function qrFactice(x, y, taille, graine) {
    let r = graine, carres = '';
    const n = 21, c = taille / n;
    const coin = (cx, cy) => `<rect x="${x + cx * c}" y="${y + cy * c}" width="${7 * c}" height="${7 * c}" fill="#111"/>` +
      `<rect x="${x + (cx + 1) * c}" y="${y + (cy + 1) * c}" width="${5 * c}" height="${5 * c}" fill="#fff"/>` +
      `<rect x="${x + (cx + 2) * c}" y="${y + (cy + 2) * c}" width="${3 * c}" height="${3 * c}" fill="#111"/>`;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      if ((i < 8 && j < 8) || (i > 12 && j < 8) || (i < 8 && j > 12)) continue;
      r = (r * 9301 + 49297) % 233280;
      if (r / 233280 > 0.5) carres += `<rect x="${x + i * c}" y="${y + j * c}" width="${c}" height="${c}" fill="#111"/>`;
    }
    return `<rect x="${x - c}" y="${y - c}" width="${taille + 2 * c}" height="${taille + 2 * c}" fill="#fff"/>` + carres + coin(0, 0) + coin(14, 0) + coin(0, 14);
  }

  /*
   * scene : 'cle-usb' | 'horodateur'
   * zones : { nomDeZone: idIndice } – rend une zone de l'illustration cliquable comme indice
   * texteEtiquette, panneau, legende, contexte
   */
  C.photo = function (d, o) {
    const { texte, brut, echapper } = o;
    const z = nom => d.zones && d.zones[nom] ? ` class="indice" data-indice="${d.zones[nom]}"` : '';
    let svg;
    if (d.scene === 'cle-usb') {
      svg = `<svg viewBox="0 0 1400 820" class="photo-svg">
        <defs><pattern id="bitume" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#5b5f63"/><circle cx="3" cy="4" r="1.3" fill="#6d7175"/><circle cx="9" cy="9" r="1" fill="#4c5054"/></pattern></defs>
        <rect width="1400" height="820" fill="url(#bitume)"/>
        <rect x="120" y="0" width="16" height="820" fill="#e8e3c8" opacity=".85"/><rect x="1160" y="0" width="16" height="820" fill="#e8e3c8" opacity=".85"/>
        <g${z('lieu')}><rect x="900" y="40" width="440" height="120" rx="10" fill="#1f4e79"/><text x="1120" y="88" font-size="34" fill="#fff" text-anchor="middle" font-family="Arial" font-weight="700">P</text>
          <text x="1120" y="135" font-size="30" fill="#fff" text-anchor="middle" font-family="Arial">${echapper(brut(d.panneau || ''))}</text></g>
        <g transform="rotate(-14 640 460)">
          <ellipse cx="660" cy="530" rx="300" ry="40" fill="#000" opacity=".25"/>
          <rect x="440" y="400" width="140" height="90" rx="6" fill="#c9ced3" stroke="#9aa1a8" stroke-width="4"/>
          <rect x="465" y="425" width="28" height="18" fill="#7d858c"/><rect x="525" y="425" width="28" height="18" fill="#7d858c"/>
          <rect x="570" y="380" width="380" height="130" rx="26" fill="#1d2d44"/>
          <g${z('etiquette')}><rect x="610" y="398" width="300" height="94" rx="6" fill="#fff8d6" stroke="#d9c98a" stroke-width="3"/>
            <text x="760" y="440" font-size="30" fill="#b3001b" text-anchor="middle" font-family="Comic Sans MS, Arial" font-weight="700">${echapper(brut(d.texteEtiquette || ''))}</text>
            <text x="760" y="478" font-size="24" fill="#b3001b" text-anchor="middle" font-family="Comic Sans MS, Arial" font-weight="700">${echapper(brut(d.texteEtiquette2 || ''))}</text></g>
          <circle cx="935" cy="445" r="12" fill="#0b1522"/>
        </g>
      </svg>`;
    } else if (d.scene === 'horodateur') {
      svg = `<svg viewBox="0 0 1400 820" class="photo-svg">
        <rect width="1400" height="820" fill="#cfd9e2"/><rect y="640" width="1400" height="180" fill="#9aa3ab"/>
        <rect x="470" y="60" width="460" height="700" rx="30" fill="#2f6d4f"/><rect x="500" y="90" width="400" height="640" rx="20" fill="#3b8762"/>
        <rect x="540" y="120" width="320" height="120" rx="10" fill="#0f2a1e"/><text x="700" y="170" font-size="30" fill="#9ef0c2" text-anchor="middle" font-family="Consolas,monospace">STATIONNEMENT</text>
        <text x="700" y="215" font-size="26" fill="#9ef0c2" text-anchor="middle" font-family="Consolas,monospace">${echapper(brut(d.panneau || ''))}</text>
        <rect x="560" y="280" width="280" height="330" rx="10" fill="#f4f6f8"/><text x="700" y="318" font-size="24" fill="#333" text-anchor="middle" font-family="Arial">Payez par mobile</text>
        ${qrFactice(600, 340, 200, 7)}
        <g${z('autocollant')} transform="rotate(4 705 450)"><rect x="590" y="335" width="236" height="236" fill="#000" opacity=".18" transform="translate(6 8)"/>
          <rect x="586" y="330" width="236" height="236" fill="#fff" stroke="#bbb" stroke-width="3"/>${qrFactice(604, 348, 200, 31)}
          <path d="M586 330 l26 0 l-26 26 z" fill="#e8e8e8" stroke="#aaa" stroke-width="2"/></g>
        <rect x="620" y="640" width="160" height="40" rx="8" fill="#123"/>
      </svg>`;
    } else svg = '';
    return `<div class="photo${d.contexte ? '' : ' seule'}">
      <figure class="photo-cadre">${svg}${d.legende ? `<figcaption>${texte(d.legende)}</figcaption>` : ''}</figure>
      ${d.contexte ? `<div class="photo-contexte">${texte(d.contexte)}</div>` : ''}
    </div>`;
  };

  // ------------------------------------------------------------ Séquence vidéo (film du parcours 1)

  /*
   * fichier : chemin de la vidéo (relatif à simulateur/), sequence, titre,
   * description (affichée si la vidéo manque), question (affichée à l'arrêt)
   */
  C.video = function (d, o) {
    const { texte, echapper } = o;
    return `<div class="video">
      <video class="video-lecteur" src="${echapper(d.fichier)}" autoplay
        onended="this.parentNode.classList.add('fini')" onerror="this.parentNode.classList.add('absente','fini')"></video>
      <div class="video-substitut"><div class="video-num">Séquence ${d.sequence}</div>
        <p>${texte(d.description)}</p><small>Fichier attendu : ${echapper(d.fichier)}</small></div>
      <div class="video-question">❓ ${texte(d.question)}</div>
    </div>`;
  };

  // ------------------------------------------------------------ Comparaison côte à côte

  C.comparaison = function (d, o) {
    const { texte } = o;
    const carte = c => `<div class="cmp-carte cmp-${c.verdict}">
      <div class="cmp-verdict">${c.verdict === 'malveillant' ? '✗ Malveillant' : '✓ Légitime'}</div>
      <h2>${texte(c.titre)}</h2><div class="cmp-contenu">${texte(c.contenu)}</div></div>`;
    return `<div class="comparaison"><h1>${texte(d.titre)}</h1><div class="cmp-cartes">${carte(d.gauche)}${carte(d.droite)}</div></div>`;
  };
})();
