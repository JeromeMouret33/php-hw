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
 *   smartphone (SMS/WhatsApp)  à faire (parcours 3, 8, 9, 10, 11)
 *   navigateur ............... à faire (parcours 5, 8, 9)
 *   visio .................... à faire (parcours 4)
 *   explorateur .............. à faire (parcours 1, 6)
 * Écran moteur complémentaire :
 *   chronologie (conséquences) FAIT
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
          <div class="ml-entete">${texte(d.dossier || 'Boîte de réception')}</div>
          ${liste}
        </section>
        <section class="mail-lecture${d.apercu ? ' avec-apercu' : ''}">
          <article class="mail-message">
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
            <div class="mail-texte">${texte(m.corps)}</div>
          </article>
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

  C.chronologie = function (d, o) {
    const { texte } = o;
    const etapes = (d.etapes || []).map(e => `
      <li class="chrono-etape${e.alerte ? ' alerte' : ''}">
        <span class="chrono-quand">${texte(e.quand)}</span>
        <div class="chrono-contenu">${e.titre ? `<h3>${texte(e.titre)}</h3>` : ''}<p>${texte(e.texte)}</p></div>
      </li>`).join('');
    return `<div class="chronologie">
      <h1>${texte(d.titre)}</h1>
      <ol class="chrono-liste">${etapes}</ol>
    </div>`;
  };
})();
