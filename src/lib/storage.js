// Progression enregistrée dans le navigateur (localStorage).
// Elle reste sur cet appareil et ce navigateur uniquement.

const KEY = 'ifsi-ecrit-v1';

export const store = { cat: {}, oral: {}, hist: [], draft: null };

try {
  const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
  if (saved) Object.assign(store, saved);
} catch {
  // stockage indisponible : l'app fonctionne quand même, sans mémoire
}

export function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    /* ignoré */
  }
}

// Compte une réponse juste ou fausse pour un thème de calcul.
export function stat(cat, ok) {
  const c = store.cat[cat] || (store.cat[cat] = { ok: 0, n: 0 });
  c.n++;
  if (ok) c.ok++;
  save();
}

// Compte une réponse juste ou fausse pour un thème du QCM de l'oral.
export function statOral(theme, ok) {
  if (!store.oral) store.oral = {};
  const c = store.oral[theme] || (store.oral[theme] = { ok: 0, n: 0 });
  c.n++;
  if (ok) c.ok++;
  save();
}

// Ajoute une séance à l'historique (30 dernières gardées). Renvoie l'entrée créée.
export function addHist(entry) {
  const e = { d: new Date().toISOString(), ...entry };
  store.hist.unshift(e);
  store.hist = store.hist.slice(0, 30);
  save();
  return e;
}

export function saveDraft(id, text) {
  store.draft = { id, text };
  save();
}

export function clearDraft() {
  store.draft = null;
  save();
}
