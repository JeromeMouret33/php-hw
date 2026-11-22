#!/usr/bin/env node
/*
 * VÉRIFICATEUR DU SIMULATEUR
 * ==========================
 * Ouvre simulateur/index.html (file://, hors ligne) dans Chromium en 1920×1080 et :
 *   1. contrôle la structure de chaque parcours (cibles existantes, écrans atteignables,
 *      aucune impasse : le débrief est atteignable depuis chaque écran) ;
 *   2. joue TOUS les chemins possibles du début au débrief, en cliquant les vrais boutons
 *      (choix de vote, « Voir la suite quand même », « Et si on avait continué ? ») ;
 *   3. sur chaque écran : variables non remplacées, indices sans définition,
 *      boutons morts (le clic doit mener à l'écran annoncé), flèche → et touche R ;
 *      gestes naturels (boutons et liens cliquables des fausses interfaces) ;
 *   4. capture chaque écran en 1920×1080 (brut, puis indices révélés) dans captures/.
 *
 * Usage : node outils/verifier.js [--sans-captures] [--parcours 2] [--config nom-du-client]
 */
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const RACINE = path.resolve(__dirname, '..');
const URL = 'file://' + path.join(RACINE, 'simulateur', 'index.html');
const CAPTURES = path.join(RACINE, 'captures');
const args = process.argv.slice(2);
const SANS_CAPTURES = args.includes('--sans-captures');
const SEUL = args.includes('--parcours') ? +args[args.indexOf('--parcours') + 1] : null;
// --config nom : vérifie avec la configuration d'un client (simulateur/config/collectivite-nom.js)
const CONFIG = args.includes('--config') ? args[args.indexOf('--config') + 1] : null;

const problemes = [];
const signaler = (ou, msg) => { problemes.push(`[${ou}] ${msg}`); };

/** Une cible peut dépendre d'une option de configuration : { option, alors, sinon }. */
function deplier(via, cible) {
  if (cible && typeof cible === 'object') return [
    { via, cible: cible.alors, option: cible.option, valeur: true },
    { via, cible: cible.sinon, option: cible.option, valeur: false }];
  return [{ via, cible }];
}

function aretes(e) {
  if (!e) return [];
  if (e.type === 'vote') return [...e.options.flatMap((o, i) => deplier(`option ${i + 1}`, o.suivant)), ...deplier('voir la suite quand même', e.suiteQuandMeme)];
  if (e.type === 'bienvu') return [...deplier('et si on avait continué', e.suite), ...deplier('second bouton', e.suiteDebrief || 'debrief')];
  return e.suivant ? deplier('suite', e.suivant) : [];
}

const debuts = p => deplier('début', p.debut);

function controleStructure(p) {
  const ou = `parcours ${p.numero}`;
  const ids = Object.keys(p.ecrans);
  debuts(p).forEach(d => { if (!p.ecrans[d.cible]) signaler(ou, `écran de début « ${d.cible} » introuvable`); });
  for (const id of ids) {
    const e = p.ecrans[id];
    const as = aretes(e);
    if (!as.length) signaler(ou, `impasse : l'écran « ${id} » n'a aucune sortie`);
    for (const a of as) {
      if (!a.cible) signaler(ou, `écran « ${id} » : sortie « ${a.via} » sans cible`);
      else if (a.cible !== 'debrief' && !p.ecrans[a.cible]) signaler(ou, `écran « ${id} » : cible « ${a.cible} » introuvable`);
    }
    if (e.type === 'vote' && !e.suiteQuandMeme) signaler(ou, `vote « ${id} » sans « Voir la suite quand même » (règle d'or)`);
    if (e.type === 'vote' && !e.options.some(o => o.bon)) signaler(ou, `vote « ${id} » sans bonne réponse marquée`);
  }
  // atteignabilité
  const vus = new Set(debuts(p).map(d => d.cible));
  const file = [...vus];
  while (file.length) {
    const id = file.shift();
    for (const a of aretes(p.ecrans[id])) if (a.cible && a.cible !== 'debrief' && !vus.has(a.cible) && p.ecrans[a.cible]) { vus.add(a.cible); file.push(a.cible); }
  }
  ids.filter(id => !vus.has(id)).forEach(id => signaler(ou, `écran « ${id} » jamais atteint`));
  // chaque écran mène au débrief
  for (const id of ids) {
    const v = new Set([id]); const f = [id]; let ok = false;
    while (f.length && !ok) {
      for (const a of aretes(p.ecrans[f.shift()])) {
        if (a.cible === 'debrief') { ok = true; break; }
        if (a.cible && p.ecrans[a.cible] && !v.has(a.cible)) { v.add(a.cible); f.push(a.cible); }
      }
    }
    if (!ok) signaler(ou, `impasse : le débrief n'est pas atteignable depuis « ${id} »`);
  }
  if (!p.debrief || !p.debrief.reflexe) signaler(ou, 'débrief sans réflexe');
  // mise en situation (volet de gauche) : où, quand, texte
  if (!p.situation || !p.situation.ou || !p.situation.quand || !p.situation.texte) signaler(ou, 'mise en situation incomplète (ou, quand, texte)');
  // commentaires « Coulisses » : scénario, mode opératoire, et un commentaire par écran d'interface ou de vote
  if (!p.coulisses || !p.coulisses.scenario || !p.coulisses.modeOperatoire) signaler(ou, 'coulisses : scénario ou mode opératoire manquant');
  ids.filter(id => (p.ecrans[id].composant || p.ecrans[id].type === 'vote') && !p.ecrans[id].coulisses)
    .forEach(id => signaler(ou, `coulisses : pas de commentaire pour l'écran « ${id} »`));
}

/** Tous les chemins du début au débrief ; options = valeurs de configuration qu'ils supposent. */
function cheminsComplets(p) {
  const res = [];
  (function dfs(id, chemin, vus, options) {
    if (id === 'debrief') { res.push({ chemin, options }); return; }
    if (vus.has(id) || chemin.length > 60) return;
    for (const a of (id === '__debut__' ? debuts(p) : aretes(p.ecrans[id]))) {
      if (a.option && a.option in options && options[a.option] !== a.valeur) continue;
      const opts = a.option ? Object.assign({}, options, { [a.option]: a.valeur }) : options;
      dfs(a.cible, id === '__debut__' ? chemin : chemin.concat({ depuis: id, via: a.via, cible: a.cible }), new Set([...vus, id]), opts);
    }
  }).call(null, '__debut__', [], new Set(), {});
  return res;
}

async function main() {
  const navigateur = await chromium.launch();
  const page = await navigateur.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const erreursConsole = [];
  // une image absente du dossier images/ est prévue (visuel générique) : ce n'est pas une erreur
  page.on('console', m => { if (m.type() === 'error' && !/\/(images|videos)\//.test((m.location() || {}).url || '')) erreursConsole.push(m.text()); });
  page.on('pageerror', e => erreursConsole.push(e.message));
  page.on('request', r => { if (!r.url().startsWith('file:') && !r.url().startsWith('data:')) signaler('réseau', `requête externe interdite : ${r.url()}`); });

  await page.goto(URL + (CONFIG ? '?config=' + CONFIG : ''));
  if (CONFIG) console.log('Configuration : ' + await page.evaluate(() => CONFIG_COLLECTIVITE.variables.COLLECTIVITE));
  await page.waitForFunction(() => window.SIMU && document.querySelector('#scene').dataset.ecran === 'menu');

  if (!SANS_CAPTURES) fs.mkdirSync(CAPTURES, { recursive: true });
  const capture = async nom => { if (!SANS_CAPTURES) await page.screenshot({ path: path.join(CAPTURES, nom + '.png') }); };

  const verifierRendu = async ou => {
    const r = await page.evaluate(() => {
      const scene = document.querySelector('#scene');
      const t = scene.innerText;
      const errs = window.SIMU.erreurs.splice(0);
      return {
        erreurAffichee: !!scene.querySelector('.ecran-erreur'),
        varsBrutes: (t.match(/\{\{[^}]*\}\}/g) || []).concat(t.match(/\[\[[^\]]*\]\]/g) || []),
        manquantes: [...scene.querySelectorAll('.var-manquante')].map(e => e.textContent),
        erreurs: errs,
        // textes trop petits pour un vidéoprojecteur (hors bandeau et commandes)
        petits: [...scene.querySelectorAll('#ecran *')].filter(el => {
          if (!el.childNodes.length || ![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) return false;
          return parseFloat(getComputedStyle(el).fontSize) < 18;
        }).map(el => el.textContent.trim().slice(0, 40))
      };
    });
    if (r.erreurAffichee) signaler(ou, 'écran d\'erreur affiché');
    r.varsBrutes.forEach(v => signaler(ou, `marqueur non remplacé : ${v}`));
    r.manquantes.forEach(v => signaler(ou, `variable absente de la configuration : ${v}`));
    r.erreurs.forEach(e => signaler(ou, e));
    r.petits.forEach(t => signaler(ou, `texte < 18 px : « ${t} »`));
  };

  const ecranActuel = () => page.evaluate(() => document.querySelector('#scene').dataset.ecran);

  // Menu et conclusion
  await verifierRendu('menu');
  await capture('00-menu');
  await page.evaluate(() => SIMU.conclusion());
  await verifierRendu('conclusion');
  await page.waitForTimeout(2800); // cartes animées
  await capture('00-conclusion');

  const parcours = await page.evaluate(() => SIMU.parcours.map(p => JSON.parse(JSON.stringify(p))));
  const optionsInitiales = await page.evaluate(() => Object.assign({}, CONFIG_COLLECTIVITE.options));
  let nbChemins = 0, nbEcrans = 0, nbGestes = 0, nbSurvols = 0;

  for (const p of parcours) {
    if (SEUL && p.numero !== SEUL) continue;
    const nn = String(p.numero).padStart(2, '0');
    // les chemins joués modifient les options : on repart de celles de la configuration
    await page.evaluate(o => { CONFIG_COLLECTIVITE.options = Object.assign({}, o); }, optionsInitiales);
    controleStructure(p);

    // --- Chaque écran : rendu, indices, boutons, flèche →, capture
    for (const id of Object.keys(p.ecrans).concat('debrief')) {
      const ou = `parcours ${p.numero} / ${id}`;
      const e = p.ecrans[id] || { type: 'debrief' };
      // survoler = false : écran tel qu'il s'ouvre ; sinon on passe la souris sur un lien,
      // ce qui affiche la barre d'état (adresse du lien) s'il y en a une
      const SURVOLABLES = '#ecran .lien:not(.barre-etat *), #ecran .btn-mail, #ecran .inv-btn';
      const survol = async () => {
        if (!(await page.locator('#ecran .barre-etat').count())) return;
        await page.mouse.move(3, 3);
        await page.locator(SURVOLABLES).first().hover();
      };
      const ouvrir = async (survoler = true) => {
        await page.evaluate(([n, i]) => { SIMU.demarrer(n); if (i !== SIMU.etat.ecranId) SIMU.aller(i); }, [p.numero, id]);
        if (survoler) await survol();
      };
      await page.mouse.move(3, 3);
      await ouvrir(false);
      if (await page.locator('#ecran .barre-etat').count()) {
        // survol naturel : l'adresse du lien est masquée à l'ouverture, visible après le passage de la souris
        if (!(await page.locator(SURVOLABLES).count())) signaler(ou, 'barre d\'état sans lien ni bouton à survoler');
        if (await page.locator('#ecran .barre-etat.vue').count()) signaler(ou, 'barre d\'état visible avant tout survol');
        await ouvrir();
        if (!(await page.locator('#ecran .barre-etat.vue').count())) signaler(ou, 'barre d\'état absente après le survol du lien');
        else nbSurvols++;
        await page.waitForTimeout(300); // fin du fondu d'apparition
        await capture(`${nn}-${id}-survol`);
        await page.mouse.move(3, 3);
        await ouvrir(false);
      }
      nbEcrans++;
      await verifierRendu(ou);
      await page.waitForTimeout(e.composant === 'chronologie' || e.type === 'debrief' ? 2600 : 150); // images génériques, animations d'apparition
      // mots-clés : jamais affichés d'office ; bouton présent seulement s'il y en a
      if (await page.locator('#couche-motscles:not(.masque) .mot-cle').count()) signaler(ou, 'mots-clés affichés sans action de l\'animateur');
      const boutonMots = await page.locator('#commandes [data-cmd="motscles"]').count();
      if (!!boutonMots !== !!(e.motsCles && e.motsCles.length)) signaler(ou, `bouton Mots-clés ${boutonMots ? 'présent sans mot-clé' : 'absent alors qu\'il y a des mots-clés'}`);
      await capture(`${nn}-${id}`);

      // indices : chaque élément cliquable doit afficher une étiquette
      const indices = Object.keys(e.indices || {});
      if (indices.length) await survol();
      for (const ind of indices) {
        const el = page.locator(`#ecran [data-indice="${ind}"]`).first();
        if (!(await el.count())) { signaler(ou, `indice « ${ind} » absent de l'écran`); continue; }
        await el.click();
        const ok = await page.locator(`#couche-etiquettes [data-pour="${ind}"]`).count();
        if (!ok) signaler(ou, `indice « ${ind} » : pas d'étiquette après le clic`);
      }
      if (indices.length) { await page.waitForTimeout(400); await capture(`${nn}-${id}-indices`); }

      // touche I : tout est révélé -> I masque tout ; I à nouveau -> tout réapparaît
      if (indices.length) {
        const nbEtiquettes = () => page.locator('#couche-etiquettes .etiquette').count();
        await page.keyboard.press('i');
        if (await nbEtiquettes() !== 0) signaler(ou, 'touche I : les indices ne se masquent pas');
        await page.keyboard.press('i');
        if (await nbEtiquettes() !== indices.length) signaler(ou, `touche I : ${indices.length} étiquettes attendues après réaffichage`);
      }

      // touche S : ouvre puis referme le volet « Mise en situation » ; capture sur le 1er écran et quand le contexte évolue
      await page.keyboard.press('s');
      if (!(await page.locator('#situation.ouverte').count())) signaler(ou, 'touche S : le volet de situation ne s\'ouvre pas');
      else if (e.situation || debuts(p).some(d => d.cible === id)) { await page.waitForTimeout(450); await capture(`${nn}-${id}-situation`); }
      if (e.situation && !(await page.locator('#situation.nouveau').count())) signaler(ou, 'situation : l\'onglet ne signale pas le nouveau contexte');
      await page.keyboard.press('s');
      if (await page.locator('#situation.ouverte').count()) signaler(ou, 'touche S : le volet de situation ne se ferme pas');

      // touche C : ouvre puis referme le panneau « Coulisses » ; capture panneau ouvert
      await page.keyboard.press('c');
      if (!(await page.locator('#coulisses.ouverte').count())) signaler(ou, 'touche C : le panneau Coulisses ne s\'ouvre pas');
      else { await page.waitForTimeout(450); await capture(`${nn}-${id}-coulisses`); }
      await page.keyboard.press('c');
      if (await page.locator('#coulisses.ouverte').count()) signaler(ou, 'touche C : le panneau Coulisses ne se ferme pas');

      // touche K : masque puis réaffiche les mots-clés
      if (e.motsCles) {
        await page.keyboard.press('k');
        await page.waitForTimeout(e.motsCles.length * 450 + 400);
        if (await page.locator('#couche-motscles:not(.masque) .mot-cle').count() !== e.motsCles.length) signaler(ou, 'touche K : les mots-clés ne s\'affichent pas');
        else await capture(`${nn}-${id}-motscles`);
        await page.keyboard.press('k');
        if (!(await page.locator('#couche-motscles.masque').count())) signaler(ou, 'touche K : les mots-clés ne se masquent pas');
      }

      // gestes naturels : chaque bouton ou lien cliquable de la fausse interface mène au bon écran
      if (e.type !== 'vote' && e.type !== 'bienvu' && e.type !== 'debrief') {
        const cibleDuGeste = geste => page.evaluate(([n, i, g]) => {
          const p = SIMU.parcours.find(x => x.numero === n), ec = p.ecrans[i];
          if (g === 'suite') return SIMU.resoudre(ec.suivant);
          const v = p.ecrans[SIMU.resoudre(ec.suivant)], o = v && v.type === 'vote' && v.options[+g.split(':')[1]];
          return o ? SIMU.resoudre(o.suivant) : null;
        }, [p.numero, id, geste]);
        const verifierArrivee = async (quoi, geste) => {
          const attendue = await cibleDuGeste(geste), obtenue = await ecranActuel();
          if (!attendue) signaler(ou, `${quoi} : geste « ${geste} » sans cible valide`);
          else if (obtenue !== attendue) signaler(ou, `${quoi} : attendu « ${attendue} », obtenu « ${obtenue} »`);
          else if (geste !== 'suite') {
            // un choix joué par geste est enregistré comme un vote : R doit y revenir
            await page.keyboard.press('r');
            const v = await ecranActuel();
            if (!p.ecrans[v] || p.ecrans[v].type !== 'vote') signaler(ou, `${quoi} : R ne revient pas au vote (écran « ${v} »)`);
          }
          nbGestes++;
        };
        await ouvrir();
        const gestes = await page.$$eval('#ecran [data-geste]', els => els.map(el => el.dataset.geste));
        for (const [k, geste] of gestes.entries()) {
          await ouvrir();
          await page.locator('#ecran [data-geste]').nth(k).click();
          await verifierArrivee(`geste n° ${k + 1}`, geste);
        }
        // indices à geste : le 1er clic révèle l'indice sans changer d'écran, le 2e fait le geste
        for (const [ind, def] of Object.entries(e.indices || {})) {
          if (!def.geste) continue;
          await ouvrir();
          const el = page.locator(`#ecran [data-indice="${ind}"]`).first();
          await el.click();
          if (await ecranActuel() !== id || !(await page.locator(`#couche-etiquettes [data-pour="${ind}"]`).count()))
            signaler(ou, `indice à geste « ${ind} » : le 1er clic doit seulement révéler l'indice`);
          await el.click();
          await verifierArrivee(`indice à geste « ${ind} » (2e clic)`, def.geste);
        }
        await ouvrir();
      }

      // boutons : chaque bouton doit mener à sa cible
      const boutons = await page.$$eval('#ecran button[data-action]', bs => bs.map((b, i) => ({ i, action: b.dataset.action, cible: b.dataset.cible, texte: b.textContent.trim() })));
      for (const b of boutons) {
        if (b.action === 'plus' || b.action === 'moins') continue;
        await ouvrir();
        const avant = await ecranActuel();
        await page.locator('#ecran button[data-action]').nth(b.i).click();
        const apres = await ecranActuel();
        if (b.cible && apres !== b.cible) signaler(ou, `bouton « ${b.texte} » : attendu « ${b.cible} », obtenu « ${apres} »`);
        if (!b.cible && apres === avant) signaler(ou, `bouton mort : « ${b.texte} »`);
      }

      // compteurs de vote
      if (e.type === 'vote') {
        await ouvrir();
        await page.locator('#ecran button[data-action="plus"]').first().click();
        await page.locator('#ecran button[data-action="plus"]').first().click();
        const n = await page.locator('#ecran .vote-nombre').first().textContent();
        if (n.trim() !== '2') signaler(ou, `compteur de vote : attendu 2, obtenu ${n}`);
        await capture(`${nn}-${id}-decompte`);
      }

      // flèche → : chemin malveillant
      const attendu = await page.evaluate(c => SIMU.resoudre(c), e.type === 'vote' ? e.suiteQuandMeme : e.type === 'bienvu' ? e.suite : e.suivant || null);
      if (e.type !== 'debrief') {
        await ouvrir();
        await page.keyboard.press('ArrowRight');
        const apres = await ecranActuel();
        if (apres !== attendu) signaler(ou, `flèche → : attendu « ${attendu} », obtenu « ${apres} »`);
      }
    }

    // --- Lancement depuis le menu : la mise en situation s'ouvre d'elle-même, et se referme dès qu'on avance
    await page.evaluate(o => { CONFIG_COLLECTIVITE.options = Object.assign({}, o); SIMU.menu(); }, optionsInitiales);
    await page.locator(`.carte-parcours[data-parcours="${p.numero}"]`).click();
    const ouvertAuDepart = await page.locator('#situation.ouverte').count();
    if (!!ouvertAuDepart !== (optionsInitiales.situationAuDemarrage !== false)) signaler(`parcours ${p.numero}`, `mise en situation au lancement : ${ouvertAuDepart ? 'ouverte' : 'fermée'}, contraire à l'option situationAuDemarrage`);
    await page.keyboard.press('ArrowRight');
    if (await page.locator('#situation.ouverte').count()) signaler(`parcours ${p.numero}`, 'mise en situation encore ouverte après avoir avancé');

    // --- Tous les chemins complets, joués au clic, du début au débrief
    const chemins = cheminsComplets(p);
    for (const [k, { chemin, options }] of chemins.entries()) {
      nbChemins++;
      const ou = `parcours ${p.numero} / chemin ${k + 1} (${chemin.map(c => c.cible).join(' → ')})`;
      await page.evaluate(([n, opts]) => {
        const c = window.CONFIG_COLLECTIVITE; c.options = Object.assign({}, c.options, opts);
        SIMU.demarrer(n);
      }, [p.numero, options]);
      let voteVu = false;
      for (const pas of chemin) {
        const e = p.ecrans[pas.depuis];
        if (e.type === 'vote') {
          voteVu = true;
          if (pas.via.startsWith('option')) await page.locator('#ecran button[data-action="choisir"]').nth(+pas.via.split(' ')[1] - 1).click();
          else await page.locator('#ecran button[data-action="quandmeme"]').click();
        } else if (e.type === 'bienvu') {
          await page.locator(`#ecran button[data-cible="${pas.cible}"]`).click();
        } else {
          await page.keyboard.press('ArrowRight');
        }
        const ici = await ecranActuel();
        if (ici !== pas.cible) { signaler(ou, `après « ${pas.via} » depuis « ${pas.depuis} » : attendu « ${pas.cible} », obtenu « ${ici} »`); break; }
      }
      if (await ecranActuel() !== 'debrief') signaler(ou, 'le chemin ne se termine pas sur le débrief');
      await verifierRendu(ou);
      if (k === 0 || k === chemins.length - 1) { await page.waitForTimeout(2200); await capture(`${nn}-debrief-chemin${k + 1}`); }
      // touche R : retour au dernier vote
      if (voteVu) {
        await page.keyboard.press('r');
        const ici = await ecranActuel();
        if (!p.ecrans[ici] || p.ecrans[ici].type !== 'vote') signaler(ou, `touche R : attendu un vote, obtenu « ${ici} »`);
      }
    }
  }

  erreursConsole.forEach(e => signaler('console', e));
  await navigateur.close();

  console.log(`Écrans contrôlés : ${nbEcrans} · chemins complets joués : ${nbChemins} · gestes naturels : ${nbGestes} · survols : ${nbSurvols}` + (SANS_CAPTURES ? '' : ` · captures : ${path.relative(RACINE, CAPTURES)}/`));
  if (problemes.length) {
    console.log(`\n✗ ${problemes.length} problème(s) :`);
    problemes.forEach(p => console.log('  - ' + p));
    process.exit(1);
  }
  console.log('✓ Aucun problème détecté.');
}

main().catch(e => { console.error(e); process.exit(2); });
