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
 *   4. capture chaque écran en 1920×1080 (brut, puis indices révélés) dans captures/.
 *
 * Usage : node outils/verifier.js [--sans-captures] [--parcours 2]
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

const problemes = [];
const signaler = (ou, msg) => { problemes.push(`[${ou}] ${msg}`); };

function aretes(e) {
  if (!e) return [];
  if (e.type === 'vote') return [...e.options.map((o, i) => ({ via: `option ${i + 1}`, cible: o.suivant })), { via: 'voir la suite quand même', cible: e.suiteQuandMeme }];
  if (e.type === 'bienvu') return [{ via: 'et si on avait continué', cible: e.suite }, { via: 'passer au débrief', cible: 'debrief' }];
  return e.suivant ? [{ via: 'suite', cible: e.suivant }] : [];
}

function controleStructure(p) {
  const ou = `parcours ${p.numero}`;
  const ids = Object.keys(p.ecrans);
  if (!p.ecrans[p.debut]) signaler(ou, `écran de début « ${p.debut} » introuvable`);
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
  const vus = new Set([p.debut]);
  const file = [p.debut];
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
}

function cheminsComplets(p) {
  const res = [];
  (function dfs(id, chemin, vus) {
    if (id === 'debrief') { res.push(chemin); return; }
    if (vus.has(id) || chemin.length > 40) return;
    const as = aretes(p.ecrans[id]);
    for (const a of as) dfs(a.cible, chemin.concat({ depuis: id, via: a.via, cible: a.cible }), new Set([...vus, id]));
  })(p.debut, [], new Set());
  return res;
}

async function main() {
  const navigateur = await chromium.launch();
  const page = await navigateur.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const erreursConsole = [];
  // une image absente du dossier images/ est prévue (visuel générique) : ce n'est pas une erreur
  page.on('console', m => { if (m.type() === 'error' && !/\/images\//.test((m.location() || {}).url || '')) erreursConsole.push(m.text()); });
  page.on('pageerror', e => erreursConsole.push(e.message));
  page.on('request', r => { if (!r.url().startsWith('file:') && !r.url().startsWith('data:')) signaler('réseau', `requête externe interdite : ${r.url()}`); });

  await page.goto(URL);
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
  await capture('00-conclusion');

  const parcours = await page.evaluate(() => SIMU.parcours.map(p => JSON.parse(JSON.stringify(p))));
  let nbChemins = 0, nbEcrans = 0;

  for (const p of parcours) {
    if (SEUL && p.numero !== SEUL) continue;
    const nn = String(p.numero).padStart(2, '0');
    controleStructure(p);

    // --- Chaque écran : rendu, indices, boutons, flèche →, capture
    for (const id of Object.keys(p.ecrans).concat('debrief')) {
      const ou = `parcours ${p.numero} / ${id}`;
      const e = p.ecrans[id] || { type: 'debrief' };
      const ouvrir = async () => {
        await page.evaluate(([n, i]) => { SIMU.demarrer(n); if (i !== SIMU.etat.ecranId) SIMU.aller(i); }, [p.numero, id]);
      };
      await ouvrir();
      nbEcrans++;
      await verifierRendu(ou);
      if (e.motsCles) await page.waitForTimeout(1300 + e.motsCles.length * 900);
      await capture(`${nn}-${id}`);

      // indices : chaque élément cliquable doit afficher une étiquette
      const indices = Object.keys(e.indices || {});
      for (const ind of indices) {
        const el = page.locator(`#ecran [data-indice="${ind}"]`).first();
        if (!(await el.count())) { signaler(ou, `indice « ${ind} » absent de l'écran`); continue; }
        await el.click();
        const ok = await page.locator(`#couche-etiquettes [data-pour="${ind}"]`).count();
        if (!ok) signaler(ou, `indice « ${ind} » : pas d'étiquette après le clic`);
      }
      if (indices.length) { await page.waitForTimeout(400); await capture(`${nn}-${id}-indices`); }

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
      const attendu = e.type === 'vote' ? e.suiteQuandMeme : e.type === 'bienvu' ? e.suite : e.suivant;
      if (e.type !== 'debrief') {
        await ouvrir();
        await page.keyboard.press('ArrowRight');
        const apres = await ecranActuel();
        if (apres !== attendu) signaler(ou, `flèche → : attendu « ${attendu} », obtenu « ${apres} »`);
      }
    }

    // --- Tous les chemins complets, joués au clic, du début au débrief
    const chemins = cheminsComplets(p);
    for (const [k, chemin] of chemins.entries()) {
      nbChemins++;
      const ou = `parcours ${p.numero} / chemin ${k + 1} (${chemin.map(c => c.cible).join(' → ')})`;
      await page.evaluate(n => SIMU.demarrer(n), p.numero);
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
      if (k === 0 || k === chemins.length - 1) await capture(`${nn}-debrief-chemin${k + 1}`);
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

  console.log(`Écrans contrôlés : ${nbEcrans} · chemins complets joués : ${nbChemins}` + (SANS_CAPTURES ? '' : ` · captures : ${path.relative(RACINE, CAPTURES)}/`));
  if (problemes.length) {
    console.log(`\n✗ ${problemes.length} problème(s) :`);
    problemes.forEach(p => console.log('  - ' + p));
    process.exit(1);
  }
  console.log('✓ Aucun problème détecté.');
}

main().catch(e => { console.error(e); process.exit(2); });
