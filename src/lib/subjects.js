// Sujets de rédaction sanitaire et sociale (textes rédigés pour l'entraînement).
// La liste est dans src/data/sujets.json : { id, theme, title, doc, qs }.
// doc: null pour un sujet de réflexion sans texte.
// Pour ajouter un sujet : ajoute-le dans sujets.json ET ajoute ses QCM dans qcm-redaction.json, sous le même id.
import SUJETS from '../data/sujets.json';

export const SUBJ = SUJETS;
