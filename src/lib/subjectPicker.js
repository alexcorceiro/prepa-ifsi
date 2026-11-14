// Choix des sujets de rédaction : au hasard, en faisant le tour de tous les sujets avant d'en revoir un.
// Chaque mode (« copies », « methode », « ecrire ») garde sa propre liste de sujets terminés,
// enregistrée dans le navigateur avec le reste de la progression.
import { SUBJ } from './subjects.js';
import { store, save } from './storage.js';
import { pick } from './format.js';

const done = (mode) => {
  if (!store.redacDone) store.redacDone = {};
  if (!Array.isArray(store.redacDone[mode])) store.redacDone[mode] = [];
  return store.redacDone[mode];
};

// Ids des sujets terminés dans ce mode (seulement ceux qui existent encore).
export function doneIds(mode) {
  return done(mode).filter((id) => SUBJ.some((s) => s.id === id));
}

// Note un sujet comme terminé dans ce mode.
export function markDone(mode, id) {
  const d = done(mode);
  if (!d.includes(id)) {
    d.push(id);
    save();
  }
}

// Sujet au hasard parmi ceux pas encore terminés dans ce mode, en évitant le sujet actuel.
// Quand tous les sujets sont faits, un nouveau tour commence : renvoie { id, newRound: true }.
export function nextSubject(mode, currentId) {
  const finished = doneIds(mode);
  let pool = SUBJ.filter((s) => !finished.includes(s.id) && s.id !== currentId);
  let newRound = false;
  if (!pool.length) {
    // Tous les sujets sont faits (ou il ne reste que le sujet actuel) : on repart pour un tour.
    if (finished.length >= SUBJ.length) {
      store.redacDone[mode] = [];
      save();
      newRound = true;
    }
    pool = SUBJ.filter((s) => s.id !== currentId);
    if (!pool.length) pool = SUBJ;
  }
  return { id: pick(pool).id, newRound };
}

// Libellé d'un sujet dans la liste de choix, avec une coche s'il est déjà fait.
export function optionLabel(s, finished) {
  return `${finished.includes(s.id) ? '✓ ' : ''}${s.theme} · ${s.title}`;
}
