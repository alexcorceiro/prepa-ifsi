// Petits outils : hasard, arrondis, affichage des nombres et des heures à la française.

export const R = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
export const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = R(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Supprime les erreurs d'arrondi des nombres à virgule (0.1 + 0.2 = 0.30000000000000004).
export const clean = (x) => Number(Number(x).toPrecision(12));

// 1250.5 -> "1 250,5"
export const f = (n) => clean(n).toLocaleString('fr-FR', { maximumFractionDigits: 3 });

export const gcd = (a, b) => (b ? gcd(b, a % b) : a);

// 875 minutes -> "14h35"
export const hm = (m) => {
  m = ((m % 1440) + 1440) % 1440;
  return Math.floor(m / 60) + 'h' + String(m % 60).padStart(2, '0');
};

// 170 minutes -> "2 h 50 min", 45 -> "45 min", 120 -> "2 h"
export const dur = (m) => {
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r ? `${h} h ${String(r).padStart(2, '0')} min` : `${h} h`;
};

export const words = (t) => (String(t || '').match(/[\p{L}\p{N}'’-]+/gu) || []).length;

export const plural = (n, word) => `${n} ${word}${n > 1 ? 's' : ''}`;
