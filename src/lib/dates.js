// Dates clés de la sélection (document officiel ARS Île-de-France).

export const ORAL_START = new Date(2026, 10, 16); // lundi 16 novembre 2026 : premiers entretiens
export const ORAL_END = new Date(2027, 0, 8); // vendredi 8 janvier 2027 : derniers entretiens
export const EXAM_DATE = new Date(2026, 11, 9, 13, 30); // mercredi 9 décembre 2026, 13h30 : épreuve écrite

// Nombre de jours du calendrier entre aujourd'hui et la date (0 = aujourd'hui, négatif = passée).
// On compare des dates sans heure, pour ne pas afficher J-33 au lieu de J-32 selon l'heure de la journée.
export function daysUntil(date) {
  const now = new Date();
  const a = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const b = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.round((b - a) / 864e5);
}
