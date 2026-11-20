// Données de l'oral : tout est dans src/data/oral.json (thèmes, méthodes guidées, questions du QCM).
// Aucune connexion ni Claude n'est nécessaire : l'app fonctionne hors ligne, sur téléphone comme sur ordinateur.
// Chaque question : { id, theme, jury, q, opts: [{ t, ok, why }], tip? }
//  - jury: true  -> question posée par le jury ; on cherche la réponse la plus convaincante.
//  - jury: false -> question de connaissance ; une seule réponse est exacte.
import DATA from '../data/oral.json';

export const THEMES = DATA.themes;
export const QUESTIONS = DATA.questions;
export const METHODES = DATA.methodes;
export const MAJ = DATA.maj;

const BY_ID = Object.fromEntries(QUESTIONS.map((q) => [q.id, q]));
export const questionById = (id) => BY_ID[id];

// Les applications d'IA ne sont disponibles que lorsque la page est ouverte comme artifact sur claude.ai.
export const HAS_CLAUDE = typeof window !== 'undefined' && !!(window.claude && window.claude.use);
